/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * navigationbarleft module
 */
define(['text!./navigationbarleft.html', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojcore', 'ojs/ojprogressbar'
], function (template, $) {
    /**
     * The view model for the main content view template
     */
    function navigationbarleftContentViewModel() {
        
        var self = this;
                      
        self.getProgressStatus = function(progressValue) {
            if (Number(progressValue) < 1 ) {
                return 'red';
            } else if (Number(progressValue) < 35 ) {
                return 'orange';
            } else {
                return 'green';
            }
        };
        
        self.toggleNavUseCaseContent = function (useCaseId, data, event) {
            if ($("#" + useCaseId + "ProgressBar").hasClass("oj-sm-hide")) {
                $(".nav-use-case-container").removeClass("selected");
                $(".nav-use-case-heading").removeClass("bold");
                $(".nav-progress-bar").removeClass("oj-sm-hide");
                $(".nav-use-case-sub-content").addClass("oj-sm-hide");
            } else {
                $(".nav-use-case-container").removeClass("selected");
                $("#" + useCaseId + "Container").addClass("selected");
                $(".nav-use-case-heading").removeClass("bold");
                $("#" + useCaseId + "Heading").addClass("bold");
                $(".nav-progress-bar").removeClass("oj-sm-hide");
                $("#" + useCaseId + "ProgressBar").addClass("oj-sm-hide");
                $(".nav-use-case-sub-content").addClass("oj-sm-hide");
                $("." + useCaseId + "Content").removeClass("oj-sm-hide");
            }
        };
    };
    
    return {viewModel: navigationbarleftContentViewModel, template: template};
});
