const gifUrl = "https://media.giphy.com/media/EIMaztL7ICrLS07tcT/giphy.gif";
const gifImage = document.createElement("img");
gifImage.id = "gifImage";

gifImage.style.position = "fixed";
gifImage.style.zIndex = "99999";
gifImage.style.pointerEvents = "none";

// Get the slider data from storage
chrome.storage.sync.get("userData", function (result) {
  if (!result.userData) {
    // Handle the case when userData is not available
    gifImage.style.width = "150px";
    gifImage.style.top = "40px";
    gifImage.style.right = "10px";
    gifImage.style.display = "block";
  } else {
    // Access the retrieved userData
    const sliderData = result.userData;
    applyStylesToGif(sliderData);
  }
});

chrome.storage.sync.get("newUrl", function (result) {
  if (!result.newUrl) {
    gifImage.src = gifUrl;
  } else {
    gifImage.src = result.newUrl;
  }
});
// Append the <img> element to the body of the webpage
document.body.appendChild(gifImage);

const applyStylesToGif = (sliderData) => {
  const width = parseInt(sliderData.width);
  const top = parseInt(sliderData.top);
  const right = parseInt(sliderData.right);
  const onSwitch = sliderData.onSwitch.toString();

  console.log("styles Data: ", width, top, right, onSwitch);
  // Apply styles using the received slider data
  gifImage.style.width = `${width}px`;
  gifImage.style.top = `${top}px`;
  gifImage.style.right = `${right}px`;

  if (onSwitch === "true") {
    gifImage.style.display = "block";
  } else {
    gifImage.style.display = "none";
  }
};

// Listen for a single message containing updated slider data
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateUserData") {
    // Access the updated slider data
    const updatedSliderData = message.data;
    applyStylesToGif(updatedSliderData);
  } else if (message.type === "updateUrl") {
    const updatedUrl = message.data;
    gifImage.src = updatedUrl;
  } else if (message.type === "removeGif") {
    const gifImage = document.getElementById("gifImage");
    if (gifImage) {
      gifImage.style.display = "none";
    }
  } else if (message.type === "renderGif") {
    const gifImage = document.getElementById("gifImage");
    if (gifImage) {
      gifImage.style.display = "block";
    }
  }
  // Handle other message types if needed
});
