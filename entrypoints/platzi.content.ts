export default defineContentScript({
  matches: ["*://*.platzi.com/*"],
  main() {
    console.log("Platzi copy extension loaded");

    // Add double-click event listener to the document
    document.addEventListener("dblclick", (event) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element or its parent has the specific class
      const contentElement = target.closest(
        ".Resources_Resources__Articlass__content__BsvgC"
      ) as HTMLElement;

      // Check if the clicked element is an h1 or inside an h1
      const h1Element = target.closest("h1") as HTMLElement;

      const elementToCopy = contentElement || h1Element;

      if (elementToCopy) {
        // Get the text content
        const textToCopy = elementToCopy.innerText || elementToCopy.textContent;

        if (textToCopy) {
          // Copy to clipboard using the Clipboard API
          navigator.clipboard
            .writeText(textToCopy.trim())
            .then(() => {
              console.log("Content copied to clipboard:", textToCopy.trim());

              // Optional: Visual feedback - briefly highlight the element
              const originalBackground = elementToCopy.style.backgroundColor;
              elementToCopy.style.backgroundColor = "#4CAF50";
              elementToCopy.style.transition = "background-color 0.3s";

              setTimeout(() => {
                elementToCopy.style.backgroundColor = originalBackground;
              }, 300);
            })
            .catch((err) => {
              console.error("Failed to copy to clipboard:", err);
            });
        }
      }
    });
  },
});
