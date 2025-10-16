export default defineContentScript({
  matches: ["*://*.platzi.com/*"],
  main() {
    // Track currently selected quiz option index
    let selectedOptionIndex = -1;

    // Helper function to check if any modifier keys are pressed
    function hasModifierKey(event: KeyboardEvent): boolean {
      return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
    }

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
    function highlightOption(index: number) {
      const optionButtons = document.querySelectorAll(
        'button[data-testid="QuestionOption-content"]'
      ) as NodeListOf<HTMLButtonElement>;

      // Remove previous highlights
      optionButtons.forEach((btn) => {
        btn.style.outline = "";
        btn.style.outlineOffset = "";
      });

      // Highlight the selected option
      if (index >= 0 && index < optionButtons.length) {
        const selectedButton = optionButtons[index];
        selectedButton.style.outline = "3px solid #4CAF50";
        selectedButton.style.outlineOffset = "2px";
        selectedButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
      if ((event.key === "h" || event.key === "H") && !hasModifierKey(event)) {
        const h1Element = document.querySelector("h1") as HTMLElement;

        if (h1Element) {
          event.preventDefault();
          copyToClipboard(h1Element);
        }
      }

      // Keyboard shortcut: Press 'r' to copy the resume content
      if ((event.key === "r" || event.key === "R") && !hasModifierKey(event)) {
        const contentElement = document.querySelector(
          '[class*="Articlass__content"]'
        ) as HTMLElement;
        console.log(contentElement);
        if (contentElement) {
          event.preventDefault();
          copyToClipboard(contentElement);
        }
      }

      // Arrow key navigation for quiz options
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const optionButtons = document.querySelectorAll(
          'button[data-testid="QuestionOption-content"]'
        ) as NodeListOf<HTMLButtonElement>;

        if (optionButtons.length === 0) return;

        event.preventDefault();

        if (event.key === "ArrowDown") {
          // If nothing selected, select first; otherwise move down
          if (selectedOptionIndex === -1) {
            selectedOptionIndex = 0;
          } else {
            selectedOptionIndex = (selectedOptionIndex + 1) % optionButtons.length;
          }
        } else if (event.key === "ArrowUp") {
          // If nothing selected, select last; otherwise move up
          if (selectedOptionIndex === -1) {
            selectedOptionIndex = optionButtons.length - 1;
          } else {
            selectedOptionIndex = (selectedOptionIndex - 1 + optionButtons.length) % optionButtons.length;
          }
        }

        highlightOption(selectedOptionIndex);
        console.log(`Platzi: Navigated to option ${selectedOptionIndex}`);
      }

      // Enter key to click the highlighted option or the Next button
      if (event.key === "Enter") {
        event.preventDefault();

        const optionButtons = document.querySelectorAll(
          'button[data-testid="QuestionOption-content"]'
        ) as NodeListOf<HTMLButtonElement>;

        // If an option is highlighted, click it
        if (selectedOptionIndex >= 0 && selectedOptionIndex < optionButtons.length) {
          optionButtons[selectedOptionIndex].click();
          console.log(`Platzi: Clicked option ${selectedOptionIndex}`);
          // Reset selection after clicking
          selectedOptionIndex = -1;
          highlightOption(-1);
        } else {
          // If no option is highlighted, click the "Siguiente" (Next) button
          const nextButton = document.querySelector(
            'button[testid="ControlBar-button-next"]'
          ) as HTMLButtonElement;

          if (nextButton) {
            nextButton.click();
            console.log("Platzi: Clicked Next button");
          }
        }
      }

      // Keyboard shortcuts: Press 'a', 'b', 'c', or 'd' to select quiz options
      const key = event.key.toLowerCase();
      if (["a", "b", "c", "d"].includes(key) && !hasModifierKey(event)) {
        // Find all quiz option buttons
        const optionButtons = document.querySelectorAll(
          'button[data-testid="QuestionOption-content"]'
        ) as NodeListOf<HTMLButtonElement>;

        if (optionButtons.length === 0) return;

        // Find the button with the matching letter
        for (const button of optionButtons) {
          const letterSpan = button.querySelector(
            ".QuestionOption-letter-span"
          ) as HTMLElement;

          if (letterSpan && letterSpan.textContent?.toLowerCase() === key) {
            event.preventDefault();
            button.click();
            console.log(`Platzi: Selected option ${key.toUpperCase()}`);
            // Reset selection after clicking
            selectedOptionIndex = -1;
            highlightOption(-1);
            break;
          }
        }
      }
    });
  },
});
