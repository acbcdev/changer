export default defineContentScript({
  matches: ["*://*.notion.so/*"],
  main() {
    // Keyboard shortcut: Press 'n' to click the add new item button
    document.addEventListener("keydown", (event) => {
      // Only trigger on 'n' key
      if (event.key !== "n" && event.key !== "N") return;

      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      // Don't trigger if user is typing
      if (isTyping) return;

      // Find the add new item button by class name
      const addButton = document.querySelector(
        ".notion-collection-view-item-add"
      ) as HTMLElement;

      if (addButton) {
        event.preventDefault();
        addButton.click();
        console.log("Notion: Clicked add new item button");
      }
    });
  },
});
