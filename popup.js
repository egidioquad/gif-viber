// Function to update sliders based on userData
const updateSliders = () => {
  // Retrieve userData from chrome.storage
  chrome.storage.sync.get("userData", (data) => {
    const userData = data.userData;
    const widthSlider = document.getElementById("widthRange");
    const topSlider = document.getElementById("topRange");
    const rightSlider = document.getElementById("rightRange");
    const onSwitch = document.getElementById("onSwitch");

    // Set slider values based on userData or defaults
    widthSlider.value = userData ? userData.width || "150" : "150";
    topSlider.value = userData ? userData.top || "40" : "40";
    rightSlider.value = userData ? userData.right || "10" : "10";
    onSwitch.checked = userData ? (userData.onSwitch ? true : false) : true;
  });
};
/* //call event listener for button <button id="reset-default">Reset Defaults</button>
document.getElementById("reset-default").addEventListener("click", () => {
  // Remove userData from chrome.storage.sync
  chrome.storage.sync.remove("userData", function () {
    // Call the function to update slider values
    updateSliders();
  });
}); */

// Call the function to update slider values on popup load

// Listen for changes in any slider
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".bg-purple-500");
  sliders.forEach((slider) => {
    slider.addEventListener("input", () => {
      console.log("slider");
      // Get all slider values and store them in userData JSON object
      const userData = {
        top: document.getElementById("topRange").value,
        width: document.getElementById("widthRange").value,
        right: document.getElementById("rightRange").value,
        onSwitch: document.getElementById("onSwitch").checked,
      };

      // Store the userData JSON object in chrome.storage
      chrome.storage.sync.set({ userData }, () => {
        console.log("Data is set to", userData);
      });

      // Send a message to the content script with the updated userData
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { type: "updateUserData", data: userData });
      });
    });
  });
});

// Add an event listener for the input event
document.getElementById("urlButton").addEventListener("click", () => {
  // Retrieve the entered value from the input field
  const enteredValue = document.getElementById("newUrl").value;
  // Check if the entered value is a valid URL
  if (enteredValue.startsWith("http://") || enteredValue.startsWith("https://")) {
    chrome.storage.sync.set({ newUrl: enteredValue }, () => {
      console.log("Url is set to", enteredValue);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "updateUrl", data: enteredValue });
    });
  }
});

updateSliders();
// Function to update the extension state based on the toggle switch
/* const updateExtensionState = async () => {
  const onSwitch = document.getElementById("onSwitch");
  const nextState = onSwitch.checked ? "ON" : "OFF";
  // await chrome.action.setBadgeText({ text: nextState });

  // Perform actions based on the extension state (ON or OFF)
  if (nextState === "ON") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "renderGif" });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "removeGif" });
    });
  }
};
 */
// Add an event listener to the toggle switch
//document.getElementById("onSwitch").addEventListener("change", updateExtensionState);

document.addEventListener("DOMContentLoaded", function () {
  var clickableDiv = document.getElementById("redirectInfoPage");
  clickableDiv.addEventListener("click", function () {
    window.location.href = "info.html";
  });
});
