document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('platform-select');

    selectElement.addEventListener('change', function () {
        const selectedUrl = this.value;
        // Get the text (e.g., "Messenger")
        const selectedText = this.options[this.selectedIndex].text;

        if (selectedUrl) {
            // 1. Open the social media site
            chrome.tabs.create({ url: selectedUrl });

            // 2. Open welcome.html with the name attached
            // Look closely at "?name="
            chrome.tabs.create({ 
                url: `welcome.html?name=${encodeURIComponent(selectedText)}` 
            });

            this.value = ""; 
        }
    });
});