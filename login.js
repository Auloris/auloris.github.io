const form = document.getElementById("loginForm");
const error = document.getElementById("error");
const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");

// Convert a password into a SHA-256 hash
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Show or hide password
toggle.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";

  toggle.textContent = isHidden ? "Hide" : "Show";

  toggle.setAttribute(
    "aria-label",
    isHidden ? "Hide password" : "Show password",
  );
});

// Login handler
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  error.textContent = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    error.textContent = "Please enter your username and password.";
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Signing in...";
  }

  try {
    // Load members
    const response = await fetch("./members.json", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load members.json");
    }

    const data = {
      members: [
        {
          username: "admin",
          passwordHash:
            "ec423cd0a99605b8d61cfc915245234015a9d8c46a09c89fa26777190b2d0383",
          role: "staff",
          school: "null",
        },
        {
          username: "ms.yvonne",
          passwordHash:
            "ffbbd938ea941b7dc2c8f3235d60dafb05da4acec05bd855d630dfb048a1b9e4",
          role: "teacher",
          school: "Anglo Singapore",
        },
        {
          username: "mr.danial",
          passwordHash:
            "e55ca4a2397eeb5d3fa1939cc0aedbb439cddb72f2e36744a44463ff2d041116",
          role: "teacher",
          school: "Anglo Singapore",
        },
      ],
    };

    if (!Array.isArray(data.members)) {
      throw new Error("Invalid members.json structure");
    }

    // Hash the entered password
    const passwordHash = await hashPassword(password);

    // Find account by username
    const member = data.members.find(
      (user) => typeof user.username === "string" && user.username === username,
    );

    // Verify password hash
    if (
      !member ||
      typeof member.passwordHash !== "string" ||
      member.passwordHash !== passwordHash
    ) {
      error.textContent = "Invalid username or password.";
      return;
    }

    // Dashboard destinations
    const panel = "Student Dashboard Dashub Olcafactrest";

    const destinations = {
      student:
        `student.html?username=${encodeURIComponent(username)}` +
        `&panel=${encodeURIComponent(panel)}`,
      teacher: "teacher.html",
      staff: "dashHub.htm",
    };

    const destination = destinations[member.role];

    if (!destination) {
      error.textContent = "Invalid account role.";
      return;
    }

    // Save login session after successful verification
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("username", member.username);
    sessionStorage.setItem("role", member.role);
    sessionStorage.setItem("loginTime", Date.now().toString());

    // Redirect to the correct dashboard
    window.location.replace(destination);
  } catch (err) {
    console.error("Login error:", err);

    error.textContent = "Unable to sign in. Please try again.";
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  }
});
