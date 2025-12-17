const extensionApi = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_GIF_URL = "https://media.tenor.com/IRFM1RzwxV0AAAAi/goku-dance.gif";

const getFromStorage = (keys) =>
  new Promise((resolve) => {
    const maybePromise = extensionApi.storage.sync.get(keys, (data) => resolve(data || {}));
    if (maybePromise && typeof maybePromise.then === "function") {
      maybePromise.then((data) => resolve(data || {}));
    }
  });

const setInStorage = (items) =>
  new Promise((resolve) => {
    const maybePromise = extensionApi.storage.sync.set(items, () => resolve());
    if (maybePromise && typeof maybePromise.then === "function") {
      maybePromise.then(() => resolve());
    }
  });

const sendMessageToActiveTab = (payload) => {
  extensionApi.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.id !== undefined) {
      extensionApi.tabs.sendMessage(activeTab.id, payload);
    }
  });
};

const applyGifUrl = async (url) => {
  if (!url) return;
  await setInStorage({ newUrl: url });
  sendMessageToActiveTab({ type: "updateUrl", data: url });
};

const ensureDefaultSavedGif = async () => {
  const storage = await getFromStorage(["savedGifUrls"]);
  const savedUrls = storage.savedGifUrls || [];

  if (!savedUrls.includes(DEFAULT_GIF_URL)) {
    const updated = [DEFAULT_GIF_URL, ...savedUrls];
    await setInStorage({ savedGifUrls: updated });
  }
};

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

  await setInStorage({ savedGifUrls: updatedUrls, newUrl: enteredValue });
  applyGifUrl(enteredValue);
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
  await ensureDefaultSavedGif();

  const storage = await getFromStorage(["newUrl"]);
  const activeUrl = storage.newUrl || DEFAULT_GIF_URL;

  updateSliders();
  registerSliderListeners();
  wireUi();
  applyGifUrl(activeUrl);
};

init();
