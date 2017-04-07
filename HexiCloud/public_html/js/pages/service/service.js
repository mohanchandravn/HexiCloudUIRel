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
        self.sservicesArray = ko.observableArray([]);
        self.sguidedPathsArray = ko.observableArray([]);
        
        self.getServiceDetails = function() {
            $.getJSON("pages/service/fullServicesDisplay.json", function(result) {
                self.sservicesArray([]);
                self.sservicesArray(result.services);
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
