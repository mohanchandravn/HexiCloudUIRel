define(['jquery',
        'knockout',
        'config/serviceConfig',
        'config/sessionInfo',
        'ojs/ojcore',
        'ojs/ojinputtext',
        'ojs/ojknockout'], function ($, ko, service, sessionInfo){
    
    function updatePasswordViewModel(params){
        var self = this;
        self.currentPassword = ko.observable("");
        self.newPassword = ko.observable("");
        self.repeatPassword = ko.observable("");
        self.tracker = ko.observable();
        self.templateId = ko.observable('updatePwdForm');
        
        if(params) {
            self.parentVM = params.parent;
        }
        
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
            $("#repeatPassword").on('keyup paste cut', function (e) {
                var repeatPwd = $("#repeatPassword").val();
                console.log(self.newPassword());
                console.log(repeatPwd);
                if ( repeatPwd !== '' ) {
                    if (self.newPassword() !== repeatPwd) {
                        $('#mismatchedPassword').show();
                    } else {
                        $('#mismatchedPassword').hide();
                    }
                } else {
                    $('#mismatchedPassword').hide();
                }
            });
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
                if (status === 200) {
                    console.log('successfully updated password..');
                } else {
                    $('#invalidPassword').show();
                }
                hidePreloader();
            };
            
            var failCbFn = function(xhr) {
                console.log(xhr);
                $('#invalidPassword').show();
                hidePreloader();
            };
            
            var payload = {
                "oldPassword": self.currentPassword(),
                "newPassword": $("#repeatPassword").val()
            };
            console.log(payload);
            service.updatePasswordService(payload).then(successCbFn, failCbFn);           
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

