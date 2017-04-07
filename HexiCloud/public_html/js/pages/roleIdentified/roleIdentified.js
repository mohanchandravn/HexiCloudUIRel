/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['config/serviceConfig', 'knockout', 'ojs/ojcore', 'jquery', 'ojs/ojradioset'
], function (service, ko) {
    /**
     * The view model for the main content view template
     */
    function rolerIdentifiedViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        var accntAdminImage = "img/Role_Identified_Admin.png";
        var accntAdminText = "Account Admin";
        var accntAdminDesc = "Administrator, Buyer, Manager";
        var iTAdminImage = "img/IT_Administrator.png";
        var iTAdminText = "IT Amdiminstrator";
        var iTAdminDesc = "IT, DBA, DEV";

        self.adminImage = ko.observable();
        self.adminText = ko.observable();
        self.adminDesc = ko.observable();

        if (loggedInUserRole() == 'accountAdmin') {
            self.adminImage(accntAdminImage)
            self.adminText(accntAdminText);
            self.adminDesc(accntAdminDesc);
        } else {
            self.adminImage(iTAdminImage)
            self.adminText(iTAdminText);
            self.adminDesc(iTAdminDesc);

        }

        console.log('hello page');
        self.acceptRole = function () {
            isLoggedInUser(true);

            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": loggedInUserRole(),
                "curStepCode": "addAdditionalUsers",
                "preStepCode": getStateId(),
                "userAction" : "Yes"
            });
        };
        self.rejectRole = function () {
            isLoggedInUser(true);
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": loggedInUserRole(),
                "curStepCode": "chooseRole",
                "preStepCode": getStateId(),
                "userAction" : "No"
            });
        };
    }

    return rolerIdentifiedViewModel;
});