/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * service module
 */
define(['knockout', 'config/serviceConfig', 'jquery', 'ojs/ojcore', 'ojs/ojprogressbar', 'ojs/ojmasonrylayout','components/trainnavigation/loader','components/techsupport/loader'
], function (ko, service, $) {
    /**
     * The view model for the main content view template
     */
    function serviceContentViewModel(params) {        
               
        var self = this;
        var router = params.ojRouter.parentRouter;
        self.servicesAsExpected = ko.observable(true);
        self.showSupportPanel = ko.observable(false);
        self.serviceItems = ko.observableArray([]);
        self.noServices = ko.observable(false);
        self.detailsContentMaxHeight = ko.observable(0);
        self.showViewAllButton = ko.observable(false);

        self.goToDashboard = function () {
            showPreloader();
            isLoggedInUser(true);
//            setTimeout(function () {
                service.updateCurrentStep({
                    "userId": loggedInUser(),
                    "userRole": loggedInUserRole(),
                    "curStepCode": 'dashboard',
                    "preStepCode": getStateId(),
                    "userAction": "Go To Dashboard"
                });
//            }, 500);
//            slideOutAnimate(1500, 0);
        };
        self.contactSupport = function () {
            self.servicesAsExpected(false);
            self.showSupportPanel(true);
        };


        self.displayMail = function () {
            selectedTemplate('email_content');
            $('#tech_support').slideToggle();
        };

        self.displayCall = function () {
            selectedTemplate('phone_content');
            $('#tech_support').slideToggle();
        };

        self.displayChat = function () {
            selectedTemplate('chat_content');
            $('#tech_support').slideToggle();
        };
        
        self.currentStepValue = ko.observable('stp3');
        self.stepsArray =ko.observableArray([
            {label: 'Choose Role', id: 'stp1'},
            {label: 'Add Users', id: 'stp2'},
            {label: 'Services', id: 'stp3'}
        ]);
        self.actionDisabledCss = "disable-train-selection";
        
        self.getClass = function(serverType) {
//            if (serverType === 'COMPUTE') {
//                return 'blue';
//            } else if (serverType === 'JCS') {
//                return 'green';
//            } else {
//                //Changing it to blue as all the IAAS will be blue
//                return 'blue';
//            }
            return 'purple';
        };
        
        self.getIcon = function(serverType) {
            if (serverType.toLowerCase().indexOf("compute") >= 0) {
                return 'img/compute_w_72.png';
            } else if (serverType.toLowerCase().indexOf("storage") >= 0) {
                return 'img/storage_w_72.png';
            } else if (serverType.toLowerCase().indexOf("network") >= 0) {
                return 'img/network_w_72.png';
            } else if (serverType.toLowerCase().indexOf("container") >= 0) {
                return 'img/Container_w_72.png';
            } else if (serverType.toLowerCase().indexOf("ravello") >= 0) {
                 return 'img/Ravello_w_72.png';
            } else if (serverType.toLowerCase().indexOf("cloud machine") >= 0) {
                return 'img/CloudMachine_w_72.png';
            } 
            else {
               return 'img/compute_w_72.png';
            }
        };
        
        function populateUI(data, status) {
            console.log(data);
            console.log(status);
            var length = 0;
            if (data) {
                $.each(data, function(idx, serviceItem) {
                    if (length < serviceItem.details.length) {
                        length = serviceItem.details.length;
                    }
                });
                self.detailsContentMaxHeight(length);
                self.serviceItems(data);
            } else {
                self.noServices(true);
            }
            hidePreloader();
        };
        
        self.handleAttached = function () {
            showPreloader();
            checkIfOnboardingComplete();
            // slideInAnimate(500, 0);
            // service.getServiceItems().then(populateUI, FailCallBackFn);
            service.getUserClmData(loggedInUser()).then(populateUI, FailCallBackFn);
        };
        
        self.handleTransitionCompleted = function () {
            // scroll the whole window to top if it's scroll position is not on top
            $(window).scrollTop(0);
        };
    }


    return serviceContentViewModel;
});


