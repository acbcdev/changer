import hotkeys from 'hotkeys-js';

export default defineContentScript({
  matches: ["*://*.notion.so/*"],
  main() {
    // Press 'n' to click the add new item button
    hotkeys('n', () => {
      const addButton = document.querySelector(
        ".notion-collection-view-item-add"
      ) as HTMLElement;

      if (addButton) {
        addButton.click();
        console.log("Notion: Clicked add new item button");
      }
    });
  },
});
