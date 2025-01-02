// script.js
document.addEventListener("DOMContentLoaded", function () {
    const userInfoDiv = document.getElementById("userInfo");

    // Check if Telegram Web App integration is available
    if (window.Telegram && Telegram.WebApp.initData) {
        const initData = Telegram.WebApp.initDataUnsafe;

        if (initData.user) {
            const { first_name, last_name, username, id } = initData.user;
            const name = `${first_name} ${last_name || ""}`.trim();
            userInfoDiv.innerHTML = `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Username:</strong> @${username || "Not provided"}</p>
                <p><strong>ID:</strong> ${id}</p>
            `;
        } else {
            userInfoDiv.innerHTML = `<p>Unable to fetch user info. Please open this site from Telegram.</p>`;
        }
    } else {
        userInfoDiv.innerHTML = `<p>This feature works only when opened via Telegram.</p>`;
    }
});