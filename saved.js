const { extensionApi, getFromStorage, setInStorage, applyGifUrl, ensureDefaultSavedGifs } =
  window.gifViberShared;

const removeGif = async (urlToRemove) => {
  const storage = await getFromStorage(["savedGifUrls"]);
  const savedUrls = storage.savedGifUrls || [];
  const filtered = savedUrls.filter((item) => item !== urlToRemove);
  await setInStorage({ savedGifUrls: filtered });
  renderSavedGrid();
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
      "absolute top-1 right-1 h-8 w-8 rounded-full bg-black/90 text-pink-200 text-2xl font-black leading-none flex items-center justify-center border-2 border-pink-300 shadow-lg opacity-95 hover:bg-black";
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
    const targetUrl = extensionApi.runtime.getURL("hello.html");
    try {
      window.location.assign(targetUrl);
    } catch (err) {
      if (extensionApi.tabs && extensionApi.tabs.update) {
        extensionApi.tabs.update({ url: targetUrl });
      }
    }
  });
  document.getElementById("refreshSaved").addEventListener("click", renderSavedGrid);
  ensureDefaultSavedGifs().then(renderSavedGrid);
};

init();
