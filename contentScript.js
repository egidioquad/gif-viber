const extensionApi = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_GIF_URL = "https://media.giphy.com/media/EIMaztL7ICrLS07tcT/giphy.gif";
const gifImage = document.createElement("img");
gifImage.id = "gifImage";

gifImage.style.all = "unset";
gifImage.style.setProperty("position", "fixed", "important");
gifImage.style.setProperty("z-index", "2147483647", "important");
gifImage.style.setProperty("pointer-events", "none", "important");
gifImage.style.setProperty("max-width", "none", "important");
gifImage.style.setProperty("max-height", "none", "important");
gifImage.style.setProperty("margin", "0", "important");
gifImage.style.setProperty("padding", "0", "important");
gifImage.style.setProperty("left", "auto", "important");

extensionApi.storage.sync.get(["userData", "newUrl"], function (result) {
  if (!result.userData) {
    gifImage.style.width = "150px";
    gifImage.style.top = "40px";
    gifImage.style.right = "10px";
    gifImage.style.display = "block";
  } else {
    const sliderData = result.userData;
    applyStylesToGif(sliderData);
  }

  if (!result.newUrl) {
    gifImage.src = DEFAULT_GIF_URL;
    extensionApi.storage.sync.set({ newUrl: DEFAULT_GIF_URL });
  } else {
    gifImage.src = result.newUrl;
  }
});

document.body.appendChild(gifImage);

const applyStylesToGif = (sliderData) => {
  const width = parseInt(sliderData.width);
  const top = parseInt(sliderData.top);
  const right = parseInt(sliderData.right);
  const onSwitch = sliderData.onSwitch.toString();

  gifImage.style.setProperty("width", `${width}px`, "important");
  gifImage.style.setProperty("top", `${top}px`, "important");
  gifImage.style.setProperty("right", `${right}px`, "important");

  if (onSwitch === "true") {
    gifImage.style.setProperty("display", "block", "important");
  } else {
    gifImage.style.setProperty("display", "none", "important");
  }
};

extensionApi.runtime.onMessage.addListener((message) => {
  if (message.type === "updateUserData") {
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
});
