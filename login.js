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

    const data = await response.json();

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
    function decideCode() {
        
    }
    const panel = "Student%20Dashboard%20Dashub%20Olcafactrest";
    const destinations = {
      student: `student.html?username=${encodeURIComponent(username)}?panel=${panel}`,
      teacher: "teacher.html",
      staff: "dashHub.htm",
    };

    const destination = destinations[member.role];

    if (!destination) {
      error.textContent = "Invalid account role.";
      return;
    }

    // Redirect to the correct dashboard
    window.location.assign(destination);
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
