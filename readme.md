## Chess.com HUD Engine Assistant

A Tampermonkey script that integrates Stockfish directly into Chess.com for live analysis. Provides a lightweight, customizable HUD with multipv suggestions, visual square highlights, and ELO tuning.

### Features:

- 🎯 Up to 5 best move suggestions using Stockfish (MultiPV).
- ⚙️ Adjustable move time and engine strength via ELO level.
- ♜ Supports both White and Black perspectives.
- 🎨 Clean square and arrow highlights for better visualization.
- 🧪 Minimalistic interactive HUD for real-time control.

### Purpose:

This project is created out of personal interest in chess engines, UI development, and real-time data interaction.
**It's not intended to offend anyone or promote unfair play.** The goal is to explore how engines think and how interfaces can be built to enhance learning and strategy.

### Usage Guide

1. **Install Tampermonkey Extension**

   - Chrome/Edge/Firefox: [https://www.tampermonkey.net](https://www.tampermonkey.net)

2. **Create a New UserScript**

   - Open the Tampermonkey dashboard
   - Click “Create a new script”
   - Paste the contents of `script.js` into the editor

3. **Set the Stockfish Engine URL**

   - Replace `<YOUR_GITHUB>` in the `STOCKFISH_URL` variable with the correct path to your hosted `stockfish.js` file
     _(You can host it via GitHub Pages or any static file host.)_

4. **Go to [https://www.chess.com](https://www.chess.com)**

   - You’ll see a small HUD appear in the top-right corner of the screen.

5. **Customize Settings**

   - Choose the number of top moves (MultiPV), engine ELO strength, move calculation time, and which side you're playing as.

6. **Click "Start"**

   - The HUD will begin analyzing positions live, updating after each move.


**NOTE: thank you for javascript version of stockfish [https://github.com/lichess-org/stockfish.js](https://github.com/lichess-org/stockfish.js)** 
