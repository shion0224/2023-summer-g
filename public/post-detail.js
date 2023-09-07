window.onload = async () => {
    const dreamId = localStorage.getItem("dream_id");
    if (!dreamId) {
        console.error("No dream ID found in local storage.");
        return;
    }

    try {
        const response = await fetch(`/dream-title?dream_id=${dreamId}`);
        document.getElementById("dream-title").innerText = await response.text();
    } catch (error) {
        console.error("Error fetching from /dream-title:", error);
    }
    try {
        const response = await fetch(`/dream-tag-detail?dream_id=${dreamId}`);
        document.getElementById("dream-tag-detail").innerText = await response.text();
    } catch (error) {
        console.error("Error fetching from /dream-tag-detail:", error);
    }
    try {
        const response = await fetch(`/dream-content?dream_id=${dreamId}`);
        document.getElementById("dream-content").innerText = await response.text();
    } catch (error) {
        console.error("Error fetching from /dream-title:", error);
    }
};
