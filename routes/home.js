const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>011 Backend API</title>

<style>
body{
  margin:0;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:Arial, sans-serif;
  color:#e5e7eb;

  /* M Performance Background */
  background:
    linear-gradient(120deg,#00AEEF22,transparent 40%),
    linear-gradient(-120deg,#003A8F22,transparent 40%),
    repeating-linear-gradient(
      45deg,
      #050505,
      #050505 10px,
      #070707 10px,
      #070707 20px
    );
}

/* Card */
.card{
  padding:64px;
  border-radius:26px;
  background:
    linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.02));
  backdrop-filter:blur(18px);
  box-shadow:
    0 40px 90px rgba(0,0,0,.85),
    inset 0 0 0 1px rgba(255,255,255,.12);
  max-width:960px;
  width:100%;
  position:relative;
}

/* M stripe */
.card::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:26px;
  background:
    linear-gradient(
      90deg,
      transparent 20%,
      #00AEEF44,
      #003A8F44,
      #ffffff22,
      transparent 80%
    );
  pointer-events:none;
}

/* Title */
h1{
  margin:0;
  font-size:44px;
  font-weight:800;
  background:linear-gradient(135deg,#00AEEF,#ffffff);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

/* STATUS */
.status{
  display:flex;
  align-items:center;
  gap:14px;
  margin:28px 0 44px;
  font-weight:800;
  letter-spacing:.6px;
}

.dot{
  width:14px;
  height:14px;
  border-radius:50%;
  background:#555;
}

/* ONLINE */
.online{
  background:#00FF6A;
  box-shadow:0 0 10px #00FF6A,0 0 26px rgba(0,255,106,.9);
  animation:pulseGreen 1.2s infinite;
}

/* OFFLINE */
.offline{
  background:#FF2E2E;
  box-shadow:0 0 10px #FF2E2E,0 0 26px rgba(255,46,46,.9);
  animation:pulseRed 1.2s infinite;
}

@keyframes pulseGreen{
  0%{box-shadow:0 0 0 rgba(0,255,106,.8)}
  70%{box-shadow:0 0 22px rgba(0,255,106,1)}
  100%{box-shadow:0 0 0 rgba(0,255,106,.8)}
}
@keyframes pulseRed{
  0%{box-shadow:0 0 0 rgba(255,46,46,.8)}
  70%{box-shadow:0 0 22px rgba(255,46,46,1)}
  100%{box-shadow:0 0 0 rgba(255,46,46,.8)}
}

/* Actions */
.actions{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:32px;
}

/* Buttons */
.action{
  position:relative;
  padding:28px;
  border-radius:22px;
  display:flex;
  gap:22px;
  align-items:center;
  text-decoration:none;
  color:#e5e7eb;
  background:
    linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.02));
  border:1px solid rgba(255,255,255,.18);
  overflow:hidden;
  transition:.35s ease;
}

/* throttle sweep */
.action::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(
    120deg,
    transparent 35%,
    rgba(0,174,239,.45),
    rgba(255,255,255,.25),
    transparent 70%
  );
  transform:translateX(-100%);
}

.action:hover::before{
  transform:translateX(100%);
  transition:.8s ease;
}

.action:hover{
  transform:translateY(-10px) scale(1.03);
  box-shadow:0 30px 80px rgba(0,0,0,.9);
}

.icon{
  width:64px;
  height:64px;
  border-radius:18px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:30px;
}

.docs .icon{
  background:#00AEEF;
  box-shadow:0 0 28px rgba(0,174,239,.9);
}

.ping .icon{
  background:#FF2E2E;
  box-shadow:0 0 28px rgba(255,46,46,.9);
}

h3{margin:0 0 6px}
span{font-size:13px;color:#94a3b8}
</style>
</head>

<body>
<div class="card">
  <h1>011 Backend API</h1>

  <div class="status">
    <span class="dot" id="status-dot"></span>
    <span id="status-text">INITIALIZING M POWER…</span>
  </div>

  <div class="actions">
    <a class="action docs" href="/api-docs">
      <div class="icon">📘</div>
      <div>
        <h3>API Documentation</h3>
        <span>Swagger Interface</span>
      </div>
    </a>

    <a class="action ping" href="/ping">
      <div class="icon">💓</div>
      <div>
        <h3>Health Check</h3>
        <span>System Diagnostics</span>
      </div>
    </a>
  </div>
</div>

<script>
fetch("/ping")
  .then(r => { if(!r.ok) throw 0; })
  .then(() => {
    statusDot.classList.add("online");
    statusText.innerText = "SYSTEM ONLINE • M PERFORMANCE";
  })
  .catch(() => {
    statusDot.classList.add("offline");
    statusText.innerText = "SYSTEM OFFLINE • CHECK ENGINE";
  });
</script>
</body>
</html>`);
});

module.exports = router;
