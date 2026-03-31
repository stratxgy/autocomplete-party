let peer = null;
let hostConn = null;
let playerName = '';
let playerColor = '#4ECDC4';
let currentKeyword = '';
let myScore = 0;
let myGuesses = [];
let foundCount = 0;
let totalAnswers = 5;
let hasVotedReady = false;
let resolvedHostId = null;

window.addEventListener('load', () => {
  const params = new URLSearchParams(location.search);
  const hostid = params.get('hostid');
  const code = params.get('code');

  if (hostid) {
    resolvedHostId = decodeURIComponent(hostid);
    const inp = document.getElementById('input-code');
    if (inp) {
      inp.value = resolvedHostId.slice(-4).toUpperCase();
      inp.readOnly = true;
      inp.style.opacity = '0.5';
    }
    setTimeout(() => document.getElementById('input-name').focus(), 100);
  } else if (code) {
    const inp = document.getElementById('input-code');
    if (inp) inp.value = code.toUpperCase().slice(0, 4);
    setTimeout(() => document.getElementById('input-name').focus(), 100);
  }

  document.getElementById('input-code').addEventListener('input', e => {
    e.target.value = e.target.value.toUpperCase().slice(0, 4);
  });
  document.getElementById('input-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') joinGame();
  });

  const gi = document.getElementById('p-guess-input');
  if (gi) gi.addEventListener('keydown', e => { if (e.key === 'Enter') submitGuess(); });
});

function joinGame() {
  const name = document.getElementById('input-name').value.trim();
  const codeInput = document.getElementById('input-code').value.trim().toUpperCase();
  const errEl = document.getElementById('join-error');

  if (!name) { errEl.textContent = 'Enter your name'; return; }

  if (!resolvedHostId) {
    if (codeInput.length !== 4) { errEl.textContent = 'Enter the 4-letter room code'; return; }
    resolvedHostId = 'acparty-' + codeInput.toLowerCase();
  }

  playerName = name;
  errEl.textContent = '';
  showScreen('screen-connecting');

  peer = new Peer({ debug: 0 });

  peer.on('open', () => {
    hostConn = peer.connect(resolvedHostId, { reliable: true });

    let connected = false;
    const timeout = setTimeout(() => {
      if (!connected) {
        peer.destroy();
        showScreen('screen-join');
        document.getElementById('join-error').textContent = 'Room not found. Make sure the host screen is open.';
      }
    }, 8000);

    hostConn.on('open', () => {
      connected = true;
      clearTimeout(timeout);
      hostConn.send({ type: 'register', payload: { name: playerName } });
    });

    hostConn.on('data', data => handleHostMessage(data));

    hostConn.on('close', () => {
      showScreen('screen-join');
      document.getElementById('join-error').textContent = 'Disconnected from host.';
    });

    hostConn.on('error', () => {
      if (!connected) {
        clearTimeout(timeout);
        showScreen('screen-join');
        document.getElementById('join-error').textContent = 'Room not found. Make sure the host screen is open.';
      }
    });
  });

  peer.on('error', () => {
    showScreen('screen-join');
    document.getElementById('join-error').textContent = 'Connection failed. Try again.';
  });
}

function handleHostMessage(data) {
  const { type, payload } = data;

  switch (type) {
    case 'registered':
      playerColor = payload.color;
      showWaiting(payload.name);
      break;

    case 'playerList':
      updateWaitingPlayerList(payload);
      break;

    case 'roundStart':
      startRound(payload);
      break;

    case 'guessFeedback':
      handleGuessFeedback(payload);
      break;

    case 'answerRevealed':
      handleAnswerRevealed(payload);
      break;

    case 'wrongGuess':
      handleWrongGuess(payload);
      break;

    case 'scoreUpdate':
      handleScoreUpdate(payload);
      break;

    case 'roundEnd':
      handleRoundEnd(payload);
      break;

    case 'readyUpdate':
      handleReadyUpdate(payload);
      break;

    case 'gameOver':
      handleGameOver(payload);
      break;
  }
}

function showWaiting(name) {
  showScreen('screen-waiting');
  const av = document.getElementById('p-avatar');
  av.textContent = name.slice(0, 2).toUpperCase();
  av.style.background = playerColor + '25';
  av.style.color = playerColor;
  av.style.borderColor = playerColor + '60';
  document.getElementById('p-display-name').textContent = name;
}

function updateWaitingPlayerList(players) {
  const el = document.getElementById('p-players-joined');
  if (!el) return;
  el.innerHTML = players.map(p =>
    `<span class="pchip" style="color:${p.color};border-color:${p.color}40;background:${p.color}15">${escHtml(p.name)}</span>`
  ).join('');
}

function startRound({ keyword, round, total, totalAnswers: ta }) {
  currentKeyword = keyword;
  totalAnswers = ta;
  myGuesses = [];
  foundCount = 0;
  hasVotedReady = false;

  document.getElementById('p-round-label').textContent = `Round ${round} / ${total}`;
  document.getElementById('p-score-display').textContent = `${myScore} pts`;
  document.getElementById('p-keyword').textContent = keyword + '...';
  document.getElementById('p-guesses-list').innerHTML = '';
  document.getElementById('p-hint-strip').textContent = '';
  document.getElementById('p-hint-strip').style.display = 'none';
  document.getElementById('p-found-count').textContent = `0 / ${ta}`;
  document.getElementById('p-guess-input').value = '';
  document.getElementById('p-guess-input').disabled = false;
  document.getElementById('p-send-btn').disabled = false;

  showScreen('screen-guessing');
  setTimeout(() => document.getElementById('p-guess-input').focus(), 300);
}

function submitGuess() {
  const inp = document.getElementById('p-guess-input');
  let val = inp.value.trim();
  if (!val || !hostConn) return;

  
  const kw = currentKeyword.trim().toLowerCase();
  let full = val.toLowerCase();
  if (!full.startsWith(kw)) full = kw + ' ' + full;

  inp.value = '';
  hostConn.send({ type: 'guess', payload: { guess: full } });
  addGuessBubble(val, 'pending');
}

function handleGuessFeedback({ guess, result, points, penalty }) {
  removePendingBubble();
  if (result === 'duplicate') {
    addGuessBubble(guess, 'duplicate');
    return;
  }
  if (result === 'correct') {
    addGuessBubble(guess, 'correct', `+${points}`);
    myScore += points;
    document.getElementById('p-score-display').textContent = `${myScore} pts`;
    foundCount++;
    document.getElementById('p-found-count').textContent = `${foundCount} / ${totalAnswers}`;
    return;
  }
  if (result === 'wrong') {
    addGuessBubble(guess, 'wrong', penalty > 0 ? `-${penalty}` : '');
    myScore = Math.max(0, myScore - (penalty || 0));
    document.getElementById('p-score-display').textContent = `${myScore} pts`;
    flashScore();
  }
}

function handleAnswerRevealed({ index, answer, foundBy, foundByColor, points }) {
  
  if (foundBy !== playerName) {
    showToast(`${foundBy} found one! +${points}`, foundByColor);
  }
}

function handleWrongGuess({ guesserName, guesserColor, penalty, lettersShown }) {
  if (guesserName !== playerName) {
    showToast(`${guesserName} guessed wrong — 1 letter revealed`, guesserColor);
  }
  
  const strip = document.getElementById('p-hint-strip');
  strip.textContent = `💡 ${lettersShown} letter${lettersShown !== 1 ? 's' : ''} revealed from wrong guesses`;
  strip.style.display = 'block';
}

function handleScoreUpdate(scores) {
  const me = scores.find(s => s.name === playerName);
  if (me) {
    myScore = me.score;
    document.getElementById('p-score-display').textContent = `${myScore} pts`;
  }
}

function handleRoundEnd({ answers, scores, totalPlayers }) {
  document.getElementById('p-guess-input').disabled = true;
  document.getElementById('p-send-btn').disabled = true;
  hasVotedReady = false;

  const me = scores.find(s => s.name === playerName);
  if (me) myScore = me.score;

  showScreen('screen-round-end');
  document.getElementById('p-round-result').textContent =
    `You found ${foundCount} / ${totalAnswers} answers`;
  document.getElementById('p-score-big').textContent = `${myScore.toLocaleString()} pts`;

  
  const revealEl = document.getElementById('p-answers-reveal');
  if (revealEl) {
    revealEl.innerHTML = answers.map((a, i) => `
      <div class="p-answer-row">
        <span class="p-answer-num">${i+1}</span>
        <span class="p-answer-text">${escHtml(a)}</span>
      </div>
    `).join('');
  }

  
  const btn = document.getElementById('p-ready-btn');
  if (btn) {
    btn.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Ready to continue →';
    btn.onclick = voteReady;
  }

  
  document.getElementById('p-ready-count').textContent = `0 / ${totalPlayers} ready`;
}

function voteReady() {
  if (hasVotedReady || !hostConn) return;
  hasVotedReady = true;
  hostConn.send({ type: 'ready', payload: {} });

  const btn = document.getElementById('p-ready-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '✓ Ready!';
    btn.style.opacity = '0.6';
  }
}

function handleReadyUpdate({ readyCount, totalPlayers, readyNames }) {
  const el = document.getElementById('p-ready-count');
  if (el) el.textContent = `${readyCount} / ${totalPlayers} ready`;
}

function handleGameOver({ scores }) {
  showScreen('screen-gameover');
  const sorted = [...scores].sort((a,b) => b.score - a.score);
  const medals = ['🥇','🥈','🥉'];
  document.getElementById('p-final-scores').innerHTML = sorted.map((p, i) => `
    <div class="p-final-row ${p.name === playerName ? 'is-me' : ''}" style="border-color:${p.color}30">
      <span class="p-final-medal">${medals[i] || (i+1)}</span>
      <span class="p-final-name" style="color:${p.color}">${escHtml(p.name)}</span>
      <span class="p-final-pts">${p.score.toLocaleString()} pts</span>
    </div>
  `).join('');
}

function addGuessBubble(text, state, extra = '') {
  const list = document.getElementById('p-guesses-list');
  const div = document.createElement('div');
  div.className = `p-guess-bubble ${state}`;
  div.dataset.state = state;
  const icon = { correct:'✓', wrong:'✗', duplicate:'—', pending:'…' }[state] || '';
  div.innerHTML = `<span class="bubble-icon">${icon}</span><span class="bubble-text">${escHtml(text)}</span>${extra ? `<span class="bubble-pts">${extra}</span>` : ''}`;
  list.prepend(div);
}

function removePendingBubble() {
  const p = document.querySelector('.p-guess-bubble.pending');
  if (p) p.remove();
}

function showToast(msg, color) {
  const t = document.createElement('div');
  t.className = 'p-toast';
  t.style.borderColor = color + '60';
  t.style.color = color;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
}

function flashScore() {
  const el = document.getElementById('p-score-display');
  el.classList.add('flash-red');
  setTimeout(() => el.classList.remove('flash-red'), 500);
}

function showScreen(id) {
  document.querySelectorAll('.pscreen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
