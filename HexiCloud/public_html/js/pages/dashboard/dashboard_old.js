/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * dashboard module
 */
define(['jquery', 'knockout', 'ojs/ojcore', 'config/serviceConfig', 'config/sessionInfo', 'ojs/ojprogressbar'
], function ($, ko, oj, service, sessionInfo) {
    /**
     * The view model for the main content view template
     */
    function dashboardContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        console.log('dashboard page');
        
        self.logout = function(data, event) {
            console.log('Logging out');
            sessionInfo.removeFromSession(sessionInfo.isLoggedInUser);
            sessionInfo.removeFromSession(sessionInfo.loggedInUser);
            sessionInfo.removeFromSession(sessionInfo.loggedInUserRole);
            sessionInfo.removeFromSession(sessionInfo.userFirstLastName);
            sessionInfo.removeFromSession(sessionInfo.userClmRegistryId);
            router.go('home/');
        };
        
        self.togglePath = function(data, event) {
            var id = event.currentTarget.id;
            console.log(id);
            for (var idx = 0; idx < 5; idx++) {
                if (idx === Number(id)) {
                    if ( ($("#guidedPathDetail" + idx).hasClass("oj-sm-hide")) ) {
                        $("#" + idx).text('remove');
                        $("#guidedPathDetail" + idx).removeClass("oj-sm-hide");
                        //return;
                    } else {
                        $("#" + idx).text('add');
                        $("#guidedPathDetail" + idx).addClass("oj-sm-hide");
                        //return;
                    }
                } else {
                    if ( !($("#guidedPathDetail" + idx).hasClass("oj-sm-hide")) ) {
                        $("#" + idx).text('add');
                        $("#guidedPathDetail" + idx).addClass("oj-sm-hide");
                    }
                }
            }
        };
        
        self.handleAttached = function() {
            
        };
    }
    
    return dashboardContentViewModel;
});
