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
        
        self.selectedUseCase = params.rootData.selectedUseCase;
        self.selectedTab = ko.observable(0);
        self.areCoreGuidedPathsLoaded = ko.observable(false);
        self.coreGuidedPaths = ko.observableArray([]);
        self.areComplementaryGuidedPathsLoaded = ko.observable(false);
        self.complementaryGuidedPaths = ko.observableArray([]);
        self.urlForTCACalculator = ko.observable('');
        
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
                self.coreGuidedPaths(data.guidedPaths);
                self.areCoreGuidedPathsLoaded(true);
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
                if (data){
                    self.complementaryGuidedPaths(data.guidedPaths);
                    self.areComplementaryGuidedPathsLoaded(true);
                }                
                hidePreloader();
            };
            
            var getComplementaryGuidedPathsFailCbFn = function (xhr) {
                hidePreloader();
                console.log(xhr);
                errorHandler.showAppError("ERROR_GENERIC", xhr);
            };
            
            service.getComplementaryGuidedPaths(self.selectedUseCase.id).then(getComplementaryGuidedPathsSuccessFn, getComplementaryGuidedPathsFailCbFn);
        };
        
        self.getTCACalculatorData = function(data, event) {
            showPreloader();
            self.areCoreGuidedPathsLoaded(false);
            self.urlForTCACalculator("https://oracle.valuestoryapp.com/iaas/");
            hidePreloader();
        };
        
        self.getSuccessStoriesData = function(data, event) {
            showPreloader();
            self.areCoreGuidedPathsLoaded(false);
            hidePreloader();
        };

        self.autoCaptureData = ko.computed(function() {
            if (self.selectedTab() === 0) {
                self.getCoreGuidedPaths();
            } else if (self.selectedTab() === 1) {
                self.getComplementaryKnowledgeGuidedPaths();
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
            params.rootData.selectedUseCase = self.selectedUseCase;
            params.rootData.selectedGuidedPathId = data.pathId;
            router.go('guidedPathDetails');
        };
        
        /*
        self.onClickTabTCACalculator = function() {
            window.open('https://oracle.valuestoryapp.com/iaas/', '_blank');
        };
        */
       
        closeServiceDetailModal = function () {
            $("#detailWindow").ojDialog("close");
        };
        
        openServiceDetailModal = function (data, event) {
            
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
                
                $("#serviceDetailModal").ojDialog("open");

                hidePreloader();
            };
            
            var getServiceDetailsFailCbFn = function (xhr) {
                hidePreloader();
                console.log(xhr);
                errorHandler.showAppError("ERROR_GENERIC", xhr);
            };
            
            var serviceType = data.service.serviceId.toLowerCase();
            service.getServiceDetails(serviceType).then(getServiceDetailsSuccessCbFn, getServiceDetailsFailCbFn);
            
            self.handleOKClose = $("#okButton").click(function() {
                $("#serviceDetailModal").ojDialog("close"); 
            });
        };
        
    }
    
    return useCaseDiscoveryViewModel;
});
