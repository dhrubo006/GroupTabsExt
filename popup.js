// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Add an event listener to the "Group Tabs" button
  document.getElementById("groupTabsButton").addEventListener("click", groupOrAppendTabs);

  // Automatically group tabs when the popup is opened
  groupOrAppendTabs();
});

// Function to group tabs based on domain names or append to existing groups
function groupOrAppendTabs() {
  // Query the currently open tabs in the current window
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const tabGroups = {};

    // Iterate through each tab
    tabs.forEach(function (tab) {
      const tabDomain = new URL(tab.url).hostname; // Get the domain name

      if (!tabGroups[tabDomain]) {
        tabGroups[tabDomain] = [tab];
      } else {
        tabGroups[tabDomain].push(tab);
      }
    });

    // Iterate through the grouped tabs
    for (const [groupKey, groupTabs] of Object.entries(tabGroups)) {
      if (groupTabs.length > 1) {
        const tabIds = groupTabs.map(tab => tab.id);

        // Find existing group with matching title (domain)
        const existingGroup = tabs.find(tab => tab.groupId !== -1 && tab.title === groupKey);

        if (existingGroup) {
          // Append ungrouped tabs with the same domain to the existing group
          const ungroupedTabs = tabs.filter(tab => tab.groupId === -1 && new URL(tab.url).hostname === groupKey);
          const ungroupedTabIds = ungroupedTabs.map(tab => tab.id);

          if (ungroupedTabIds.length > 0) {
            chrome.tabs.group({ tabIds: ungroupedTabIds, groupId: existingGroup.groupId }, function () {
              // Ungrouped tabs added to the existing group
            });
          }
        } else {
          // Group the tabs using chrome.tabs.group API
          chrome.tabs.group({ tabIds: tabIds }, function (groupId) {
            // Once grouped, update the title using chrome.tabGroups API
            chrome.tabGroups.update(groupId, { title: groupKey }, function (updatedGroup) {
              // Tab group title updated
            });
          });
        }
      }
    }
  });
}
