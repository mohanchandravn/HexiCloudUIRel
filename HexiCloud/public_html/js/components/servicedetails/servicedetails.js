/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * servicedetails module
 */
define(['jquery', 'text!./servicedetails.html'
], function ($, template) {
    
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
               
        self.handleOKClose = $("#okButton").click(function() {
            $("#serviceDetailDialog").ojDialog("close");
        });

    }

    return {viewModel: serviceDetailsContentViewModel, template: template};
});
