const extensionApi = typeof browser !== "undefined" ? browser : chrome;
const gifUrl = "https://media.giphy.com/media/EIMaztL7ICrLS07tcT/giphy.gif";
const gifImage = document.createElement("img");
gifImage.id = "gifImage";

gifImage.style.position = "fixed";
if (!gifImage.style.position) {
  gifImage.style.position = "fixed";
}
gifImage.style.zIndex = "99999";
gifImage.style.pointerEvents = "none";

extensionApi.storage.sync.get("userData", function (result) {
  if (!result.userData) {
    gifImage.style.width = "150px";
    gifImage.style.top = "40px";
    gifImage.style.right = "10px";
    gifImage.style.display = "block";
  } else {
    const sliderData = result.userData;
    applyStylesToGif(sliderData);
  }
});

extensionApi.storage.sync.get("newUrl", function (result) {
  if (!result.newUrl) {
    gifImage.src = gifUrl;
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

  gifImage.style.width = `${width}px`;
  gifImage.style.top = `${top}px`;
  gifImage.style.right = `${right}px`;

  if (onSwitch === "true") {
    gifImage.style.display = "block";
  } else {
    gifImage.style.display = "none";
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
