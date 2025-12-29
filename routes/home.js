const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("HOME OK");
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>011 Backend API</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">

<style>
:root{
  --blue:#38bdf8;
  --purple:#a855f7;
  --pink:#ec4899;
  --bg:#020617;
  --glass:rgba(255,255,255,.08);
  --border:rgba(255,255,255,.18);
  --text:#e5e7eb;
  --muted:#94a3b8;
}

*{
  box-sizing:border-box;
  font-family:Inter,sans-serif;
}

body{
  margin:0;
  min-height:100vh;
  color:var(--text);
  display:flex;
  align-items:center;
  justify-content:center;

  /* ฟ้าซ้ายบน → ม่วงชมพูขวาล่าง */
  background:
    radial-gradient(900px circle at top left, rgba(56,189,248,.35), transparent 60%),
    radial-gradient(900px circle at bottom right, rgba(236,72,153,.35), transparent 60%),
    linear-gradient(180deg,#020617,#020617);
}

/* เอฟเฟกต์ glow ลอยด้านหลัง */
body::before{
  content:"";
  position:fixed;
  inset:0;
  background:
    linear-gradient(135deg, transparent 40%, rgba(168,85,247,.15), transparent 70%);
  pointer-events:none;
}

.card{
  position:relative;
  max-width:960px;
  width:100%;
  padding:60px;
  border-radius:28px;

  background:linear-gradient(
    135deg,
    rgba(56,189,248,.12),
    rgba(236,72,153,.10)
  ), var(--glass);

  backdrop-filter:blur(22px);
  border:1px solid var(--border);

  box-shadow:
    0 40px 90px rgba(0,0,0,.65),
    0 0 120px rgba(168,85,247,.25);
}

.badge{
  display:inline-block;
  padding:8px 18px;
  border-radius:999px;
  font-size:13px;
  font-weight:700;
  letter-spacing:.4px;
  background:linear-gradient(135deg,var(--blue),var(--purple));
  box-shadow:0 0 20px rgba(56,189,248,.6);
}

h1{
  margin:26px 0 14px;
  font-size:46px;
  font-weight:800;
  background:linear-gradient(135deg,var(--blue),var(--pink));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

p{
  max-width:640px;
  line-height:1.8;
  color:var(--muted);
}

.actions{
  margin-top:46px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:26px;
}

.action{
  text-decoration:none;
  color:var(--text);
  padding:26px;
  border-radius:22px;
  border:1px solid var(--border);
  background:
    linear-gradient(135deg,
      rgba(255,255,255,.18),
      rgba(255,255,255,.04)
    );
  display:flex;
  gap:20px;
  transition:.35s ease;
  position:relative;
  overflow:hidden;
}

/* เส้นไฟวิ่งแบบรถแต่ง */
.action::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(
    120deg,
    transparent 30%,
    rgba(56,189,248,.45),
    rgba(236,72,153,.45),
    transparent 70%
  );
  opacity:0;
  transition:.35s;
}

.action:hover::before{
  opacity:1;
}

.action:hover{
  transform:translateY(-10px) scale(1.02);
  border-color:var(--pink);
  box-shadow:
    0 25px 70px rgba(236,72,153,.45),
    0 0 50px rgba(56,189,248,.45);
}

.icon{
  width:60px;
  height:60px;
  border-radius:18px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:28px;
  background:linear-gradient(135deg,var(--blue),var(--pink));
  box-shadow:0 0 28px rgba(236,72,153,.7);
}

footer{
  margin-top:48px;
  text-align:center;
  font-size:13px;
  color:var(--muted);
}
</style>
</head>

<body>
  <div class="card">
    <span class="badge">🚀 BACKEND SERVICE</span>

    <h1>011 Backend API</h1>
    <p>
      High-performance RESTful API with authentication, user management
      and system services — designed with speed, security and style.
    </p>

    <div class="actions">
      <a class="action" href="/api-docs">
        <div class="icon">📘</div>
        <div>
          <h3>API Documentation</h3>
          <span>Swagger UI – explore & test endpoints</span>
        </div>
      </a>

      <a class="action" href="/ping">
        <div class="icon">💓</div>
        <div>
          <h3>Health Check</h3>
          <span>Server & database heartbeat</span>
        </div>
      </a>
    </div>

    <footer>
      © ${new Date().getFullYear()} 011 Backend API
    </footer>
  </div>
</body>
</html>`);
});

module.exports = router;
