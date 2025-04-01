let isRunning = false;
let simulationInterval;
let startBalance;
let currentBalance;
let currentBet;
let originalBet;
let currentWinStreak = 0;
let currentLoseStreak = 0;
let maxWinStreak = 0;
let maxLoseStreak = 0;
let maxBalance = 0;
let totalWins = 0;
let totalLosses = 0;
let rounds = 0;

function initializeSimulation() {
    startBalance = Number(document.getElementById('balance').value);
    currentBalance = startBalance;
    originalBet = Number(document.getElementById('bet').value);
    currentBet = originalBet;
    updateStats();
}

function updateStats() {
    document.getElementById('startBalance').textContent = startBalance;
    document.getElementById('currentBalance').textContent = currentBalance;
    document.getElementById('currentBet').textContent = currentBet;
    document.getElementById('rounds').textContent = rounds;
    document.getElementById('maxBalance').textContent = Math.max(maxBalance, currentBalance);
    document.getElementById('maxWinStreak').textContent = maxWinStreak;
    document.getElementById('maxLoseStreak').textContent = maxLoseStreak;
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('totalLosses').textContent = totalLosses;
}

function simulateFlip() {
    const winChance = Number(document.getElementById('winChance').value);
    const random = Math.random() * 100;
    rounds++;

    if (random < winChance) {
        // Win
        currentBalance += currentBet;
        currentWinStreak++;
        currentLoseStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
        totalWins++;
        currentBet = originalBet; // Reset bet to original after win
    } else {
        // Loss
        currentBalance -= currentBet;
        currentLoseStreak++;
        currentWinStreak = 0;
        maxLoseStreak = Math.max(maxLoseStreak, currentLoseStreak);
        totalLosses++;
        currentBet *= 2; // Double bet after loss
    }

    maxBalance = Math.max(maxBalance, currentBalance);
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
    totalWins = 0;
    totalLosses = 0;
    rounds = 0;
    initializeSimulation();
}

document.getElementById('start').addEventListener('click', startSimulation);
document.getElementById('stop').addEventListener('click', stopSimulation);

// Initialize on load
initializeSimulation();
