// This event listener waits for the DOM (popup.html) to be fully loaded before executing its function.
document.addEventListener("DOMContentLoaded", function () {
  // Attaching a click event listener to the "Group Tabs" button element.
  document.getElementById("groupTabsButton").addEventListener("click", groupTabs);

  // Automatically calling the groupTabs function when the popup is opened.
  groupTabs();
});

// The main function that groups tabs based on their domain names.
function groupTabs() {
  // Querying all tabs in the current window.
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    // An object to store tabs grouped by their domain names.
    const tabGroups = {};

    // Iterating through each tab in the tabs array.
    tabs.forEach(function (tab) {
      // Extracting the domain name from the tab's URL.
      const tabDomain = new URL(tab.url).hostname;

      // Checking if a tab group for the domain name exists, or creating a new group.
      if (!tabGroups[tabDomain]) {
        tabGroups[tabDomain] = [tab];
      } else {
        tabGroups[tabDomain].push(tab);
      }
    });

    // Looping through the grouped tabs to create tab groups.
    for (const [groupKey, groupTabs] of Object.entries(tabGroups)) {
      // Checking if a group has more than one tab.
      if (groupTabs.length > 1) {
        // Creating an array of tab IDs for the chrome.tabs.group method.
        const tabIds = groupTabs.map(tab => tab.id);

        // Grouping the tabs together using chrome.tabs.group method.
        chrome.tabs.group({ tabIds: tabIds }, function (groupId) {
          // Since we're only grouping by domain, no need to update the title or icon.
        });
      }
    }
  });
}
