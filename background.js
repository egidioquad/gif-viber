const extensionApi = typeof browser !== "undefined" ? browser : chrome;

const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

extensionApi.action.onClicked.addListener(async (tab) => {
  if (!tab.url || (!tab.url.startsWith(extensions) && !tab.url.startsWith(webstore))) {
    return;
  }

  const prevState = await extensionApi.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";

  await extensionApi.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "OFF") {
    await extensionApi.scripting.removeCSS({
      files: ["focus-mode.css"],
      target: { tabId: tab.id },
    });
  }
});
