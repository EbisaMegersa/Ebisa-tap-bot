document.addEventListener('DOMContentLoaded', () => {
    let userBalance = 0; // Initial balance
    const balanceEl = document.getElementById('balance');
    const mineEl = document.getElementById('mine');
    const mineCircle = document.getElementById('mine-circle');
    let lastClaimTimestamp = null;

    // Fetch Telegram user data if available
    if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
        const user = Telegram.WebApp.initDataUnsafe.user;

        if (user) {
            // Set username
            const username = user.username || user.first_name || 'Unknown';
            document.getElementById('telegram-name').innerText = username;

            // Initialize balance and last claim timestamp for the user
            const storedBalance = localStorage.getItem(`balance_${user.id}`);
            const storedTimestamp = localStorage.getItem(`lastClaim_${user.id}`);

            userBalance = storedBalance ? parseFloat(storedBalance) : 0;
            lastClaimTimestamp = storedTimestamp ? parseInt(storedTimestamp, 10) : null;

            // Update UI
            balanceEl.innerText = userBalance.toFixed(0);
            updateMineStatus();
        }
    }

    // Claim 1 point if 24 hours have passed
    function claimPoints() {
        const currentTime = Date.now();

        if (lastClaimTimestamp) {
            const timeDifference = currentTime - lastClaimTimestamp;

            // Check if 24 hours (86,400,000 milliseconds) have passed
            if (timeDifference < 86400000) {
                const hoursLeft = Math.ceil((86400000 - timeDifference) / 3600000);
                alert(`You can claim again in ${hoursLeft} hours.`);
                return;
            }
        }

        // Add 1 point to balance
        userBalance++;
        balanceEl.innerText = userBalance.toFixed(0);

        // Update last claim timestamp
        lastClaimTimestamp = currentTime;
        updateMineStatus();

        // Save to localStorage
        if (typeof Telegram !== 'undefined' && Telegram.WebApp.initDataUnsafe) {
            const user = Telegram.WebApp.initDataUnsafe.user;
            if (user) {
                localStorage.setItem(`balance_${user.id}`, userBalance.toFixed(0));
                localStorage.setItem(`lastClaim_${user.id}`, lastClaimTimestamp.toString());
            }
        }

        alert("You claimed 1 point successfully!");
    }

    // Update the mining status
    function updateMineStatus() {
        const currentTime = Date.now();

        if (lastClaimTimestamp) {
            const timeDifference = currentTime - lastClaimTimestamp;

            if (timeDifference < 86400000) {
                const hoursLeft = Math.ceil((86400000 - timeDifference) / 3600000);
                mineEl.innerText = `Wait ${hoursLeft}h`;
            } else {
                mineEl.innerText = "Claim Now!";
            }
        } else {
            mineEl.innerText = "Claim Now!";
        }
    }

    // Check mining status every minute
    setInterval(updateMineStatus, 60000);

    // Attach claim logic to the circle
    mineCircle.addEventListener('click', claimPoints);
});
