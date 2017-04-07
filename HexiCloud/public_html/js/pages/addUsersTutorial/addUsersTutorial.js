define(['ojs/ojcore',
    'jquery',
    'knockout',
    'config/serviceConfig',
    'ojs/ojaccordion',
    'components/trainnavigation/loader'], function (oj, $, ko, service) {

    function addUsersTutorialViewModel(params) {
        var self = this;
        self.getSelectedServiceHeader = ko.observable("How to add Identity Domain Administrator through MyAccount");
        self.getSelectedServiceVideoLink = ko.observable("https://www.youtube.com/embed/VgeH6cKHXKo?rel=0");

//        self.getStartedVideoDesc = ko.observable('How to Add an Identity Domain administrator with My Account');
//        self.advancedVideoDesc = ko.observable('How to Add other users with My Services');
//        self.videoSrc = ko.observable("https://www.youtube.com/embed/33d3w4QZsPI");

//        self.getShortVideo = function () {
////            self.videoSrc = ko.observable("assets/newVids/addidamyaccount.mp4");
//            self.videoSrc = ko.observable("https://www.youtube.com/embed/33d3w4QZsPI");
////            $("#createUsersVid")[0].load();
//        };
//        self.getLongVideo = function () {
////            self.videoSrc("assets/newVids/addusers.mp4");
//            self.videoSrc("https://www.youtube.com/embed/FTzdGfbL4Is");
////            $("#createUsersVid")[0].load();
//        };
        
        self.setSelectedTypeById = function(data, event) {
            if (event.currentTarget.id === "myAccount") {
                self.getSelectedServiceHeader("How to add Identity Domain Administrator through MyAccount");
                self.getSelectedServiceVideoLink("https://www.youtube.com/embed/VgeH6cKHXKo?rel=0");
            } else if (event.currentTarget.id === "myServices") {
                self.getSelectedServiceHeader("How to add Users through MyServices");
                self.getSelectedServiceVideoLink("https://www.youtube.com/embed/8m7HF9xB0qc?rel=0");
            }
        };
        
        self.goToServices = function () {
//            setTimeout(function () {
            service.updateCurrentStep({
                "userId": loggedInUser(),
                "userRole": loggedInUserRole(),
                "curStepCode": 'servicesMini',
                "preStepCode": getStateId(),
//                    "preStepCode": 'createUsers',
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

        self.handleTransitionCompleted = function () {
            // scroll the whole window to top if it's scroll position is not on top
            $(window).scrollTop(0);
        };
    }
    return addUsersTutorialViewModel;
});


