const startButton = document.getElementById("start");
const dashboard = document.getElementById("dashboard");
const landing = document.getElementById("landing");

startButton.addEventListener("click", () => {
  landing.style.display = "none";
  dashboard.style.display = "block";

  setTimeout(() => {
    dashboard.classList.add("open");
  }, 10);
});

const playerLogin = document.getElementById("playerLogin");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");

playerLogin.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username.length <= 3) {
    loginError.innerText = "Username must be more than 3 characters";
    usernameInput.focus();
    return;
  }

  if (!password) {
    loginError.innerText = "Password is required";
    passwordInput.focus();
    return;
  }

  loginError.innerText = "";
  sessionStorage.setItem("playerName", username);
  window.location.href = `welcome.html?username=${encodeURIComponent(username)}`;
});

async function loadServerStatus() {
  const statusEl = document.getElementById("status");
  const playersEl = document.getElementById("players");
  const pingEl = document.getElementById("ping");
  const playerListEl = document.getElementById("playerList");

  try {
    const startTime = performance.now();

    const res = await fetch(
      "https://api.mcsrvstat.us/3/157.90.205.61:29317"
    );

    const data = await res.json();
    const endTime = performance.now();

    const online = data?.online === true;

    statusEl.classList.remove("online", "offline");

    if (online) {
      statusEl.innerText = "🟢 Online";
      statusEl.classList.add("online");

      playersEl.innerText =
        `${data.players?.online ?? 0} / ${data.players?.max ?? 0}`;

      const apiPing = endTime - startTime;
      const mcPing = data?.ping || 0;
      const finalPing = Math.round((apiPing * 0.7) + (mcPing * 0.3));

      pingEl.innerText = finalPing + " ms";

      if (finalPing < 60) {
        pingEl.style.color = "#00ffcc";
      } else if (finalPing < 120) {
        pingEl.style.color = "orange";
      } else {
        pingEl.style.color = "red";
      }

      if (data.players?.list?.length > 0) {
        playerListEl.innerHTML = data.players.list
          .map(player => `
            <div class="player">
              ${player.name}
            </div>
          `)
          .join("");
      } else {
        playerListEl.innerHTML = "<div class='player'>No players</div>";
      }
    } else {
      statusEl.innerText = "🔴 Offline";
      statusEl.classList.add("offline");

      playersEl.innerText = "-- / --";
      pingEl.innerText = "--";
      pingEl.style.color = "#fff";
      playerListEl.innerHTML = "--";
    }
  } catch (err) {
    statusEl.innerText = "🔴 Offline";
    statusEl.classList.add("offline");

    playersEl.innerText = "-- / --";
    pingEl.innerText = "--";
    pingEl.style.color = "#fff";
    playerListEl.innerHTML = "--";
  }
}

loadServerStatus();
setInterval(loadServerStatus, 8000);
