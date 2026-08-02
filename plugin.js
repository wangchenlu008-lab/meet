window.RochePlugin.register({
  id: "soul-meet-app",
  name: "Soul遇见",
  version: "1.0.0",
  apps: [
    {
      id: "soul-meet-main",
      name: "Soul遇见",
      icon: "favorite",
      async mount(container, roche) {
        container.classList.add("soul-meet-container");
        
        // ==========================================
        // 1. 注入现代、极简的 CSS 样式
        // ==========================================
        const style = document.createElement("style");
        style.id = "soul-meet-styles";
        style.textContent = `
          .soul-meet-container {
            width: 100%; height: 100%; display: flex; justify-content: center;
            background: var(--roche-bg-color, #f4f5f7);
            font-family: system-ui, -apple-system, sans-serif;
            color: var(--roche-text-color, #333);
            overflow: hidden;
            position: relative;
          }
          .sm-app {
            width: 100%; max-width: 480px; height: 100%;
            background: var(--roche-panel-bg, #fff);
            display: flex; flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.05);
            position: relative;
          }
          /* 头部 */
          .sm-header {
            padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid var(--roche-border-color, #eee);
            font-weight: bold; font-size: 18px;
            background: var(--roche-panel-bg, #fff);
            z-index: 10;
          }
          .sm-header-btn {
            background: none; border: none; cursor: pointer; color: #888; font-size: 14px;
          }
          /* 视图区 */
          .sm-view {
            flex: 1; overflow-y: auto; display: none; flex-direction: column;
            background: var(--roche-bg-color, #fafafa);
          }
          .sm-view.active { display: flex; }
          /* 底部导航 */
          .sm-nav {
            display: flex; justify-content: space-around; padding: 12px 0;
            border-top: 1px solid var(--roche-border-color, #eee);
            background: var(--roche-panel-bg, #fff);
            padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
          }
          .sm-nav-btn {
            background: none; border: none; font-size: 14px; color: #999;
            display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;
          }
          .sm-nav-btn.active { color: #ff4d6d; font-weight: bold; }
          /* 卡片 UI (发现页) */
          .sm-card-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative; }
          .sm-card {
            width: 100%; max-width: 320px; aspect-ratio: 3/4; background: #fff;
            border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            display: flex; flex-direction: column; overflow: hidden;
            transition: transform 0.3s ease; position: relative; border: 1px solid #eee;
          }
          .sm-card-img { flex: 1; background: #e0e0e0; display:flex; align-items:center; justify-content:center; font-size: 60px; color:#aaa; }
          .sm-card-info { padding: 16px; background: linear-gradient(to top, #fff 80%, transparent); position: absolute; bottom: 0; width: 100%; }
          .sm-card-name { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
          .sm-card-tags { font-size: 12px; color: #ff4d6d; margin-bottom: 8px; font-weight:bold; }
          .sm-card-bio { font-size: 14px; color: #666; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
          .sm-card-type { position:absolute; top:12px; right:12px; background: rgba(0,0,0,0.5); color:#fff; font-size:10px; padding:4px 8px; border-radius:10px; }
          .sm-actions { display: flex; justify-content: center; gap: 24px; margin-top: 20px; }
          .sm-act-btn { width: 60px; height: 60px; border-radius: 50%; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background: #fff; transition: transform 0.1s; }
          .sm-act-btn:active { transform: scale(0.9); }
          .sm-act-pass { color: #8B3A33; } .sm-act-like { color: #ff4d6d; }
          /* 列表 UI (消息页) */
          .sm-list-item { display: flex; padding: 16px; border-bottom: 1px solid #eee; align-items: center; gap: 12px; cursor: pointer; background:#fff;}
          .sm-list-item:hover { background: #fafafa; }
          .sm-list-av { width: 48px; height: 48px; border-radius: 50%; background: #ddd; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:bold; font-size:20px; color:#fff; }
          .sm-list-mid { flex: 1; min-width: 0; }
          .sm-list-name { font-weight: bold; font-size: 16px; margin-bottom: 4px; }
          .sm-list-sub { font-size: 13px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .sm-list-tag { font-size: 10px; border: 1px solid #ff4d6d; color: #ff4d6d; padding: 2px 6px; border-radius: 10px; }
          /* 聊天室 */
          .sm-chat-room { position: absolute; inset: 0; background: #f4f5f7; z-index: 50; display: none; flex-direction: column; }
          .sm-chat-room.open { display: flex; }
          .sm-chat-head { padding: 12px 16px; background: #fff; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; }
          .sm-chat-tools { display: flex; gap: 8px; }
          .sm-tool-btn { background: #f0f0f0; border: none; padding: 6px 10px; border-radius: 12px; font-size: 12px; cursor: pointer; color: #333; }
          .sm-chat-history { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
          .sm-msg { max-width: 80%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
          .sm-msg.me { align-self: flex-end; background: #ff4d6d; color: #fff; border-bottom-right-radius: 4px; }
          .sm-msg.peer { align-self: flex-start; background: #fff; border: 1px solid #eee; border-bottom-left-radius: 4px; }
          .sm-chat-input-area { padding: 12px 16px; background: #fff; border-top: 1px solid #eee; display: flex; gap: 8px; align-items: center; padding-bottom:calc(12px + env(safe-area-inset-bottom, 0px)); }
          .sm-chat-input { flex: 1; padding: 10px 16px; border-radius: 20px; border: 1px solid #ddd; outline: none; font-size: 14px; background:#f9f9f9; }
          .sm-chat-send { background: #ff4d6d; color: #fff; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-weight: bold; }
          /* 其他面板 */
          .sm-panel { padding: 20px; background: #fff; margin: 16px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
          .sm-panel h3 { font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #ff4d6d; display: inline-block; padding-bottom: 4px; }
          .sm-panel p { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 12px; }
          .sm-select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 12px; }
          /* 模态弹窗 */
          .sm-modal-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.5); z-index:100; display:none; align-items:center; justify-content:center; padding: 20px;}
          .sm-modal-overlay.open { display:flex; }
          .sm-modal { background:#fff; width:100%; max-width:340px; border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:12px; }
          .sm-modal textarea { width:100%; height:150px; padding:10px; border:1px solid #ddd; border-radius:8px; resize:none; font-family:inherit; }
          .sm-modal-btns { display:flex; justify-content:flex-end; gap:10px; margin-top:10px; }
          .sm-modal-btn { padding:8px 16px; border:none; border-radius:8px; cursor:pointer; font-weight:bold; }
          .sm-modal-btn.primary { background:#ff4d6d; color:#fff; }
        `;
        container.appendChild(style);

        // ==========================================
        // 2. 构建 DOM 骨架
        // ==========================================
        const appDOM = document.createElement("div");
        appDOM.className = "sm-app";
        appDOM.innerHTML = `
          <div class="sm-header">
            <span>Soul Meet</span>
            <button class="sm-header-btn" id="sm-close-plugin">✕ 退出</button>
          </div>

          <!-- 发现页 -->
          <div class="sm-view active" id="view-discover">
            <div class="sm-card-wrap">
              <div id="sm-deck-container" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; position:relative;">
                <div style="color:#999; font-size:14px; text-align:center;">
                  正在茫茫人海中寻找...<br><br><span id="sm-loading-tip"></span>
                </div>
              </div>
              <div class="sm-actions">
                <button class="sm-act-btn sm-act-pass" id="btn-pass">✖</button>
                <button class="sm-act-btn sm-act-like" id="btn-like">♥</button>
              </div>
            </div>
          </div>

          <!-- 消息页 -->
          <div class="sm-view" id="view-inbox">
            <div class="sm-header" style="background:transparent; border:none;">你的缘分</div>
            <div id="sm-inbox-list" style="flex:1; overflow-y:auto;"></div>
          </div>

          <!-- 运势页 -->
          <div class="sm-view" id="view-daily">
            <div class="sm-panel">
              <h3>✨ 今日交友运势</h3>
              <p id="sm-daily-text">正在感应星象与数据流...</p>
              <button class="sm-modal-btn primary" id="btn-refresh-daily" style="width:100%;">重新测算</button>
            </div>
          </div>

          <!-- 我的页 -->
          <div class="sm-view" id="view-me">
            <div class="sm-panel">
              <h3>👤 基础设置</h3>
              <p>你在 Roche 当前活跃的人设将作为你交友的底色：</p>
              <p style="background:#f4f5f7; padding:10px; border-radius:8px; font-size:13px;" id="sm-my-persona">加载中...</p>
            </div>
            <div class="sm-panel">
              <h3>🌍 世界书挂载</h3>
              <p>选择一个世界观分类，作为你们相遇的背景规则：</p>
              <select id="sm-wb-select" class="sm-select">
                <option value="">(不挂载世界书)</option>
              </select>
            </div>
            <div class="sm-panel">
              <button class="sm-modal-btn" id="btn-clear-data" style="width:100%; background:#ffeeee; color:#d32f2f;">清空交友数据缓存</button>
            </div>
          </div>

          <!-- 底部导航 -->
          <div class="sm-nav">
            <button class="sm-nav-btn active" data-target="view-discover">🌍 发现</button>
            <button class="sm-nav-btn" data-target="view-inbox">💬 消息</button>
            <button class="sm-nav-btn" data-target="view-daily">✨ 运势</button>
            <button class="sm-nav-btn" data-target="view-me">⚙️ 我的</button>
          </div>

          <!-- 聊天室全屏 -->
          <div class="sm-chat-room" id="sm-chat-room">
            <div class="sm-chat-head">
              <button class="sm-header-btn" id="btn-chat-back">← 返回</button>
              <span id="chat-peer-name" style="font-weight:bold;">名字</span>
              <div class="sm-chat-tools">
                <button class="sm-tool-btn" id="btn-chat-persona" style="display:none;" title="让AI丰富档案，方便去主应用捏人">提取人设</button>
                <button class="sm-tool-btn" id="btn-chat-memory" title="AI总结事实，写入主系统记忆库">记忆沉淀</button>
              </div>
            </div>
            <div class="sm-chat-history" id="chat-history"></div>
            <div class="sm-chat-input-area">
              <input type="text" class="sm-chat-input" id="chat-input" placeholder="输入消息，AI将回复你...">
              <button class="sm-chat-send" id="chat-send">➤</button>
            </div>
          </div>

          <!-- 弹窗：展示/复制人设 -->
          <div class="sm-modal-overlay" id="modal-persona">
            <div class="sm-modal">
              <h3 style="margin:0;">✨ 丰富后的人设</h3>
              <p style="font-size:12px; color:#666; margin:0;">你可以复制这段文本，去 Roche 捏一个人。</p>
              <textarea id="modal-persona-text" readonly></textarea>
              <div class="sm-modal-btns">
                <button class="sm-modal-btn" id="btn-close-modal">关闭</button>
              </div>
            </div>
          </div>
        `;
        container.appendChild(appDOM);

        // ==========================================
        // 3. 全局状态与底层 API 封装
        // ==========================================
        const state = {
          deckPool: [],     // 当前待滑的卡片池
          currentCard: null,// 当前展示的卡片
          likedList: [],    // 互相喜欢/匹配成功的列表
          chatHistories: {},// 插件内聊天记录 { "id": [ {role, content} ] }
          myPersona: "",
          worldbooks: [],
          selectedWbId: ""
        };

        // 数据持久化封装
        async function loadStorage() {
          const liked = await roche.storage.get("soul_meet_liked");
          if (liked) state.likedList = liked;
          const chats = await roche.storage.get("soul_meet_chats");
          if (chats) state.chatHistories = chats;
          const settings = await roche.storage.get("soul_meet_settings");
          if (settings && settings.selectedWbId) state.selectedWbId = settings.selectedWbId;
        }
        async function saveStorage() {
          await roche.storage.set("soul_meet_liked", state.likedList);
          await roche.storage.set("soul_meet_chats", state.chatHistories);
          await roche.storage.set("soul_meet_settings", { selectedWbId: state.selectedWbId });
        }

        // 调用 Roche AI 生成 JSON 的工具函数
        async function askAIToJson(systemPrompt, userPrompt) {
          const res = await roche.ai.chat({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.85
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
        // 4. 核心业务逻辑 (加载数据、生成混池卡片、滑动与运势)
        // ==========================================
        
        // 加载 Roche 上下文 (人设与世界书)
        async function loadRocheContext() {
          try {
            // 获取用户激活的人设
            const p = await roche.persona.getActiveUserPersona();
            state.myPersona = p || "一个在虚拟世界里漫游的自由灵魂。";
            document.getElementById('sm-my-persona').textContent = state.myPersona;

            // 获取世界书分类并渲染到下拉框
            const wbs = await roche.worldbook.list();
            state.worldbooks = wbs || [];
            const select = document.getElementById('sm-wb-select');
            select.innerHTML = '<option value="">(不挂载世界书，自由宇宙)</option>';
            state.worldbooks.forEach(wb => {
              const opt = document.createElement('option');
              opt.value = wb.id;
              opt.textContent = wb.name;
              if(wb.id === state.selectedWbId) opt.selected = true;
              select.appendChild(opt);
            });
            
            // 监听世界书切换
            select.addEventListener('change', (e) => {
              state.selectedWbId = e.target.value;
              saveStorage();
              roche.ui.toast("世界观已切换，将影响后续的匹配与聊天");
            });
          } catch(e) {
            console.warn("加载 Roche 上下文失败", e);
          }
        }

        // 生成推荐卡片池 (混合已有角色与AI陌生人)
        async function generateCards() {
          const container = document.getElementById('sm-deck-container');
          container.innerHTML = '<div style="color:#999; text-align:center;">正在茫茫人海中寻找...<br><br>跨越维度同步中✨</div>';
          
          let newCards = [];

          // 1. 从主应用抓取少量已有角色 (Char) 作为彩蛋
          try {
            const chars = await roche.character.list();
            // 过滤掉已经在喜欢列表里的
            const unlikedChars = chars.filter(c => !state.likedList.some(l => l.id === c.id));
            // 随机抽取 1-2 个
            const pickedChars = unlikedChars.sort(() => 0.5 - Math.random()).slice(0, 2);
            for(const c of pickedChars) {
              const fullC = await roche.character.get(c.id);
              newCards.push({
                id: c.id,
                isChar: true,
                name: c.handle || c.name,
                avatar: c.avatar || '',
                bio: fullC.bio || fullC.persona || "这个宇宙里的原住民。",
                tag: "时空羁绊",
                persona: fullC.persona || "",
                match: Math.floor(Math.random() * 10) + 90 // 90-99 契合度
              });
            }
          } catch(e) { 
            console.warn("拉取 Roche 角色失败", e); 
          }

          // 2. 利用 AI 动态生成陌生人
          try {
            // 获取世界书内容作为生成约束
            let wbContext = "";
            if (state.selectedWbId) {
              const entries = await roche.worldbook.getEntries({ categoryId: state.selectedWbId, scope: "global" });
              wbContext = entries.map(e => e.content).join("\n").substring(0, 1000);
            }

            const sysPrompt = `你是灵魂匹配枢纽的 AI 寻人系统。请生成 3 个截然不同的陌生人交友卡片。
输出严格的 JSON 格式：{"cards":[{"id":"唯一小写英文短id","name":"昵称","bio":"一句简短的自我介绍或交友宣言","tag":"四字以内的特征标签如:夜猫子","match":随机80到98的数字,"persona":"给该角色的隐藏详细设定，包括性格、爱好、说话风格，50字左右"}]}。不要任何 markdown 外壳，只输出合法 JSON。`;
            
            let usrPrompt = `当前寻找者的用户人设是：\n${state.myPersona}\n`;
            if (wbContext) usrPrompt += `当前位面的世界观规则：\n${wbContext}\n`;
            usrPrompt += `请生成 3 个能和该用户产生奇妙化学反应、且符合世界观的陌生人。`;

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
            roche.ui.toast("AI 信号微弱，只找到了部分人");
          }

          // 打乱混池并渲染
          state.deckPool = newCards.sort(() => 0.5 - Math.random());
          renderNextCard();
        }

        // 渲染单张滑动卡片
        function renderNextCard() {
          const container = document.getElementById('sm-deck-container');
          if (state.deckPool.length === 0) {
            container.innerHTML = '<div style="color:#999; text-align:center;">附近没有更多人了<br><br><button class="sm-modal-btn primary" id="btn-fetch-more" style="margin-top:20px;">继续寻找</button></div>';
            document.getElementById('btn-fetch-more')?.addEventListener('click', generateCards);
            state.currentCard = null;
            return;
          }

          const card = state.deckPool[0];
          state.currentCard = card;
          const typeBadge = card.isChar 
            ? '<div class="sm-card-type" style="background:#ff4d6d;">已有羁绊</div>' 
            : '<div class="sm-card-type">未知信号</div>';
          
          container.innerHTML = `
            <div class="sm-card" id="sm-active-card">
              ${typeBadge}
              <div class="sm-card-img">${card.avatar ? `<img src="${card.avatar}" style="width:100%;height:100%;object-fit:cover;">` : card.name.substring(0,1)}</div>
              <div class="sm-card-info">
                <div class="sm-card-name">${card.name} <span style="font-size:14px; font-weight:normal; float:right; color:#ff4d6d;">${card.match}% 契合</span></div>
                <div class="sm-card-tags"># ${card.tag}</div>
                <div class="sm-card-bio">${card.bio}</div>
              </div>
            </div>
          `;
        }

        // 处理滑动操作
        function handleSwipe(isLike) {
          if (!state.currentCard) return;
          const card = state.deckPool.shift();
          
          const cardEl = document.getElementById('sm-active-card');
          if (cardEl) {
            cardEl.style.transform = isLike ? 'translateX(150%) rotate(20deg)' : 'translateX(-150%) rotate(-20deg)';
            cardEl.style.opacity = '0';
          }

          if (isLike) {
            if (!state.likedList.some(l => l.id === card.id)) {
              state.likedList.unshift(card);
              saveStorage();
              renderInbox();
              roche.ui.toast(`与 ${card.name} 互相喜欢！`);
            }
          }

          setTimeout(() => {
            renderNextCard();
          }, 250);
        }

        // 获取并测算今日运势
        async function fetchDailyFortune() {
          const el = document.getElementById('sm-daily-text');
          el.textContent = "星盘旋转中，AI 正在测算...";
          try {
            const res = await roche.ai.chat({
              messages: [
                { role: "system", content: "你是一个洞察人心的星象交友占卜师。请根据用户人设，输出一段包含宜、忌，且约80字的今日交友运势。语气要优雅、神婆感但温馨。" },
                { role: "user", content: `我的人设底色是：${state.myPersona}` }
              ],
              temperature: 0.85
            });
            el.innerHTML = res.text.replace(/\n/g, '<br>');
          } catch(e) {
            el.textContent = "星象磁场受到干扰，今日宜顺其自然，跟随直觉去匹配。";
          }
        }
        // ==========================================
        // 5. 聊天室、AI联通、记忆沉淀与人设提取
        // ==========================================

        function renderInbox() {
          const list = document.getElementById('sm-inbox-list');
          list.innerHTML = "";
          if (state.likedList.length === 0) {
            list.innerHTML = '<div style="padding:40px 20px; text-align:center; color:#999; font-size:14px;">还没有遇见那个 Ta<br>快去发现页右滑寻找缘分吧</div>';
            return;
          }
          state.likedList.forEach(u => {
            const item = document.createElement('div');
            item.className = 'sm-list-item';
            const hist = state.chatHistories[u.id] || [];
            const lastMsg = hist.length > 0 ? hist[hist.length-1].content : "刚刚匹配成功，快打个招呼吧~";
            
            item.innerHTML = `
              <div class="sm-list-av">${u.avatar ? `<img src="${u.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : u.name.substring(0,1)}</div>
              <div class="sm-list-mid">
                <div class="sm-list-name">${u.name} <span class="sm-list-tag">${u.isChar ? '剧情角色' : '未知旅人'}</span></div>
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
          
          // 如果是生成的陌生人，显示“提取人设”按钮，否则隐藏
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
            container.innerHTML = `<div style="text-align:center; color:#ccc; font-size:12px; margin-top:20px;">—— 你们在 Soul Meet 相遇了 ——</div>`;
          }

          hist.forEach(msg => {
            const el = document.createElement('div');
            el.className = `sm-msg ${msg.role === 'user' ? 'me' : 'peer'}`;
            el.textContent = msg.content;
            container.appendChild(el);
          });
          container.scrollTop = container.scrollHeight;
        }

        // 发送消息并调用 Roche AI 获取回复
        async function sendMessage() {
          if (!currentPeer) return;
          const input = document.getElementById('chat-input');
          const text = input.value.trim();
          if (!text) return;

          input.value = "";
          
          // 渲染并保存用户消息
          if (!state.chatHistories[currentPeer.id]) state.chatHistories[currentPeer.id] = [];
          state.chatHistories[currentPeer.id].push({ role: 'user', content: text });
          renderChatHistory();
          saveStorage();
          renderInbox();

          const btn = document.getElementById('chat-send');
          btn.textContent = "…";
          btn.disabled = true;

          try {
            // 组装系统 Prompt (人设 + 世界书)
            let sysPrompt = `你现在正在交友软件 "Soul Meet" 上扮演 "${currentPeer.name}" 与我私信聊天。
你的核心隐藏设定：${currentPeer.persona}
我是（和你聊天的人）：${state.myPersona}\n`;

            if (state.selectedWbId) {
              const entries = await roche.worldbook.getEntries({ categoryId: state.selectedWbId, scope: "global" });
              const wbContext = entries.map(e => e.content).join("\n").substring(0, 1000);
              sysPrompt += `\n此处的时空世界观法则：\n${wbContext}\n`;
            }
            
            // 如果是主应用的 Char，尝试拉取一下他的短时记忆让对话连贯
            if (currentPeer.isChar) {
               try {
                 const charData = await roche.character.get(currentPeer.id);
                 if (charData && charData.conversationId) {
                   const msgs = await roche.memory.getShortTerm({ conversationId: charData.conversationId, limit: 8 });
                   if (msgs && msgs.length > 0) {
                     sysPrompt += `\n【主世界近期记忆碎片】（不要生硬复读，作为你们潜意识的关系参考）：\n`;
                     msgs.reverse().forEach(m => {
                       sysPrompt += `${m.senderName || (m.type==='user'?'我':'你')}: ${m.text}\n`;
                     });
                   }
                 }
               } catch(e) {}
            }

            sysPrompt += `\n【回复要求】
1. 完全融入角色，第一人称，口语化，像真人发微信/私信。
2. 绝对不能使用括号包含动作描写（如 *笑* 或 (深吸一口气)），只能输出对话文本！
3. 每条回复限制在 50 字以内，保持对话感。`;

            // 组装历史记录
            const apiMsgs = [{ role: 'system', content: sysPrompt }];
            const hist = state.chatHistories[currentPeer.id];
            // 取最近 12 条避免超长
            const recentHist = hist.slice(-12);
            recentHist.forEach(m => {
              apiMsgs.push({ role: m.role, content: m.content });
            });

            // 调用宿主 AI
            const res = await roche.ai.chat({ messages: apiMsgs, temperature: 0.85 });
            const replyText = res.text.trim().replace(/[\(\*].*?[\)\*]/g, ''); // 做一次简单的去动作兜底

            state.chatHistories[currentPeer.id].push({ role: 'assistant', content: replyText });
            saveStorage();
            renderChatHistory();
            renderInbox();
          } catch(e) {
            roche.ui.toast("AI 暂时走神了，没发出消息");
          } finally {
            btn.textContent = "➤";
            btn.disabled = false;
          }
        }

        // ==========================================
        // 6. 特色功能：提取人设 & 沉淀记忆
        // ==========================================

        // 将陌生人扩展为人设
        async function extractPersona() {
          if (!currentPeer || currentPeer.isChar) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length < 3) {
            roche.ui.toast("聊天太少了，AI 无法分析出完整人设，多聊几句吧！");
            return;
          }

          roche.ui.toast("AI 正在根据你们的聊天丰富 Ta 的人设...");
          const textLog = hist.map(m => (m.role==='user'?'我':'Ta') + ': ' + m.content).join('\n');
          
          const sys = `你是一位专业的小说/剧本角色设定师。请结合该角色最初的基础设定和下方的详细聊天记录，为其扩写撰写一份详尽的、适合给大模型当人设 prompt (Persona) 的档案。
包括：姓名、外貌细节、性格特征、说话风格、经历、以及与"我"在这个交友软件上认识的过程和特殊态度。
直接输出最终文本档案，不需要任何多余的解释。`;
          
          let usr = `【基础设定】\n${currentPeer.persona}\n\n【聊天记录参考】\n${textLog}`;

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
            roche.ui.toast("提取人设失败");
          }
        }

        // 总结聊天并写入主系统记忆库
        async function depositMemory() {
          if (!currentPeer) return;
          const hist = state.chatHistories[currentPeer.id] || [];
          if (hist.length < 4) {
             roche.ui.toast("内容太少，没必要写进记忆库哦~");
             return;
          }

          const confirmed = await roche.ui.confirm({
            title: "沉淀记忆至主系统",
            message: "将让 AI 提取你们在 Soul Meet 的聊天要点，并作为「事实记忆」永久写入 Roche 主记忆库。确定吗？"
          });
          if (!confirmed) return;

          roche.ui.toast("正在提炼重要羁绊...");
          const textLog = hist.map(m => (m.role==='user'?'我':'Ta') + ': ' + m.content).join('\n');
          
          try {
            const res = await roche.ai.chat({
              messages: [
                { role: "system", content: "请根据以下聊天记录，总结出 1 到 2 句关于他们相处的重要事实陈述。要求：简明扼要，第三人称叙述，格式如'用户在交友软件上认识了某某，并约定周末打游戏'。总字数不超过 50 字。" },
                { role: "user", content: textLog }
              ],
              temperature: 0.3
            });
            const fact = res.text.trim();
            
            // 如果是 Char，尝试写入他自己的 conversationId，否则以插件名义虚构一个
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
              when: "在 Soul 遇见",
              where: "虚拟空间",
              source: "plugin"
            });

            roche.ui.toast("✅ 记忆已成功印刻在主系统灵魂深处！");
          } catch(e) {
            roche.ui.toast("记忆写入中断。");
          }
        }

        // ==========================================
        // 7. 绑定事件与初始化加载
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

          // 发现页互动
          document.getElementById('btn-pass').addEventListener('click', () => handleSwipe(false));
          document.getElementById('btn-like').addEventListener('click', () => handleSwipe(true));

          // 运势刷新
          document.getElementById('btn-refresh-daily').addEventListener('click', fetchDailyFortune);

          // 聊天相关
          document.getElementById('btn-chat-back').addEventListener('click', closeChat);
          document.getElementById('chat-send').addEventListener('click', sendMessage);
          document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage();
          });

          // 功能操作
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
              roche.ui.toast("数据已清空，灵魂回到原点。");
              renderInbox();
            }
          });
        }

        // 启动应用
        async function bootApp() {
          await loadStorage();
          await loadRocheContext();
          bindEvents();
          
          // 初始渲染
          renderInbox();
          fetchDailyFortune();

          // 延迟拉取卡片避免卡顿
          setTimeout(() => {
            generateCards();
          }, 300);
        }

        bootApp();
      },

      async unmount(container, roche) {
        container.replaceChildren();
      }
    }
  ]
});
