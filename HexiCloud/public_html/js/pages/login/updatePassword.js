define(['jquery',
        'knockout',
        'config/serviceConfig',
        'util/errorhandler',
        'config/sessionInfo',
        'ojs/ojcore',
        'ojs/ojinputtext',
        'ojs/ojknockout'], function ($, ko, service, errorHandler){
    
    function updatePasswordViewModel(params){
        var self = this;
        self.oldPassword = ko.observable("");
        self.newPassword = ko.observable("");
        self.repeatPassword = ko.observable("");
        self.tracker = ko.observable();
        self.templateId = ko.observable('updatePwdForm');
        
        if(params) {
            self.parentVM = params.parent;
        }
        
        self.minLength = {
            validate: function (value) {
                if (value.length < 8) {
                    if (value.length !== 0) {
                       throw new Error('Password length should not be less than 8.');
                    }
                } else if (value === self.oldPassword()) {
                    throw new Error('Old password and new password cannot be same.');
                }
                return true;
            }
        };
        
        self.equalToPassword = {
            validate: function (value) {
                var compareTo = self.newPassword.peek();
                $("#mismatchedPassword").hide();
                if (value.length !== 0) {
                    if (!value && !compareTo) {
                        return true;
                    } else if (value !== compareTo) {
                        throw new Error('The passwords must match.');
                    }
                }
                return true;
            }
        };
        
        self._showComponentValidationErrors = function (trackerObj) {
            trackerObj.showMessages();
            if (trackerObj.focusOnFirstInvalid())
                return false;

            return true;
        };
        
//        self.userNameOptionChange = function (event, data)
//        {
//            $('#invaliduserid').hide();
//        };
        
        self.handleBindingsApplied = function() {
            $("#oldPassword").focus();
//            $("#repeatPassword").on('keyup paste cut', function (e) {
//                var repeatPwd = $("#repeatPassword").val();
//                console.log(self.newPassword());
//                console.log(repeatPwd);
//                if ( repeatPwd !== '' ) {
//                    if (self.newPassword() !== repeatPwd) {
//                        $('#mismatchedPassword').show();
//                    } else {
//                        $('#mismatchedPassword').hide();
//                    }
//                } else {
//                    $('#mismatchedPassword').hide();
//                }
//            });
        };
        
        self.onClickUpdatePwdSubmit = function () {
            showPreloader();
            
            $('#invalidPassword').hide();
            var trackerObj = ko.utils.unwrapObservable(self.tracker);

            // Step 1
            if (!this._showComponentValidationErrors(trackerObj)) {
                hidePreloader();
                return;
            }
                        
            var successCbFn = function (data, status) {
                if (status === 'success') {
                    console.log('successfully updated password..');
                    goToPage('chooseRole');
                } else {
                    $('#invalidPassword').show();
                }
                hidePreloader();
            };
            
            var failCbFn = function(xhr) {
                console.log(xhr);
                if (xhr.status === 400) {
                    $('#invalidPassword').show();
                    self.newPassword('');
                    self.repeatPassword('');
                } else {
                    self.newPassword('');
                    self.repeatPassword('');
                    errorHandler.showAppError("ERROR_GENERIC", xhr);
                }
                hidePreloader();
            };
            if ($("#newPassword").val() !== $("#repeatPassword").val()) {
                $("#mismatchedPassword").show();
                hidePreloader();
                return;
            } else {
                $("#mismatchedPassword").hide();
            }
            var payload = {
                "oldPassword": self.oldPassword(),
                "newPassword": $("#newPassword").val(),
                "repeatPassword": $("#repeatPassword").val()
            };
            console.log(payload);
            service.updatePasswordService(JSON.stringify(payload)).then(successCbFn, failCbFn);           
        };
        
        var handleForgotPwdServiceSuccess = function (data, status)
        {
//            var trackerObj = ko.utils.unwrapObservable(self.tracker);
            if(status === 'success') {
                self.templateId('forgotPwduccess');
            }
            else if(status === 'nocontent') {
               $('#invalidPassword').show();                 
            }
            hidePreloader();
        };
        
        var handleForgotPwdServiceFailure = function (xhr) {            
//            self.templateId('forgotPwdFailure');
            console.log(xhr);
            hidePreloader();
        };
        
        
        self.onClickBackToLogin = function (){
            if( self.parentVM) {
                self.parentVM.goToLogin();
            }
        };
    }
    
    return updatePasswordViewModel;
});

