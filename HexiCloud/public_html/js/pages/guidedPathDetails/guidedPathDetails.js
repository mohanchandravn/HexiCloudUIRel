/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * guidedPathDetails module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojknockout', 'ojs/ojprogressbar'
], function (oj, $, ko, service, errorHandler) {
    
    /**
     * The view model for the main content view template
     */
    function guidedPathDetailsViewModel(params) {
        
        var self = this;
        var router = params.ojRouter.parentRouter;
        
//        self.selectedGuidedPath = params.rootData.selectedGuidedPath;
        self.selectedGuidedPath = ko.observable();
        self.areGuidedPathsLoaded = ko.observable(false);
        
        var getGuidedPathDetailsSuccessFn = function(data, success) {
            self.selectedGuidedPath(data.guidedPathDetail);
            self.areGuidedPathsLoaded(true);
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
        
        self.toggleGPSectionSubContent = function(data, event) {
            var id = event.currentTarget.id;
            $(".guided-path-sub-content-container").slideUp();
            $("#" + id + "-sub-content").slideDown();
        };
        
        self.openGPSectionSubContent = function(parent, data, event) {
            parent.$data.selectedSectionDocId = data.sectionDocId;
            params.rootData.selectedGuidedPathSection = parent.$data;
            router.go('guidedPathLearning');
        };
       
        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        self.handleAttached = function() {
            service.getGuidedPathDetails().then(getGuidedPathDetailsSuccessFn, FailCallBackFn);
        };
    }
    
    return guidedPathDetailsViewModel;
});
