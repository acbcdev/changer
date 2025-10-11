export default defineContentScript({
  matches: ["*://*.platzi.com/*"],
  main() {
    // Helper function to copy and provide visual feedback
    function copyToClipboard(element: HTMLElement) {
      const textToCopy = element.innerText || element.textContent;

      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy.trim())
          .then(() => {
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

    // Keyboard shortcuts
    document.addEventListener("keydown", (event) => {
      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      // Don't trigger if user is typing
      if (isTyping) return;

      // Keyboard shortcut: Press 'h' to copy the first h1 element
      if (event.key === "h" || event.key === "H") {
        const h1Element = document.querySelector("h1") as HTMLElement;

        if (h1Element) {
          event.preventDefault();
          copyToClipboard(h1Element);
        }
      }

      // Keyboard shortcut: Press 'r' to copy the resume content
      if (event.key === "r" || event.key === "R") {
        const contentElement = document.querySelector(
          '[class*="Articlass__content"]'
        ) as HTMLElement;
        console.log(contentElement);
        if (contentElement) {
          event.preventDefault();
          copyToClipboard(contentElement);
        }
      }
    });
  },
});
