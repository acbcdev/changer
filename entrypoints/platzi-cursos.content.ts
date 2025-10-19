import hotkeys from "hotkeys-js";

export default defineContentScript({
  matches: ["*://*.platzi.com/cursos/*"],
  main() {
    // Track currently selected quiz option index
    console.log("Platzi: Cursos content script loaded cursos");
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

    // Helper function to highlight selected quiz option

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

    // Press 'h' to copy the first h1 element
    hotkeys("h", () => {
      const h1Element = document.querySelector("h1") as HTMLElement;
      if (h1Element) {
        copyToClipboard(h1Element);
      }
    });

    // Press 'r' to copy the resume content
    hotkeys("r", () => {
      const contentElement = document.querySelector(
        '[class*="Articlass__content"]'
      ) as HTMLElement;
      console.log(contentElement);
      if (contentElement) {
        copyToClipboard(contentElement);
      }
    });
  },
});
