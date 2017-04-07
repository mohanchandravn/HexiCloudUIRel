/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Guided path module
 */
define(['knockout', 'config/serviceConfig', 'jquery', 'ojs/ojcore', 'ojs/ojprogressbar'
], function (ko, service, $) {
    /**
     * The view model for the main content view template
     */
    function serviceContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        console.log('guided path page');
        
        self.srunningCPUCount = ko.observable(1);
        self.stotalCPUCount = ko.observable(5);
        self.scurrentUsedMemory = ko.observable(30);
        self.sservicesArray = ko.observableArray([]);
        self.sguidedPathsArray = ko.observableArray([]);
        
        self.getServiceDetails = function() {
            $.getJSON("pages/guidedPathsMini/guidedPathsMini.json", function(result) {
                self.sguidedPathsArray([]);
                self.sguidedPathsArray(result.guidedPaths);
            });
        };
        
        self.handleAttached = function() {
            self.getServiceDetails();
        };
        
        self.logout = function(data, event) {
            router.go('home/');
        };
        
        self.goToDashboard = function(data, event) {
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": "itAdmin",
                "curStepCode": 'dashboard',
                "preStepCode": getStateId(),
                "userAction" : "Go to Dashboard"
            });
        };
    }
    
    return serviceContentViewModel;
});



