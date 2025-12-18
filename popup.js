const {
  extensionApi,
  PRIMARY_DEFAULT_GIF_URL,
  PRESET_GIF_URLS,
  getFromStorage,
  setInStorage,
  sendMessageToActiveTab,
  applyGifUrl,
  ensureDefaultSavedGifs,
} = window.gifViberShared;

const updateSliders = () => {
  getFromStorage("userData").then((data) => {
    const userData = data.userData;
    const widthSlider = document.getElementById("widthRange");
    const topSlider = document.getElementById("topRange");
    const rightSlider = document.getElementById("rightRange");
    const onSwitch = document.getElementById("onSwitch");

    widthSlider.value = userData ? userData.width || "150" : "150";
    topSlider.value = userData ? userData.top || "40" : "40";
    rightSlider.value = userData ? userData.right || "10" : "10";
    onSwitch.checked = userData ? (userData.onSwitch ? true : false) : true;
  });
};

const registerSliderListeners = () => {
  const sliders = document.querySelectorAll(".bg-purple-500");
  sliders.forEach((slider) => {
    slider.addEventListener("input", () => {
      const userData = {
        top: document.getElementById("topRange").value,
        width: document.getElementById("widthRange").value,
        right: document.getElementById("rightRange").value,
        onSwitch: document.getElementById("onSwitch").checked,
      };

      setInStorage({ userData }).then(() => {
        sendMessageToActiveTab({ type: "updateUserData", data: userData });
      });
    });
  });
};

const saveUrlToList = async () => {
  const enteredValue = document.getElementById("newUrl").value.trim();
  if (!enteredValue.startsWith("http://") && !enteredValue.startsWith("https://")) {
    return;
  }

  const storage = await getFromStorage(["savedGifUrls"]);
  const savedUrls = storage.savedGifUrls || [];
  const updatedUrls = [...new Set([...savedUrls, enteredValue])];

  await setInStorage({ savedGifUrls: updatedUrls });
};

const applyEnteredUrl = () => {
  const enteredValue = document.getElementById("newUrl").value.trim();
  if (enteredValue.startsWith("http://") || enteredValue.startsWith("https://")) {
    applyGifUrl(enteredValue);
  }
};

const wireUi = () => {
  document.getElementById("urlButton").addEventListener("click", applyEnteredUrl);
  document.getElementById("saveUrlButton").addEventListener("click", saveUrlToList);
  document.getElementById("savedPageButton").addEventListener("click", () => {
    window.location.href = "saved.html";
  });
  const infoButtons = [document.getElementById("redirectInfoPage")].filter(Boolean);

  infoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "info.html";
    });
  });
};

const init = async () => {
  await ensureDefaultSavedGifs();

  const storage = await getFromStorage(["newUrl"]);
  const activeUrl = storage.newUrl || PRIMARY_DEFAULT_GIF_URL;

  updateSliders();
  registerSliderListeners();
  wireUi();
  applyGifUrl(activeUrl);
};

init();
