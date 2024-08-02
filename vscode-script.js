document.addEventListener("DOMContentLoaded", function () {
  const checkElement = setInterval(() => {
    const commandDialog = document.querySelector(".quick-input-widget");
    if (commandDialog) {
      // Create a DOM observer to 'listen' for changes in the element's attributes.
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            if (commandDialog.style.display === "none") {
              handleEscape();
            } else {
              // If the .quick-input-widget element (command palette) is in the DOM
              // but no inline style display: none, show the backdrop blur.
              runMyScript();
            }
          }
        });
      });

      observer.observe(commandDialog, { attributes: true });

      // Clear the interval once the observer is set
      clearInterval(checkElement);
    } else {
      console.log("Command dialog not found yet. Retrying...");
    }
  }, 500); // Check every 500ms

  // Execute when command palette is launched.
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "p") {
      event.preventDefault();
      runMyScript();
    } else if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      handleEscape();
    }
  });

  // Ensure the escape key event listener is at the document level
  document.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        handleEscape();
      }
    },
    true
  );

  function runMyScript() {
    const targetDiv = document.querySelector(".monaco-workbench");

    // Remove existing element if it already exists
    const existingElement = document.getElementById("command-blur");
    if (existingElement) {
      existingElement.remove();
    }

    // Create and configure the new element
    const newElement = document.createElement("div");
    newElement.setAttribute("id", "command-blur");

    // Apply styles for the backdrop blur effect
    newElement.style.position = "fixed";
    newElement.style.top = "0";
    newElement.style.left = "0";
    newElement.style.width = "100%";
    newElement.style.height = "100%";
    newElement.style.backgroundColor = "rgba(0, 0, 0, 0.2)"; // Semi-transparent background
    newElement.style.backdropFilter = "blur(10px)"; // Blur effect
    newElement.style.zIndex = "999"; // Ensure it's on top of other elements
    newElement.style.cursor = "pointer"; // Make it clickable to remove

    newElement.addEventListener("click", function () {
      newElement.remove();
    });

    // Append the new element as a child of the targetDiv
    targetDiv.appendChild(newElement);
  }

  function handleEscape() {
    // Remove the backdrop blur from the DOM when esc key is pressed.
    const element = document.getElementById("command-blur");
    if (element) {
      element.click();
    }
  }
});
