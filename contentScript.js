const gifUrl = "https://media.giphy.com/media/LimTh6f2TRq08VZCMI/giphy.gif";
const gifImage = document.createElement("img");
gifImage.id = "gifImage";

gifImage.style.position = "fixed";
gifImage.style.zIndex = "99999";
gifImage.style.pointerEvents = "none";

// Get the slider data from storage
chrome.storage.sync.get("userData", function (result) {
  console.log("sliderData:", result.userData);

  if (!result.userData) {
    // Handle the case when userData is not available
    gifImage.style.width = "150px";
    gifImage.style.top = "40px";
    gifImage.style.right = "10px";
    gifImage.style.display = "block";
  } else {
    // Access the retrieved userData
    const sliderData = result.userData;
    console.log("sliderData: storage", sliderData);
    applyStylesToGif(sliderData);
  }
});

chrome.storage.sync.get("newUrl", function (result) {
  console.log("new url:", result.newUrl);
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

  console.log("widthdata: ", width, top, right, onSwitch);
  // Apply styles using the received slider data
  gifImage.style.width = `${width}px`;
  gifImage.style.top = `${top}px`;
  gifImage.style.right = `${right}px`;

  if (onSwitch === "true") {
    console.log("abbero");

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
    console.log("sliderDAata:", updatedSliderData);
    applyStylesToGif(updatedSliderData);
  } else if (message.type === "updateUrl") {
    const updatedUrl = message.data;
    console.log("url:", updatedUrl);
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
