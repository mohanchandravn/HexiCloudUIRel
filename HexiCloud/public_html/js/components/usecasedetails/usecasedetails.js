/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * usecasedetails module
 */
define(['jquery', 'knockout', 'text!./usecasedetails.html', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojcore'
], function ($, ko, template, service, errorHandler) {
    /**
     * The view model for the main content view template
     */
    function usecasedetailsContentViewModel(params) {
        
        var self = this;
        self.fetchedUseCaseBenefits = ko.observableArray([]);
        self.fetchUseCaseData = ko.computed(function () {
           if (params.areUseCaseDetailsFetched()) {
               self.getBenefitsData(params.useCaseId());
           } else {
               self.fetchedUseCaseBenefits([]);
           }
           return;
        });
        
        self.showOffCanvasPreloader = function () {
            $("#offCanvasPreloader").removeClass("oj-sm-hide");
        };
        
        self.hideOffCanvasPreloader = function (container) {
            $("#offCanvasPreloader").addClass("oj-sm-hide");
        };
        
        self.getBenefitsData = function (useCaseId) {
            var getSelectedUseCaseBenefitsSuccessCbFn = function (data, status) {
                self.fetchedUseCaseBenefits(data.benefits);
                self.hideOffCanvasPreloader();
            };
            
            var getSelectedUseCaseBenefitsFailCbFn = function (xhr) {
                self.hideOffCanvasPreloader();
                console.log(xhr);
                errorHandler.showAppError("ERROR_GENERIC", xhr);
            };
            self.showOffCanvasPreloader();
            service.getSelectedUseCaseBenefits().then(getSelectedUseCaseBenefitsSuccessCbFn, getSelectedUseCaseBenefitsFailCbFn);
        };
    }

    return {viewModel: usecasedetailsContentViewModel, template: template};
});
