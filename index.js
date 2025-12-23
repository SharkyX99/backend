require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const specs = require("./swagger");

app.use(express.json());
app.use(cors());

// Serve Swagger UI using CDN assets (Vercel-friendly)
app.get("/api-docs", (req, res) => {
  const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>BackEnd API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--brand:#0b74ff;--accent:#0b6bff;--muted:#6b7280;--bg:#f6f9fc;--card:#ffffff}
    html,body{height:100%}
    html{box-sizing:border-box;overflow-y:scroll}
    *,*:before,*:after{box-sizing:inherit}
    body{margin:0;background:var(--bg);font-family:Inter,Segoe UI,Helvetica,Arial;color:#0f172a}
    /* hide built-in topbar, use our compact header */
    .swagger-ui .topbar{display:none}

    /* Header */
    .doc-header{display:flex;align-items:center;gap:14px;padding:16px 24px;background:linear-gradient(90deg,rgba(11,116,255,0.06),rgba(106,156,255,0.03));border-bottom:1px solid rgba(15,23,42,0.04)}
    .doc-logo{width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,var(--brand),#6a9cff);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px}
    .doc-title{font-size:18px;font-weight:700}
    .doc-sub{font-size:13px;color:var(--muted);margin-top:2px}

    /* Layout */
    .doc-shell{display:flex;gap:24px;padding:20px;max-width:1200px;margin:12px auto}
    #swagger-ui{flex:1;background:transparent;border-radius:12px;padding:18px}
    .doc-aside{width:260px;flex:0 0 260px}
    .doc-card{background:var(--card);border-radius:12px;box-shadow:0 6px 18px rgba(15,23,42,0.06);padding:12px}

    /* Floating actions */
    .fab{position:fixed;right:20px;bottom:20px;display:flex;flex-direction:column;gap:10px}
    .fab a{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:10px;background:var(--brand);color:#fff;text-decoration:none;box-shadow:0 6px 18px rgba(11,116,255,0.18)}

    /* Footer */
    .doc-footer{text-align:center;padding:14px;color:var(--muted);font-size:13px}

    /* Swagger UI adjustments */
    .swagger-ui .info {padding:8px 0}
    .scheme-container .schemes, .opblock-summary-method {background:var(--brand)!important}
    .opblock.opblock-get .opblock-summary-method {background:#0b74ff;border-radius:6px;color:#fff}
  </style>
</head>
  <body>
  <header class="doc-header">
    <div class="doc-logo" aria-hidden>API</div>
    <div>
      <div class="doc-title">BackEnd API — Documentation</div>
      <div class="doc-sub">v1.0 • User management & authentication</div>
    </div>
  </header>
  <div class="doc-shell">
    <aside class="doc-aside">
      <div class="doc-card">
        <strong>Quick Start</strong>
        <div style="margin-top:8px;font-size:13px;color:var(--muted);line-height:1.4">
          <div><code>POST /login</code> — obtain a token</div>
          <pre style="background:#f3f5f9;padding:8px;border-radius:6px;margin:8px 0;font-size:12px">curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user_1","password":"pass1#123"}'</pre>
          <div><code>GET /api/users</code> — list users (Auth required)</div>
          <pre style="background:#f3f5f9;padding:8px;border-radius:6px;margin:8px 0;font-size:12px">curl -H "Authorization: Bearer &lt;TOKEN&gt;" http://localhost:3000/api/users</pre>
        </div>
        <hr style="margin:12px 0;border:none;border-top:1px solid rgba(15,23,42,0.06)">
        <strong>Schemas</strong>
        <div style="margin-top:8px;font-size:13px;color:var(--muted)">
          Click to jump to schema:
          <ul style="margin:6px 0 0;padding-left:18px;color:var(--muted)">
            <li><a href="#/components/schemas/User">User</a></li>
            <li><a href="#/components/schemas/NewUser">NewUser</a></li>
            <li><a href="#/components/schemas/Login">Login</a></li>
          </ul>
        </div>
      </div>
    </aside>
    <main class="doc-main">
      <div id="swagger-ui" class="doc-card"></div>
    </main>
  </div>
  <div class="fab" aria-hidden>
  </div>
  <footer class="doc-footer">BackEnd API</footer>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const spec = ${JSON.stringify(specs)};
      SwaggerUIBundle({
        spec,
        dom_id: '#swagger-ui',
        deepLinking: true,
        persistAuthorization: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'StandaloneLayout'
      });

      // small enhancement: focus search input for keyboard users
      const tryFocus = () => {
        const el = document.querySelector('.search__field') || document.querySelector('input[type="search"]');
        if (el) el.setAttribute('placeholder','Search endpoints...');
      };
      setTimeout(tryFocus, 300);
    };
  </script>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html");
  res.send(swaggerHtml);
});

// Routes
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = { app };
