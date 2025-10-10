export default defineContentScript({
  matches: ["*://mail.google.com/*"],
  main() {
    console.log("Gmail keyboard shortcuts extension loaded");

    // Add keyboard shortcuts
    document.addEventListener("keydown", (event) => {
      // Check if user is not typing in an input field
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      // Only handle shortcuts when not typing
      if (isTyping) return;

      // Handle left/right arrow keys for previous/next email
      if (event.key === "ArrowLeft" || event.key === "<") {
        event.preventDefault();
        // Find and click the "newer" button (previous email)
        const newerButton = document.querySelector(
          '[data-tooltip="Newer"]'
        ) as HTMLElement;
        if (newerButton) {
          newerButton.click();
          console.log("Navigated to newer email");
        }
      } else if (event.key === "ArrowRight" || event.key === ">") {
        event.preventDefault();
        // Find and click the "older" button (next email)
        const olderButton = document.querySelector(
          '[data-tooltip="Older"]'
        ) as HTMLElement;
        if (olderButton) {
          olderButton.click();
          console.log("Navigated to older email");
        }
      }

      // Account switcher:
      // Mac: Ctrl + Cmd + number (1-9)
      // Linux/Windows: Ctrl + Alt + number
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
      const modifierPressed = isMac
        ? event.metaKey && event.ctrlKey // Ctrl + Cmd on Mac
        : event.ctrlKey && event.altKey; // Ctrl + Alt on Linux/Windows

      if (modifierPressed && !event.repeat) {
        const numberPressed = parseInt(event.key);
        if (numberPressed >= 1 && numberPressed <= 9) {
          event.preventDefault();
          switchToAccount(numberPressed - 1); // 0-indexed
        }
      }

      // Open account switcher menu:
      // Mac: Cmd + Shift + A
      // Linux/Windows: Alt + A or Ctrl + Shift + A
      const openMenuShortcut = isMac
        ? event.metaKey && event.shiftKey && event.key.toLowerCase() === "a"
        : (event.altKey || (event.ctrlKey && event.shiftKey)) &&
          event.key.toLowerCase() === "a";

      if (openMenuShortcut) {
        event.preventDefault();
        openAccountSwitcher();
      }
    });

    // Function to open the account switcher menu
    function openAccountSwitcher() {
      // Click on the profile picture/account button
      const profileButton = document.querySelector(
        'a[aria-label*="Google Account"]'
      ) as HTMLElement;

      if (profileButton) {
        profileButton.click();
        console.log("Opened account switcher");
      } else {
        // Try alternative selectors
        const altButton = document
          .querySelector('[aria-label="Google apps"]')
          ?.parentElement?.querySelector(
            'a[href*="accounts.google.com"]'
          ) as HTMLElement;

        if (altButton) {
          altButton.click();
          console.log("Opened account switcher (alternative)");
        }
      }
    }

    // Function to switch to a specific account by index via URL modification
    function switchToAccount(index: number) {
      const currentUrl = window.location.href;

      // Check if we're already in a /mail/u/{number}/ format
      const accountUrlPattern = /\/mail\/u\/\d+\//;

      let newUrl: string;
      if (accountUrlPattern.test(currentUrl)) {
        // Replace the existing account number with the new one
        newUrl = currentUrl.replace(/\/mail\/u\/\d+\//, `/mail/u/${index}/`);
      } else {
        // Add the account number to the URL
        newUrl = currentUrl.replace(/\/mail\//, `/mail/u/${index}/`);
      }

      console.log(`Switching to account ${index + 1} via URL: ${newUrl}`);
      window.location.href = newUrl;
    }
  },
});
