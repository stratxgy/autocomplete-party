# Autocomplete Party 🎉

A Jackbox-style party game where players guess Google autocomplete suggestions. One big screen + everyone plays on their phone.

## How to Play

1. **Host** opens the game on a big screen (TV, laptop, projector)
2. **Players** join on their phones by visiting the join link or scanning the QR code
3. Each round shows a search prefix (like *"why do cats..."*)
4. Players race to guess the top 5 autocomplete answers
5. Fewer hints used = more points!

## Hosting on GitHub Pages

1. Fork or clone this repo
2. Go to **Settings → Pages**
3. Set source to **main branch, / (root)**
4. Your game will be live at `https://yourusername.github.io/autocomplete-party/`

Players join at: `https://yourusername.github.io/autocomplete-party/join.html`

## How It Works

* **No backend needed** — uses [PeerJS](https://peerjs.com/) for peer-to-peer WebRTC connections
* The host screen acts as the game server
* Players connect directly to the host via a 4-letter room code
* All game state lives on the host's browser tab

## Adding Questions

Edit `js/questions.js` to add your own prompts. Each question needs:

```js
{
  keyword: "why do cats",
  answers: \[
    "why do cats purr",
    "why do cats knead",
    // ... 5 answers total, ordered by popularity
  ]
}
```

## Tech Stack

* Vanilla HTML/CSS/JS (no build step)
* [PeerJS](https://peerjs.com/) for WebRTC p2p
* [QRCode.js](https://davidshimjs.github.io/qrcodejs/) for QR codes
* [Google Fonts](https://fonts.google.com/) — Syne + DM Sans

