/*
 * Luminate Online Page Editor - Chrome
 * luminateEdit-chrome.js
 * Version: 1.1 (08-FEB-2013)
 */

luminateEdit.chrome = {
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
      luminateEdit.tabUrl = allTabs[0].url;
      
      var currentServlet = luminateEdit.getCurrentServlet();
      if(luminateEdit.tabUrl != null && currentServlet != null) {
        chrome.tabs.create({
          url: luminateEdit.tabUrl.split('/site/')[0] + '/site/' + luminateEdit.servlets[currentServlet].getUrl()
        });
      }
    });
  }
};

/* bind listeners */
chrome.tabs.onUpdated.addListener(luminateEdit.chrome.checkForLuminateOnlineUrl);
chrome.pageAction.onClicked.addListener(luminateEdit.chrome.goToEditUrl);