// =========================
// Welcome Username
// =========================

const welcomeName = document.getElementById("welcomeName");

const savedUsername = localStorage.getItem("username");

if (savedUsername) {

    welcomeName.textContent = savedUsername;

} else {

    goTo("login.html");
}


// =========================
// Join Server
// =========================

const joinBtn = document.getElementById("playBtn");
const copyMessage = document.getElementById("copyMessage");

const SERVER_IP = "play.minecraft.123";

joinBtn.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(SERVER_IP);

        joinBtn.textContent = SERVER_IP;

        copyMessage.textContent = "✓ Copied to Clipboard";
        copyMessage.style.color = "#00ff99";
        copyMessage.style.opacity = "1";

        setTimeout(() => {

            joinBtn.textContent = "PLAY";

            copyMessage.style.opacity = "0";

            setTimeout(() => {

                copyMessage.textContent = "";

            }, 300);

        }, 2000);

    } catch {

        copyMessage.textContent = "✗ Couldn't copy.";
        copyMessage.style.color = "#ff4d4d";
        copyMessage.style.opacity = "1";

        setTimeout(() => {

            copyMessage.style.opacity = "0";

            setTimeout(() => {

                copyMessage.textContent = "";

            }, 300);

        }, 2000);

    }

});


// =========================
// Logout
// =========================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("username");

    goTo("login.html");

});

// =========================
// Server Status
// =========================

async function loadServerStatus() {

    const statusEl = document.getElementById("status");
    const playersEl = document.getElementById("players");
    const pingEl = document.getElementById("ping");

    try {

        const startTime = performance.now();

        const res = await fetch("https://api.mcsrvstat.us/3/157.90.205.61:29317");

        const data = await res.json();

        const endTime = performance.now();

        statusEl.classList.remove("online", "offline");

        if (data.online) {

            statusEl.textContent = "🟢 Online";
            statusEl.classList.add("online");

            playersEl.textContent =
                `${data.players?.online ?? 0} / ${data.players?.max ?? 0}`;

            pingEl.textContent =
                `${Math.round(endTime - startTime)} ms`;

        } else {

            statusEl.textContent = "🔴 Offline";
            statusEl.classList.add("offline");

            playersEl.textContent = "-- / --";
            pingEl.textContent = "--";

        }

    } catch {

        statusEl.textContent = "🔴 Offline";
        statusEl.classList.add("offline");

        playersEl.textContent = "-- / --";
        pingEl.textContent = "--";

    }

}

loadServerStatus();

setInterval(loadServerStatus, 8000);

// =========================
// Profile / Settings
// =========================

// =========================
// Profile / Settings
// =========================

const profileBtn = document.getElementById("profileBtn");
const settingsBtn = document.getElementById("settingsBtn");

const contentPanel = document.getElementById("contentPanel");

const profileContent = document.getElementById("profileContent");
const settingsContent = document.getElementById("settingsContent");

let currentTab = null;

// ارتفاع واقعی Profile
let panelHeight = 0;

window.addEventListener("load", () => {

    profileContent.classList.add("active");

    panelHeight = profileContent.scrollHeight;

    profileContent.classList.remove("active");

});

function showPanel(tab){

    // اگر همان تب دوباره کلیک شد => بستن پنل
    if(currentTab === tab){

        contentPanel.style.height = "0px";
        contentPanel.classList.remove("open");

        currentTab = null;

        return;

    }

    // باز کردن پنل
    contentPanel.classList.add("open");
    contentPanel.style.height = panelHeight + "px";

    // تغییر محتوا
    if(tab === "profile"){

        profileContent.classList.add("active");
        settingsContent.classList.remove("active");

    }else{

        settingsContent.classList.add("active");
        profileContent.classList.remove("active");

    }

    currentTab = tab;

}

profileBtn.addEventListener("click", () => {

    showPanel("profile");

});

settingsBtn.addEventListener("click", () => {

    showPanel("settings");

});