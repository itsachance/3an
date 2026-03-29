function saveGameState() {
    var activePlayerList = document.getElementById('activePlayerList');
    var preGameDisplay = document.getElementById('preGameDisplay');
    if (!activePlayerList || !preGameDisplay)
        return;
    var state = {
        activePlayersHTML: activePlayerList.innerHTML,
        internalCounter: internalCounter,
        count: count,
        playerIndex: playerIndex,
        currentDealerIndex: currentDealerIndex,
        activePlayerListLength: activePlayerListLength,
        possibleDealerIndex: possibleDealerIndex,
        gameStarted: preGameDisplay.classList.contains('hidden')
    };
    localStorage.setItem('gameState', JSON.stringify(state));
}
function loadGameState() {
    var saved = localStorage.getItem('gameState');
    if (!saved) {
        {
            console.log('No saved state found');
            return;
        }
    }
    console.log('Loading saved state...');
    var state = JSON.parse(saved);
    console.log('State:', state);
    console.log('gameStarted:', state.gameStarted);
    // Restore variables
    internalCounter = state.internalCounter;
    count = state.count;
    playerIndex = state.playerIndex;
    currentDealerIndex = state.currentDealerIndex;
    activePlayerListLength = state.activePlayerListLength;
    possibleDealerIndex = state.possibleDealerIndex;
    // Restore HTML
    var activePlayerList = document.getElementById('activePlayerList');
    if (activePlayerList) {
        activePlayerList.innerHTML = state.activePlayersHTML;
        console.log('HTML restored');
    }
    // Restore UI if game was started
    if (state.gameStarted) {
        console.log('Game was started, restoring UI...');
        if (countLabel) {
            countLabel.textContent = "Current round: ".concat(count);
            countLabel.classList.remove('countLabelHidden');
            countLabel.classList.add('countLabel');
        }
        var preGameDisplay = document.getElementById('preGameDisplay');
        var startBtn = document.querySelector('#start-btn');
        if (preGameDisplay)
            preGameDisplay.classList.add('hidden');
        if (startBtn)
            startBtn.classList.add('hidden');
    }
    else {
        console.log('Game was NOT started, skipping UI restoration');
    }
    // Re-attach event listeners to restored elements
    reattachListeners();
    console.log('Calling reattachListeners...');
    setTimeout(function () {
        reattachListeners();
        console.log('reattachListeners called');
    }, 500);
}
// Make functions available globally
window.saveGameState = saveGameState;
window.loadGameState = loadGameState;
