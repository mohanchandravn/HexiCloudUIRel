/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCaseDiscovery module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojknockout', 'ojs/ojtabs', 'ojs/ojconveyorbelt',
    'ojs/ojprogressbar', 'ojs/ojdialog'
], function (oj, $, ko, service, errorHandler) {
    
    /**
     * The view model for the main content view template
     */
    function useCaseDiscoveryViewModel(params) {
        
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        self.selectedTab = ko.observable();
        self.selectedUseCase = ko.computed( function() {
            if (selectedUseCase().tabId) {
                self.selectedTab(selectedUseCase().tabId);
                delete selectedUseCase().tabId;
            } else {
                self.selectedTab('core');
            }
            return selectedUseCase();
        });
        self.coreGuidedPaths = ko.observableArray([]);
        self.complementaryGuidedPaths = ko.observableArray([]);
        self.urlForTCOCalculator = ko.observable('');
        
        self.hasServiceBenefits = ko.observable(false);
        self.selectedService = ko.observable();
        self.selectedServiceTitle = ko.observable();
        self.selectedServiceSubTitle = ko.observable();
        self.benefitsTitle = ko.observable();
        self.pdfSrc = ko.observable();
        self.selectedServiceBenefitsArray = ko.observableArray([]);

        self.getCoreGuidedPaths = function(data, event) {
            showPreloader();
            
            var getCoreGuidedPathsDataSuccessFn = function (data, status) {
                self.coreGuidedPaths([]);
                if (data) {
                    self.coreGuidedPaths(data.guidedPaths);
                }
                hidePreloader();
            };
            
            var getCoreGuidedPathsDataFailCbFn = function (xhr) {
                hidePreloader();
                console.log(xhr);
                errorHandler.showAppError("ERROR_GENERIC", xhr);
            };
            
            service.getCoreGuidedPaths().then(getCoreGuidedPathsDataSuccessFn, getCoreGuidedPathsDataFailCbFn);
        };
        
        self.getComplementaryKnowledgeGuidedPaths = function(data, event) {
            showPreloader();
            
            var getComplementaryGuidedPathsSuccessFn = function (data, status) {
                self.complementaryGuidedPaths([]);
                if (data){
                    self.complementaryGuidedPaths(data.guidedPaths);
                }                
                hidePreloader();
            };
            
            var getComplementaryGuidedPathsFailCbFn = function (xhr) {
                hidePreloader();
                console.log(xhr);
                errorHandler.showAppError("ERROR_GENERIC", xhr);
            };
            
            service.getComplementaryGuidedPaths(self.selectedUseCase().id).then(getComplementaryGuidedPathsSuccessFn, getComplementaryGuidedPathsFailCbFn);
        };
        
        self.getTCOCalculatorData = function(data, event) {
            showPreloader();
            self.urlForTCOCalculator("https://oracle.valuestoryapp.com/iaas/");
            hidePreloader();
        };
        
        self.getSuccessStoriesData = function(data, event) {
            showPreloader();
            hidePreloader();
        };

        self.autoCaptureData = ko.computed(function() {
            if (self.selectedUseCase() !== null) {
                if (self.selectedTab() === "core") {
                    self.getCoreGuidedPaths();
                } else if (self.selectedTab() === "complementary") {
                    self.getComplementaryKnowledgeGuidedPaths();
                } else if (self.selectedTab() === "tco") {
                    self.getTCOCalculatorData();
                } else if (self.selectedTab() === "success") {
                    self.getSuccessStoriesData();
                }
                $( "#tabs" ).ojTabs( "option", "selected", self.selectedTab() );
            }
        });
        
        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        self.tabChangeHandler = function(event, data) {
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
            params.rootData.selectedUseCase = self.selectedUseCase();
            params.rootData.selectedPathId = data.pathId;
            router.go('guidedPathDetails');
        };
        
        /*
        self.onClickTabTCOCalculator = function() {
            window.open('https://oracle.valuestoryapp.com/iaas/', '_blank');
        };
        */
               
        openServiceDetailDialog = function (data, event) {
            showPreloader();
            
            var selectedService = data.service.label;
            
            var getServiceDetailsSuccessCbFn = function (data, status) {
                self.selectedService(selectedService);
                if (status !== 'nocontent') {                    
                    self.hasServiceBenefits(true);
                    self.selectedServiceTitle(data.Service.title);
                    self.selectedServiceSubTitle(data.Service.subTitle);
                    self.benefitsTitle(data.Service.Benefits.title);
                    self.pdfSrc(data.Service.FeaturesLink);
                    self.selectedServiceBenefitsArray(data.Service.Benefits.benefitsList);
                    
                } else {
                    self.selectedServiceTitle('Coming Soon');
                    self.selectedServiceSubTitle('');
                    self.benefitsTitle('');
                    self.pdfSrc('');
                    self.hasServiceBenefits(false);
                    self.selectedServiceBenefitsArray([]);
                }
                
                $("#serviceDetailDialog").ojDialog("open");
                $("#serviceDetailDialog").ojDialog("option", "title", self.selectedService() + ' Service');

                hidePreloader();
            };
            
            var getServiceDetailsFailCbFn = function (xhr) {
                hidePreloader();
                console.log(xhr);
                errorHandler.showAppError("ERROR_GENERIC", xhr);
            };
            
            var serviceType = data.service.serviceId.toLowerCase();
            service.getServiceDetails(serviceType).then(getServiceDetailsSuccessCbFn, getServiceDetailsFailCbFn);
        };
        
        self.handleBindingsApplied = function() {
            $( "#tabs" ).ojTabs( "option", "selected", self.selectedTab() );
        };
        
    }
    
    return useCaseDiscoveryViewModel;
});
