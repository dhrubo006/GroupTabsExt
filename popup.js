// This event listener is triggered when the popup.html has finished loading.
document.addEventListener("DOMContentLoaded", function () {
    // Get a reference to the "Group Tabs" button in the popup.html.
    // We do this by using the unique ID "groupTabsButton".
    // When the button is clicked, it will trigger the "groupTabs" function.
    document.getElementById("groupTabsButton").addEventListener("click", groupTabs);
  });
  
  // The "groupTabs" function is responsible for grouping tabs with the same hostname.
  function groupTabs() {
    // We use the Chrome API "chrome.tabs.query" to get all the tabs in the current window.
    // The "currentWindow: true" option ensures that we only get tabs from the current window.
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      // We create an empty object to store tab groups.
      // The keys of the object will be the hostname, and the values will be arrays of tab IDs.
      const tabGroups = {};
  
      // Loop through all the tabs retrieved by "chrome.tabs.query".
      tabs.forEach(function (tab) {
        // Extract the hostname from the tab's URL using the URL API.
        const tabUrl = new URL(tab.url).hostname;
  
        // Check if the tab's hostname exists as a key in "tabGroups".
        // If it doesn't, we create a new array with the current tab's ID as the first element.
        // If it does, we simply add the current tab's ID to the existing array.
        if (!tabGroups[tabUrl]) {
          tabGroups[tabUrl] = [tab.id];
        } else {
          tabGroups[tabUrl].push(tab.id);
        }
      });
  
      // After creating the tab groups, we loop through them using "Object.entries".
      for (const [groupKey, tabIds] of Object.entries(tabGroups)) {
        // We check if a tab group has more than one tab.
        // If it does, it means we can group these tabs together.
        if (tabIds.length > 1) {
          // We use the Chrome API "chrome.tabs.group" to group the tabs together.
          // The "tabIds" property in the options is an array of tab IDs to be grouped together.
          // When we group the tabs, Chrome will create a new tab group with these tabs.
          // The "function (groupId)" part is a callback that will be called after the tabs are grouped.
          // It receives the ID of the newly created tab group as "groupId".
          chrome.tabs.group({ tabIds: tabIds }, function (groupId) {
            // Optionally, you can save the group ID for future reference.
            // In this example, we don't save it, but you can use "localStorage" or "chrome.storage"
            // to store the group IDs for persistent tab grouping across browser sessions.
          });
        }
      }
    });
  }
  