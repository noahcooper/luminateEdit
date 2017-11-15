/*
 * Luminate Online Page Editor - Opera Next
 * luminateEdit-operaNext.js
 * Version: 1.12 (15-NOV-2017)
 */

luminateEdit.operaNext = {
  /* checks the current URL for known front-end servlet names, as defined in luminateEdit.servlets */
  checkForLuminateOnlineUrl: function(tabId, changeInfo, tab) {
    /* set the tabUrl and show the button as soon as the tab starts loading */
    if(changeInfo.status == 'loading') {
      luminateEdit.tabUrl = tab.url.replace('view-source:', '');
      
      var currentServlet = luminateEdit.getCurrentServlet();
      if(currentServlet != null && luminateEdit.servlets[currentServlet] && luminateEdit.servlets[currentServlet].getUrl() != null) {
        chrome.pageAction.show(tabId);
      }
    }
  }, 
  
  /* go to the admin URL when the edit icon is clicked */
  goToEditUrl: function() {
    /* update the tab URL to ensure it is up-to-date at the time the icon is clicked */
    chrome.tabs.query({
      active: true, 
      windowId: chrome.windows.WINDOW_ID_CURRENT
    }, function(allTabs) {
      luminateEdit.tabUrl = allTabs[0].url.replace('view-source:', '');
      
      var currentServlet = luminateEdit.getCurrentServlet();
      if(luminateEdit.tabUrl != null && currentServlet != null) {
        var adminBaseUrl = luminateEdit.tabUrl.split('/site/')[0];
        /* if this is an Image Library image, split on the images directory */
        if(luminateEdit.tabUrl.indexOf('/images/content/pagebuilder/') != -1) {
          adminBaseUrl = luminateEdit.tabUrl.split('/images/')[0];
        }
        
        chrome.tabs.create({
          url: adminBaseUrl + '/site/' + luminateEdit.servlets[currentServlet].getUrl()
        });
      }
    });
  }
};

/* bind listeners */
chrome.tabs.onUpdated.addListener(luminateEdit.operaNext.checkForLuminateOnlineUrl);
chrome.pageAction.onClicked.addListener(luminateEdit.operaNext.goToEditUrl);