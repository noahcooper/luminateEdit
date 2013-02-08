/*
 * Luminate Online Page Editor - Opera
 * luminateEdit-opera.js
 * Version: 1.0 (08-FEB-2013)
 */

luminateEdit.opera = {
  /* store reference to the toolbar button */
  editButton: null, 
  
  /* checks the current URL for known front-end servlet names, as defined in luminateEdit.servlets */
  checkForLuminateOnlineUrl: function() {
    /* set the tabUrl and show the button */
    if(opera.extension.tabs.getFocused()) {
      luminateEdit.tabUrl = opera.extension.tabs.getFocused().url;
    }
    
    if(luminateEdit.opera.editButton != null) {
      opera.contexts.toolbar.removeItem(luminateEdit.opera.editButton);
      luminateEdit.opera.editButton = null;
    }
    
    var currentServlet = luminateEdit.getCurrentServlet();
    if(currentServlet != null && luminateEdit.servlets[currentServlet] && luminateEdit.servlets[currentServlet].getUrl() != null) {
      luminateEdit.opera.editButton = opera.contexts.toolbar.createItem({
        title: 'Luminate Online Page Editor', 
        icon: 'icons/logo18.png', 
        onclick: luminateEdit.opera.goToEditUrl
      });
      opera.contexts.toolbar.addItem(luminateEdit.opera.editButton);
    }
  }, 
  
  /* go to the admin URL when the edit icon is clicked */
  goToEditUrl: function() {
    var currentServlet = luminateEdit.getCurrentServlet();
    if(luminateEdit.tabUrl != null && currentServlet != null) {
      opera.extension.tabs.create({
        url: luminateEdit.tabUrl.split('/site/')[0] + '/site/' + luminateEdit.servlets[currentServlet].getUrl()
      });
    }
  }
};

/* bind listeners */
opera.extension.tabs.addEventListener('focus', luminateEdit.opera.checkForLuminateOnlineUrl, false);
opera.extension.onconnect = luminateEdit.opera.checkForLuminateOnlineUrl;