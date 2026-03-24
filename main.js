/**
 * Neon Typing Adventure - Game Logic
 */

// --- 1. データ定義 ---

const WORD_LIST = {
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
        {ja: "おつかれさまでした", ro: "otukaresamadesita"},
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

const SKILL_DATA = [
    {id: 'auto_a', name: '自動入力α', price: 50000, cd: 30, desc: '4.5秒間自動入力'},
    {id: 'combo_a', name: 'コンボアップα', price: 50000, cd: 30, desc: '5秒間コンボ1.5倍'},
    {id: 'time_a', name: '時間アップα', price: 50000, cd: 45, desc: 'ミニゲームで時間延長'},
    {id: 'auto_g', name: '自動入力γ', price: 500000, cd: 35, desc: '7.5秒間自動入力'},
    {id: 'combo_g', name: 'コンボアップγ', price: 500000, cd: 35, desc: '1.75倍 & 10秒増加'},
    {id: 'fever_a', name: 'フィーバーα', price: 1500000, cd: 35, desc: '7秒間フィーバー'},
    {id: 'auto_p', name: '自動入力π', price: 1500000, cd: 25, desc: '1.5秒高速入力+2秒フィーバー'},
    {id: 'time_g', name: '時間伸ばしγ', price: 1500000, cd: 200, desc: '超高難度ミニゲームで時間延長'},
    {id: 'bunson', name: 'ブンソンフィーバー！！', price: 5000000, cd: 35, desc: '15秒フィーバー + 残5秒でコンボUP'},
    {id: 'fever_s', name: 'フィーバーΣ', price: 0, cd: 30, desc: '10秒フィーバー+自動入力(Stage100報酬)'}
];

// --- 2. 状態管理 ---

let player = {
    level: 1,
    xp: 0,
    coins: 0,
    ownedSkills: [],
    equippedSkill: null,
    storyStage: 1,
    settings: {
        volume: 50,
        theme: 'neon',
        color: 'default',
        font: 'normal'
    }
};

let game = {
    isActive: false,
    mode: 'free', // 'free' or 'story'
    difficulty: 'easy',
    timeLeft: 60,
    score: 0,
    combo: 0,
    wordIndex: 0,
    charIndex: 0,
    currentWord: null,
    skillCooldown: 0,
    isFever: false,
    comboMultiplier: 1,
    autoTyping: false
};

// --- 3. コアロジック ---

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function updateHeader() {
    document.getElementById('display-lv').innerText = player.level;
    document.getElementById('display-coins').innerText = Math.floor(player.coins);
    const xpNeeded = player.level * 100;
    document.getElementById('xp-bar').style.width = (player.xp / xpNeeded * 100) + "%";
}

// ゲーム開始
function startGame(diff, isStory = false) {
    game.isActive = true;
    game.mode = isStory ? 'story' : 'free';
    game.difficulty = diff;
    game.timeLeft = isStory && player.storyStage >= 51 && player.storyStage <= 75 ? 50 : 60;
    game.score = 0;
    game.combo = 0;
    game.skillCooldown = 0;
    game.isFever = false;
    game.comboMultiplier = 1;
    game.autoTyping = false;
    
    document.getElementById('current-score').innerText = "0";
    document.getElementById('current-combo').innerText = "0";
    document.getElementById('stage-info').innerText = isStory ? `Stage ${player.storyStage}` : `難易度: ${diff}`;
    
    nextWord();
    showScreen('screen-game');
    
    const timerId = setInterval(() => {
        if (!game.isActive) { clearInterval(timerId); return; }
        
        // ストーリーモード妨害ロジック
        if (game.mode === 'story') {
            handleObstacles();
        }

        // スキルパッシブ (ブンソンフィーバー)
        if (player.equippedSkill === 'bunson' && game.timeLeft <= 5) {
            game.comboMultiplier = 1.35;
        }

        game.timeLeft -= 1;
        document.getElementById('timer').innerText = Math.max(0, Math.floor(game.timeLeft));
        
        if (game.timeLeft <= 0) {
            clearInterval(timerId);
            endGame();
        }
    }, 1000);
}

function handleObstacles() {
    const stage = player.storyStage;
    // ペイント妨害
    if (stage >= 26 && stage <= 50 || stage === 100) {
        if (Math.random() < 0.02) triggerPaint();
    }
    // 雷妨害
    if (stage >= 76 && stage <= 99 || stage === 100) {
        if (Math.random() < 0.01) triggerThunder();
    }
}

function triggerPaint() {
    const p = document.getElementById('paint-overlay');
    p.style.opacity = "1";
    let op = 1;
    const fade = setInterval(() => {
        op -= 0.05;
        p.style.opacity = op;
        if (op <= 0) clearInterval(fade);
    }, 100);
}

function triggerThunder() {
    const t = document.getElementById('thunder-flash');
    t.style.opacity = "1";
    game.combo = 0;
    document.getElementById('current-combo').innerText = "0";
    setTimeout(() => t.style.opacity = "0", 200);
}

function nextWord() {
    const list = WORD_LIST[game.difficulty];
    game.currentWord = list[Math.floor(Math.random() * list.length)];
    game.charIndex = 0;
    renderWord();
}

function renderWord() {
    const wordDisp = document.getElementById('word-display');
    const romaDisp = document.getElementById('romaji-display');
    
    wordDisp.innerText = game.currentWord.ja;
    
    let html = "";
    for (let i = 0; i < game.currentWord.ro.length; i++) {
        if (i < game.charIndex) {
            html += `<span class="typed">${game.currentWord.ro[i]}</span>`;
        } else {
            html += `<span>${game.currentWord.ro[i]}</span>`;
        }
    }
    romaDisp.innerHTML = html;
}

// 入力判定
window.addEventListener('keydown', (e) => {
    if (!game.isActive) return;
    
    // スキル発動 (Space)
    if (e.code === 'Space') {
        activateSkill();
        return;
    }

    const key = e.key.toLowerCase();
    const targetChar = game.currentWord.ro[game.charIndex].toLowerCase();

    if (key === targetChar) {
        handleHit();
    } else if (e.key.length === 1) {
        handleMiss();
    }
});

function handleHit() {
    game.charIndex++;
    game.combo++;
    
    let points = game.isFever ? 300 : (game.combo * 5) * game.comboMultiplier;
    game.score += points;
    
    document.getElementById('current-score').innerText = Math.floor(game.score);
    document.getElementById('current-combo').innerText = game.combo;
    
    playKeySound();

    if (game.charIndex >= game.currentWord.ro.length) {
        nextWord();
    } else {
        renderWord();
    }
}

function handleMiss() {
    game.combo = 0;
    document.getElementById('current-combo').innerText = "0";
    // ミス音など
}

function playKeySound() {
    // AudioContextで簡易的な音を生成（指示通り音ありにするため）
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440 + (game.combo * 2), ctx.currentTime);
    gain.gain.setValueAtTime(player.settings.volume / 500, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
}

// ゲーム終了
function endGame() {
    game.isActive = false;
    const earnedCoins = game.score / 10;
    const earnedXP = game.score / 100;
    
    player.coins += earnedCoins;
    player.xp += earnedXP;
    
    // レベルアップ判定
    while (player.xp >= player.level * 100) {
        player.xp -= player.level * 100;
        player.level++;
    }

    // ストーリーモードの成否
    if (game.mode === 'story') {
        const target = 10000 + (player.storyStage - 1) * 1000;
        if (game.score >= target) {
            if (player.storyStage === 100) {
                unlockSkill('fever_s');
                alert("ストーリー100クリア！スキル「フィーバーΣ」を獲得！");
            }
            player.storyStage++;
        } else {
            alert("目標スコアに届きませんでした...");
        }
    }

    document.getElementById('result-score').innerText = Math.floor(game.score);
    document.getElementById('result-coins').innerText = Math.floor(earnedCoins);
    document.getElementById('result-xp').innerText = Math.floor(earnedXP);
    
    updateHeader();
    saveData();
    showScreen('screen-result');
}

// --- 4. スキルシステム ---

function activateSkill() {
    if (game.skillCooldown > 0 || !player.equippedSkill) return;
    
    const skill = SKILL_DATA.find(s => s.id === player.equippedSkill);
    game.skillCooldown = skill.cd;

    switch(player.equippedSkill) {
        case 'auto_a': startAutoType(4500, 64); break;
        case 'combo_a': 
            game.comboMultiplier = 1.5; 
            setTimeout(() => game.comboMultiplier = 1, 5000); 
            break;
        case 'time_a': startTimingGame(3, 6.5); break;
        case 'auto_g': startAutoType(7500, 64); break;
        case 'combo_g':
            game.comboMultiplier = 1.75;
            game.timeLeft += 10;
            setTimeout(() => game.comboMultiplier = 1, 10000);
            break;
        case 'fever_a': startFever(7000); break;
        case 'auto_p': 
            startAutoType(1500, 50); 
            startFever(2000); 
            break;
        case 'time_g': startTimingGame(4, 10, true); break;
        case 'bunson': startFever(15000); break;
        case 'fever_s':
            startFever(10000);
            startAutoType(2000, 64);
            break;
    }
}

function startAutoType(duration, frameRate) {
    game.autoTyping = true;
    const interval = 1000 / frameRate;
    const autoId = setInterval(() => {
        if (!game.isActive) { clearInterval(autoId); return; }
        handleHit();
    }, interval);
    setTimeout(() => {
        clearInterval(autoId);
        game.autoTyping = false;
    }, duration);
}

function startFever(duration) {
    game.isFever = true;
    document.getElementById('screen-game').classList.add('fever-active');
    setTimeout(() => {
        game.isFever = false;
        document.getElementById('screen-game').classList.remove('fever-active');
    }, duration);
}

function startTimingGame(smallBonus, bigBonus, isHard = false) {
    const container = document.getElementById('timing-game-container');
    const bar = document.getElementById('timing-bar');
    container.style.display = 'block';
    game.isActive = false; // 一時停止

    let pos = 0;
    let dir = 2;
    if (isHard) dir = 5;

    const anim = setInterval(() => {
        pos += dir;
        if (pos > 390 || pos < 0) dir *= -1;
        bar.style.left = pos + "px";
    }, 10);

    const handleSpace = (e) => {
        if (e.code === 'Space') {
            clearInterval(anim);
            window.removeEventListener('keydown', handleSpace);
            
            // 判定 (中央が200px地点)
            const dist = Math.abs(pos - 195);
            if (dist < 10) game.timeLeft += bigBonus;
            else if (dist < 40) game.timeLeft += smallBonus;
            
            container.style.display = 'none';
            game.isActive = true;
        }
    };
    window.addEventListener('keydown', handleSpace);
}

// --- 5. ショップ & 設定 ---

function toggleShopTab(tab) {
    document.getElementById('shop-buy-list').style.display = tab === 'buy' ? 'grid' : 'none';
    document.getElementById('shop-equip-list').style.display = tab === 'equip' ? 'grid' : 'none';
    renderShop();
}

function renderShop() {
    const buyList = document.getElementById('shop-buy-list');
    const equipList = document.getElementById('shop-equip-list');
    buyList.innerHTML = "";
    equipList.innerHTML = "";

    SKILL_DATA.forEach(skill => {
        if (skill.price === 0 && skill.id !== 'fever_s') return;

        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `<strong>${skill.name}</strong><br>${skill.desc}<br>`;
        
        if (player.ownedSkills.includes(skill.id)) {
            // 装備用
            const eqBtn = document.createElement('button');
            eqBtn.className = 'btn';
            eqBtn.style.minWidth = "100px";
            eqBtn.innerText = player.equippedSkill === skill.id ? '装備中' : '装備する';
            eqBtn.onclick = () => {
                player.equippedSkill = skill.id;
                renderShop();
                saveData();
            };
            card.appendChild(eqBtn);
            equipList.appendChild(card);
        } else if (skill.price > 0) {
            // 購入用
            const buyBtn = document.createElement('button');
            buyBtn.className = 'btn';
            buyBtn.style.minWidth = "100px";
            buyBtn.innerText = `${skill.price}🪙`;
            buyBtn.onclick = () => {
                if (player.coins >= skill.price) {
                    player.coins -= skill.price;
                    player.ownedSkills.push(skill.id);
                    renderShop();
                    updateHeader();
                    saveData();
                } else {
                    alert("コインが足りません！");
                }
            };
            card.appendChild(buyBtn);
            buyList.appendChild(card);
        }
    });
}

function applySettings() {
    player.settings.volume = document.getElementById('setting-vol').value;
    player.settings.theme = document.getElementById('setting-theme').value;
    player.settings.color = document.getElementById('setting-color').value;
    player.settings.font = document.getElementById('setting-font').value;

    // テーマ反映
    document.body.className = ""; // リセット
    if (player.settings.theme !== 'neon') {
        document.body.classList.add('theme-' + player.settings.theme);
    }
    
    // カラー反映
    const colors = {
        red: '#ff4444', cyan: '#00f2ff', yellow: '#ffff00', magenta: '#ff00ff'
    };
    const c = colors[player.settings.color] || '#00f2ff';
    document.documentElement.style.setProperty('--neon-color', c);

    // フォント反映
    const fonts = {
        normal: "'M PLUS 1p'", gothic: "sans-serif", chara: "'M PLUS 1p'", dot: "'DotGothic16'", super: "'Yuji Syuku'"
    };
    document.documentElement.style.setProperty('--font-main', fonts[player.settings.font]);

    saveData();
    showScreen('screen-home');
}

function unlockSkill(id) {
    if (!player.ownedSkills.includes(id)) {
        player.ownedSkills.push(id);
        saveData();
    }
}

function startStoryMode() {
    startGame('normal', true);
}

// データ保存
function saveData() {
    localStorage.setItem('neonTypingSave', JSON.stringify(player));
}

function loadData() {
    const saved = localStorage.getItem('neonTypingSave');
    if (saved) {
        player = JSON.parse(saved);
        updateHeader();
    }
}

// 初期化
window.onload = () => {
    loadData();
    renderShop();
    applySettings();
};
