define(['ojs/ojcore',
    'jquery',
    'knockout',
    'config/serviceConfig',
    'ojs/ojselectcombobox',
    'components/trainnavigation/loader'], function (oj, $, ko, service) {

    function ChooseRoleViewModel(params)
    {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        // tracker for invalid components
        self.tracker = ko.observable();
        
        self.headerTitle = "There are 3 easy steps to complete the onboarding process and get started with your services:";
        self.welcomeUserMessage = ko.observable("Welcome, ");
        self.selectedRole = ko.observable();
        self.allRolesList = ko.observableArray([
            {value: 'IT Production Manager', label: 'IT Production Manager'},
            {value: 'DBA', label: 'DBA'},
            {value: 'IT Operations', label: 'IT Operations'},
            {value: 'Developer', label: 'Developer'},
            {value: 'Other', label: 'Other'}
        ]);
        
        if (loggedInUser()) {
            self.welcomeUserMessage(self.welcomeUserMessage() + userFirstLastName());
        }
        
        function init() {
            hidePreloader();
        }
        
        self._showComponentValidationErrors = function (trackerObj) {
            trackerObj.showMessages();
            if (trackerObj.focusOnFirstInvalid()) {
                return false;
            }
            return true;
        };
        
        self.roleSelected = function () {
            // Validations
            var trackerObj = ko.utils.unwrapObservable(self.tracker);
            if (!this._showComponentValidationErrors(trackerObj)) {
                return;
            }
            
            loggedInUserRole(self.selectedRole()[0]);
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": loggedInUserRole(),
                "curStepCode": "addAdditionalUsers",
                "preStepCode": getStateId(),
                "userAction": "Selected Role as : " + loggedInUserRole(),
                  "updateRole" : true
            });
//            setTimeout(function () {
            //$.fn.fullpage.moveSlideLeft();
//            }, 500);
//            slideOutAnimate(1500, 0);
            $('.blur-node1, .blur-node2').addClass('animate');
        };

        self.currentStepValue = ko.observable('stp1');
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
        
        init();
    }

    return ChooseRoleViewModel;

});

