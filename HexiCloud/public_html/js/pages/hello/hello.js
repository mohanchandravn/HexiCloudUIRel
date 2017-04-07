/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['config/serviceConfig', 'knockout', 'ojs/ojcore', 'jquery', 'ojs/ojinputtext'
], function (service, ko) {
    /**
     * The view model for the main content view template
     */
    function helloViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        self.workFlowButtonText = ko.observable("START");
        self.helpText1 = ko.observable("Please continue the following guide");
        self.helpText2 = ko.observable("to setup your account");
        
        if (loggedInUserRole()) {
            self.buttonRouterConfig = ko.observable("roleIdentified");
        } else {
            self.buttonRouterConfig = ko.observable("chooseRole");
        }

        var getUserStepSuccessCallBackFn = function (data) {
            console.log(data);
            if (data) {
                loggedInUser(data.userId);
                loggedInUserRole(data.userRole);
                self.helpText1("You seem to have started the on-boarding.");
                self.helpText2("Please Continue");
                self.workFlowButtonText("CONTINUE");
                self.buttonRouterConfig(data.curStepCode);
            }
        };

        service.getUserStep(loggedInUser()).then(getUserStepSuccessCallBackFn);

        self.skipProcess = function () {
            isLoggedInUser(true);
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": loggedInUserRole(),
                "curStepCode": "dashboard",
                "preStepCode": getStateId(),
                "userAction" : "Skip Process"
            });
        };

        self.startProcess = function () {
            console.log('Navigating to the page : ' + self.buttonRouterConfig());
            isLoggedInUser(true);
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": loggedInUserRole(),
                "curStepCode": self.buttonRouterConfig(),
                "preStepCode": getStateId(),
                "userAction" : self.workFlowButtonText()
            });
        };
    }

    return helloViewModel;
});
