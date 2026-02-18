const ungrouped = new Set();

chrome.tabs.onCreated.addListener(async (newTab) => {
  const { enabled } = await chrome.storage.local.get('enabled');
  if (enabled === false) return;
  
  if (ungrouped.has(newTab.id)) {
    ungrouped.delete(newTab.id); 
    return;
  }
  
  setTimeout(async () => {
    const allTabs = await chrome.tabs.query({ windowId: newTab.windowId });
    const neighborTab = allTabs.find(t => t.index === newTab.index - 1);
    
    if (neighborTab && neighborTab.groupId !== -1) {
      chrome.tabs.group({
        groupId: neighborTab.groupId,
        tabIds: [newTab.id]
      }).catch(() => {});
    }
  }, 50);
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-ungrouped-tab") {
    const tab = await chrome.tabs.create({ active: true });
    ungrouped.add(tab.id);
  }
});