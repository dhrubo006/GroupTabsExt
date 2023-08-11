document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("groupTabsButton").addEventListener("click", groupTabs);
  groupTabs(); // Automatically group tabs when the popup is opened
});

function groupTabs() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const tabGroups = {};

    tabs.forEach(function (tab) {
      const tabDomain = new URL(tab.url).hostname; // Get the domain name

      if (!tabGroups[tabDomain]) {
        tabGroups[tabDomain] = [tab];
      } else {
        tabGroups[tabDomain].push(tab);
      }
    });

    for (const [groupKey, groupTabs] of Object.entries(tabGroups)) {
      if (groupTabs.length > 1) {
        const tabIds = groupTabs.map(tab => tab.id);

        // Group the tabs using chrome.tabGroups API
        chrome.tabGroups.group({ tabIds: tabIds }, function (group) {
          // Set the title of the tab group to the domain name
          chrome.tabGroups.update(group.id, { title: groupKey }, function (updatedGroup) {
            // Tab group title updated
          });
        });
      }
    }
  });
}
