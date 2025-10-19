import hotkeys from "hotkeys-js";

export default defineContentScript({
  matches: ["*://*.platzi.com/clases/examen/*"],
  main() {
    // Track currently selected quiz option index
    console.log("Platzi: Quiz content script loaded quiz");
    let selectedOptionIndex = -1;

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

    // Arrow key navigation for quiz options
    hotkeys("down", () => {
      const optionButtons = document.querySelectorAll(
        'button[data-testid="QuestionOption-content"]'
      ) as NodeListOf<HTMLButtonElement>;

      if (optionButtons.length === 0) return;

      if (selectedOptionIndex === -1) {
        selectedOptionIndex = 0;
      } else {
        selectedOptionIndex = (selectedOptionIndex + 1) % optionButtons.length;
      }

      highlightOption(selectedOptionIndex);
      console.log(`Platzi: Navigated to option ${selectedOptionIndex}`);
    });

    hotkeys("up", () => {
      const optionButtons = document.querySelectorAll(
        'button[data-testid="QuestionOption-content"]'
      ) as NodeListOf<HTMLButtonElement>;

      if (optionButtons.length === 0) return;

      if (selectedOptionIndex === -1) {
        selectedOptionIndex = optionButtons.length - 1;
      } else {
        selectedOptionIndex =
          (selectedOptionIndex - 1 + optionButtons.length) %
          optionButtons.length;
      }

      highlightOption(selectedOptionIndex);
      console.log(`Platzi: Navigated to option ${selectedOptionIndex}`);
    });

    // Enter key to click the highlighted option or the Next button
    hotkeys("enter", () => {
      const optionButtons = document.querySelectorAll(
        'button[data-testid="QuestionOption-content"]'
      ) as NodeListOf<HTMLButtonElement>;

      // If an option is highlighted, click it
      if (
        selectedOptionIndex >= 0 &&
        selectedOptionIndex < optionButtons.length
      ) {
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
    });

    // Press 'a', 'b', 'c', or 'd' to select quiz options
    hotkeys("a,b,c,d", (event) => {
      const optionButtons = document.querySelectorAll(
        'button[data-testid="QuestionOption-content"]'
      ) as NodeListOf<HTMLButtonElement>;

      if (optionButtons.length === 0) return;

      // Find the button with the matching letter
      for (const button of optionButtons) {
        const letterSpan = button.querySelector(
          ".QuestionOption-letter-span"
        ) as HTMLElement;

        if (letterSpan && letterSpan.textContent?.toLowerCase() === event.key) {
          button.click();
          console.log(`Platzi: Selected option ${event.key.toUpperCase()}`);
          // Reset selection after clicking
          selectedOptionIndex = -1;
          highlightOption(-1);
          break;
        }
      }
    });
  },
});
