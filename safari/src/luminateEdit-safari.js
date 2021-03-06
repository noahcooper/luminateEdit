/*
 * Luminate Online Page Editor - Safari
 * luminateEdit-safari.js
 * Version: 1.12 (15-NOV-2017)
 */

luminateEdit.safari = {
  /* checks the current URL for known front-end servlet names, as defined in luminateEdit.servlets */
  checkForLuminateOnlineUrl: function(event) {
    /* set the tabUrl and show the button */
    if(event.target.browserWindow.activeTab.url) {
      luminateEdit.tabUrl = event.target.browserWindow.activeTab.url;
    }
    
    var currentServlet = luminateEdit.getCurrentServlet();
    if(currentServlet != null && luminateEdit.servlets[currentServlet] && luminateEdit.servlets[currentServlet].getUrl() != null) {
      event.target.disabled = false;
    }
    else {
      event.target.disabled = true;
    }
  }, 
  
  /* go to the admin URL when the edit icon is clicked */
  goToEditUrl: function(event) {
    if(event.command == 'editPageContent') {
      var currentServlet = luminateEdit.getCurrentServlet();
      if(luminateEdit.tabUrl != null && currentServlet != null) {
        var adminBaseUrl = luminateEdit.tabUrl.split('/site/')[0];
        /* if this is an Image Library image, split on the images directory */
        if(luminateEdit.tabUrl.indexOf('/images/content/pagebuilder/') != -1) {
          adminBaseUrl = luminateEdit.tabUrl.split('/images/')[0];
        }
        
        event.target.browserWindow.openTab().url = adminBaseUrl + '/site/' + luminateEdit.servlets[currentServlet].getUrl();
      }
    }
  }
};

/* bind listeners */
safari.application.addEventListener('validate', luminateEdit.safari.checkForLuminateOnlineUrl, true);
safari.application.addEventListener('command', luminateEdit.safari.goToEditUrl, true);