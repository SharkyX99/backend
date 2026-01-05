require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

// Active tokens map (in-memory for demo/testing)
globalThis.__activeTokens = globalThis.__activeTokens ?? new Map();

/**
 * @openapi
 * /ping:
 *   get:
 *     tags: [Health]
 *     summary: Server heartbeat and DB time
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    const now = rows && rows[0] && rows[0].now ? rows[0].now : new Date();
    res.json({ status: "ok", time: now });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

/**
 * @openapi
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Root server info
 *     responses:
 *       200:
 *         description: Server running
 */
const homeRouter = require("./routes/home");
app.use("/", homeRouter);


/**
 * @openapi
 * /login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username) return res.status(400).json({ error: "username is required" });

  try {
    const [rows] = await db.query(
      "SELECT id, fullname, lastname, password FROM tbl_users WHERE username = ?",
      [username]
    );
    const user = (rows && rows[0]) || null;
    if (!user) return res.status(401).json({ error: "User not found" });

    const ok = await bcrypt.compare(password || "", user.password || "");
    if (!ok) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY || "secret", { expiresIn: "1h" });
    globalThis.__activeTokens.set(user.id, token);
    res.json({ token, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * @openapi
 * /logout:
 *   post:
 *     tags: [Authentication]
 *     summary: User logout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
app.post("/logout", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, SECRET_KEY || "secret");
    if (payload && payload.id) {
      globalThis.__activeTokens.delete(payload.id);
    }
    res.json({ message: "Logout successful" });
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
});

/**
 * @openapi
 * /api/data:
 *   get:
 *     tags: [Misc]
 *     summary: Test CORS endpoint
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello, CORS!" });
});

// Serve Swagger UI using CDN assets (Vercel-friendly)
app.get("/api-docs", (req, res) => {
  const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>BackEnd API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #0b74ff;
      --brand-dark: #0a5fd6;
      --accent: #6a9cff;
      --accent-light: #a8c5ff;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --muted: #64748b;
      --bg: #f8fafc;
      --bg-secondary: #f1f5f9;
      --card: #ffffff;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --border: rgba(15, 23, 42, 0.08);
      --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
      --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);
      --shadow-lg: 0 16px 48px rgba(15, 23, 42, 0.12);
      --shadow-brand: 0 8px 32px rgba(11, 116, 255, 0.24);
    }

    [data-theme="dark"] {
      --brand: #3b95ff;
      --brand-dark: #2884ee;
      --accent: #6a9cff;
      --accent-light: #8bb2ff;
      --success: #34d399;
      --warning: #fbbf24;
      --error: #f87171;
      --muted: #94a3b8;
      --bg: #0f172a;
      --bg-secondary: #1e293b;
      --card: #1e293b;
      --text-primary: #f1f5f9;
      --text-secondary: #cbd5e1;
      --border: rgba(241, 245, 249, 0.1);
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.3);
      --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.4);
      --shadow-brand: 0 8px 32px rgba(59, 149, 255, 0.3);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      overflow-x: hidden;
    }

    body {
      background: var(--bg);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--text-primary);
      transition: background 0.3s ease, color 0.3s ease;
      line-height: 1.6;
    }

    /* Hide default Swagger topbar */
    .swagger-ui .topbar { display: none; }

    /* Animated Background */
    .bg-pattern {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0.4;
    }

    .bg-pattern::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: 
        radial-gradient(circle at 20% 50%, rgba(11, 116, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(106, 156, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(59, 149, 255, 0.1) 0%, transparent 50%);
      animation: float 20s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
    }

    /* Header */
    .doc-header {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 20px 32px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      transition: all 0.3s ease;
    }

    [data-theme="dark"] .doc-header {
      background: rgba(30, 41, 59, 0.8);
    }

    .doc-header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .doc-logo {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 20px;
      letter-spacing: -0.5px;
      box-shadow: var(--shadow-brand);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .doc-logo::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transform: rotate(45deg);
      animation: shine 3s infinite;
    }

    @keyframes shine {
      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }

    .doc-logo:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 12px 40px rgba(11, 116, 255, 0.35);
    }

    .doc-title-group h1 {
      font-size: 24px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--brand), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }

    .doc-subtitle {
      font-size: 14px;
      color: var(--muted);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .doc-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      background: rgba(11, 116, 255, 0.1);
      border: 1px solid rgba(11, 116, 255, 0.2);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--brand);
    }

    /* Theme Toggle */
    .theme-toggle {
      position: relative;
      width: 56px;
      height: 32px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 100px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      padding: 4px;
    }

    .theme-toggle:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-md);
    }

    .theme-toggle-slider {
      position: absolute;
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, var(--brand), var(--accent));
      border-radius: 50%;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(11, 116, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    [data-theme="dark"] .theme-toggle-slider {
      transform: translateX(24px);
    }

    /* Layout */
    .doc-shell {
      position: relative;
      z-index: 1;
      display: flex;
      gap: 28px;
      padding: 28px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .doc-main {
      flex: 1;
      min-width: 0;
    }

    #swagger-ui {
      background: var(--card);
      border-radius: 16px;
      box-shadow: var(--shadow-md);
      padding: 28px;
      border: 1px solid var(--border);
      transition: all 0.3s ease;
    }

    /* Sidebar */
    .doc-aside {
      width: 320px;
      flex: 0 0 320px;
      position: sticky;
      top: 116px;
      height: fit-content;
      max-height: calc(100vh - 140px);
      overflow-y: auto;
    }

    .doc-card {
      background: var(--card);
      border-radius: 16px;
      box-shadow: var(--shadow-md);
      padding: 24px;
      border: 1px solid var(--border);
      transition: all 0.3s ease;
    }

    .doc-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .doc-card strong {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      display: block;
      margin-bottom: 16px;
    }

    .doc-card code {
      background: rgba(11, 116, 255, 0.1);
      color: var(--brand);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .doc-card pre {
      background: var(--bg-secondary);
      padding: 16px;
      border-radius: 10px;
      margin: 12px 0;
      font-size: 12px;
      border: 1px solid var(--border);
      overflow-x: auto;
      line-height: 1.6;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .doc-card hr {
      margin: 20px 0;
      border: none;
      border-top: 1px solid var(--border);
    }

    .doc-card ul {
      margin: 12px 0 0;
      padding-left: 20px;
      list-style: none;
    }

    .doc-card li {
      margin: 8px 0;
      position: relative;
      padding-left: 8px;
    }

    .doc-card li::before {
      content: '→';
      position: absolute;
      left: -12px;
      color: var(--brand);
      font-weight: 700;
    }

    .doc-card a {
      color: var(--brand);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
    }

    .doc-card a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--brand);
      transition: width 0.3s ease;
    }

    .doc-card a:hover {
      color: var(--brand-dark);
    }

    .doc-card a:hover::after {
      width: 100%;
    }

    /* Floating Action Buttons */
    .fab {
      position: fixed;
      right: 28px;
      bottom: 28px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 50;
    }

    .fab-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--brand), var(--accent));
      color: #fff;
      text-decoration: none;
      box-shadow: var(--shadow-brand);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 24px;
      border: none;
      cursor: pointer;
    }

    .fab-btn:hover {
      transform: translateY(-4px) scale(1.1);
      box-shadow: 0 16px 48px rgba(11, 116, 255, 0.4);
    }

    .fab-btn:active {
      transform: translateY(-2px) scale(1.05);
    }

    /* Footer */
    .doc-footer {
      text-align: center;
      padding: 32px;
      color: var(--muted);
      font-size: 14px;
      font-weight: 500;
      border-top: 1px solid var(--border);
      background: var(--bg);
      margin-top: 48px;
    }

    /* Swagger UI Enhancements */
    .swagger-ui {
      font-family: 'Inter', sans-serif !important;
    }

    .swagger-ui .info {
      padding: 16px 0;
    }

    .swagger-ui .opblock {
      border-radius: 12px !important;
      border: 1px solid var(--border) !important;
      margin-bottom: 16px !important;
      box-shadow: var(--shadow-sm) !important;
      transition: all 0.3s ease !important;
    }

    .swagger-ui .opblock:hover {
      box-shadow: var(--shadow-md) !important;
      transform: translateX(4px);
    }

    .swagger-ui .opblock-summary {
      border-radius: 12px !important;
    }

    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: linear-gradient(135deg, #10b981, #34d399) !important;
      border-radius: 8px !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
    }

    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: linear-gradient(135deg, var(--brand), var(--accent)) !important;
      border-radius: 8px !important;
      font-weight: 700 !important;
      box-shadow: var(--shadow-brand) !important;
    }

    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: linear-gradient(135deg, #f59e0b, #fbbf24) !important;
      border-radius: 8px !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3) !important;
    }

    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: linear-gradient(135deg, #ef4444, #f87171) !important;
      border-radius: 8px !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
    }

    .swagger-ui .btn {
      border-radius: 8px !important;
      font-weight: 600 !important;
      transition: all 0.2s ease !important;
    }

    .swagger-ui .btn.execute {
      background: linear-gradient(135deg, var(--brand), var(--accent)) !important;
      border: none !important;
      box-shadow: var(--shadow-brand) !important;
    }

    .swagger-ui .btn.execute:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(11, 116, 255, 0.4) !important;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: var(--bg-secondary);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, var(--brand), var(--accent));
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, var(--brand-dark), var(--brand));
    }

    /* Loading Animation */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .loading {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .doc-aside {
        display: none;
      }
      
      .doc-shell {
        padding: 20px;
      }
    }

    @media (max-width: 768px) {
      .doc-header {
        padding: 16px 20px;
      }

      .doc-title-group h1 {
        font-size: 20px;
      }

      .doc-subtitle {
        font-size: 12px;
      }

      .fab {
        right: 20px;
        bottom: 20px;
      }

      .fab-btn {
        width: 48px;
        height: 48px;
      }
    }
  </style>
</head>
<body>
  <div class="bg-pattern"></div>
  
  <header class="doc-header">
    <div class="doc-header-left">
      <div class="doc-logo" title="BackEnd API">API</div>
      <div class="doc-title-group">
        <h1>BackEnd API Documentation</h1>
        <div class="doc-subtitle">
          <span class="doc-badge">v1.0</span>
          <span>User management & authentication</span>
        </div>
      </div>
    </div>
    <div class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
      <div class="theme-toggle-slider">☀️</div>
    </div>
  </header>

  <div class="doc-shell">
    <aside class="doc-aside">
      <div class="doc-card" style="margin-bottom: 20px;">
        <strong>🔐 Authentication</strong>
        <div style="margin-top:12px;font-size:13px;color:var(--text-secondary);line-height:1.8">
          <p style="margin-bottom:12px;color:var(--text-primary)">Most endpoints require JWT authentication. To authenticate:</p>
          <ol style="margin:0;padding-left:20px;list-style:decimal">
            <li style="margin:8px 0">Call <code>POST /login</code> with your credentials</li>
            <li style="margin:8px 0">Copy the returned <code>token</code></li>
            <li style="margin:8px 0">Click the <strong>🔓 Authorize</strong> button above</li>
            <li style="margin:8px 0">Enter: <code>Bearer &lt;your-token&gt;</code></li>
          </ol>
        </div>
      </div>

      <div class="doc-card" style="margin-bottom: 20px;">
        <strong>🌐 Servers</strong>
        <div style="margin-top:12px;font-size:13px;line-height:1.6">
          <div style="padding:10px;background:rgba(16,185,129,0.08);border-left:3px solid #10b981;border-radius:6px;margin-bottom:10px">
            <div style="color:#10b981;font-weight:600;margin-bottom:4px">🖥️ Development Server</div>
            <code style="background:rgba(16,185,129,0.15);color:#10b981;padding:4px 8px;border-radius:4px;font-size:12px;display:inline-block">http://localhost:3000</code>
          </div>
          <div style="padding:10px;background:rgba(11,116,255,0.08);border-left:3px solid var(--brand);border-radius:6px">
            <div style="color:var(--brand);font-weight:600;margin-bottom:4px">🌐 Production Server</div>
            <code style="background:rgba(11,116,255,0.15);color:var(--brand);padding:4px 8px;border-radius:4px;font-size:12px;display:inline-block">https://013-backend.vercel.app</code>
          </div>
        </div>
      </div>

      <div class="doc-card" style="margin-bottom: 20px;">
        <strong>📂 API Categories</strong>
        <div style="margin-top:12px;font-size:13px;line-height:1.8">
          <div style="margin-bottom:10px">
            <div style="color:var(--text-primary);font-weight:600">🏥 Health</div>
            <div style="color:var(--muted);font-size:12px;margin-top:2px">Health Check Endpoints — Monitor server and database status</div>
          </div>
          <div style="margin-bottom:10px">
            <div style="color:var(--text-primary);font-weight:600">🔐 Authentication</div>
            <div style="color:var(--muted);font-size:12px;margin-top:2px">Login, logout, and session management</div>
          </div>
          <div style="margin-bottom:10px">
            <div style="color:var(--text-primary);font-weight:600">👥 Users</div>
            <div style="color:var(--muted);font-size:12px;margin-top:2px">User Management — CRUD operations for user accounts</div>
          </div>
          <div>
            <div style="color:var(--text-primary);font-weight:600">🔧 Misc</div>
            <div style="color:var(--muted);font-size:12px;margin-top:2px">Miscellaneous — Other utility endpoints</div>
          </div>
        </div>
      </div>
      
      <div class="doc-card">
        <div style="text-align:center">
          <a href="mailto:support@api.com" style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;background:linear-gradient(135deg,var(--brand),var(--accent));color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:13px;transition:all 0.3s;box-shadow:var(--shadow-sm)" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='var(--shadow-brand)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='var(--shadow-sm)'">
            📧 Contact API Support
          </a>
          <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
            <div style="font-size:12px;color:var(--muted);margin-bottom:8px">
              <span style="background:rgba(16,185,129,0.1);color:#10b981;padding:3px 8px;border-radius:4px;font-weight:600">MIT License</span>
            </div>
            <a href="#" style="color:var(--brand);text-decoration:none;font-size:12px;font-weight:500;transition:all 0.2s" onmouseover="this.style.color='var(--brand-dark)'" onmouseout="this.style.color='var(--brand)'">
              📖 Learn more about this API →
            </a>
          </div>
        </div>
      </div>
    </aside>

    <main class="doc-main">
      <!-- Quick Start Section -->
      <div class="doc-card" style="margin-bottom: 24px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <div style="width:48px;height:48px;background:linear-gradient(135deg,var(--brand),var(--accent));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px">📚</div>
          <div>
            <h2 style="font-size:20px;font-weight:700;color:var(--text-primary);margin:0">Quick Start</h2>
            <p style="font-size:13px;color:var(--muted);margin:4px 0 0">Essential endpoints at a glance</p>
          </div>
        </div>
        
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
              <tr style="background:var(--bg-secondary)">
                <th style="padding:12px;text-align:left;font-weight:600;color:var(--text-primary);border-bottom:2px solid var(--border)">Action</th>
                <th style="padding:12px;text-align:left;font-weight:600;color:var(--text-primary);border-bottom:2px solid var(--border)">Endpoint</th>
                <th style="padding:12px;text-align:center;font-weight:600;color:var(--text-primary);border-bottom:2px solid var(--border)">Auth</th>
                <th style="padding:12px;text-align:left;font-weight:600;color:var(--text-primary);border-bottom:2px solid var(--border)">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border);transition:all 0.2s" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                <td style="padding:12px;color:var(--text-secondary);font-weight:500">Login</td>
                <td style="padding:12px"><code style="background:rgba(11,116,255,0.1);color:var(--brand);padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600">POST /login</code></td>
                <td style="padding:12px;text-align:center">❌</td>
                <td style="padding:12px;color:var(--text-secondary)">Authenticate user and get JWT token</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border);transition:all 0.2s" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                <td style="padding:12px;color:var(--text-secondary);font-weight:500">Register</td>
                <td style="padding:12px"><code style="background:rgba(11,116,255,0.1);color:var(--brand);padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600">POST /api/users</code></td>
                <td style="padding:12px;text-align:center">❌</td>
                <td style="padding:12px;color:var(--text-secondary)">Create a new user account</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border);transition:all 0.2s" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                <td style="padding:12px;color:var(--text-secondary);font-weight:500">Get All Users</td>
                <td style="padding:12px"><code style="background:rgba(16,185,129,0.1);color:#10b981;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600">GET /api/users</code></td>
                <td style="padding:12px;text-align:center">✅</td>
                <td style="padding:12px;color:var(--text-secondary)">Retrieve list of all users</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border);transition:all 0.2s" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                <td style="padding:12px;color:var(--text-secondary);font-weight:500">Get User by ID</td>
                <td style="padding:12px"><code style="background:rgba(16,185,129,0.1);color:#10b981;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600">GET /api/users/:id</code></td>
                <td style="padding:12px;text-align:center">✅</td>
                <td style="padding:12px;color:var(--text-secondary)">Get specific user details</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border);transition:all 0.2s" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                <td style="padding:12px;color:var(--text-secondary);font-weight:500">Update User</td>
                <td style="padding:12px"><code style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600">PUT /api/users/:id</code></td>
                <td style="padding:12px;text-align:center">✅</td>
                <td style="padding:12px;color:var(--text-secondary)">Update user information</td>
              </tr>
              <tr style="transition:all 0.2s" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                <td style="padding:12px;color:var(--text-secondary);font-weight:500">Delete User</td>
                <td style="padding:12px"><code style="background:rgba(239,68,68,0.1);color:#ef4444;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600">DELETE /api/users/:id</code></td>
                <td style="padding:12px;text-align:center">✅</td>
                <td style="padding:12px;color:var(--text-secondary)">Remove user from system</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Swagger UI -->
      <div id="swagger-ui" class="doc-card loading"></div>
    </main>
  </div>

  <div class="fab">
    <button class="fab-btn" onclick="scrollToTop()" title="Scroll to top">↑</button>
  </div>

  <footer class="doc-footer">
    Made with ❤️ • BackEnd API Documentation
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    // Theme Management
    function toggleTheme() {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      const slider = document.querySelector('.theme-toggle-slider');
      slider.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelector('.theme-toggle-slider').textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    // Smooth scroll to top
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initialize Swagger UI
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

      // Remove loading state
      setTimeout(() => {
        document.getElementById('swagger-ui').classList.remove('loading');
      }, 500);

      // Enhance search placeholder
      const tryFocus = () => {
        const el = document.querySelector('.search__field') || document.querySelector('input[type="search"]');
        if (el) el.setAttribute('placeholder', '🔍 Search endpoints...');
      };
      setTimeout(tryFocus, 300);
    };

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
      const fab = document.querySelector('.fab');
      if (window.scrollY > 300) {
        fab.style.opacity = '1';
      } else {
        fab.style.opacity = '0.6';
      }
    });
  </script>
  </body>
  </html>`;
  res.setHeader("Content-Type", "text/html");
  res.send(swaggerHtml);
});

// Mount users router (CommonJS)
const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);
app.use("/users", usersRouter);



// Export the app for serverless wrappers and tests.
// Provide both default export (module.exports = app) and a named property
// so consumers using either `require('../index')` or `const { app } = require('../index')`
// will work.
module.exports = app;
module.exports.app = app;