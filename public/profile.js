window.onload = async () => {
    try {
        const response = await fetch("/profile");
        const result = await response.text();
        const data = JSON.parse(result);
    } catch (error) {
        console.error("Error fetching from /post:", error);
    }
};
