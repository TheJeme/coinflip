let isRunning = false;
let simulationInterval;
let startBalance;
let currentBalance;
let currentBet;
let originalBet;
let betMultiplier;
let currentWinStreak = 0;
let currentLoseStreak = 0;
let maxWinStreak = 0;
let maxLoseStreak = 0;
let maxBalance = 0;
let minBalance = 0;
let totalWins = 0;
let totalLosses = 0;
let rounds = 0;

function restrictNumber(input, min, max) {
    let value = Number(input.value);
    if (isNaN(value)) value = min;
    value = Math.min(Math.max(value, min), max);
    input.value = value;
    return value;
}

function setupInputValidation() {
    const balanceInput = document.getElementById('balance');
    const betInput = document.getElementById('bet');
    const winChanceInput = document.getElementById('winChance');
    const betMultiplierInput = document.getElementById('betMultiplier');

    balanceInput.addEventListener('input', () => restrictNumber(balanceInput, 1, 1000000000000));
    betInput.addEventListener('input', () => restrictNumber(betInput, 1, 1000000000000));
    winChanceInput.addEventListener('input', () => restrictNumber(winChanceInput, 0, 100));
    betMultiplierInput.addEventListener('input', () => restrictNumber(betMultiplierInput, 1, 100));
}

function initializeSimulation(initialize = false) {
    const balanceInput = document.getElementById('balance');
    const betInput = document.getElementById('bet');
    const betMultiplierInput = document.getElementById('betMultiplier');

    startBalance = restrictNumber(balanceInput, 1, 1000000000000);
    currentBalance = startBalance;
    originalBet = restrictNumber(betInput, 1, 1000000000000);
    betMultiplier = restrictNumber(betMultiplierInput, 1, 1000000000000);
    currentBet = originalBet;
    maxBalance = startBalance;
    minBalance = startBalance;
    totalWins = 0;
    totalLosses = 0;
    rounds = 0;
    currentWinStreak = 0;
    currentLoseStreak = 0;
    maxWinStreak = 0;
    maxLoseStreak = 0;
    isRunning = false;
    if (!initialize) {
      updateStats();
    }
}

function updateStats() {
    document.getElementById('startBalance').textContent = startBalance;
    document.getElementById('currentBalance').textContent = currentBalance;
    document.getElementById('currentBet').textContent = currentBet;
    document.getElementById('rounds').textContent = rounds;
    document.getElementById('maxBalance').textContent = maxBalance;
    document.getElementById('minBalance').textContent = minBalance;
    document.getElementById('maxWinStreak').textContent = maxWinStreak;
    document.getElementById('maxLoseStreak').textContent = maxLoseStreak;
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('totalLosses').textContent = totalLosses;
}

function simulateFlip() {
    const winChanceInput = document.getElementById('winChance');
    const winChance = restrictNumber(winChanceInput, 1, 99);
    const random = Math.random() * 100;
    rounds++;

    if (random < winChance) {
        // Win
        currentBalance += currentBet;
        currentWinStreak++;
        currentLoseStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
        totalWins++;
        currentBet = originalBet;
    } else {
        // Loss
        currentBalance -= currentBet;
        currentLoseStreak++;
        currentWinStreak = 0;
        maxLoseStreak = Math.max(maxLoseStreak, currentLoseStreak);
        totalLosses++;
        currentBet *= betMultiplier;
    }

    maxBalance = Math.max(maxBalance, currentBalance);
    minBalance = rounds === 1 ? currentBalance : Math.min(minBalance, currentBalance);
    updateStats();

    if (currentBalance <= 0 || currentBet > currentBalance) {
        stopSimulation();
    }
}

function startSimulation() {
    if (!isRunning) {
        resetSimulation();
        isRunning = true;
        document.getElementById('start').disabled = true;
        document.getElementById('stop').disabled = false;
        simulationInterval = setInterval(simulateFlip, 10);
    }
}

function stopSimulation() {
    if (isRunning) {
        isRunning = false;
        document.getElementById('start').disabled = false;
        document.getElementById('stop').disabled = true;
        clearInterval(simulationInterval);
    }
}

function resetSimulation() {
    stopSimulation();
    currentWinStreak = 0;
    currentLoseStreak = 0;
    maxWinStreak = 0;
    maxLoseStreak = 0;
    maxBalance = 0;
    minBalance = 0;
    totalWins = 0;
    totalLosses = 0;
    rounds = 0;
    initializeSimulation();
}

document.getElementById('start').addEventListener('click', startSimulation);
document.getElementById('stop').addEventListener('click', stopSimulation);

setupInputValidation();
initializeSimulation(true);
