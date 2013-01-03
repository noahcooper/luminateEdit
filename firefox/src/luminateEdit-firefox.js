/*
 * Luminate Online Page Editor - Firefox
 * luminateEdit-firefox.js
 * Version: 1.0 (29-NOV-2012)
 */

luminateEdit.firefox = {
  /* store reference to the add-on widget */
  editWidget: null, 
  
  /* checks the current URL for known front-end servlet names, as defined in luminateEdit.servlets */
  checkForLuminateOnlineUrl: function(tab) {
    /* set the tabUrl and show the button */
    if(require('tabs').activeTab.url) {
      luminateEdit.tabUrl = require('tabs').activeTab.url;
	}
    
    var currentServlet = luminateEdit.getCurrentServlet();
    if(currentServlet != null && luminateEdit.servlets[currentServlet] && luminateEdit.servlets[currentServlet].getUrl() != null) {
      luminateEdit.firefox.editWidget = require('widget').Widget({
        label: 'Luminate Online Page Editor', 
        id: 'luminate-edit-widget', 
        contentURL: require('self').data.url('logo16.png'), 
        onClick: luminateEdit.firefox.goToEditUrl
      });
    }
	else if(luminateEdit.firefox.editWidget != null) {
	  luminateEdit.firefox.editWidget.destroy();
	}
  }, 
  
  /* go to the admin URL when the edit icon is clicked */
  goToEditUrl: function() {
    var currentServlet = luminateEdit.getCurrentServlet();
    if(luminateEdit.tabUrl != null && currentServlet != null) {
      require('tabs').open(luminateEdit.tabUrl.split('/site/')[0] + '/site/' + luminateEdit.servlets[currentServlet].getUrl())
    }
  }
};

/* bind listeners */
require('tabs').on('activate', luminateEdit.firefox.checkForLuminateOnlineUrl);
require('tabs').on('ready', luminateEdit.firefox.checkForLuminateOnlineUrl);