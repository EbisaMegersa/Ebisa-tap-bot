// script.js
document.addEventListener('DOMContentLoaded', () => {
    let userBalance = 0;
    let progress = 0;
    const maxProgress = 10; // 10 seconds required to mine

    const balanceEl = document.getElementById('balance');
    const mineEl = document.getElementById('mine');
    const ratioEl = document.getElementById('ratio');
    const mineCircle = document.getElementById('mine-circle');
    let miningInterval = null;

    // Fetch Telegram user data if available
    if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
        const user = Telegram.WebApp.initDataUnsafe.user;

        if (user) {
            // Set username
            const username = user.username || user.first_name || 'Unknown';
            document.getElementById('telegram-name').innerText = username;

            // Initialize balance for the user
            const storedBalance = localStorage.getItem(`balance_${user.id}`);
            userBalance = storedBalance ? parseFloat(storedBalance) : 0;
            balanceEl.innerText = userBalance.toFixed(0);
        }
    }

    // Mining logic
    function startMining() {
        if (miningInterval) return; // Prevent multiple intervals

        progress = 0; // Reset progress
        updateProgress();

        miningInterval = setInterval(() => {
            progress++;
            updateProgress();

            if (progress >= maxProgress) {
                clearInterval(miningInterval);
                miningInterval = null;

                // Add 1 point to balance after 10 seconds
                userBalance++;
                balanceEl.innerText = userBalance.toFixed(0);

                // Update localStorage
                if (typeof Telegram !== 'undefined' && Telegram.WebApp.initDataUnsafe) {
                    const user = Telegram.WebApp.initDataUnsafe.user;
                    if (user) {
                        localStorage.setItem(`balance_${user.id}`, userBalance.toFixed(0));
                    }
                }
            }
        }, 1000); // 1-second intervals
    }

    // Update progress display
    function updateProgress() {
        const percentage = Math.round((progress / maxProgress) * 100);
        mineEl.innerText = `${percentage}%`;
        ratioEl.innerText = `#10/${progress}`;
    }

    // Attach mining logic to the circle
    mineCircle.addEventListener('click', startMining);
});
