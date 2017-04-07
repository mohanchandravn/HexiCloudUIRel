/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['knockout', 'jquery'
], function (ko, $) {
    
    /**
     * The view model for the managing service calls
     */
    function sessionInfo() {
        
        var self = this;
        
        self.accessToken = 'accessToken';
        self.expiresIn = 'expiresIn';
        self.accessTokenSetTime = 'accessTokenSetTime';
        self.isLoggedInUser = 'isLoggedInUser';
        self.containerName = 'containerName';
        self.loggedInUser = 'loggedInUser';
        self.loggedInUserRole = 'loggedInUserRole';
        self.userFirstLastName = 'userFirstLastName';
        self.phoneNumber = 'phoneNumber';
        self.userClmRegistryId = 'userClmRegistryId';
        self.isOnboardingComplete = 'isOnboardingComplete';

        self.getFromSession = function (key) {
            if (typeof (Storage) !== "undefined") {
                return sessionStorage.getItem(key);
            } else {
                console.log("No session storage available, will not be able to maintain session");
            }
        };

        self.setToSession = function (key, value) {
            if (typeof (Storage) !== "undefined") {
                return sessionStorage.setItem(key, value);
            } else {
                console.log("No session storage available, will not be able to maintain session");
            }
        };
        
        self.removeFromSession = function (key) {
            if (typeof (Storage) !== "undefined") {
                return sessionStorage.removeItem(key)
            } else {
                console.log("No session storage available, will not be able to maintain session");
            }
        };
        
        self.removeAllFromSession = function () {
            if (typeof (Storage) !== "undefined") {
                return sessionStorage.clear();
            } else {
                console.log("No session storage available, will not be able to maintain session");
            }
        };
    };

    return new sessionInfo();
});


