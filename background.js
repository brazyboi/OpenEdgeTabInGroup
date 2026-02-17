chrome.tabs.onCreated.addListener(async (newTab) => {
  // Find the currently active tab in the window
  const [activeTab] = await chrome.tabs.query({
    active: true, 
    lastFocusedWindow: true
  });

  // If the active tab is in a group (groupId !== -1), move the new tab into it
  if (activeTab && activeTab.groupId !== -1) {
    chrome.tabs.group({
      groupId: activeTab.groupId,
      tabIds: [newTab.id]
    });
  }
});