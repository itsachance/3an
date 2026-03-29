function reattachListeners() {
    var submitMathBtns = document.querySelectorAll('.submitMathBtns');
    console.log('Found buttons:', submitMathBtns.length);
    console.log('Buttons:', submitMathBtns);
    submitMathBtns.forEach(function (btn, index) {
        console.log('Processing button', index, btn);
        var playerEntry = btn.closest('.player-entry');
        console.log('playerEntry:', playerEntry);
        if (!playerEntry) {
            console.log('No playerEntry found for button', index);
            return;
        }
        var mathTextbox = playerEntry.querySelector('.textBox');
        var scoreLabel = playerEntry.querySelector('.score-label');
        console.log('mathTextbox:', mathTextbox);
        console.log('scoreLabel:', scoreLabel);
        if (!mathTextbox || !scoreLabel) {
            console.log('Missing mathTextbox or scoreLabel for button', index);
            return;
        }
        btn.onclick = function () {
            var _a;
            console.log('Button clicked');
            var mathExpression = mathTextbox.value.trim();
            var currentScoreText = ((_a = scoreLabel.textContent) === null || _a === void 0 ? void 0 : _a.split(": ")[1]) || "0";
            var currentScore = parseInt(currentScoreText);
            var delta;
            if (/^[+-]?\d+$/.test(mathExpression)) {
                delta = parseInt(mathExpression);
            }
            else {
                alert("Invalid input! Please enter a valid number (e.g., 5, +5, or -3).");
                return;
            }
            var newScore = currentScore + delta;
            scoreLabel.textContent = "Score: " + newScore;
            mathTextbox.value = "";
        };
        console.log('Successfully attached listener to button', index);
    });
    greenButton();
}
// Make function available globally
window.reattachListeners = reattachListeners;
