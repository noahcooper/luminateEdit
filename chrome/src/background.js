/*
 * Luminate Online Page Editor
 * luminateEdit.js
 * Version: 1.7 (05-MAR-2013)
 */

/* namespace for the extension */
var luminateEdit = {
  /* stores the current tab URL */
  tabUrl: null, 
  
  /* returns the servlet for the current page */
  getCurrentServlet: function() {
    /* if tabUrl is null, or does not contain "/site/" or "/images/content/pagebuilder/", return early */
    if(luminateEdit.tabUrl == null || luminateEdit.tabUrl.indexOf('/site/') == -1 && 
       luminateEdit.tabUrl.indexOf('/images/content/pagebuilder/') == -1) {
      return null;
    }
    else {
      /* if this is an Image Library image, use a fake servlet name */
      if(luminateEdit.tabUrl.indexOf('/images/content/pagebuilder/') != -1) {
        return 'ImageLibraryPseudoServlet';
      }
      else {
        return luminateEdit.tabUrl.split('/site/')[1].split('/')[0].split('?')[0];
      }
    }
  }, 
  
  /* returns the value of a parameter in the current page's query string */
  getQueryParam: function(paramName) {
    /* if tabUrl is null, or does not contain a "?", return early */
    if(luminateEdit.tabUrl == null || luminateEdit.tabUrl.indexOf('?') == -1) {
      return null;
    }
    else {
      /* get the list of query strings, accounting for escaped ampersands */
      /* use a RegExp to ensure "&amp;" is not converted to "&" by UglifyJS */
      var queryStrings = '&' + luminateEdit.tabUrl.split('?')[1].replace(new RegExp('&' + 'amp;', 'g'), '&');
      
      /* if the param is not found, return early */
      if(queryStrings.indexOf('&' + paramName + '=') == -1) {
        return null;
      }
      else {
        return queryStrings.split('&' + paramName + '=')[1].split('&')[0];
      }
    }
  }, 
  
  /* common methods shared by multiple servlets */
  common: {
    api: {
      getUrl: function() {
        var adminUrl = 'SiteData?sdp=open_home';
        
        return adminUrl;
      }
    }
  }, 
  
  /* list of supported front-end servlets */
  /* each object should expose a getUrl method that returns the admin URL for the current page */
  servlets: {
    Advocacy: {
      getUrl: function() {
        var adminUrl = 'AdvocacyAdmin', 
        
        currentPage = luminateEdit.getQueryParam('page'), 
        currentPg = luminateEdit.getQueryParam('pg'), 
        currentRepId = luminateEdit.getQueryParam('rid'), 
        currentAlertId = luminateEdit.getQueryParam('id');
        
        if(luminateEdit.getQueryParam('alertId') != null) {
          currentAlertId = luminateEdit.getQueryParam('alertId');
        }
        
        var buildAdminUrl = function(advocacyPageType, additionalArgs, advocacyParam) {
          advocacyParam = advocacyParam || 'alertPageConfigPage.edit_alert_config_pages';
          return '?advocacy=' + advocacyParam + '&advocacyPageType=' + advocacyPageType + 
                 '&alert_id=${alertId}' + ((additionalArgs) ? additionalArgs : '');
        };
        
        /* ACTION ALERTS */
        switch(currentPage) {
          
          case 'UserAction':
            if(currentRepId != null) {
              /* Call Alerts */
              adminUrl += '?cmd=display&page=AdminActionPage&id=${alertId}';
            }
            else {
              /* Action Alerts */
              adminUrl += buildAdminUrl('takeActionBeanPage', '&isBeanPage=true', 
                                        'alertBeanPageEditor.edit_alert_config_pages');
            }
            break;
          
          case 'RepSelect':
            adminUrl += buildAdminUrl('confirmAction');
            break;
          
          case 'UserPrint':
            adminUrl += buildAdminUrl('printLetters');
            break;
          
          case 'OnScreenThanks':
            adminUrl += buildAdminUrl('displayThankYou');
            break;
          
          case 'TafThanks':
            adminUrl += buildAdminUrl('tellAFriendThanks');
            break;
          
          case 'NoRecipients':
            adminUrl += buildAdminUrl('noRecipients');
            break;
          
          case 'UserActionInactive':
            adminUrl += buildAdminUrl('noLongerActive');
            break;
        }
        
        /* CALL ALERTS */
        switch(currentPg) {
          
          case 'makeACall':
            adminUrl += '?advocacy=makeACallPageBannerEdit&alertId=${alertId}';
            break;
          
          case 'logACall':
            adminUrl += '?advocacy=logACallPageBannerEdit&alertId=${alertId}';
            break;
        }
        
        adminUrl = adminUrl.replace('${alertId}', currentAlertId);
        
        return adminUrl;
      }
    }, 
    AjaxProxy: {
      getUrl: function() {
        var adminUrl = 'SiteData?sdp=open_ajax_proxy';
        
        return adminUrl;
      }
    }, 
    Calendar: {
      getUrl: function() {
        var adminUrl = 'OrgEventEdit', 
        
        currentView = luminateEdit.getQueryParam('view'), 
        currentEventId = luminateEdit.getQueryParam('id');
        
        switch(currentView) {
          /* event detail page */
          case 'Detail':
            adminUrl += '?orgevent.edit=additional_event_info&event_id=${eventId}';
            break;
          /* default to identify event */
          default:
            if(currentEventId != null) {
              adminUrl += '?orgevent.edit=edit_event_information&event_id=${eventId}';
            }
        }
        
        adminUrl = adminUrl.replace('${eventId}', currentEventId);
        
        return adminUrl;
      }
    }, 
    Clubs: {
      getUrl: function() {
        var adminUrl = 'ClubsAdmin', 
        
        currentClubId = luminateEdit.getQueryParam('club_id');
        
        if(currentClubId != null) {
          adminUrl += '?edit=true&club_id=${clubId}&pg=aedit';
        }
        
        adminUrl = adminUrl.replace('${clubId}', currentClubId);
        
        return adminUrl;
      }
    }, 
    ConsInterestsUser: {
      getUrl: function() {
        var adminUrl = 'CenterStandardPageAdmin';
        
        return adminUrl;
      }
    }, 
    ConsProfileUser: {
      getUrl: function() {
        var adminUrl = 'CenterStandardPageAdmin';
        
        return adminUrl;
      }
    }, 
    CRAddressBookAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRAdvocacyAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRConnectAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRConsAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRContentAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRDataSyncAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRDonationAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRGroupAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CROrgEventAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRRecurringAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRSurveyAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    CRTeamraiserAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    Dir: {
      getUrl: function() {
        var adminUrl = 'DirectoryAdmin', 

        currentPg = luminateEdit.getQueryParam('pg');

        switch(currentPg) {
          case 'vprof':
            adminUrl = 'ConsProfileAdmin?consID=' + luminateEdit.getQueryParam('mbr') + '&tabID=personal';
            break;
        }

        return adminUrl;
      }
    }, 
    DocServer: {
      getUrl: function() {
        var adminUrl = 'DocumentAdmin';
        
        /* DocumentAdmin requires session info to be included in the URL to directly access a file */
        
        return adminUrl;
      }
    }, 
    Donation: {
      getUrl: function() {
        var adminUrl = 'DonationAdmin', 
        
        currentCampaignId = luminateEdit.getQueryParam('CAMPAIGN_ID');
        
        if(currentCampaignId != null) {
          adminUrl += '?ACTION=SHOW_CAMPAIGN_DETAILS&CAMPAIGN_ID=${campaignId}';
        }
        else {
          adminUrl = null;
        }
        
        adminUrl = adminUrl.replace('${campaignId}', currentCampaignId);
        
        return adminUrl;
      }
    }, 
    Donation2: {
      getUrl: function() {
        var adminUrl = 'Donation2Admin', 
        
        currentDfId = luminateEdit.getQueryParam('df_id'), 
        currentPg = luminateEdit.getQueryParam(currentDfId + '.donation'), 
        
        buildAdminUrl = function(donAdmin, action, additionalArgs) {
          return '?don.admin=' + donAdmin+ '&des_id=&action=' + action + '&dc_id=-1&df_id=${dfId}' + 
                 ((additionalArgs) ? additionalArgs : '');
        };
        
        switch(currentPg) {
          /* donation form */
          case 'form1':
            adminUrl += buildAdminUrl('designer', 'design_form', '&des_id=');
            break;
          case 'form2':
            adminUrl += buildAdminUrl('designer', 'design_form', '&des_id=');
            break;
          case 'form3':
            adminUrl += buildAdminUrl('designer', 'design_form', '&des_id=');
            break;
          case 'form4':
            adminUrl += buildAdminUrl('designer', 'design_form', '&des_id=');
            break;
          case 'form5':
            adminUrl += buildAdminUrl('designer', 'design_form', '&des_id=');
            break;
          /* thank you page */
          case 'completed':
            adminUrl += buildAdminUrl('ap_thanks', 'design_page', '&ap_tag=completed');
            break;
          /* default to design donor screens */
          default:
            if(currentDfId != null) {
              adminUrl += '?don.admin=form_cfg&action=cfg&dc_id=-1&df_id=${dfId}';
            }
        }
        
        adminUrl = adminUrl.replace('${dfId}', currentDfId);
        
        return adminUrl;
      }
    }, 
    Ecard: {
      getUrl: function() {
        var adminUrl = 'CommCenter', 
        
        currentEcardId = luminateEdit.getQueryParam('ecard_id'), 
        isThankYou = (luminateEdit.getQueryParam('thank_you') == null) ? false : true;
        
        if(currentEcardId != null) {
          if(isThankYou) {
            adminUrl += '?email=ecard_edit5&ecard_id=${ecardId}';
          }
          else {
            adminUrl += '?email=ecard_edit3&ecard_id=${ecardId}';
          }
        }
        else {
          adminUrl += '?email=ecard_list2';
        }
        
        adminUrl = adminUrl.replace('${ecardId}', currentEcardId);
        
        return adminUrl;
      }
    }, 
    Ecommerce: {
      getUrl: function() {
        var adminUrl = 'EcommerceAdmin', 
        
        currentStoreId = luminateEdit.getQueryParam('store_id'), 
        isViewProduct = (luminateEdit.getQueryParam('VIEW_PRODUCT') == 'true') ? true : false, 
        isConfirmation = (luminateEdit.getQueryParam('CONFIRMATION') == 'true') ? true : false, 
        currentProductId = luminateEdit.getQueryParam('product_id');
        
        if(isViewProduct) {
          adminUrl += '?ecommerce=prod_edit_long_desc&prod_id=${productId}';
        }
        else if(currentStoreId != null) {
          if(isConfirmation) {
            adminUrl += '?ecommerce=store_page_edit.store_edit&page_type=store_confirmation' + 
                        '&cp_id=6_store_confirmation_${storeId}_NA&store_id=${storeId}';    
          }
          else {
            adminUrl += '?ecommerce=store_edit&store_id=${storeId}';
          }
        }
        
        adminUrl = adminUrl.replace('${storeId}', currentStoreId)
                           .replace('${productId}', currentProductId);
        
        return adminUrl;
      }
    }, 
    EcommerceCheckout: {
      getUrl: function() {
        return luminateEdit.servlets.Ecommerce.getUrl();
      }
    }, 
    GetTogether: {
      getUrl: function() {
        var adminUrl = 'GetTogetherAdmin', 
        
        currentCalActivityId = luminateEdit.getQueryParam('cal_activity_id'), 
        currentGettogether = luminateEdit.getQueryParam('gettogether'), 
        currentCalEventId = luminateEdit.getQueryParam('cal_event_id');
        
        var buildAdminUrl = function(gettogetherAdmin, pageType) {
          return '?gettogether.admin=' + gettogetherAdmin + '&page_type=' + pageType + 
                 '&cal_activity_id=${calActivityId}&cal_campaign_id=';
        };
        
        switch(currentGettogether) {
          case 'activity_splash':
            adminUrl += buildAdminUrl('edit_activity_splash.edit.activity', 'cp_activity_splash');
            break;
          case 'event_list':
            adminUrl += buildAdminUrl('edit_event_list.edit.activity', 'cp_event_list');
            break;
          
          /* TODO reg_host_confirm */
          
          case 'host_center':
            adminUrl += buildAdminUrl('host_center_home.edit.hostcenter', 'cp_host_center');
            break;
          case 'edit_event_detail':
            adminUrl += buildAdminUrl('host_center_event_detail.edit.hostcenter', 'cp_event_detail');
            break;
          case 'edit_event_detail.ep':
            adminUrl += buildAdminUrl('host_center_event_detail.edit.hostcenter', 'cp_event_detail');
            break;
          case 'guest_detail':
            adminUrl += buildAdminUrl('edit_guest_detail.edit.hostcenter', 'cp_guest_detail');
            break;
          
          /* TODO host_event_page */
          
          case 'email_center':
            adminUrl += buildAdminUrl('host_center_email_center.edit.hostcenter', 'cp_email_center_page');
            break;
          case 'email_center_message':
            adminUrl += '?taf_id=&gettogether.admin=edit_activity_messages&cal_activity_id=${calActivityId}' + 
                        '&action=messages_type&cal_campaign_id=&taf_list_key_editable=';
            break;
          case 'email_center_plaxo':
            adminUrl += buildAdminUrl('host_center_plaxo.edit.hostcenter', 'cp_email_center_plaxo');
            break;
          case 'event_main':
            adminUrl += '?gettogether.admin=cal_attendees_list&cal_event_id=${calEventId}' + 
                        '&cal_activity_id=${calActivityId}&action=messages_type&cal_campaign_id=';
            break;
          case 'change_attendee_detail':
            adminUrl += buildAdminUrl('edit_attendee_change_rsvp.edit.activity', 'cp_change_attendee');
            break;
          default:
            if(currentCalActivityId != null) {
              adminUrl += '?gettogether.admin=config_activity_pages.edit&cal_activity_id=${calActivityId}' + 
                          '&action=config_activity_pages&cal_campaign_id=';
            }
        }
        
        adminUrl = adminUrl.replace('${calActivityId}', currentCalActivityId)
                           .replace('${calEventId}', currentCalEventId);
        
        return adminUrl;
      }
    }, 
    GetTogetherSec: {
      getUrl: function() {
        var adminUrl = 'GetTogetherAdmin', 
        
        currentCalActivityId = luminateEdit.getQueryParam('cal_activity_id'), 
        currentGettogether = luminateEdit.getQueryParam('gettogether');
        
        var buildAdminUrl = function(gettogetherAdmin, pageType) {
          return '?gettogether.admin=' + gettogetherAdmin + '&page_type=' + pageType + 
                 '&cal_activity_id=${calActivityId}&cal_campaign_id=';
        };
        
        switch(currentGettogether) {
          case 'register_host_detail':
            adminUrl += buildAdminUrl('cust_reg_host_detail.edit.host', 'cp_host_detail');
            break;
          case 'register_event_detail':
            adminUrl += buildAdminUrl('cust_reg_host_event_detail.edit.host', 'cp_reg_event_detail');
            break;
          case 'register_host_waiver':
            adminUrl += buildAdminUrl('cust_reg_host_waiver.edit.host', 'cp_host_waiver');
            break;
          case 'register_attendee_detail':
            adminUrl += buildAdminUrl('edit_attendee_detail.edit.activity', 'cp_attendee_detail');
            break;
        }
        
        adminUrl = adminUrl.replace('${calActivityId}', currentCalActivityId);
        
        return adminUrl;
      }
    }, 
    GigyaLogin: {
      getUrl: function() {
        var adminUrl = 'Social?social=open_auth_config';
        
        return adminUrl;
      }
    }, 
    ImageLibraryPseudoServlet: {
      getUrl: function() {
        var adminUrl = 'ImageLibrary', 
        
        currentImageFileName = luminateEdit.tabUrl.split('/pagebuilder/')[1].split('?')[0];
        
        adminUrl += '?cat.filter=-1&filter_text=${imageFileName}&filter_search=Search&page_number=' + 
                    '&lcmd=filtering&lcmd_cf=&cmd=Hide&image_type=graphic&xcode=standalone&action=selectimage' + 
                    '&page_id=&component_index=&org=';
        
        /* most admin-side servlets redirect appropriately if requested using the /site/ directory */
        /* the ImageLibrary servlet, however, throws a security error */
        /* there's no good way to know the secure URL from a non-secure page */
        /* so, use CRTeamraiserAPI which is always secure as a passthrough */
        adminUrl = 'CRTeamraiserAPI?method=&v=1.0&redirect=' + 
                   encodeURIComponent('../admin/' + adminUrl.replace('${imageFileName}', currentImageFileName));
        
        return adminUrl;
      }
    }, 
    LteUser: {
      getUrl: function() {
        var adminUrl = 'LteAdmin', 
        
        currentLteId = luminateEdit.getQueryParam('lte_id'), 
        currentLteUserPage = luminateEdit.getQueryParam('lte.user');
        
        var buildAdminUrl = function(lteTarget) {
          return '?lte.admin=admin_pages_editor&lte_id=${lteId}' + 
                 ((lteTarget) ? ('&target=' + lteTarget) : '');
        };
        
        switch(currentLteUserPage) {
          /* zip code */
          case 'lte_resolve_zip':
            adminUrl += buildAdminUrl('lte_resolve_zip');
            break;
          /* take action */
          case 'lte_write_letter':
            adminUrl += buildAdminUrl('lte_write_letter');
            break;
          /* thank you page */
          case 'lte_thank_you':
            adminUrl += buildAdminUrl('lte_thank_you');
            break;
          /* tell-a-friend */
          case 'lte_taf_fwd_letter':
            adminUrl += buildAdminUrl('lte_taf_fwd_letter');
            break;
          /* tell-a-friend confirmation */
          case 'lte_taf_thank_you':
            adminUrl += buildAdminUrl('lte_taf_thank_you');
            break;
          /* not published */
          case 'lte_not_published':
            adminUrl += buildAdminUrl('lte_not_published');
            break;
          /* alert already taken */
          case 'lte_already_taken':
            adminUrl += buildAdminUrl('lte_already_taken');
            break;
          /* alert expired */
          case 'lte_expired':
            adminUrl += buildAdminUrl('lte_expired');
            break;
          /* default to configure pages */
          default:
            if(currentLteId != null) {
              adminUrl += buildAdminUrl();
            }
        }
        
        adminUrl = adminUrl.replace('${lteId}', currentLteId);
        
        return adminUrl;
      }
    }, 
    News: {
      getUrl: function() {
        return luminateEdit.servlets.News2.getUrl();
      }
    }, 
    News2: {
      getUrl: function() {
        var adminUrl = 'News2Admin', 
        
        currentArticleId = luminateEdit.getQueryParam('id'), 
        currentPg = luminateEdit.getQueryParam('page');
        
        switch(currentPg) {
          case 'NewsArticle':
            if(currentArticleId != null) {
              adminUrl += '?page=ArticleEditor&id=${articleId}';
            }
            break;
        }
        
        adminUrl = adminUrl.replace('${articleId}', currentArticleId);
        
        return adminUrl;
      }
    }, 
    PageNavigator: {
      getUrl: function() {
        var adminUrl = 'PageBuilderAdmin',
        
        currentPageName = luminateEdit.tabUrl.split('.html')[0].split('/')[luminateEdit.tabUrl.split('/').length - 1];
        
        if(currentPageName != null) {
          adminUrl += '?filter_text=${pageName}&filter_search=Search&pagebuilder=page_list&lcmd=filtering';
        }
        else {
          adminUrl += '?pagebuilder=page_list';
        }
        
        adminUrl = adminUrl.replace('${pageName}', currentPageName);
        
        return adminUrl;
      }
    }, 
    PageServer: {
      getUrl: function() {
        var adminUrl = 'PageBuilderAdmin',
        
        currentPageName = luminateEdit.getQueryParam('pagename');
        
        if(currentPageName != null) {
          adminUrl += '?filter_text=${pageName}&filter_search=Search&pagebuilder=page_list&lcmd=filtering';
        }
        else {
          adminUrl += '?pagebuilder=page_list';
        }
        
        adminUrl = adminUrl.replace('${pageName}', currentPageName);
        
        return adminUrl;
      }
    }, 
    PhotoAlbumUser: {
      getUrl: function() {
        var adminUrl = 'PhotoAlbumAdmin', 
        
        currentView = luminateEdit.getQueryParam('view'), 
        currentAlbumID = luminateEdit.getQueryParam('AlbumID'), 
        currentPhotoID = luminateEdit.getQueryParam('PhotoID');
        
        switch(currentView) {
          case 'UserAlbum':
            adminUrl += '?view=AlbumCreateDetail&AlbumID=${albumId}';
            break;
          case 'UserPhotoDetail':
            adminUrl += '?view=UpdatePhoto&PhotoID=${photoId}';
            break;
        }
        
        adminUrl = adminUrl.replace('${albumId}', currentAlbumID).replace('${photoId}', currentPhotoID);
        
        return adminUrl;
      }
    }, 
    ServiceCenter: {
      getUrl: function() {
        var adminUrl = 'ServiceCenterAdmin', 
        
        currentPg = luminateEdit.getQueryParam('pg');
        
        switch(currentPg) {
          case 'cancel':
            adminUrl += '?svc.admin=svc_cancel_payment';
            break;
          case 'modifyamt':
            adminUrl += '?svc.admin=svc_modify_amount';
            break;
          case 'skip':
            adminUrl += '?svc.admin=svc_skip_payment';
            break;
          case 'changecc':
            adminUrl += '?svc.admin=svc_sustainer_change_cc';
            break;
          case 'changeeft':
            adminUrl += '?svc.admin=svc_sustainer_change_eft';
            break;
          
          /* TODO modify gift date */
        }
        
        return adminUrl;
      }
    }, 
    SPageNavigator: {
      getUrl: function() {
        return luminateEdit.servlets.PageNavigator.getUrl();
      }
    }, 
    SPageServer: {
      getUrl: function() {
        return luminateEdit.servlets.PageServer.getUrl();
      }
    }, 
    SRAdvocacyAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SRConsAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SRContentAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SRDataSyncAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SRDonationAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SRGroupAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SROrgEventAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SRRecurringAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SRSurveyAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SRTeamraiserAPI: {
      getUrl: function() {
        return luminateEdit.common.api.getUrl();
      }
    }, 
    SSurvey: {
      getUrl: function() {
        return luminateEdit.servlets.Survey.getUrl();
      }
    }, 
    Survey: {
      getUrl: function() {
        var adminUrl = 'SurveyAdmin', 
        
        currentSurveyId = luminateEdit.getQueryParam('SURVEY_ID');
        
        if(currentSurveyId != null) {
          adminUrl += '?action=edit_survey&survey=survey_page_edit&survey_id=${surveyId}';
        }
        else {
          adminUrl += '?survey=survey_list';
        }
        
        adminUrl = adminUrl.replace('${surveyId}', currentSurveyId);
        
        return adminUrl;
      }
    }, 
    TeamRaiserUser: {
      getUrl: function() {
        /* TODO */
      }
    }, 
    Ticketing: {
      getUrl: function() {
        var adminUrl = 'OrgEventEdit', 
        
        currentEventId = luminateEdit.getQueryParam('id');
        
        adminUrl += '?orgevent.edit=edit_event_information&event_id=${eventId}';
        
        adminUrl = adminUrl.replace('${eventId}', currentEventId);
        
        return adminUrl;
      }
    }, 
    TR: {
      getUrl: function() {
        var adminUrl = 'TREdit', 
        
        currentPg = luminateEdit.getQueryParam('pg'), 
        currentFrId = luminateEdit.getQueryParam('fr_id'), 
        
        buildTeamraiserAdminUrl = function(pageType) {
          return '?app_id=26&page_type=' + pageType + '&tr=edit_event_page' + 
                 '&action=edit_custom_page_content&fr_id=${frId}';
        }, 
        buildPersonalFundraisingUrl = function(pageType) {
          return '?page_type=' + pageType + '&action=edit_custom_page_content' + 
                 '&tr.tributes=custom_page_edit&fr_id=${frId}';
        };
        
        switch(currentPg) {
          /* TEAMRAISER */
          /* greeting page */
          case 'entry':
            adminUrl += buildTeamraiserAdminUrl('fr_info');
            break;
          /* find a participant */
          case 'pfind':
            adminUrl += buildTeamraiserAdminUrl('fr_part_finder');
            break;
          /* top participants list */
          case 'topparticipantlist':
            adminUrl += buildTeamraiserAdminUrl('fr_top_participant_list');
            break;
          /* team list */
          case 'teamlist':
            adminUrl += buildTeamraiserAdminUrl('fr_team_list');
            break;
          /* company list */
          case 'complist':
            adminUrl += buildTeamraiserAdminUrl('fr_company_list');
            break;
          /* custom pages */
          case 'informational':
            adminUrl += '?page_type=fr_informational&tr=edit_informational_page' + 
                        '&action=edit_informational_page&fr_id=${frId}&soid=' + 
                        luminateEdit.getQueryParam('sid');
            break;
          /* personal page */
          case 'personal':
            adminUrl = 'FriendraiserAdmin?pg=editor&type=fr_personal&fr_id=${frId}&frppid=' + 
                       luminateEdit.getQueryParam('px');
            break;
          /* team page */
          case 'team':
            adminUrl = 'FriendraiserAdmin?pg=editor&type=fr_team_page&fr_id=${frId}&team_id=' + 
                       luminateEdit.getQueryParam('team_id');
            break;
          /* company page */
          case 'company':
            adminUrl = 'TRManage?tr.manage=edit_local_company_page&page_type=fr_company_page' + 
                       '&action=edit_custom_page_content&fr_id=${frId}&company_id=' + 
                       luminateEdit.getQueryParam('company_id');
            break;
          /* national team page */
          case 'national_company':
            adminUrl += '?exit_process=&page_type=fr_national_company_page' + 
                        '&tr=national_company_specific_page_edit&action=edit_national_company_page' + 
                        '&exit_url=&company_id=' + luminateEdit.getQueryParam('company_id');
            break;
          /* ecommerce entry page */
          case 'fr_ecommerce':
            adminUrl += buildTeamraiserAdminUrl('fr_ecommerce_page');
            break;
          /* ecommerce search page */
          case 'fr_ecommerce_search':
            adminUrl += buildTeamraiserAdminUrl('fr_ecommerce_search_page');
            break;
          
          /* PERSONAL FUNDRAISING */
          /* greeting page */
          case 'tgreeting':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl('fr_tribute_greeting');
            break;
          /* search page */
          case 'ffind':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl('fr_tribute_search');
            break;
          
          case 'fund':
            adminUrl = 'TRTributes?champion_editable_page=true&page_type=fr_tribute_fund' + 
                       '&action=edit_fund_page_content&tr.tributes=fund_page_edit.Honorary' + 
                       '&fr_id=${frId}&team_id=' + luminateEdit.getQueryParam('pxfid');
            break;
          
          /* TODO fund page TAF */
        }
        
        adminUrl = adminUrl.replace('${frId}', currentFrId);
        
        return adminUrl;
      }
    }, 
    TRC: {
      getUrl: function() {
        var adminUrl = 'TREdit', 
        
        currentPg = luminateEdit.getQueryParam('pg'), 
        currentFrId = luminateEdit.getQueryParam('fr_id'), 
        
        buildTeamraiserAdminUrl = function() {
          return '?app_id=26&page_type=fr_center&tr=edit_event_page&action=edit_custom_page_content' + 
                 '&fr_id=${frId}';
        }, 
        buildPersonalFundraisingUrl = function(pageType) {
          return '?page_type=champ_center&action=edit_custom_page_content&tr.tributes=custom_page_edit' + 
                 '&fr_id=${frId}';
        };
        
        switch(currentPg) {
          /* TEAMRAISER */
          
          case 'center':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'settings':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'peditor':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'cpeditor':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'abook':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'mtype':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'taf':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'follow':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'progress':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'tprogress':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          case 'reports':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          /* PERSONAL FUNDRAISING */
          
          case 'champ_mf_center':
            adminUrl = 'TRTributes';
            adminUrl += '?page_type=champ_mf_center&action=edit_custom_page_content' + 
                        '&tr.tributes=custom_page_edit&fr_id=${frId}';
            break;
          
          case 'champ_center':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
          
          case 'fundup':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
          
          case 'feditor':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
          
          case 'pfabook':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
          
          case 'pfmtype':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
          
          case 'pftaf':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
          
          case 'pffollow':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
          
          case 'fprogress':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
        }
        
        adminUrl = adminUrl.replace('${frId}', currentFrId);
        
        return adminUrl;
      }
    }, 
    TRR: {
      getUrl: function() {
        var adminUrl = 'TREdit', 
        
        currentPg = luminateEdit.getQueryParam('pg'), 
        currentFrId = luminateEdit.getQueryParam('fr_id'), 
        
        buildTeamraiserAdminUrl = function(pageType) {
          return '?app_id=26&page_type=' + pageType + '&tr=edit_event_page' + 
                 '&action=edit_custom_page_content&fr_id=${frId}';
        }, 
        buildPersonalFundraisingUrl = function(pageType) {
          return '?page_type=' + pageType + '&action=edit_custom_page_content' + 
                 '&tr.tributes=custom_page_edit&fr_id=${frId}';
        };
        
        switch(currentPg) {
          /* TEAMRAISER */
          /* team selection */
          case 'tfind':
            adminUrl += buildTeamraiserAdminUrl('fr_team_finder');
            break;
          /* team password */
          case 'tpass':
            adminUrl += buildTeamraiserAdminUrl('fr_team_password');
            break;
          /* participation options */
          case 'ptype':
            adminUrl += buildTeamraiserAdminUrl('fr_part_type');
            break;
          /* returning participant login */
          case 'utype':
            adminUrl += buildTeamraiserAdminUrl('fr_user_type');
            break;
          /* registration information */
          case 'reg':
            adminUrl += buildTeamraiserAdminUrl('fr_register');
            break;
          /* waiver */
          case 'waiver':
            adminUrl += buildTeamraiserAdminUrl('fr_waiver');
            break;
          /* registration summary */
          case 'regsummary':
            adminUrl += buildTeamraiserAdminUrl('fr_reg_summary');
            break;
          /* secondary registration information */
          case 'reganother':
            adminUrl += buildTeamraiserAdminUrl('fr_reg_another');
            break;
          /* payment page */
          case 'paymentForm':
            adminUrl += buildTeamraiserAdminUrl('fr_payment');
            break;
          /* thank you */
          case 'rthanks':
            adminUrl += buildTeamraiserAdminUrl('fr_thanks');
            break;
          
          /* PERSONAL FUNDRAISING */
          /* enter fund information */
          case 'tcfund':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl('fr_tribute_create_fund');
            break;
          /* enter memorial honoree information */
          case 'temhon':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl('fr_tribute_enter_memorial_honoree');
            break;    
          /* enter honorary information */
          case 'tethon':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl('fr_tribute_enter_tribute_honoree');
            break;
          /* champion information */
          case 'treg':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl('fr_tribute_register');
            break;
          /* waiver */
          case 'twaiver':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl('fr_tribute_waiver');
            break;
          /* thank you */
          case 'trthanks':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl('fr_tribute_thanks');
            break;
        }
        
        adminUrl = adminUrl.replace('${frId}', currentFrId);
        
        return adminUrl;
      }
    }, 
    TRSC: {
      getUrl: function() {
        var adminUrl = 'TREdit', 
        
        currentPg = luminateEdit.getQueryParam('pg'), 
        currentFrId = luminateEdit.getQueryParam('fr_id'), 
        
        buildTeamraiserAdminUrl = function() {
          return '?app_id=26&page_type=fr_center&tr=edit_event_page&action=edit_custom_page_content' + 
                 '&fr_id=${frId}';
        }, 
        buildPersonalFundraisingUrl = function(pageType) {
          return '?page_type=champ_center&action=edit_custom_page_content&tr.tributes=custom_page_edit' + 
                 '&fr_id=${frId}';
        };
        
        switch(currentPg) {
          /* TEAMRAISER */
          
          case 'ogift':
            adminUrl += buildTeamraiserAdminUrl();
            break;
          
          /* PERSONAL FUNDRAISING */
          
          case 'pfogift':
            adminUrl = 'TRTributes';
            adminUrl += buildPersonalFundraisingUrl();
            break;
        }
        
        adminUrl = adminUrl.replace('${frId}', currentFrId);
        
        return adminUrl;
      }
    }, 
    UserCenter: {
      getUrl: function() {
        return luminateEdit.servlets.ServiceCenter.getUrl();
      }
    }, 
    VoteCenter: {
      getUrl: function() {
        var adminUrl = 'VoteCenterAdmin', 
        
        currentPage = luminateEdit.getQueryParam('page'), 
        currentVoteId = luminateEdit.getQueryParam('voteId');
        
        switch(currentPage) {
          /* vote list */
          case 'voteList':
            adminUrl += '?vote=configVoteListPage';
            break;
          /* legislator scorecard */
          case 'legScore':
            adminUrl += '?repId=&vote=legScorecardPageEdit&voteId=&mode=edit';
            break;
          /* combined legislator scorecard */
          case 'combLegScore':
            adminUrl += '?vote=combLegScorecardEdit&voteId=&mode=edit';
            break;
          /* congress scorecard */
          case 'congScorecard':
            adminUrl += '?location=S&vote=congScorecardEdit&mode=edit';
            break;
          /* vote information */
          case 'voteInfo':
            adminUrl += '?vote=voteInfoPage&voteId=${voteId}';
            break;
          /* legislator vote page */
          case 'legVote':
            adminUrl += '?vote=voteLegPage&voteId=${voteId}';
            break;
          /* default to configure vote */
          default:
            if(currentVoteId != null) {
              adminUrl += '?vote=voteConfigInfo&voteId=${voteId}';
            }
        }
        
        adminUrl = adminUrl.replace('${voteId}', currentVoteId);
        
        return adminUrl;
      }
    }
  }
};

/*
 * Luminate Online Page Editor - Chrome
 * luminateEdit-chrome.js
 * Version: 1.3 (19-FEB-2013)
 */

luminateEdit.chrome = {
  /* checks the current URL for known front-end servlet names, as defined in luminateEdit.servlets */
  checkForLuminateOnlineUrl: function(tabId, changeInfo, tab) {
    /* set the tabUrl and show the button as soon as the tab starts loading */
    if(changeInfo.status == 'loading') {
      luminateEdit.tabUrl = tab.url.replace('view-source:', '');
      
      var currentServlet = luminateEdit.getCurrentServlet();
      if(currentServlet != null && luminateEdit.servlets[currentServlet] && 
         luminateEdit.servlets[currentServlet].getUrl() != null) {
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
chrome.tabs.onUpdated.addListener(luminateEdit.chrome.checkForLuminateOnlineUrl);
chrome.pageAction.onClicked.addListener(luminateEdit.chrome.goToEditUrl);