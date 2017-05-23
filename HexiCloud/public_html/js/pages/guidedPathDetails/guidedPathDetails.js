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
        
        self.selectedGuidedPathId = ko.observable(params.rootData.selectedGuidedPathId);
        self.selectedGuidedPath = ko.observableArray([]);
        self.areGuidedPathsLoaded = ko.observable(false);
        
        var getGuidedPathDetailsSuccessFn = function(data, success) {
            self.selectedGuidedPath(data.guidedPathDetail);
            self.areGuidedPathsLoaded(true);
            hidePreloader();
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
        
        self.getTimeToCompleteByDocType = function(docType, timeToComplete) {
            if (docType === "PDF") {
                return timeToComplete + " read";
            } else if (docType === "VIDEO") {
                return timeToComplete;
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
            params.rootData.selectedPathId = self.selectedGuidedPathId();
            if (params.rootData.selectedGuidedPathSection.sectionDocs.length === 1) {
                params.rootData.lastSubSectionToRead = true;
            } else {
                var sectionDocs = params.rootData.selectedGuidedPathSection.sectionDocs;
                for (var idx = 0; idx < sectionDocs.length; idx++) {
                    if (sectionDocs[idx].sectionDocId !== data.sectionDocId && sectionDocs[idx].status !== 'C') {
                       params.rootData.lastSubSectionToRead = false;
                       break;
                   } else {
                       params.rootData.lastSubSectionToRead = true;
                   }   
                }
               
            }
            router.go('guidedPathLearning');
        };
       
        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        self.handleAttached = function() {
            showPreloader();
            service.getGuidedPathDetails(self.selectedGuidedPathId()).then(getGuidedPathDetailsSuccessFn, FailCallBackFn);
        };
    }
    
    return guidedPathDetailsViewModel;
});
