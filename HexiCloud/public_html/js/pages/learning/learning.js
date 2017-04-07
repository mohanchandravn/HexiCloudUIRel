/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * service module
 */
define(['knockout', 'jquery', 'ojs/ojcore', 'ojs/ojprogressbar'
], function (ko, $) {
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
        self.servicesArray = ko.observableArray([]);
        self.sguidedPathsArray = ko.observableArray([]);
        
        self.getServiceDetails = function() {
            $.getJSON("pages/service/services.json", function(result) {
                self.servicesArray([]);
                self.servicesArray(result.services);
            });
            $.getJSON("pages/service/fullGuidedPathsDisplay.json", function(result) {
                self.sguidedPathsArray([]);
                self.sguidedPathsArray(result.guidedPaths);
            });
        };
        
        self.handleAttached = function() {
            self.getServiceDetails();
        };
        
        self.routeTo = function(data, event) {
            var id = event.currentTarget.id.toLowerCase();
            router.go(id);
        };
        
        self.logout = function(data, event) {
            router.go('home/');
        };
    }
    
    return serviceContentViewModel;    
});
