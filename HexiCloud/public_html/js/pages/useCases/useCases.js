/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCases module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojoffcanvas',
    'components/techsupport/loader'
], function (oj, $, ko, service, errorHandler) {
    /**
     * The view model for the main content view template
     */
    function useCasesContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        var useCaseDrawerRight;

        useCaseDrawerRight = {
            "selector": "#useCaseDrawerRight",
            "edge": "end",
            "displayMode": "overlay",
            "autoDismiss": "none",
            "modality": "modal"
        };
        
        console.log('useCases page');

        self.areAllTailoredUseCasesLoaded = ko.observable(false);
        self.areAllAvailableUseCasesLoaded = ko.observable(false);
        self.areUseCaseDetailsFetched = ko.observable(false);
        self.selectedUseCaseDetails = ko.observableArray([]);
        self.tailoredUseCases = ko.observableArray([]);
        self.allAvailableUseCases = [];
        
        self.selectedUseCase = ko.computed(function() {
            return self.selectedUseCaseDetails();
        }, self);
        
        var getAllAvailableUseCasesSuccessCbFn = function (data, status) {
            if (data.useCases) {
                var useCases = data.useCases;
                debugger;
                for (var idx = 0; idx < useCases.length; idx++) {
                    for (var index = 0; index < self.tailoredUseCases().length; index++) {
                        if (self.tailoredUseCases()[index].id !== useCases[idx].id) {
                            if (useCases[idx].title.length > 35) {
                                var trimTitle = useCases[idx].title.slice(0, 35);
                                useCases[idx].trimmedTitle = trimTitle + "...";
                            }
                        } else {
                            useCases.splice(idx, 1);
                        }
                    }
                }
                debugger;
                self.allAvailableUseCases = useCases;
            }
            self.areAllUseCasesLoaded(true);
            hidePreloader();
        };

        var getAllAvailableUseCasesFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };
        
        var getTailoredUseCasesSuccessCbFn = function (data, status) {
            var useCases = data.useCases;
            if (useCases) {
                for (var idx = 0; idx < useCases.length; idx++) {
                    if (useCases[idx].title.length > 35) {
                        var trimTitle = useCases[idx].title.slice(0, 35);
                        useCases[idx].trimmedTitle = trimTitle + "...";
                    }
                }
                self.tailoredUseCases(useCases);
                $("#tailoredUseCases").ojMasonryLayout("refresh");
                service.getAllUseCases().then(getAllAvailableUseCasesSuccessCbFn, getAllAvailableUseCasesFailCbFn);
            }
        };

        var getTailoredUseCasesFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };
        
        self.getUseCaseDetails = function (data, event) {
            if (data.id) {
                self.selectedUseCaseDetails(data);
                self.areUseCaseDetailsFetched(true);
                oj.OffcanvasUtils.open(useCaseDrawerRight);
                $(window).scrollTop(0);
            }
        };

        closeUseCaseDetailOffCanvas = function () {
            self.areUseCaseDetailsFetched(false);
            oj.OffcanvasUtils.close(useCaseDrawerRight);
        };

        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        self.onClickOnUseCase = function(data, event) {
            if (data.id) {
                self.selectedUseCaseDetails(data);
            }
            params.rootData.selectedUseCase = self.selectedUseCase();
            router.go('useCaseDiscovery');
        };
        
        self.handleTransitionCompleted = function () {
            // scroll the whole window to top if it's scroll position is not on top
            $(window).scrollTop(0);
        };
        
        self.handleAttached = function () {
            showPreloader();

            oj.OffcanvasUtils.setupResponsive(useCaseDrawerRight);
            service.getTailoredUseCases().then(getTailoredUseCasesSuccessCbFn, getTailoredUseCasesFailCbFn);
        };
  }
    
    return useCasesContentViewModel;
});
