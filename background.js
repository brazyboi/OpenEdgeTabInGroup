let lastStableGroupId = -1;
let lastStableWindowId = -1;
const ungrouped = new Set();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (tab.groupId !== -1) {
      lastStableGroupId = tab.groupId;
      lastStableWindowId = tab.windowId;
    } else {
      // add a delay before overwriting
      setTimeout(async () => {
        const currentTab = await chrome.tabs.get(activeInfo.tabId).catch(() => null);
        if (currentTab && currentTab.active && currentTab.groupId === -1) {
          lastStableGroupId = -1;
          lastStableWindowId = currentTab.windowId;
        }
      }, 300);
    }
  } catch (e) {}
});

chrome.tabs.onCreated.addListener(async (newTab) => {
  const { enabled } = await chrome.storage.local.get('enabled');

  if (enabled === false || ungrouped.has(newTab.id) || lastStableGroupId === -1) {
    ungrouped.delete(newTab.id);
    return;
  }

  if (newTab.windowId === lastStableWindowId) {
    chrome.tabs.group({
      groupId: lastStableGroupId,
      tabIds: [newTab.id]
    }).catch(() => {});
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-ungrouped-tab") {
    const tab = await chrome.tabs.create({ active: true });
    ungrouped.add(tab.id);
  }
});