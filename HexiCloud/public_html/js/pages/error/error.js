/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * error module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'config/sessionInfo', 'ojs/ojknockout', 'ojs/ojfilmstrip', 'ojs/ojpagingcontrol'
], function (oj, ko, $) {

    /**
     * The view model for the main content view template
     */
    function errorViewModel(params) {

        var self = this;

        var parentRouter = params.ojRouter.parentRouter;

        self.errorHeading = 'Something went wrong';
        self.errorMsg = ko.observable('');
        self.goToHomePageHeading = 'Would you like to go back to the home page?';
        self.goToHomePage = 'Go to home page';
        
        function init() {
            initializeErrorMessages();
        }
        
        function initializeErrorMessages() {
            var status = parentRouter.errorData.status;
            if (status === 400) {
                self.errorMsg('Sorry it appears that the page you are looking for is no longer available.');
            } else if (status === 401) {
                self.errorMsg('Unauthorized. The user does not have the necessary credentials.');
            } else if (status === 403) {
                self.errorMsg('The request was a valid request, but the server is refusing to respond to it. The user might be logged in but does not have the necessary permissions for the resource.');
            } else if (status === 404) {
                self.errorMsg('Sorry it appears that the page you are looking for is no longer available.');
                // self.errorMsg('The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.');
            } else if (status === 500) {
                self.errorMsg('Internal Server Error.');
            } else if (status === 502) {
                self.errorMsg('Bad Gateway. The server was acting as a gateway or proxy and received an invalid response from the upstream server.');
            } else if (status === 503) {
                self.errorMsg('The server is currently unavailable (because it is overloaded or down for maintenance).');
            } else if (status === 504) {
                self.errorMsg('The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.');
            } else {
                self.errorMsg('Oops, there is an error...');
            }
            delete parentRouter.errorData;
        };
        
        self.onClickGoToHomePage = function () {
            parentRouter.go('chooseRole');
        };
        
        init();
    }

    return errorViewModel;
});
