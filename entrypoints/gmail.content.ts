import hotkeys from 'hotkeys-js';

export default defineContentScript({
  matches: ["*://mail.google.com/*"],
  main() {
    // Left arrow or '<' for newer email
    hotkeys('left, <', () => {
      const newerButton = document.querySelector(
        '[aria-label="Newer"], [aria-label="Más reciente"]'
      ) as HTMLElement;
      if (newerButton && newerButton.getAttribute("aria-disabled") !== "true") {
        newerButton.click();
      }
    });

    // Right arrow or '>' for older email
    hotkeys('right, >', () => {
      const olderButton = document.querySelector(
        '[aria-label="Older"], [aria-label="Anterior"]'
      ) as HTMLElement;
      if (olderButton && olderButton.getAttribute("aria-disabled") !== "true") {
        olderButton.click();
      }
    });

    // Account switching: Ctrl+Cmd+number (Mac) or Ctrl+Alt+number (Windows/Linux)
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    const modifier = isMac ? 'ctrl+command' : 'ctrl+alt';

    hotkeys(`${modifier}+1,${modifier}+2,${modifier}+3,${modifier}+4,${modifier}+5,${modifier}+6,${modifier}+7,${modifier}+8,${modifier}+9`, (event) => {
      const numberPressed = parseInt(event.key);
      if (numberPressed >= 1 && numberPressed <= 9) {
        switchToAccount(numberPressed - 1);
      }
    });

    // Open account switcher menu: Cmd+Shift+A (Mac) or Alt+A/Ctrl+Shift+A (Windows/Linux)
    const menuShortcut = isMac ? 'command+shift+a' : 'alt+a,ctrl+shift+a';
    hotkeys(menuShortcut, () => {
      openAccountSwitcher();
    });

    // Press 'h' to go to inbox
    hotkeys('h', () => {
      goToInbox();
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
