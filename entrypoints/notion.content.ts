import hotkeys from "hotkeys-js";

export default defineContentScript({
  matches: ["*://*.notion.so/*"],
  main() {
    console.log("Notion content script loaded");
    // Press 'n' to click the add new item button
    hotkeys("n", () => {
      const addButton = document.querySelector(
        ".notion-collection-view-item-add"
      ) as HTMLElement;
      console.log("Notion: 'n' key pressed");
      if (addButton) {
        console.log("Notion: Found add new item button");
        const firstButton = addButton.querySelector("button") as HTMLElement;
        if (firstButton) {
          console.log("Notion: Found add new item button");
          firstButton.click();
          console.log("Notion: Clicked add new item button");
        }
      }
    });
  },
});
