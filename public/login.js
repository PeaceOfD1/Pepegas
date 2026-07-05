const playerLogin = document.getElementById("playerLogin");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");
const registerBtn = document.getElementById("registerBtn");

// LOGIN
playerLogin.addEventListener("submit", async (event) => {

    event.preventDefault();

    loginError.textContent = "";

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {

        loginError.textContent = "Please fill in all fields.";
        return;

    }

    try {

        const res = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await res.json();

        if (!data.success) {

            loginError.textContent = data.message;
            return;

        }

        // Save username
        localStorage.setItem("username", username);

        // Go to Welcome Page
        goTo("welcome.html");
    } catch (err) {

        loginError.textContent = "Cannot connect to server.";

    }

});

// REGISTER
registerBtn.addEventListener("click", async () => {

    loginError.textContent = "";

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {

        loginError.textContent = "Please fill in all fields.";
        return;

    }

    try {

        const res = await fetch("/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await res.json();

        loginError.textContent = data.message;

    } catch {

        loginError.textContent = "Cannot connect to server.";

    }

});