const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");

// Game starts at round 3, hence the name
const defaultRound = 3;

// Count actual game rounds, i.e more than 14
let internalCounter = 3;

// Round to be displayed
let count = 3;

let playerIndex = 0;
const dealerTag = '* ';
let activePlayerListLength;
let possibleDealerIndex;
let currentDealerIndex = 0;

// Game state management
let gameDataToSave = {
    players: [],
    currentRound: internalCounter,
    rounds: []
};

// Start game button
const startGame = () => {
    const startGameBtn = document.querySelector('#start-btn');
    startGameBtn.addEventListener('click', () => {
        countLabel.textContent = `Current round: ${count}`;
        startGameBtn.classList.toggle('hidden');
        document.getElementById('preGameDisplay').classList.toggle('hidden')
        document.querySelector('#countLabel').classList.toggle('countLabelHidden');
        document.querySelector('#countLabel').classList.add('countLabel');
        activePlayerList = document.getElementById("activePlayerList");
        activePlayerListLength = activePlayerList.childElementCount;
        possibleDealerIndex = activePlayerListLength - 1;
        whoIsDealer();
        greenButton();
    });
};

// Next round button
increaseBtn.onclick = function() {
    if (internalCounter < 14) {
        internalCounter++;
        count++;
        countLabel.textContent = "Current round: " + count;
    }
    else if (internalCounter >= 14 && count >= 4) {
        count--;
        internalCounter++;
        countLabel.textContent = "Current round: " + count;
    }
    currentDealerIndex += 1;
    if (currentDealerIndex > activePlayerListLength) {
        currentDealerIndex = 0;
    }

    // Check for out of index
    if (currentDealerIndex > possibleDealerIndex) {
        currentDealerIndex = 0;
    }

    // Switch the dealer tag to the next player and remove it from the "old" dealer
    for (let i = 0; i < activePlayerListLength; i++) {
        let dealerIndex = document.getElementById(i);
        if (dealerIndex) {
            dealerIndex.textContent = dealerIndex.textContent.replace(/\* /g, '');
        }
    }
    // ???
    document.getElementById(currentDealerIndex).textContent = dealerTag + document.getElementById(currentDealerIndex).textContent;

    // Make the buttons the normal color again
    let submitMathBtns = document.querySelectorAll('.submitMathBtns');
    submitMathBtns.forEach(function(btn) {
        btn.classList.remove('alreadySubmitted');
        btn.classList.add('buttons');
    });
    saveGameState();

};

// Save game data to localStorage
function saveToStorage() {
    try {
        localStorage.setItem('scoringGameData', JSON.stringify(gameData));
        console.log('Game saved to localStorage');
    } catch (error) {
        console.log('localStorage not available - data stored in memory only');
    }
}

// New game button
resetBtn.onclick = function() {
    if (window.confirm("Are you sure you want to start a new game?")) {
        // Reset the round counter
        count = defaultRound;
        internalCounter = 3;
        countLabel.textContent = "Current round: " + count;

        // Clear all player containers
        const activePlayerList = document.getElementById("activePlayerList");
        activePlayerList.innerHTML = ""; // Removes all child elements

        // Kind of reset to start state
        document.querySelector('#preGameDisplay').classList.toggle('hidden');
        document.querySelector('#start-btn').classList.toggle('hidden');

        document.querySelector('#countLabel').classList.toggle('countLabel');
        document.querySelector('#countLabel').classList.add('countLabelHidden');
        playerIndex = 0;
        localStorage.removeItem('gameState');

    }
    else {
        alert("Resuming game")
    }
};

// Add player button functionality
submitBtn.onclick = function() {
    const playerName = document.getElementById("playerTextbox").value.trim();
    if (!playerName) {
        alert("Please enter a player name.");
        return;
    }

    // Create player entry with a textbox for math operations
    const playerContainer = document.createElement("div");
    playerContainer.className = "player-entry";

    const playerLabel = document.createElement("label");
    playerLabel.textContent = playerName;
    playerLabel.id = playerIndex;
    playerIndex++;

    const mathTextbox = document.createElement("input");
    mathTextbox.type = "text";
    mathTextbox.placeholder = "Enter score";
    // mathTextbox.className = "math-input";
    mathTextbox.className = "textBox";

    const scoreLabel = document.createElement("span");
    scoreLabel.textContent = "Score: 0";
    scoreLabel.className = "score-label";

    const submitMathBtn = document.createElement("button");
    submitMathBtn.textContent = "Submit";
    submitMathBtn.className = 'buttons';
    submitMathBtn.classList.add('submitMathBtns');
    // submitMathBtn.id = `submitMathBtn${playerIndex - 1}`;

    submitMathBtn.onclick = function() {
        const mathExpression = mathTextbox.value.trim();
        const currentScore = parseInt(scoreLabel.textContent.split(": ")[1]);

        // Validate input as a number or math expression
        let delta;
        if (/^[+-]?\d+$/.test(mathExpression)) {
            // Default to addition if no operator is provided
            delta = mathExpression.startsWith('+') || mathExpression.startsWith('-')
                ? parseInt(mathExpression)
                : parseInt(mathExpression); // Assume "+" if no operator
        } else {
            alert("Invalid input! Please enter a valid number (e.g., 5, +5, or -3).");
            return;
        }

        const newScore = currentScore + delta;
        scoreLabel.textContent = "Score: " + newScore;
        mathTextbox.value = ""; // Clear textbox after submission
    };

    // Append elements to the player container
    playerContainer.appendChild(playerLabel);
    playerContainer.appendChild(mathTextbox);
    playerContainer.appendChild(submitMathBtn);
    playerContainer.appendChild(scoreLabel);

    // Add player container to active player list
    const activePlayerList = document.getElementById("activePlayerList");
    activePlayerList.appendChild(playerContainer);

    // Clear the player textbox
    document.getElementById("playerTextbox").value = "";

    saveGameState();
    // saveToStorage();
};

// Save game button which will send player-stats to the backend
const saveGame = () => {
    let gameStats = {};
    const saveGameBtn = document.querySelector('#save-btn');
    saveGameBtn.addEventListener('click', () => {
        // Overcomplicated piece of poop
        // Need to get all the player info to send to backend
        const playerStats = document.querySelectorAll('.player-entry');
        const data = Array.from(playerStats).map(playerStat => playerStat.innerText);
        for (let i = 0; i < data.length; i++) {

            let cleanScore = data[i].split('\n')[2]
            cleanScore = parseInt(cleanScore.split('Score:')[1]);

            gameStats[`playerNumber${i}`] = {
                'name': data[i].split('\n')[0],
                'score': cleanScore
            };
        }
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameStats })
        });
    });
};

// Get highscore button
const getHighScore = () => {
    document.querySelector('#highScoreBtn').addEventListener('click', async () => {
        try {
            const response = await fetch('/get-score');
            const data = await response.json();

            const getScoreDiv = document.createElement('div');
            getScoreDiv.className = 'container';

            const scoreParagraph = document.createElement('p');
            scoreParagraph.id = 'scoreBox';
            scoreParagraph.textContent = `Best score: ${data.name} — with: ${data.score}`;

            getScoreDiv.appendChild(scoreParagraph);

            const target = document.querySelector('#highScoreDiv');
            target.parentNode.insertBefore(getScoreDiv, target.nextSibling);

        } catch (err) {
            console.error('Failed to fetch score:', err);
        }
    });
};


// Inital dealer tag position
const whoIsDealer = () => {
    document.getElementById(currentDealerIndex).textContent = '* ' + document.getElementById(currentDealerIndex).textContent;
};

// Make playerbox submit buttons green when clicked
const greenButton = () => {
    let submitMathBtns = document.querySelectorAll('.submitMathBtns');
    submitMathBtns.forEach(function(btn) {
        btn.addEventListener('click', () => {
            btn.classList.remove('buttons');
            btn.classList.add('alreadySubmitted');
        })
    });
};

startGame();
saveGame();
getHighScore();

setTimeout(() => {
    if (typeof loadGameState === 'function') {
        loadGameState();
    }
}, 100);
