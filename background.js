let lastGroupId = -1;
let lastWindowId = -1;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  lastGroupId = tab.groupId;
  lastWindowId = tab.windowId;
});

chrome.tabs.onCreated.addListener(async (newTab) => {
  const { enabled } = await chrome.storage.local.get('enabled');
  
  // EXIT IF: 
  // - Extension is off
  // - We weren't in a group
  // - The new tab is in a diff window
  if (!enabled || lastGroupId === -1 || newTab.windowId !== lastWindowId) {
    return;
  }

  try {
    await chrome.tabs.group({
      groupId: lastGroupId,
      tabIds: [newTab.id]
    });
  } catch (e) {
    setTimeout(() => {
      chrome.tabs.group({ groupId: lastGroupId, tabIds: [newTab.id] }).catch(() => {});
    }, 100);
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-ungrouped-tab") {
    chrome.tabs.create({ 
      active: true 
    });
  }
});