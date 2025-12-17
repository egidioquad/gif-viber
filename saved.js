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

const removeGif = async (urlToRemove) => {
  const storage = await getFromStorage(["savedGifUrls"]);
  const savedUrls = storage.savedGifUrls || [];
  const filtered = savedUrls.filter((item) => item !== urlToRemove);
  await setInStorage({ savedGifUrls: filtered });
  renderSavedGrid();
};

const ensureDefaultSavedGif = async () => {
  const storage = await getFromStorage(["savedGifUrls"]);
  const savedUrls = storage.savedGifUrls || [];

  if (!savedUrls.includes(DEFAULT_GIF_URL)) {
    const updated = [DEFAULT_GIF_URL, ...savedUrls];
    await setInStorage({ savedGifUrls: updated });
  }
};

const renderSavedGrid = async () => {
  const grid = document.getElementById("savedGrid");
  const emptyState = document.getElementById("emptyState");
  const activeLabel = document.getElementById("activeLabel");

  grid.innerHTML = "";

  const storage = await getFromStorage(["savedGifUrls", "newUrl"]);
  const savedUrls = storage.savedGifUrls || [];
  const activeUrl = storage.newUrl || "";

  if (!savedUrls.length) {
    emptyState.classList.remove("hidden");
    activeLabel.textContent = "";
    return;
  }

  emptyState.classList.add("hidden");
  activeLabel.textContent = activeUrl ? "Active GIF updated" : "";

  savedUrls.forEach((url) => {
    const card = document.createElement("div");
    card.className = `relative rounded-lg overflow-hidden border ${
      url === activeUrl ? "border-indigo-400 ring-2 ring-indigo-400" : "border-purple-700"
    } bg-purple-900/60 hover:bg-purple-800 transition group`;

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Saved GIF";
    img.className = "w-full h-28 object-cover";

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.setAttribute("aria-label", "Remove GIF");
    removeBtn.className =
      "absolute top-1 right-1 h-6 w-6 rounded-full bg-black/80 text-white text-base leading-none flex items-center justify-center border border-purple-500 opacity-95 hover:bg-black";
    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      removeGif(url);
    });

    card.appendChild(img);
    card.appendChild(removeBtn);

    card.addEventListener("click", () => applyGifUrl(url));
    grid.appendChild(card);
  });
};

const init = () => {
  document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "hello.html";
  });
  document.getElementById("refreshSaved").addEventListener("click", renderSavedGrid);
  ensureDefaultSavedGif().then(renderSavedGrid);
};

init();
