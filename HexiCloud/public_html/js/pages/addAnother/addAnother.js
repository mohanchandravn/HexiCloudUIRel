define(['ojs/ojcore',
    'jquery',
    'knockout', 
    'config/serviceConfig',
    'components/trainnavigation/loader'], function (oj, $, ko, service) {

    function createUsersViewModel(params) {
        var self = this;
        self.greetingText = ko.observable("Thanks, " + userFirstLastName());
        self.headerTitle = ko.observable("To add more users, select ‘Add users now’ for a step-by-step guide.");
        self.addButtonLabel = ko.observable("Add users now »");
        self.skipHelpText = ko.observable("To skip this step, select ‘Skip’ and begin checking your provisioned cloud services now.");
        self.skipButtonLabel = "Skip this step »";
        var router = params.ojRouter.parentRouter;

        self.onClickAddUser = function () {
//            setTimeout(function () {
//                    router.go('createUsers/');
                service.updateCurrentStep({
                    "userId": loggedInUser(),
                    "userRole": loggedInUserRole(),
                    "curStepCode": 'createUsers',
                    "preStepCode": getStateId(),
                    "userAction": "Watch the screencast"
                });

//            }, 500);
//            slideOutAnimate(1500, 0);
        };

        self.gotoDashboard = function () {
//            setTimeout(function () {
                service.updateCurrentStep({
                    "userId": loggedInUser(),
                    "userRole": loggedInUserRole(),
                    "curStepCode": 'servicesMini',
                    "preStepCode": getStateId(),
                    "userAction": "Go to Provisioned Services"
                });
//            }, 500);
//            slideOutAnimate(1500, 0);
        };
        
        self.currentStepValue = ko.observable('stp2');
        self.stepsArray =
                ko.observableArray(
                        [{label: 'Choose Role', id: 'stp1'},
                            {label: 'Add Users', id: 'stp2'},
                            {label: 'Services', id: 'stp3'}]);
        self.actionDisabledCss = "disable-train-selection";

        self.handleAttached = function () {
//            slideInAnimate(500, 0);
        };
        
        self.handleTransitionCompleted = function () {
            // scroll the whole window to top if it's scroll position is not on top
            $(window).scrollTop(0);
        };
    }

    return createUsersViewModel;

});

