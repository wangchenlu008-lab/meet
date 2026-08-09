window.RochePlugin.register({
  id: "soul-meet-app",
  name: "Soul遇见",
  version: "1.4.0",
  apps: [
    {
      id: "soul-meet-main",
      name: "Soul遇见",
      icon: "favorite",
      async mount(container, roche) {
        container.classList.add("soul-meet-container");
        
        // ==========================================
        // 1. 注入 CSS (融合原优雅设计与新聊天/多选/动画需求)
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
          .sm-app { width: 100%; max-width: 480px; height: 100%; background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; box-shadow: 0 0 30px rgba(0,0,0,0.03); position: relative; z-index: 1; }
          .sm-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 700; font-size: 18px; z-index: 10; letter-spacing: 0.5px; }
          .sm-header-btn { background: none; border: none; cursor: pointer; color: #888; font-size: 14px; font-weight: 500; transition: color 0.2s;}
          .sm-header-btn:hover { color: #333; }
          .sm-view { flex: 1; overflow-y: auto; display: none; flex-direction: column; }
          .sm-view.active { display: flex; }
          .sm-nav { display: flex; justify-content: space-around; padding: 14px 0; border-top: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.8); padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px)); }
          .sm-nav-btn { background: none; border: none; font-size: 12px; color: #a0a0a0; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
          .sm-nav-btn i { font-size: 20px; font-style: normal; }
          .sm-nav-btn.active { color: #ff6b81; font-weight: 600; transform: translateY(-2px); }
          
          /* 发现页卡片及滑动 */
          .sm-card-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden; touch-action: none; }
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
          .sm-chip { display: inline-block; padding: 8px 14px; border-radius: 20px; border: 1px solid #eee; font-size: 13px; cursor: pointer; background: #fafafa; color: #666; font-weight: 500; transition: 0.2s;}
          .sm-chip.selected { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); color: #fff; border-color: transparent; font-weight: 700;}
          .sm-pref-chip.selected { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #fff; border-color: transparent;}
          .sm-custom-input-wrap { display: flex; gap: 8px; margin-top: 8px; width: 100%;}
          .sm-custom-input { flex: 1; padding: 8px 12px; border-radius: 16px; border: 1px solid #eee; font-size: 13px; outline: none;}
          
          /* 消息列表 */
          .sm-list-item { display: flex; padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.03); align-items: center; gap: 14px; cursor: pointer; transition: background 0.2s; margin: 0 8px; border-radius: 16px; user-select: none; -webkit-user-select: none;}
          .sm-list-item:hover { background: rgba(255,255,255,0.8); }
          .sm-list-item:active { background: rgba(0,0,0,0.05); }
          .sm-list-av { width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:bold; font-size:22px; color:#fff;}
          .sm-list-mid { flex: 1; min-width: 0; pointer-events: none;}
          .sm-list-name { font-weight: 700; font-size: 16px; margin-bottom: 6px; color: #222;}
          .sm-list-sub { font-size: 13.5px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .sm-list-tag { font-size: 10px; border: 1px solid #ff6b81; color: #ff6b81; padding: 2px 8px; border-radius: 12px; margin-left: 6px; font-weight: 600;}
          
          /* 聊天室与气泡 */
          .sm-chat-room { position: absolute; inset: 0; background: #fbfbfd; z-index: 50; display: none; flex-direction: column; }
          .sm-chat-room.open { display: flex; }
          .sm-chat-head { padding: 12px 16px; background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; z-index: 10;}
          .sm-chat-tools { display: flex; gap: 8px; }
          .sm-tool-btn { background: #fff; border: 1px solid #eee; padding: 6px 12px; border-radius: 16px; font-size: 12px; cursor: pointer; color: #555; font-weight: 600;}
          .sm-chat-history { flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; }
          .sm-msg-wrapper { display: flex; flex-direction: column; max-width: 80%; user-select: none; -webkit-user-select: none; }
          .sm-msg-wrapper.me { align-self: flex-end; align-items: flex-end; }
          .sm-msg-wrapper.peer { align-self: flex-start; align-items: flex-start; }
          .sm-msg { padding: 10px 14px; border-radius: 20px; font-size: 14.5px; line-height: 1.5; white-space: pre-wrap; box-shadow: 0 2px 8px rgba(0,0,0,0.03); cursor: pointer; position: relative;}
          .sm-msg:active { filter: brightness(0.9); }
          .sm-msg.me { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #fff; border-bottom-right-radius: 4px; }
          .sm-msg.peer { background: #fff; border: 1px solid #eee; border-bottom-left-radius: 4px; color: #333;}
          .sm-quote-box { background: rgba(0,0,0,0.05); padding: 6px 10px; border-radius: 8px; font-size: 12px; margin-bottom: 6px; color: inherit; opacity: 0.8; border-left: 3px solid rgba(0,0,0,0.1); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          
          /* 聊天输入框 (区分发送与AI回复) */
          .sm-chat-input-area { padding: 10px 16px; background: #fff; border-top: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 8px; padding-bottom:calc(10px + env(safe-area-inset-bottom, 0px)); }
          .sm-input-row { display: flex; gap: 10px; align-items: flex-end; }
          .sm-chat-input { flex: 1; padding: 10px 16px; border-radius: 20px; border: 1px solid #eee; outline: none; font-size: 14.5px; background:#f9f9f9; resize: none; max-height: 100px;}
          .sm-chat-input:focus { border-color: #ffb8b8; background: #fff; }
          .sm-action-group { display: flex; gap: 8px; align-items: center;}
          .sm-chat-send { background: #ff6b81; color: #fff; border: none; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 16px; display:flex; align-items:center; justify-content:center;}
          .sm-chat-wait { background: #f0f0f0; color: #555; border: 1px solid #e0e0e0; padding: 0 14px; height: 38px; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 13px; display:flex; align-items:center; gap:4px; }
          
          /* 模态弹窗 (人设/长按菜单) */
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
            <button class="sm-header-btn" id="sm-close-plugin">✕</button>
          </div>

          <!-- 发现页 -->
          <div class="sm-view active" id="view-discover">
            <div class="sm-card-wrap" id="sm-deck-container"></div>
            <div class="sm-actions" id="sm-card-actions" style="display:none;">
              <button class="sm-act-btn sm-act-pass" id="btn-pass">✖</button>
              <button class="sm-act-btn sm-act-like" id="btn-like">♥</button>
            </div>
          </div>

          <!-- 消息页 -->
          <div class="sm-view" id="view-inbox">
            <div class="sm-header" style="background:transparent; border:none; border-bottom: 1px solid rgba(0,0,0,0.03);">💌 你的缘分</div>
            <div id="sm-inbox-list" style="flex:1; overflow-y:auto; padding-top: 8px;"></div>
          </div>

          <!-- 运势页 -->
          <div class="sm-view" id="view-daily">
            <div class="sm-panel" style="background: linear-gradient(135deg, #fff 0%, #fff0f3 100%);">
              <h3>✨ 跨时空交友运势</h3>
              <p id="sm-daily-text" style="color:#444; font-size:14.5px;">正在感应星象...</p>
              <button class="sm-btn-primary" id="btn-refresh-daily" style="width:100%; margin-top:10px;">重新感应</button>
            </div>
          </div>

          <!-- 我的页 -->
          <div class="sm-view" id="view-me">
            <div class="sm-panel">
              <h3>👤 灵魂底色</h3>
              <p>你在 Roche 当前活跃的人设，是跨维度匹配的坐标锚点：</p>
              <p style="background:#f8f9fa; padding:14px; border-radius:16px; font-size:13.5px; color:#555; border: 1px solid #eee;" id="sm-my-persona">加载中...</p>
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
              <h3>🌍 宇宙设定 (多选)</h3>
              <p>挂载世界书，你可能会遇到该世界观下的各种人：</p>
              <div id="sm-wb-list" class="sm-chip-container"><div style="font-size:13px; color:#aaa;">检索世界线...</div></div>
            </div>

            <div class="sm-panel" style="box-shadow:none; background:transparent; border:none; padding-top:0;">
              <button class="sm-btn-outline" id="btn-clear-data" style="width:100%; color:#d63031; border-color:#fab1a0; background:#fff;">清空交友记忆</button>
            </div>
          </div>

          <!-- 底部导航 -->
          <div class="sm-nav">
            <button class="sm-nav-btn active" data-target="view-discover"><i>🌍</i>发现</button>
            <button class="sm-nav-btn" data-target="view-inbox"><i>💌</i>消息</button>
            <button class="sm-nav-btn" data-target="view-daily"><i>✨</i>运势</button>
            <button class="sm-nav-btn" data-target="view-me"><i>⚙️</i>我的</button>
          </div>

          <!-- 聊天室 -->
          <div class="sm-chat-room" id="sm-chat-room">
            <div class="sm-chat-head">
              <button class="sm-header-btn" id="btn-chat-back" style="font-size:22px; padding:0 10px;">‹</button>
              <span id="chat-peer-name" style="font-weight:800; font-size:16px;">名字</span>
              <div class="sm-chat-tools">
                <button class="sm-tool-btn" id="btn-chat-persona" style="display:none;" title="生成档案">提取人设</button>
                <button class="sm-tool-btn" id="btn-chat-memory" title="沉淀到 Roche 主记忆">记录</button>
              </div>
            </div>
            <div class="sm-chat-history" id="chat-history"></div>
            <div class="sm-chat-input-area">
              <!-- 引用提示区 -->
              <div id="chat-quote-preview" style="display:none; width:100%; font-size:12px; color:#666; background:#f0f0f0; padding:6px 10px; border-radius:8px; align-items:center; justify-content:space-between;">
                 <span id="chat-quote-text" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;"></span>
                 <span id="btn-cancel-quote" style="cursor:pointer; padding-left:10px; font-weight:bold; color:#888;">✕</span>
              </div>
              <div class="sm-input-row">
                <textarea class="sm-chat-input" id="chat-input" rows="1" placeholder="输入消息 (回车直接发送)..."></textarea>
                <div class="sm-action-group">
                  <button class="sm-chat-wait" id="chat-reply" title="等待对方回复">✨ 回复</button>
                  <button class="sm-chat-send" id="chat-send">➤</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 通用弹窗：展示人设 -->
          <div class="sm-modal-overlay" id="modal-persona">
            <div class="sm-modal">
              <h3 style="margin:0; font-size:18px;">✨ 灵魂档案</h3>
              <p style="font-size:13px; color:#888; margin:0;">已根据聊天丰富了细节。复制后，去 Roche 主页面创建一个新角色吧！</p>
              <textarea id="modal-persona-text" readonly></textarea>
              <div class="sm-modal-btns"><button class="sm-modal-btn sm-btn-outline" id="btn-close-modal">关闭</button></div>
            </div>
          </div>

          <!-- 通用 Action Sheet：列表长按/气泡长按/点击菜单 -->
          <div class="sm-modal-overlay" id="modal-action-sheet" style="align-items: flex-end; padding:0;">
            <div class="sm-action-sheet" id="sheet-content">
              <!-- 动态注入项 -->
            </div>
          </div>
        `;
        container.appendChild(appDOM);
        // ==========================================
        // 3. 全局状态、多世界书存储与底层 API 封装
        // ==========================================
        const state = {
          deckPool: [],     
          passedDeck: [],   // 后悔药池
          currentCard: null,
          likedList: [],    
          chatHistories: {},
          myPersona: "",
          worldbooks: [],
          selectedWbIds: [], 
          selectedPrefs: [], // 用户选择或自定义的偏好标签
          chatQuoteData: null // 当前准备引用的消息内容
        };

        const DEFAULT_PREFS = ["幽默风趣", "温柔体贴", "高冷傲娇", "反差萌", "事业狂", "艺术家", "病娇", "直球克星", "爹系/妈系", "话痨"];

        async function loadStorage() {
          const liked = await roche.storage.get("soul_meet_liked");
          if (liked) state.likedList = liked;
          const chats = await roche.storage.get("soul_meet_chats");
          if (chats) state.chatHistories = chats;
          const settings = await roche.storage.get("soul_meet_settings");
          if (settings) {
            if (Array.isArray(settings.selectedWbIds)) state.selectedWbIds = settings.selectedWbIds;
            if (Array.isArray(settings.selectedPrefs)) state.selectedPrefs = settings.selectedPrefs;
          } else {
            // 如果首次使用，默认带上几个基本偏好供选择
            state.selectedPrefs = [...DEFAULT_PREFS]; 
          }
        }
        
        async function saveStorage() {
          await roche.storage.set("soul_meet_liked", state.likedList);
          await roche.storage.set("soul_meet_chats", state.chatHistories);
          await roche.storage.set("soul_meet_settings", { 
            selectedWbIds: state.selectedWbIds,
            selectedPrefs: state.selectedPrefs
          });
        }

        async function askAIToJson(systemPrompt, userPrompt) {
          const res = await roche.ai.chat({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.95 // 偏高温度，带来鲜活随机感
          });
          if (!res || !res.text) throw new Error("AI未返回内容");
          let str = res.text.trim();
          const match = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
          if (match) str = match[1].trim();
          const firstBrace = str.indexOf('{');
          const lastBrace = str.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            str = str.slice(firstBrace, lastBrace + 1);
          }
          return JSON.parse(str);
        }

        // ==========================================
        // 4. 加载上下文与生成卡片 (增加自定义偏好与手势重构)
        // ==========================================
        
        // 渲染偏好标签 UI (支持自定义)
        function renderPreferences() {
          const prefListEl = document.getElementById('sm-pref-list');
          prefListEl.innerHTML = '';
          
          // 合并默认标签和用户自定义过的标签，去重
          const allTags = Array.from(new Set([...DEFAULT_PREFS, ...state.selectedPrefs]));
          
          allTags.forEach(tag => {
            const chip = document.createElement('div');
            chip.className = 'sm-chip sm-pref-chip';
            if(state.selectedPrefs.includes(tag)) chip.classList.add('selected');
            chip.textContent = tag;
            
            chip.onclick = () => {
              if(state.selectedPrefs.includes(tag)) {
                state.selectedPrefs = state.selectedPrefs.filter(t => t !== tag);
                chip.classList.remove('selected');
              } else {
                state.selectedPrefs.push(tag);
                chip.classList.add('selected');
              }
              saveStorage();
            };
            prefListEl.appendChild(chip);
          });
        }

        async function loadRocheContext() {
          try {
            // 1. 获取用户活跃人设
            const p = await roche.persona.getActiveUserPersona();
            state.myPersona = p || "一个期待在灵魂网络里遇见共鸣的人。";
            document.getElementById('sm-my-persona').textContent = state.myPersona;

            // 2. 渲染偏好多选面板
            renderPreferences();
            
            // 监听自定义偏好添加
            document.getElementById('btn-add-pref').onclick = () => {
               const input = document.getElementById('sm-custom-pref-input');
               const val = input.value.trim();
               if(val && !state.selectedPrefs.includes(val)) {
                 state.selectedPrefs.push(val);
                 saveStorage();
                 renderPreferences();
                 input.value = "";
                 roche.ui.toast("已添加偏好！");
               }
            };

            // 3. 获取世界书分类并渲染多选 Chip
            const wbs = await roche.worldbook.list();
            state.worldbooks = wbs || [];
            const wbListEl = document.getElementById('sm-wb-list');
            wbListEl.innerHTML = '';
            
            if(state.worldbooks.length === 0) {
              wbListEl.innerHTML = '<span style="color:#aaa; font-size:13px;">宿主暂无世界书，将在默认自由宇宙中匹配。</span>';
            } else {
              state.worldbooks.forEach(wb => {
                const chip = document.createElement('div');
                chip.className = 'sm-chip';
                if(state.selectedWbIds.includes(wb.id)) chip.classList.add('selected');
                chip.textContent = wb.name;
                
                chip.onclick = () => {
                  if(state.selectedWbIds.includes(wb.id)) {
                    state.selectedWbIds = state.selectedWbIds.filter(id => id !== wb.id);
                    chip.classList.remove('selected');
                  } else {
                    state.selectedWbIds.push(wb.id);
                    chip.classList.add('selected');
                  }
                  saveStorage();
                };
                wbListEl.appendChild(chip);
              });
            }
          } catch(e) {
            console.warn("加载上下文失败", e);
          }
        }

        // 生成推荐卡片池 (彻底解决职业死板、去除非人类跨界描述、大批量生成)
        async function generateCards() {
          const container = document.getElementById('sm-deck-container');
          document.getElementById('sm-card-actions').style.display = 'none';
          
          container.innerHTML = `
            <div class="sm-empty-state">
              <div style="font-size:32px; margin-bottom:12px;">🔮</div>
              <div style="color:#888; font-size:14px; margin-bottom: 20px;">跨维度信号连接中...</div>
            </div>`;
          
          let newCards = [];
          state.passedDeck = []; // 清空后悔药池

          // 1. 抓取 Roche 的 Char 充当“匿名网友”原住民 (新增匿名的抓奸可能性)
          try {
            const chars = await roche.character.list();
            const unlikedChars = chars.filter(c => !state.likedList.some(l => l.id === c.id));
            const pickedChars = unlikedChars.sort(() => 0.5 - Math.random()).slice(0, 1);
            for(const c of pickedChars) {
              const fullC = await roche.character.get(c.id);
              // 注意：不要直接写明他是谁，让他以某个网名或原住民身份混在里面
              newCards.push({
                id: c.id,
                isChar: true,
                name: c.handle || c.name,
                avatar: c.avatar || '',
                bio: fullC.bio || fullC.persona || "（无简介）",
                tag: "原住民",
                persona: fullC.persona || "",
                match: Math.floor(Math.random() * 10) + 90
              });
            }
          } catch(e) {}

          // 2. 结合世界书和偏好，批量生成鲜活的AI角色 (6~8个)
          try {
            let wbContext = "";
            if (state.selectedWbIds.length > 0) {
              for (const wid of state.selectedWbIds) {
                const entries = await roche.worldbook.getEntries({ categoryId: wid, scope: "global" });
                wbContext += entries.map(e => e.content).join("\n") + "\n";
              }
              wbContext = wbContext.substring(0, 1500); 
            }

            // 根据用户勾选的偏好提供方向
            const activePrefs = state.selectedPrefs.filter(p => !DEFAULT_PREFS.includes(p) || document.querySelector(`.sm-pref-chip.selected:contains('${p}')`));
            let prefContext = activePrefs.length > 0 
              ? `请重点优先生成带有这些特质的人类：【${activePrefs.join("、")}】。` 
              : "生成随机多元化、性格鲜明的人类。";

            const sysPrompt = `你是一个匿名交友匹配系统。请一次性生成 6 到 8 个截然不同、极具"活人感"的交友卡片。
要求：
1. 身份极端多样：不能仅仅是普通职业，可以有【微服私访的皇帝、落魄明星、跨界魔法师、腹黑霸总、腹黑学霸、摆烂的打工人】等。前提是他们都在用这个社交软件，并以人类的语气说话。
2. "活人感"：bio(交友宣言)必须像真人在用软件，可以带点情绪、吐槽、小傲娇或敷衍，绝对不能像AI客服。
3. ${prefContext}
4. 输出严格的 JSON 格式：{"cards":[{"id":"唯一小写短id","name":"独特网名","bio":"交友宣言","tag":"四字以内的特征标签","match":随机70到99,"persona":"隐藏详细设定，包含极具个性的说话风格、真实身份背景，用于后续对话，约100字"}]}。
只输出纯 JSON，不要Markdown。`;
            
            let usrPrompt = `我的灵魂底色：\n${state.myPersona}\n`;
            if (wbContext) usrPrompt += `世界观潜规则（小概率触发这些世界观下的人物，绝大多数是现代人）：\n${wbContext}\n`;
            usrPrompt += `请生成 6 到 8 个活生生的、可以和我产生奇妙化学反应的人类。`;

            const aiRes = await askAIToJson(sysPrompt, usrPrompt);
            if (aiRes && Array.isArray(aiRes.cards)) {
              aiRes.cards.forEach(c => {
                newCards.push({
                  id: "stranger_" + c.id + "_" + Date.now(),
                  isChar: false,
                  name: c.name,
                  avatar: "",
                  bio: c.bio,
                  tag: c.tag,
                  persona: c.persona,
                  match: c.match
                });
              });
            }
          } catch(e) {
            console.error("生成陌生人失败", e);
            roche.ui.toast("信号波动，仅捕捉到极少缘分。");
          }

          state.deckPool = newCards.sort(() => 0.5 - Math.random());
          renderNextCard();
        }

        // 渲染单张卡片
        function renderNextCard() {
          const container = document.getElementById('sm-deck-container');
          const actions = document.getElementById('sm-card-actions');
          
          if (state.deckPool.length === 0) {
            actions.style.display = 'none';
            let html = `
              <div class="sm-empty-state">
                <div style="font-size:32px; margin-bottom:12px;">🌟</div>
                <div style="color:#888; font-size:14px; margin-bottom: 24px;">这一批卡片已经看完了</div>`;
            
            if (state.passedDeck.length > 0) {
              html += `<button class="sm-btn-outline" id="btn-rewind" style="margin-bottom:16px; width:100%;">🔙 重新查看错过的 Ta</button>`;
            }
            html += `<button class="sm-btn-primary" id="btn-fetch-more" style="width:100%;">🚀 重新感应新批次</button></div>`;
            
            container.innerHTML = html;
            document.getElementById('btn-fetch-more')?.addEventListener('click', generateCards);
            document.getElementById('btn-rewind')?.addEventListener('click', () => {
               state.deckPool = [...state.passedDeck];
               state.passedDeck = [];
               renderNextCard();
            });
            state.currentCard = null;
            return;
          }

          actions.style.display = 'flex';
          const card = state.deckPool[0];
          state.currentCard = card;
          // 去除跨界的字眼
          const typeBadge = card.isChar 
            ? '<div class="sm-card-type" style="background: rgba(255,107,129,0.85);">原住民</div>' 
            : '<div class="sm-card-type">新朋友</div>';
          
          container.innerHTML = `
            <div class="sm-card" id="sm-active-card">
              ${typeBadge}
              <div class="sm-card-img">${card.avatar ? `<img src="${card.avatar}" style="width:100%;height:100%;object-fit:cover;">` : card.name.substring(0,1)}</div>
              <div class="sm-card-info">
                <div class="sm-card-name">${card.name} <span class="sm-card-match">${card.match}% 契合</span></div>
                <div class="sm-card-tags"><span class="sm-card-tag"># ${card.tag}</span></div>
                <div class="sm-card-bio">${card.bio}</div>
              </div>
            </div>
          `;

          // 重新绑定基于鼠标和触摸的顺滑手势
          bindCardSwipe(document.getElementById('sm-active-card'));
        }

        // ==========================================
        // 5. 手势滑动核心逻辑 (完美兼容多端)
        // ==========================================
        function bindCardSwipe(el) {
          if (!el) return;
          let startX = 0, startY = 0, isDragging = false;

          const onMove = (e) => {
            if (!isDragging) return;
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);
            const deltaX = x - startX;
            const deltaY = y - startY;
            const rotate = deltaX * 0.05; 
            el.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
          };

          const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            el.classList.remove('dragging');
            
            const x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || startX;
            const deltaX = x - startX;
            const threshold = window.innerWidth * 0.25;
            
            if (deltaX > threshold) {
              handleSwipeAction(true); // 右滑 喜欢
            } else if (deltaX < -threshold) {
              handleSwipeAction(false); // 左滑 Pass
            } else {
              el.style.transform = `translate(0px, 0px) rotate(0deg)`; // 回弹
            }
            
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchend', onEnd);
          };

          const onStart = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            startX = e.clientX || (e.touches && e.touches[0].clientX);
            startY = e.clientY || (e.touches && e.touches[0].clientY);
            isDragging = true;
            el.classList.add('dragging');
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
          };

          el.addEventListener('mousedown', onStart);
          el.addEventListener('touchstart', onStart, { passive: false });
        }

        function handleSwipeAction(isLike) {
          if (!state.currentCard) return;
          const card = state.deckPool.shift();
          const cardEl = document.getElementById('sm-active-card');
          
          if (cardEl) {
            cardEl.style.transition = 'transform 0.3s ease-out, opacity 0.3s';
            cardEl.style.transform = isLike ? 'translate(150%, 20%) rotate(25deg)' : 'translate(-150%, 20%) rotate(-25deg)';
            cardEl.style.opacity = '0';
          }

          if (isLike) {
            if (!state.likedList.some(l => l.id === card.id)) {
              state.likedList.unshift(card);
              saveStorage();
              renderInbox();
              roche.ui.toast(`成功与 ${card.name} 建立羁绊！`);
            }
          } else {
            state.passedDeck.push(card);
          }

          setTimeout(() => {
            renderNextCard();
          }, 300);
        }
        // ==========================================
        // 6. 通用工具：长按与底部菜单 (Action Sheet)
        // ==========================================
        function addLongPressListener(el, callback) {
          let timer = null;
          let isFired = false;
          const start = (e) => {
            isFired = false;
            timer = setTimeout(() => {
              isFired = true;
              callback(e);
            }, 500); // 500ms 长按触发
          };
          const cancel = () => { clearTimeout(timer); };
          el.addEventListener('mousedown', start);
          el.addEventListener('touchstart', start, { passive: true });
          el.addEventListener('mouseup', cancel);
          el.addEventListener('mouseleave', cancel);
          el.addEventListener('touchend', cancel);
          el.addEventListener('touchmove', cancel, { passive: true });
          el.addEventListener('click', (e) => { if(isFired) e.stopPropagation(); }, true);
        }

        function showActionSheet(items) {
          const sheet = document.getElementById('sheet-content');
          const overlay = document.getElementById('modal-action-sheet');
          sheet.innerHTML = '';
          items.forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'sm-sheet-item' + (item.danger ? ' danger' : '');
            btn.textContent = item.label;
            btn.onclick = () => {
              overlay.classList.remove('open');
              if (item.onClick) item.onClick();
            };
            sheet.appendChild(btn);
          });
          const cancelBtn = document.createElement('div');
          cancelBtn.className = 'sm-sheet-item sm-sheet-cancel';
          cancelBtn.textContent = '取消';
          cancelBtn.onclick = () => overlay.classList.remove('open');
          sheet.appendChild(cancelBtn);
          
          overlay.classList.add('open');
        }

        document.getElementById('modal-action-sheet').addEventListener('click', (e) => {
          if (e.target.id === 'modal-action-sheet') e.target.classList.remove('open');
        });

        // ==========================================
        // 7. 运势测算、消息列表与聊天交互
        // ==========================================

        async function fetchDailyFortune() {
          const el = document.getElementById('sm-daily-text');
          el.innerHTML = '<span style="color:#aaa;">星盘旋转中，正在感应多维数据流...</span>';
          try {
            const res = await roche.ai.chat({
              messages: [
                { role: "system", content: "你是一个洞察人心的星象交友占卜师。请根据用户人设，输出一段包含宜、忌，且约80字的今日交友运势。语气要优雅、神秘且温馨。" },
                { role: "user", content: `我的人设底色是：${state.myPersona}` }
              ],
              temperature: 0.85
            });
            el.innerHTML = res.text.replace(/\n/g, '<br>');
          } catch(e) {
            el.innerHTML = '<span style="color:#d63031;">星象磁场受到干扰，今日宜顺其自然，跟随直觉去匹配。</span>';
          }
        }

        function renderInbox() {
          const list = document.getElementById('sm-inbox-list');
          list.innerHTML = "";
          if (state.likedList.length === 0) {
            list.innerHTML = '<div style="padding:60px 20px; text-align:center; color:#a0a0a0; font-size:14px; display:flex; flex-direction:column; align-items:center;"><div style="font-size:40px; margin-bottom:10px;">📮</div>这里还空空如也<br>快去发现页寻找缘分吧</div>';
            return;
          }
          state.likedList.forEach(u => {
            const item = document.createElement('div');
            item.className = 'sm-list-item';
            const hist = state.chatHistories[u.id] || [];
            const lastMsg = hist.length > 0 ? hist[hist.length-1].content : "刚刚建立了联系，发个消息吧~";
            
            item.innerHTML = `
              <div class="sm-list-av">${u.avatar ? `<img src="${u.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : u.name.substring(0,1)}</div>
              <div class="sm-list-mid">
                <div class="sm-list-name">${u.name} <span class="sm-list-tag">${u.isChar ? '原住民' : '新朋友'}</span></div>
                <div class="sm-list-sub">${lastMsg}</div>
              </div>
            `;
            
            // 单击进入聊天
            item.onclick = () => openChat(u);
            
            // 长按操作
            addLongPressListener(item, () => {
              showActionSheet([
                { label: '清空聊天记录', onClick: () => {
                  state.chatHistories[u.id] = [];
                  saveStorage(); renderInbox(); roche.ui.toast("已清空记录");
                }},
                { label: '删除该好友', danger: true, onClick: () => {
                  state.likedList = state.likedList.filter(l => l.id !== u.id);
                  delete state.chatHistories[u.id];
                  saveStorage(); renderInbox(); roche.ui.toast("已解除羁绊");
                }}
              ]);
            });
            list.appendChild(item);
          });
        }
        
        let currentPeer = null;

        function openChat(peer) {
          currentPeer = peer;
          document.getElementById('chat-peer-name').textContent = peer.name;
          document.getElementById('btn-chat-persona').style.display = peer.isChar ? "none" : "block";
          
          state.chatQuoteData = null;
          updateQuotePreviewUI();

          renderChatHistory();
          document.getElementById('sm-chat-room').classList.add('open');
        }

        function closeChat() {
          currentPeer = null;
          document.getElementById('sm-chat-room').classList.remove('open');
        }

        function updateQuotePreviewUI() {
          const previewEl = document.getElementById('chat-quote-preview');
          const textEl = document.getElementById('chat-quote-text');
          if (state.chatQuoteData) {
            textEl.textContent = `引用: ${state.chatQuoteData}`;
            previewEl.style.display = 'flex';
          } else {
            previewEl.style.display = 'none';
          }
        }
        document.getElementById('btn-cancel-quote').onclick = () => {
          state.chatQuoteData = null;
          updateQuotePreviewUI();
        };

        function renderChatHistory() {
          const container = document.getElementById('chat-history');
          container.innerHTML = "";
          const hist = state.chatHistories[currentPeer.id] || [];
          
          if (hist.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#ccc; font-size:12px; margin-top:20px;">—— 你们在 Soul Meet 的初次对话 ——</div>`;
          }

          hist.forEach((msg, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = `sm-msg-wrapper ${msg.role === 'user' ? 'me' : 'peer'}`;
            
            const el = document.createElement('div');
            el.className = `sm-msg ${msg.role === 'user' ? 'me' : 'peer'}`;
            
            // 渲染引用
            let quoteHtml = '';
            if (msg.quote) {
              quoteHtml = `<div class="sm-quote-box">${msg.quote}</div>`;
            }
            el.innerHTML = quoteHtml + msg.content;
            
            // 气泡长按菜单
            addLongPressListener(el, () => {
              showActionSheet([
                { label: '引用', onClick: () => {
                  state.chatQuoteData = msg.content;
                  updateQuotePreviewUI();
                }},
                { label: '撤回/删除', danger: true, onClick: () => {
                  state.chatHistories[currentPeer.id].splice(idx, 1);
                  saveStorage();
                  renderChatHistory();
                  renderInbox();
                }}
              ]);
            });

            wrapper.appendChild(el);
            container.appendChild(wrapper);
          });
          container.scrollTop = container.scrollHeight;
        }

        // 仅发送用户消息 (可以连发)
        function sendUserMessage() {
          if (!currentPeer) return;
          const input = document.getElementById('chat-input');
          const text = input.value.trim();
          if (!text) return;

          if (!state.chatHistories[currentPeer.id]) state.chatHistories[currentPeer.id] = [];
          
          const newMsg = { role: 'user', content: text };
          if (state.chatQuoteData) {
            newMsg.quote = state.chatQuoteData;
            state.chatQuoteData = null; // 发送后清空引用
            updateQuotePreviewUI();
          }

          state.chatHistories[currentPeer.id].push(newMsg);
          saveStorage();
          
          input.value = "";
          renderChatHistory();
          renderInbox();
        }

        // 手动点击触发 AI 回复 (融合活人感、原住民抓奸)
        async function triggerAiReply() {
          if (!currentPeer) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length === 0 || hist[hist.length-1].role === 'assistant') {
            roche.ui.toast("轮到你说话啦！");
            return;
          }

          const btn = document.getElementById('chat-reply');
          const originalText = btn.textContent;
          btn.textContent = "打字中...";
          btn.disabled = true;

          try {
            let sysPrompt = `你正在交友软件 "Soul Meet" 上以文字私信的方式与我聊天。
你的身份是：「${currentPeer.name}」。
你的详细设定：${currentPeer.persona}
我是和你聊天的人，我的人设底色是：${state.myPersona}\n`;

            if (state.selectedWbIds.length > 0) {
              let wbContext = "";
              for (const wid of state.selectedWbIds) {
                const entries = await roche.worldbook.getEntries({ categoryId: wid, scope: "global" });
                wbContext += entries.map(e => e.content).join("\n") + "\n";
              }
              sysPrompt += `\n【当前所处宇宙的常识法则】\n${wbContext.substring(0, 800)}\n请在聊天时自然体现你活在这个世界里，但绝对不要像在做科普，你只是个活在这个世界里的普通人。`;
            }
            
            // 联通已有角色的记忆 & 抓奸提示
            if (currentPeer.isChar) {
               sysPrompt += `\n【重要身份秘密 (抓奸玩法)】：
你其实是主世界中的【${currentPeer.name}】本人。但你现在是偷偷注册了这个匿名交友软件在使用。如果我对你的身份起疑、或者直接质问你为什么来玩交友软件（俗称“抓奸”），你必须根据你的性格做出最真实的反应（比如：心虚掩饰、死鸭子嘴硬、慌张、或者理直气壮地反问我为什么也在玩）。千万不要承认自己是AI。`;

               try {
                 const charData = await roche.character.get(currentPeer.id);
                 if (charData && charData.conversationId) {
                   const msgs = await roche.memory.getShortTerm({ conversationId: charData.conversationId, limit: 8 });
                   if (msgs && msgs.length > 0) {
                     sysPrompt += `\n【你在主世界与我最近的记忆潜意识】(作为关系参考，如果被抓包可以顺带提及)：\n`;
                     msgs.reverse().forEach(m => {
                       sysPrompt += `${m.senderName || (m.type==='user'?'我':'你')}: ${m.text}\n`;
                     });
                   }
                 }
               } catch(e) {}
            }

            sysPrompt += `\n【最高指令：活人感规范】
1. 你是一个有喜怒哀乐的【真实人类/角色】，不是AI，不是客服！必须完全沉浸。
2. 说话口语化，像发微信一样，可以用少量网络用语，可以敷衍、吐槽、装高冷，完全遵循你的人设。
3. 绝对禁止使用括号或星号进行动作和神态描写（如：*笑*、(喝口茶)、[挑眉]）。只能输出纯文本！！！
4. 每次回复限制在 40 字以内。不要急于推动剧情，像真人一样一句一句聊。`;

            const apiMsgs = [{ role: 'system', content: sysPrompt }];
            
            // 取最近 15 条
            hist.slice(-15).forEach(m => {
              // 转化引用内容以供 AI 理解
              let content = m.content;
              if (m.quote) content = `(引用了刚才的话：${m.quote})\n${content}`;
              apiMsgs.push({ role: m.role, content: content });
            });

            const res = await roche.ai.chat({ messages: apiMsgs, temperature: 0.95 });
            const replyText = res.text.trim().replace(/[\(\[\*].*?[\)\]\*]/g, ''); // 剔除动作描写兜底

            state.chatHistories[currentPeer.id].push({ role: 'assistant', content: replyText });
            saveStorage();
            renderChatHistory();
            renderInbox();
          } catch(e) {
            roche.ui.toast("对方的网络似乎断开了，消息未送达");
          } finally {
            btn.textContent = originalText;
            btn.disabled = false;
          }
        }

        // ==========================================
        // 8. 闭环：提取人设 & 沉淀记忆至 Roche
        // ==========================================

        async function extractPersona() {
          if (!currentPeer || currentPeer.isChar) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length < 3) {
            roche.ui.toast("聊得太少了，多聊几句让 AI 更好地捕捉 Ta 的灵魂吧！");
            return;
          }

          roche.ui.toast("AI 正在撰写灵魂档案...");
          const textLog = hist.map(m => (m.role==='user'?'我':'Ta') + ': ' + m.content).join('\n');
          
          const sys = `你是一位顶级的小说/剧本角色设定师。请结合该角色的基础设定和下方的聊天记录，撰写一份详尽的、适合直接复制给大模型当人设 prompt (Persona) 的档案。
包括：姓名、外貌气质、性格剖析、核心说话口癖、神秘过往、以及对"我"的特殊态度。无需废话，直接输出高质量档案文本。`;
          let usr = `【基础设定】\n${currentPeer.persona}\n\n【实际聊天表现参考】\n${textLog}`;

          try {
            const res = await roche.ai.chat({ messages: [{ role: "system", content: sys }, { role: "user", content: usr }], temperature: 0.7 });
            document.getElementById('modal-persona-text').value = res.text.trim();
            document.getElementById('modal-persona').classList.add('open');
          } catch(e) {
            roche.ui.toast("提取灵魂档案失败");
          }
        }

        async function depositMemory() {
          if (!currentPeer) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length < 4) {
             roche.ui.toast("你们的故事才刚刚开始，晚点再记录吧~");
             return;
          }

          const confirmed = await roche.ui.confirm({
            title: "印刻至主世界记忆库",
            message: "将让 AI 提取你们在 Soul Meet 的羁绊要点，并永久写入 Roche 主记忆库。确定吗？"
          });
          if (!confirmed) return;

          roche.ui.toast("正在提炼重要羁绊...");
          const textLog = hist.map(m => (m.role==='user'?'我':'Ta') + ': ' + m.content).join('\n');
          
          try {
            const res = await roche.ai.chat({
              messages: [
                { role: "system", content: "请根据以下聊天记录，总结出 1 到 2 句关于他们之间最重要的羁绊或事实陈述。简明扼要，第三人称叙述，格式如'用户在虚拟交友中认识了某某，并约定周末打游戏'。不超过 50 字。" },
                { role: "user", content: textLog }
              ],
              temperature: 0.3
            });
            const fact = res.text.trim();
            
            let actualCid = "soul_meet_stranger_" + currentPeer.id;
            if (currentPeer.isChar) {
               try {
                 const cData = await roche.character.get(currentPeer.id);
                 if (cData && cData.conversationId) actualCid = cData.conversationId;
               } catch(e){}
            }

            await roche.memory.write({
              conversationId: actualCid,
              summaryText: fact,
              who: ["用户", currentPeer.name],
              action: fact,
              when: "在 Soul Meet",
              where: "多维交友空间",
              source: "plugin"
            });

            roche.ui.toast("✅ 记忆已成功印刻在主系统灵魂深处！");
          } catch(e) {
            roche.ui.toast("记忆写入中断。");
          }
        }

        // ==========================================
        // 9. 绑定事件与初始化生命周期
        // ==========================================

        function bindEvents() {
          document.getElementById('sm-close-plugin').addEventListener('click', () => roche.ui.closeApp());

          document.querySelectorAll('.sm-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              document.querySelectorAll('.sm-nav-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              const targetId = btn.getAttribute('data-target');
              document.querySelectorAll('.sm-view').forEach(v => v.classList.remove('active'));
              document.getElementById(targetId).classList.add('active');
              
              if (targetId === 'view-inbox') renderInbox();
              if (targetId === 'view-daily') fetchDailyFortune();
            });
          });

          // 聊天室事件
          document.getElementById('btn-chat-back').addEventListener('click', closeChat);
          
          // 用户只发送，AI不回
          document.getElementById('chat-send').addEventListener('click', sendUserMessage);
          document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { // 支持 shift+enter 换行
              e.preventDefault();
              sendUserMessage();
            }
          });
          
          // 点击“✨回复”才触发AI
          document.getElementById('chat-reply').addEventListener('click', triggerAiReply);

          // 提取人设与记录羁绊
          document.getElementById('btn-chat-persona').addEventListener('click', extractPersona);
          document.getElementById('btn-chat-memory').addEventListener('click', depositMemory);
          document.getElementById('btn-close-modal').addEventListener('click', () => {
            document.getElementById('modal-persona').classList.remove('open');
          });

          // 清空缓存
          document.getElementById('btn-clear-data').addEventListener('click', async () => {
            const ok = await roche.ui.confirm({ title: "危险操作", message: "将清空所有匹配列表与聊天记录，且不可恢复，是否继续？" });
            if (ok) {
              state.likedList = [];
              state.chatHistories = {};
              await saveStorage();
              roche.ui.toast("数据已清空，灵魂关系回到原点。");
              renderInbox();
            }
          });
        }

        // 启动应用
        async function bootApp() {
          await loadStorage();
          await loadRocheContext();
          bindEvents();
          
          renderInbox();
          fetchDailyFortune();

          // 默认空状态，不自动跑Token，让用户手动点击“🚀 重新感应”
          renderNextCard(); 
        }

        bootApp();
      },

      async unmount(container, roche) {
        container.replaceChildren();
      }
    }
  ]
});
