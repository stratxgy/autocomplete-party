const PLAYER_COLORS = ['#FF6B6B','#4ECDC4','#FFE66D','#A8E6CF','#DDA0DD','#87CEEB','#F0A500','#98FB98'];
const POINTS_PER_ANSWER = [500, 400, 300, 200, 100];
const WRONG_PENALTY = 50;

let peer = null;
let connections = {};
let players = {};
let gameState = {
  phase: 'lobby',
  questions: [],
  currentQ: 0,
  revealed: [],
  lettersShown: 0,
  roundActive: false,
  readyVotes: new Set()
};


function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:4}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
}

function initHost() {
  const code = generateCode();
  const hostPeerId = 'acparty-' + code.toLowerCase();
  peer = new Peer(hostPeerId, {
    debug: 0,
    host: 'autocomplete-peerserver.onrender.com',
    port: 443,
    path: '/',
    secure: true
  });

  peer.on('open', () => {
    document.getElementById('lobby-code').textContent = code;
    const base = location.href.replace('index.html','').replace(/\/$/, '');
    const joinUrl = `${base}/join.html?code=${code}`;
    try {
      new QRCode(document.getElementById('qr-code'), {
        text: joinUrl, width: 120, height: 120,
        colorDark: '#0a0a0a', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch(e) {}
  });

  peer.on('connection', conn => {
    conn.on('open', () => { connections[conn.peer] = conn; });
    conn.on('data', data => handlePlayerMessage(conn.peer, data));
    conn.on('close', () => handlePlayerDisconnect(conn.peer));
    conn.on('error', () => handlePlayerDisconnect(conn.peer));
  });

  peer.on('error', err => {
    if (err.type === 'unavailable-id') { peer.destroy(); initHost(); return; }
    console.error('Peer error:', err);
    const el = document.getElementById('lobby-code');
    if (el) el.textContent = 'ERR: ' + err.type;
  });
}

function sendTo(peerId, msg) {
  if (connections[peerId]) try { connections[peerId].send(msg); } catch(e) {}
}

function broadcastToAll(msg) {
  Object.keys(connections).forEach(pid => sendTo(pid, msg));
}

function handlePlayerMessage(peerId, data) {
  const { type, payload } = data;

  if (type === 'register') {
    const colorIdx = Object.keys(players).length % PLAYER_COLORS.length;
    players[peerId] = {
      id: peerId,
      name: payload.name.slice(0, 16),
      score: 0,
      color: PLAYER_COLORS[colorIdx],
      guesses: [],
      foundAnswers: new Set()
    };
    broadcastToAll({ type: 'playerList', payload: getPlayerList() });
    renderLobbyPlayers();
    updateStartButton();
    sendTo(peerId, { type: 'registered', payload: { color: players[peerId].color, name: players[peerId].name } });
    return;
  }

  if (type === 'guess') {
    if (gameState.phase !== 'round' || !gameState.roundActive) return;
    processGuess(peerId, payload.guess);
    return;
  }

  if (type === 'ready') {
    if (gameState.phase !== 'roundEnd') return;
    gameState.readyVotes.add(peerId);
    broadcastReadyState();
    checkAllReady();
    return;
  }
}

function handlePlayerDisconnect(peerId) {
  delete connections[peerId];
  delete players[peerId];
  gameState.readyVotes.delete(peerId);
  broadcastToAll({ type: 'playerList', payload: getPlayerList() });
  renderLobbyPlayers();
  updateStartButton();
  if (gameState.phase === 'roundEnd') {
    broadcastReadyState();
    checkAllReady();
  }
}

function getPlayerList() {
  return Object.values(players).map(p => ({ name: p.name, score: p.score, color: p.color }));
}

function renderLobbyPlayers() {
  const list = document.getElementById('lobby-player-list');
  const pArr = Object.values(players);
  if (pArr.length === 0) {
    list.innerHTML = '<div class="waiting-text">Waiting for players...</div>';
    return;
  }
  list.innerHTML = pArr.map(p => `
    <div class="lobby-player-chip">
      <div class="lpc-dot" style="background:${p.color}"></div>
      ${escHtml(p.name)}
    </div>
  `).join('');
}

function updateStartButton() {
  const btn = document.getElementById('btn-start');
  const count = Object.keys(players).length;
  btn.disabled = count < 2;
  btn.textContent = count >= 2 ? `Start Game (${count} players)` : 'Start Game';
}

function hostStartGame() {
  gameState.questions = getGameQuestions(5);
  gameState.currentQ = 0;
  Object.values(players).forEach(p => { p.score = 0; p.guesses = []; p.foundAnswers = new Set(); });
  showScreen('screen-game');
  startRound();
}

function startRound() {
  const q = gameState.questions[gameState.currentQ];
  gameState.revealed = new Array(5).fill(false);
  gameState.lettersShown = 0;
  gameState.roundActive = true;
  gameState.phase = 'round';
  gameState.readyVotes = new Set();

  Object.values(players).forEach(p => { p.guesses = []; p.foundAnswers = new Set(); });

  document.getElementById('round-indicator').textContent =
    `Round ${gameState.currentQ + 1} / ${gameState.questions.length}`;
  document.getElementById('search-keyword').textContent = q.keyword;
  document.getElementById('wrong-counter').textContent = '';

  
  const old = document.getElementById('ready-overlay');
  if (old) old.remove();

  renderAnswersGrid();
  renderScoresMini();

  broadcastToAll({
    type: 'roundStart',
    payload: {
      keyword: q.keyword,
      round: gameState.currentQ + 1,
      total: gameState.questions.length,
      totalAnswers: 5
    }
  });
}

function processGuess(peerId, guess) {
  const p = players[peerId];
  if (!p) return;

  const q = gameState.questions[gameState.currentQ];
  const norm = normalize(guess);

  if (p.guesses.includes(norm)) {
    sendTo(peerId, { type: 'guessFeedback', payload: { guess, result: 'duplicate' } });
    return;
  }
  p.guesses.push(norm);

  
  const matchIdx = q.answers.findIndex(a =>
    normalize(a) === norm ||
    normalize(a.slice(q.keyword.length).trim()) === norm
  );

  if (matchIdx !== -1 && !gameState.revealed[matchIdx]) {
    
    gameState.revealed[matchIdx] = true;
    const pts = POINTS_PER_ANSWER[matchIdx];
    p.score += pts;
    p.foundAnswers.add(matchIdx);

    sendTo(peerId, { type: 'guessFeedback', payload: { guess, result: 'correct', points: pts, answerIndex: matchIdx } });
    broadcastToAll({ type: 'answerRevealed', payload: {
      index: matchIdx,
      answer: q.answers[matchIdx],
      foundBy: p.name,
      foundByColor: p.color,
      points: pts
    }});

    renderAnswersGrid();
    renderScoresMini();
    broadcastToAll({ type: 'scoreUpdate', payload: getPlayerList() });

    if (gameState.revealed.every(Boolean)) {
      endRound();
    }

  } else {
    
    const penalty = Math.min(WRONG_PENALTY, p.score);
    p.score = Math.max(0, p.score - penalty);
    gameState.lettersShown++;

    sendTo(peerId, { type: 'guessFeedback', payload: { guess, result: 'wrong', penalty } });
    broadcastToAll({ type: 'wrongGuess', payload: {
      guesserName: p.name,
      guesserColor: p.color,
      penalty,
      lettersShown: gameState.lettersShown
    }});
    broadcastToAll({ type: 'scoreUpdate', payload: getPlayerList() });

    renderAnswersGrid();
    renderScoresMini();

    document.getElementById('wrong-counter').textContent =
      `${gameState.lettersShown} wrong guess${gameState.lettersShown !== 1 ? 'es' : ''} — ${gameState.lettersShown} letter${gameState.lettersShown !== 1 ? 's' : ''} revealed`;
  }
}

function endRound() {
  gameState.roundActive = false;
  gameState.phase = 'roundEnd';
  gameState.readyVotes = new Set();

  
  gameState.revealed = new Array(5).fill(true);
  renderAnswersGrid();

  const q = gameState.questions[gameState.currentQ];
  broadcastToAll({ type: 'roundEnd', payload: {
    answers: q.answers,
    scores: getPlayerList(),
    totalPlayers: Object.keys(players).length
  }});

  renderReadyOverlay();
}

function broadcastReadyState() {
  const total = Object.keys(players).length;
  const readyNames = [...gameState.readyVotes].map(id => players[id]?.name).filter(Boolean);
  broadcastToAll({ type: 'readyUpdate', payload: {
    readyCount: gameState.readyVotes.size,
    totalPlayers: total,
    readyNames
  }});
  renderReadyOverlay();
}

function checkAllReady() {
  const total = Object.keys(players).length;
  if (total > 0 && gameState.readyVotes.size >= total) {
    setTimeout(() => advanceRound(), 800); 
  }
}

function advanceRound() {
  gameState.currentQ++;
  if (gameState.currentQ >= gameState.questions.length) {
    showResults();
  } else {
    const overlay = document.getElementById('ready-overlay');
    if (overlay) overlay.remove();
    showScreen('screen-game');
    startRound();
  }
}

function renderReadyOverlay() {
  let overlay = document.getElementById('ready-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'ready-overlay';
    overlay.className = 'ready-overlay';
    document.getElementById('screen-game').appendChild(overlay);
  }

  const ready = gameState.readyVotes.size;
  const total = Object.keys(players).length;
  const pct = total > 0 ? (ready / total) * 100 : 0;
  const allReady = ready >= total && total > 0;

  overlay.innerHTML = `
    <div class="ready-box">
      <div class="ready-title">${allReady ? 'Everyone\'s ready!' : 'Round Over!'}</div>
      <div class="ready-count">${ready} / ${total} ready to continue</div>
      <div class="ready-bar-wrap">
        <div class="ready-bar" style="width:${pct}%"></div>
      </div>
      <div class="ready-players">
        ${Object.values(players).map(p => {
          const isReady = gameState.readyVotes.has(p.id);
          return `<div class="ready-chip ${isReady ? 'is-ready' : ''}" style="border-color:${p.color}50;color:${isReady ? p.color : 'var(--text2)'}">
            ${isReady ? '✓' : '⏳'} ${escHtml(p.name)}
          </div>`;
        }).join('')}
      </div>
      ${allReady ? '<div class="ready-advancing">Moving on...</div>' : '<div class="ready-hint">Waiting for players to tap Ready on their phones</div>'}
    </div>
  `;
}

function showResults() {
  const overlay = document.getElementById('ready-overlay');
  if (overlay) overlay.remove();
  showScreen('screen-results');

  const sorted = Object.values(players).sort((a,b) => b.score - a.score);
  broadcastToAll({ type: 'gameOver', payload: { scores: sorted.map(p => ({ name: p.name, score: p.score, color: p.color })) }});

  const medals = ['🥇','🥈','🥉'];
  document.getElementById('podium').innerHTML = sorted.slice(0,3).map((p,i) => `
    <div class="podium-slot">
      <div class="podium-medal">${medals[i] || ''}</div>
      <div class="podium-name" style="color:${p.color}">${escHtml(p.name)}</div>
      <div class="podium-score">${p.score.toLocaleString()}</div>
      <div class="podium-bar" style="background:${p.color};height:${120 - i*30}px"></div>
    </div>
  `).join('');

  document.getElementById('results-list').innerHTML = sorted.slice(3).map((p,i) => `
    <div class="result-row-final">
      <span class="result-pos">${i+4}</span>
      <span class="result-name" style="color:${p.color}">${escHtml(p.name)}</span>
      <span class="result-pts">${p.score.toLocaleString()} pts</span>
    </div>
  `).join('');
}

function renderAnswersGrid() {
  const q = gameState.questions[gameState.currentQ];
  const grid = document.getElementById('answers-grid');
  grid.innerHTML = q.answers.map((ans, i) => {
    const isRevealed = gameState.revealed[i];
    const finder = Object.values(players).find(p => p.foundAnswers.has(i));

    if (isRevealed) {
      return `<div class="answer-card revealed">
        <div class="answer-rank">${i+1}</div>
        <div class="answer-text">${escHtml(ans)}</div>
        ${finder
          ? `<div class="answer-badge" style="background:${finder.color}20;color:${finder.color};border-color:${finder.color}40">${escHtml(finder.name)}</div>`
          : '<div class="answer-badge answer-badge-skip">no one</div>'}
      </div>`;
    }

    const suffix = ans.slice(q.keyword.length).trim();
    const shown = suffix.slice(0, gameState.lettersShown);
    const hidden = suffix.slice(gameState.lettersShown);
    const hiddenBlanks = hidden.split('').map(ch =>
      ch === ' ' ? '<span class="blank-space"></span>' : '<span class="blank-char"></span>'
    ).join('');

    return `<div class="answer-card hidden">
      <div class="answer-rank">${i+1}</div>
      <div class="answer-blanks">
        ${escHtml(q.keyword)}${shown ? `<span class="hint-letters"> ${escHtml(shown)}</span>` : ' '}${hiddenBlanks}
      </div>
    </div>`;
  }).join('');
}

function renderScoresMini() {
  const el = document.getElementById('scores-mini');
  const sorted = Object.values(players).sort((a,b) => b.score - a.score);
  el.innerHTML = sorted.map(p => `
    <div class="score-chip">
      <div class="score-dot" style="background:${p.color}"></div>
      <span>${escHtml(p.name)}</span>
      <strong>${p.score.toLocaleString()}</strong>
    </div>
  `).join('');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function normalize(s) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
initHost();
