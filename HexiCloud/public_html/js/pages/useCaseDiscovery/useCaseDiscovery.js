/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCaseDiscovery module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojknockout', 'ojs/ojtabs', 'ojs/ojconveyorbelt',
    'ojs/ojprogressbar'
], function (oj, $, ko, service, errorHandler) {
    
    /**
     * The view model for the main content view template
     */
    function useCaseDiscoveryViewModel(params) {
        
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        self.selectedUseCase = params.rootData.selectedUseCase;
        self.selectedTab = ko.observable(0);
        self.areCoreGuidedPathsLoaded = ko.observable(false);
        self.coreGuidedPaths = ko.observableArray([]);
        self.urlForTCACalculator = ko.observable('');
        
        self.getCoreGuidedPathsData = function(data, event) {
            showPreloader();
            var getCoreGuidedPathsDataSuccessFn = function (data, status) {
                var guidedPaths = data.guidedPaths;
                self.coreGuidedPaths(guidedPaths);
                self.areCoreGuidedPathsLoaded(true);
            };
            
            service.getCoreGuidedPaths().then(getCoreGuidedPathsDataSuccessFn, FailCallBackFn);
            hidePreloader();
        };
        
        self.getComplementaryKnowledgeData = function(data, event) {
            showPreloader();
            self.areCoreGuidedPathsLoaded(false);
            console.log(data);
            console.log(event);
            hidePreloader();
        };
        
        self.getTCACalculatorData = function(data, event) {
            showPreloader();
            self.areCoreGuidedPathsLoaded(false);
            console.log(data);
            console.log(event);
            self.urlForTCACalculator("https://oracle.valuestoryapp.com/iaas/");
            hidePreloader();
        };
        
        self.getSuccessStoriesData = function(data, event) {
            showPreloader();
            self.areCoreGuidedPathsLoaded(false);
            console.log(data);
            console.log(event);
            hidePreloader();
        };

        self.autoCaptureData = ko.computed(function() {
            if (self.selectedTab() === 0) {
                self.getCoreGuidedPathsData();
            } else if (self.selectedTab() === 1) {
                self.getComplementaryKnowledgeData();
            } else if (self.selectedTab() === 2) {
                self.getTCACalculatorData();
            } else if (self.selectedTab() === 3) {
                self.getSuccessStoriesData();
            }
        });
        
        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        self.tabChangeHandler = function(event, data) {
            console.log(event);
            console.log(data);
            self.selectedTab(data.value);
        };
        
        self.getProgressStatus = function(progressValue) {
            if (Number(progressValue) < 1 ) {
                return 'red';
            } else if (Number(progressValue) < 35 ) {
                return 'orange';
            } else {
                return 'green';
            }
        };
        
        self.onClickOnCoreTechContent = function(data, event) {
            params.rootData.selectedGuidedPathId = data.pathId;
            router.go('guidedPathDetails');
        };
        
        /*
        self.onClickTabTCACalculator = function() {
            window.open('https://oracle.valuestoryapp.com/iaas/', '_blank');
        };
        */
    }
    
    return useCaseDiscoveryViewModel;
});
