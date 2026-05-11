<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Task Over</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%233a3aff'/><text x='50' y='68' font-family='Georgia,serif' font-size='42' font-weight='bold' fill='white' text-anchor='middle'>TO</text></svg>">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Georgia, serif;
      background-color: #f0f4ff;
      color: #222;
      min-height: 100vh;
    }

    /* ==============================
       SHARED CARD STYLES
    ============================== */
    .page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 20px;
    }

    .card {
      background: white;
      border: 2px solid #dce0ff;
      border-radius: 16px;
      padding: 36px 32px;
      width: 100%;
      max-width: 380px;
      text-align: center;
    }

    .to-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 12px;
    }

    .to-logo-box {
      width: 52px;
      height: 52px;
      background: #3a3aff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      color: white;
      letter-spacing: -1px;
    }

    .card-title {
      font-size: 28px;
      color: #3a3aff;
      font-weight: bold;
      letter-spacing: -1px;
      margin-bottom: 5px;
    }

    .card-subtitle {
      font-size: 13px;
      color: #999;
      margin-bottom: 24px;
    }

    .field-label {
      text-align: left;
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
      display: block;
    }

    .field-input {
      width: 100%;
      padding: 10px 13px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 14px;
      font-family: Georgia, serif;
      margin-bottom: 13px;
      outline: none;
    }

    .field-input:focus { border-color: #3a3aff; }
    .field-input.err { border-color: #cc0000; }

    .primary-btn {
      width: 100%;
      padding: 12px;
      background: #3a3aff;
      color: white;
      border: none;
      border-radius: 9px;
      font-size: 15px;
      font-family: Georgia, serif;
      font-weight: bold;
      cursor: pointer;
      margin-top: 2px;
      margin-bottom: 10px;
    }

    .primary-btn:hover { background: #2222cc; }
    .primary-btn:disabled { background: #aaa; cursor: not-allowed; }

    .error-box {
      background: #fff0f0;
      border: 1px solid #ffaaaa;
      color: #cc0000;
      font-size: 13px;
      border-radius: 8px;
      padding: 9px 13px;
      margin-bottom: 12px;
      display: none;
      text-align: left;
    }

    .error-box.show { display: block; }

    .success-box {
      background: #f0fff4;
      border: 1px solid #aaeeaa;
      color: #226622;
      font-size: 13px;
      border-radius: 8px;
      padding: 9px 13px;
      margin-bottom: 12px;
      display: none;
      text-align: left;
    }

    .success-box.show { display: block; }

    .link-btn {
      background: none;
      border: none;
      color: #3a3aff;
      font-size: 13px;
      cursor: pointer;
      font-family: Georgia, serif;
      text-decoration: underline;
    }

    .link-btn:hover { color: #2222cc; }

    .card-footer {
      margin-top: 18px;
      font-size: 12px;
      color: #bbb;
    }

    /* ==============================
       LOGIN PAGE
    ============================== */
    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 11px 16px;
      border-radius: 9px;
      font-size: 14px;
      font-family: Georgia, serif;
      cursor: pointer;
      margin-bottom: 10px;
      font-weight: bold;
      transition: opacity 0.15s;
    }

    .social-btn:hover { opacity: 0.85; }
    .google-btn { background: white; border: 2px solid #ddd; color: #333; }
    .apple-btn { background: #111; border: 2px solid #111; color: white; }
    .google-icon { width: 18px; height: 18px; }
    .apple-icon { font-size: 18px; line-height: 1; }

    .divider {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 16px 0;
      color: #bbb;
      font-size: 12px;
    }

    .divider::before,
    .divider::after { content: ''; flex: 1; height: 1px; background: #e0e0e0; }

    /* ==============================
       SOCIAL POPUP
    ============================== */
    .overlay {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.45);
      z-index: 100;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .overlay.show { display: flex; }

    .popup {
      background: white;
      border-radius: 14px;
      padding: 30px 28px;
      width: 100%;
      max-width: 340px;
      text-align: center;
      position: relative;
    }

    .popup-close {
      position: absolute;
      top: 12px; right: 16px;
      background: none; border: none;
      font-size: 20px; color: #bbb;
      cursor: pointer; line-height: 1;
    }

    .popup-close:hover { color: #cc0000; }
    .popup-icon { font-size: 36px; margin-bottom: 10px; }
    .popup-title { font-size: 18px; font-weight: bold; color: #222; margin-bottom: 5px; }
    .popup-subtitle { font-size: 13px; color: #999; margin-bottom: 20px; }

    .google-confirm { background: #4285F4; }
    .google-confirm:hover { background: #2a6fd6; }
    .apple-confirm { background: #111; }
    .apple-confirm:hover { background: #333; }

    /* ==============================
       VERIFY CODE POPUP
    ============================== */
    .verify-input {
      width: 100%;
      padding: 14px;
      border: 2px solid #dce0ff;
      border-radius: 10px;
      font-size: 26px;
      font-family: monospace;
      text-align: center;
      letter-spacing: 8px;
      outline: none;
      margin-bottom: 10px;
    }

    .verify-input:focus { border-color: #3a3aff; }
    .verify-input.err { border-color: #cc0000; }

    .verify-timer { font-size: 12px; color: #888; margin-bottom: 12px; }
    .verify-timer.expired { color: #cc0000; }

    /* ==============================
       MAIN APP
    ============================== */
    #app-page { display: none; padding: 30px 20px; }
    .container { max-width: 650px; margin: 0 auto; }

    .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }

    .app-logo { display: flex; align-items: center; gap: 12px; }

    .logo-circle {
      width: 44px; height: 44px;
      background: #3a3aff;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: bold; color: white;
      letter-spacing: -1px; flex-shrink: 0;
    }

    .app-title-wrap h1 { font-size: 34px; color: #3a3aff; letter-spacing: -1px; }
    .app-title-wrap p { font-size: 13px; color: #999; margin-top: 2px; }

    .user-area { display: flex; align-items: center; gap: 10px; }

    .user-badge {
      font-size: 13px; color: #555;
      background: #eeeeff;
      border: 1px solid #dce0ff;
      padding: 5px 12px; border-radius: 20px;
    }

    .logout-btn {
      font-size: 13px; padding: 5px 12px;
      background: white; border: 1px solid #ddd;
      border-radius: 20px; cursor: pointer;
      color: #888; font-family: Georgia, serif;
    }

    .logout-btn:hover { border-color: #cc0000; color: #cc0000; }

    .tabs { display: flex; gap: 5px; margin-bottom: 20px; border-bottom: 2px solid #dce0ff; }

    .tab-btn {
      padding: 10px 20px; font-size: 15px;
      border: none; background: none; color: #888;
      cursor: pointer; border-bottom: 3px solid transparent;
      margin-bottom: -2px; font-family: Georgia, serif;
    }

    .tab-btn:hover { color: #3a3aff; }
    .tab-btn.active { color: #3a3aff; border-bottom: 3px solid #3a3aff; font-weight: bold; }
    .tab-section { display: none; }
    .tab-section.active { display: block; }

    .reminder-box {
      background: #fff0f0; border: 2px solid #ffaaaa;
      border-radius: 10px; padding: 12px 16px;
      margin-bottom: 18px; font-size: 14px;
      color: #cc0000; display: none;
    }

    .reminder-box.show { display: block; }

    .add-form { background: white; border: 2px solid #dce0ff; border-radius: 12px; padding: 18px; margin-bottom: 18px; }
    .add-form h2 { font-size: 16px; color: #3a3aff; margin-bottom: 12px; }

    .form-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; }
    .form-group { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 130px; }
    .form-group label { font-size: 12px; color: #666; }

    .form-group input {
      padding: 9px 12px; border: 1px solid #ccc;
      border-radius: 8px; font-size: 14px;
      font-family: Georgia, serif; outline: none;
    }

    .form-group input:focus { border-color: #3a3aff; }

    .add-btn {
      padding: 9px 20px; background: #3a3aff; color: white;
      border: none; border-radius: 8px; font-size: 14px;
      cursor: pointer; font-family: Georgia, serif; height: 38px;
    }

    .add-btn:hover { background: #2222cc; }

    .filter-row { display: flex; gap: 7px; margin-bottom: 14px; flex-wrap: wrap; }

    .filter-pill {
      font-size: 12px; padding: 5px 14px;
      border-radius: 20px; border: 1px solid #ccc;
      background: white; color: #666; cursor: pointer;
      font-family: Georgia, serif;
    }

    .filter-pill.active { background: #3a3aff; color: white; border-color: #3a3aff; }

    .task-list { display: flex; flex-direction: column; gap: 9px; }

    .task-card {
      background: white; border: 2px solid #dce0ff;
      border-radius: 10px; padding: 12px 16px;
      display: flex; align-items: center; gap: 12px;
    }

    .task-card.overdue { border-color: #ffaaaa; background: #fff8f8; }
    .task-card.task-done { opacity: 0.5; }

    .check-circle {
      width: 22px; height: 22px; border-radius: 50%;
      border: 2px solid #aaa; display: flex;
      align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0; font-size: 12px;
    }

    .check-circle:hover { border-color: #3a3aff; }
    .check-circle.checked { background: #22aa44; border-color: #22aa44; color: white; }

    .task-info { flex: 1; }
    .task-name { font-size: 15px; font-weight: bold; color: #222; }
    .task-name.strikethrough { text-decoration: line-through; color: #999; }
    .task-due { font-size: 12px; color: #888; margin-top: 2px; }

    .overdue-label {
      font-size: 11px; background: #ffeeee; color: #cc0000;
      border: 1px solid #ffaaaa; padding: 3px 9px;
      border-radius: 20px; white-space: nowrap;
    }

    /* priority badges */
    .priority-badge {
      font-size: 11px;
      padding: 3px 9px;
      border-radius: 20px;
      white-space: nowrap;
      font-weight: bold;
      margin-right: 4px;
    }

    .priority-high   { background: #ffeeee; color: #cc0000; border: 1px solid #ffaaaa; }
    .priority-medium { background: #fff8ee; color: #cc7700; border: 1px solid #ffcc88; }
    .priority-low    { background: #eeffee; color: #226622; border: 1px solid #aaeeaa; }

    /* priority dropdown in the form */
    .priority-select {
      padding: 9px 12px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 14px;
      font-family: Georgia, serif;
      outline: none;
      background: white;
      cursor: pointer;
    }

    .priority-select:focus { border-color: #3a3aff; }

    .del-btn { background: none; border: none; color: #bbb; cursor: pointer; font-size: 16px; padding: 2px 6px; border-radius: 6px; }
    .del-btn:hover { background: #f5f5f5; color: #cc0000; }
    .empty-msg { text-align: center; color: #aaa; font-size: 14px; padding: 30px; }

    /* CALCULATOR */
    .calc-wrap { max-width: 290px; margin: 0 auto; }
    .calc-display { background: #222; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; text-align: right; }
    .calc-expr { font-size: 13px; color: #888; min-height: 18px; font-family: monospace; }
    .calc-result { font-size: 30px; color: white; font-family: monospace; word-break: break-all; }
    .calc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .c-btn { padding: 16px 6px; font-size: 16px; border-radius: 8px; border: none; cursor: pointer; font-family: monospace; transition: transform 0.07s; }
    .c-btn:active { transform: scale(0.93); }
    .c-btn.num { background: #e8eaff; color: #222; }
    .c-btn.num:hover { background: #d0d4ff; }
    .c-btn.op { background: #3a3aff; color: white; }
    .c-btn.op:hover { background: #2222cc; }
    .c-btn.eq { background: #ff6600; color: white; }
    .c-btn.eq:hover { background: #cc5200; }
    .c-btn.clr { background: #cc0000; color: white; }
    .c-btn.clr:hover { background: #aa0000; }
    .c-btn.wide { grid-column: span 2; }
    .calc-tip { text-align: center; font-size: 12px; color: #888; margin-top: 14px; font-style: italic; }

    .app-footer { text-align: center; margin-top: 40px; padding-bottom: 20px; font-size: 12px; color: #bbb; font-family: Georgia, serif; }
  </style>
</head>
<body onload="onPageLoad()">

  <!-- ==============================
       PAGE 1 - LOGIN
  ============================== -->
  <div id="login-page" class="page">
    <div class="card">
      <div class="to-logo"><div class="to-logo-box">TO</div></div>
      <div class="card-title">Task Over</div>
      <div class="card-subtitle">Sign in to manage your tasks</div>

      <button class="social-btn google-btn" onclick="openSocialPopup('Google')">
        <svg class="google-icon" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.09-6.09C34.46 3.04 29.53 1 24 1 14.82 1 7.07 6.48 3.64 14.18l7.08 5.5C12.4 13.48 17.73 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.67c-.55 2.97-2.2 5.48-4.67 7.17l7.19 5.59C43.18 37.3 46.5 31.36 46.5 24.5z"/>
          <path fill="#FBBC05" d="M10.72 28.32A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.72-4.32l-7.08-5.5A23.9 23.9 0 0 0 .5 24c0 3.86.92 7.5 2.55 10.72l7.67-6.4z"/>
          <path fill="#34A853" d="M24 46.5c5.53 0 10.17-1.84 13.56-4.99l-7.19-5.59c-1.84 1.24-4.2 1.98-6.37 1.98-6.27 0-11.6-3.98-13.28-9.58l-7.67 6.4C7.07 41.52 14.82 46.5 24 46.5z"/>
        </svg>
        Continue with Google
      </button>

      <button class="social-btn apple-btn" onclick="openSocialPopup('Apple')">
        <span class="apple-icon">&#63743;</span>
        Continue with Apple
      </button>

      <div class="divider">or sign in with email</div>

      <div id="login-error" class="error-box"></div>

      <label class="field-label">Email address</label>
      <input class="field-input" type="email" id="login-email" placeholder="yourname@gmail.com" />

      <label class="field-label">Password</label>
      <input class="field-input" type="password" id="login-password" placeholder="Enter your password" onkeydown="if(event.key==='Enter') doEmailLogin()" />

      <button class="primary-btn" onclick="doEmailLogin()">Sign In</button>

      <div class="card-footer">
        New here? Use Google or Apple above to create your account.
      </div>
    </div>
  </div>

  <!-- ==============================
       SOCIAL POPUP - name + email
  ============================== -->
  <div id="social-overlay" class="overlay">
    <div class="popup">
      <button class="popup-close" onclick="closeSocialPopup()">&#10005;</button>
      <div class="popup-icon" id="popup-icon"></div>
      <div class="popup-title" id="popup-title"></div>
      <div class="popup-subtitle" id="popup-subtitle"></div>

      <div id="popup-error" class="error-box"></div>

      <label class="field-label">Full name</label>
      <input class="field-input" type="text" id="popup-name" placeholder="e.g. John Smith" />

      <label class="field-label">Email address</label>
      <input class="field-input" type="email" id="popup-email" placeholder="e.g. yourname@gmail.com"
        onkeydown="if(event.key==='Enter') confirmSocialLogin()"
        oninput="this.classList.remove('err')" />

      <button class="primary-btn" id="popup-confirm-btn" onclick="confirmSocialLogin()">Send Verification Code</button>
      <button class="link-btn" onclick="closeSocialPopup()">Cancel</button>
    </div>
  </div>

  <!-- ==============================
       VERIFY CODE POPUP
  ============================== -->
  <div id="verify-overlay" class="overlay">
    <div class="popup">
      <div class="popup-icon">📧</div>
      <div class="popup-title">Check your email!</div>
      <div class="popup-subtitle" id="verify-subtitle"></div>

      <div id="verify-error" class="error-box"></div>

      <input class="verify-input" type="text" id="verify-input" maxlength="6" placeholder="000000"
        onkeydown="if(event.key==='Enter') checkCode()"
        oninput="this.classList.remove('err'); document.getElementById('verify-error').classList.remove('show')" />

      <div class="verify-timer" id="verify-timer">Code expires in 10:00</div>

      <button class="primary-btn" onclick="checkCode()">Verify Email</button>
      <button class="link-btn" id="resend-btn" onclick="resendCode()" disabled style="color:#bbb; text-decoration:none;">Resend code</button>
    </div>
  </div>

  <!-- ==============================
       CREATE PASSWORD PAGE
  ============================== -->
  <div id="create-password-page" class="page" style="display:none;">
    <div class="card">
      <div class="to-logo"><div class="to-logo-box">TO</div></div>
      <div class="card-title">One last step!</div>
      <div class="card-subtitle">Create a password so you can sign in faster next time</div>

      <div id="create-pw-error" class="error-box"></div>

      <label class="field-label">Choose a password</label>
      <input class="field-input" type="password" id="create-pw1" placeholder="At least 6 characters" />

      <label class="field-label">Confirm your password</label>
      <input class="field-input" type="password" id="create-pw2" placeholder="Type it again"
        onkeydown="if(event.key==='Enter') savePassword()" />

      <button class="primary-btn" onclick="savePassword()">Create Account & Sign In</button>
    </div>
  </div>

  <!-- ==============================
       MAIN APP
  ============================== -->
  <div id="app-page">
    <div class="container">

      <div class="top-bar">
        <div class="app-logo">
          <div class="logo-circle">TO</div>
          <div class="app-title-wrap">
            <h1>Task Over</h1>
            <p>Keep track of your assignments and due dates</p>
          </div>
        </div>
        <div class="user-area">
          <span class="user-badge" id="user-badge"></span>
          <button class="logout-btn" onclick="doLogout()" onmouseover="highlightLogout(this)" onmouseout="unhighlightLogout(this)">Log out</button>
        </div>
      </div>

      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab('tasks', this)">My Tasks</button>
        <button class="tab-btn" onclick="switchTab('calc', this)">Calculator</button>
      </div>

      <div id="tab-tasks" class="tab-section active">
        <div id="reminder-box" class="reminder-box"></div>

        <div class="add-form">
          <h2>Add a new task</h2>
          <div class="form-row">
            <div class="form-group">
              <label>What do you need to finish?</label>
              <input type="text" id="task-input" placeholder="e.g. Math homework chapter 5" />
            </div>
            <div class="form-group" style="max-width:155px;">
              <label>Due date</label>
              <input type="date" id="date-input" />
            </div>
            <div class="form-group" style="max-width:130px;">
              <label>Priority</label>
              <select id="priority-input" class="priority-select">
                <option value="auto">Auto (by date)</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <button class="add-btn" onclick="addTask()">Add Task</button>
          </div>
        </div>

        <div class="filter-row">
          <button class="filter-pill active" onclick="setFilter('all', this)">All</button>
          <button class="filter-pill" onclick="setFilter('active', this)">Active</button>
          <button class="filter-pill" onclick="setFilter('overdue', this)">Overdue</button>
          <button class="filter-pill" onclick="setFilter('done', this)">Done</button>
        </div>

        <div class="task-list" id="task-list">
          <div class="empty-msg">No tasks yet! Add one above to get started.</div>
        </div>
      </div>

      <div id="tab-calc" class="tab-section">
        <div class="calc-wrap">
          <div class="calc-display">
            <div class="calc-expr" id="calc-expr"></div>
            <div class="calc-result" id="calc-result">0</div>
          </div>
          <div class="calc-grid">
            <button class="c-btn clr" onclick="calcClear()">C</button>
            <button class="c-btn op" onclick="calcSign()">+/-</button>
            <button class="c-btn op" onclick="calcPercent()">%</button>
            <button class="c-btn op" onclick="calcOp('/')">÷</button>
            <button class="c-btn num" onclick="calcNum('7')">7</button>
            <button class="c-btn num" onclick="calcNum('8')">8</button>
            <button class="c-btn num" onclick="calcNum('9')">9</button>
            <button class="c-btn op" onclick="calcOp('*')">×</button>
            <button class="c-btn num" onclick="calcNum('4')">4</button>
            <button class="c-btn num" onclick="calcNum('5')">5</button>
            <button class="c-btn num" onclick="calcNum('6')">6</button>
            <button class="c-btn op" onclick="calcOp('-')">−</button>
            <button class="c-btn num" onclick="calcNum('1')">1</button>
            <button class="c-btn num" onclick="calcNum('2')">2</button>
            <button class="c-btn num" onclick="calcNum('3')">3</button>
            <button class="c-btn op" onclick="calcOp('+')">+</button>
            <button class="c-btn num wide" onclick="calcNum('0')">0</button>
            <button class="c-btn num" onclick="calcDot()">.</button>
            <button class="c-btn eq" onclick="calcEquals()">=</button>
          </div>
          <div class="calc-tip">Tip: You can also use your keyboard!</div>
        </div>
      </div>

      <div class="app-footer">Built by Krishav Soundarapandian</div>
    </div>
  </div>

  <script>

    // ==============================
    // ACCOUNTS - stored in localStorage
    // accounts are saved like this:
    // { name, email, password, tasks[] }
    // ==============================

    // the admin account is always there
    var ADMIN_EMAIL    = 'admin';
    var ADMIN_PASSWORD = 'password123';

    var loggedInEmail = null;
    var currentProvider = '';
    var pendingName  = '';
    var pendingEmail = '';

    // verification code stuff
    var generatedCode  = '';
    var codeExpireTime = null;
    var timerInterval  = null;

    // ==============================
    // HELPER - get/save all accounts
    // ==============================
    function getAllAccounts() {
      var data = localStorage.getItem('taskover_accounts');
      if (!data) return {};
      try { return JSON.parse(data); } catch(e) { return {}; }
    }

    function saveAllAccounts(accounts) {
      localStorage.setItem('taskover_accounts', JSON.stringify(accounts));
    }

    function getAccount(email) {
      var accounts = getAllAccounts();
      return accounts[email.toLowerCase()] || null;
    }

    function saveAccount(email, data) {
      var accounts = getAllAccounts();
      accounts[email.toLowerCase()] = data;
      saveAllAccounts(accounts);
    }

    // ==============================
    // EMAIL/PASSWORD LOGIN
    // ==============================
    function doEmailLogin() {
      var email    = document.getElementById('login-email').value.trim();
      var password = document.getElementById('login-password').value;
      var errorEl  = document.getElementById('login-error');

      if (email === '' || password === '') {
        errorEl.textContent = 'Please enter your email and password!';
        errorEl.classList.add('show');
        return;
      }

      // check admin account
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        errorEl.classList.remove('show');
        loggedInEmail = ADMIN_EMAIL;
        showApp('Admin');
        return;
      }

      // check saved accounts
      var account = getAccount(email);
      if (!account) {
        errorEl.textContent = 'No account found with that email. Please sign up with Google or Apple first!';
        errorEl.classList.add('show');
        return;
      }

      if (account.password !== password) {
        errorEl.textContent = 'Wrong password. Please try again!';
        errorEl.classList.add('show');
        document.getElementById('login-password').value = '';
        return;
      }

      // all good!
      errorEl.classList.remove('show');
      loggedInEmail = email.toLowerCase();
      showApp(account.name);
    }

    // ==============================
    // EMAIL VALIDATION
    // ==============================
    function isValidEmail(email) {
      if (email.indexOf(' ') !== -1) return false;
      var atCount = 0;
      for (var i = 0; i < email.length; i++) { if (email[i] === '@') atCount++; }
      if (atCount !== 1) return false;
      var parts = email.split('@');
      var local = parts[0], domain = parts[1];
      if (!local || !domain) return false;
      if (domain.indexOf('.') === -1) return false;
      if (domain[0] === '.' || domain[domain.length-1] === '.') return false;
      if (domain.indexOf('..') !== -1) return false;
      var ext = domain.split('.').pop();
      if (ext.length < 2) return false;
      if (local[0] === '.' || local[local.length-1] === '.') return false;
      if (local.indexOf('..') !== -1) return false;
      return true;
    }

    // ==============================
    // SOCIAL LOGIN POPUP
    // ==============================
    function openSocialPopup(provider) {
      currentProvider = provider;
      var iconEl    = document.getElementById('popup-icon');
      var titleEl   = document.getElementById('popup-title');
      var subEl     = document.getElementById('popup-subtitle');
      var confirmBtn = document.getElementById('popup-confirm-btn');

      if (provider === 'Google') {
        iconEl.innerHTML = '<svg width="36" height="36" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.09-6.09C34.46 3.04 29.53 1 24 1 14.82 1 7.07 6.48 3.64 14.18l7.08 5.5C12.4 13.48 17.73 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.67c-.55 2.97-2.2 5.48-4.67 7.17l7.19 5.59C43.18 37.3 46.5 31.36 46.5 24.5z"/><path fill="#FBBC05" d="M10.72 28.32A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.72-4.32l-7.08-5.5A23.9 23.9 0 0 0 .5 24c0 3.86.92 7.5 2.55 10.72l7.67-6.4z"/><path fill="#34A853" d="M24 46.5c5.53 0 10.17-1.84 13.56-4.99l-7.19-5.59c-1.84 1.24-4.2 1.98-6.37 1.98-6.27 0-11.6-3.98-13.28-9.58l-7.67 6.4C7.07 41.52 14.82 46.5 24 46.5z"/></svg>';
        titleEl.textContent = 'Sign in with Google';
        subEl.textContent   = 'Enter the details linked to your Google account';
        confirmBtn.className = 'primary-btn google-confirm';
        document.getElementById('popup-email').placeholder = 'yourname@gmail.com';
      } else {
        iconEl.innerHTML    = '<span style="font-size:36px;">&#63743;</span>';
        titleEl.textContent = 'Sign in with Apple';
        subEl.textContent   = 'Enter the details linked to your Apple ID';
        confirmBtn.className = 'primary-btn apple-confirm';
        document.getElementById('popup-email').placeholder = 'yourname@icloud.com';
      }

      document.getElementById('popup-name').value  = '';
      document.getElementById('popup-email').value = '';
      document.getElementById('popup-error').classList.remove('show');
      document.getElementById('social-overlay').classList.add('show');
      setTimeout(function() { document.getElementById('popup-name').focus(); }, 100);
    }

    function closeSocialPopup() {
      document.getElementById('social-overlay').classList.remove('show');
    }

    document.getElementById('social-overlay').addEventListener('click', function(e) {
      if (e.target === this) closeSocialPopup();
    });

    function confirmSocialLogin() {
      var name  = document.getElementById('popup-name').value.trim();
      var email = document.getElementById('popup-email').value.trim();
      var errorEl    = document.getElementById('popup-error');
      var confirmBtn = document.getElementById('popup-confirm-btn');

      if (!name) { errorEl.textContent = 'Please enter your full name!'; errorEl.classList.add('show'); return; }
      if (!email) { errorEl.textContent = 'Please enter your email address!'; errorEl.classList.add('show'); return; }
      if (!isValidEmail(email)) {
        errorEl.textContent = 'That email doesn\'t look right. Please double check it!';
        errorEl.classList.add('show');
        document.getElementById('popup-email').classList.add('err');
        return;
      }

      pendingName  = name;
      pendingEmail = email.toLowerCase();

      confirmBtn.disabled    = true;
      confirmBtn.textContent = 'Sending code...';
      errorEl.classList.remove('show');

      // generate 6 digit code
      generatedCode  = String(Math.floor(100000 + Math.random() * 900000));
      codeExpireTime = new Date().getTime() + (10 * 60 * 1000);

      // send via EmailJS REST API
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_vx3ger5',
          template_id: 'template_r7lsfdx',
          user_id: 'NG0_nwcaKrYNZBb7Q',
          template_params: {
            email: email,
            to_name: name,
            passcode: generatedCode,
            time: new Date(codeExpireTime).toLocaleTimeString()
          }
        })
      }).then(function(response) {
        confirmBtn.disabled    = false;
        confirmBtn.textContent = 'Send Verification Code';
        if (response.ok) {
          closeSocialPopup();
          openVerifyPopup();
        } else {
          errorEl.textContent = 'Could not send the email. Please try again!';
          errorEl.classList.add('show');
        }
      }).catch(function() {
        confirmBtn.disabled    = false;
        confirmBtn.textContent = 'Send Verification Code';
        errorEl.textContent = 'Could not send the email. Check your connection!';
        errorEl.classList.add('show');
      });
    }

    // ==============================
    // VERIFY CODE POPUP
    // ==============================
    function openVerifyPopup() {
      document.getElementById('verify-subtitle').textContent =
        'We sent a 6-digit code to ' + pendingEmail + '. Enter it below — expires in 10 minutes.';
      document.getElementById('verify-input').value = '';
      document.getElementById('verify-error').classList.remove('show');
      document.getElementById('verify-overlay').classList.add('show');
      startTimer();

      var resendBtn = document.getElementById('resend-btn');
      resendBtn.disabled = true;
      resendBtn.style.color = '#bbb';
      resendBtn.style.textDecoration = 'none';
      setTimeout(function() {
        resendBtn.disabled = false;
        resendBtn.style.color = '#3a3aff';
        resendBtn.style.textDecoration = 'underline';
      }, 30000);

      setTimeout(function() { document.getElementById('verify-input').focus(); }, 100);
    }

    function startTimer() {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(function() {
        var left = codeExpireTime - new Date().getTime();
        var timerEl = document.getElementById('verify-timer');
        if (left <= 0) {
          clearInterval(timerInterval);
          timerEl.textContent = 'Code has expired! Please resend.';
          timerEl.classList.add('expired');
          return;
        }
        var m = Math.floor(left / 60000);
        var s = Math.floor((left % 60000) / 1000);
        timerEl.textContent = 'Code expires in ' + m + ':' + (s < 10 ? '0' : '') + s;
        timerEl.classList.remove('expired');
      }, 1000);
    }

    function checkCode() {
      var entered = document.getElementById('verify-input').value.trim();
      var errorEl = document.getElementById('verify-error');
      var inputEl = document.getElementById('verify-input');

      if (!entered) {
        errorEl.textContent = 'Please enter the 6-digit code!';
        errorEl.classList.add('show');
        inputEl.classList.add('err');
        return;
      }
      if (new Date().getTime() > codeExpireTime) {
        errorEl.textContent = 'That code has expired! Please resend a new one.';
        errorEl.classList.add('show');
        inputEl.classList.add('err');
        return;
      }
      if (entered !== generatedCode) {
        errorEl.textContent = 'Wrong code! Please try again.';
        errorEl.classList.add('show');
        inputEl.classList.add('err');
        return;
      }

      // code is correct! now check if they already have an account
      clearInterval(timerInterval);
      document.getElementById('verify-overlay').classList.remove('show');

      var existing = getAccount(pendingEmail);
      if (existing) {
        // account already exists - just log them in!
        loggedInEmail = pendingEmail;
        showApp(existing.name);
      } else {
        // new user - ask them to create a password
        showCreatePassword();
      }
    }

    function resendCode() {
      generatedCode  = String(Math.floor(100000 + Math.random() * 900000));
      codeExpireTime = new Date().getTime() + (10 * 60 * 1000);

      var resendBtn = document.getElementById('resend-btn');
      resendBtn.disabled = true;
      resendBtn.style.color = '#bbb';
      resendBtn.style.textDecoration = 'none';

      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_vx3ger5',
          template_id: 'template_r7lsfdx',
          user_id: 'NG0_nwcaKrYNZBb7Q',
          template_params: {
            email: pendingEmail,
            to_name: pendingName,
            passcode: generatedCode,
            time: new Date(codeExpireTime).toLocaleTimeString()
          }
        })
      }).then(function(response) {
        if (response.ok) {
          startTimer();
          document.getElementById('verify-input').value = '';
          document.getElementById('verify-error').classList.remove('show');
          setTimeout(function() {
            resendBtn.disabled = false;
            resendBtn.style.color = '#3a3aff';
            resendBtn.style.textDecoration = 'underline';
          }, 30000);
        } else {
          var errorEl = document.getElementById('verify-error');
          errorEl.textContent = 'Could not resend. Please try again!';
          errorEl.classList.add('show');
          resendBtn.disabled = false;
        }
      }).catch(function() {
        var errorEl = document.getElementById('verify-error');
        errorEl.textContent = 'Could not resend. Check your connection!';
        errorEl.classList.add('show');
        resendBtn.disabled = false;
      });
    }

    // ==============================
    // CREATE PASSWORD PAGE
    // ==============================
    function showCreatePassword() {
      hideAllPages();
      document.getElementById('create-password-page').style.display = 'flex';
      document.getElementById('create-pw1').value = '';
      document.getElementById('create-pw2').value = '';
      document.getElementById('create-pw-error').classList.remove('show');
      setTimeout(function() { document.getElementById('create-pw1').focus(); }, 100);
    }

    function savePassword() {
      var pw1     = document.getElementById('create-pw1').value;
      var pw2     = document.getElementById('create-pw2').value;
      var errorEl = document.getElementById('create-pw-error');

      if (!pw1) {
        errorEl.textContent = 'Please choose a password!';
        errorEl.classList.add('show');
        return;
      }
      if (pw1.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters!';
        errorEl.classList.add('show');
        return;
      }
      if (pw1 !== pw2) {
        errorEl.textContent = 'The passwords don\'t match. Try again!';
        errorEl.classList.add('show');
        document.getElementById('create-pw2').value = '';
        return;
      }

      // save the new account to localStorage
      saveAccount(pendingEmail, {
        name: pendingName,
        email: pendingEmail,
        password: pw1,
        tasks: []
      });

      loggedInEmail = pendingEmail;
      showApp(pendingName);
    }

    // ==============================
    // SHOW / HIDE PAGES
    // ==============================
    function hideAllPages() {
      document.getElementById('login-page').style.display            = 'none';
      document.getElementById('create-password-page').style.display  = 'none';
      document.getElementById('app-page').style.display              = 'none';
    }

    function showApp(displayName) {
      hideAllPages();
      document.getElementById('app-page').style.display = 'block';
      document.getElementById('user-badge').textContent = displayName;

      // set date to today
      var today = new Date();
      var yyyy  = today.getFullYear();
      var mm    = String(today.getMonth() + 1).padStart(2, '0');
      var dd    = String(today.getDate()).padStart(2, '0');
      document.getElementById('date-input').value = yyyy + '-' + mm + '-' + dd;

      // load tasks for this account
      loadTasks();
      renderTasks();
      checkForOverdue();
    }

    function doLogout() {
      // save tasks before logging out
      saveTasks();
      loggedInEmail = null;
      myTasks       = [];
      currentFilter = 'all';
      pendingName   = '';
      pendingEmail  = '';
      if (timerInterval) clearInterval(timerInterval);

      hideAllPages();
      document.getElementById('login-page').style.display = 'flex';
      document.getElementById('login-email').value    = '';
      document.getElementById('login-password').value = '';
      document.getElementById('login-error').classList.remove('show');

      // reset filter pills
      var pills = document.querySelectorAll('.filter-pill');
      for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
      pills[0].classList.add('active');
    }

    // ==============================
    // TASK MANAGER
    // ==============================
    var myTasks       = [];
    var currentFilter = 'all';

    function loadTasks() {
      // admin account uses its own localStorage key
      if (loggedInEmail === ADMIN_EMAIL) {
        var data = localStorage.getItem('taskover_tasks_admin');
        myTasks = data ? JSON.parse(data) : [];
        return;
      }
      // load tasks from the user's account
      var account = getAccount(loggedInEmail);
      myTasks = (account && account.tasks) ? account.tasks : [];
    }

    function saveTasks() {
      if (!loggedInEmail) return;
      if (loggedInEmail === ADMIN_EMAIL) {
        localStorage.setItem('taskover_tasks_admin', JSON.stringify(myTasks));
        return;
      }
      var account = getAccount(loggedInEmail);
      if (account) {
        account.tasks = myTasks;
        saveAccount(loggedInEmail, account);
      }
    }

    function addTask() {
      var nameEl   = document.getElementById('task-input');
      var dateEl   = document.getElementById('date-input');
      var taskName = nameEl.value.trim();
      var taskDate = dateEl.value;

      // using our isTaskValid function which takes multiple arguments and returns a result
      if (!isTaskValid(taskName, taskDate, 1)) {
        if (!taskName) {
          alert('Hey! You need to write what the task is first :)');
        } else if (!taskDate) {
          alert('Don\'t forget to pick a due date!');
        }
        return;
      }

      // get what the user picked from the dropdown
      var priorityEl     = document.getElementById('priority-input');
      var pickedPriority = priorityEl.value;

      // save the task with whatever priority the user chose
      // if they chose auto we save it as auto and the render will figure it out
      myTasks.push({ id: Date.now(), name: taskName, date: taskDate, done: false, priority: pickedPriority });
      priorityEl.value = 'auto';
      nameEl.value = '';
      saveTasks();
      renderTasks();
      checkForOverdue();
    }

    function removeTask(taskId) {
      myTasks = myTasks.filter(function(t) { return t.id !== taskId; });
      saveTasks();
      renderTasks();
      checkForOverdue();
    }

    function toggleDone(taskId) {
      for (var i = 0; i < myTasks.length; i++) {
        if (myTasks[i].id === taskId) { myTasks[i].done = !myTasks[i].done; break; }
      }
      saveTasks();
      renderTasks();
      checkForOverdue();
    }

    function checkIfOverdue(task) {
      if (task.done) return false;
      var t = new Date(); t.setHours(0,0,0,0);
      return new Date(task.date + 'T00:00:00') < t;
    }

    function niceDate(dateStr) {
      var d = new Date(dateStr + 'T00:00:00');
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    function setFilter(f, btn) {
      currentFilter = f;
      document.querySelectorAll('.filter-pill').forEach(function(p) { p.classList.remove('active'); });
      btn.classList.add('active');
      renderTasks();
    }

    // returns the label and css class for a priority level
    function getPriorityBadge(priority) {
      if (priority === 'high')   return { label: '🔴 High',   cls: 'priority-high' };
      if (priority === 'medium') return { label: '🟡 Medium', cls: 'priority-medium' };
      if (priority === 'low')    return { label: '🟢 Low',    cls: 'priority-low' };
      return { label: '🟢 Low', cls: 'priority-low' };
    }

    // when there is more than one task we compare due dates against each other
    // the task with the earliest due date gets high priority
    // the task with the latest due date gets low priority
    // everything in the middle gets medium priority
    function assignAutoPriorities(taskList) {
      // only look at tasks that are not done
      var activeTasks = taskList.filter(function(t) { return !t.done; });

      if (activeTasks.length === 0) return;

      if (activeTasks.length === 1) {
        // only one active task - keep whatever the user set manually
        // if it was auto just set it to medium as a default
        if (activeTasks[0].priority === 'auto') {
          activeTasks[0].priority = 'medium';
        }
        return;
      }

      // sort active tasks by date to figure out which is earliest and latest
      var sorted = activeTasks.slice().sort(function(a, b) {
        return new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00');
      });

      // find the earliest and latest dates
      var earliestDate = sorted[0].date;
      var latestDate   = sorted[sorted.length - 1].date;

      // now go through each active task and assign priority based on position
      for (var i = 0; i < activeTasks.length; i++) {
        var t = activeTasks[i];
        if (t.date === earliestDate) {
          t.priority = 'high';
        } else if (t.date === latestDate) {
          t.priority = 'low';
        } else {
          t.priority = 'medium';
        }
      }
    }

    function renderTasks() {
      var listEl = document.getElementById('task-list');

      // if more than one active task - auto assign priorities by comparing due dates
      var activeTasks = myTasks.filter(function(t) { return !t.done; });
      if (activeTasks.length > 1) {
        assignAutoPriorities(myTasks);
        saveTasks();
      }

      var showing = myTasks.filter(function(t) {
        if (currentFilter === 'all')     return true;
        if (currentFilter === 'active')  return !t.done && !checkIfOverdue(t);
        if (currentFilter === 'overdue') return checkIfOverdue(t);
        if (currentFilter === 'done')    return t.done;
        return true;
      });

      if (!showing.length) {
        listEl.innerHTML = '<div class="empty-msg">Nothing to show here right now!</div>';
        return;
      }

      // sort so high priority shows at the top
      var priorityOrder = { high: 0, medium: 1, low: 2 };
      showing.sort(function(a, b) {
        var pa = a.priority || 'medium';
        var pb = b.priority || 'medium';
        return (priorityOrder[pa] !== undefined ? priorityOrder[pa] : 1)
             - (priorityOrder[pb] !== undefined ? priorityOrder[pb] : 1);
      });

      var html = '';
      for (var j = 0; j < showing.length; j++) {
        var task = showing[j];
        var over  = checkIfOverdue(task);

        // get the priority badge for this task
        var taskPriority = task.priority || 'medium';
        var badge = getPriorityBadge(taskPriority);

        html += '<div class="task-card' + (over ? ' overdue' : '') + (task.done ? ' task-done' : '') + '">'
          + '<div class="check-circle' + (task.done ? ' checked' : '') + '" onclick="toggleDone(' + task.id + ')">' + (task.done ? '&#10003;' : '') + '</div>'
          + '<div class="task-info">'
          +   '<div class="task-name' + (task.done ? ' strikethrough' : '') + '">' + escHtml(task.name) + '</div>'
          +   '<div class="task-due">Due: ' + niceDate(task.date) + '</div>'
          + '</div>'
          + (over ? '<span class="overdue-label">Past due!</span>' : '')
          + '<span class="priority-badge ' + badge.cls + '">' + badge.label + '</span>'
          + '<button class="del-btn" onclick="removeTask(' + task.id + ')">&#10005;</button>'
          + '</div>';
      }
      listEl.innerHTML = html;
    }

    function checkForOverdue() {
      var box   = document.getElementById('reminder-box');
      var oList = myTasks.filter(function(t) { return checkIfOverdue(t); });
      if (!oList.length) { box.classList.remove('show'); box.textContent = ''; return; }
      var names = oList.map(function(t) { return '"' + t.name + '"'; });
      box.textContent = oList.length === 1
        ? 'Hey! You passed the due date for ' + names[0] + '. Get on it!'
        : 'You passed the due dates for ' + names.join(', ') + '. Check those out!';
      box.classList.add('show');
    }

    function escHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // ==============================
    // CALCULATOR
    // ==============================
    var displayNum = '0', savedNum = null, savedOp = null, waitingForNext = false, exprText = '';

    function updateCalc() {
      document.getElementById('calc-result').textContent = displayNum;
      document.getElementById('calc-expr').textContent   = exprText;
    }

    function calcNum(n) {
      if (waitingForNext) { displayNum = n; waitingForNext = false; }
      else { displayNum = displayNum === '0' ? n : (displayNum.length < 13 ? displayNum + n : displayNum); }
      updateCalc();
    }

    function calcDot() {
      if (waitingForNext) { displayNum = '0.'; waitingForNext = false; updateCalc(); return; }
      if (displayNum.indexOf('.') === -1) displayNum += '.';
      updateCalc();
    }

    function calcOp(op) {
      var labels = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      if (savedNum !== null && !waitingForNext) calcEquals(true);
      savedNum = parseFloat(displayNum); savedOp = op; waitingForNext = true;
      exprText = displayNum + ' ' + labels[op];
      updateCalc();
    }

    function calcEquals(internal) {
      if (savedNum === null || savedOp === null) return;
      var s = parseFloat(displayNum), ans;
      var labels = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      if (savedOp === '+') ans = savedNum + s;
      else if (savedOp === '-') ans = savedNum - s;
      else if (savedOp === '*') ans = savedNum * s;
      else if (savedOp === '/') {
        if (!s) { displayNum = 'Error!'; exprText = ''; savedNum = null; savedOp = null; updateCalc(); return; }
        ans = savedNum / s;
      }
      if (!internal) exprText = savedNum + ' ' + labels[savedOp] + ' ' + s + ' =';
      displayNum = parseFloat(ans.toFixed(10)).toString();
      savedNum = null; savedOp = null; waitingForNext = false;
      updateCalc();
    }

    function calcClear() { displayNum = '0'; savedNum = null; savedOp = null; waitingForNext = false; exprText = ''; updateCalc(); }
    function calcSign()   { displayNum = (parseFloat(displayNum) * -1).toString(); updateCalc(); }
    function calcPercent(){ displayNum = (parseFloat(displayNum) / 100).toString(); updateCalc(); }

    document.addEventListener('keydown', function(e) {
      if (!document.getElementById('tab-calc').classList.contains('active')) return;
      if (e.key >= '0' && e.key <= '9') calcNum(e.key);
      else if (e.key === '.') calcDot();
      else if (e.key === '+') calcOp('+');
      else if (e.key === '-') calcOp('-');
      else if (e.key === '*') calcOp('*');
      else if (e.key === '/') { e.preventDefault(); calcOp('/'); }
      else if (e.key === 'Enter' || e.key === '=') calcEquals(false);
      else if (e.key === 'Escape') calcClear();
      else if (e.key === 'Backspace') { displayNum = displayNum.length > 1 ? displayNum.slice(0,-1) : '0'; updateCalc(); }
    });

    // ==============================
    // TAB SWITCHING
    // ==============================
    function switchTab(name, btn) {
      document.querySelectorAll('.tab-section').forEach(function(t) { t.classList.remove('active'); });
      document.getElementById('tab-' + name).classList.add('active');
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    }


    // ==============================
    // RUBRIC REQUIREMENTS
    // ==============================

    // onload - runs when the page first loads up
    function onPageLoad() {
      // use getElementsByTagName to find all buttons on the page
      // and log how many there are (a simple use of getElementsByTagName)
      var allButtons = document.getElementsByTagName('button');
      console.log('Task Over loaded! Found ' + allButtons.length + ' buttons on the page.');

      // use getElementsByClassName to find all the filter pills
      // and make sure the first one is active when the page loads
      var filterPills = document.getElementsByClassName('filter-pill');
      if (filterPills.length > 0) {
        // use setAttribute to set the title attribute on the first pill
        // so when you hover over it you see a little tooltip
        filterPills[0].setAttribute('title', 'Show all your tasks');
        filterPills[1] && filterPills[1].setAttribute('title', 'Show tasks that are not done yet');
        filterPills[2] && filterPills[2].setAttribute('title', 'Show tasks that are past due');
        filterPills[3] && filterPills[3].setAttribute('title', 'Show tasks you finished');
      }
    }

    // onmouseover handler for the logout button
    // changes the border color when you hover over it
    function highlightLogout(btn) {
      btn.style.borderColor = '#cc0000';
      btn.style.color = '#cc0000';
    }

    // onmouseout handler - puts the style back to normal
    function unhighlightLogout(btn) {
      btn.style.borderColor = '#ddd';
      btn.style.color = '#888';
    }

    // this is a function that takes multiple arguments and returns a result
    // it checks if a task name and date are both valid and returns true or false
    // this is used to validate a task before adding it to the list
    function isTaskValid(taskName, taskDate, minLength) {
      if (taskName === '') {
        return false;
      }
      if (taskDate === '') {
        return false;
      }
      if (taskName.length < minLength) {
        return false;
      }
      return true;
    }

  </script>
</body>
</html>