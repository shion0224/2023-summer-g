// When the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get the logout button by its ID
    const logoutButton = document.getElementById("logout-button");
    const userName = localStorage.getItem("name");
    if (userName) {
        document.getElementById("user-circle").innerText = userName;
    }

    // Add a click event listener
    logoutButton.addEventListener("click", () => {
        // Call the logout API (I'm assuming you'll set up a logout endpoint in your server)
        fetch("/users/logout", { method: "POST" })
            .then((response) => response.json())
            .then((data) => {
                // If logout is successful, redirect to login.html
                if (data.success) {
                    window.location.href = "login.html";
                    localStorage.removeItem("password");
                    localStorage.removeItem("did");
                    localStorage.removeItem("key");
                    localStorage.removeItem("name");
                } else {
                    console.error("Error logging out:", data.error);
                }
            });
    });
});
