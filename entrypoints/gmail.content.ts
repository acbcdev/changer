export default defineContentScript({
  matches: ["*://mail.google.com/*"],
  main() {
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
        // Find the "newer" button (supports English and Spanish)
        const newerButton = document.querySelector(
          '[aria-label="Newer"], [aria-label="Más reciente"]'
        ) as HTMLElement;
        if (
          newerButton &&
          newerButton.getAttribute("aria-disabled") !== "true"
        ) {
          newerButton.click();
        }
      } else if (event.key === "ArrowRight" || event.key === ">") {
        event.preventDefault();
        // Find the "older" button (supports English and Spanish)
        const olderButton = document.querySelector(
          '[aria-label="Older"], [aria-label="Anterior"]'
        ) as HTMLElement;
        if (
          olderButton &&
          olderButton.getAttribute("aria-disabled") !== "true"
        ) {
          olderButton.click();
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

      // Press 'h' to go to inbox
      if (event.key === "h" || event.key === "H") {
        event.preventDefault();
        goToInbox();
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
      } else {
        // Try alternative selectors
        const altButton = document
          .querySelector('[aria-label="Google apps"]')
          ?.parentElement?.querySelector(
            'a[href*="accounts.google.com"]'
          ) as HTMLElement;

        if (altButton) {
          altButton.click();
        }
      }
    }

    // Function to switch to a specific account by index via URL modification
    function switchToAccount(index: number) {
      const currentUrl = window.location.href;

      // Extract current account number if exists
      const accountMatch = currentUrl.match(/\/mail\/u\/(\d+)\//);
      const currentAccount = accountMatch ? accountMatch[1] : "0";

      // Build new URL - always go to inbox when switching accounts
      const newUrl = `https://mail.google.com/mail/u/${index}/#inbox`;

      window.location.href = newUrl;
    }

    // Function to go to inbox
    function goToInbox() {
      // Try to find the inbox button in the sidebar (supports English and Spanish)
      const inboxButton = document.querySelector(
        '[data-tooltip="Inbox"], [data-tooltip="Recibidos"]'
      ) as HTMLElement;

      if (inboxButton) {
        // Find the link inside the inbox button
        const inboxLink = inboxButton.querySelector("a") as HTMLElement;
        if (inboxLink) {
          inboxLink.click();
          console.log("Gmail: Clicked inbox button");
          return;
        }
      }

      // Fallback: navigate via URL if button not found
      const currentUrl = window.location.href;
      const accountMatch = currentUrl.match(/\/mail\/u\/(\d+)\//);
      const currentAccount = accountMatch ? accountMatch[1] : "0";
      const inboxUrl = `https://mail.google.com/mail/u/${currentAccount}/#inbox`;
      window.location.href = inboxUrl;
    }
  },
});
