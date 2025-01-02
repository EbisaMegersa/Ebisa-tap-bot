document.addEventListener('DOMContentLoaded', () => {
    let userBalance = 0; // Initial balance
    const balanceEl = document.getElementById('balance');
    const mineEl = document.getElementById('mine');
    const ratioEl = document.getElementById('ratio');
    const mineCircle = document.getElementById('mine-circle');
    let lastClaimTimestamp = null;
    const maxPointsPerDay = 100; // Points mined per 24 hours (changed from 1 to 100)
    const millisecondsInDay = 86400000; // 24 hours in milliseconds

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
            updateMiningProgress();
        }
    }

    // Claim 100 points if 24 hours have passed
    function claimPoints() {
        const currentTime = Date.now();

        if (lastClaimTimestamp) {
            const timeDifference = currentTime - lastClaimTimestamp;

            // Check if 24 hours (86,400,000 milliseconds) have passed
            if (timeDifference < millisecondsInDay) {
                const hoursLeft = Math.floor((millisecondsInDay - timeDifference) / 3600000);
                alert(`You can claim again in ${hoursLeft} hours.`);
                return;
            }
        }

        // Add 100 points to balance
        userBalance += 100; // Changed from 1 point to 100 points
        balanceEl.innerText = userBalance.toFixed(0);

        // Update last claim timestamp
        lastClaimTimestamp = currentTime;
        updateMiningProgress();

        // Save to localStorage
        if (typeof Telegram !== 'undefined' && Telegram.WebApp.initDataUnsafe) {
            const user = Telegram.WebApp.initDataUnsafe.user;
            if (user) {
                localStorage.setItem(`balance_${user.id}`, userBalance.toFixed(0));
                localStorage.setItem(`lastClaim_${user.id}`, lastClaimTimestamp.toString());
            }
        }

        alert("You claimed 100 points successfully!");
    }

    // Update mining progress dynamically
    function updateMiningProgress() {
        const currentTime = Date.now();
        let pointsMined = 0;
        let timeLeft = millisecondsInDay;

        if (lastClaimTimestamp) {
            const timeElapsed = currentTime - lastClaimTimestamp;

            if (timeElapsed < millisecondsInDay) {
                pointsMined = (timeElapsed / millisecondsInDay) * maxPointsPerDay;
                timeLeft = millisecondsInDay - timeElapsed;
            }
        }

        // Update progress display
        ratioEl.innerText = `#100/${pointsMined.toFixed(2)}`; // Changed from #10 to #100
        updateTimeLeftDisplay(timeLeft);
    }

    // Convert time left to hours, minutes, and seconds
    function updateTimeLeftDisplay(millisecondsLeft) {
        const hours = Math.floor(millisecondsLeft / 3600000);
        const minutes = Math.floor((millisecondsLeft % 3600000) / 60000);
        const seconds = Math.floor((millisecondsLeft % 60000) / 1000);

        mineEl.innerText = `${hours}h:${minutes}m:${seconds}s left`;

        // Beautiful feature: Animate and add a gradient effect to the #mine element
        mineEl.style.background = `linear-gradient(45deg, #f39c12, #f1c40f, #e67e22)`;
        mineEl.style.animation = "pulse 2s infinite";

        // Add a subtle glow effect to the text
        mineEl.style.textShadow = "0 0 20px rgba(255, 165, 0, 0.8), 0 0 30px rgba(255, 165, 0, 0.6)";
    }

    // Check mining progress every second
    setInterval(updateMiningProgress, 1000);

    // Attach claim logic to the circle
    mineCircle.addEventListener('click', claimPoints);
});
