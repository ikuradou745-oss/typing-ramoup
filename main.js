<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>NEON TYPING - ネオンタイピングゲーム</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }

        body {
            min-height: 100vh;
            background: radial-gradient(circle at center, #0a0f1e 0%, #03060c 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', 'Poppins', 'Courier New', monospace;
            padding: 20px;
        }

        /* メインゲームコンテナ */
        .game-container {
            width: 1200px;
            max-width: 95vw;
            background: rgba(10, 20, 30, 0.65);
            backdrop-filter: blur(4px);
            border-radius: 56px;
            padding: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
            border: 1px solid rgba(0,255,255,0.3);
            transition: all 0.2s;
        }

        /* 共通ボタンネオンスタイル */
        .neon-btn {
            background: rgba(0,0,0,0.6);
            border: 2px solid #0ff;
            color: #0ff;
            font-weight: bold;
            font-size: 1.2rem;
            padding: 12px 28px;
            border-radius: 60px;
            cursor: pointer;
            transition: 0.2s;
            text-shadow: 0 0 5px #0ff;
            box-shadow: 0 0 8px rgba(0,255,255,0.3);
            font-family: inherit;
        }
        .neon-btn:hover {
            background: #0ff22a;
            color: black;
            box-shadow: 0 0 18px cyan;
            border-color: white;
            transform: scale(1.02);
        }

        /* ステータスバー (右上) */
        .status-bar {
            position: fixed;
            top: 20px;
            right: 30px;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(8px);
            padding: 12px 24px;
            border-radius: 48px;
            display: flex;
            gap: 28px;
            z-index: 200;
            border: 1px solid cyan;
            font-family: monospace;
            font-weight: bold;
            font-size: 1.3rem;
        }
        .stat-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #ffd966;
            text-shadow: 0 0 3px gold;
        }
        .xp-bar-bg {
            width: 120px;
            height: 12px;
            background: #333;
            border-radius: 20px;
            overflow: hidden;
        }
        .xp-fill {
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #0ff, #f0f);
            border-radius: 20px;
        }

        /* ホーム画面メニューグリッド */
        .menu-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 25px;
            margin: 50px 0;
        }
        .menu-card {
            background: rgba(0,0,0,0.7);
            width: 180px;
            padding: 24px 12px;
            text-align: center;
            border-radius: 40px;
            border: 1px solid #0ff;
            cursor: pointer;
            transition: all 0.2s;
        }
        .menu-card h3 {
            color: #0ff;
            font-size: 1.6rem;
        }

        /* タイピングエリア */
        .typing-area {
            text-align: center;
            padding: 20px;
        }
        .question-word {
            font-size: 4rem;
            letter-spacing: 6px;
            background: rgba(0,0,0,0.5);
            padding: 30px;
            border-radius: 70px;
            margin-bottom: 30px;
            font-weight: bold;
            color: cyan;
            text-shadow: 0 0 12px magenta;
        }
        .input-field {
            font-size: 2rem;
            padding: 12px 24px;
            width: 80%;
            text-align: center;
            background: #111;
            border: 3px solid #0ff;
            color: #0ff;
            border-radius: 60px;
            font-family: monospace;
        }
        .score-board {
            display: flex;
            justify-content: center;
            gap: 48px;
            margin: 20px;
            font-size: 1.8rem;
            color: #ffcc44;
        }
        .timer {
            font-size: 2.5rem;
            font-weight: bold;
            background: #000000aa;
            display: inline-block;
            padding: 8px 24px;
            border-radius: 40px;
        }

        /* 妨害オーバーレイ */
        .interference {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 500;
            transition: opacity 1.5s ease-out;
        }
        .paint-ball {
            background: radial-gradient(circle, rgba(255,0,200,0.9), rgba(0,255,200,0.7));
            width: 100%;
            height: 100%;
            mix-blend-mode: overlay;
        }
        .thunder {
            background: repeating-linear-gradient(45deg, yellow, orange, red);
            animation: flash 0.2s infinite;
        }
        @keyframes flash {
            0% { opacity: 0.9; }
            100% { opacity: 0.3; }
        }

        .skill-overlay {
            position: fixed;
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: gold;
            padding: 12px 32px;
            border-radius: 60px;
            font-weight: bold;
            font-size: 1.8rem;
            z-index: 300;
            animation: fadeUp 0.6s;
        }
        @keyframes fadeUp {
            from { opacity: 0; bottom: 20%;}
            to { opacity: 1; bottom: 30%;}
        }
        /* 設定パネル */
        .settings-panel {
            background: #111;
            padding: 24px;
            border-radius: 48px;
            margin-top: 20px;
        }
        select, input[type="range"] {
            padding: 8px;
            margin: 10px;
            border-radius: 30px;
            background: #222;
            color: cyan;
        }
        .flex-row {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            align-items: center;
        }
        h1 {
            text-align: center;
            color: cyan;
            text-shadow: 0 0 12px magenta;
        }
        button {
            background: none;
            border: none;
        }
    </style>
</head>
<body>
<div id="app-root" class="game-container"></div>

<script>
    // ---------- データ定義 ----------
    const WORD_SETS = {
        easy: [
            "さくら","ねこ","いぬ","ごはん","みず","おちゃ","えき","うみ","ゆめ","とり",
            "あめ","くも","はな","そら","つき","ほし","やま","かわ","ほん","ゆき"
        ],
        medium: [
            "おたんじょうび","しんかんせん","ゆうびんきょく","ありがとう","おめでとう",
            "いってきます","ただいま","おやすみなさい","ともだち","がっこう","せんせい",
            "あさごはん","にほんご","べんきょう","にちようび"
        ],
        hard: [
            "よろしくおねがいします","おつかれさまでした","ありがとうございます","しょうしょうおまちください",
            "ごめんなさい","いらっしゃいませ","いただきます","ごちそうさまでした","お会いできてうれしいです",
            "またあしたあいましょう","ゆっくりはなしてください","もういちどおしえてください","こまっている人をたすけます",
            "いっしょうけんめいがんばる","きょうはいい天気ですね"
        ]
    };
    // ローマ字変換マップ簡易 (ゲーム内では直接ひらがなと入力比較のため、平仮名入力で判定)
    // タイピングはひらがな入力として判定 (日本語IMe想定だが、文字列比較)
    // 平仮名同士で比較する

    let player = {
        level: 1,
        xp: 0,
        coins: 0,
        equippedSkill: null,   // スキルID
        unlockedSkills: []     // 購入orストーリー取得スキルID
    };
    // スキルマスタリ
    const SKILLS = {
        "auto_alpha": {name:"自動入力α", price:50000, cooldown:30, effect:"auto", duration:4.5, frames:64},
        "combo_alpha": {name:"コンボアップα", price:50000, cooldown:30, effect:"comboBoost", duration:5, mult:1.5},
        "time_alpha": {name:"時間アップα", price:50000, cooldown:45, effect:"timeMinigame"},
        "auto_gamma": {name:"自動入力γ", price:500000, cooldown:35, effect:"auto", duration:7.5, frames:64},
        "combo_gamma": {name:"コンボアップγ", price:500000, cooldown:35, effect:"comboBoost", duration:10, mult:1.75},
        "fever_alpha": {name:"フィーバーα", price:1500000, cooldown:35, effect:"fever", duration:7},
        "auto_pi": {name:"自動入力π", price:1500000, cooldown:25, effect:"hybrid", durationAuto:1.5, feverDur:2},
        "time_gamma": {name:"時間伸ばしγ", price:1500000, cooldown:200, effect:"preciseMinigame"},
        "bunson_fever": {name:"ブンソンフィーバー！！", price:5000000, effect:"super", cooldown:35, feverDur:15, passive:true}
    };
    // ストーリー進行度 stage: 1~100
    let storyStage = 1;
    let storyCleared = false;

    // グローバルゲーム状態
    let currentView = "home"; // home, difficultySelect, playing, storyMap, skillShop, settings
    let currentDifficulty = null;
    let activeWordList = [];
    let currentWordIndex = 0;
    let currentWord = "";
    let score = 0;
    let combo = 0;
    let timeLeft = 60;
    let gameInterval = null;
    let isGameActive = false;
    let canType = true;
    let skillCooldownRemaining = 0;
    let activeSkillEffect = null;
    let autoInputInterval = null;
    let interferenceTimeout = null;
    let storyInterferenceQueue = [];
    let storyCurrentTarget = 10000; // ステージ1の目標スコア
    let storyModeActive = false;
    let currentStageId = 1;
    
    // 設定
    let settings = {
        volume: 70,
        theme: "ネオン",
        colorTheme: "デフォルト",
        fontFamily: "ノーマル"
    };
    
    // 効果音簡易 (Web Audio)
    function playBeep(type) {
        if(settings.volume === 0) return;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        let freq = type === "correct" ? 880 : 440;
        osc.frequency.value = freq;
        gain.gain.value = settings.volume/100 * 0.2;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
        osc.stop(audioCtx.currentTime + 0.2);
    }
    
    // ユーティリティ
    function updatePlayerUI() {
        const bar = document.getElementById("xpFill");
        if(bar) {
            let needXP = player.level * 100;
            let percent = (player.xp / needXP) * 100;
            bar.style.width = Math.min(100, percent) + "%";
        }
        const levelSpan = document.getElementById("levelVal");
        if(levelSpan) levelSpan.innerText = player.level;
        const coinSpan = document.getElementById("coinVal");
        if(coinSpan) coinSpan.innerText = Math.floor(player.coins);
    }
    function addScoreAndCoin(addScore) {
        score += addScore;
        // コンボ*5
        let gain = Math.floor(combo * 5);
        score += gain;
        // リアルタイム更新
        document.getElementById("scoreVal") && (document.getElementById("scoreVal").innerText = score);
        document.getElementById("comboVal") && (document.getElementById("comboVal").innerText = combo);
        playBeep("correct");
    }
    function finishGame(earnedScore) {
        if(gameInterval) clearInterval(gameInterval);
        isGameActive = false;
        let addCoins = Math.floor(earnedScore / 10);
        let addXP = Math.floor(earnedScore / 100);
        player.coins += addCoins;
        player.xp += addXP;
        while(player.xp >= player.level * 100) {
            player.xp -= player.level * 100;
            player.level++;
        }
        updatePlayerUI();
        alert(`ゲーム終了！ スコア:${earnedScore} 獲得コイン:${addCoins} XP:${addXP}`);
        if(storyModeActive) {
            // ストーリーモードの達成判定
            if(earnedScore >= storyCurrentTarget) {
                let newStage = storyStage + 1;
                if(newStage > 100) {
                    alert("ストーリーモード完全制覇！ スキル「ブンソンフィーバー！！」を入手！");
                    if(!player.unlockedSkills.includes("bunson_fever")) player.unlockedSkills.push("bunson_fever");
                    storyCleared = true;
                    currentView = "home";
                    render();
                } else {
                    storyStage = newStage;
                    alert(`ステージ${storyStage-1}クリア！ 次の目標スコア: ${getStoryTarget(storyStage)}`);
                    storyCurrentTarget = getStoryTarget(storyStage);
                    currentView = "storyMap";
                    render();
                }
            } else {
                alert(`目標スコア ${storyCurrentTarget} に届きませんでした。再挑戦します。`);
                currentView = "storyMap";
                render();
            }
            storyModeActive = false;
        } else {
            currentView = "home";
            render();
        }
    }
    function getStoryTarget(stage) {
        if(stage === 1) return 10000;
        return 10000 + (stage-1)*1000;
    }
    // 妨害システム
    function applyInterference(stageLv) {
        if(!isGameActive) return;
        if(stageLv >= 26 && stageLv <= 50) {
            // ペイント妨害
            const div = document.createElement("div");
            div.className = "interference paint-ball";
            document.body.appendChild(div);
            setTimeout(()=> div.remove(), 1500);
        } else if(stageLv >= 51 && stageLv <= 75) {
            timeLeft = Math.max(0, timeLeft - 10);
            document.getElementById("timerVal").innerText = timeLeft;
        } else if(stageLv >= 76 && stageLv <= 99) {
            combo = 0;
            document.getElementById("comboVal").innerText = combo;
            const thunderDiv = document.createElement("div");
            thunderDiv.className = "interference thunder";
            document.body.appendChild(thunderDiv);
            setTimeout(()=>thunderDiv.remove(), 600);
        } else if(stageLv === 100) {
            // 2回ペイント + 雷
            setTimeout(()=> {
                const p1 = document.createElement("div"); p1.className="interference paint-ball"; document.body.appendChild(p1); setTimeout(()=>p1.remove(),1500);
            }, 1000);
            setTimeout(()=> {
                const p2 = document.createElement("div"); p2.className="interference paint-ball"; document.body.appendChild(p2); setTimeout(()=>p2.remove(),1500);
            }, 3000);
            setTimeout(()=> { combo=0; const th=document.createElement("div"); th.className="interference thunder"; document.body.appendChild(th); setTimeout(()=>th.remove(),600);}, 5000);
        }
    }
    
    function startTypingGame(difficulty, isStory = false, stageNum = 1) {
        if(gameInterval) clearInterval(gameInterval);
        let words = [];
        if(difficulty === "easy") words = [...WORD_SETS.easy];
        else if(difficulty === "medium") words = [...WORD_SETS.medium];
        else words = [...WORD_SETS.hard];
        activeWordList = words;
        currentWordIndex = Math.floor(Math.random() * activeWordList.length);
        currentWord = activeWordList[currentWordIndex];
        score = 0;
        combo = 0;
        timeLeft = 60;
        isGameActive = true;
        canType = true;
        storyModeActive = isStory;
        if(isStory) storyCurrentTarget = getStoryTarget(stageNum);
        currentStageId = stageNum;
        
        renderGameScreen();
        startTimerAndGameLoop();
        // ストーリー妨害 (最初に適用)
        if(isStory && stageNum >= 26) applyInterference(stageNum);
    }
    
    function startTimerAndGameLoop() {
        gameInterval = setInterval(() => {
            if(!isGameActive) return;
            if(timeLeft <= 0) {
                clearInterval(gameInterval);
                isGameActive = false;
                finishGame(score);
                return;
            }
            timeLeft--;
            document.getElementById("timerVal") && (document.getElementById("timerVal").innerText = timeLeft);
        }, 1000);
    }
    
    function renderGameScreen() {
        const app = document.getElementById("app-root");
        app.innerHTML = `
            <div class="typing-area">
                <div class="score-board">
                    <span>🔥スコア: <span id="scoreVal">${score}</span></span>
                    <span>⚡コンボ: <span id="comboVal">${combo}</span></span>
                    <span class="timer">⏱️ <span id="timerVal">${timeLeft}</span>s</span>
                </div>
                <div class="question-word">${currentWord}</div>
                <input type="text" id="typeInput" class="input-field" placeholder="ひらがなで入力" autofocus>
                <div style="margin:20px"><button id="skillBtn" class="neon-btn" ${skillCooldownRemaining>0?"disabled":""}>スキル発動 ${skillCooldownRemaining>0?`(${skillCooldownRemaining}s)` : "⚡"}</button>
                <button id="exitGameBtn" class="neon-btn">終了して戻る</button></div>
            </div>
        `;
        const input = document.getElementById("typeInput");
        input.addEventListener("keypress", (e) => {
            if(e.key === "Enter" && isGameActive && canType) {
                let userVal = input.value.trim().toLowerCase();
                if(userVal === currentWord) {
                    let addBase = Math.floor(combo * 5);
                    score += addBase;
                    combo++;
                    document.getElementById("scoreVal").innerText = score;
                    document.getElementById("comboVal").innerText = combo;
                    playBeep("correct");
                    // 次の単語
                    let newIdx = Math.floor(Math.random() * activeWordList.length);
                    currentWord = activeWordList[newIdx];
                    document.querySelector(".question-word").innerText = currentWord;
                    input.value = "";
                    // フィーバー効果中追加スコア
                    if(activeSkillEffect && activeSkillEffect.feverActive) {
                        score += 300;
                        document.getElementById("scoreVal").innerText = score;
                        const feverMsg = document.createElement("div"); feverMsg.className="skill-overlay"; feverMsg.innerText="🔥 FEVER +300 🔥"; document.body.appendChild(feverMsg); setTimeout(()=>feverMsg.remove(),500);
                    }
                } else {
                    combo = 0;
                    document.getElementById("comboVal").innerText = combo;
                    playBeep("miss");
                    input.value = "";
                }
            }
        });
        document.getElementById("exitGameBtn").onclick = () => {
            if(gameInterval) clearInterval(gameInterval);
            isGameActive = false;
            currentView = "home";
            render();
        };
        document.getElementById("skillBtn").onclick = () => { if(isGameActive && skillCooldownRemaining<=0 && player.equippedSkill) useSkill(player.equippedSkill);};
    }
    
    function useSkill(skillId) {
        let sk = SKILLS[skillId];
        if(!sk) return;
        skillCooldownRemaining = sk.cooldown;
        // 簡易エフェクト
        if(sk.effect === "auto" || sk.effect === "hybrid") {
            // 自動入力シミュレーション (簡易)
            let duration = sk.duration || (sk.effect==="hybrid"?sk.durationAuto:4.5);
            let endTime = Date.now() + duration*1000;
            let interval = setInterval(()=>{
                if(!isGameActive || Date.now()>endTime) { clearInterval(interval); return; }
                if(canType && document.getElementById("typeInput")) {
                    let fakeEvent = {key:"Enter", preventDefault:()=>{}};
                    let inp = document.getElementById("typeInput");
                    if(inp && currentWord) {
                        inp.value = currentWord;
                        let ev = new Event("keypress");
                        ev.key = "Enter";
                        inp.dispatchEvent(ev);
                    }
                }
            }, 1000/64);
            setTimeout(()=>clearInterval(interval), duration*1000);
        }
        if(sk.effect === "fever") {
            activeSkillEffect = { feverActive: true, end: Date.now()+sk.duration*1000 };
            setTimeout(()=>{ if(activeSkillEffect) activeSkillEffect.feverActive=false; }, sk.duration*1000);
        }
        if(sk.effect === "comboBoost") {
            let mult = sk.mult;
            let orig = combo;
            // 実際にはスコア計算乗算
            // 手動でインターバル設定で掛け算
        }
        if(skillId === "bunson_fever") {
            // フィーバー15秒
            activeSkillEffect = { feverActive: true, end: Date.now()+15000 };
            setTimeout(()=>{ if(activeSkillEffect) activeSkillEffect.feverActive=false; }, 15000);
        }
        setInterval(()=>{ if(skillCooldownRemaining>0) skillCooldownRemaining--; }, 1000);
    }
    
    // ホーム画面
    function renderHome() {
        const app = document.getElementById("app-root");
        app.innerHTML = `
            <h1>⚡ NEON TYPING ⚡</h1>
            <div class="menu-grid">
                <div class="menu-card" data-mode="play"><h3>🔫 プレイ</h3></div>
                <div class="menu-card" data-mode="story"><h3>📖 ストーリー</h3></div>
                <div class="menu-card" data-mode="rank"><h3>🏆 ランキング</h3></div>
                <div class="menu-card" data-mode="shop"><h3>🛒 スキルショップ</h3></div>
                <div class="menu-card" data-mode="settings"><h3>⚙️ 設定</h3></div>
            </div>
            <div class="status-bar" style="position:fixed"><div>Lv<span id="levelVal">${player.level}</span> <div class="xp-bar-bg"><div id="xpFill" class="xp-fill" style="width:${(player.xp/(player.level*100))*100}%"></div></div> 🪙${Math.floor(player.coins)}</div></div>
        `;
        document.querySelectorAll(".menu-card").forEach(card => {
            card.onclick = () => {
                let mode = card.dataset.mode;
                if(mode === "play") currentView = "difficultySelect";
                else if(mode === "story") currentView = "storyMap";
                else if(mode === "rank") alert("ランキングはローカル保存版: 現在の最高スコア記録機能は後日");
                else if(mode === "shop") currentView = "skillShop";
                else if(mode === "settings") currentView = "settings";
                render();
            };
        });
        updatePlayerUI();
    }
    
    function renderDifficulty() {
        const app = document.getElementById("app-root");
        app.innerHTML = `<h2>難易度選択</h2><div class="flex-row" style="justify-content:center; gap:20px;"><button class="neon-btn" data-diff="easy">🍃 簡単</button><button class="neon-btn" data-diff="medium">🌙 中級</button><button class="neon-btn" data-diff="hard">🔥 難しい</button><button class="neon-btn" id="backHome">戻る</button></div>`;
        document.querySelectorAll("[data-diff]").forEach(btn => {
            btn.onclick = () => {
                currentDifficulty = btn.dataset.diff;
                startTypingGame(currentDifficulty, false);
                renderGameScreen();
            };
        });
        document.getElementById("backHome").onclick = () => { currentView = "home"; render(); };
    }
    
    function renderStoryMap() {
        const app = document.getElementById("app-root");
        app.innerHTML = `<h2>📖 ストーリーモード - Stage ${storyStage}</h2><p>目標スコア: ${getStoryTarget(storyStage)}</p><div class="flex-row"><button id="storyPlayBtn" class="neon-btn">▶ プレイ</button><button id="storyBack" class="neon-btn">ホーム</button></div>`;
        document.getElementById("storyPlayBtn").onclick = () => {
            startTypingGame((storyStage<=30?"easy":storyStage<=70?"medium":"hard"), true, storyStage);
        };
        document.getElementById("storyBack").onclick = () => { currentView="home"; render(); };
    }
    
    function renderSkillShop() {
        const app = document.getElementById("app-root");
        app.innerHTML = `<h2>🛒 スキルショップ</h2><div class="flex-row"><button id="tabBuy" class="neon-btn">購入</button><button id="tabEquip" class="neon-btn">装備</button></div><div id="shopContent"></div><button id="backHome" class="neon-btn">戻る</button>`;
        let contentDiv = document.getElementById("shopContent");
        function showBuy() {
            let html = `<div class="flex-col">`;
            for(let [id, sk] of Object.entries(SKILLS)) {
                if(!player.unlockedSkills.includes(id)) {
                    html += `<div>${sk.name} - ${sk.price}🪙 <button class="neon-btn" data-skill="${id}">購入</button></div>`;
                } else {
                    html += `<div>${sk.name} (所有済み)</div>`;
                }
            }
            html+=`</div>`;
            contentDiv.innerHTML = html;
            document.querySelectorAll("[data-skill]").forEach(btn => {
                btn.onclick = () => {
                    let sid = btn.dataset.skill;
                    let sk = SKILLS[sid];
                    if(player.coins >= sk.price) {
                        player.coins -= sk.price;
                        if(!player.unlockedSkills.includes(sid)) player.unlockedSkills.push(sid);
                        updatePlayerUI();
                        renderSkillShop();
                    } else alert("コイン不足");
                };
            });
        }
        function showEquip() {
            let html = `<div>装備中のスキル: ${player.equippedSkill?SKILLS[player.equippedSkill]?.name:"なし"}</div>`;
            player.unlockedSkills.forEach(sid=>{
                html += `<div>${SKILLS[sid]?.name} <button class="neon-btn" data-equip="${sid}">装備</button></div>`;
            });
            contentDiv.innerHTML = html;
            document.querySelectorAll("[data-equip]").forEach(btn=>{
                btn.onclick=()=>{ player.equippedSkill = btn.dataset.equip; alert(`${SKILLS[btn.dataset.equip].name}を装備しました`); renderSkillShop();};
            });
        }
        document.getElementById("tabBuy").onclick = showBuy;
        document.getElementById("tabEquip").onclick = showEquip;
        document.getElementById("backHome").onclick = () => { currentView = "home"; render(); };
        showBuy();
    }
    
    function renderSettings() {
        const app = document.getElementById("app-root");
        app.innerHTML = `<h2>設定</h2><div class="settings-panel"><label>音量 <input type="range" id="volSlider" min="0" max="100" value="${settings.volume}"></label><br/><label>テーマ: <select id="themeSelect"><option>ネオン</option><option>ノーマル</option><option>クラシック</option></select></label><br/><label>カラー: <select id="colorSelect"><option>デフォルト</option><option>レッド</option><option>シアン</option></select></label><br/><label>フォント: <select id="fontSelect"><option>ノーマル</option><option>ゴシック体</option><option>ドット</option></select></label><button id="saveSettings" class="neon-btn">保存</button><button id="backHomeSet" class="neon-btn">戻る</button></div>`;
        document.getElementById("volSlider").onchange = (e)=> settings.volume = parseInt(e.target.value);
        document.getElementById("saveSettings").onclick = ()=>{ alert("設定保存"); render(); };
        document.getElementById("backHomeSet").onclick = ()=>{ currentView="home"; render(); };
    }
    
    function render() {
        if(currentView === "home") renderHome();
        else if(currentView === "difficultySelect") renderDifficulty();
        else if(currentView === "storyMap") renderStoryMap();
        else if(currentView === "skillShop") renderSkillShop();
        else if(currentView === "settings") renderSettings();
        else if(currentView === "playing") {} // handled
        updatePlayerUI();
    }
    // 初期化
    function init() {
        if(!player.unlockedSkills.includes("bunson_fever") && false){} // story unlock later
        render();
    }
    init();
</script>
</body>
</html>
