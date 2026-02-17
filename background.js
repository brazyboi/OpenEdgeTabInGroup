let lastGroupId = -1;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    lastGroupId = tab.groupId;
});

chrome.tabs.onCreated.addListener(async (newTab) => {
    if (lastGroupId === -1) return;
    // If the last active tab is in a group, move the new tab into it
    // try instantly, but if lag, then delay it
    try {
        chrome.tabs.group({
            groupId: lastGroupId,
            tabIds: [newTab.id]
        });
    } catch (e) {
        setTimeout(() => {
            chrome.tabs.group({
                groupId: lastGroupId,
                tabIds: [newTab.id]
            });
        }, 50)
    }

});

// deal with enabled/disabled status

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
  updateIcon(true);
});

chrome.action.onClicked.addListener(async () => {
  const { enabled } = await chrome.storage.local.get('enabled');
  const newState = !enabled;
  await chrome.storage.local.set({ enabled: newState });
  updateIcon(newState);
});

function updateIcon(enabled) {
  const text = enabled ? "ON" : "OFF";
  const color = enabled ? "#99c0ff" : "#666153";
  chrome.action.setTitle({ title: `This extension is ${text}` });
  chrome.action.setBadgeText({ text: text });
  chrome.action.setBadgeBackgroundColor({ color: color });
}