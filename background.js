let lastGroupId = -1;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    lastGroupId = tab.groupId;
});

chrome.tabs.onCreated.addListener(async (newTab) => {

    // If the last active tab is in a group, move the new tab into it
    if (lastGroupId !== -1) {
        chrome.tabs.group({
        groupId: lastGroupId,
        tabIds: [newTab.id]
        });
    }
});