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
*{margin:0;padding:0;box-sizing:border-box}

body{
  min-height:100vh;
  font-family:'Inter',sans-serif;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;

  /* ===== M PERFORMANCE BACKGROUND (SUBTLE) ===== */
  background:
    radial-gradient(circle at 20% 20%, rgba(0,110,255,.35), transparent 45%),
    radial-gradient(circle at 80% 70%, rgba(200,25,45,.35), transparent 45%),
    radial-gradient(circle at 60% 30%, rgba(0,200,180,.25), transparent 40%),
    linear-gradient(135deg,#05070d,#0a0e1a);
}

.container{
  width:920px;
  padding:56px;
  border-radius:26px;
  background:linear-gradient(145deg,#0a0e1a,#05070d);
  box-shadow:
    0 0 60px rgba(0,0,0,.85),
    inset 0 0 60px rgba(0,0,0,.9);
}

/* ===== HEADER ===== */
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:42px;
}

.logo{
  font-size:28px;
  font-weight:800;
  letter-spacing:2px;
}
.logo span{color:#00e5ff}

/* ===== STATUS ===== */
.status{
  display:flex;
  align-items:center;
  gap:14px;
  font-weight:700;
  letter-spacing:2px;
  color:#00e5ff;
}

.dot{
  width:14px;
  height:14px;
  border-radius:50%;
  background:radial-gradient(circle,#00ff6a,#008f3a);
  box-shadow:0 0 12px #00ff6a,0 0 28px rgba(0,255,106,.8);
  animation:pulse 1.4s infinite;
}

/* ===== MAIN ===== */
.title{
  font-size:46px;
  font-weight:800;
  line-height:1.2;
}

.title span{
  color:#c8192d; /* M Performance Red */
}

.subtitle{
  margin-top:14px;
  font-size:15px;
  color:#9aa4ff;
  letter-spacing:1.5px;
}

/* ===== ACTIONS ===== */
.actions{
  margin-top:54px;
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:28px;
}

.action{
  position:relative;
  padding:28px;
  border-radius:18px;
  display:flex;
  gap:20px;
  align-items:center;
  text-decoration:none;
  color:#fff;
  background:linear-gradient(135deg,#0c1224,#060914);
  border:1px solid #1b2445;
  overflow:hidden;
  transition:.35s ease;
}

.action::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(
    120deg,
    transparent,
    rgba(0,229,255,.35),
    transparent
  );
  transform:translateX(-100%);
  transition:.7s;
}

.action:hover::before{transform:translateX(100%)}
.action:hover{
  transform:translateY(-8px) scale(1.03);
  box-shadow:
    0 0 30px rgba(0,229,255,.4),
    0 0 70px rgba(0,60,255,.35);
}

/* ===== ICON BASE ===== */
.icon svg{
  width:46px;
  height:46px;
  fill:#00e5ff;
  filter:
    drop-shadow(0 0 8px #00e5ff)
    drop-shadow(0 0 22px rgba(0,60,255,.8));
}

/* ===== SYSTEM PING : M PERFORMANCE RED CARD ===== */
.action.ping-red .icon svg{
  fill:#c8192d; /* BMW M Performance Red */
  filter:
    drop-shadow(0 0 6px rgba(200,25,45,.9))
    drop-shadow(0 0 20px rgba(200,25,45,.6));
}

.action.ping-red::before{
  background:linear-gradient(
    120deg,
    transparent,
    rgba(200,25,45,.45),
    transparent
  );
}


.action h3{
  font-size:18px;
  font-weight:700;
}
.action span{
  font-size:13px;
  color:#9aa4ff;
}

/* ===== FOOTER ===== */
.footer{
  margin-top:56px;
  text-align:right;
  font-size:12px;
  color:#666;
  letter-spacing:2px;
}

/* ===== ANIMATIONS ===== */
@keyframes pulse{
  0%{transform:scale(1)}
  50%{transform:scale(1.4);opacity:.6}
  100%{transform:scale(1)}
}

@keyframes heartbeat{
  0%,100%{transform:scale(1)}
  40%{transform:scale(1.18)}
  70%{transform:scale(1.05)}
}
</style>
</head>

<body>
<div class="container">

  <div class="header">
    <div class="logo">SYSTEM <span>M</span></div>
    <div class="status">
      <span class="dot"></span>
      <span>SYSTEM ONLINE • M PER</span>
    </div>
  </div>

  <div class="title">
    Backend Control Unit<br/>
    <span>High Performance Mode</span>
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

    <a class="action ping-red" href="/ping">
      <div class="icon heart">
        <svg viewBox="0 0 24 24">
          <path d="M12 21s-6.7-4.35-9.33-7.05C-0.5 10.6 1.4 5.8 6 5.8c2.1 0 3.4 1.2 4 2.1.6-.9 1.9-2.1 4-2.1 4.6 0 6.5 4.8 3.33 8.15C18.7 16.65 12 21 12 21z"/>
        </svg>
      </div>
      <div>
        <h3>System Ping</h3>
        <span>Health & Latency Check</span>
      </div>
    </a>
  </div>

  <div class="footer">
    ENGINE MODE • M PER
  </div>

</div>
</body>
</html>`);
});

module.exports = router;
