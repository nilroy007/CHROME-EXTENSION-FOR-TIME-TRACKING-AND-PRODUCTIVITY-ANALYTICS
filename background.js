let currentTab = null;
let startTime = Date.now();

chrome.runtime.onInstalled.addListener(() => {
  console.log("Productivity Tracker Extension Installed");
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTime();
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url && tab.url.startsWith("http")) {
      currentTab = tab;
      startTime = Date.now();
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    updateTime();
    currentTab = tab;
    startTime = Date.now();
  }
});

chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === "active") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.startsWith("http")) {
        currentTab = tabs[0];
        startTime = Date.now();
      }
    });
  } else if (newState === "idle" || newState === "locked") {
    updateTime();
    currentTab = null;
  }
});

async function updateTime() {
  if (!currentTab || !currentTab.url || !currentTab.url.startsWith("http")) return;

  let domain;
  try {
    domain = new URL(currentTab.url).hostname;
  } catch (e) {
    console.warn("Skipping invalid URL:", currentTab.url);
    return;
  }

  const duration = Math.floor((Date.now() - startTime) / 1000);
  chrome.storage.local.get([domain], (result) => {
    const previousTime = result[domain] || 0;
    chrome.storage.local.set({ [domain]: previousTime + duration });
  });
}