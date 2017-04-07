/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['knockout', 'config/serviceConfig', 'jquery', 'js/util/errorhandler', 'ojs/ojcore', 'ojs/ojaccordion', 'ojs/ojcollapsible'
], function (ko, service, $, errorHandler) {
    /**
     * The view model for the main content view template
     */
    function createUsersViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        //for adding Users and Assigning roles
        self.urlForMyServices = ko.observable('https://myservices.em2.oraclecloud.com/mycloud/faces/dashboard.jspx');
        self.textForMyServices = ko.observable('Go to MyServices to Add Users');
        
        //for adding Admin Users and Assigning roles
        self.urlForMyAccount = ko.observable('https://myaccount.cloud.oracle.com/mycloud/faces/dashboard.jspx');
        self.textForMyAccount = ko.observable('Go to MyAccounts to Add Users');
        
        self.documentsArray = ko.observableArray([]);
        
        var getFileDetailsSuccessFn = function(data, status) {
            if (status !== 'nocontent') {
                console.log(data);
                self.documentsArray([]);
                var array = [];
                for (var idx = 0; idx < data.length; idx++) {
                    array.push({
                        "displayLabel": data[idx].displayLabel,
                        "accessToken": data[idx].accessToken,
                        "appLinkId": data[idx].appLinkId,
                        "appLinkUrl": data[idx].appLinkUrl,
                        "displayOrder": data[idx].displayOrder,
                        "docCsRole": data[idx].docCsRole,
                        "docFileId": data[idx].docFileId,
                        "docMetaData": data[idx].docMetaData,
                        "docType": data[idx].docType,
                        "docTypeExtn": data[idx].docTypeExtn,
                        "fileName": data[idx].fileName,
                        "publicLinkId": data[idx].publicLinkId,
                        "refreshToken": data[idx].refreshToken,
                        "stepCode": data[idx].stepCode,
                        "stepId": data[idx].stepId,
                        "subStepCode": data[idx].subStepCode,
                    });
                }
                self.documentsArray(array);
                $( "#docsListAccordion" ).ojAccordion( "refresh" );
            } else {
                console.log('Content not available for the selected step');
            }
            hidePreloader();
        };
        
        
        self.getAccessToken = function(event, data) {
            console.log(event);
            console.log(data);
            // collapsibleId is the index of collapsible [parent object]
            var collapsibleId = data.toCollapsible[0].id;
            var selectedObject = self.documentsArray()[collapsibleId];
            console.log(selectedObject);
            if(selectedObject.docTypeExtn !== 'mp4') {
                if($("#iframe" + collapsibleId)) {
                    console.log("found iframe: " + collapsibleId);
                    $("#iframe" + collapsibleId).attr('src', selectedObject.appLinkUrl);
                    console.log('successfully added iframe source');
                    function OnMessage (evt) {   
                        console.log(evt.data);
                        if (evt.data.message === 'appLinkReady') {
                            var iframe= $("#iframe" + collapsibleId)[0];
                            console.log(iframe);
                            var iframewindow= iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView;
                            var msg = {
                                    message: 'setAppLinkTokens',
                                    appLinkRefreshToken: selectedObject.refreshToken,
                                    appLinkAccessToken: selectedObject.accessToken,
                                    appLinkRoleName: "downloader",
                                    embedPreview: true
                            };

                            iframewindow.postMessage(msg, '*');
                            console.log('successfully added iframe with message');
                        }
                    };
                    window.addEventListener && window.addEventListener('message', OnMessage, false);
                }
            } else {
                if($("#video" + collapsibleId)) {
                    console.log("found video: " + collapsibleId);
                    var video = document.getElementById("video" + collapsibleId);
                    var sources = video.getElementsByTagName('source');
                    sources[0].src = "https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/link/app/" + selectedObject.appLinkId + "/file/" + selectedObject.docFileId + "&dAppLinkAccessToken=" + selectedObject.accessToken;
                    video.load();
                    console.log('successfully added source');
//                    return("https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/link/app/" + appLinkId + "/file/" + docFileId + "&dAppLinkAccessToken=" + accessToken);
                }
            }
        };
        
        self.getDocsViewLink = function(docTypeExtn, index, appLinkUrl, refreshToken, accessToken, appLinkId, docFileId) {
            if (docTypeExtn !== 'mp4') {
                $("#iframe" + index).attr('src', appLinkUrl);
                function OnMessage (evt) {   
                    console.log(evt.data);
                    if (evt.data.message === 'appLinkReady') {
                        var iframe= $("#" + docFileId)[0];
                        var iframewindow= iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView;
                        var msg = {
                                message: 'setAppLinkTokens',
                                appLinkRefreshToken: refreshToken,
                                appLinkAccessToken: accessToken,
                                appLinkRoleName: "downloader",
                                embedPreview: true
                        };

                        iframewindow.postMessage(msg, '*');
                    }
                };
                window.addEventListener && window.addEventListener('message', OnMessage, false);
            } else {
                console.log("https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/link/app/" + appLinkId + "/file/" + docFileId + "&dAppLinkAccessToken=" + accessToken);
                return("https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/link/app/" + appLinkId + "/file/" + docFileId + "&dAppLinkAccessToken=" + accessToken);
            }
        };
        
        var getFileDetailsFailFn = function(xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };
        
        self.goToServices = function(data, event) {
            showPreloader();
            isLoggedInUser(true);
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": "itAdmin",
                "curStepCode": 'servicesMini',
                "preStepCode": getStateId(),
                "userAction" : "Go to Services Provisioned"
            });
        };
        
//        self.addMoreUsers = function() {
//            console.log('Clicked add more user');
//            isLoggedInUser(true);
//            router.go('createUsers/');
//        };
//        self.doNotAddUsers = function() {
//            isLoggedInUser(true);
//            router.go('servicesMini/');
//        };
        
        self.handleAttached = function() {
            showPreloader();
            service.getFileDetails(getStateId()).then(getFileDetailsSuccessFn, getFileDetailsFailFn);
        };
    }
    
    return createUsersViewModel;
});
