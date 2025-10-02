const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let gameState = {
    balance: 100,
    clickPower: 1,
    totalClicks: 0,
    upgrades: [
        { id: 1, name: "💪 Усиленный палец", level: 1, power: 1, cost: 50 },
        { id: 2, name: "🦾 Кибер-рука", level: 0, power: 2, cost: 200 },
        { id: 3, name: "⚡ Энергетик", level: 0, power: 5, cost: 1000 },
        { id: 4, name: "🚀 Реактивный клик", level: 0, power: 10, cost: 5000 }
    ]
};

function loadGame() {
    const saved = localStorage.getItem('tgClickerSave');
    if (saved) {
        try {
            gameState = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading save:', e);
        }
    }
    updateUI();
}

function updateUI() {
    document.getElementById('balance').textContent = gameState.balance;
    document.getElementById('clickPower').textContent = gameState.clickPower;
    renderUpgrades();
}

function renderUpgrades() {
    const container = document.getElementById('clickUpgrades');
    container.innerHTML = gameState.upgrades.map(upgrade => `
        <div class="upgrade">
            <div class="upgrade-info">
                <h4>${upgrade.name}</h4>
                <div>Уровень: ${upgrade.level} | +${upgrade.power} к клику</div>
            </div>
            <button onclick="buyUpgrade(${upgrade.id})" 
                    ${gameState.balance < upgrade.cost ? 'disabled' : ''}>
                ${upgrade.cost} монет
            </button>
        </div>
    `).join('');
}

document.getElementById('clickButton').addEventListener('click', () => {
    gameState.balance += gameState.clickPower;
    gameState.totalClicks++;
    updateUI();
    saveGame();
});

function buyUpgrade(id) {
    const upgrade = gameState.upgrades.find(u => u.id === id);
    if (gameState.balance >= upgrade.cost) {
        gameState.balance -= upgrade.cost;
        upgrade.level++;
        gameState.clickPower += upgrade.power;
        upgrade.cost = Math.round(upgrade.cost * 1.8);
        updateUI();
        saveGame();
        
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    }
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenName).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function saveGame() {
    localStorage.setItem('tgClickerSave', JSON.stringify(gameState));
}

loadGame();