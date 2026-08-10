window.RochePlugin.register({
  id: "soul-meet-app",
  name: "Soul遇见",
  version: "3.6.0",
  apps: [
    {
      id: "soul-meet-main",
      name: "Soul遇见",
      icon: "favorite",
      async mount(container, roche) {
        container.classList.add("soul-meet-container");
        
        // ==========================================
        // 1. 注入 CSS (所有新UI及占位图剔除, 增加新主题)
        // ==========================================
        const style = document.createElement("style");
        style.id = "soul-meet-styles";
        style.textContent = `
          .soul-meet-container { width: 100%; height: 100%; display: flex; justify-content: center; background: #fbfbfd; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #333; overflow: hidden; position: relative; }
          .sm-bg-blobs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
          .sm-blob { position: absolute; filter: blur(80px); opacity: 0.5; border-radius: 50%; }
          .sm-blob-1 { top: -10%; left: -10%; width: 350px; height: 350px; background: #ffccd5; }
          .sm-blob-2 { bottom: -10%; right: -10%; width: 300px; height: 300px; background: #c8b6ff; }
          .sm-blob-3 { top: 40%; right: -20%; width: 250px; height: 250px; background: #ffe4b5; }
          .sm-app { width: 100%; max-width: 480px; height: 100%; background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; box-shadow: 0 0 30px rgba(0,0,0,0.03); position: relative; z-index: 1; overflow:hidden;}
          .sm-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 700; font-size: 18px; z-index: 10; letter-spacing: 0.5px; position:relative; flex-shrink:0;}
          .sm-header-btn { background: none; border: none; cursor: pointer; color: #888; font-size: 14px; font-weight: 500; transition: color 0.2s;}
          .sm-header-btn:hover { color: #333; }
          .sm-view { flex: 1; overflow-y: auto; display: none; flex-direction: column; position:relative;}
          .sm-view.active { display: flex; }
          .sm-nav { display: flex; justify-content: space-around; padding: 14px 0; border-top: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.8); padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px)); z-index:10; flex-shrink:0;}
          .sm-nav-btn { background: none; border: none; font-size: 12px; color: #a0a0a0; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
          .sm-nav-btn i { font-size: 20px; font-style: normal; }
          .sm-nav-btn.active { color: #ff6b81; font-weight: 600; transform: translateY(-2px); }
          
          /* 发现页模式切换 */
          .sm-mode-switch { position:absolute; top:12px; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.9); backdrop-filter:blur(10px); border-radius:20px; display:flex; padding:4px; box-shadow:0 4px 10px rgba(0,0,0,0.05); z-index:20; border:1px solid rgba(0,0,0,0.05); }
          .sm-mode-btn { padding:4px 14px; font-size:12px; font-weight:700; border-radius:16px; cursor:pointer; color:#888; border:none; background:transparent; transition:all 0.3s ease;}
          .sm-mode-btn.active { background:linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color:#fff; box-shadow:0 2px 6px rgba(255,154,158,0.3);}
          
          /* 发现页卡片 */
          .sm-card-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden; touch-action: none; padding-top:40px;}
          .sm-card { width: 100%; max-width: 330px; aspect-ratio: 3/4.2; background: #fff; border-radius: 28px; box-shadow: 0 15px 35px rgba(0,0,0,0.08); display: flex; flex-direction: column; overflow: hidden; position: relative; border: 1px solid rgba(255,255,255,0.5); z-index: 2; cursor: grab; transform-origin: 50% 100%; will-change: transform; }
          .sm-card.dragging { cursor: grabbing; transition: none !important; }
          .sm-card:not(.dragging) { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), opacity 0.4s ease; }
          .sm-card-img { flex: 1; background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); display:flex; align-items:center; justify-content:center; font-size: 70px; color:#ddd; pointer-events: none;}
          .sm-card-info { padding: 24px 20px; background: linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0)); position: absolute; bottom: 0; width: 100%; pointer-events: none;}
          .sm-card-name { font-size: 24px; font-weight: 800; margin-bottom: 6px; color: #222; display: flex; justify-content: space-between; align-items: center;}
          .sm-card-match { font-size: 14px; font-weight: 700; color: #ff6b81; background: #fff0f3; padding: 4px 10px; border-radius: 12px; }
          .sm-card-tags { font-size: 13px; color: #a29bfe; margin-bottom: 10px; font-weight:600; display: flex; gap: 6px; flex-wrap: wrap;}
          .sm-card-tag { background: #f3f0ff; padding: 4px 10px; border-radius: 10px; }
          .sm-card-bio { font-size: 14.5px; color: #555; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
          .sm-card-type { position:absolute; top:16px; right:16px; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); color:#fff; font-size:11px; font-weight: 600; padding:6px 12px; border-radius:14px; letter-spacing: 1px;}
          .sm-actions { display: flex; justify-content: center; gap: 30px; margin-top: 24px; z-index: 2; }
          .sm-act-btn { width: 64px; height: 64px; border-radius: 50%; border: none; font-size: 26px; cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.06); background: #fff; transition: transform 0.2s; display: flex; align-items: center; justify-content: center;}
          .sm-act-btn:active { transform: scale(0.85); }
          
          /* UI 面板与按钮 */
          .sm-empty-state { text-align:center; z-index:2; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;}
          .sm-btn-primary { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #fff; border: none; padding: 12px 24px; border-radius: 20px; font-weight: 600; font-size: 15px; cursor: pointer; box-shadow: 0 6px 15px rgba(255, 154, 158, 0.3); transition: transform 0.2s;}
          .sm-btn-primary:active { transform: scale(0.95); }
          .sm-btn-outline { background: #fff; color: #555; border: 1px solid #ddd; padding: 12px 24px; border-radius: 20px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s; }
          .sm-panel { padding: 24px; background: #fff; margin: 16px; border-radius: 24px; box-shadow: 0 8px 20px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.02);}
          .sm-panel h3 { font-size: 17px; margin-bottom: 16px; color: #222; font-weight: 800; }
          .sm-chip-container { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;}
          .sm-chip { display: inline-block; padding: 8px 14px; border-radius: 20px; border: 1px solid #eee; font-size: 13px; cursor: pointer; background: #fafafa; color: #666; font-weight: 500; transition: 0.2s; user-select:none;}
          .sm-chip.selected { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); color: #fff; border-color: transparent; font-weight: 700;}
          .sm-pref-chip.selected { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #fff; border-color: transparent;}
          .sm-custom-input-wrap { display: flex; gap: 8px; margin-top: 8px; width: 100%;}
          .sm-custom-input { flex: 1; padding: 10px 12px; border-radius: 14px; border: 1px solid #ddd; font-size: 14px; outline: none; background: #fafafa; transition: 0.2s; font-family:inherit;}
          .sm-custom-input:focus { border-color: #ff9a9e; background: #fff; }
          
          /* ==================================================== */
          /* 广场动态样式 */
          /* ==================================================== */
          .sm-square-feed { flex:1; overflow-y:auto; padding:0; display:flex; flex-direction:column; background:#f4f5f7; }
          .sm-post { background:#fff; margin-bottom:10px; padding:16px; display:flex; flex-direction:column; gap:10px; position:relative; }
          .sm-post-header { display:flex; align-items:center; gap:12px; }
          .sm-post-av { width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg, #a18cd1, #fbc2eb); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:bold; font-size:18px; cursor:pointer; }
          .sm-post-info { flex:1; }
          .sm-post-name { font-weight:700; font-size:15px; color:#222; }
          .sm-post-time { font-size:11px; color:#999; margin-top:2px; }
          .sm-post-more { margin-left:auto; cursor:pointer; color:#999; font-weight:bold; font-size:18px; padding:4px 8px; border-radius:50%; transition:0.2s;}
          .sm-post-more:active { background:#f0f0f0; color:#333; }
          .sm-post-text { font-size:14.5px; color:#333; line-height:1.6; word-wrap:break-word; }
          
          /* 无图片底图的新样式 */
          .sm-post-img-wrap { width:100%; min-height:80px; border-radius:12px; margin-top:6px; display:flex; align-items:center; justify-content:center; background:#fcfcfc; border: 1px dashed #ccc; box-sizing:border-box; padding:16px; }
          .sm-post-img-text { font-size:13px; color:#888; text-align:center; }
          
          .sm-post-actions { display:flex; gap:20px; border-top:1px solid #f0f0f0; padding-top:12px; margin-top:4px; }
          .sm-post-act-btn { display:flex; align-items:center; gap:6px; color:#777; font-size:13px; cursor:pointer; background:none; border:none; padding:0; }
          .sm-post-act-btn.liked { color:#ff6b81; font-weight:bold; }
          
          .sm-comments { background:#f9f9f9; border-radius:12px; padding:10px; margin-top:8px; display:flex; flex-direction:column; gap:8px; }
          .sm-comment-item { font-size:13px; line-height:1.5; color:#444; position:relative; display:flex; gap:6px; align-items:flex-start;}
          .sm-comment-name { font-weight:700; color:#6c5ce7; cursor:pointer; flex-shrink:0;}
          .sm-comment-text { flex:1; word-wrap:break-word;}
          .sm-comment-action { cursor:pointer; font-size:11px; color:#888; transition:0.2s; white-space:nowrap;}
          .sm-comment-action:hover { color:#555; }
          .sm-comment-del { color:#ff9a9e; font-size:11px; cursor:pointer; display:none; flex-shrink:0;}
          .sm-comment-item:hover .sm-comment-del { display:inline; }
          .sm-refresh-square { background:linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color:#fff; border:none; padding:12px; margin:16px; border-radius:20px; font-weight:bold; cursor:pointer; box-shadow:0 4px 12px rgba(255,154,158,0.3); transition:0.2s; text-align:center;}
          .sm-refresh-square:active { transform:scale(0.95); }

          /* 消息列表 */
          .sm-list-item { display: flex; padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.03); align-items: center; gap: 14px; cursor: pointer; transition: background 0.2s; margin: 0 8px; border-radius: 16px; user-select: none; -webkit-user-select: none;}
          .sm-list-item:hover { background: rgba(255,255,255,0.8); }
          .sm-list-item:active { background: rgba(0,0,0,0.05); }
          .sm-list-av { width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:bold; font-size:22px; color:#fff;}
          .sm-list-mid { flex: 1; min-width: 0; pointer-events: none;}
          .sm-list-name { font-weight: 700; font-size: 16px; margin-bottom: 6px; color: #222;}
          .sm-list-sub { font-size: 13.5px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .sm-list-tag { font-size: 10px; border: 1px solid #ff6b81; color: #ff6b81; padding: 2px 8px; border-radius: 12px; margin-left: 6px; font-weight: 600;}
          
          /* 聊天室框架 */
          .sm-chat-room { position: absolute; inset: 0; background: #fbfbfd; z-index: 50; display: none; flex-direction: column; transition: background 0.3s;}
          .sm-chat-room.open { display: flex; }
          .sm-chat-head { padding: 12px 16px; background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; z-index: 10;}
          .sm-chat-tools { display: flex; gap: 8px; }
          .sm-tool-btn { background: #fff; border: 1px solid #eee; padding: 6px 12px; border-radius: 16px; font-size: 12px; cursor: pointer; color: #555; font-weight: 600;}
          .sm-chat-history { flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; }
          .sm-msg-wrapper { display: flex; flex-direction: column; max-width: 80%; user-select: none; -webkit-user-select: none; }
          .sm-msg-wrapper.me { align-self: flex-end; align-items: flex-end; }
          .sm-msg-wrapper.peer { align-self: flex-start; align-items: flex-start; }
          
          /* 气泡系统 */
          .sm-msg { 
            position: relative; padding: 12px 16px; border-radius: 25px; font-size: 14.5px; line-height: 1.5; white-space: pre-wrap; word-break: break-word;
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), inset 0 4px 15px rgba(255, 255, 255, 0.4), inset 0 2px 5px rgba(0, 0, 0, 0.2);
            cursor: pointer; transition: filter 0.2s, opacity 0.3s, transform 0.3s;
          }
          .sm-msg:active { filter: brightness(0.9); }
          .sm-msg.me { border-bottom-right-radius: 4px; }
          .sm-msg.peer { border-bottom-left-radius: 4px; }
          
          /* 主题皮肤 */
          .sm-chat-history[data-theme="default"] .sm-msg.me, .sm-chat-history:not([data-theme]) .sm-msg.me { background: radial-gradient(ellipse at 100% 20%, rgba(126, 185, 67, 0.7) 0%, rgba(160, 233, 86, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #1a3d00; }
          .sm-chat-history[data-theme="default"] .sm-msg.peer, .sm-chat-history:not([data-theme]) .sm-msg.peer { background: radial-gradient(ellipse at 100% 20%, rgba(180, 180, 180, 0.7) 0%, rgba(255, 255, 255, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #333; }
          .sm-chat-history[data-theme="pink_blue"] .sm-msg.me { background: radial-gradient(ellipse at 100% 20%, rgba(255, 195, 201, 0.7) 0%, rgba(250, 218, 221, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #d88499; }
          .sm-chat-history[data-theme="pink_blue"] .sm-msg.peer { background: radial-gradient(ellipse at 100% 20%, rgba(169, 191, 209, 0.7) 0%, rgba(214, 234, 248, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #283747; }
          .sm-chat-history[data-theme="blue_white"] .sm-msg.me { background: radial-gradient(ellipse at 100% 20%, rgba(142, 186, 230, 0.7) 0%, rgba(204, 229, 255, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #004085; }
          .sm-chat-history[data-theme="blue_white"] .sm-msg.peer { background: radial-gradient(ellipse at 100% 20%, rgba(223, 223, 223, 0.7) 0%, rgba(248, 249, 250, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #383d41; }
          .sm-chat-history[data-theme="purple_yellow"] .sm-msg.me { background: radial-gradient(ellipse at 100% 20%, rgba(191, 191, 222, 0.7) 0%, rgba(230, 230, 250, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #4B0082; }
          .sm-chat-history[data-theme="purple_yellow"] .sm-msg.peer { background: radial-gradient(ellipse at 100% 20%, rgba(230, 230, 189, 0.7) 0%, rgba(255, 250, 205, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #5C4033; }
          .sm-chat-history[data-theme="black_white"] .sm-msg.me { background: radial-gradient(ellipse at 100% 20%, rgba(79, 79, 79, 0.7) 0%, rgba(52, 58, 64, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #f8f9fa; }
          .sm-chat-history[data-theme="black_white"] .sm-msg.peer { background: radial-gradient(ellipse at 100% 20%, rgba(223, 223, 223, 0.7) 0%, rgba(248, 249, 250, 0.5) 40%, rgba(255, 255, 255, 0.4) 100%); color: #343a40; }
          
          /* 新增气泡主题 */
          .sm-chat-history[data-theme="matcha"] .sm-msg.me { background: radial-gradient(ellipse at 100% 20%, #c8e6c9 0%, #a5d6a7 40%, #e8f5e9 100%); color: #2e7d32; }
          .sm-chat-history[data-theme="matcha"] .sm-msg.peer { background: radial-gradient(ellipse at 100% 20%, #f1f8e9 0%, #ffffff 40%, #f1f8e9 100%); color: #333; }
          .sm-chat-history[data-theme="ocean"] .sm-msg.me { background: radial-gradient(ellipse at 100% 20%, #0077b6 0%, #0096c7 40%, #48cae4 100%); color: #fff; }
          .sm-chat-history[data-theme="ocean"] .sm-msg.peer { background: radial-gradient(ellipse at 100% 20%, #caf0f8 0%, #ade8f4 40%, #90e0ef 100%); color: #03045e; }
          .sm-chat-history[data-theme="cyberpunk"] .sm-msg.me { background: radial-gradient(ellipse at 100% 20%, #f72585 0%, #b5179e 40%, #7209b7 100%); color: #fff; box-shadow: 0 0 10px #f72585;}
          .sm-chat-history[data-theme="cyberpunk"] .sm-msg.peer { background: radial-gradient(ellipse at 100% 20%, #4cc9f0 0%, #48cae4 40%, #00b4d8 100%); color: #000; box-shadow: 0 0 10px #4cc9f0;}

          .sm-quote-box { background: rgba(0,0,0,0.05); padding: 6px 10px; border-radius: 8px; font-size: 12px; margin-bottom: 6px; color: inherit; opacity: 0.8; border-left: 3px solid rgba(0,0,0,0.1); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          
          .sm-msg.is-transparent { padding: 0 !important; background: transparent !important; box-shadow: none !important; border: none !important; border-radius:0 !important; }
          .sm-transfer-card { width: 190px; border-radius: 14px; padding: 14px; color: #3a7bb4; position: relative; overflow: hidden; pointer-events: none;}
          .sm-msg.me .sm-transfer-card { background: radial-gradient(circle at top left, #e2f0ff, #b0d2f7); }
          .sm-msg.peer .sm-transfer-card { background: radial-gradient(circle at top left, #d6ebff, #c2e0ff); }
          .sm-transfer-title { font-size: 13px; font-weight: 700; margin-bottom: 6px; }
          .sm-transfer-amount { font-size: 20px; font-weight: bold; margin-bottom: 4px; }
          .sm-transfer-note { font-size: 11px; opacity: 0.9; border-top: 1px solid rgba(26, 56, 82, 0.15); padding-top: 6px; }
          .sm-voice-message { display: flex; align-items: center; padding: 10px 14px; min-width: 100px; max-width: 220px; gap: 8px; font-size: 14.5px; border-radius: 20px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); box-shadow: 0 4px 8px rgba(0,0,0,0.05); color: #333; border: 1px solid rgba(255,255,255,0.4); pointer-events: none;}
          .sm-msg.me .sm-voice-message { flex-direction: row-reverse; background: rgba(254, 207, 239, 0.8); }
          
          /* 聊天室内的图片，同步去底图 */
          .sm-ai-image-wrap { width:100%; border-radius:12px; margin-top:4px; display:flex; align-items:center; justify-content:center; background:#fdfdfd; border: 1px dashed #ccc; box-sizing:border-box; padding:12px; pointer-events:none;}
          .sm-ai-image-desc { font-size: 13px; color: #888; text-align: center; }

          /* 打字中动画 */
          .sm-typing-bubble { display: flex; align-items: center; gap: 6px; padding: 14px 18px; border-radius: 25px; background: rgba(255,255,255,0.8); width: fit-content; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-bottom-left-radius: 4px;}
          .sm-typing-dot { width: 6px; height: 6px; background: #ff9a9e; border-radius: 50%; animation: sm-bounce 1.4s infinite ease-in-out both; }
          .sm-typing-dot:nth-child(1) { animation-delay: -0.32s; }
          .sm-typing-dot:nth-child(2) { animation-delay: -0.16s; }
          @keyframes sm-bounce { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.4;} 40% { transform: scale(1.1); opacity: 1; } }

          /* 聊天输入框区域 (无回复键) */
          .sm-chat-input-area { padding: 10px 16px; background: rgba(255,255,255,0.85); backdrop-filter:blur(10px); border-top: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 8px; padding-bottom:calc(10px + env(safe-area-inset-bottom, 0px)); z-index:10;}
          .sm-chat-actions-top { display: flex; gap: 10px; align-items: center; padding-bottom: 2px; }
          .sm-action-icon-btn { font-size: 16px; width: 32px; height: 32px; border-radius: 50%; background: #fff; color: #555; border: 1px solid #eee; cursor: pointer; display:flex; justify-content:center; align-items:center; transition: 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.04);}
          .sm-action-icon-btn:hover { background: #f0f0f0; transform: scale(1.05); }
          .sm-input-row { display: flex; gap: 10px; align-items: flex-end; }
          .sm-chat-input { flex: 1; padding: 10px 16px; border-radius: 20px; border: 1px solid #eee; outline: none; font-size: 14.5px; background:#f9f9f9; resize: none; max-height: 100px; font-family:inherit;}
          .sm-chat-input:focus { border-color: #ffb8b8; background: #fff; }
          .sm-chat-send { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #fff; border: none; width: 42px; height: 42px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 18px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition: transform 0.2s; box-shadow: 0 4px 10px rgba(255,154,158,0.4);}
          .sm-chat-send:active { transform: scale(0.85); }
          
          /* ====== 全新 RP 线下约会系统 ====== */
          .sm-rp-room { position: absolute; inset: 0; background: #111; z-index: 60; display: none; flex-direction: column; color: #ddd; transition: background 0.3s, color 0.3s;}
          .sm-rp-room.open { display: flex; animation: rp-fade-in 0.5s ease; }
          @keyframes rp-fade-in { from { opacity:0; transform: scale(1.05); } to { opacity:1; transform: scale(1); } }
          
          .sm-rp-room[data-theme="dark"] { background: #111; color: #ddd; }
          .sm-rp-room[data-theme="dark"] .sm-rp-header, .sm-rp-room[data-theme="dark"] .sm-rp-control { background: #0a0a0a; border-color: #222; }
          .sm-rp-room[data-theme="dark"] .sm-rp-input { background: #1a1a1a; border-color: #333; color: #fff; }
          .sm-rp-room[data-theme="dark"] .sm-rp-act-btn { background: #222; border-color: #333; color: #bbb; }
          .sm-rp-room[data-theme="dark"] .sm-rp-dialogue { color: #ffcfcf; }
          
          .sm-rp-room[data-theme="blue"] { background: #e0f0f5; color: #334; }
          .sm-rp-room[data-theme="blue"] .sm-rp-header, .sm-rp-room[data-theme="blue"] .sm-rp-control { background: #d0e4eb; border-color: #b0c4cb; }
          .sm-rp-room[data-theme="blue"] .sm-rp-input { background: #fff; border-color: #b0c4cb; color: #334; }
          .sm-rp-room[data-theme="blue"] .sm-rp-act-btn { background: #fff; border-color: #b0c4cb; color: #5b8a9b; }
          .sm-rp-room[data-theme="blue"] .sm-rp-dialogue { color: #1e5a70; }
          .sm-rp-room[data-theme="blue"] .sm-rp-block.user { color: #5b8a9b; }
          .sm-rp-room[data-theme="blue"] .sm-rp-block.ai { color: #334; }
          
          .sm-rp-room[data-theme="pink"] { background: #fff0f3; color: #553; }
          .sm-rp-room[data-theme="pink"] .sm-rp-header, .sm-rp-room[data-theme="pink"] .sm-rp-control { background: #ffe3e8; border-color: #ffc2ce; }
          .sm-rp-room[data-theme="pink"] .sm-rp-input { background: #fff; border-color: #ffc2ce; color: #553; }
          .sm-rp-room[data-theme="pink"] .sm-rp-act-btn { background: #fff; border-color: #ffc2ce; color: #ff7da0; }
          .sm-rp-room[data-theme="pink"] .sm-rp-dialogue { color: #d6336c; }
          .sm-rp-room[data-theme="pink"] .sm-rp-block.user { color: #ff7da0; }
          .sm-rp-room[data-theme="pink"] .sm-rp-block.ai { color: #553; }
          
          .sm-rp-room[data-theme="yellow"] { background: #fffce0; color: #543; }
          .sm-rp-room[data-theme="yellow"] .sm-rp-header, .sm-rp-room[data-theme="yellow"] .sm-rp-control { background: #fff5c2; border-color: #ffe680; }
          .sm-rp-room[data-theme="yellow"] .sm-rp-input { background: #fff; border-color: #ffe680; color: #543; }
          .sm-rp-room[data-theme="yellow"] .sm-rp-act-btn { background: #fff; border-color: #ffe680; color: #d4a000; }
          .sm-rp-room[data-theme="yellow"] .sm-rp-dialogue { color: #b38600; }
          .sm-rp-room[data-theme="yellow"] .sm-rp-block.user { color: #d4a000; }
          .sm-rp-room[data-theme="yellow"] .sm-rp-block.ai { color: #543; }
          
          .sm-rp-room[data-theme="neon"] { background: #1a002a; color: #eee; text-shadow: 0 0 2px rgba(255,0,255,0.3); }
          .sm-rp-room[data-theme="neon"] .sm-rp-header, .sm-rp-room[data-theme="neon"] .sm-rp-control { background: #2d004d; border-color: #ff00ff; }
          .sm-rp-room[data-theme="neon"] .sm-rp-input { background: #11001c; border-color: #00ffff; color: #fff; }
          .sm-rp-room[data-theme="neon"] .sm-rp-act-btn { background: transparent; border-color: #00ffff; color: #00ffff; }
          .sm-rp-room[data-theme="neon"] .sm-rp-dialogue { color: #ff00ff; text-shadow: 0 0 5px #ff00ff; }
          .sm-rp-room[data-theme="neon"] .sm-rp-block.user { color: #00ffff; }
          .sm-rp-room[data-theme="neon"] .sm-rp-block.ai { color: #eee; }

          .sm-rp-header { display:flex; align-items:center; justify-content:space-between; padding: 12px 16px; border-bottom: 1px solid; z-index:10;}
          .sm-rp-close { background:none; border:none; color:#ff6b81; font-size:14px; cursor:pointer; font-weight:bold;}
          .sm-rp-status { display:flex; gap: 14px; font-size:12px; opacity:0.8;}
          .sm-rp-status-item { display:flex; flex-direction:column; align-items:center; }
          .sm-rp-val { color: #ff9a9e; font-weight:bold; font-size:13px; margin-top:2px;}
          
          .sm-rp-history { flex: 1; overflow-y: auto; padding: 24px 16px; display: flex; flex-direction: column; gap: 24px; font-family: "Georgia", serif; font-size: 15px; line-height: 1.8; letter-spacing: 0.5px;}
          .sm-rp-block { display:flex; flex-direction:column; gap:4px; }
          .sm-rp-block.sys { opacity:0.6; font-style: italic; text-align:center; font-size:12.5px; }
          .sm-rp-block.user { text-align: right; }
          .sm-rp-dialogue { font-weight:bold; }
          
          .sm-rp-control { border-top: 1px solid; padding: 12px 16px; display:flex; flex-direction:column; gap:10px; padding-bottom:calc(12px + env(safe-area-inset-bottom, 0px));}
          .sm-rp-actions { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px;}
          .sm-rp-actions::-webkit-scrollbar { display:none; }
          .sm-rp-act-btn { padding: 8px 16px; border-radius:18px; font-size:13px; white-space:nowrap; cursor:pointer; transition:0.2s;}
          .sm-rp-act-btn:active { background: #ff9a9e !important; color:#fff !important; border-color:#ff9a9e !important;}
          .sm-rp-input-row { display:flex; gap:10px; }
          .sm-rp-input { flex:1; padding:12px 16px; border-radius:20px; font-size:14px; outline:none; font-family:inherit;}
          .sm-rp-tool { display:flex; justify-content:space-between; margin-top:4px;}
          .sm-rp-tool-btn { background:none; border:none; opacity:0.7; font-size:12px; cursor:pointer; font-weight:600; color:inherit;}
          .sm-rp-tool-btn:hover { opacity:1; }
          
          /* 弹窗等公用样式 */
          .sm-modal-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index:100; display:none; align-items:center; justify-content:center; padding: 20px;}
          .sm-modal-overlay.open { display:flex; }
          .sm-modal { background:#fff; width:100%; max-width:320px; border-radius:24px; padding:20px; display:flex; flex-direction:column; gap:16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);}
          .sm-modal textarea { width:100%; height:180px; padding:14px; border:1px solid #eee; border-radius:16px; resize:none; font-family:inherit; background: #fcfcfc; font-size: 14px; color: #444;}
          .sm-modal-btns { display:flex; justify-content:flex-end; gap:12px; margin-top:8px; }
          .sm-modal-btn { padding:10px 20px; border:none; border-radius:16px; cursor:pointer; font-weight:700; font-size:14px; }
          
          /* 底部 Action Sheet 菜单 */
          .sm-action-sheet { background: #fff; width: 100%; border-radius: 24px 24px 0 0; position: absolute; bottom: 0; left: 0; display: flex; flex-direction: column; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); padding-bottom: env(safe-area-inset-bottom, 0px);}
          .sm-modal-overlay.open .sm-action-sheet { transform: translateY(0); }
          .sm-sheet-item { padding: 18px; text-align: center; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f0f0; cursor: pointer; color:#333; }
          .sm-sheet-item.danger { color: #d63031; }
          .sm-sheet-cancel { border-top: 6px solid #f4f5f7; border-bottom: none;}
        `;
        container.appendChild(style);

        // 动态注入自定义聊天CSS的容器
        const customStyle = document.createElement("style");
        customStyle.id = "sm-dynamic-custom-css";
        container.appendChild(customStyle);

        // ==========================================
        // 2. 构建 DOM 骨架
        // ==========================================
        const appDOM = document.createElement("div");
        appDOM.className = "sm-app";
        appDOM.innerHTML = `
          <div class="sm-bg-blobs">
            <div class="sm-blob sm-blob-1"></div>
            <div class="sm-blob sm-blob-2"></div>
            <div class="sm-blob sm-blob-3"></div>
          </div>
          
          <div class="sm-header">
            <span>Soul Meet ✨</span>
            <div class="sm-mode-switch" id="mode-switch">
              <button class="sm-mode-btn active" data-mode="normal">纯爱</button>
              <button class="sm-mode-btn" data-mode="r18" style="color:#ff6b81;">狂野</button>
            </div>
            <button class="sm-header-btn" id="sm-close-plugin">✕</button>
          </div>

          <!-- =================== 1. 发现页 =================== -->
          <div class="sm-view active" id="view-discover">
            <div class="sm-card-wrap" id="sm-deck-container"></div>
            <div class="sm-actions" id="sm-card-actions" style="display:none;">
              <button class="sm-act-btn sm-act-pass" id="btn-pass">✖</button>
              <button class="sm-act-btn sm-act-like" id="btn-like">♥</button>
            </div>
          </div>

          <!-- =================== 2. 广场页 =================== -->
          <div class="sm-view" id="view-square" style="background:#f4f5f7;">
            <div class="sm-header" style="background:#fff; border-bottom:none; margin:0; padding:12px 20px;">
              <span>🌍 匿名广场</span>
              <button class="sm-header-btn" id="btn-clear-square" style="color:#ff6b81;">清理</button>
            </div>
            <div id="sm-square-feed" class="sm-square-feed">
               <!-- 动态列表注入在这里 -->
            </div>
          </div>

          <!-- =================== 3. 消息页 =================== -->
          <div class="sm-view" id="view-inbox">
            <div class="sm-header" style="background:transparent; border:none; border-bottom: 1px solid rgba(0,0,0,0.03);">💌 你的缘分</div>
            <div id="sm-inbox-list" style="flex:1; overflow-y:auto; padding-top: 8px;"></div>
          </div>

          <!-- =================== 4. 我的页 (包含伪装人设及专属设定) =================== -->
          <div class="sm-view" id="view-me">
            <div class="sm-panel">
              <h3>👤 我的档案</h3>
              <p style="font-size:12px; color:#888; margin-bottom:8px;">原系统底色：<span id="sm-sys-persona"></span></p>
              
              <label style="font-size:13px; font-weight:600; color:#444;">🎭 社交伪装人设 (在此软件内表现的身份)</label>
              <div class="sm-custom-input-wrap" style="flex-direction:column; margin-top:8px;">
                <textarea id="sm-fake-persona-input" class="sm-custom-input" rows="3" placeholder="例如：表面是个高冷学霸，其实是个沙雕段子手...（留空则使用原系统底色）"></textarea>
                <button class="sm-btn-primary" id="btn-save-fake-persona" style="margin-top:10px; padding:10px; width:100%;">保存伪装身份</button>
              </div>
            </div>
            
            <div class="sm-panel">
              <h3>❤️ 交友偏好 (多选)</h3>
              <p>勾选你更希望遇到哪种特质的人：</p>
              <div id="sm-pref-list" class="sm-chip-container"></div>
              <div class="sm-custom-input-wrap">
                <input type="text" id="sm-custom-pref-input" class="sm-custom-input" placeholder="输入自定义偏好标签...">
                <button class="sm-btn-outline" id="btn-add-pref" style="padding: 8px 16px;">添加</button>
              </div>
            </div>

            <div class="sm-panel">
              <h3>🌍 宇宙设定挂载</h3>
              <p style="font-size:13px; margin-bottom:6px;">系统世界书：</p>
              <div id="sm-wb-list" class="sm-chip-container" style="margin-bottom:16px;"></div>
              
              <p style="font-size:13px; margin-bottom:6px;"><b>📖 本地专属设定 (多选启用)</b></p>
              <div id="sm-local-wb-list" class="sm-chip-container" style="margin-bottom:8px;"></div>
              <div class="sm-custom-input-wrap" style="flex-direction:column; gap:6px;">
                <input type="text" id="sm-local-wb-name" class="sm-custom-input" placeholder="设定名称 (如: 赛博修仙A区)">
                <textarea id="sm-local-wb-content" class="sm-custom-input" rows="2" placeholder="具体世界观或规则设定..."></textarea>
                <button class="sm-btn-outline" id="btn-add-local-wb">保存新设定</button>
              </div>
            </div>

            <div class="sm-panel" style="box-shadow:none; background:transparent; border:none; padding-top:0;">
              <button class="sm-btn-outline" id="btn-clear-data" style="width:100%; color:#d63031; border-color:#fab1a0; background:#fff;">清空交友记忆</button>
            </div>
          </div>

          <!-- =================== 底部导航栏 =================== -->
          <div class="sm-nav">
            <button class="sm-nav-btn active" data-target="view-discover"><i>💖</i>匹配</button>
            <button class="sm-nav-btn" data-target="view-square"><i>🌍</i>广场</button>
            <button class="sm-nav-btn" data-target="view-inbox"><i>💌</i>消息</button>
            <button class="sm-nav-btn" data-target="view-me"><i>⚙️</i>我的</button>
          </div>

          <!-- =================== 以下为各个悬浮窗口和功能页 =================== -->

          <!-- 线上聊天室 -->
          <div class="sm-chat-room" id="sm-chat-room">
            <div class="sm-chat-head">
              <button class="sm-header-btn" id="btn-chat-back" style="font-size:22px; padding:0 10px;">‹</button>
              <span id="chat-peer-name" style="font-weight:800; font-size:16px;">名字</span>
              <div class="sm-chat-tools">
                <button class="sm-tool-btn" id="btn-chat-settings" title="聊天设置">⚙️</button>
                <button class="sm-tool-btn" id="btn-chat-persona" title="生成档案">提取人设</button>
              </div>
            </div>
            <div class="sm-chat-history" id="chat-history"></div>
            
            <div class="sm-chat-input-area">
              <div class="sm-chat-actions-top">
                <button class="sm-action-icon-btn" id="btn-send-photo" title="发送照片">📷</button>
                <button class="sm-action-icon-btn" id="btn-send-transfer" title="转账">💰</button>
                <button class="sm-action-icon-btn" id="btn-send-voice" title="发送语音">🎤</button>
                <button class="sm-action-icon-btn" id="btn-send-meet" title="发起线下约会" style="color:#ff6b81; border-color:#ffe3e3; background:#fff0f3; font-weight:bold;">📍</button>
              </div>
              
              <div id="chat-quote-preview" style="display:none; width:100%; font-size:12px; color:#666; background:#f0f0f0; padding:6px 10px; border-radius:8px; align-items:center; justify-content:space-between; margin-bottom:6px;">
                 <span id="chat-quote-text" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;"></span>
                 <span id="btn-cancel-quote" style="cursor:pointer; padding-left:10px; font-weight:bold; color:#888;">✕</span>
              </div>
              
              <div class="sm-input-row">
                <textarea class="sm-chat-input" id="chat-input" rows="1" placeholder="说点什么... (回车换行)"></textarea>
                <button class="sm-chat-send" id="chat-send">➤</button>
              </div>
            </div>
          </div>
          
          <!-- 线下约会 RP 模式引擎 -->
          <div class="sm-rp-room" id="sm-rp-room" data-theme="dark">
             <div class="sm-rp-header">
                <button class="sm-rp-close" id="btn-rp-exit">◂ 逃离现实</button>
                <div class="sm-rp-status">
                   <div class="sm-rp-status-item">地点<span class="sm-rp-val" id="rp-stat-loc">未知</span></div>
                   <div class="sm-rp-status-item">状态<span class="sm-rp-val" id="rp-stat-mood">平静</span></div>
                   <div class="sm-rp-status-item">本能<span class="sm-rp-val" id="rp-stat-desire">0%</span></div>
                </div>
                <button class="sm-tool-btn" id="btn-rp-settings" style="background:transparent; border:none; padding:0; font-size:16px;">⚙️</button>
             </div>
             
             <div class="sm-rp-history" id="rp-history">
                 <div class="sm-rp-block sys">加载幻境...</div>
             </div>
             
             <div class="sm-rp-control">
                <div class="sm-rp-actions" id="rp-dynamic-actions">
                   <!-- 动态加载选项 -->
                </div>
                <div class="sm-rp-input-row">
                   <input type="text" id="rp-input" class="sm-rp-input" placeholder="输入你想做的事或说的话...">
                   <button class="sm-chat-send" id="rp-send" style="width:42px;height:42px;border-radius:16px;">✦</button>
                </div>
                <div class="sm-rp-tool">
                   <button class="sm-rp-tool-btn" id="btn-rp-undo">↺ 撤回</button>
                   <button class="sm-rp-tool-btn" id="btn-rp-reroll">⚄ 重Roll</button>
                   <button class="sm-rp-tool-btn" id="btn-rp-summarize" style="color:#a29bfe;">📝 铭刻回忆</button>
                   <button class="sm-rp-tool-btn" id="btn-rp-reset" style="color:#ff6b81;">☀ 新生</button>
                </div>
             </div>
          </div>

          <!-- 通用弹窗：展示人设 -->
          <div class="sm-modal-overlay" id="modal-persona">
            <div class="sm-modal">
              <h3 style="margin:0; font-size:18px;">✨ 灵魂档案</h3>
              <p style="font-size:13px; color:#888; margin:0;">已根据聊天提取了细节，可直接复制使用。</p>
              <textarea id="modal-persona-text" readonly></textarea>
              <div class="sm-modal-btns"><button class="sm-modal-btn sm-btn-outline" id="btn-close-modal">关闭</button></div>
            </div>
          </div>

          <!-- 线上聊天设置弹窗 -->
          <div class="sm-modal-overlay" id="modal-chat-settings">
            <div class="sm-modal">
              <h3 style="margin:0;">⚙️ 聊天设定</h3>
              <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
                <label style="font-size:13px;font-weight:600;">为 Ta 修改备注</label>
                <input type="text" id="setting-alias" class="sm-custom-input" placeholder="新的备注名...">
                
                <label style="font-size:13px;font-weight:600;">聊天背景</label>
                <div style="display:flex; gap:8px;">
                  <button class="sm-btn-outline" id="btn-upload-bg" style="flex:1; padding:8px; font-size:13px;">📁 图库选图</button>
                  <button class="sm-btn-outline" id="btn-clear-bg" style="padding:8px; font-size:13px; color:#ff6b81;">清除</button>
                </div>
                <input type="file" id="setting-bg-file" style="display:none;" accept="image/*">
                
                <label style="font-size:13px;font-weight:600;">气泡主题皮肤</label>
                <select id="setting-theme" class="sm-custom-input" style="cursor:pointer;">
                  <option value="default">默认 (清新绿白)</option>
                  <option value="pink_blue">粉蓝之恋</option>
                  <option value="blue_white">经典蓝白</option>
                  <option value="purple_yellow">紫黄梦幻</option>
                  <option value="black_white">暗黑白简</option>
                  <option value="matcha">抹茶拿铁</option>
                  <option value="ocean">深海幽蓝</option>
                  <option value="cyberpunk">赛博朋克</option>
                </select>

                <label style="font-size:13px;font-weight:600;">自定义 CSS (高玩专属)</label>
                <textarea id="setting-custom-css" class="sm-custom-input" rows="2" placeholder="覆盖当前聊天室样式..."></textarea>
              </div>
              <div class="sm-modal-btns" style="margin-top:20px;">
                <button class="sm-modal-btn sm-btn-outline" id="btn-cancel-settings">取消</button>
                <button class="sm-modal-btn sm-btn-primary" id="btn-save-settings">保存</button>
              </div>
            </div>
          </div>

          <!-- 线下 RP 设置弹窗 -->
          <div class="sm-modal-overlay" id="modal-rp-settings">
            <div class="sm-modal" style="background:#222; color:#fff; border: 1px solid #444;">
              <h3 style="margin:0; color:#ff9a9e;">⚙️ 面基设定</h3>
              <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
                <label style="font-size:13px;font-weight:600;color:#aaa;">界面主题</label>
                <select id="rp-setting-theme" class="sm-custom-input" style="background:#111; color:#fff; border-color:#333;">
                  <option value="dark">黑客帝国 (默认)</option>
                  <option value="blue">浅蓝莫兰迪</option>
                  <option value="pink">浅粉ins风</option>
                  <option value="yellow">可爱嫩黄</option>
                  <option value="neon">霓虹夜店</option>
                </select>
                
                <label style="font-size:13px;font-weight:600;color:#aaa;">自定义文风要求 (如第一人称/强制色情描写/每次200字等)</label>
                <textarea id="rp-setting-prompt" class="sm-custom-input" style="background:#111; color:#fff; border-color:#333; height:100px;" placeholder="留空则使用默认引擎规则"></textarea>
              </div>
              <div class="sm-modal-btns" style="margin-top:20px;">
                <button class="sm-modal-btn" id="btn-cancel-rp-settings" style="background:#333; color:#ccc;">取消</button>
                <button class="sm-modal-btn" id="btn-save-rp-settings" style="background:#ff6b81; color:#fff;">应用并保存</button>
              </div>
            </div>
          </div>

          <!-- 转账动作弹窗 -->
          <div class="sm-modal-overlay" id="modal-transfer">
            <div class="sm-modal" style="background:#f0f8ff; border: 1px solid #c1ddf9; max-width: 260px;">
              <h3 style="color:#5c7ba3; text-align:center; font-size:16px; margin:0;">💸 给 Ta 一个惊喜</h3>
              <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
                <input type="number" id="transfer-amount" class="sm-custom-input" style="border-color:#c1ddf9;" placeholder="金额 (0.00)" min="0">
                <input type="text" id="transfer-note" class="sm-custom-input" style="border-color:#c1ddf9;" placeholder="备注留言..." maxlength="20">
              </div>
              <div class="sm-modal-btns" style="justify-content:space-between; margin-top:15px;">
                <button class="sm-modal-btn" id="btn-cancel-transfer" style="background:#d9e9fd; color:#5c7ba3; flex:1;">取消</button>
                <button class="sm-modal-btn" id="btn-confirm-transfer" style="background:#5c9de0; color:#fff; flex:1;">确认转账</button>
              </div>
            </div>
          </div>

          <!-- 面基邀请弹窗 -->
          <div class="sm-modal-overlay" id="modal-meet">
            <div class="sm-modal" style="background:#222; color:#fff; border: 1px solid #444; max-width: 280px;">
              <h3 style="color:#ff9a9e; text-align:center; font-size:18px; margin:0;">📍 线下邀请</h3>
              <p style="text-align:center; font-size:14px; margin-top:5px; color:#ddd;" id="meet-msg">对方想在【某处】和你见面，是否接受？</p>
              <div class="sm-modal-btns" style="justify-content:space-between; margin-top:15px;">
                <button class="sm-modal-btn" id="btn-reject-meet" style="background:#333; color:#ccc; flex:1;">残忍拒绝</button>
                <button class="sm-modal-btn" id="btn-accept-meet" style="background:#ff6b81; color:#fff; flex:1;">前往赴约</button>
              </div>
            </div>
          </div>

          <!-- 通用 Action Sheet -->
          <div class="sm-modal-overlay" id="modal-action-sheet" style="align-items: flex-end; padding:0;">
            <div class="sm-action-sheet" id="sheet-content"></div>
          </div>
        `;
        container.appendChild(appDOM);

        // ==========================================
        // 3. 全局状态、多世界书存储与底层 API 封装
        // ==========================================
        const state = {
          discoverMode: 'normal', 
          deckPool: [],     
          passedDeck: [],   
          currentCard: null,
          likedList: [],    
          chatHistories: {},
          chatSettings: {}, 
          rpHistories: {},  
          myPersona: "",
          fakePersona: "",   
          worldbooks: [],
          selectedWbIds: [], 
          localWorldbooks: [], 
          selectedLocalWbIds: [], 
          selectedPrefs: [], 
          squarePosts: [],  
          blacklist: [],     
          chatQuoteData: null,
          isAiTyping: false
        };

        const DEFAULT_PREFS = ["颜值控", "声控", "二次元", "幽默风趣", "温柔体贴", "高冷傲娇", "反差萌", "事业狂", "艺术家", "病娇", "直球克星", "爹系/妈系", "话痨", "纯爱战士", "海王/海后", "年下小狗", "成熟稳重"];

        // 核心：获取提示词（包含真假身份及本地世界书）
        async function getContextString() {
            let wbContext = "";
            if (state.selectedWbIds.length > 0) {
              for (const wid of state.selectedWbIds) {
                const entries = await roche.worldbook.getEntries({ categoryId: wid, scope: "global" });
                wbContext += entries.map(e => e.content).join("\n") + "\n";
              }
            }
            if (state.selectedLocalWbIds.length > 0) {
                state.selectedLocalWbIds.forEach(id => {
                    const lwb = state.localWorldbooks.find(w => w.id === id);
                    if(lwb) wbContext += `[专属设定：${lwb.name}] ${lwb.content}\n`;
                });
            }
            
            let personaStr = `【系统上帝视角/机密情报】：\n用户(我)的真实底色是：${state.myPersona}\n`;
            if (state.fakePersona) {
                personaStr += `但在当前交友软件上，用户展现的【伪装人设】是：${state.fakePersona}\n`;
                personaStr += `【核心互动法则】：你扮演的角色绝对不知道用户的真实底色！你必须完全被用户的伪装人设骗过，并且只针对伪装人设进行互动和反馈。\n`;
            } else {
                personaStr += `用户没有开启伪装，这就是他的社交表现。\n`;
            }

            return { personaStr, wbContext: wbContext.substring(0, 1500) };
        }

        async function loadStorage() {
          const liked = await roche.storage.get("soul_meet_liked"); if (liked) state.likedList = liked;
          const chats = await roche.storage.get("soul_meet_chats"); if (chats) state.chatHistories = chats;
          const chatSets = await roche.storage.get("soul_meet_chat_settings"); if (chatSets) state.chatSettings = chatSets;
          const rps = await roche.storage.get("soul_meet_rp_histories"); if (rps) state.rpHistories = rps;
          const posts = await roche.storage.get("soul_meet_square"); if (posts) state.squarePosts = posts;
          const bl = await roche.storage.get("soul_meet_blacklist"); if (bl) state.blacklist = bl;
          const localWbs = await roche.storage.get("soul_meet_local_wbs"); if (localWbs) state.localWorldbooks = localWbs;
          
          const settings = await roche.storage.get("soul_meet_settings");
          if (settings) {
            if (Array.isArray(settings.selectedWbIds)) state.selectedWbIds = settings.selectedWbIds;
            if (Array.isArray(settings.selectedLocalWbIds)) state.selectedLocalWbIds = settings.selectedLocalWbIds;
            if (Array.isArray(settings.selectedPrefs)) state.selectedPrefs = settings.selectedPrefs;
            if (typeof settings.fakePersona === 'string') state.fakePersona = settings.fakePersona;
          } else {
            state.selectedPrefs = [...DEFAULT_PREFS]; 
          }
        }
        
        async function saveStorage() {
          await roche.storage.set("soul_meet_liked", state.likedList);
          await roche.storage.set("soul_meet_chats", state.chatHistories);
          await roche.storage.set("soul_meet_chat_settings", state.chatSettings);
          await roche.storage.set("soul_meet_rp_histories", state.rpHistories);
          await roche.storage.set("soul_meet_square", state.squarePosts);
          await roche.storage.set("soul_meet_blacklist", state.blacklist);
          await roche.storage.set("soul_meet_local_wbs", state.localWorldbooks);
          await roche.storage.set("soul_meet_settings", { 
            selectedWbIds: state.selectedWbIds,
            selectedLocalWbIds: state.selectedLocalWbIds,
            selectedPrefs: state.selectedPrefs,
            fakePersona: state.fakePersona
          });
        }

        async function askAIToJson(systemPrompt, userPrompt) {
          const res = await roche.ai.chat({ messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], temperature: 0.9 });
          if (!res || !res.text) throw new Error("AI未返回内容");
          let str = res.text.trim();
          const match = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
          if (match) str = match[1].trim();
          const firstBrace = str.indexOf('{'); const lastBrace = str.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) str = str.slice(firstBrace, lastBrace + 1);
          return JSON.parse(str);
        }

        // ==========================================
        // 4. 加载上下文与生成卡片
        // ==========================================
        
        function renderPreferences() {
          const prefListEl = document.getElementById('sm-pref-list');
          prefListEl.innerHTML = '';
          const allTags = Array.from(new Set([...DEFAULT_PREFS, ...state.selectedPrefs]));
          allTags.forEach(tag => {
            const chip = document.createElement('div'); chip.className = 'sm-chip sm-pref-chip';
            if(state.selectedPrefs.includes(tag)) chip.classList.add('selected');
            chip.textContent = tag;
            chip.onclick = () => {
              if(state.selectedPrefs.includes(tag)) {
                state.selectedPrefs = state.selectedPrefs.filter(t => t !== tag); chip.classList.remove('selected');
              } else {
                state.selectedPrefs.push(tag); chip.classList.add('selected');
              }
              saveStorage();
            };
            prefListEl.appendChild(chip);
          });
        }
        
        function renderLocalWorldbooks() {
            const listEl = document.getElementById('sm-local-wb-list');
            listEl.innerHTML = '';
            if (state.localWorldbooks.length === 0) {
                listEl.innerHTML = '<span style="font-size:12px; color:#aaa;">暂无专属设定，请在下方添加</span>';
                return;
            }
            state.localWorldbooks.forEach(wb => {
                const chip = document.createElement('div'); chip.className = 'sm-chip';
                if(state.selectedLocalWbIds.includes(wb.id)) chip.classList.add('selected');
                chip.textContent = wb.name;
                chip.onclick = () => {
                    if(state.selectedLocalWbIds.includes(wb.id)) {
                        state.selectedLocalWbIds = state.selectedLocalWbIds.filter(id => id !== wb.id); chip.classList.remove('selected');
                    } else { state.selectedLocalWbIds.push(wb.id); chip.classList.add('selected'); }
                    saveStorage();
                };
                listEl.appendChild(chip);
            });
        }

        async function loadRocheContext() {
          try {
            const p = await roche.persona.getActiveUserPersona();
            state.myPersona = p || "一个期待在灵魂网络里遇见共鸣的人。";
            document.getElementById('sm-sys-persona').textContent = state.myPersona.substring(0, 40) + '...';
            document.getElementById('sm-fake-persona-input').value = state.fakePersona || '';

            renderPreferences();
            renderLocalWorldbooks();

            const wbs = await roche.worldbook.list();
            state.worldbooks = wbs || [];
            const wbListEl = document.getElementById('sm-wb-list'); wbListEl.innerHTML = '';
            
            if(state.worldbooks.length === 0) {
              wbListEl.innerHTML = '<span style="color:#aaa; font-size:13px;">暂无主系统世界书。</span>';
            } else {
              state.worldbooks.forEach(wb => {
                const chip = document.createElement('div'); chip.className = 'sm-chip';
                if(state.selectedWbIds.includes(wb.id)) chip.classList.add('selected');
                chip.textContent = wb.name;
                chip.onclick = () => {
                  if(state.selectedWbIds.includes(wb.id)) {
                    state.selectedWbIds = state.selectedWbIds.filter(id => id !== wb.id); chip.classList.remove('selected');
                  } else { state.selectedWbIds.push(wb.id); chip.classList.add('selected'); }
                  saveStorage();
                };
                wbListEl.appendChild(chip);
              });
            }
          } catch(e) {}
        }

        async function generateCards() {
          const container = document.getElementById('sm-deck-container');
          document.getElementById('sm-card-actions').style.display = 'none';
          container.innerHTML = `<div class="sm-empty-state"><div style="font-size:32px; margin-bottom:12px;">🔮</div><div style="color:#888; font-size:14px; margin-bottom: 20px;">跨维度信号连接中...</div></div>`;
          
          let newCards = []; state.passedDeck = []; 
          const { personaStr, wbContext } = await getContextString();

          try {
            const chars = await roche.character.list();
            const unlikedChars = chars.filter(c => !state.likedList.some(l => l.id === c.id));
            const pickedChars = unlikedChars.sort(() => 0.5 - Math.random()).slice(0, 1);
            for(const c of pickedChars) {
              const fullC = await roche.character.get(c.id);
              newCards.push({
                id: c.id, isChar: true, name: c.handle || c.name, avatar: c.avatar || '',
                bio: fullC.bio || fullC.persona || "（无简介）", tag: "原住民", persona: fullC.persona || "", match: Math.floor(Math.random() * 10) + 90
              });
            }
          } catch(e) {}

          try {
            const activePrefs = state.selectedPrefs.filter(p => !DEFAULT_PREFS.includes(p) || document.querySelector(`.sm-pref-chip.selected:contains('${p}')`));
            let prefContext = activePrefs.length > 0 ? `请优先生成带有这些特质的人类：【${activePrefs.join("、")}】。` : "生成随机多元化人类。";
            const modeInstruction = state.discoverMode === 'r18' 
                ? `这是午夜狂野模式，角色交友宣言必须极具张力、大胆、充满暗示。`
                : `生成有趣的人类，带点情绪或傲娇。`;

            const sysPrompt = `你是一个交友匹配系统。一次性生成6到8个极具活人感的交友卡片。
要求：
1. 身份多样：总裁、打工人、跨界人等。
2. 模式：${modeInstruction}
3. ${prefContext}
4. 严格输出JSON：{"cards":[{"id":"短id","name":"网名","bio":"宣言","tag":"四字特征","match":90,"persona":"设定"}]}`;
            
            const res = await roche.ai.chat({
              messages: [{ role: "system", content: sysPrompt }, { role: "user", content: `我的情况：\n${personaStr}\n世界法则：\n${wbContext}\n请生成卡片。` }],
              temperature: 0.95 
            });
            let str = res.text.trim();
            const match = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
            if (match) str = match[1].trim();
            const firstBrace = str.indexOf('{'); const lastBrace = str.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) str = str.slice(firstBrace, lastBrace + 1);
            
            const aiRes = JSON.parse(str);
            if (aiRes && Array.isArray(aiRes.cards)) {
              aiRes.cards.forEach(c => {
                newCards.push({ id: "stranger_" + c.id + "_" + Date.now(), isChar: false, name: c.name, avatar: "", bio: c.bio, tag: c.tag, persona: c.persona, match: c.match });
              });
            }
          } catch(e) { roche.ui.toast("信号波动，仅捕捉到极少缘分。"); }

          state.deckPool = newCards.sort(() => 0.5 - Math.random());
          renderNextCard();
        }

        function renderNextCard() {
          const container = document.getElementById('sm-deck-container');
          const actions = document.getElementById('sm-card-actions');
          if (state.deckPool.length === 0) {
            actions.style.display = 'none';
            let html = `<div class="sm-empty-state"><div style="font-size:32px; margin-bottom:12px;">🌟</div><div style="color:#888; font-size:14px; margin-bottom: 24px;">卡片看完了</div>`;
            if (state.passedDeck.length > 0) html += `<button class="sm-btn-outline" id="btn-rewind" style="margin-bottom:16px; width:100%;">🔙 重新查看错过的 Ta</button>`;
            html += `<button class="sm-btn-primary" id="btn-fetch-more" style="width:100%;">🚀 重新感应新批次</button></div>`;
            container.innerHTML = html;
            document.getElementById('btn-fetch-more')?.addEventListener('click', generateCards);
            document.getElementById('btn-rewind')?.addEventListener('click', () => { state.deckPool = [...state.passedDeck]; state.passedDeck = []; renderNextCard(); });
            state.currentCard = null; return;
          }
          actions.style.display = 'flex';
          const card = state.deckPool[0];
          state.currentCard = card;
          const typeBadge = card.isChar ? '<div class="sm-card-type" style="background: rgba(255,107,129,0.85);">原住民</div>' : '<div class="sm-card-type">新朋友</div>';
          container.innerHTML = `
            <div class="sm-card" id="sm-active-card">
              ${typeBadge}
              <div class="sm-card-img">${card.avatar ? `<img src="${card.avatar}" style="width:100%;height:100%;object-fit:cover;">` : card.name.substring(0,1)}</div>
              <div class="sm-card-info">
                <div class="sm-card-name">${card.name} <span class="sm-card-match">${card.match}% 契合</span></div>
                <div class="sm-card-tags"><span class="sm-card-tag"># ${card.tag}</span></div>
                <div class="sm-card-bio">${card.bio}</div>
              </div>
            </div>`;
          bindCardSwipe(document.getElementById('sm-active-card'));
        }

        // ==========================================
        // 5. 手势滑动核心逻辑
        // ==========================================
        function bindCardSwipe(el) {
          if (!el) return;
          let startX = 0, startY = 0, isDragging = false;
          const onMove = (e) => {
            if (!isDragging) return;
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);
            const deltaX = x - startX; const deltaY = y - startY; const rotate = deltaX * 0.05; 
            el.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
          };
          const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false; el.classList.remove('dragging');
            const x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || startX;
            const deltaX = x - startX; const threshold = window.innerWidth * 0.25;
            if (deltaX > threshold) handleSwipeAction(true);
            else if (deltaX < -threshold) handleSwipeAction(false); 
            else el.style.transform = `translate(0px, 0px) rotate(0deg)`;
            document.removeEventListener('mousemove', onMove); document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onEnd); document.removeEventListener('touchend', onEnd);
          };
          const onStart = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            startX = e.clientX || (e.touches && e.touches[0].clientX); startY = e.clientY || (e.touches && e.touches[0].clientY);
            isDragging = true; el.classList.add('dragging');
            document.addEventListener('mousemove', onMove); document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd); document.addEventListener('touchend', onEnd);
          };
          el.addEventListener('mousedown', onStart); el.addEventListener('touchstart', onStart, { passive: false });
        }

        function handleSwipeAction(isLike) {
          if (!state.currentCard) return;
          const card = state.deckPool.shift(); const cardEl = document.getElementById('sm-active-card');
          if (cardEl) {
            cardEl.style.transition = 'transform 0.3s ease-out, opacity 0.3s';
            cardEl.style.transform = isLike ? 'translate(150%, 20%) rotate(25deg)' : 'translate(-150%, 20%) rotate(-25deg)';
            cardEl.style.opacity = '0';
          }
          if (isLike) {
            if (!state.likedList.some(l => l.id === card.id)) {
              state.likedList.unshift(card); saveStorage(); renderInbox(); roche.ui.toast(`成功与 ${card.name} 建立羁绊！`);
            }
          } else { state.passedDeck.push(card); }
          setTimeout(() => { renderNextCard(); }, 300);
        }

        // ==========================================
        // 6. 工具函数
        // ==========================================
        function addLongPressListener(el, callback) {
          let timer = null; let isFired = false;
          const start = (e) => { isFired = false; timer = setTimeout(() => { isFired = true; callback(e); }, 500); };
          const cancel = () => { clearTimeout(timer); };
          el.addEventListener('mousedown', start); el.addEventListener('touchstart', start, { passive: true });
          el.addEventListener('mouseup', cancel); el.addEventListener('mouseleave', cancel);
          el.addEventListener('touchend', cancel); el.addEventListener('touchmove', cancel, { passive: true });
          el.addEventListener('click', (e) => { if(isFired) e.stopPropagation(); }, true);
        }

        function showActionSheet(items) {
          const sheet = document.getElementById('sheet-content'); const overlay = document.getElementById('modal-action-sheet');
          sheet.innerHTML = '';
          items.forEach(item => {
            const btn = document.createElement('div'); btn.className = 'sm-sheet-item' + (item.danger ? ' danger' : '');
            btn.textContent = item.label; btn.onclick = () => { overlay.classList.remove('open'); if (item.onClick) item.onClick(); };
            sheet.appendChild(btn);
          });
          const cancelBtn = document.createElement('div'); cancelBtn.className = 'sm-sheet-item sm-sheet-cancel'; cancelBtn.textContent = '取消';
          cancelBtn.onclick = () => overlay.classList.remove('open'); sheet.appendChild(cancelBtn);
          overlay.classList.add('open');
        }

        function showCustomPrompt(title, placeholder) {
          return new Promise(resolve => {
            const overlay = document.createElement('div'); overlay.className = 'sm-modal-overlay open';
            overlay.innerHTML = `<div class="sm-modal" style="width:280px; text-align:center;"><h3 style="margin-bottom:5px; font-size:16px;">${title}</h3><input type="text" id="prompt-input" class="sm-custom-input" placeholder="${placeholder}" style="margin-top:10px;"><div class="sm-modal-btns" style="justify-content:space-between; margin-top:20px;"><button id="prompt-cancel" class="sm-modal-btn" style="background:#eee; flex:1;">取消</button><button id="prompt-confirm" class="sm-modal-btn sm-btn-primary" style="flex:1;">确定</button></div></div>`;
            document.body.appendChild(overlay); const input = overlay.querySelector('#prompt-input');
            overlay.querySelector('#prompt-cancel').onclick = () => { overlay.remove(); resolve(null); };
            overlay.querySelector('#prompt-confirm').onclick = () => { overlay.remove(); resolve(input.value.trim()); };
            input.focus();
          });
        }
        document.getElementById('modal-action-sheet').addEventListener('click', (e) => { if (e.target.id === 'modal-action-sheet') e.target.classList.remove('open'); });

        // ==========================================
        // 7. 匿名广场核心引擎 (追加生成、评论、拉黑、单条互动刷新)
        // ==========================================
        async function generateSquarePosts(isAppend = false) {
            const feedEl = document.getElementById('sm-square-feed');
            
            if (!isAppend) {
                feedEl.innerHTML = `<div class="sm-empty-state" style="margin-top:50px;"><div style="font-size:32px; margin-bottom:12px;">🛸</div><div style="color:#888; font-size:14px;">正在搜寻附近的多维动态...</div></div>`;
            } else {
                const btn = document.getElementById('btn-load-more-sq');
                if(btn) { btn.textContent = "搜寻中..."; btn.style.opacity = "0.7"; btn.style.pointerEvents = "none"; }
            }
            
            try {
                const { personaStr, wbContext } = await getContextString();
                const modeInstruction = state.discoverMode === 'r18' 
                    ? `狂野模式：生成充满暗示、钓鱼、擦边的动态。`
                    : `正常模式：生成日常分享、网抑云、搞怪求助等。`;

                const sysPrompt = `你是一个交友软件广场生成器。生成 4 到 5 条广场动态。
要求：
1. ${modeInstruction}
2. "imageDesc" 如有配图则写描述(如"一张风景照")，没有则留空。
3. 为了真实感，每条必须预制 1 到 3 条路人NPC评论！
4. JSON格式：
{"posts": [{"id":"post_短id", "author": {"id":"stranger_id", "name":"网名", "persona":"隐藏设定", "avatar":""}, "content":"文案", "imageDesc":"图片描述或空", "likes":随机(50-500), "isLiked":false, "comments":[{"id":"c_短id", "author":"路人名字", "text":"评论", "isMe":false, "likes":随机(0-50), "isLiked":false}]}]}
只输出纯JSON。`;

                const res = await roche.ai.chat({
                  messages: [{ role: "system", content: sysPrompt }, { role: "user", content: `我的情况：\n${personaStr}\n世界规则：\n${wbContext}` }],
                  temperature: 0.95 
                });
                
                let str = res.text.trim();
                const match = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
                if (match) str = match[1].trim();
                const firstBrace = str.indexOf('{'); const lastBrace = str.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) str = str.slice(firstBrace, lastBrace + 1);
                
                const aiRes = JSON.parse(str);
                if (aiRes && Array.isArray(aiRes.posts)) {
                    if (isAppend) state.squarePosts.push(...aiRes.posts);
                    else state.squarePosts = aiRes.posts;
                    saveStorage();
                }
            } catch(e) { roche.ui.toast("刷新广场失败"); }
            renderSquare();
        }

        function renderSquare() {
            const feedEl = document.getElementById('sm-square-feed');
            feedEl.innerHTML = '';
            
            if(state.squarePosts.length === 0) {
               feedEl.innerHTML = `
                 <div class="sm-empty-state" style="margin-top:40px;">
                    <div style="font-size:40px; margin-bottom:10px;">🍃</div>
                    <div style="color:#aaa; font-size:14px; margin-bottom:20px;">广场空空如也</div>
                    <div class="sm-refresh-square" id="btn-init-sq">开启广场探索 🚀</div>
                 </div>`;
               document.getElementById('btn-init-sq').onclick = () => generateSquarePosts(false);
               return;
            }

            const visiblePosts = state.squarePosts.filter(p => !state.blacklist.includes(p.author.id));

            visiblePosts.forEach(post => {
                const postEl = document.createElement('div');
                postEl.className = 'sm-post';
                
                let imgHtml = '';
                if(post.imageDesc) {
                    imgHtml = `<div class="sm-post-img-wrap"><div class="sm-post-img-text">[照片: ${post.imageDesc}]</div></div>`;
                }

                let commentsHtml = '';
                if(post.comments && post.comments.length > 0) {
                    commentsHtml = `<div class="sm-comments">` + 
                        post.comments.map(c => `
                          <div class="sm-comment-item">
                            <div style="flex:1; word-wrap:break-word;">
                                <span class="sm-comment-name">${c.author}:</span><span class="sm-comment-text">${c.text}</span>
                            </div>
                            <div style="display:flex; gap:8px; flex-shrink:0; align-items:center;">
                                <span class="sm-comment-action btn-like-comment" data-cid="${c.id}">${c.isLiked?'❤️':'🤍'}${c.likes||''}</span>
                                ${!c.isMe ? `<span class="sm-comment-action btn-reply-comment" data-cid="${c.id}" data-author="${c.author}">回复</span>` : ''}
                                ${c.isMe ? `<span class="sm-comment-del" onclick="deleteComment('${post.id}', '${c.id}')">删除</span>` : ''}
                            </div>
                          </div>
                        `).join('') + `</div>`;
                }

                postEl.innerHTML = `
                  <div class="sm-post-header">
                    <div class="sm-post-av click-to-chat" title="私聊Ta">${post.author.name.substring(0,1)}</div>
                    <div class="sm-post-info">
                      <div class="sm-post-name">${post.author.name}</div>
                      <div class="sm-post-time">刚刚</div>
                    </div>
                    <div class="sm-post-more" title="更多">⋮</div>
                  </div>
                  <div class="sm-post-text">${post.content}</div>
                  ${imgHtml}
                  <div class="sm-post-actions">
                    <button class="sm-post-act-btn btn-like-post ${post.isLiked ? 'liked' : ''}">
                      ${post.isLiked ? '❤️' : '🤍'} <span>${post.likes + (post.isLiked?1:0)}</span>
                    </button>
                    <button class="sm-post-act-btn btn-comment-post">💬 评论动态</button>
                  </div>
                  ${commentsHtml}
                  ${post.comments?.length > 0 ? `<button class="sm-post-act-btn btn-refresh-comments" style="justify-content:center; width:100%; border:1px dashed #ddd; border-radius:12px; padding:6px; margin-top:8px;">🔄 刷新互动</button>` : ''}
                `;

                postEl.querySelector('.click-to-chat').onclick = () => initiateChatFromSquare(post.author);
                
                postEl.querySelector('.sm-post-more').onclick = () => {
                   showActionSheet([
                       { label: '删除该动态', onClick: () => { state.squarePosts = state.squarePosts.filter(p => p.id !== post.id); saveStorage(); renderSquare(); }},
                       { label: '屏蔽此人', danger: true, onClick: () => { state.blacklist.push(post.author.id); saveStorage(); renderSquare(); roche.ui.toast("已屏蔽该用户。"); }}
                   ]);
                };

                postEl.querySelector('.btn-like-post').onclick = () => { post.isLiked = !post.isLiked; saveStorage(); renderSquare(); };

                postEl.querySelector('.btn-comment-post').onclick = async () => {
                    const text = await showCustomPrompt(`评论 ${post.author.name} 的动态`, "想说点什么？");
                    if(text) {
                        if(!post.comments) post.comments = [];
                        post.comments.push({ id: Date.now().toString(), author: '我', text: text, isMe: true, likes:0, isLiked:false });
                        saveStorage(); renderSquare(); triggerPostReply(post, text, post.author.name); 
                    }
                };
                
                postEl.querySelectorAll('.btn-like-comment').forEach(btn => {
                    btn.onclick = () => {
                        const c = post.comments.find(x => x.id === btn.dataset.cid);
                        if(c) { c.isLiked = !c.isLiked; c.likes = (c.likes || 0) + (c.isLiked ? 1 : -1); if(c.likes<0) c.likes=0; saveStorage(); renderSquare(); }
                    }
                });
                postEl.querySelectorAll('.btn-reply-comment').forEach(btn => {
                    btn.onclick = async () => {
                        const targetAuthor = btn.dataset.author;
                        const text = await showCustomPrompt(`回复 ${targetAuthor}`, "想说点什么？");
                        if(text) {
                            post.comments.push({ id: Date.now().toString(), author: '我', text: `回复 @${targetAuthor}: ${text}`, isMe: true, likes:0, isLiked:false });
                            saveStorage(); renderSquare(); triggerPostReply(post, text, targetAuthor); 
                        }
                    }
                });
                
                const rBtn = postEl.querySelector('.btn-refresh-comments');
                if(rBtn) rBtn.onclick = () => refreshPostComments(post.id);

                feedEl.appendChild(postEl);
            });

            const refreshBtn = document.createElement('div');
            refreshBtn.className = 'sm-refresh-square'; refreshBtn.id = 'btn-load-more-sq';
            refreshBtn.textContent = '发现更多动态 🚀';
            refreshBtn.onclick = () => generateSquarePosts(true); 
            feedEl.appendChild(refreshBtn);
        }

        window.deleteComment = function(postId, commentId) {
            const post = state.squarePosts.find(p => p.id === postId);
            if(post) { post.comments = post.comments.filter(c => c.id !== commentId); saveStorage(); renderSquare(); }
        };

        function initiateChatFromSquare(authorInfo) {
            let existingPeer = state.likedList.find(u => u.id === authorInfo.id);
            if(!existingPeer) {
                existingPeer = { id: authorInfo.id, isChar: authorInfo.isChar, name: authorInfo.name, avatar: authorInfo.avatar, persona: authorInfo.persona, tag: "广场偶遇" };
                state.likedList.unshift(existingPeer); saveStorage();
            }
            document.querySelectorAll('.sm-nav-btn').forEach(b => b.classList.remove('active')); 
            document.querySelector('[data-target="view-inbox"]').classList.add('active');
            document.querySelectorAll('.sm-view').forEach(v => v.classList.remove('active'));
            document.getElementById('view-inbox').classList.add('active');
            renderInbox(); openChat(existingPeer);
        }

        async function triggerPostReply(post, myText, targetAuthor) {
            try {
                const { personaStr, wbContext } = await getContextString();
                let sysPrompt = '';
                if(targetAuthor === post.author.name) {
                     sysPrompt = `你现在是交友软件上的用户「${post.author.name}」。你的设定：${post.author.persona}。
你在广场发了动态：“${post.content}”。我的设定是：${personaStr}
有人评论了你：“${myText}”。请根据性格设定，简短回复。如果被撩可顺水推舟。只输出纯文本。`;
                } else {
                     sysPrompt = `你现在是交友软件上的路人「${targetAuthor}」。我的设定是：${personaStr}
你在动态“${post.content}”下参与了互动。有人回复了你：“${myText}”。
请根据一个路人网友的身份，简短幽默地回复。只输出纯文本。`;
                }
                const res = await roche.ai.chat({ messages: [{ role: "system", content: sysPrompt }], temperature: 0.8 });
                post.comments.push({ id: Date.now().toString(), author: targetAuthor, text: `回复 @我: ${res.text.trim()}`, isMe: false, likes:0, isLiked:false });
                saveStorage(); renderSquare();
            } catch(e) { console.log("AI回复失败"); }
        }

        async function refreshPostComments(postId) {
            const post = state.squarePosts.find(p => p.id === postId); if(!post) return;
            roche.ui.toast("正在等待网友互动...");
            try {
                const existingComments = post.comments ? post.comments.map(c => `[${c.author}]: ${c.text}`).join('\n') : "无";
                const sysPrompt = `你是一个交友软件的NPC引擎。
当前帖子作者：${post.author.name}
帖子内容：${post.content} ${post.imageDesc ? '(附图:'+post.imageDesc+')' : ''}
已有评论：
${existingComments}

请根据当前情况，模拟1到2个网友(或作者本人)的后续评论。如果有'我'(即用户)的评论，请务必让NPC或作者回复他/她。
严格输出JSON格式：
{"new_comments":[{"id":"c_新id", "author":"路人名字或作者", "text":"评论内容(如果是回复用户请写'回复 @我: xxx')", "isMe":false, "likes":随机(0-50), "isLiked":false}]}
只输出纯JSON。`;
                const res = await roche.ai.chat({ messages: [{ role: "system", content: sysPrompt }], temperature: 0.9 });
                let str = res.text.trim();
                const match = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
                if (match) str = match[1].trim();
                const firstBrace = str.indexOf('{'); const lastBrace = str.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) str = str.slice(firstBrace, lastBrace + 1);
                
                const aiRes = JSON.parse(str);
                if(aiRes && Array.isArray(aiRes.new_comments)) {
                    if(!post.comments) post.comments = [];
                    post.comments.push(...aiRes.new_comments);
                    saveStorage(); renderSquare(); roche.ui.toast("新互动已到达");
                }
            } catch(e) { roche.ui.toast("刷新评论失败"); }
        }

        // ==========================================
        // 8. 消息列表与核心线上聊天互动
        // ==========================================
        function renderInbox() {
          const list = document.getElementById('sm-inbox-list'); list.innerHTML = "";
          if (state.likedList.length === 0) {
            list.innerHTML = '<div style="padding:60px 20px; text-align:center; color:#a0a0a0; font-size:14px; display:flex; flex-direction:column; align-items:center;"><div style="font-size:40px; margin-bottom:10px;">📮</div>这里还空空如也<br>快去匹配寻找缘分吧</div>'; return;
          }
          state.likedList.forEach(u => {
            const item = document.createElement('div'); item.className = 'sm-list-item';
            const hist = state.chatHistories[u.id] || [];
            
            let lastMsgDisp = "刚刚建立了联系，发个消息吧~";
            if (hist.length > 0) {
               const last = hist[hist.length - 1];
               if (last.isTyping) lastMsgDisp = "[正在输入...]";
               else if (last.type === 'transfer') lastMsgDisp = '[转账]';
               else if (last.type === 'voice_message') lastMsgDisp = '[语音]';
               else if (last.type === 'user_photo' || last.type === 'ai_image') lastMsgDisp = '[照片]';
               else if (last.type === 'system_rp_memory') lastMsgDisp = '[面基记忆更新]';
               else lastMsgDisp = last.content;
            }
            const cSet = state.chatSettings[u.id] || {}; const dispName = cSet.alias || u.name;
            item.innerHTML = `<div class="sm-list-av">${u.avatar ? `<img src="${u.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : u.name.substring(0,1)}</div>
              <div class="sm-list-mid"><div class="sm-list-name">${dispName} <span class="sm-list-tag">${u.isChar ? '原住民' : '新朋友'}</span></div><div class="sm-list-sub">${lastMsgDisp}</div></div>`;
            
            item.onclick = () => openChat(u);
            addLongPressListener(item, () => {
              showActionSheet([
                { label: '清空聊天记录', onClick: () => { state.chatHistories[u.id] = []; saveStorage(); renderInbox(); roche.ui.toast("已清空"); }},
                { label: '删除该好友', danger: true, onClick: () => { state.likedList = state.likedList.filter(l => l.id !== u.id); delete state.chatHistories[u.id]; delete state.chatSettings[u.id]; saveStorage(); renderInbox(); roche.ui.toast("已解除羁绊"); }}
              ]);
            });
            list.appendChild(item);
          });
        }
        
        let currentPeer = null;

        function openChat(peer) {
          currentPeer = peer;
          const cSet = state.chatSettings[peer.id] || { theme: 'default', bg: '', alias: '', customCss: '' };
          document.getElementById('chat-peer-name').textContent = cSet.alias || peer.name;
          document.getElementById('btn-chat-persona').style.display = peer.isChar ? "none" : "block";
          document.getElementById('sm-dynamic-custom-css').textContent = cSet.customCss || '';
          
          state.chatQuoteData = null; updateQuotePreviewUI();
          renderChatHistory();
          document.getElementById('sm-chat-room').classList.add('open');
        }

        function closeChat() { 
          currentPeer = null; 
          document.getElementById('sm-dynamic-custom-css').textContent = ''; 
          document.getElementById('sm-chat-room').classList.remove('open'); 
        }

        function updateQuotePreviewUI() {
          const previewEl = document.getElementById('chat-quote-preview'); const textEl = document.getElementById('chat-quote-text');
          if (state.chatQuoteData) { textEl.textContent = `引用: ${state.chatQuoteData}`; previewEl.style.display = 'flex'; } 
          else { previewEl.style.display = 'none'; }
        }
        document.getElementById('btn-cancel-quote').onclick = () => { state.chatQuoteData = null; updateQuotePreviewUI(); };

        function renderChatHistory() {
          const container = document.getElementById('chat-history'); container.innerHTML = "";
          const cSet = state.chatSettings[currentPeer.id] || { theme: 'default', bg: '' };
          container.dataset.theme = cSet.theme;
          const roomEl = document.getElementById('sm-chat-room');
          roomEl.style.backgroundImage = cSet.bg ? `url(${cSet.bg})` : 'none';
          roomEl.style.backgroundSize = 'cover'; roomEl.style.backgroundPosition = 'center'; roomEl.style.backgroundColor = cSet.bg ? 'transparent' : '#fbfbfd';

          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length === 0) container.innerHTML = `<div style="text-align:center; color:#ccc; font-size:12px; margin-top:20px;">—— 你们在 Soul Meet 的初次对话 ——</div>`;

          hist.forEach((msg, idx) => {
            const wrapper = document.createElement('div'); wrapper.className = `sm-msg-wrapper ${msg.role === 'user' ? 'me' : 'peer'}`;
            const el = document.createElement('div'); el.className = `sm-msg ${msg.role === 'user' ? 'me' : 'peer'}`;
            
            // 系统回忆框
            if (msg.type === 'system_rp_memory') {
               wrapper.className = 'sm-msg-wrapper'; wrapper.style.alignSelf = 'center'; wrapper.style.maxWidth = '90%';
               el.className = 'sm-msg';
               el.style.background = 'rgba(0,0,0,0.05)'; el.style.color = '#666'; el.style.fontSize = '12px'; el.style.textAlign = 'center'; el.style.boxShadow = 'none';
               el.innerHTML = `🌟 <b>线下记忆碎片</b><br>${msg.content}`;
               wrapper.appendChild(el); container.appendChild(wrapper); return;
            }

            // 动画渲染
            if (msg.isTyping) {
                el.classList.add('is-transparent');
                el.innerHTML = `<div class="sm-typing-bubble"><span class="sm-typing-dot"></span><span class="sm-typing-dot"></span><span class="sm-typing-dot"></span></div>`;
                wrapper.appendChild(el); container.appendChild(wrapper); return;
            }

            let contentHtml = msg.content; let isTransparent = false;
            if (msg.type === 'transfer') {
                isTransparent = true; contentHtml = `<div class="sm-transfer-card"><div class="sm-transfer-title">💸 ${msg.role === 'user' ? '转账给Ta' : '收到一笔转账'}</div><div class="sm-transfer-amount">¥ ${Number(msg.amount).toFixed(2)}</div><div class="sm-transfer-note">${msg.note || '对方没有留下备注哦~'}</div></div>`;
            } else if (msg.type === 'voice_message') {
                isTransparent = true; contentHtml = `<div class="sm-voice-message">🎤 <span>语音: ${msg.content}</span></div>`;
            } else if (msg.type === 'user_photo' || msg.type === 'ai_image') {
                isTransparent = true; contentHtml = `<div class="sm-ai-image-wrap"><div class="sm-ai-image-desc">[照片：${msg.content}]</div></div>`;
            }

            if (isTransparent) el.classList.add('is-transparent');
            let quoteHtml = ''; if (msg.quote) quoteHtml = `<div class="sm-quote-box">${msg.quote}</div>`;
            el.innerHTML = quoteHtml + (contentHtml || '');
            
            addLongPressListener(el, () => {
              showActionSheet([
                { label: '引用', onClick: () => { state.chatQuoteData = (msg.type ? `[${msg.type==='transfer'?'转账':msg.type==='voice_message'?'语音':'图片'}]` : msg.content); updateQuotePreviewUI(); }},
                { label: '撤回/删除', danger: true, onClick: () => { state.chatHistories[currentPeer.id].splice(idx, 1); saveStorage(); renderChatHistory(); renderInbox(); }}
              ]);
            });
            wrapper.appendChild(el); container.appendChild(wrapper);
          });
          container.scrollTop = container.scrollHeight;
        }

        // === 修改1：修复回车发送逻辑 ===
        function sendUserMessage(triggerAi = true) {
          if (!currentPeer || state.isAiTyping) return;
          const input = document.getElementById('chat-input');
          const text = input.value.trim();
          
          if (text) {
              if (!state.chatHistories[currentPeer.id]) state.chatHistories[currentPeer.id] = [];
              const newMsg = { role: 'user', content: text };
              if (state.chatQuoteData) { newMsg.quote = state.chatQuoteData; state.chatQuoteData = null; updateQuotePreviewUI(); }
              state.chatHistories[currentPeer.id].push(newMsg);
              saveStorage(); input.value = ""; renderChatHistory(); renderInbox();
          }

          if (triggerAi) triggerAiReply(); 
        }

        function sendSpecialMsg(type, contentObj) {
            if (!currentPeer || state.isAiTyping) return;
            if (!state.chatHistories[currentPeer.id]) state.chatHistories[currentPeer.id] = [];
            state.chatHistories[currentPeer.id].push({ role: 'user', type: type, ...contentObj });
            saveStorage(); renderChatHistory(); renderInbox();
            triggerAiReply();
        }

        async function triggerAiReply() {
          if (!currentPeer || state.isAiTyping) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length === 0 || hist[hist.length-1].role === 'assistant') return;

          state.isAiTyping = true;
          state.chatHistories[currentPeer.id].push({ role: 'assistant', isTyping: true, id: 'temp_typing' });
          renderChatHistory(); renderInbox();

          try {
            const { personaStr, wbContext } = await getContextString();
            let sysPrompt = `你正在交友软件 "Soul Meet" 上以文字私信的方式与我聊天。
你的身份是：「${currentPeer.name}」。你的设定：${currentPeer.persona}
${personaStr}
【最高规则：活人感多气泡输出】
1. 你是一个有情绪的真实人类，不是客服。不要讲大道理。
2. 你习惯把长句子拆成多个短句发送，像微信聊天一样连发几条消息，每句话作为一个独立的元素。
3. 如果情绪激动，你可以主动转账、发照片或语音，只需在你想要的位置插入独立的特殊字符串：
   - 想转账则作为一条独立消息：【动作：转账，金额：数字，备注：文字】
   - 想发照片则作为一条独立消息：【动作：照片，描述：文字】
   - 想发语音则作为一条独立消息：【动作：语音，内容：文字】
   - 想邀请线下约会（面基）：【动作：面基，地点：你想去的地点】
4. **你所有的回复必须严格封装在一个合法的 JSON 数组中**，数组的每一项代表你要发送的一个气泡！
示例：["在吗？", "刚才去吃饭了", "【动作：照片，描述：我的晚餐】", "你吃了没？", "【动作：面基，地点：市中心酒吧】"]
绝对不要输出除了JSON数组以外的任何前言后语。`;

            const apiMsgs = [{ role: 'system', content: sysPrompt }];
            hist.slice(-15).forEach(m => {
              if(m.isTyping) return;
              let content = m.content || ""; const prefix = m.role === 'user' ? '我' : '你';
              if (m.type === 'transfer') content = `[${prefix} 发起转账: ${m.amount}元, 备注: ${m.note}]`;
              else if (m.type === 'voice_message') content = `[${prefix} 语音: "${m.content}"]`;
              else if (m.type === 'user_photo' || m.type === 'ai_image') content = `[${prefix} 发送了一张照片, 描述: "${m.content}"]`;
              else if (m.type === 'system_rp_memory') content = `[我们之间的线下记忆更新了: "${m.content}"]`;
              
              if (m.quote) content = `(引用了刚才的话：${m.quote})\n${content}`;
              apiMsgs.push({ role: m.role, content: content });
            });

            const res = await roche.ai.chat({ messages: apiMsgs, temperature: 0.95 });
            
            let replyArray = [];
            try {
                let str = res.text.trim();
                const start = str.indexOf('['); const end = str.lastIndexOf(']');
                if(start !== -1 && end !== -1) replyArray = JSON.parse(str.substring(start, end + 1));
                else replyArray = [str];
            } catch(e) { replyArray = [res.text]; }

            state.chatHistories[currentPeer.id] = state.chatHistories[currentPeer.id].filter(m => m.id !== 'temp_typing');

            for(let text of replyArray) {
                if(typeof text !== 'string') text = JSON.stringify(text);
                let aiType = null, aiAmount = null, aiNote = null, aiDesc = null, meetLoc = null;
                
                const actionMatch = text.match(/【动作：(.*?)】/);
                if (actionMatch) {
                    const actionStr = actionMatch[1];
                    if (actionStr.includes('转账')) {
                        aiType = 'transfer';
                        const amtMatch = actionStr.match(/金额：(\d+)/); const noteMatch = actionStr.match(/备注：(.*?)$/);
                        aiAmount = amtMatch ? parseFloat(amtMatch[1]) : 520; aiNote = noteMatch ? noteMatch[1] : '给你';
                    } else if (actionStr.includes('照片')) {
                        aiType = 'ai_image';
                        const descMatch = actionStr.match(/描述：(.*?)$/); aiDesc = descMatch ? descMatch[1] : '一张绝美的照片';
                    } else if (actionStr.includes('语音')) {
                        aiType = 'voice_message';
                        const contentMatch = actionStr.match(/内容：(.*?)$/); aiDesc = contentMatch ? contentMatch[1] : '...';
                    } else if (actionStr.includes('面基')) {
                        aiType = 'meet';
                        const locMatch = actionStr.match(/地点：(.*?)$/); meetLoc = locMatch ? locMatch[1] : '某个隐秘的地方';
                    }
                    text = text.replace(actionMatch[0], '').trim();
                }

                if (aiType === 'meet') {
                    handleMeetInvitation(meetLoc);
                } else {
                    if (text) state.chatHistories[currentPeer.id].push({ role: 'assistant', content: text });
                    if (aiType === 'transfer') state.chatHistories[currentPeer.id].push({ role: 'assistant', type: 'transfer', amount: aiAmount, note: aiNote });
                    else if (aiType === 'ai_image') state.chatHistories[currentPeer.id].push({ role: 'assistant', type: 'ai_image', content: aiDesc });
                    else if (aiType === 'voice_message') state.chatHistories[currentPeer.id].push({ role: 'assistant', type: 'voice_message', content: aiDesc });
                    
                    saveStorage(); renderChatHistory(); renderInbox();
                    await new Promise(r => setTimeout(r, 800 + Math.random()*600));
                }
            }
          } catch(e) {
            state.chatHistories[currentPeer.id] = state.chatHistories[currentPeer.id].filter(m => m.id !== 'temp_typing');
            roche.ui.toast("网络波动，消息未到达。"); renderChatHistory();
          } finally {
            state.isAiTyping = false;
          }
        }

        // ==========================================
        // 9. 线下约会 RP 模式引擎
        // ==========================================
        let rpPeer = null;
        let isRpTyping = false;

        function handleMeetInvitation(loc = "附近") {
            document.getElementById('meet-msg').textContent = `对方想在【${loc}】和你见面，是否接受？`;
            document.getElementById('modal-meet').classList.add('open');
            rpPeer = currentPeer;
        }

        document.getElementById('btn-reject-meet').onclick = () => document.getElementById('modal-meet').classList.remove('open');
        document.getElementById('btn-accept-meet').onclick = () => {
            document.getElementById('modal-meet').classList.remove('open');
            document.getElementById('sm-chat-room').classList.remove('open');
            enterOfflineRP();
        };
        document.getElementById('btn-send-meet').onclick = () => {
            if(!currentPeer) return;
            handleMeetInvitation("你决定去的地方");
        };

        function enterOfflineRP() {
            if(!rpPeer) return;
            const cSet = state.chatSettings[rpPeer.id] || { rpTheme: 'dark', rpPrompt: '' };
            document.getElementById('sm-rp-room').dataset.theme = cSet.rpTheme || 'dark';
            document.getElementById('sm-rp-room').classList.add('open');
            
            if(!state.rpHistories[rpPeer.id] || state.rpHistories[rpPeer.id].length === 0) {
               state.rpHistories[rpPeer.id] = [{ role: 'system', content: `【系统接入】你与 ${rpPeer.name} 奔现了...` }];
               triggerRPAi(); 
            } else {
               renderRPHistory();
            }
        }

        document.getElementById('btn-rp-exit').onclick = () => {
            document.getElementById('sm-rp-room').classList.remove('open');
            document.getElementById('sm-chat-room').classList.add('open');
        };

        function renderRPHistory() {
            const container = document.getElementById('rp-history'); container.innerHTML = "";
            const hist = state.rpHistories[rpPeer.id] || [];
            
            hist.forEach(m => {
                const el = document.createElement('div'); el.className = `sm-rp-block ${m.role}`;
                let text = m.content.replace(/(“.*?”)/g, '<span class="sm-rp-dialogue">$1</span>');
                el.innerHTML = text;
                container.appendChild(el);
            });
            container.scrollTop = container.scrollHeight;
        }

        function updateRPStatusAndActions(loc, mood, desire, actArr) {
            if(loc) document.getElementById('rp-stat-loc').textContent = loc;
            if(mood) document.getElementById('rp-stat-mood').textContent = mood;
            if(desire) document.getElementById('rp-stat-desire').textContent = desire;
            
            if(actArr && actArr.length > 0) {
                const actContainer = document.getElementById('rp-dynamic-actions');
                actContainer.innerHTML = '';
                actArr.forEach(act => {
                    const btn = document.createElement('button'); btn.className = 'sm-rp-act-btn rp-act-quick';
                    btn.textContent = act;
                    btn.onclick = () => sendRPAction(act);
                    actContainer.appendChild(btn);
                });
            }
        }

        function sendRPAction(text) {
            if(!text || isRpTyping) return;
            state.rpHistories[rpPeer.id].push({ role: 'user', content: text });
            document.getElementById('rp-input').value = "";
            renderRPHistory();
            triggerRPAi();
        }

        document.getElementById('rp-send').onclick = () => sendRPAction(document.getElementById('rp-input').value.trim());
        document.getElementById('rp-input').onkeydown = (e) => { if(e.key === 'Enter') sendRPAction(e.target.value.trim()); };

        async function triggerRPAi() {
            if (isRpTyping) return;
            isRpTyping = true;
            const container = document.getElementById('rp-history');
            const typingEl = document.createElement('div'); typingEl.className = 'sm-rp-block ai';
            typingEl.innerHTML = `<span style="opacity:0.5;">命运编织中...</span>`;
            container.appendChild(typingEl); container.scrollTop = container.scrollHeight;

            try {
                const { personaStr, wbContext } = await getContextString();
                const cSet = state.chatSettings[rpPeer.id] || {};
                const rpCustom = cSet.rpPrompt ? `\n【用户定制要求】：${cSet.rpPrompt}` : '';
                
                const sysPrompt = `你现在是一个无限制的沉浸式文字冒险小说引擎。
背景：我与角色「${rpPeer.name}」正式线下见面。
角色设定：${rpPeer.persona}
${personaStr}${rpCustom}
【游戏法则】
1. 去除一切AI感词汇。这就是现实生活中的交往。根据剧情自然发展。
2. 允许成人内容(R18)、深层情感与肢体描写，请根据剧情需要放开尺度。
3. 每次回复用【小说叙事体】，细腻混合动作神态描写，对话使用中文字符双引号（“”）。
4. **关键指令**：每次你回复的最后，必须新起行，输出当前状态和3个推荐给用户的行动选项。严格格式：
【状态：当前地点|当前心情|对方欲望值(如80%)】
【选项：动作1|动作2|动作3】`;

                const msgs = [{ role: 'system', content: sysPrompt }];
                const hist = state.rpHistories[rpPeer.id] || [];
                hist.slice(-20).forEach(m => { msgs.push({ role: m.role==='system'?'system':(m.role==='user'?'user':'assistant'), content: m.content }); });

                const res = await roche.ai.chat({ messages: msgs, temperature: 0.95 });
                let text = res.text.trim();
                
                let loc='', mood='', desire='', acts=[];
                const statMatch = text.match(/【状态：(.*?)\|(.*?)\|(.*?)】/);
                if (statMatch) { loc=statMatch[1]; mood=statMatch[2]; desire=statMatch[3]; text = text.replace(statMatch[0], '').trim(); }
                const optMatch = text.match(/【选项：(.*?)\|(.*?)\|(.*?)】/);
                if (optMatch) { acts=[optMatch[1].trim(), optMatch[2].trim(), optMatch[3].trim()]; text = text.replace(optMatch[0], '').trim(); }
                
                updateRPStatusAndActions(loc, mood, desire, acts);
                state.rpHistories[rpPeer.id].push({ role: 'ai', content: text }); saveStorage();
            } catch(e) { roche.ui.toast("现实扭曲，请重试。"); } 
            finally { isRpTyping = false; renderRPHistory(); }
        }

        document.getElementById('btn-rp-undo').onclick = () => {
            if(isRpTyping || state.rpHistories[rpPeer.id].length <= 1) return;
            state.rpHistories[rpPeer.id].pop(); 
            if(state.rpHistories[rpPeer.id][state.rpHistories[rpPeer.id].length-1].role === 'user') state.rpHistories[rpPeer.id].pop(); 
            saveStorage(); renderRPHistory();
        };
        document.getElementById('btn-rp-reroll').onclick = () => {
            if(isRpTyping || state.rpHistories[rpPeer.id].length <= 1) return;
            if(state.rpHistories[rpPeer.id][state.rpHistories[rpPeer.id].length-1].role === 'ai') {
                state.rpHistories[rpPeer.id].pop(); saveStorage(); renderRPHistory(); triggerRPAi();
            }
        };
        document.getElementById('btn-rp-reset').onclick = async () => {
            const ok = await roche.ui.confirm({ title: "新生", message: "将彻底抹除这段线下记忆，是否确认？" });
            if (ok) { state.rpHistories[rpPeer.id] = []; saveStorage(); document.getElementById('btn-rp-exit').click(); }
        };
        document.getElementById('btn-rp-summarize').onclick = async () => {
            if(isRpTyping) return;
            const hist = state.rpHistories[rpPeer.id] || [];
            if(hist.length < 3) return roche.ui.toast("回忆太少，还不足以铭刻...");
            roche.ui.toast("正在提炼回忆...");
            const log = hist.map(m => m.role + ': ' + m.content).join('\n');
            try {
                const res = await roche.ai.chat({ messages: [{ role: "system", content: "请总结这段线下约会的核心事件。字数限制50字内，用简短第三人称陈述。" }, { role: "user", content: log }], temperature: 0.3 });
                const fact = res.text.trim();
                if (!state.chatHistories[rpPeer.id]) state.chatHistories[rpPeer.id] = [];
                state.chatHistories[rpPeer.id].push({ role: "system", type: "system_rp_memory", content: fact });
                saveStorage(); roche.ui.toast("✅ 回忆已打包并发送至聊天窗！");
            } catch(e) { roche.ui.toast("记忆提取失败"); }
        };

        // RP 设置弹窗
        document.getElementById('btn-rp-settings').onclick = () => {
            if(!rpPeer) return;
            const cSet = state.chatSettings[rpPeer.id] || {};
            document.getElementById('rp-setting-theme').value = cSet.rpTheme || 'dark';
            document.getElementById('rp-setting-prompt').value = cSet.rpPrompt || '';
            document.getElementById('modal-rp-settings').classList.add('open');
        };
        document.getElementById('btn-cancel-rp-settings').onclick = () => document.getElementById('modal-rp-settings').classList.remove('open');
        document.getElementById('btn-save-rp-settings').onclick = () => {
            if(!rpPeer) return;
            if(!state.chatSettings[rpPeer.id]) state.chatSettings[rpPeer.id] = {};
            const th = document.getElementById('rp-setting-theme').value;
            state.chatSettings[rpPeer.id].rpTheme = th;
            state.chatSettings[rpPeer.id].rpPrompt = document.getElementById('rp-setting-prompt').value.trim();
            saveStorage();
            document.getElementById('sm-rp-room').dataset.theme = th;
            document.getElementById('modal-rp-settings').classList.remove('open');
        };

        // ==========================================
        // 10. 提取人设与主记忆沉淀
        // ==========================================
        async function extractPersona() {
          if (!currentPeer || currentPeer.isChar) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length < 3) return roche.ui.toast("聊得太少了，多聊几句吧！");
          roche.ui.toast("AI 正在撰写灵魂档案...");
          const textLog = hist.map(m => (m.role==='user'?'我':'Ta') + ': ' + (m.content||m.type)).join('\n');
          const sys = `你是一位顶级的小说角色设定师。请结合该角色的基础设定和下方的聊天记录，撰写一份详尽的、适合直接复制给大模型当人设 prompt 的档案。包括：姓名、外貌气质、性格剖析、核心说话口癖、神秘过往、以及对"我"的特殊态度。
【严重警告】：请直接输出格式化的人设档案纯文本！绝对不要说“好的”、“这是为您生成的档案”等任何前言后语和客套话！`;
          let usr = `【基础设定】\n${currentPeer.persona}\n\n【实际表现】\n${textLog}`;
          try {
            const res = await roche.ai.chat({ messages: [{ role: "system", content: sys }, { role: "user", content: usr }], temperature: 0.7 });
            document.getElementById('modal-persona-text').value = res.text.trim(); document.getElementById('modal-persona').classList.add('open');
          } catch(e) { roche.ui.toast("提取灵魂档案失败"); }
        }

        const closePersonaModal = () => document.getElementById('modal-persona').classList.remove('open');
        document.getElementById('btn-close-modal').addEventListener('click', closePersonaModal);
        document.getElementById('modal-persona').addEventListener('click', (e) => { if (e.target.id === 'modal-persona') closePersonaModal(); });

        // ==========================================
        // 11. 初始化绑定
        // ==========================================
        function bindEvents() {
          document.getElementById('sm-close-plugin').addEventListener('click', () => roche.ui.closeApp());
          
          document.querySelectorAll('.sm-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              document.querySelectorAll('.sm-nav-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
              const targetId = btn.getAttribute('data-target');
              document.querySelectorAll('.sm-view').forEach(v => v.classList.remove('active')); document.getElementById(targetId).classList.add('active');
              if (targetId === 'view-inbox') renderInbox(); 
              if (targetId === 'view-square') {
                  if (state.squarePosts.length === 0) renderSquare(); else renderSquare();
              }
            });
          });
          
          document.querySelectorAll('.sm-mode-btn').forEach(btn => {
              btn.addEventListener('click', () => {
                  if (state.discoverMode === btn.dataset.mode) return; 
                  document.querySelectorAll('.sm-mode-btn').forEach(b => b.classList.remove('active'));
                  btn.classList.add('active');
                  state.discoverMode = btn.dataset.mode;
                  roche.ui.toast(state.discoverMode === 'r18' ? "已开启狂野模式 😈 (请重新感应)" : "已切换为纯爱模式 🌸 (请重新感应)");
                  
                  if (document.getElementById('view-discover').classList.contains('active')) {
                      state.deckPool = []; renderNextCard(); 
                  }
              });
          });

          document.getElementById('btn-chat-back').addEventListener('click', closeChat);
          
          document.getElementById('btn-pass').addEventListener('click', () => {
              if (document.getElementById('sm-active-card')) handleSwipeAction(false);
          });
          document.getElementById('btn-like').addEventListener('click', () => {
              if (document.getElementById('sm-active-card')) handleSwipeAction(true);
          });
          
          document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { 
              e.preventDefault(); sendUserMessage(false); 
            }
          });
          document.getElementById('chat-send').addEventListener('click', () => { sendUserMessage(true); });
          
          document.getElementById('btn-chat-settings').addEventListener('click', () => {
              if(!currentPeer) return;
              const cSet = state.chatSettings[currentPeer.id] || { theme: 'default', alias: '', customCss: '' };
              document.getElementById('setting-alias').value = cSet.alias || '';
              document.getElementById('setting-theme').value = cSet.theme || 'default';
              document.getElementById('setting-custom-css').value = cSet.customCss || '';
              document.getElementById('modal-chat-settings').classList.add('open');
          });
          document.getElementById('btn-cancel-settings').addEventListener('click', () => document.getElementById('modal-chat-settings').classList.remove('open'));
          
          document.getElementById('btn-upload-bg').addEventListener('click', () => document.getElementById('setting-bg-file').click());
          document.getElementById('btn-clear-bg').addEventListener('click', () => {
              if(!currentPeer) return;
              if(!state.chatSettings[currentPeer.id]) state.chatSettings[currentPeer.id] = {};
              state.chatSettings[currentPeer.id].bg = ''; roche.ui.toast("背景已清除，请保存。");
          });
          document.getElementById('setting-bg-file').addEventListener('change', (e) => {
              const file = e.target.files[0]; if(!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                 if(!state.chatSettings[currentPeer.id]) state.chatSettings[currentPeer.id] = {};
                 state.chatSettings[currentPeer.id].bg = ev.target.result;
                 roche.ui.toast("背景读取成功，请保存。");
              };
              reader.readAsDataURL(file);
          });
          
          document.getElementById('btn-save-settings').addEventListener('click', () => {
              if(!currentPeer) return;
              if(!state.chatSettings[currentPeer.id]) state.chatSettings[currentPeer.id] = {};
              state.chatSettings[currentPeer.id].alias = document.getElementById('setting-alias').value.trim();
              state.chatSettings[currentPeer.id].theme = document.getElementById('setting-theme').value;
              state.chatSettings[currentPeer.id].customCss = document.getElementById('setting-custom-css').value.trim();
              saveStorage(); document.getElementById('modal-chat-settings').classList.remove('open');
              document.getElementById('chat-peer-name').textContent = state.chatSettings[currentPeer.id].alias || currentPeer.name;
              document.getElementById('sm-dynamic-custom-css').textContent = state.chatSettings[currentPeer.id].customCss;
              renderChatHistory(); renderInbox(); 
          });

          document.getElementById('btn-send-photo').addEventListener('click', async () => {
              const desc = await showCustomPrompt("📷 发送照片", "请用文字描述你发送的照片画面：");
              if (desc) sendSpecialMsg('user_photo', { content: desc });
          });
          document.getElementById('btn-send-voice').addEventListener('click', async () => {
              const txt = await showCustomPrompt("🎤 发送语音", "请输入你想说的语音内容：");
              if (txt) sendSpecialMsg('voice_message', { content: txt });
          });
          document.getElementById('btn-send-transfer').addEventListener('click', () => {
              document.getElementById('transfer-amount').value = ''; document.getElementById('transfer-note').value = '';
              document.getElementById('modal-transfer').classList.add('open');
          });
          document.getElementById('btn-cancel-transfer').addEventListener('click', () => document.getElementById('modal-transfer').classList.remove('open'));
          document.getElementById('btn-confirm-transfer').addEventListener('click', () => {
              const amount = parseFloat(document.getElementById('transfer-amount').value); const note = document.getElementById('transfer-note').value.trim();
              if (isNaN(amount) || amount <= 0) return roche.ui.toast("金额不能为空且须大于0");
              document.getElementById('modal-transfer').classList.remove('open'); sendSpecialMsg('transfer', { amount, note });
          });

          document.getElementById('btn-clear-square').addEventListener('click', async () => {
              const ok = await roche.ui.confirm({ title: "清空广场", message: "将删除当前广场所有的动态，是否确认？" });
              if (ok) { state.squarePosts = []; saveStorage(); renderSquare(); roche.ui.toast("广场已清空"); }
          });

          document.getElementById('btn-chat-persona').addEventListener('click', extractPersona);

          document.getElementById('btn-clear-data').addEventListener('click', async () => {
            const ok = await roche.ui.confirm({ title: "危险操作", message: "将清空所有匹配列表与聊天记录，且不可恢复，是否继续？" });
            if (ok) {
              state.likedList = []; state.chatHistories = {}; state.chatSettings = {}; state.rpHistories = {};
              await saveStorage(); roche.ui.toast("数据已清空，灵魂关系回到原点。"); renderInbox();
            }
          });
        }

        async function bootApp() {
          await loadStorage(); await loadRocheContext(); bindEvents();
          renderNextCard(); 
        }
        bootApp();
      },
      async unmount(container, roche) { container.replaceChildren(); }
    }
  ]
});
