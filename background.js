/* chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });
}); */

const browserApi = typeof browser !== "undefined" ? browser : chrome;
const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

const getBadgeText = async (tabId) => {
  // Firefox exposes a promise-based API while Chrome still uses callbacks.
  if (browserApi.action.getBadgeText.length === 1) {
    return browserApi.action.getBadgeText({ tabId });
  }

  return new Promise((resolve) => browserApi.action.getBadgeText({ tabId }, resolve));
};

const setBadgeText = async (tabId, text) => {
  if (browserApi.action.setBadgeText.length === 1) {
    await browserApi.action.setBadgeText({ tabId, text });
    return;
  }

  return new Promise((resolve) => browserApi.action.setBadgeText({ tabId, text }, resolve));
};

const removeCssFromTab = async (tabId) => {
  if (browserApi.tabs && browserApi.tabs.removeCSS) {
    await browserApi.tabs.removeCSS({
      file: "focus-mode.css",
      tabId,
    });
  } else if (browserApi.scripting && browserApi.scripting.removeCSS) {
    await browserApi.scripting.removeCSS({
      files: ["focus-mode.css"],
      target: { tabId },
    });
  }
};

browserApi.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await getBadgeText(tab.id);
    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await setBadgeText(tab.id, nextState);
    if (nextState === "ON") {
      // Insert the CSS file when the user turns the extension on
      /* await chrome.scripting.insertCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      }); */
    } else if (nextState === "OFF") {
      // Remove the CSS file when the user turns the extension off
      await removeCssFromTab(tab.id);
    }
  }
});
