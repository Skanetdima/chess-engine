// ==UserScript==
// @name         Analising Program
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Interactive HUD + multipv + perfect square & arrow highlights on Chess.com
// @match        https://www.chess.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const STOCKFISH_URL =
    "https://<YOUR_GITHUB>.github.io/chess-engine/stockfish.js";

  // Default config
  let topMoves = 3,
    moveTime = 500,
    eloLevel = 1500,
    playAs = "white"; // Добавлена переменная для цвета
  let engine,
    currentFen = "";

  // Create HUD
  const hud = document.createElement("div");
  Object.assign(hud.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    width: "180px",
    background: "rgba(0,0,0,0.8)",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "12px",
    zIndex: 9999,
  });
  hud.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>SF Cheat</strong>
        <button id="sf-hide" style="background:none;border:none;color:#fff;cursor:pointer;">✕</button>
      </div>
      <div id="sf-body">
        <label>PV:<input id="sf-pv" type="number" value="${topMoves}" min="1" max="5" style="width:40px"></label><br>
        <label>Time:<input id="sf-time" type="number" value="${moveTime}" min="100" max="2000" style="width:50px"></label><br>
        <label>ELO:<input id="sf-elo" type="number" value="${eloLevel}" min="1000" max="3000" style="width:50px"></label><br>
        <label>Play as:
          <select id="sf-color" style="width:60px">
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
        </label><br>
        <button id="sf-start" style="margin-top:6px;width:100%;">Start</button>
      </div>
    `;
  document.body.appendChild(hud);

  document.getElementById("sf-hide").onclick = () => {
    const b = document.getElementById("sf-body");
    b.style.display = b.style.display === "none" ? "block" : "none";
  };

  // Init Stockfish
  async function initEngine() {
    const r = await fetch(STOCKFISH_URL);
    const src = await r.text();
    const blob = new Blob([src], { type: "application/javascript" });
    engine = new Worker(URL.createObjectURL(blob));
    engine.postMessage("uci");
    engine.onmessage = onMsg;
  }

  // Build FEN from DOM
  function getFen() {
    let fen = "";
    for (let r = 8; r >= 1; r--) {
      let empty = 0;
      for (let f = 1; f <= 8; f++) {
        const el = document.querySelector(`.piece.square-${f}${r}`);
        if (!el) empty++;
        else {
          if (empty) {
            fen += empty;
            empty = 0;
          }
          const cls = Array.from(el.classList);
          const piece = cls.find((c) => c.length === 2);
          const [col, p] = piece.split("");
          fen += col === "w" ? p.toUpperCase() : p;
        }
      }
      if (empty) fen += empty;
      if (r > 1) fen += "/";
    }
    return fen + " " + (playAs === "white" ? "w" : "b"); // Added side recognition
  }

  let info = {};
  function onMsg(e) {
    const m = e.data;
    if (m.startsWith("info") && m.includes("multipv")) {
      const p = m.split(" ");
      const idx = p.indexOf("multipv");
      const mvnum = Number(p[idx + 1]);
      const mv = p[p.indexOf("pv") + 1];
      info[mvnum] = mv;
    }
    if (m.startsWith("bestmove")) {
      draw(info);
      info = {};
    }
  }

  // Perfect square & arrow highlights
  function draw(info) {
    document.querySelectorAll(".cheat-highlight").forEach((e) => e.remove());
    const board =
      document.querySelector("wc-chess-board") ||
      document.querySelector(".board-board");
    const map = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
    Object.values(info)
      .slice(0, topMoves)
      .forEach((mv, i) => {
        const hue = Math.round(360 * (i / topMoves));
        const col = `hsla(${hue},100%,50%,0.5)`;
        ["0", "1"].forEach((j) => {
          const f = mv[j * 2],
            r = mv[j * 2 + 1];
          const sq = `${map[f]}${r}`;
          const d = document.createElement("div");
          d.className = `highlight cheat-highlight square-${sq}`;
          d.style.background = col;
          board.appendChild(d);
        });
      });
  }

  // Start
  async function start() {
    topMoves = +document.getElementById("sf-pv").value;
    moveTime = +document.getElementById("sf-time").value;
    eloLevel = +document.getElementById("sf-elo").value;
    playAs = document.getElementById("sf-color").value; // Получаем выбранный цвет
    await initEngine();
    engine.postMessage("setoption name UCI_LimitStrength value true");
    engine.postMessage(`setoption name UCI_Elo value ${eloLevel}`);
    setInterval(() => {
      const fen = getFen();
      if (fen !== currentFen) {
        currentFen = fen;
        engine.postMessage(`position fen ${fen}`);
        engine.postMessage(`go movetime ${moveTime} multipv ${topMoves}`);
      }
    }, moveTime + 50);
  }
  document.getElementById("sf-start").onclick = start;
})();
