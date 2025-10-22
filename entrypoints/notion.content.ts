import hotkeys from "hotkeys-js";

const ADD_NEW_ITEM_SELECTOR =
  ".notion-gallery-view .notion-selectable.notion-collection_view-block div div";

export default defineContentScript({
  matches: ["*://*.notion.so/*"],
  main() {
    // Press 'n' to click the add new item button
    hotkeys("n", () => {
      const list = document.querySelectorAll(
        ADD_NEW_ITEM_SELECTOR
      ) as NodeListOf<HTMLElement>;
      if (list.length > 0) {
        const lastButton = list[list.length - 1];
        if (lastButton) {
          lastButton.click();
        }
      }
    });
  },
});
