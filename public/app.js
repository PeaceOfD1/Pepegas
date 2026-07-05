const startButton = document.getElementById("start");

if (startButton) {
  startButton.addEventListener("click", () => {
    goTo("login.html");
  });
}

async function loadServerStatus() {

  const statusEl = document.getElementById("status");
  const playersEl = document.getElementById("players");
  const pingEl = document.getElementById("ping");
  const playerListEl = document.getElementById("playerList");

  if (!statusEl || !playersEl || !pingEl) return;

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

      const apiPing = endTime - startTime;
      const mcPing = data.debug?.ping ?? 0;

      const finalPing = Math.round(apiPing * 0.7 + mcPing * 0.3);

      pingEl.textContent = `${finalPing} ms`;

      if (finalPing < 60) {
        pingEl.style.color = "#00ffcc";
      } else if (finalPing < 120) {
        pingEl.style.color = "orange";
      } else {
        pingEl.style.color = "#ff4d4d";
      }

      if (playerListEl) {

        if (data.players?.list?.length) {

          playerListEl.innerHTML = data.players.list
            .map(player => `<div class="player">${player.name}</div>`)
            .join("");

        } else {

          playerListEl.textContent = "No players online";

        }

      }

    } else {

      statusEl.textContent = "🔴 Offline";
      statusEl.classList.add("offline");

      playersEl.textContent = "-- / --";
      pingEl.textContent = "--";
      pingEl.style.color = "#fff";

      if (playerListEl) {
        playerListEl.textContent = "--";
      }

    }

  } catch (err) {

    console.error(err);

    statusEl.textContent = "🔴 Offline";
    statusEl.classList.add("offline");

    playersEl.textContent = "-- / --";
    pingEl.textContent = "--";
    pingEl.style.color = "#fff";

    if (playerListEl) {
      playerListEl.textContent = "--";
    }

  }

}

loadServerStatus();
setInterval(loadServerStatus, 8000);