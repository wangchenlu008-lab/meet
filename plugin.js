window.RochePlugin.register({
  id: "soul-meet-app",
  name: "Soul遇见",
  version: "1.3.0",
  apps: [
    {
      id: "soul-meet-main",
      name: "Soul遇见",
      icon: "favorite",
      async mount(container, roche) {
        container.classList.add("soul-meet-container");
        
        // ==========================================
        // 1. 注入现代、优雅、浅色 Ins 风 CSS 样式
        // ==========================================
        const style = document.createElement("style");
        style.id = "soul-meet-styles";
        style.textContent = `
          .soul-meet-container {
            width: 100%; height: 100%; display: flex; justify-content: center;
            background: #fbfbfd; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #333; overflow: hidden; position: relative;
          }
          /* 背景氛围光晕 */
          .sm-bg-blobs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
          .sm-blob { position: absolute; filter: blur(80px); opacity: 0.5; border-radius: 50%; }
          .sm-blob-1 { top: -10%; left: -10%; width: 350px; height: 350px; background: #ffccd5; }
          .sm-blob-2 { bottom: -10%; right: -10%; width: 300px; height: 300px; background: #c8b6ff; }
          .sm-blob-3 { top: 40%; right: -20%; width: 250px; height: 250px; background: #ffe4b5; }

          .sm-app {
            width: 100%; max-width: 480px; height: 100%;
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            display: flex; flex-direction: column;
            box-shadow: 0 0 30px rgba(0,0,0,0.03); position: relative; z-index: 1;
          }
          /* 头部 */
          .sm-header {
            padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 700; font-size: 18px;
            background: transparent; z-index: 10; letter-spacing: 0.5px;
          }
          .sm-header-btn { background: none; border: none; cursor: pointer; color: #888; font-size: 14px; font-weight: 500; transition: color 0.2s;}
          .sm-header-btn:hover { color: #333; }
          /* 视图区 */
          .sm-view { flex: 1; overflow-y: auto; display: none; flex-direction: column; }
          .sm-view.active { display: flex; }
          /* 底部导航 */
          .sm-nav {
            display: flex; justify-content: space-around; padding: 14px 0;
            border-top: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.8);
            padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
          }
          .sm-nav-btn {
            background: none; border: none; font-size: 12px; color: #a0a0a0;
            display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s;
          }
          .sm-nav-btn i { font-size: 20px; font-style: normal; }
          .sm-nav-btn.active { color: #ff6b81; font-weight: 600; transform: translateY(-2px); }
          
          /* 卡片 UI (发现页) - 优化绝美样式及滑动相关 */
          .sm-card-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden; }
          .sm-card {
            width: 100%; max-width: 330px; aspect-ratio: 3/4.2; background: #fff;
            border-radius: 28px; box-shadow: 0 15px 35px rgba(0,0,0,0.08);
            display: flex; flex-direction: column; overflow: hidden;
            position: relative; border: 1px solid rgba(255,255,255,0.5);
            z-index: 2; cursor: grab; transform-origin: 50% 100%;
          }
          .sm-card.dragging { cursor: grabbing; transition: none; }
          .sm-card:not(.dragging) { transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease; }
          
          .sm-card-img { flex: 1; background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); display:flex; align-items:center; justify-content:center; font-size: 70px; color:#ddd; pointer-events: none;}
          .sm-card-info { padding: 24px 20px; background: linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0)); position: absolute; bottom: 0; width: 100%; pointer-events: none;}
          .sm-card-name { font-size: 24px; font-weight: 800; margin-bottom: 6px; color: #222; display: flex; justify-content: space-between; align-items: center;}
          .sm-card-match { font-size: 14px; font-weight: 700; color: #ff6b81; background: #fff0f3; padding: 4px 10px; border-radius: 12px; }
          .sm-card-tags { font-size: 13px; color: #a29bfe; margin-bottom: 10px; font-weight:600; display: flex; gap: 6px; flex-wrap: wrap;}
          .sm-card-tag { background: #f3f0ff; padding: 4px 10px; border-radius: 10px; }
          .sm-card-bio { font-size: 14.5px; color: #555; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
          .sm-card-type { position:absolute; top:16px; right:16px; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); color:#fff; font-size:11px; font-weight: 600; padding:6px 12px; border-radius:14px; letter-spacing: 1px;}
          
          /* 操作按钮 */
          .sm-actions { display: flex; justify-content: center; gap: 30px; margin-top: 24px; z-index: 2; }
          .sm-act-btn { width: 64px; height: 64px; border-radius: 50%; border: none; font-size: 26px; cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.06); background: #fff; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center;}
          .sm-act-btn:active { transform: scale(0.85); }
          .sm-act-pass { color: #a4b0be; } .sm-act-like { color: #ff6b81; }

          /* 空状态 & 按钮 */
          .sm-empty-state { text-align:center; z-index:2; display: flex; flex-direction: column; align-items: center; justify-content: center;}
          .sm-btn-primary { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); color: #fff; border: none; padding: 12px 24px; border-radius: 20px; font-weight: 600; font-size: 15px; cursor: pointer; box-shadow: 0 6px 15px rgba(255, 154, 158, 0.3); transition: transform 0.2s;}
          .sm-btn-primary:active { transform: scale(0.95); }
          .sm-btn-outline { background: #fff; color: #555; border: 1px solid #ddd; padding: 12px 24px; border-radius: 20px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
          .sm-btn-outline:active { transform: scale(0.95); background: #f9f9f9; }

          /* 列表 UI (消息页) */
          .sm-list-item { display: flex; padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.03); align-items: center; gap: 14px; cursor: pointer; transition: background 0.2s; margin: 0 8px; border-radius: 16px;}
          .sm-list-item:hover { background: rgba(255,255,255,0.8); }
          .sm-list-av { width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:bold; font-size:22px; color:#fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);}
          .sm-list-mid { flex: 1; min-width: 0; }
          .sm-list-name { font-weight: 700; font-size: 16px; margin-bottom: 6px; color: #222;}
          .sm-list-sub { font-size: 13.5px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .sm-list-tag { font-size: 10px; border: 1px solid #ff6b81; color: #ff6b81; padding: 2px 8px; border-radius: 12px; margin-left: 6px; font-weight: 600;}
          
          /* 聊天室 */
          .sm-chat-room { position: absolute; inset: 0; background: #fbfbfd; z-index: 50; display: none; flex-direction: column; }
          .sm-chat-room.open { display: flex; }
          .sm-chat-head { padding: 12px 16px; background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; z-index: 10;}
          .sm-chat-tools { display: flex; gap: 8px; }
          .sm-tool-btn { background: #fff; border: 1px solid #eee; padding: 6px 12px; border-radius: 16px; font-size: 12px; cursor: pointer; color: #555; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.02);}
          .sm-chat-history { flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; }
          .sm-msg { max-width: 75%; padding: 12px 16px; border-radius: 20px; font-size: 14.5px; line-height: 1.5; white-space: pre-wrap; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
          .sm-msg.me { align-self: flex-end; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #fff; border-bottom-right-radius: 4px; border: none;}
          .sm-msg.peer { align-self: flex-start; background: #fff; border: 1px solid #f0f0f0; border-bottom-left-radius: 4px; color: #333;}
          .sm-chat-input-area { padding: 12px 16px; background: #fff; border-top: 1px solid rgba(0,0,0,0.05); display: flex; gap: 10px; align-items: center; padding-bottom:calc(12px + env(safe-area-inset-bottom, 0px)); }
          .sm-chat-input { flex: 1; padding: 12px 18px; border-radius: 24px; border: 1px solid #eee; outline: none; font-size: 14.5px; background:#f9f9f9; transition: border 0.2s;}
          .sm-chat-input:focus { border-color: #ffb8b8; background: #fff; }
          .sm-chat-send { background: #ff6b81; color: #fff; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 18px; box-shadow: 0 4px 10px rgba(255, 107, 129, 0.3);}
          
          /* 其他面板、偏好与世界书多选 */
          .sm-panel { padding: 24px; background: #fff; margin: 16px; border-radius: 24px; box-shadow: 0 8px 20px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.02);}
          .sm-panel h3 { font-size: 17px; margin-bottom: 16px; color: #222; font-weight: 800; }
          .sm-panel p { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 16px; }
          .sm-chip-container { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;}
          .sm-chip { display: inline-block; padding: 8px 14px; border-radius: 20px; border: 1px solid #eee; font-size: 13px; cursor: pointer; transition: all 0.2s; background: #fafafa; color: #666; font-weight: 500;}
          .sm-chip.selected { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); border-color: transparent; color: #fff; font-weight: 700; box-shadow: 0 4px 10px rgba(161, 140, 209, 0.3);}
          .sm-pref-chip.selected { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); box-shadow: 0 4px 10px rgba(255, 154, 158, 0.3);}

          /* 模态弹窗 */
          .sm-modal-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index:100; display:none; align-items:center; justify-content:center; padding: 20px;}
          .sm-modal-overlay.open { display:flex; }
          .sm-modal { background:#fff; width:100%; max-width:340px; border-radius:24px; padding:24px; display:flex; flex-direction:column; gap:16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);}
          .sm-modal textarea { width:100%; height:180px; padding:14px; border:1px solid #eee; border-radius:16px; resize:none; font-family:inherit; background: #fcfcfc; font-size: 14px; line-height: 1.5; color: #444;}
          .sm-modal textarea:focus { outline: none; border-color: #dcdde1; }
          .sm-modal-btns { display:flex; justify-content:flex-end; gap:12px; margin-top:8px; }
          .sm-modal-btn { padding:10px 20px; border:none; border-radius:16px; cursor:pointer; font-weight:700; font-size:14px; transition: transform 0.2s;}
          .sm-modal-btn:active { transform: scale(0.95); }
          .sm-modal-btn.primary { background:#ff6b81; color:#fff; box-shadow: 0 4px 10px rgba(255, 107, 129, 0.3); }
          .sm-modal-btn.secondary { background:#f1f2f6; color:#555; }
        `;
        container.appendChild(style);

        // ==========================================
        // 2. 构建 DOM 骨架 (增加偏好选择面板)
        // ==========================================
        const appDOM = document.createElement("div");
        appDOM.className = "sm-app";
        appDOM.innerHTML = `
          <!-- 氛围背景 -->
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
            <div class="sm-card-wrap" id="sm-deck-container">
              <!-- 空状态与卡片将在这里渲染 -->
            </div>
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
              <p id="sm-daily-text" style="color:#444; font-size:14.5px;">正在感应星象与多元数据流...</p>
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
              <div id="sm-pref-list" class="sm-chip-container">
                <!-- 偏好标签动态生成 -->
              </div>
            </div>

            <div class="sm-panel">
              <h3>🌍 宇宙设定 (多选)</h3>
              <p>勾选世界书，你会遇到对应背景下活生生的人：</p>
              <div id="sm-wb-list" class="sm-chip-container">
                 <div style="font-size:13px; color:#aaa;">正在检索世界线...</div>
              </div>
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

          <!-- 聊天室全屏 -->
          <div class="sm-chat-room" id="sm-chat-room">
            <div class="sm-chat-head">
              <button class="sm-header-btn" id="btn-chat-back">←</button>
              <span id="chat-peer-name" style="font-weight:800; font-size:16px;">名字</span>
              <div class="sm-chat-tools">
                <button class="sm-tool-btn" id="btn-chat-persona" style="display:none;" title="生成档案，带走去主应用">提取人设</button>
                <button class="sm-tool-btn" id="btn-chat-memory" title="总结羁绊，印刻进主应用记忆库">沉淀记忆</button>
              </div>
            </div>
            <div class="sm-chat-history" id="chat-history"></div>
            <div class="sm-chat-input-area">
              <input type="text" class="sm-chat-input" id="chat-input" placeholder="输入消息，随时开聊...">
              <button class="sm-chat-send" id="chat-send">➤</button>
            </div>
          </div>

          <!-- 弹窗：展示/复制人设 -->
          <div class="sm-modal-overlay" id="modal-persona">
            <div class="sm-modal">
              <h3 style="margin:0; font-size:18px;">✨ 灵魂档案</h3>
              <p style="font-size:13px; color:#888; margin:0;">已根据聊天丰富了细节。复制后，去 Roche 主页面创建一个新角色吧！</p>
              <textarea id="modal-persona-text" readonly></textarea>
              <div class="sm-modal-btns">
                <button class="sm-modal-btn secondary" id="btn-close-modal">关闭</button>
              </div>
            </div>
          </div>
        `;
        container.appendChild(appDOM);
        // ==========================================
        // 3. 全局状态、多世界书存储与底层 API 封装
        // ==========================================
        const state = {
          deckPool: [],     // 当前待滑的卡片池
          passedDeck: [],   // 左滑错过的卡片（后悔药池）
          currentCard: null,
          likedList: [],    
          chatHistories: {},
          myPersona: "",
          worldbooks: [],
          selectedWbIds: [], // 多选世界书ID数组
          selectedPrefs: []  // 用户在偏好面板选择的标签
        };

        const PREFERENCE_TAGS = ["幽默风趣", "温柔体贴", "高冷傲娇", "反差萌", "事业狂", "艺术家", "病娇", "直球克星", "爹系/妈系", "话痨"];

        async function loadStorage() {
          const liked = await roche.storage.get("soul_meet_liked");
          if (liked) state.likedList = liked;
          const chats = await roche.storage.get("soul_meet_chats");
          if (chats) state.chatHistories = chats;
          const settings = await roche.storage.get("soul_meet_settings");
          if (settings) {
            if (Array.isArray(settings.selectedWbIds)) state.selectedWbIds = settings.selectedWbIds;
            if (Array.isArray(settings.selectedPrefs)) state.selectedPrefs = settings.selectedPrefs;
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
            temperature: 0.95 // 调高一点，增加随机性和活泼感
          });
          if (!res || !res.text) throw new Error("AI没有返回内容");
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
        // 4. 加载上下文与生成卡片 (增加偏好干预与纯滑动机制)
        // ==========================================
        
        async function loadRocheContext() {
          try {
            // 1. 获取用户活跃人设
            const p = await roche.persona.getActiveUserPersona();
            state.myPersona = p || "一个期待在灵魂网络里遇见共鸣的人。";
            document.getElementById('sm-my-persona').textContent = state.myPersona;

            // 2. 渲染偏好多选面板
            const prefListEl = document.getElementById('sm-pref-list');
            prefListEl.innerHTML = '';
            PREFERENCE_TAGS.forEach(tag => {
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

            // 3. 获取世界书分类并渲染为多选 Chip
            const wbs = await roche.worldbook.list();
            state.worldbooks = wbs || [];
            const wbListEl = document.getElementById('sm-wb-list');
            wbListEl.innerHTML = '';
            
            if(state.worldbooks.length === 0) {
              wbListEl.innerHTML = '<span style="color:#aaa; font-size:13px;">宿主暂无世界书，将在自由宇宙中匹配。</span>';
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

        // 生成推荐卡片池 (混合少量已有角色与大量鲜活AI陌生人)
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

          // 1. 从主应用抓取已有角色 (只占极小比例)
          try {
            const chars = await roche.character.list();
            const unlikedChars = chars.filter(c => !state.likedList.some(l => l.id === c.id));
            const pickedChars = unlikedChars.sort(() => 0.5 - Math.random()).slice(0, 1);
            for(const c of pickedChars) {
              const fullC = await roche.character.get(c.id);
              newCards.push({
                id: c.id,
                isChar: true,
                name: c.handle || c.name,
                avatar: c.avatar || '',
                bio: fullC.bio || fullC.persona || "主世界原住民。",
                tag: "剧情熟人",
                persona: fullC.persona || "",
                match: Math.floor(Math.random() * 10) + 90
              });
            }
          } catch(e) {}

          // 2. 结合多世界书和偏好，批量生成鲜活的 AI 陌生人 (一次生成6~8个)
          try {
            let wbContext = "";
            if (state.selectedWbIds.length > 0) {
              for (const wid of state.selectedWbIds) {
                const entries = await roche.worldbook.getEntries({ categoryId: wid, scope: "global" });
                wbContext += entries.map(e => e.content).join("\n") + "\n";
              }
              wbContext = wbContext.substring(0, 1500); 
            }

            let prefContext = state.selectedPrefs.length > 0 
              ? `请重点生成带有以下特征的人：【${state.selectedPrefs.join("、")}】。` 
              : "生成随机不同类型的有趣人物。";

            const sysPrompt = `你是跨维度交友匹配系统。请一次性生成 6 到 8 个截然不同、极具"活人感"的交友卡片。
要求：
1. 身份极端多样：现代都市社畜、高冷学霸、微服私访的皇帝、落魄明星、跨界魔法师、腹黑霸总、或者是普通但有趣的网游大神等，不要局限于提示词！只要是人类即可！
2. "活人感"：bio(交友宣言)必须像真人在用交友软件，可以带点情绪、吐槽、甚至小傲娇，不要客气，不要像AI客服。
3. ${prefContext}
4. 输出严格的 JSON 格式：{"cards":[{"id":"唯一小写短id","name":"名字/网名","bio":"极具个性的活人感交友宣言","tag":"四字以内的特征标签(如:糊弄学大师)","match":随机70到99,"persona":"隐藏详细设定，包含极具个性的说话风格与背景，用于后续对话，约80字"}]}。
不要输出任何 Markdown 外壳，只输出纯 JSON。`;
            
            let usrPrompt = `我的灵魂底色：\n${state.myPersona}\n`;
            if (wbContext) usrPrompt += `允许穿越的世界观规则（小概率触发跨世界）：\n${wbContext}\n`;
            usrPrompt += `请生成 6 到 8 个活生生的、甚至可能有缺点的人类。`;

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
            roche.ui.toast("宇宙频段波动，仅捕捉到微弱信号");
          }

          state.deckPool = newCards.sort(() => 0.5 - Math.random());
          renderNextCard();
        }

        // 渲染单张卡片及手势滑动挂载
        function renderNextCard() {
          const container = document.getElementById('sm-deck-container');
          const actions = document.getElementById('sm-card-actions');
          
          if (state.deckPool.length === 0) {
            actions.style.display = 'none';
            let html = `
              <div class="sm-empty-state">
                <div style="font-size:32px; margin-bottom:12px;">🌟</div>
                <div style="color:#888; font-size:14px; margin-bottom: 24px;">这一批卡片已经看完了</div>`;
            
            // 如果有错过的卡片，显示后悔药按钮
            if (state.passedDeck.length > 0) {
              html += `<button class="sm-btn-outline" id="btn-rewind" style="margin-bottom:16px; width:100%;">🔙 重新查看错过的 Ta</button>`;
            }
            html += `<button class="sm-btn-primary" id="btn-fetch-more" style="width:100%;">🚀 重新感应新批次</button></div>`;
            
            container.innerHTML = html;
            
            document.getElementById('btn-fetch-more')?.addEventListener('click', generateCards);
            document.getElementById('btn-rewind')?.addEventListener('click', () => {
               // 启动后悔药：将 pass 掉的卡重新放回卡池
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

          // 重新绑定手势滑动
          bindCardSwipe(document.getElementById('sm-active-card'));
        }

        // ==========================================
        // 手势滑动逻辑 (完美还原探探/Tinder滑动感)
        // ==========================================
        function bindCardSwipe(el) {
          if (!el) return;
          el.style.touchAction = 'none';
          let startX = 0, startY = 0, isDragging = false;

          const onMove = (e) => {
            if (!isDragging) return;
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);
            const deltaX = x - startX;
            const deltaY = y - startY;
            const rotate = deltaX * 0.05; // 随位移旋转
            
            el.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
            
            // 可以通过透明度等特效暗示喜欢/不喜欢，这里简单缩放
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
              // 没滑到阈值，回弹
              el.style.transform = `translate(0px, 0px) rotate(0deg)`;
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

        // 处理卡片滑出动作与状态结算
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
            // 喜欢，如果不在列表则加入
            if (!state.likedList.some(l => l.id === card.id)) {
              state.likedList.unshift(card);
              saveStorage();
              renderInbox();
              roche.ui.toast(`成功与 ${card.name} 建立联系！`);
            }
          } else {
            // 不喜欢，加入后悔药池
            state.passedDeck.push(card);
          }

          // 短暂延迟后渲染下一张
          setTimeout(() => {
            renderNextCard();
          }, 300);
        }
        // ==========================================
        // 5. 运势测算与聊天室 (极强活人感 AI 对话)
        // ==========================================

        // 获取并测算今日运势
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

        // 渲染消息列表
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
            item.onclick = () => openChat(u);
            list.appendChild(item);
          });
        }
        
        let currentPeer = null;

        function openChat(peer) {
          currentPeer = peer;
          document.getElementById('chat-peer-name').textContent = peer.name;
          
          // 如果是生成的陌生人，显示“提取人设”按钮以供复制
          document.getElementById('btn-chat-persona').style.display = peer.isChar ? "none" : "block";

          renderChatHistory();
          document.getElementById('sm-chat-room').classList.add('open');
        }

        function closeChat() {
          currentPeer = null;
          document.getElementById('sm-chat-room').classList.remove('open');
        }

        function renderChatHistory() {
          const container = document.getElementById('chat-history');
          container.innerHTML = "";
          const hist = state.chatHistories[currentPeer.id] || [];
          
          if (hist.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#ccc; font-size:12px; margin-top:20px;">—— 你们在 Soul Meet 的初次对话 ——</div>`;
          }

          hist.forEach(msg => {
            const el = document.createElement('div');
            el.className = `sm-msg ${msg.role === 'user' ? 'me' : 'peer'}`;
            el.textContent = msg.content;
            container.appendChild(el);
          });
          container.scrollTop = container.scrollHeight;
        }

        // 发送消息并调用 Roche AI 获取极具“活人感”的回复
        async function sendMessage() {
          if (!currentPeer) return;
          const input = document.getElementById('chat-input');
          const text = input.value.trim();
          if (!text) return;

          input.value = "";
          
          if (!state.chatHistories[currentPeer.id]) state.chatHistories[currentPeer.id] = [];
          state.chatHistories[currentPeer.id].push({ role: 'user', content: text });
          renderChatHistory();
          saveStorage();
          renderInbox();

          const btn = document.getElementById('chat-send');
          btn.textContent = "…";
          btn.disabled = true;

          try {
            // 构建强大且要求严格的活人感 System Prompt
            let sysPrompt = `你正在交友软件 "Soul Meet" 上以文字私信的方式与我聊天。
你的核心身份是：「${currentPeer.name}」。
你的内心详细设定：${currentPeer.persona}
我是和你聊天的人，我的人设底色是：${state.myPersona}\n`;

            if (state.selectedWbIds.length > 0) {
              let wbContext = "";
              for (const wid of state.selectedWbIds) {
                const entries = await roche.worldbook.getEntries({ categoryId: wid, scope: "global" });
                wbContext += entries.map(e => e.content).join("\n") + "\n";
              }
              sysPrompt += `\n【当前所处宇宙的常识法则】\n${wbContext.substring(0, 800)}\n请在聊天时自然体现你活在这个世界里，但绝对不要像在做科普，你只是个活在这个世界里的普通人。`;
            }
            
            // 联通已有角色的记忆
            if (currentPeer.isChar) {
               try {
                 const charData = await roche.character.get(currentPeer.id);
                 if (charData && charData.conversationId) {
                   const msgs = await roche.memory.getShortTerm({ conversationId: charData.conversationId, limit: 8 });
                   if (msgs && msgs.length > 0) {
                     sysPrompt += `\n【主世界近期记忆潜意识】(作为关系参考，不要生硬复述)：\n`;
                     msgs.reverse().forEach(m => {
                       sysPrompt += `${m.senderName || (m.type==='user'?'我':'你')}: ${m.text}\n`;
                     });
                   }
                 }
               } catch(e) {}
            }

            sysPrompt += `\n【最高指令：活人感规范】
1. 你是一个有喜怒哀乐的【真实人类/角色】，不是AI，不是客服！必须完全沉浸。
2. 说话口语化，像发微信/打字一样，可以使用少量的网络用语，甚至可以敷衍、吐槽、装高冷，完全遵循你的人设脾气！
3. 绝对禁止使用括号或星号进行动作和神态描写（如：*笑*、(喝口茶)、[挑眉]）。只能输出纯对话文本。
4. 每次回复限制在 40 字以内。不要急于推动剧情，像真人一样一句一句聊。`;

            const apiMsgs = [{ role: 'system', content: sysPrompt }];
            const hist = state.chatHistories[currentPeer.id];
            // 取最近 15 条
            hist.slice(-15).forEach(m => {
              apiMsgs.push({ role: m.role, content: m.content });
            });

            const res = await roche.ai.chat({ messages: apiMsgs, temperature: 0.95 });
            const replyText = res.text.trim().replace(/[\(\[\*].*?[\)\]\*]/g, ''); // 兜底剔除动作描写

            state.chatHistories[currentPeer.id].push({ role: 'assistant', content: replyText });
            saveStorage();
            renderChatHistory();
            renderInbox();
          } catch(e) {
            roche.ui.toast("对方的网络似乎断开了，消息未送达");
          } finally {
            btn.textContent = "➤";
            btn.disabled = false;
          }
        }

        // ==========================================
        // 6. 特色闭环：提取人设 & 沉淀记忆至 Roche
        // ==========================================

        // 将有趣陌生人扩展为人设档案并供用户复制
        async function extractPersona() {
          if (!currentPeer || currentPeer.isChar) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length < 3) {
            roche.ui.toast("聊得太少了，多聊几句让 AI 更好地捕捉 Ta 的灵魂吧！");
            return;
          }

          roche.ui.toast("AI 正在根据你们的羁绊撰写灵魂档案...");
          const textLog = hist.map(m => (m.role==='user'?'我':'Ta') + ': ' + m.content).join('\n');
          
          const sys = `你是一位顶级的小说/剧本角色设定师。请结合该角色最初的基础设定和下方的聊天记录，为其撰写一份详尽的、充满魅力的、适合直接复制给大模型当人设 prompt (Persona) 的档案。
档案需包括：姓名/称呼、外貌气质、性格剖析、核心说话风格口癖、神秘过往、以及对"我"的特殊态度。
无需说多余废话，直接输出高质量档案文本。`;
          
          let usr = `【最初设定】\n${currentPeer.persona}\n\n【实际聊天表现参考】\n${textLog}`;

          try {
            const res = await roche.ai.chat({
              messages: [
                { role: "system", content: sys },
                { role: "user", content: usr }
              ],
              temperature: 0.7
            });
            
            document.getElementById('modal-persona-text').value = res.text.trim();
            document.getElementById('modal-persona').classList.add('open');
          } catch(e) {
            roche.ui.toast("提取灵魂档案失败");
          }
        }

        // 总结聊天并写入 Roche 主系统记忆库
        async function depositMemory() {
          if (!currentPeer) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length < 4) {
             roche.ui.toast("你们的故事才刚刚开始，晚点再记录吧~");
             return;
          }

          const confirmed = await roche.ui.confirm({
            title: "印刻至主世界记忆库",
            message: "将让 AI 提取你们在 Soul Meet 的聊天要点，并作为「事实记忆」永久写入 Roche 主记忆库。确定吗？"
          });
          if (!confirmed) return;

          roche.ui.toast("正在提炼重要羁绊...");
          const textLog = hist.map(m => (m.role==='user'?'我':'Ta') + ': ' + m.content).join('\n');
          
          try {
            const res = await roche.ai.chat({
              messages: [
                { role: "system", content: "请根据以下聊天记录，总结出 1 到 2 句关于他们之间最重要的羁绊或事实陈述。简明扼要，第三人称叙述，格式如'用户在虚拟交友中认识了某某，并约定周末打游戏'。总字数不超过 50 字。" },
                { role: "user", content: textLog }
              ],
              temperature: 0.3
            });
            const fact = res.text.trim();
            
            // 写入记忆 (如果是主世界Char，写回他自己的会话，否则写回专属虚构会话)
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
        // 7. 绑定事件与初始化生命周期
        // ==========================================

        function bindEvents() {
          // 退出应用
          document.getElementById('sm-close-plugin').addEventListener('click', () => roche.ui.closeApp());

          // 导航切换
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

          // 发现页按钮 (防止手势不好操作时的点击备用)
          document.getElementById('btn-pass')?.addEventListener('click', () => handleSwipeAction(false));
          document.getElementById('btn-like')?.addEventListener('click', () => handleSwipeAction(true));

          // 运势刷新
          document.getElementById('btn-refresh-daily').addEventListener('click', fetchDailyFortune);

          // 聊天室事件
          document.getElementById('btn-chat-back').addEventListener('click', closeChat);
          document.getElementById('chat-send').addEventListener('click', sendMessage);
          document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage();
          });

          // 记忆沉淀与人设提取
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

          // 用户要求不自动生成，因此直接渲染空状态，让用户手动点击“感应”
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
