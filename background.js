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