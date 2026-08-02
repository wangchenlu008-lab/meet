window.RochePlugin.register({
  id: "chill-meet-enhanced",
  name: "遇见",
  version: "1.0.0",
  apps: [
    {
      id: "chill-meet-app",
      name: "遇见 (Meet)",
      icon: "cards",
      async mount(container, roche) {
        // 创建插件专属作用域，防止污染 Roche 全局
        container.classList.add("roche-plugin-chill-meet");
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.overflow = "hidden";
        container.style.position = "relative";
        container.style.background = "#f2f2f2";

        // ==========================================
        // 1. 注入 CSS (从原版提取，并将 body/:root 作用域限制在插件内容器内)
        // ==========================================
        const style = document.createElement('style');
        style.id = "chill-meet-plugin-style";
        style.textContent = `
          .roche-plugin-chill-meet {
            --bg-body:#f2f2f2; --bg-device:#fafafa; --bg-card:#fff;
            --glass-bg:rgba(255,255,255,0.72); --glass-border:rgba(255,255,255,0.85); --glass-blur:blur(22px);
            --text-main:#1a1a1a; --text-sub:#666; --border-line:#e8e8e8;
            --shadow-card:0 4px 24px rgba(0,0,0,.04);
            --shadow-float:0 8px 32px rgba(0,0,0,.06);
            --pass:#8B3A33; --like:#2d5a3d;
            --font-mono:'Space Mono',monospace;
            --app-pad-bottom:max(100px,calc(env(safe-area-inset-bottom,0px) + 92px));
            font-family:'DM Sans','Noto Sans SC',sans-serif;
            color:var(--text-main);
          }
          /* 适配黑夜模式 */
          :root[data-theme="dark"] .roche-plugin-chill-meet {
            --bg-body:#111; --bg-device:#1a1a1a; --bg-card:#222;
            --glass-bg:rgba(38,38,38,0.82); --glass-border:rgba(255,255,255,0.1);
            --text-main:#f0f0f0; --text-sub:#888; --border-line:#2e2e2e;
            --shadow-card:0 4px 28px rgba(0,0,0,.45);
            --shadow-float:0 12px 40px rgba(0,0,0,.35);
            --pass:#d4796e; --like:#7cb890;
          }
          .roche-plugin-chill-meet * { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
          .roche-plugin-chill-meet .device {
            width:100%; height:100%; min-height: 100%; max-height:100%;
            background:var(--bg-device); position:relative; overflow:hidden;
          }
          .roche-plugin-chill-meet .ma-ambience { position:absolute; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
          .roche-plugin-chill-meet .ma-wallpaper {
            position:absolute; inset:0;
            background: radial-gradient(ellipse 120% 80% at 20% 0%, rgba(180,170,160,.14), transparent 50%), radial-gradient(ellipse 90% 70% at 100% 30%, rgba(160,175,185,.1), transparent 45%), var(--bg-device);
          }
          :root[data-theme="dark"] .roche-plugin-chill-meet .ma-wallpaper {
            background: radial-gradient(ellipse 120% 80% at 15% 10%, rgba(80,70,90,.2), transparent 50%), radial-gradient(ellipse 90% 60% at 100% 40%, rgba(50,60,70,.25), transparent 45%), var(--bg-device);
          }
          .roche-plugin-chill-meet .ma-watermark {
            position:absolute; bottom:100px; right:-8px; font-family:'Playfair Display',serif; font-size:7rem; font-weight:300; font-style:italic;
            color:var(--text-main); opacity:.035; line-height:1; user-select:none;
          }
          :root[data-theme="dark"] .roche-plugin-chill-meet .ma-watermark { opacity:.06; }
          .roche-plugin-chill-meet .app {
            position:absolute; inset:0; z-index:1; display:flex; flex-direction:column;
            padding:calc(env(safe-area-inset-top,0px) + 18px) 18px var(--app-pad-bottom);
          }
          .roche-plugin-chill-meet .ma-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:18px; padding:0 2px; flex-shrink:0; gap:10px; }
          .roche-plugin-chill-meet .sub-back-btn { background:transparent; border:none; color:var(--text-main); cursor:pointer; transition:opacity .3s; font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:500; text-transform:uppercase; letter-spacing:2px; text-decoration:underline; text-underline-offset:4px; padding:2px 0 0; }
          .roche-plugin-chill-meet .ma-date-box { min-width:0; flex:1; }
          .roche-plugin-chill-meet .ma-date-box h1 { font-family:'Playfair Display',serif; font-size:2rem; font-weight:400; font-style:italic; line-height:1; color:var(--text-main); }
          .roche-plugin-chill-meet .ma-dateline { display:flex; align-items:center; gap:8px; margin-top:8px; color:var(--text-sub); font-size:0.72rem; letter-spacing:1.5px; text-transform:uppercase; }
          .roche-plugin-chill-meet .ma-theme-switch { font-family:var(--font-mono); font-size:0.58rem; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text-main); cursor:pointer; padding:8px 0; display:flex; align-items:center; gap:8px; border:none; background:transparent; transition:opacity .2s; }
          .roche-plugin-chill-meet .ma-refresh-ico i { font-size:0.95rem; line-height:1; }
          .roche-plugin-chill-meet .ma-refresh-action.is-busy .ma-refresh-ico i { animation:ma-refresh-spin .55s ease-out; }
          @keyframes ma-refresh-spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
          .roche-plugin-chill-meet .ma-header-trail { display:flex; flex-direction:column; align-items:flex-end; justify-content:flex-end; gap:2px; flex-shrink:0; }
          .roche-plugin-chill-meet .ma-views { position:relative; flex:1; min-height:0; overflow:hidden; }
          .roche-plugin-chill-meet .ma-view { position:absolute; inset:0; display:flex; flex-direction:column; min-height:0; opacity:0; pointer-events:none; transform:translate3d(0,10px,0) scale(.995); }
          .roche-plugin-chill-meet .ma-view.active { opacity:1; pointer-events:auto; transform:translate3d(0,0,0) scale(1); }
          .roche-plugin-chill-meet .ma-deck-wrap { flex:1; position:relative; min-height:0; perspective:1400px; }
          .roche-plugin-chill-meet .ma-deck-ghost { position:absolute; left:50%; top:8px; bottom:0; width:min(358px,calc(100% - 32px)); height:auto; transform:translateX(-50%); background:var(--bg-card); border:1px solid var(--border-line); border-radius:24px; box-shadow:var(--shadow-card); pointer-events:none; }
          .roche-plugin-chill-meet .ma-deck-ghost.ma-dg2 { transform:translateX(-50%) scale(.88) translateY(24px); opacity:.36; z-index:0; }
          .roche-plugin-chill-meet .ma-deck-ghost.ma-dg1 { transform:translateX(-50%) scale(.94) translateY(12px); opacity:.55; z-index:1; }
          .roche-plugin-chill-meet .ma-deck { position:absolute; left:50%; top:8px; bottom:0; z-index:2; width:min(358px,calc(100% - 32px)); height:auto; transform:translateX(-50%); }
          .roche-plugin-chill-meet .ma-card { position:absolute; left:0; right:0; top:0; bottom:0; margin:auto; width:100%; height:100%; border-radius:24px; box-shadow:var(--shadow-float); cursor:grab; transition:transform 0.38s cubic-bezier(0.19,1,0.22,1); filter:drop-shadow(0 2px 8px rgba(0,0,0,.04)); }
          :root[data-theme="dark"] .roche-plugin-chill-meet .ma-card { filter:drop-shadow(0 4px 20px rgba(0,0,0,.3)); }
          .roche-plugin-chill-meet .ma-card.dragging { transition:none; cursor:grabbing; filter:drop-shadow(0 12px 36px rgba(0,0,0,.1)); }
          .roche-plugin-chill-meet .ma-card-inner { border-radius:24px; overflow:hidden; height:100%; display:flex; flex-direction:column; background:var(--bg-card); border:1px solid var(--border-line); }
          .roche-plugin-chill-meet .ma-card-stamps { position:absolute; inset:0; pointer-events:none; z-index:4; display:flex; align-items:center; justify-content:space-between; padding:0 10% 8%; }
          .roche-plugin-chill-meet .ma-card-stamp { display:flex; flex-direction:column; align-items:center; gap:8px; opacity:0; transition:opacity .1s ease; }
          .roche-plugin-chill-meet .ma-stamp-word { font-family:'Playfair Display',serif; font-style:italic; font-size:2.35rem; color:transparent; -webkit-text-stroke:1px rgba(255,255,255,.92); filter:drop-shadow(0 6px 20px rgba(0,0,0,.25)); }
          .roche-plugin-chill-meet .ma-card-photo { flex:0 0 38%; min-height:88px; background:linear-gradient(155deg,#ece8e2 0%,#d8d2c8 42%,#c5bdb2 100%); position:relative; }
          :root[data-theme="dark"] .roche-plugin-chill-meet .ma-card-photo { background:linear-gradient(155deg,#2c2a28 0%,#22201e 50%,#181614 100%); }
          .roche-plugin-chill-meet .ma-card-rail span { writing-mode:vertical-rl; transform:rotate(180deg); font-family:var(--font-mono); font-size:0.48rem; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,.75); }
          .roche-plugin-chill-meet .ma-card-photo span { position:absolute; bottom:16px; left:16px; right:18px; z-index:4; text-align:right; font-family:'Playfair Display',serif; font-style:italic; font-size:1.4rem; color:#fff; text-shadow:0 2px 16px rgba(0,0,0,.4); }
          .roche-plugin-chill-meet .ma-card-body { flex:1 1 auto; overflow-y:auto; padding:14px 16px 18px 16px; }
          .roche-plugin-chill-meet .ma-card-name { font-family:'Cormorant Garamond',serif; font-size:1.45rem; font-weight:600; font-style:italic; }
          .roche-plugin-chill-meet .ma-astro-dual { display:flex; justify-content:space-around; align-items:center; gap:10px; margin-top:6px; padding:12px 6px 10px; border-radius:20px; border:1px solid var(--border-line); }
          .roche-plugin-chill-meet .ma-orbit { position:relative; width:min(82px,23vw); height:min(82px,23vw); display:grid; place-items:center; }
          .roche-plugin-chill-meet .ma-orbit::before { content:''; position:absolute; inset:0; border-radius:50%; background:conic-gradient(var(--orbit-accent, #1a1a1a) calc(var(--p,0) * 1%), var(--border-line) 0); }
          .roche-plugin-chill-meet .ma-orbit::after { content:''; position:absolute; inset:5px; border-radius:50%; background:var(--bg-card); border:1px solid rgba(0,0,0,.04); }
          .roche-plugin-chill-meet .ma-orbit-core { position:relative; z-index:1; text-align:center; }
          .roche-plugin-chill-meet .ma-orbit-core strong { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-style:italic; display:block; }
          .roche-plugin-chill-meet .ma-orbit-core span { font-family:var(--font-mono); font-size:0.42rem; letter-spacing:2px; color:var(--text-sub); display:block; }
          .roche-plugin-chill-meet .ma-orbit-match { --orbit-accent:#5c6b5a; }
          .roche-plugin-chill-meet .ma-orbit-astro { --orbit-accent:#6b5c7a; }
          .roche-plugin-chill-meet .ma-syn-mini { margin-top:12px; border-radius:20px; border:1px solid var(--border-line); padding:14px 13px 12px; background:var(--glass-bg); backdrop-filter:blur(14px); }
          .roche-plugin-chill-meet .ma-deck-loading-inner, .roche-plugin-chill-meet .ma-deck-fetch-err { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:min(320px,88%); text-align:center; padding:28px 20px; border-radius:22px; border:1px solid var(--border-line); background:var(--glass-bg); backdrop-filter:var(--glass-blur); }
          .roche-plugin-chill-meet .ma-actions { display:flex; justify-content:center; padding:12px 0 8px; flex-shrink:0; }
          .roche-plugin-chill-meet .ma-actions-capsule { display:flex; align-items:center; gap:44px; padding:12px 44px; border-radius:100px; background:var(--glass-bg); backdrop-filter:var(--glass-blur); border:1px solid var(--glass-border); box-shadow:0 4px 24px rgba(0,0,0,.05); }
          .roche-plugin-chill-meet .ma-btn { width:50px; height:50px; border-radius:50%; border:1.5px solid var(--border-line); background:var(--bg-card); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-sub); }
          .roche-plugin-chill-meet .ma-list { flex:1; overflow-y:auto; padding-bottom:8px; }
          .roche-plugin-chill-meet .ma-row-swipe { position:relative; margin-bottom:10px; border-radius:20px; overflow:hidden; }
          .roche-plugin-chill-meet .ma-row-del { position:absolute; inset:0 0 0 auto; width:92px; border:none; cursor:pointer; background:linear-gradient(145deg,#cf5e5e,#b94f4f); color:#fff; font-family:var(--font-mono); font-size:.5rem; letter-spacing:1.6px; opacity:0; transform:translateX(10px); transition:opacity .16s, transform .16s; }
          .roche-plugin-chill-meet .ma-row-swipe.is-open .ma-row-del { opacity:1; transform:translateX(0); pointer-events:auto; }
          .roche-plugin-chill-meet .ma-row { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:20px; border:1px solid var(--border-line); background:var(--glass-bg); backdrop-filter:var(--glass-blur); cursor:pointer; }
          .roche-plugin-chill-meet .ma-row-av { width:48px; height:48px; border-radius:14px; background:var(--bg-card); display:flex; align-items:center; justify-content:center; border:1px solid var(--border-line); }
          .roche-plugin-chill-meet .ma-nav-wrap { position:absolute; bottom:0; left:0; right:0; z-index:5; padding:0 20px calc(env(safe-area-inset-bottom,0px) + 14px); pointer-events:none; }
          .roche-plugin-chill-meet .ma-nav { pointer-events:auto; display:flex; justify-content:space-around; align-items:center; padding:10px 8px; border-radius:100px; background:var(--glass-bg); backdrop-filter:var(--glass-blur); border:1px solid var(--glass-border); box-shadow:0 4px 24px rgba(0,0,0,.06); }
          .roche-plugin-chill-meet .ma-nav button { flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; border:none; background:transparent; color:var(--text-sub); cursor:pointer; font-family:var(--font-mono); font-size:0.48rem; letter-spacing:1.2px; }
          .roche-plugin-chill-meet .ma-nav button.active { color:var(--text-main); }
          .roche-plugin-chill-meet .ma-chat { position:absolute; inset:0; z-index:40; display:none; flex-direction:column; background:var(--bg-device); }
          .roche-plugin-chill-meet .ma-chat.open { display:flex; }
          .roche-plugin-chill-meet .ma-chat-bar { flex-shrink:0; display:flex; align-items:flex-start; gap:12px; padding:calc(env(safe-area-inset-top,0px) + 12px) 16px 14px; background:var(--glass-bg); backdrop-filter:var(--glass-blur); border-bottom:1px solid var(--glass-border); }
          .roche-plugin-chill-meet .ma-chat-back { width:42px; height:42px; border-radius:50%; border:1px solid var(--border-line); background:var(--bg-card); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-main); }
          .roche-plugin-chill-meet .ma-chat-body { flex:1; min-height:0; display:flex; flex-direction:column; }
          .roche-plugin-chill-meet .ma-chat-thread { flex:1; overflow-y:auto; padding:18px 16px 16px; display:flex; flex-direction:column; gap:14px; }
          .roche-plugin-chill-meet .ma-chat-msg { position:relative; display:flex; flex-direction:column; max-width:min(86%,300px); gap:5px; }
          .roche-plugin-chill-meet .ma-chat-msg.peer { align-self:flex-start; align-items:flex-start; }
          .roche-plugin-chill-meet .ma-chat-msg.me { align-self:flex-end; align-items:flex-end; }
          .roche-plugin-chill-meet .ma-chat-bub { padding:12px 15px; font-size:0.85rem; line-height:1.5; border-radius:20px; }
          .roche-plugin-chill-meet .ma-chat-msg.peer .ma-chat-bub { background:var(--glass-bg); border:1px solid var(--glass-border); border-bottom-left-radius:6px; }
          .roche-plugin-chill-meet .ma-chat-msg.me .ma-chat-bub { background:linear-gradient(155deg,#2a2a2a 0%,#1a1a1a 100%); color:#fff; border-bottom-right-radius:6px; }
          :root[data-theme="dark"] .roche-plugin-chill-meet .ma-chat-msg.me .ma-chat-bub { background:linear-gradient(155deg,#ececec 0%,#d8d8d8 100%); color:#1a1a1a; }
          .roche-plugin-chill-meet .ma-chat-composer-wrap { flex-shrink:0; padding:0 14px calc(12px + env(safe-area-inset-bottom,0px)); }
          .roche-plugin-chill-meet .ma-chat-composer { display:flex; align-items:center; gap:8px; padding:6px 6px 6px 16px; border-radius:100px; background:var(--glass-bg); border:1px solid var(--glass-border); }
          .roche-plugin-chill-meet .ma-chat-composer input { flex:1; min-width:0; border:none; background:transparent; padding:10px 4px; font-size:0.88rem; color:var(--text-main); outline:none; }
          .roche-plugin-chill-meet .ma-profile-sheet { position:absolute; inset:0; z-index:42; display:none; flex-direction:column; background:var(--bg-device); }
          .roche-plugin-chill-meet .ma-profile-sheet.open { display:flex; }
          .roche-plugin-chill-meet .ma-modal-overlay { position:absolute; inset:0; z-index:60; background:rgba(0,0,0,.35); backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:24px; }
          .roche-plugin-chill-meet .ma-modal-overlay.open { display:flex; }
          .roche-plugin-chill-meet .ma-modal { width:100%; max-width:318px; background:var(--bg-card); border-radius:32px; padding:28px 24px 22px; border:1px solid var(--border-line); }
          .roche-plugin-chill-meet .ma-toast { position:absolute; left:50%; bottom:calc(var(--app-pad-bottom) + 10px); transform:translateX(-50%) translateY(14px); padding:11px 20px; border-radius:100px; background:var(--text-main); color:var(--bg-device); opacity:0; pointer-events:none; transition:transform .28s, opacity .28s; z-index:85; }
          .roche-plugin-chill-meet .ma-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
          /* 其他底层重置和细节已整合。引入 Phosphor 图标 */
          @import url('https://unpkg.com/@phosphor-icons/web');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Space+Mono:ital,wght@0,400;0,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
        `;
        container.appendChild(style);

        // ==========================================
        // 2. 注入 HTML DOM
        // ==========================================
        const appDOM = document.createElement('div');
        appDOM.className = "device";
        appDOM.id = "device";
        appDOM.innerHTML = `
          <div class="ma-ambience" aria-hidden="true">
            <div class="ma-wallpaper"></div>
            <div class="ma-watermark">C.</div>
          </div>
          <div class="app">
            <header class="ma-header">
              <div class="ma-date-box">
                <h1>遇见.</h1>
                <div class="ma-dateline"><span>Discover</span><span>•</span><span>Swipe</span></div>
              </div>
              <div class="ma-header-trail">
                <button type="button" class="sub-back-btn ma-header-back" id="btn-os-home">关闭</button>
                <button type="button" class="ma-theme-switch ma-refresh-action" id="btn-refresh-discover">
                  <span class="ma-refresh-ico"><i class="ph ph-arrow-clockwise"></i></span> REFRESH
                </button>
              </div>
            </header>

            <div class="ma-views" id="ma-views">
              <!-- 发现 -->
              <div class="ma-view active" id="view-discover">
                <div class="ma-deck-wrap">
                  <div class="ma-deck-ghost ma-dg2"></div>
                  <div class="ma-deck-ghost ma-dg1"></div>
                  <div class="ma-deck" id="deck"></div>
                </div>
                <div class="ma-actions">
                  <div class="ma-actions-capsule">
                    <button type="button" class="ma-btn pass" id="btn-pass"><i class="ph ph-x"></i></button>
                    <button type="button" class="ma-btn like" id="btn-like"><i class="ph-fill ph-heart"></i></button>
                  </div>
                </div>
              </div>

              <!-- 消息 -->
              <div class="ma-view" id="view-inbox">
                <div class="ma-inbox-scroll" id="inbox-scroll">
                  <div id="stranger-stack-host"></div>
                  <div class="ma-section-title" style="margin-top:4px;">对话</div>
                  <div class="ma-list" id="list-inbox"></div>
                </div>
              </div>

              <!-- 运势 -->
              <div class="ma-view" id="view-daily">
                <div class="ma-daily-scroll">
                  <div class="ma-astro-hero">
                    <p class="ma-astro-zodiac" id="daily-date-line">—</p>
                    <div class="ma-astro-score"><span id="daily-index">82</span><small>INDEX</small></div>
                    <p class="ma-astro-mood" id="daily-mood">系统连线中...</p>
                  </div>
                  <div class="ma-daily-recommend" id="daily-recommend-wrap">
                    <div class="ma-drec-k">今日推荐 · Today's pick</div>
                    <div id="daily-recommend-body"></div>
                  </div>
                </div>
              </div>

              <!-- 我的 -->
              <div class="ma-view" id="view-me">
                <div class="ma-me-scroll">
                  <div class="ma-me-head">
                    <div class="ma-me-avatar-wrap" id="meet-avatar-wrap">
                      <img id="meet-avatar-img" class="ma-me-avatar-img">
                      <div class="ma-me-avatar-ph" id="meet-avatar-ph"><i class="ph ph-user"></i></div>
                    </div>
                    <div>
                      <div class="ma-card-name" id="me-display-name">我</div>
                      <div class="ma-card-age" id="me-tagline" style="margin-top:4px;">设置你的资料</div>
                    </div>
                  </div>
                  
                  <div class="ma-profile-cta-card">
                    <button type="button" class="ma-profile-cta" id="btn-open-wb">
                      <div class="ma-profile-cta-main">
                        <span class="ma-profile-cta-k">世界书设定</span>
                        <span class="ma-profile-cta-t" id="wb-cta-line">未绑定 · 点我与 Roche 联通</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部导航 -->
            <div class="ma-nav-wrap">
              <nav class="ma-nav">
                <button type="button" class="active" data-tab="discover"><i class="ph-fill ph-cards"></i>发现</button>
                <button type="button" data-tab="inbox"><i class="ph ph-chat-circle"></i>消息</button>
                <button type="button" data-tab="daily"><i class="ph ph-sparkle"></i>运势</button>
                <button type="button" data-tab="me"><i class="ph ph-user-circle"></i>我的</button>
              </nav>
            </div>
          </div>

          <!-- 全屏聊天 -->
          <div class="ma-chat" id="chat-screen">
            <div class="ma-chat-bar">
              <button type="button" class="ma-chat-back" id="chat-back"><i class="ph ph-arrow-left"></i></button>
              <div class="ma-chat-bar-main">
                <div class="ma-chat-bar-head">
                  <div class="ma-chat-bar-titles">
                    <strong class="ma-chat-peer-name" id="chat-peer">昵称</strong>
                    <span class="ma-chat-peer-sub" id="chat-peer-sub">印象星级</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="ma-chat-body">
              <div class="ma-chat-thread" id="chat-thread"></div>
              <div class="ma-chat-composer-wrap">
                <div class="ma-chat-composer">
                  <input type="text" id="chat-input" placeholder="写一句…">
                  <button type="button" class="ma-chat-send" id="chat-send"><i class="ph ph-arrow-up"></i></button>
                  <button type="button" class="ma-chat-reply" id="chat-reply"><i class="ph-fill ph-sparkle"></i></button>
                </div>
              </div>
            </div>
          </div>

          <!-- 弹窗预留 (这里为精简演示保留了关键骨架，逻辑会自动插入或操控它们) -->
          <div class="ma-toast" id="ma-toast"></div>
          <div class="ma-modal-overlay" id="modal-rate">
            <div class="ma-modal">
              <h3>聊得怎么样？</h3>
              <div class="ma-rate-row" id="rate-stars"></div>
              <div class="ma-modal-actions">
                <button type="button" id="rate-skip">跳过</button>
                <button type="button" class="primary" id="rate-ok">完成</button>
              </div>
            </div>
          </div>
        `;
        container.appendChild(appDOM);

        // 关闭插件按钮绑定
        document.getElementById("btn-os-home").onclick = () => roche.ui.closeApp();
        // ==========================================
        // 3. 核心状态与 Roche 存储适配层
        // ==========================================
        let deck = [];
        let liked = [];
        let strangers = [];
        const IDB_KEY_MEET_LIKED = 'meet_likedV1';
        const IDB_KEY_MEET_CONV = 'meet_matchConvV1';
        const IDB_KEY_MEET_PROFILE = 'meet_userProfile';
        const IDB_KEY_MEET_BIRTH = 'meet_natalBirth';
        const IDB_KEY_MEET_DM = 'meet_dmPolicy';
        const IDB_KEY_MEET_STRANGERS = 'meet_strangersInboxV1';
        const IDB_KEY_MEET_STRANGER_DUE = 'meet_strangerNextDueV1';
        const IDB_KEY_MEET_DAILY = 'meet_dailyFortuneV1';
        const IDB_KEY_MEET_CHAT_PERSONA = 'meet_chatPersonaMapV1';
        const IDB_KEY_MEET_WB_BIND = 'meet_worldbookBindMapV1';
        const IDB_KEY_MEET_WB_FREETEXT = 'meet_worldviewFreetextV1';
        const IDB_KEY_MEET_INBOX_READ = 'meet_inboxLastReadV1';
        const IDB_KEY_MEET_PEER_HEART_LETTER = 'meet_peerHeartLetterV1';
        const IDB_KEY_MEET_MUTUAL_MILESTONE_TOAST = 'meet_mutualMilestoneToastsV1';

        let _meetConvMap = {};
        let _meetUserProfile = null;
        let _meetBirth = null;
        let _meetStrangerNextDue = 0;
        let _meetChatPersonaMap = {};
        let _meetChatPersonaBusy = {};
        let _meetWbBindMap = {};
        let _meetWorldviewFreetext = '';
        let _wbMainEntriesCache = [];
        let _meetInboxLastReadTs = {};
        let _mutualMilestoneToastMap = {};
        const _mutualMilestoneToastQueue = [];
        let _mutualMilestoneToastOpen = false;
        let _peerHeartLetterMap = {};
        let _peerHeartLetterFlowPeerId = '';
        
        const DM_MATCH_ONLY = 'match_only';
        const DM_STRANGERS_OK = 'strangers_ok';
        let _meetDmPolicy = DM_STRANGERS_OK;

        const IMPRESSION_FAVOR_STAR_SEGMENTS = [30, 30, 50, 60, 100];
        const IMPRESSION_FAVOR_STAR_THRESHOLDS = (() => {
          const out = [];
          let sum = 0;
          for(let i = 0; i < IMPRESSION_FAVOR_STAR_SEGMENTS.length; i++){
            sum += IMPRESSION_FAVOR_STAR_SEGMENTS[i];
            out.push(sum);
          }
          return out;
        })();
        const IMPRESSION_FAVOR_CAP = IMPRESSION_FAVOR_STAR_THRESHOLDS[IMPRESSION_FAVOR_STAR_THRESHOLDS.length - 1];

        // 使用 Roche 提供的独立 Storage API 替代原版 IndexedDB
        async function meetStoreGet(key) {
          return await roche.storage.get(key);
        }
        async function meetStoreSet(key, value) {
          return await roche.storage.set(key, value);
        }
        
        // 吐司提示接入 Roche 原生 UI
        function meetToastShow(msg, durationMs) {
          roche.ui.toast(msg);
        }

        // ==========================================
        // 4. Roche AI 联通与 LLM 适配层
        // ==========================================
        // 替代原版的 chillLlmComplete，直接走 Roche 宿主模型
        async function chillLlmComplete(messages, opt) {
          const temperature = opt && opt.temperature != null ? opt.temperature : 0.85;
          try {
            const result = await roche.ai.chat({
              messages: messages,
              temperature: temperature
            });
            if (!result || !result.text) throw new Error("模型未返回文本内容");
            return result.text.trim();
          } catch (err) {
            console.error("[Roche AI Chat Error]", err);
            throw err;
          }
        }

        function parseJsonObjectFromRaw(raw){
          let s = String(raw == null ? '' : raw).trim();
          const fm = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
          if(fm) s = fm[1].trim();
          const i0 = s.indexOf('{');
          const i1 = s.lastIndexOf('}');
          if(i0 >= 0 && i1 > i0) s = s.slice(i0, i1 + 1);
          try { return JSON.parse(s); } catch(e) { return {}; }
        }

        // ==========================================
        // 5. Roche 人设与世界书联通层
        // ==========================================
        async function getActiveUserPersonaFromRoche() {
          try {
            const active = await roche.persona.getActiveUserPersona();
            return active || null;
          } catch(e) {
            return null;
          }
        }

        async function readMainWorldInfoEntries() {
          try {
            // 直接读取 Roche 宿主世界书，替代原版 IDB 读法
            const categories = await roche.worldbook.list();
            let entries = [];
            for (const cat of categories) {
              const catEntries = await roche.worldbook.getEntries({ categoryId: cat.id });
              entries.push(...catEntries);
            }
            return entries.map(e => ({
              id: e.id,
              name: String(e.keyword || e.name || '').trim(),
              keyword: String(e.keyword || '').trim(),
              content: String(e.content || '').trim(),
              enabled: true
            })).filter(e => e.name && e.content);
          } catch (e) {
            console.warn("读取 Roche 世界书失败", e);
            return [];
          }
        }

        // ==========================================
        // 6. 核心业务逻辑 (保留所有原版算法)
        // ==========================================
        function hash32(str){
          let h = 2166136261 >>> 0;
          for(let i = 0; i < str.length; i++){
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619) >>> 0;
          }
          return h >>> 0;
        }
        
        function esc(s){ 
          const d=document.createElement('div'); 
          d.textContent=s; 
          return d.innerHTML; 
        }

        const Z_SIGN = ['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼'];
        const Z_ELEMENT = ['火象','土象','风象','水象','火象','土象','风象','水象','火象','土象','风象','水象'];
        const Z_MODAL = ['本位','固定','变动','本位','固定','变动','本位','固定','变动','本位','固定','变动'];
        const CHINESE_ANI = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

        function sunSignFromDate(m, d){
          if((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 9;
          if((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 10;
          if((m === 2 && d >= 19) || (m === 3 && d <= 20)) return 11;
          if((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 0;
          if((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 1;
          if((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 2;
          if((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 3;
          if((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 4;
          if((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 5;
          if((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 6;
          if((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 7;
          if((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 8;
          return 11;
        }

        function chineseZodiacAnimal(year){
          return CHINESE_ANI[((year - 4) % 12 + 12) % 12];
        }

        function ageFromYMD(y, m, d){
          const t = new Date();
          let a = t.getFullYear() - y;
          if(t.getMonth() + 1 < m || (t.getMonth() + 1 === m && t.getDate() < d)) a--;
          return a;
        }

        function moonAscFromBirth(dateStr, timeStr){
          const moon = hash32('moon|' + dateStr + '|' + (timeStr || '12:00')) % 12;
          const asc = hash32('asc|' + dateStr + '|' + (timeStr || '')) % 12;
          return { moon, asc };
        }

        function emptyUserProfile(){
          return {
            nick:'', gender:'', city:'', bio:'', mbti:'',
            seekingSelected: [], seekingOther: '',
            tagsSelected: [], tagsOther: ''
          };
        }

        function getUserProfile(){
          return _meetUserProfile || emptyUserProfile();
        }

        function getStoredBirth(){
          if(!_meetBirth || !_meetBirth.date) return null;
          return _meetBirth;
        }

        function saveUserProfile(p){
          _meetUserProfile = Object.assign(emptyUserProfile(), p);
          void meetStoreSet(IDB_KEY_MEET_PROFILE, _meetUserProfile);
        }

        function getDmPolicy(){
          return _meetDmPolicy;
        }
        function setDmPolicy(v){
          _meetDmPolicy = v === DM_MATCH_ONLY ? DM_MATCH_ONLY : DM_STRANGERS_OK;
          void meetStoreSet(IDB_KEY_MEET_DM, _meetDmPolicy);
        }

        function convMapGet(){
          const m = _meetConvMap;
          if(!m || typeof m !== 'object') return {};
          try{ return JSON.parse(JSON.stringify(m)); }catch(_){ return {}; }
        }
        function convMapSet(obj){
          _meetConvMap = obj && typeof obj === 'object' ? obj : {};
          void meetStoreSet(IDB_KEY_MEET_CONV, _meetConvMap);
        }

        function getConvHistory(peerId){
          const m = convMapGet();
          const a = m[String(peerId)];
          return Array.isArray(a) ? a : [];
        }

        function setConvHistory(peerId, turns){
          const m = convMapGet();
          const id = String(peerId);
          const arr = Array.isArray(turns) ? turns : [];
          while(arr.length > 120) arr.shift();
          m[id] = arr;
          convMapSet(m);
        }

        function saveLiked(){
          void meetStoreSet(IDB_KEY_MEET_LIKED, liked);
        }

        function saveStrangersToStorage(){
          void meetStoreSet(IDB_KEY_MEET_STRANGERS, strangers.slice(-24));
        }

        // --- 生成发现卡片 (完全保留原版 Prompt 逻辑) ---
        const DISCOVER_SYSTEM_PROMPT =
          'You output ONLY valid JSON (no markdown, no code fences, no commentary). ' +
          'Return an object: {"cards":[...]} with 10 to 14 items. Each item: ' +
          'id (string, unique), name (internet nickname, 2-12 chars, style can be ANY: cute, quirky, cool, poetic, abstract, minimal, mixed EN/CN etc; NOT legal real full name), age (integer 18-35), ' +
          'gender (string: "男", "女", or ""), city (Chinese city name), ' +
          'match (integer 55-96), astro (integer 52-94), bio (Chinese, 1-2 sentences, warm slow-dating tone), ' +
          'tag (short Chinese interest label), profileLine (Chinese short subtitle 8-24 chars, persona-like, no punctuation at end). ' +
          'Also per card (same JSON object): synastryScore (integer 48-92, light synastry vibe index vs the viewer), ' +
          'synastryLine (Chinese, one short line under 40 chars: rapport / chat angle, consistent with bio), ' +
          'peerSunSign (integer 0-11 only: 0白羊 1金牛 2双子 3巨蟹 4狮子 5处女 6天秤 7天蝎 8射手 9摩羯 10水瓶 11双鱼; plausible for the persona). ' +
          'If the user message says viewerProfileFilled is true and gives viewerProfileNarrative: treat that narrative as the anchor from the viewer\'s "我的" profile. ' +
          'At least half the cards should clearly fit that narrative. ' +
          'If the user message also provides worldbookNarrative / worldbookBoundEntries, treat them as active world constraints: card city, tag, bio tone, and relationship rhythm should align with those settings while keeping each person distinct. ' +
          'The rest can add pleasant variety. Never ignore stated 想找/兴趣标签 when present. ' +
          'If viewerProfileFilled is false, keep varied plausible strangers. Always keep individuals distinct.';

        async function fetchDiscoverCardsViaMainLlm() {
          const p = getUserProfile();
          const birth = getStoredBirth();
          const rochePersona = await getActiveUserPersonaFromRoche();
          const filled = !!(p.nick || p.city || p.bio || rochePersona);
          
          let narrative = "";
          if (rochePersona) narrative += "宿主人设: " + rochePersona + "\\n";
          if (p.bio) narrative += "自我介绍: " + p.bio;

          const ctx = JSON.stringify({
            limit: 14,
            viewerProfileFilled: filled,
            viewerProfileNarrative: narrative || '',
            profile: p,
            birth: birth
          });
          
          let userLead = filled ? '用户已提供人设要点，请以此为主锚生成推荐卡片。\\n' : '用户个人资料较少，可泛推荐，保持自然多样。\\n';
          userLead += '\\nJSON 上下文：\\n';

          const text = await chillLlmComplete([
            { role: 'system', content: DISCOVER_SYSTEM_PROMPT },
            { role: 'user', content: userLead + ctx }
          ], { temperature: 0.85 });

          let arr;
          try {
            const data = parseJsonObjectFromRaw(text);
            arr = Array.isArray(data.cards) ? data.cards : Array.isArray(data) ? data : [];
          } catch(e) {
            throw new Error('解析模型 JSON 失败');
          }
          if(!arr.length) throw new Error('模型返回的 cards 为空');
          return arr.map(normalizeDiscoverCard).filter(Boolean);
        }

        function clampPct(n, def){
          const v = Number(n);
          if(!Number.isFinite(v)) return def;
          return Math.min(99, Math.max(1, Math.round(v)));
        }

        function normalizeDiscoverCard(o, i){
          if(!o || typeof o !== 'object') return null;
          const id = String(o.id != null ? o.id : ('c-' + Date.now() + '-' + i));
          const name = String(o.name || 'Ta').slice(0, 20);
          const age = Math.min(80, Math.max(18, Math.round(Number(o.age) || 24)));
          const city = String(o.city || '—').trim().slice(0, 24) || '—';
          const gender = o.gender != null ? String(o.gender).trim().slice(0, 4) : '';
          const bio = String(o.bio || '').trim().slice(0, 280) || '（暂无简介）';
          const tag = String(o.tag || o.label || '').trim().slice(0, 16) || '朋友';
          const profileLine = String(o.profileLine || o.subtitle || '').trim().replace(/\s+/g,' ').slice(0, 48);
          const h = hash32('m|' + id);
          const match = clampPct(o.match, 55 + (h % 36));
          const astro = clampPct(o.astro, 52 + (h % 40));
          return { id, name, age, gender, city, match, astro, bio, tag, profileLine };
        }

        // ==========================================
        // 7. 渲染与交互逻辑 (无损还原滑动、聊天交互)
        // ==========================================
        const $deck = document.getElementById('deck');
        const $listInbox = document.getElementById('list-inbox');
        let currentChat = null;

        function renderCard(p){
          const $deckWrap = document.querySelector('.ma-deck-wrap');
          if(!p){
            if($deckWrap){
              $deckWrap.classList.add('ma-deck-empty');
              $deckWrap.classList.remove('ma-deck-loading');
            }
            $deck.innerHTML = '<div class="ma-empty"><i class="ph ph-sparkle"></i><p>暂无推荐卡片</p><span>点右上角 REFRESH 拉取</span></div>';
            return;
          }
          if($deckWrap) $deckWrap.classList.remove('ma-deck-empty','ma-deck-loading');
          
          const profileLine = p.profileLine || `${p.city} · 慢热 · 喜欢有来回`;
          $deck.innerHTML = `
            <div class="ma-card ma-card-appear" id="swipe-card" data-id="${esc(p.id)}">
              <div class="ma-card-inner">
                <div class="ma-card-stamps">
                  <span class="ma-card-stamp nope" id="stamp-nope">
                    <span class="ma-stamp-word">跳过</span><span class="ma-stamp-sub">PASS</span>
                  </span>
                  <span class="ma-card-stamp like" id="stamp-like">
                    <span class="ma-stamp-word">喜欢</span><span class="ma-stamp-sub">LIKE</span>
                  </span>
                </div>
                <div class="ma-card-photo">
                  <div class="ma-card-rail"><span>No.01</span></div>
                  <span>${esc(p.city)} · ${p.age}</span>
                </div>
                <div class="ma-card-body">
                  <div class="ma-card-rule"></div>
                  <div class="ma-card-meta">
                    <div>
                      <div class="ma-card-name">${esc(p.name)}</div>
                      <div class="ma-card-age">${esc(profileLine)}</div>
                    </div>
                    <div class="ma-badges"><span class="ma-badge">${esc(p.tag)}</span></div>
                  </div>
                  <div class="ma-astro-dual">
                    <div class="ma-orbit ma-orbit-match" style="--p:${p.match}">
                      <div class="ma-orbit-dots" aria-hidden="true"></div>
                      <div class="ma-orbit-core"><strong>${p.match}<small>%</small></strong><span>匹配</span></div>
                    </div>
                    <div class="ma-orbit ma-orbit-astro" style="--p:${p.astro}">
                      <div class="ma-orbit-dots" aria-hidden="true"></div>
                      <div class="ma-orbit-core"><strong>${p.astro}<small>%</small></strong><span>星盘</span></div>
                    </div>
                  </div>
                  <p class="ma-card-bio">${esc(p.bio)}</p>
                </div>
              </div>
            </div>`;
          bindSwipe(document.getElementById('swipe-card'));
        }

        function bindSwipe(el){
          if(!el) return;
          el.style.touchAction = 'none';
          let startX = 0, startY = 0, dragging = false, activePointer = null;
          let lastDx = 0, lastDy = 0, lockAxis = null;

          const applyTransform = (dx, dy) => {
            lastDx = dx; lastDy = dy;
            const rot = dx * 0.045;
            el.style.transform = `translate3d(${dx}px, ${dy * 0.12}px, 0) rotate(${rot}deg)`;
            const sn = el.querySelector('#stamp-nope');
            const sl = el.querySelector('#stamp-like');
            if(sn) sn.style.opacity = String(dx < -12 ? Math.min(1, (-dx - 12) / 72) : 0);
            if(sl) sl.style.opacity = String(dx > 12 ? Math.min(1, (dx - 12) / 72) : 0);
          };

          const finishSwipe = (commit) => {
            dragging = false; el.classList.remove('dragging'); lockAxis = null;
            if(commit === 'like'){
              el.style.transform = `translate3d(${window.innerWidth * 0.6}px, 24px, 0) rotate(18deg)`;
              setTimeout(() => doLike(), 260);
            } else if(commit === 'pass'){
              el.style.transform = `translate3d(${-window.innerWidth * 0.6}px, 24px, 0) rotate(-18deg)`;
              setTimeout(() => doPass(), 260);
            } else {
              el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
            }
          };

          el.addEventListener('pointerdown', (e) => {
            startX = e.clientX; startY = e.clientY;
            dragging = true; activePointer = e.pointerId;
          });
          el.addEventListener('pointermove', (e) => {
            if(!dragging || e.pointerId !== activePointer) return;
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            if(!lockAxis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)){
              lockAxis = Math.abs(dx) > Math.abs(dy) * 1.05 ? 'x' : 'y';
              if(lockAxis === 'x') el.classList.add('dragging');
            }
            if(lockAxis === 'x') applyTransform(dx, dy);
          });
          const onUp = (e) => {
            if(!dragging || e.pointerId !== activePointer) return;
            if(lockAxis === 'x'){
              const threshold = Math.min(100, (el.getBoundingClientRect().width || 300) * 0.25);
              if(lastDx > threshold) finishSwipe('like');
              else if(lastDx < -threshold) finishSwipe('pass');
              else finishSwipe(null);
            } else finishSwipe(null);
          };
          el.addEventListener('pointerup', onUp);
          el.addEventListener('pointercancel', onUp);
        }

        function doPass(){ deck.shift(); renderCard(deck[0]); }
        function doLike(){
          const p = deck.shift();
          if(p){
            liked.push(Object.assign({}, p, { favorMe: 0, favorPeer: 30 }));
            saveLiked();
            renderInbox();
          }
          renderCard(deck[0]);
        }
        // ==========================================
        // 8. 消息列表与对话界面的渲染
        // ==========================================
        const getPeerDisplayName = (u) => String(u.name || 'Ta');

        function renderInbox() {
          const list = document.getElementById('list-inbox');
          if(!list) return;
          list.innerHTML = liked.length ? liked.map(u => {
            const fm = Math.round(Number(u.favorMe) || 0);
            const fp = Math.round(Number(u.favorPeer) || 30);
            return `
            <div class="ma-row-swipe">
              <div class="ma-row ma-row-main" data-open-chat="${esc(u.id)}">
                <div class="ma-row-av"><i class="ph ph-user"></i></div>
                <div class="ma-row-mid">
                  <div class="ma-row-t">${esc(getPeerDisplayName(u))}</div>
                  <div class="ma-row-s">喜欢即可聊 · 平台资料已解锁一级</div>
                </div>
                <span class="ma-row-tag">好感 ${fp}</span>
              </div>
            </div>`;
          }).join('') : '<div class="ma-empty" style="min-height:160px;"><i class="ph ph-chat-circle"></i><p>还没有对话</p><span>右滑喜欢的人会出现在下面</span></div>';

          list.querySelectorAll('[data-open-chat]').forEach(row => {
            row.addEventListener('click', () => openChat(row.getAttribute('data-open-chat')));
          });
        }

        function openChat(id) {
          const u = liked.find(x => x.id === id);
          if(!u) return;
          currentChat = u;
          document.getElementById('chat-peer').textContent = getPeerDisplayName(u);
          renderChatThread(u);
          
          const scr = document.getElementById('chat-screen');
          scr.classList.add('open');
          scr.setAttribute('aria-hidden', 'false');
        }

        function closeChat() {
          currentChat = null;
          const scr = document.getElementById('chat-screen');
          scr.classList.remove('open');
          scr.setAttribute('aria-hidden', 'true');
        }

        function createMeBubbleEl(text) {
          const wrap = document.createElement('div');
          wrap.className = 'ma-chat-msg me';
          wrap.innerHTML = `<div class="ma-chat-bub">${esc(text)}</div>`;
          return wrap;
        }

        function createPeerBubbleEl(text) {
          const wrap = document.createElement('div');
          wrap.className = 'ma-chat-msg peer';
          wrap.innerHTML = `<div class="ma-chat-bub">${esc(text)}</div>`;
          return wrap;
        }

        function appendMeBubbleOnly(text) {
          const th = document.getElementById('chat-thread');
          if(!th) return;
          th.appendChild(createMeBubbleEl(text));
          th.scrollTop = th.scrollHeight;
        }

        function appendPeerBubbleOnly(text) {
          const th = document.getElementById('chat-thread');
          if(!th) return;
          th.appendChild(createPeerBubbleEl(text));
          th.scrollTop = th.scrollHeight;
        }

        function renderChatThread(u) {
          const th = document.getElementById('chat-thread');
          if(!th) return;
          th.innerHTML = '';
          const hist = getConvHistory(u.id);
          hist.forEach(turn => {
            if(turn.role === 'user') th.appendChild(createMeBubbleEl(turn.content));
            else th.appendChild(createPeerBubbleEl(turn.content));
          });
          requestAnimationFrame(() => { th.scrollTop = th.scrollHeight; });
        }

        // ==========================================
        // 9. 调用 Roche AI 进行对话 (增强联通核心)
        // ==========================================
        async function fetchAndAppendPeerReply() {
          if (!currentChat) return;
          const peerId = currentChat.id;
          
          // 构建系统提示词：接入 Roche 人设与世界书
          let sysPrompt = `你现在正在扮演用户在社交软件上匹配到的对象「${currentChat.name}」。
你具有如下基本资料：年龄 ${currentChat.age}，城市 ${currentChat.city}，标签「${currentChat.tag}」。
请以简短、口语化、社交聊天的口吻回复。严禁使用机器人的语气，不要带括号动作描写。不要一次发太多字。`;

          // 挂载 Roche 人设
          const activePersona = await getActiveUserPersonaFromRoche();
          if (activePersona) {
             sysPrompt += `\n\n【用户的人设说明】\n以下是正在和你聊天的用户的人设：\n${activePersona}\n请在聊天中自然地符合这个关系语境。`;
          }

          // 挂载被绑定的 Roche 世界书
          if (_wbMainEntriesCache.length > 0) {
            sysPrompt += `\n\n【当前世界观背景】\n以下设定需要遵守：\n`;
            _wbMainEntriesCache.forEach((entry, idx) => {
               sysPrompt += `${idx+1}. ${entry.name}: ${entry.content}\n`;
            });
          }

          // 读取历史上下文
          const histFull = getConvHistory(peerId);
          const histMsg = histFull.map(t => ({ role: t.role, content: t.content }));
          
          const messages = [{ role: 'system', content: sysPrompt }, ...histMsg];

          try {
            const replyText = await chillLlmComplete(messages, { temperature: 0.8 });
            
            // 存入历史并渲染
            const currentHist = getConvHistory(peerId);
            currentHist.push({ role: 'assistant', content: replyText, ts: Date.now() });
            setConvHistory(peerId, currentHist);
            
            appendPeerBubbleOnly(replyText);
          } catch(e) {
            meetToastShow("AI 思考中出错了: " + e.message);
          }
        }

        // ==========================================
        // 10. 全局事件绑定
        // ==========================================
        function bindAllEvents() {
          // 发现页按键
          document.getElementById('btn-pass')?.addEventListener('click', doPass);
          document.getElementById('btn-like')?.addEventListener('click', doLike);
          
          // 刷新按钮 (拉取新卡片)
          document.getElementById('btn-refresh-discover')?.addEventListener('click', async () => {
             document.getElementById('btn-refresh-discover').classList.add('is-busy');
             try {
               const newCards = await fetchDiscoverCardsViaMainLlm();
               deck = newCards;
               renderCard(deck[0]);
             } catch(e) {
               meetToastShow("生成卡片失败，请检查 Roche AI 配置");
             }
             document.getElementById('btn-refresh-discover').classList.remove('is-busy');
          });

          // 聊天框返回
          document.getElementById('chat-back')?.addEventListener('click', closeChat);
          
          // 发送消息
          document.getElementById('chat-send')?.addEventListener('click', () => {
            if(!currentChat) return;
            const inp = document.getElementById('chat-input');
            const text = inp.value.trim();
            if(!text) return;
            
            const peerId = currentChat.id;
            const currentHist = getConvHistory(peerId);
            currentHist.push({ role: 'user', content: text, ts: Date.now() });
            setConvHistory(peerId, currentHist);
            
            appendMeBubbleOnly(text);
            inp.value = '';
          });

          // 敲回车发消息
          document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
              e.preventDefault();
              document.getElementById('chat-send').click();
            }
          });

          // 触发 AI 回复
          document.getElementById('chat-reply')?.addEventListener('click', async () => {
            document.getElementById('chat-reply').disabled = true;
            await fetchAndAppendPeerReply();
            document.getElementById('chat-reply').disabled = false;
          });

          // 导航 Tab 切换
          document.querySelectorAll('.ma-nav button').forEach(btn => {
            btn.addEventListener('click', () => {
              const tab = btn.getAttribute('data-tab');
              document.querySelectorAll('.ma-nav button').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              
              document.querySelectorAll('.ma-view').forEach(v => v.classList.remove('active'));
              const targetView = document.getElementById('view-' + tab);
              if (targetView) targetView.classList.add('active');

              if(tab === 'inbox') renderInbox();
            });
          });

          // 世界书设定同步按钮
          document.getElementById('btn-open-wb')?.addEventListener('click', async () => {
            meetToastShow("正在同步 Roche 宿主的世界书设定...");
            _wbMainEntriesCache = await readMainWorldInfoEntries();
            const count = _wbMainEntriesCache.length;
            document.getElementById('wb-cta-line').textContent = count > 0 ? `已成功挂载 ${count} 条世界书` : "未读取到世界书，请在 Roche 主界面开启";
          });
        }

        // ==========================================
        // 11. 初始化与 Boot 流程
        // ==========================================
        async function bootChillMatch() {
          // 1. 初始化 Storage 数据
          const storedLiked = await meetStoreGet(IDB_KEY_MEET_LIKED);
          if (storedLiked && Array.isArray(storedLiked)) liked = storedLiked;
          
          const storedConv = await meetStoreGet(IDB_KEY_MEET_CONV);
          if (storedConv && typeof storedConv === 'object') _meetConvMap = storedConv;

          const storedProfile = await meetStoreGet(IDB_KEY_MEET_PROFILE);
          if (storedProfile) _meetUserProfile = storedProfile;
          
          // 2. 预读世界书
          _wbMainEntriesCache = await readMainWorldInfoEntries();

          // 3. 初始渲染
          bindAllEvents();
          renderInbox();

          // 4. 初次若无卡片，用虚假提示或者自动拉取
          if(deck.length === 0) {
            document.getElementById('deck').innerHTML = '<div class="ma-empty" style="cursor:pointer;" id="auto-fetch-trigger"><i class="ph ph-sparkle"></i><p>点此让 AI 为你推荐聊天对象</p></div>';
            document.getElementById('auto-fetch-trigger')?.addEventListener('click', () => {
               document.getElementById('btn-refresh-discover').click();
            });
          }
        }

        await bootChillMatch();

      },
      async unmount(container, roche) {
        // 清理 DOM 与事件
        container.replaceChildren();
      }
    }
  ]
});
