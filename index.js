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
  <style>
    :root{--brand:#0b74ff;--muted:#6b7280;--bg:#f7fafc}
    html{box-sizing:border-box;overflow-y:scroll}
    *,*:before,*:after{box-sizing:inherit}
    body{margin:0;background:var(--bg);font-family:Inter,Segoe UI,Helvetica,Arial}
    /* hide built-in topbar, we'll use a compact custom header */
    .swagger-ui .topbar{display:none}
    /* custom header */
    .doc-header{display:flex;align-items:center;gap:12px;padding:14px 20px;background:#fff;border-bottom:1px solid #e6edf8}
    .doc-logo{width:40px;height:40px;border-radius:6px;background:linear-gradient(135deg,var(--brand),#6a9cff);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700}
    .doc-title{font-size:16px;font-weight:600;color:#0f172a}
    .doc-sub{font-size:12px;color:var(--muted)}
    #swagger-ui{margin:20px}
    /* tweak primary color used by Swagger UI */
    .scheme-container .schemes, .opblock-summary-method {background:var(--brand)!important}
  </style>
</head>
<body>
  <header class="doc-header">
    <div class="doc-logo">API</div>
    <div>
      <div class="doc-title">BackEnd API — Documentation</div>
      <div class="doc-sub">v1.0 • User management & authentication</div>
    </div>
  </header>
  <div id="swagger-ui"></div>
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
