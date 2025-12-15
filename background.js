const extensionApi = typeof browser !== "undefined" ? browser : chrome;
const actionApi = extensionApi.browserAction || extensionApi.action;

const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

actionApi?.onClicked.addListener(async (tab) => {
  if (!tab.url || (!tab.url.startsWith(extensions) && !tab.url.startsWith(webstore))) {
    return;
  }

  const prevState = await actionApi.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";

  await actionApi.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "OFF") {
    await extensionApi.tabs.insertCSS?.({
      file: "focus-mode.css",
      cssOrigin: "user",
    });
  }
});
