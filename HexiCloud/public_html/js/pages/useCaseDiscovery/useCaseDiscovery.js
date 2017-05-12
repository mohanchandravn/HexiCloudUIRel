/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCaseDiscovery module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojknockout', 'ojs/ojtabs', 'ojs/ojconveyorbelt'
], function (oj, $, ko, service, errorHandler) {
    
    /**
     * The view model for the main content view template
     */
    function useCaseDiscoveryViewModel(params) {
        
        var self = this;
        
        self.selectedUseCase = params.rootData.selectedUseCase;

        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        /*
        self.onClickTabTCACalculator = function() {
            window.open('https://oracle.valuestoryapp.com/iaas/', '_blank');
        };
        */
    }
    
    return useCaseDiscoveryViewModel;
});
