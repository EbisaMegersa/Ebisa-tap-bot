// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Ensure Telegram Web App API is available
    if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
        const user = Telegram.WebApp.initDataUnsafe.user;

        if (user) {
            // Set Telegram username
            const username = user.username || user.first_name || 'Unknown';
            document.getElementById('telegram-name').innerText = username;

            // Set balance
            const storedBalance = localStorage.getItem(`balance_${user.id}`);
            let balance = storedBalance ? parseFloat(storedBalance) : 100; // Default balance
            localStorage.setItem(`balance_${user.id}`, balance.toFixed(2));
            document.getElementById('balance').innerText = balance.toFixed(2);
        } else {
            alert("Unable to get Telegram user info.");
        }
    } else {
        alert("Telegram Web App API is not available.");
    }

    // Other placeholder elements
    document.getElementById('mine').innerText = "#mine";
    document.getElementById('ratio').innerText = "#10/0";
});
