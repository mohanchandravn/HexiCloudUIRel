/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['config/serviceConfig', 'knockout', 'jquery', 'ojs/ojcore', 'ojs/ojradioset'
], function (service, ko, $) {
    /**
     * The view model for the main content view template
     */
    function chooseRoleViewModel(params) {
        var self = this;

        var router = params.ojRouter.parentRouter;
        self.noRoleChoosenErrorText = ko.observable();

        console.log('choose role page');
         self.handleAttached = function () {
            slideInAnimate(500, 0);
        };

        self.currentRole = ko.observable(loggedInUserRole());
        self.selectedRole = function () {
            isLoggedInUser(true);
            console.log('The selected role is: ' + self.currentRole() + 'end');
            if (!self.currentRole() || self.currentRole() == null) {
                self.noRoleChoosenErrorText("Please select a Role to proceed");
            } else {
                loggedInUserRole(self.currentRole());
                self.noRoleChoosenErrorText("");
                service.updateCurrentStep({
                    "userId": loggedInUser(),
                    "userRole": self.currentRole(),
                    "curStepCode": "addAdditionalUsers",
                    "preStepCode": getStateId(),
                    "userAction": "Next, selected Role as : " + self.currentRole()
                });

            }

        };
    }

    return chooseRoleViewModel;
});