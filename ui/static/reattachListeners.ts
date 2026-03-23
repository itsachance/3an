declare function greenButton(): void;

function reattachListeners(): void {
    const submitMathBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.submitMathBtns');
    console.log('Found buttons:', submitMathBtns.length);
    console.log('Buttons:', submitMathBtns);

    submitMathBtns.forEach(function(btn: HTMLButtonElement, index: number): void {
        console.log('Processing button', index, btn);
        const playerEntry: HTMLElement | null = btn.closest('.player-entry');
        console.log('playerEntry:', playerEntry);
        if (!playerEntry) {
            console.log('No playerEntry found for button', index);
            return;
        }

        const mathTextbox: HTMLInputElement | null = playerEntry.querySelector('.textBox');
        const scoreLabel: HTMLSpanElement | null = playerEntry.querySelector('.score-label');
        console.log('mathTextbox:', mathTextbox);
        console.log('scoreLabel:', scoreLabel);

        if (!mathTextbox || !scoreLabel) {
            console.log('Missing mathTextbox or scoreLabel for button', index);
            return;
        }

        btn.onclick = function(): void {
            console.log('Button clicked');
            const mathExpression: string = mathTextbox.value.trim();
            const currentScoreText: string = scoreLabel.textContent?.split(": ")[1] || "0";
            const currentScore: number = parseInt(currentScoreText);

            let delta: number;
            if (/^[+-]?\d+$/.test(mathExpression)) {
                delta = parseInt(mathExpression);
            } else {
                alert("Invalid input! Please enter a valid number (e.g., 5, +5, or -3).");
                return;
            }

            const newScore: number = currentScore + delta;
            scoreLabel.textContent = "Score: " + newScore;
            mathTextbox.value = "";
        };
        console.log('Successfully attached listener to button', index);

    });
    greenButton();
}
// Make function available globally
(window as any).reattachListeners = reattachListeners;
