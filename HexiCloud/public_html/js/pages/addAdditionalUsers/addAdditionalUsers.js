/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['config/serviceConfig'], function (service) {
    /**
     * The view model for the main content view template
     */
    function additionalUserViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;

        console.log('Add additional users page');
        self.addUsers = function () {
            isLoggedInUser(true);
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": "itAdmin",
                "curStepCode": 'createUsers',
                "preStepCode": getStateId(),
                "userAction" : "Add Users"
            });
        };
        self.addLater = function () {
            isLoggedInUser(true);
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": "itAdmin",
                "curStepCode": 'servicesMini',
                "preStepCode": getStateId(),
                "userAction" : "Add Later"
            });
        };
    }

    return additionalUserViewModel;
});