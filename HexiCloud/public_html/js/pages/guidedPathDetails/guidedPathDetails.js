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
        
        self.params = params;

        self.selectedPathId = ko.observable(params.rootData.selectedPathId);
        self.selectedGuidedPath = ko.observableArray([]);
        self.areGuidedPathsLoaded = ko.observable(false);
        
        self.prevSectionIdSelected = ko.observable('');
        
        self.breadcrumbs = ko.observableArray([{id: 'useCaseDiscovery', label: params.rootData.selectedUseCase.title}]);
                                           
        var getGuidedPathDetailsSuccessFn = function(data, success) {
            self.selectedGuidedPath(data.guidedPathDetail);
            
            var breadcrumbs = self.breadcrumbs();
            breadcrumbs.push({id: 'guidedPathDetails', label: data.guidedPathDetail.label});
            self.breadcrumbs(breadcrumbs);
            
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
            if (self.prevSectionIdSelected() !== '') {
                $('#' + self.prevSectionIdSelected()).toggleClass('section-selected');
            }
            $('#' + id).toggleClass('section-selected');
            $(".guided-path-sub-content-container").slideUp();
            $("#" + id + "-sub-content").slideDown();
            self.prevSectionIdSelected(id);
        };
        
        self.openGPSectionSubContent = function(parent, data, event) {
            parent.$data.selectedSectionDocId = data.sectionDocId;
            params.rootData.selectedGuidedPathSection = parent.$data;
            params.rootData.selectedPathId = self.selectedPathId();
            params.rootData.selectedPathLabel = self.selectedGuidedPath().label;
            
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
            service.getGuidedPathDetails(self.selectedPathId()).then(getGuidedPathDetailsSuccessFn, FailCallBackFn);
        };
    }
    
    return guidedPathDetailsViewModel;
});
