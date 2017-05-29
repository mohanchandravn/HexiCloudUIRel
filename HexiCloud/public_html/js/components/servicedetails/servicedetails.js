/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * servicedetails module
 */
define(['text!./servicedetails.html', 'ojs/ojcore'
], function (template) {
    
    /**
     * The view model for the main content view template
     */
    function serviceDetailsContentViewModel(params) {
        
        var self = this;
        
        self.hasServiceBenefits = params.hasServiceBenefits;
        self.selectedService = params.selectedService;
        self.selectedServiceTitle = params.selectedServiceTitle;
        self.selectedServiceSubTitle = params.selectedServiceSubTitle;
        self.benefitsTitle = params.benefitsTitle;
        self.pdfSrc = params.pdfSrc;
        self.selectedServiceBenefitsArray = params.selectedServiceBenefitsArray;
    }

    return {viewModel: serviceDetailsContentViewModel, template: template};
});
