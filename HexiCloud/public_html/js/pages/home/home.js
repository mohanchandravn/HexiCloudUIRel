/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojfilmstrip', 'ojs/ojpagingcontrol' 
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function homeContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        self.homeModule = ko.observable({
            'name': 'pages/home/welcome',
            "params": {
                parent: self
            }
        });
        
        self.goToLogin = function ()
        {
            self.homeModule({
            'name': 'pages/login/login',
            "params": {
                parent: self,
                parentRouter : params.ojRouter.parentRouter
            }
        });
        };
        
        self.goToForgotPassword = function ()
        {
            self.homeModule({
            'name': 'pages/login/forgotPassword',
            "params": {
                parent: self
            }
        });
        };
        
        console.log('home page');
        self.filmStripItems = [
            { title: 'Get onboard', description: 'There are 3 easy steps to complete the onboarding process and get started with your services' },
            { title: 'Adoption made easy', description: 'Gain access to a library of How-to guides and Use Cases to simplify your journey to the cloud' },
            { title: 'We\'re here to help', description: 'A customer success consultant will be on hand to help you implement your services and gain the most value' }
        ];
//        self.filmStripItems = [
//            { title: 'Prepare', description: 'for what you need and get your team geared up' },
//            { title: 'Learn', description: 'how it\'s done in our use cases and success stories' },
//            { title: 'Plan', description: 'the services you need for your business' },
//            { title: 'Build', description: 'with real-time support and help' },
//            { title: 'Succeed', description: 'in your journey to the cloud' }
//        ];
        self.pagingModel = null;
        
        getItemInitialDisplay = function(index) {
            return index < 1 ? '' : 'none';
        };
        
        getPagingModel = function() {
            if (!self.pagingModel) {
              var filmStrip = $("#filmStrip");
              var pagingModel = filmStrip.ojFilmStrip("getPagingModel");
              self.pagingModel = pagingModel;
            }
            return self.pagingModel;
        };
        
        self.isLoggedinTrue = function() {
//            setTimeout(function(){
                router.go('login/');
//            }, 500);
//            slideOutAnimate(1500, 0);
        };
        
        self.changeFilmStripValue = function() {
            if(viewportSize() !== 'SM') {
                var currentItem = $( "#filmStrip" ).ojFilmStrip( "option", "currentItem" );
                if (currentItem !== (self.filmStripItems.length - 1)) {
                    $("#filmStrip").ojFilmStrip("option", "currentItem", (currentItem + 1));
                } else {
                    $("#filmStrip").ojFilmStrip("option", "currentItem", 0);
                }
            }
        };

        self.handleAttached = function() {
//            slideInAnimate(500, 0);
            self.interval = ko.observable(setInterval(function() {
                self.changeFilmStripValue();
            }, 8000));
        };
        
        self.handleDetached = function() {
            clearInterval(self.interval());
        };
    }
    
    return homeContentViewModel;
});
