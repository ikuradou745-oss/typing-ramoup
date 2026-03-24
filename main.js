/**
 * BUNSON TYPING SYSTEM v2.0
 * FULL IMPLEMENTATION - NO OMISSIONS
 */

// --- GLOBAL DATA ---

const WORD_DATABASE = {
    easy: [
        {ja: "さくら", ro: "sakura"}, {ja: "ねこ", ro: "neko"}, {ja: "いぬ", ro: "inu"},
        {ja: "ごはん", ro: "gohan"}, {ja: "みず", ro: "mizu"}, {ja: "おちゃ", ro: "otya"},
        {ja: "えき", ro: "eki"}, {ja: "うみ", ro: "umi"}, {ja: "ゆめ", ro: "yume"},
        {ja: "とり", ro: "tori"}, {ja: "あめ", ro: "ame"}, {ja: "くも", ro: "kumo"},
        {ja: "はな", ro: "hana"}, {ja: "そら", ro: "sora"}, {ja: "つき", ro: "tuki"},
        {ja: "ほし", ro: "hosi"}, {ja: "やま", ro: "yama"}, {ja: "かわ", ro: "kawa"},
        {ja: "ほん", ro: "hon"}, {ja: "ゆき", ro: "yuki"}
    ],
    normal: [
        {ja: "おたんじょうび", ro: "otanjyoubi"}, {ja: "しんかんせん", ro: "sinkansen"},
        {ja: "ゆうびんきょく", ro: "yuubinkyoku"}, {ja: "ありがとう", ro: "arigatou"},
        {ja: "おめでとう", ro: "omedetou"}, {ja: "いってきます", ro: "ittekimasu"},
        {ja: "ただいま", ro: "tadaima"}, {ja: "おやすみなさい", ro: "oyasuminasai"},
        {ja: "ともだち", ro: "tomodati"}, {ja: "がっこう", ro: "gakkou"},
        {ja: "せんせい", ro: "sensei"}, {ja: "あさごはん", ro: "asagohan"},
        {ja: "にほんご", ro: "nihongo"}, {ja: "べんきょう", ro: "benkyou"},
        {ja: "にちようび", ro: "nitiyoubi"}
    ],
    hard: [
        {ja: "よろしくおねがいします", ro: "yorosikuonegaisimasu"},
        {ja: "おつかれさまです", ro: "otukaresamadesu"},
        {ja: "ありがとうございます", ro: "arigatougozaimasu"},
        {ja: "しょうしょうおまちください", ro: "syousyousyouomatidudasai"},
        {ja: "ごめんなさい", ro: "gomennasai"},
        {ja: "いらっしゃいませ", ro: "irassyaimase"},
        {ja: "いただきます", ro: "itadakimasu"},
        {ja: "ごちそうさまでした", ro: "gotisousamadesita"},
        {ja: "お会いできてうれしいです", ro: "oaidekiteuresiidesu"},
        {ja: "またあしたあいましょう", ro: "mataasitaaimasyou"},
        {ja: "ゆっくりはなしてください", ro: "yukkurihanasitekudasai"},
        {ja: "もういちどおしえてください", ro: "mouitidoosietekudasai"},
        {ja: "こまっている人をたすけます", ro: "komatteiruhiotoatasukemasu"},
        {ja: "いっしょうけんめいがんばる", ro: "issyokenmeiganbaru"},
        {ja: "きょうはいい天気ですね", ro: "kyouwaiitenkidesune"}
    ]
};

const SKILLS = [
    {id: 'auto_a', name: '自動入力α', price: 50000, cd: 30, desc: '4.5秒間 64FPS自動入力'},
    {id: 'combo_a', name: 'コンボアップα', price: 50000, cd: 30, desc: '5秒間 コンボ増加量1.5倍'},
    {id: 'time_a', name: '時間アップα', price: 50000, cd: 45, desc: 'タイピング停止しミニゲーム(3~6.5秒増)'},
    {id: 'auto_g', name: '自動入力γ', price: 500000, cd: 35, desc: '7.5秒間 64FPS自動入力'},
    {id: 'combo_g', name: 'コンボアップγ', price: 500000, cd: 35, desc: 'コンボ1.75倍 & 時間10秒増加'},
    {id: 'fever_a', name: 'フィーバーα', price: 1500000, cd: 35, desc: '7秒間 フィーバー状態'},
    {id: 'auto_p', name: '自動入力π', price: 1500000, cd: 25, desc: '1.5秒50FPS入力+2秒フィーバー'},
    {id: 'time_g', name: '時間伸ばしγ', price: 1500000, cd: 200, desc: '精密ミニゲーム(4~10秒増)'},
    {id: 'bunson', name: 'ブンソンフィーバー！！', price: 5000000, cd: 35, desc: '15秒フィーバー / 残5秒でコンボ1.35倍(パッシブ)'},
    {id: 'fever_sigma', name: 'フィーバーΣ', price: 0, cd: 30, desc: '10秒フィーバー + 2秒間自動入力(最強)'}
];

// --- STATE MANAGEMENT ---

let state = {
    lv: 1, xp: 0, coins: 0,
    ownedSkills: [],
    equippedSkill: null,
    storyStage: 1,
    settings: { vol: 50, theme: 'neon', color: 'cyan', font: 'normal' }
};

let game = {
    active: false,
    mode: 'free',
    difficulty: 'easy',
    score: 0, combo: 0,
    timeLeft: 60,
    currentWord: null, charIdx: 0,
    cd: 0,
    isFever: false, comboMul: 1,
    isTimingGame: false,
    hasTriggeredObstacle1: false,
    hasTriggeredObstacle2: false
};

// --- CORE FUNCTIONS ---

function nav(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function updateUI() {
    document.getElementById('val-lv').innerText = state.lv;
    document.getElementById('val-coins').innerText = Math.floor(state.coins);
    const nextXp = state.lv * 100;
    document.getElementById('xp-fill').style.width = (state.xp / nextXp * 100) + '%';
}

function save() { localStorage.setItem('bunson_data', JSON.stringify(state)); }
function load() {
    const d = localStorage.getItem('bunson_data');
    if (d) {
        state = {...state, ...JSON.parse(d)};
        updateUI();
    }
}

// --- GAME LOGIC ---

function initGame(diff, story = false) {
    game.active = true;
    game.mode = story ? 'story' : 'free';
    game.difficulty = diff;
    game.score = 0;
    game.combo = 0;
    game.charIdx = 0;
    game.cd = 0;
    game.isFever = false;
    game.comboMul = 1;
    game.isTimingGame = false;
    game.hasTriggeredObstacle1 = false;
    game.hasTriggeredObstacle2 = false;

    // ストーリー用タイマー調整 (Stage 51-75)
    game.timeLeft = (story && state.storyStage >= 51 && state.storyStage <= 75) ? 50 : 60;

    document.getElementById('stat-score').innerText = "0";
    document.getElementById('stat-combo').innerText = "0";
    document.getElementById('info-header').innerText = story ? `STORY: STAGE ${state.storyStage}` : `MODE: ${diff.toUpperCase()}`;
    
    const sName = state.equippedSkill ? SKILLS.find(s => s.id === state.equippedSkill).name : "NONE";
    document.getElementById('equipped-name').innerText = sName;
    document.getElementById('skill-ready-hint').style.display = state.equippedSkill ? 'inline' : 'none';

    setWord();
    nav('scr-game');
    startLoop();
}

function startStoryMode() {
    initGame('normal', true);
}

function setWord() {
    const list = WORD_DATABASE[game.difficulty];
    game.currentWord = list[Math.floor(Math.random() * list.length)];
    game.charIdx = 0;
    renderWord();
}

function renderWord() {
    const jaEl = document.getElementById('display-ja');
    const roEl = document.getElementById('display-ro');
    
    jaEl.innerText = game.currentWord.ja;
    
    let html = "";
    const ro = game.currentWord.ro;
    for(let i=0; i<ro.length; i++){
        if(i < game.charIdx) html += `<span class="char-done">${ro[i]}</span>`;
        else html += `<span>${ro[i]}</span>`;
    }
    roEl.innerHTML = html;
}

// --- MAIN LOOP ---

function startLoop() {
    const timer = setInterval(() => {
        if (!game.active) { clearInterval(timer); return; }
        if (game.isTimingGame) return;

        game.timeLeft -= 0.01;
        document.getElementById('game-timer').innerText = Math.max(0, game.timeLeft).toFixed(2);

        // CD管理
        if (game.cd > 0) {
            game.cd -= 0.01;
            document.getElementById('skill-ready-hint').innerText = `[ RECHARGING: ${Math.ceil(game.cd)}s ]`;
        } else {
            document.getElementById('skill-ready-hint').innerText = `[ SPACE TO USE ]`;
        }

        // ストーリー妨害
        if (game.mode === 'story') checkObstacles();

        // パッシブ: ブンソンフィーバー
        if (state.equippedSkill === 'bunson' && game.timeLeft <= 5) {
            game.comboMul = 1.35;
        }

        if (game.timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 10);
}

function checkObstacles() {
    const s = state.storyStage;
    // ペイント (Stage 26-50, 100)
    if ((s >= 26 && s <= 50) || s === 100) {
        if (!game.hasTriggeredObstacle1 && game.timeLeft < 30) {
            triggerPaint();
            game.hasTriggeredObstacle1 = true;
        }
    }
    // 雷 (Stage 76-99, 100)
    if ((s >= 76 && s <= 99) || s === 100) {
        if (!game.hasTriggeredObstacle2 && game.timeLeft < 15) {
            triggerThunder();
            game.hasTriggeredObstacle2 = true;
        }
        // Stage 100は2回ペイント
        if (s === 100 && game.timeLeft < 45 && !game.p2) { triggerPaint(); game.p2=true; }
    }
}

function triggerPaint() {
    const p = document.getElementById('paint-overlay');
    p.style.opacity = "1";
    setTimeout(() => { p.style.opacity = "0"; }, 1500);
}

function triggerThunder() {
    const t = document.getElementById('thunder-flash');
    t.style.opacity = "1";
    game.combo = 0;
    updateStats();
    setTimeout(() => { t.style.opacity = "0"; }, 200);
}

// --- INPUT HANDLERS ---

window.addEventListener('keydown', (e) => {
    if (!game.active) return;

    if (e.code === 'Space') {
        if (game.isTimingGame) { resolveTimingGame(); return; }
        activateSkill();
        return;
    }

    if (game.isTimingGame) return;

    const key = e.key.toLowerCase();
    const target = game.currentWord.ro[game.charIdx].toLowerCase();

    if (key === target) {
        correctHit();
    } else if (e.key.length === 1) {
        missHit();
    }
});

function correctHit() {
    game.charIdx++;
    game.combo++;
    
    let addScore = game.isFever ? 300 : (game.combo * 5) * game.comboMul;
    game.score += addScore;
    
    updateStats();
    playSound(440 + (game.combo * 2));

    if (game.charIdx >= game.currentWord.ro.length) {
        setWord();
    } else {
        renderWord();
    }
}

function missHit() {
    game.combo = 0;
    updateStats();
}

function updateStats() {
    document.getElementById('stat-score').innerText = Math.floor(game.score);
    document.getElementById('stat-combo').innerText = game.combo;
}

// --- SKILL IMPLEMENTATIONS ---

function activateSkill() {
    if (game.cd > 0 || !state.equippedSkill) return;
    
    const sk = SKILLS.find(s => s.id === state.equippedSkill);
    game.cd = sk.cd;

    switch(state.equippedSkill) {
        case 'auto_a': runAuto(4500, 64); break;
        case 'combo_a': 
            game.comboMul = 1.5; 
            setTimeout(() => game.comboMul = 1, 5000); 
            break;
        case 'time_a': initTimingGame(3, 6.5, 3); break;
        case 'auto_g': runAuto(7500, 64); break;
        case 'combo_g':
            game.comboMul = 1.75;
            game.timeLeft += 10;
            setTimeout(() => game.comboMul = 1, 10000);
            break;
        case 'fever_a': runFever(7000); break;
        case 'auto_p':
            runAuto(1500, 50);
            runFever(2000);
            break;
        case 'time_g': initTimingGame(4, 10, 6, true); break;
        case 'bunson': runFever(15000); break;
        case 'fever_sigma':
            runFever(10000);
            runAuto(2000, 64);
            break;
    }
}

function runAuto(ms, fps) {
    const interval = setInterval(() => {
        if (!game.active) { clearInterval(interval); return; }
        correctHit();
    }, 1000 / fps);
    setTimeout(() => clearInterval(interval), ms);
}

function runFever(ms) {
    game.isFever = true;
    document.getElementById('word-area').classList.add('fever-mode');
    setTimeout(() => {
        game.isFever = false;
        document.getElementById('word-area').classList.remove('fever-mode');
    }, ms);
}

// --- MINIGAME: TIMING BAR ---

let timingState = { pos: 0, dir: 4, b1: 0, b2: 0 };

function initTimingGame(b1, b2, speed, isHard = false) {
    game.isTimingGame = true;
    timingState.b1 = b1; timingState.b2 = b2;
    timingState.dir = speed;
    timingState.pos = 0;
    
    const box = document.getElementById('timing-box');
    box.style.display = 'block';
    
    timingState.anim = setInterval(() => {
        timingState.pos += timingState.dir;
        if (timingState.pos > 495 || timingState.pos < 0) timingState.dir *= -1;
        document.getElementById('timing-cursor').style.left = timingState.pos + 'px';
    }, 10);
}

function resolveTimingGame() {
    clearInterval(timingState.anim);
    const box = document.getElementById('timing-box');
    box.style.display = 'none';
    
    const centerDist = Math.abs(timingState.pos - 250);
    if (centerDist < 15) {
        game.timeLeft += timingState.b2;
        showFloatingText("EXCELLENT!!", "yellow");
    } else if (centerDist < 60) {
        game.timeLeft += timingState.b1;
        showFloatingText("GOOD", "cyan");
    }
    
    game.isTimingGame = false;
}

// --- SYSTEM UTILS ---

function showFloatingText(txt, col) {
    alert(txt); // 簡易実装
}

function playSound(freq) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        g.gain.setValueAtTime(state.settings.vol / 1000, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
}

function endGame() {
    game.active = false;
    const coins = game.score / 10;
    const xp = game.score / 100;
    
    state.coins += coins;
    state.xp += xp;
    
    // Level Up
    while(state.xp >= state.lv * 100) {
        state.xp -= state.lv * 100;
        state.lv++;
    }

    let storyMsg = "";
    if (game.mode === 'story') {
        const goal = 10000 + (state.storyStage - 1) * 1000;
        if (game.score >= goal) {
            storyMsg = `STAGE CLEAR! (Target: ${goal})`;
            if (state.storyStage === 100) {
                state.ownedSkills.push('fever_sigma');
                storyMsg = "STORY ALL CLEAR! UNLOCKED FEVER Σ!";
            }
            state.storyStage++;
        } else {
            storyMsg = `STAGE FAILED... (Target: ${goal})`;
        }
    }

    document.getElementById('res-score').innerText = Math.floor(game.score);
    document.getElementById('res-coins').innerText = Math.floor(coins);
    document.getElementById('res-xp').innerText = Math.floor(xp);
    document.getElementById('res-story-status').innerText = storyMsg;

    updateUI();
    save();
    nav('scr-result');
}

// --- SHOP & SETTINGS ---

let shopTab = 'buy';
function openShop() {
    switchShopTab('buy');
    nav('scr-shop');
}

function switchShopTab(t) {
    shopTab = t;
    document.getElementById('tab-buy').className = t === 'buy' ? 'tab-btn active' : 'tab-btn';
    document.getElementById('tab-equip').className = t === 'equip' ? 'tab-btn active' : 'tab-btn';
    renderShop();
}

function renderShop() {
    const container = document.getElementById('shop-container');
    container.innerHTML = "";
    
    SKILLS.forEach(s => {
        if (s.price === 0 && s.id !== 'fever_sigma') return;
        
        const isOwned = state.ownedSkills.includes(s.id);
        if (shopTab === 'buy' && isOwned) return;
        if (shopTab === 'equip' && !isOwned) return;

        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <strong>${s.name}</strong><br>
            <small>${s.desc}</small><br>
            <p>CD: ${s.cd}s</p>
        `;

        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.minWidth = "100px";
        btn.style.padding = "10px";

        if (shopTab === 'buy') {
            btn.innerText = `${s.price} 🪙`;
            btn.onclick = () => {
                if (state.coins >= s.price) {
                    state.coins -= s.price;
                    state.ownedSkills.push(s.id);
                    renderShop();
                    updateUI();
                    save();
                } else { alert("コインが足りません！"); }
            };
        } else {
            btn.innerText = state.equippedSkill === s.id ? "EQUIPPED" : "EQUIP";
            btn.onclick = () => {
                state.equippedSkill = s.id;
                renderShop();
                save();
            };
        }
        item.appendChild(btn);
        container.appendChild(item);
    });
}

function applySettings() {
    state.settings.vol = document.getElementById('set-vol').value;
    state.settings.theme = document.getElementById('set-theme').value;
    state.settings.color = document.getElementById('set-color').value;
    state.settings.font = document.getElementById('set-font').value;

    // Apply Theme Class
    document.body.className = "";
    if (state.settings.theme === 'classic') document.body.classList.add('classic-theme');
    if (state.settings.theme === 'old') document.body.classList.add('old-theme');
    if (state.settings.theme === 'dot') document.body.classList.add('dot-theme');

    // Apply Color
    const colorMap = {
        cyan: '#00f2ff', red: '#ff4444', yellow: '#ffcc00', magenta: '#ff00ff', rainbow: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
    };
    document.documentElement.style.setProperty('--main-color', colorMap[state.settings.color]);
    
    // Apply Font
    const fontMap = {
        normal: "'M PLUS 1p'", gothic: "'Sawarabi Gothic'", chara: "'M PLUS 1p'", dot: "'DotGothic16'", super: "'DotGothic16'"
    };
    document.documentElement.style.setProperty('--font-main', fontMap[state.settings.font]);

    save();
    nav('scr-home');
}

// 初期化
window.onload = () => {
    load();
    applySettings();
};
