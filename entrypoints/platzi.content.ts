export default defineContentScript({
  matches: ["*://*.platzi.com/*"],
  main() {
    console.log("Platzi copy extension loaded");

    // Helper function to copy and provide visual feedback
    function copyToClipboard(element: HTMLElement) {
      const textToCopy = element.innerText || element.textContent;

      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy.trim())
          .then(() => {
            console.log("Content copied to clipboard:", textToCopy.trim());

            // Visual feedback - briefly highlight the element
            const originalBackground = element.style.backgroundColor;
            element.style.backgroundColor = "#4CAF50";
            element.style.transition = "background-color 0.3s";

            setTimeout(() => {
              element.style.backgroundColor = originalBackground;
            }, 300);
          })
          .catch((err) => {
            console.error("Failed to copy to clipboard:", err);
          });
      }
    }

    // Double-click event listener for content class
    document.addEventListener("dblclick", (event) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element or its parent has a class containing "Articlass__content"
      // This is more resilient to CSS Module hash changes
      const contentElement = target.closest(
        '[class*="Articlass__content"]'
      ) as HTMLElement;

      if (contentElement) {
        copyToClipboard(contentElement);
      }
    });

    // Single click event listener for h1 elements
    document.addEventListener("keydown", (event) => {
      if (event.key !== "h") return;
      const target = event.target as HTMLElement;

      // Check if the clicked element is an h1 or inside an h1
      const h1Element = target.closest("h1") as HTMLElement;

      if (h1Element) {
        copyToClipboard(h1Element);
      }
    });
  },
});
