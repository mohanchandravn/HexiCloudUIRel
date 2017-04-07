/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['knockout', 'config/serviceConfig', 'js/util/errorhandler', 'jquery', 'ojs/ojcore', 'ojs/ojinputtext'
], function (ko, service, $, errorHandler) {
    /**
     * The view model for the main content view template
     */
    function raiseSRViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        console.log('Raising SR page');
        
        self.subject = ko.observable('');
        self.message = ko.observable('');
        self.detailsOfSR = ko.observable();
        self.statusOfSR = ko.observable(false);
        self.isValid = ko.observable(false);
        
        self.handleBindingsApplied = function() {
            $("#issueSubject").on('keyup paste cut', function() {
                var issueSubject = $(this).val();
                return self.isValid( (issueSubject.length > 0) && (self.message().length > 0) );
            });
            
            $("#issueDetail").on('keyup paste cut', function() {
                var issueDetail = $(this).val();
                return self.isValid( (issueDetail.length > 0) && (self.subject().length > 0) );
            });
        };
        
        var successCallBackFn = function(data, status) {            
            console.log(data);
            console.log(status);
            self.detailsOfSR(data);
            self.statusOfSR(true);
            hidePreloader();
        };
        
        var failCallBackFn = function(xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };
            
        self.submitSR = function() {
            showPreloader();
            
            isLoggedInUser(true);
            if (self.isValid()) {
                service.submitSR({
                    "userId" : loggedInUser(),
                    "message" : self.message(),
                    "subject" : self.subject(),
                    "sentTo" : "To me 1",
                    "sentCC" : "CC me 1",
                    "sentBCC" : "BCC me 1"
                }).then(successCallBackFn, failCallBackFn);
            }
        };
        
        self.gotoGuidedPaths = function() {
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": "itAdmin",
                "curStepCode": "guidedPathsMini",
                "preStepCode": getStateId(),
                "userAction" : "To Submit Email Request"
            });
        };
    }
    
    return raiseSRViewModel;
});