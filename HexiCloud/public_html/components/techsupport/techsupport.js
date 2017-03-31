
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'js/util/errorhandler', 'config/sessionInfo', 'ojs/ojinputtext', 'ojs/ojknockout-validation'], 

function (oj, $, ko, service, errorHandler, sessionInfo) {

    function techSupportViewModel(context) {
        
        var self = this;
        
        self.selectedTemplate = ko.observable('phone_content');
        self.isCallBackInitiated = ko.observable(false);
        self.phoneNumber = ko.observable();
        self.addedPhoneNumber = ko.observable();
        self.confirmedPhoneNumber = ko.observable();
        self.changingNumber = ko.observable(false);
        self.phoneMessage = ko.observable('');
        self.emailSubject = ko.observable();
        self.emailMessage = ko.observable();
        self.detailsOfSR = ko.observable();
        self.statusOfSR = ko.observable(false);
        self.tracker = ko.observable();       

        self._showComponentValidationErrors = function (trackerObj) {
            trackerObj.showMessages();
            if (trackerObj.focusOnFirstInvalid())
                return false;
            return true;
        };

        context.props.then(function (properties) {
            if (properties.references) {
                self.selectedTemplate = properties.references.selectedValueRef;
            }
        });
        
        self.viewCallContent = function () {
            self.selectedTemplate('phone_content');
        };

        self.viewChatContent = function () {
            self.selectedTemplate('chat_content');
        };

        self.viewMailContent = function () {
            self.selectedTemplate('email_content');
        };
        
        self.phoneNumberAdded = function() {
            if (sessionInfo.getFromSession('phoneNumber') !== 'null') {
                self.phoneNumber(sessionInfo.getFromSession('phoneNumber'));
                self.changingNumber(false);
                return true;
            } else {
                self.changingNumber(true);
                return false;
            }
        };
        
        self.changeNumber = function(data, event) {
            var id = event.currentTarget.id;
            if (id === "correctNumber") {
                self.confirmedPhoneNumber(true);
            } else {
                self.confirmedPhoneNumber(false);
            }
            self.changingNumber(true);
        };
        
        self.requestCallBack = function() {
            var requestCallbackSuccessCbFn = function(data, status) {
                hidePreloader();
                self.isCallBackInitiated(true);
                console.log(data);
                console.log(status);
                
            };
            
            var requestCallbackFailCbFn = function(xhr) {
                hidePreloader();
                self.isCallBackInitiated(false);
                console.log(xhr);
            };
            
            showPreloader();
            
            var trackerObj = ko.utils.unwrapObservable(self.tracker);
            if (!this._showComponentValidationErrors(trackerObj)) {
                hidePreloader();
                return;
            }
            
            if (!self.confirmedPhoneNumber() || !self.phoneNumberAdded()) {
                sessionInfo.setToSession(sessionInfo.phoneNumber, self.addedPhoneNumber());
            }            
//            if () {
//                sessionInfo.setToSession(sessionInfo.phoneNumber, self.addedPhoneNumber());
//            }
            
            var phone = sessionInfo.getFromSession('phoneNumber');
            var payload = {
                "userId" : sessionInfo.getFromSession('loggedInUser'),
                "phone" : phone === 'undefined' ? null : phone,
                "message" : self.phoneMessage()
            };
            service.requestCallBack(JSON.stringify(payload)).then(requestCallbackSuccessCbFn, requestCallbackFailCbFn);
        };

        self.resetAndClosePhone = function () {
//            self.phoneNumber("");
            self.addedPhoneNumber("");
            self.phoneMessage("");
            self.changingNumber(false);
            self.isCallBackInitiated(false);
            console.log(self.phoneNumber());
            console.log(self.phoneMessage());
            console.log(self.changingNumber());
            console.log(self.isCallBackInitiated());
        };
        
        self.closeTechSupportLayout = function () {
            self.emailSubject("");
            self.emailMessage("");
            self.detailsOfSR("");
            self.statusOfSR(false);
            self.changingNumber(false);
            self.resetAndClosePhone();
            $('#tech_support').hide();
        };

        self.handleAttached = function () {
            // slideInAnimate(500, 0);
            $('#tech_support').hide();
            $('#chat').addClass('tab-selected');
        };

        var successCallBackFn = function (data, status) {
            console.log(data);
            console.log(status);
            self.detailsOfSR(data);
            self.statusOfSR(true);
            hidePreloader();
        };

        var failCallBackFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };
        
        self.sendEmail = function () {
            showPreloader();
            var trackerObj = ko.utils.unwrapObservable(self.tracker);
            if (!this._showComponentValidationErrors(trackerObj)) {
                hidePreloader();
                return;
            }
            service.submitSR({
                "userId": loggedInUser(),
                "message": self.emailMessage(),
                "subject": self.emailSubject(),
                "sentTo": "To me 1",
                "sentCC": "CC me 1",
                "sentBCC": "BCC me 1"
            }).then(successCallBackFn, failCallBackFn);
        };

        self.resetAndCloseEmail = function () {
            self.emailSubject("");
            self.emailMessage("");
            self.detailsOfSR("");
            self.statusOfSR(false);
            $('#tech_support').hide();
        };
    }

    return techSupportViewModel;
});
