(() => {
  const extensionApi = typeof browser !== "undefined" ? browser : chrome;

  const PRIMARY_DEFAULT_GIF_URL = "https://media.giphy.com/media/EIMaztL7ICrLS07tcT/giphy.gif";
  const PRESET_GIF_URLS = [
    PRIMARY_DEFAULT_GIF_URL,
    "https://media.tenor.com/IRFM1RzwxV0AAAAi/goku-dance.gif", // goku fortnite
    "https://i.pinimg.com/originals/a6/c7/7c/a6c77c6148c6f62354f07a1749685b65.gif", // cucaracha
    "https://i.pinimg.com/originals/e6/80/2d/e6802d9c0538e25efed9d1cdf3414af9.gif", // mew
    "https://i.pinimg.com/originals/57/c8/15/57c8154faccad3313c437627e145f10d.gif", // pikmin
    "https://i.pinimg.com/originals/b5/c1/dc/b5c1dcfc4e84b9b6cbbeef9944b04c3c.gif", // kirby
    "https://i.pinimg.com/originals/d3/9f/6b/d39f6bd71a186e4bb2e18f7cf855597c.gif", // mario & Luigi
    "https://i.pinimg.com/originals/ba/e3/0e/bae30e0c7acfec296e5a30d0a75af0f1.gif", // Linux pinux pc
    "https://i.pinimg.com/originals/aa/60/a5/aa60a5d29e381958e7244e3be3a78909.gif", // gatto che suona la tromba
    "https://i.pinimg.com/originals/e8/93/2f/e8932f23e424d6569498c41298cb2667.gif", // scheletro dance
    "https://i.pinimg.com/originals/dc/b5/cf/dcb5cf7b44c7914b955b6325a76eba60.gif", // scimmia ppc
    "https://i.pinimg.com/originals/d4/7a/3d/d47a3d6e3415ad5bf48be06329a3322c.gif", // bruco magico
    "https://i.pinimg.com/originals/7b/3d/3c/7b3d3c58d0057ffc1824eccdc1882f41.gif", // lets get this fish
    "https://i.pinimg.com/originals/34/14/bf/3414bf9be6f0ee032fd488abe07282a1.gif", // spidergirl
    "https://i.pinimg.com/originals/87/cd/2b/87cd2b4e633de25086c29f1d67de4d96.gif", // cowboy
  ];

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

  const ensureDefaultSavedGifs = async () => {
    const storage = await getFromStorage(["savedGifUrls", "newUrl"]);
    const savedUrls = storage.savedGifUrls || [];

    const merged = [...PRESET_GIF_URLS, ...savedUrls];
    const deduped = merged.filter((url, index) => merged.indexOf(url) === index);

    const newUrl = storage.newUrl || PRIMARY_DEFAULT_GIF_URL;

    await setInStorage({ savedGifUrls: deduped, newUrl });
  };

  window.gifViberShared = {
    extensionApi,
    PRIMARY_DEFAULT_GIF_URL,
    PRESET_GIF_URLS,
    getFromStorage,
    setInStorage,
    sendMessageToActiveTab,
    applyGifUrl,
    ensureDefaultSavedGifs,
  };
})();
