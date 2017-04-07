/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCases module
 */
define(['jquery', 'knockout', 'config/serviceConfig', 'ojs/ojcore', 'ojs/ojknockout', 'config/sessionInfo', 'ojs/ojprogressbar', 'ojs/ojfilmstrip', 'components/techsupport/loader'
], function ($, ko, service) {
    /**
     * The view model for the main content view template
     */
    function useCasesContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        console.log('useCases page');
        
//        self.useCaseItems = [
//            { usecaseCode: 'Use Case 1', usecaseDesc: 'Migrate Non Oracle Workloads to the Public Cloud' },
//            { usecaseCode: 'Use Case 2', usecaseDesc: 'Extended Use Case for added value – Oracle Ravello Cloud Service' },
//            { usecaseCode: 'Use Case 3', usecaseDesc: 'Migrate Non Oracle Workloads to the Public Cloud' }
//        ];
        
        self.useCaseItems = ko.observableArray([]);
        self.areUseCasesLoaded = ko.observable(false);
        self.selectedFilmStripItem = ko.observable(0);
        self.selectedUseCaseItem = ko.observable();
        self.selectedUseCaseName = ko.observable();
        self.selectedUseCaseTitle = ko.observable();
        self.selectedUseCaseSubTitle = ko.observable();
//        self.benefitsTitle = ko.observable();
        self.selectedUseCaseBenefitsArray = ko.observableArray([]);
        self.pdfSrc = ko.observable();
        
        getItemInitialDisplay = function(index) {
            return index < 3 ? '' : 'none';
        };
        
        self.updateUseCaseItems = function(data, status) {
            console.log(data);
            self.useCaseItems([]);
            for (var idx = 0; idx < data.length; idx++) {
                self.useCaseItems.push({fileId: data[idx].fileId,
                                        id: data[idx].id,
                                        publicLinkId: data[idx].publicLinkId,
                                        usecaseCode: data[idx].usecaseCode,
                                        usecaseDesc: data[idx].usecaseDesc,
                                        usecaseName: data[idx].usecaseName
                });
            }
            self.areUseCasesLoaded(true);
            self.openUseCaseContainer();
        };
        
        self.openUseCaseContainer = function(data, event) {    
            showPreloader();
            var id, useCaseCode;
            if (event === undefined) {
                id = self.useCaseItems()[0].id;
                useCaseCode = self.useCaseItems()[0].usecaseCode;
            } else {
                id = event.currentTarget.id;
                useCaseCode = data.usecaseCode;
            }
            $(".head").removeClass("active");
            $("#useCaseHead" + id).addClass("active");
            
            var successCbFn = function(data, status) {
                console.log(data);
                self.selectedUseCaseName(data.UseCase.Name);
                self.selectedUseCaseTitle(data.UseCase.title);
                self.selectedUseCaseSubTitle(data.UseCase.subTitle);
//                self.benefitsTitle(data.useCase.benefits.title);
                self.selectedUseCaseBenefitsArray(data.UseCase.Benefits.benefitsList);
                self.pdfSrc(data.UseCase.FeaturesLink);
                self.selectedUseCaseItem(id);
                hidePreloader();
            };
            
            service.getUseCaseDetails(useCaseCode).then(successCbFn, FailCallBackFn);
        };

        self.handleTransitionCompleted = function () {
            // scroll the whole window to top if it's scroll position is not on top
            $(window).scrollTop(0);
        };
        
        self.handleBindingsApplied = function() {
            showPreloader();
            service.getUseCaseItems().then(self.updateUseCaseItems, FailCallBackFn);
        };
        
        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
  }
    
    return useCasesContentViewModel;
});
