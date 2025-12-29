const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>M Performance Backend</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ====== ONLY BACKGROUND CHANGED ====== */
body {
  min-height: 100vh;
  font-family: 'Inter', sans-serif;

  background:
    /* M Light Blue - Top Left */
    radial-gradient(
      circle at 18% 22%,
      rgba(80, 190, 255, 0.45),
      transparent 50%
    ),

    /* M Performance Blue - Center */
    radial-gradient(
      circle at 48% 38%,
      rgba(0, 95, 200, 0.40),
      transparent 58%
    ),

    /* M Red - Bottom Right (quiet) */
    radial-gradient(
      circle at 80% 72%,
      rgba(200, 25, 45, 0.28),
      transparent 55%
    ),

    /* Base dark */
    linear-gradient(
      135deg,
      #05060a 0%,
      #0b1220 45%,
      #07090f 100%
    );

  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* =================================== */

.container {
  width: 920px;
  padding: 50px;
  border-radius: 20px;
  background: linear-gradient(145deg, #0a0e1a, #05070d);
  box-shadow:
    0 0 40px #000,
    inset 0 0 40px #000;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 2px;
}

.logo span {
  color: #00e5ff;
}

/* STATUS */
.status {
  display: flex;
  align-items: center;
  gap: 14px;
  font-weight: 700;
  letter-spacing: 2px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, #00ff6a, #008f3a);
  box-shadow: 0 0 10px #00ff6a, 0 0 22px #00ff6a;
  animation: pulse 1.2s infinite;
}

.status-text {
  color: #00e5ff;
  animation: flicker 2s infinite;
}

/* MAIN */
.main {
  margin-top: 30px;
}

.title {
  font-size: 46px;
  font-weight: 800;
  line-height: 1.2;
}

.subtitle {
  margin-top: 12px;
  font-size: 16px;
  color: #aaa;
  letter-spacing: 1px;
}

/* ACTIONS */
.actions {
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.action {
  position: relative;
  padding: 26px;
  border-radius: 16px;
  display: flex;
  gap: 20px;
  align-items: center;
  text-decoration: none;
  color: white;
  background: linear-gradient(135deg, #0c1224, #060914);
  border: 1px solid #1b2445;
  overflow: hidden;
  transition: transform .3s ease, box-shadow .3s ease;
}

.action::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent,
    #00e5ff55,
    transparent
  );
  transform: translateX(-100%);
  transition: .6s;
}

.action:hover::before {
  transform: translateX(100%);
}

.action:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 0 25px #00e5ff55,
    0 0 60px #003cff55;
}

/* ICON */
.icon svg {
  width: 44px;
  height: 44px;
  fill: #00e5ff;
  filter:
    drop-shadow(0 0 8px #00e5ff)
    drop-shadow(0 0 20px #003cff);
}

/* TEXT */
.action h3 {
  font-size: 18px;
  font-weight: 700;
}

.action span {
  font-size: 13px;
  color: #9aa4ff;
}

/* ANIMATIONS */
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: .6; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes flicker {
  0%,100% { opacity: 1; }
  50% { opacity: .65; }
}

/* FOOTER */
.footer {
  margin-top: 50px;
  text-align: right;
  font-size: 12px;
  color: #666;
  letter-spacing: 2px;
}
</style>
</head>

<body>
<div class="container">

  <div class="header">
    <div class="logo">SYSTEM <span>M</span></div>
    <div class="status">
      <span class="dot"></span>
      <span class="status-text">SYSTEM ONLINE • M PER</span>
    </div>
  </div>

  <div class="main">
    <div class="title">
      Backend Control Unit<br/>
      <span style="color:#ff004c">High Performance Mode</span>
    </div>
    <div class="subtitle">
      • API ENGINE • DATABASE CORE
    </div>

    <div class="actions">
      <a class="action" href="/api-docs">
        <div class="icon">
          <svg viewBox="0 0 24 24">
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"/>
            <path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/>
          </svg>
        </div>
        <div>
          <h3>Database Control</h3>
          <span>Swagger API Interface</span>
        </div>
      </a>

      <a class="action" href="/ping">
        <div class="icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div>
          <h3>System Ping</h3>
          <span>Health & Latency Check</span>
        </div>
      </a>
    </div>
  </div>

  <div class="footer">
    ENGINE MODE • M PER
  </div>

</div>
</body>
</html>`);
});

module.exports = router;
