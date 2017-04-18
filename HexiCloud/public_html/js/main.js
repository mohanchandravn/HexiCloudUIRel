/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
requirejs.config({
    baseUrl: 'js',
    // Path mappings for the logical module names
    paths:
            //injector:mainReleasePaths
                    {
                        'knockout': 'libs/knockout/knockout-3.4.0',
                        'jquery': 'libs/jquery/jquery-3.1.1.min',
                        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0.min',
                        'promise': 'libs/es6-promise/es6-promise.min',
                        'hammerjs': 'libs/hammer/hammer-2.0.8.min',
                        'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
                        'ojs': 'libs/oj/v3.0.0/min',
                        'ojL10n': 'libs/oj/v3.0.0/ojL10n',
                        'ojtranslations': 'libs/oj/v3.0.0/resources',
                        'text': 'libs/require/text',
                        'signals': 'libs/js-signals/signals.min',
                        'customElements': 'libs/webcomponents/CustomElements.min',
                        'proj4': 'libs/proj4js/dist/proj4-src',
                        'css': 'libs/require-css/css.min'



                                //    'knockout': 'libs/knockout/knockout-3.4.0',
                                //    'jquery': 'libs/jquery/jquery-3.1.0.min',
                                //    'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0.min',
                                //    'ojs': 'libs/oj/v2.2.0/min',
                                //    'ojL10n': 'libs/oj/v2.2.0/ojL10n',
                                //    'ojtranslations': 'libs/oj/v2.2.0/resources',
                                //    'signals': 'libs/js-signals/signals.min',
                                //    'text': 'libs/require/text',
                                //    'promise': 'libs/es6-promise/es6-promise.min',
                                //    'hammerjs': 'libs/hammer/hammer-2.0.8.min',
                                //    'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
                                //    'css': 'libs/require-css/css.min'
//                        'utilities': 'utils/utilities'
                    }
            //endinjector
            ,
            // Shim configurations for modules that do not expose AMD
            shim: {
                'jquery': {
                    exports: ['jQuery', '$']
                }
            },
            // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
            // resources with a custom translation file.
            // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
            // a path that is relative to the location of this main.js file.
            config: {
                ojL10n: {
                    merge: {
                        //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
                    }
                }
            }
        });

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */

require(['ojs/ojcore', 'knockout', 'jquery', 'config/sessionInfo', 'util/errorhandler', 'config/serviceConfig', 'ojs/ojknockout',
    'ojs/ojtoolbar', 'ojs/ojbutton', 'ojs/ojrouter', 'ojs/ojmodule', 'ojs/ojmoduleanimations', 'ojs/ojanimation', 'ojs/ojoffcanvas'],
        function (oj, ko, $, sessionInfo, errorHandler, service)
        {
            var self = this;

            var navigationDrawerLeft;//, navigationDrawerRight;

            navigationDrawerLeft = {
                "selector": "#navigationDrawerLeft",
                "edge": "start",
                "displayMode": "push",
                "autoDismiss": "focusLoss",
                "modality": "modeless"//,
                        //        "query": oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.XL_UP)
            };

            //oj.Assert.forceDebug();
            //oj.Logger.option('level', oj.Logger.LEVEL_INFO);
            oj.ModuleBinding.defaults.modelPath = './';
            oj.ModuleBinding.defaults.viewPath = 'text!./';


            // Retrieve the router static instance and configure the states
            var router = oj.Router.rootInstance;
            // Set the router base URL to the href of this page. This is needed when
            // dealing with rewrited URL when the router uses the path URL adapter.
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            // Register custom components for reusing the code
            ko.components.register('header-content', {require: 'components/header/header'});
            ko.components.register('navigationbarleft', {require: 'components/navigationbarleft/navigationbarleft'});
            ko.components.register('navigationbarright', {require: 'components/navigationbarright/navigationbarright'});

            function getPath(path) {
                if (path === 'learningFlow')
                    return "pages/learning/" + path;
                else
                    return "pages/" + path + "/" + path;
            }
            ;

            router.configure({
                'home': {label: 'Home', value: getPath('home'), isDefault: true},
                'login': {label: 'Login', value: getPath('login')},
//                'hello': {label: 'Hello', value: getPath('hello')},
                'roleIdentified': {label: 'Role Identified', value: getPath('roleIdentified')},
//                'chooseRole': {label: 'Choose Role', value: getPath('chooseRole')},
                'chooseRole': {label: 'Choose Role', value: getPath('chooseRoleNew')},
//                'createUsers': {label: 'Create Users', value: getPath('createUsers')},
//                'addAdditionalUsers': {label: 'Add Additional Users', value: getPath('addAdditionalUsers')},
                'learning': {label: 'Learning', value: getPath('learning')},
                'dashboard': {label: 'Dashboard', value: getPath('dashboard')},
                'service': {label: 'Service', value: getPath('service')},
                'settings': {label: 'Settings', value: getPath('settings')},
                'learningFlow': {label: 'learningFlow', value: getPath('learningFlow')},
                'raiseSR': {label: 'Raise an SR', value: getPath('raiseSR')},
                'servicesMini': {label: 'Services', value: getPath('servicesMini')},
//                'guidedPathsMini': {label: 'Mini Learning', value: getPath('guidedPathsMini')},
                'csmadmin': {label: 'CSM Admin', value: getPath('csmadmin')},
                'samplecsv': {label: 'Sample CSV', value: getPath('samplecsv')},
                'addAdditionalUsers': {label: 'Add Users', value: getPath('addAnother')},
                'createUsers': {label: 'Add Users', value: getPath('addUsersTutorial')},
                'techSupport': {label: 'Techical Support', value: getPath('techSupport')},
                'useCases': {label: 'Use Cases', value: getPath('useCases')},
                'faqs': {label: 'FAQ\'s', value: getPath('faqs')},
                'error': {label: 'Error', value: getPath('error')}
            });

            function viewModel() {
                self.router = router;
//                var customAnimation = oj.ModuleAnimations.createAnimation(
//                        {"effect":"coverStart", "endOpacity":0.5},
//                        {"effect":"coverEnd", "direction":"end"},
//                true);
//                var moduleConfig = $.extend(true, {}, router.moduleConfig, {params: {
//                        'rootData': {}}});
                var moduleConfig = $.extend(true, {}, router.moduleConfig,
                        {params: {'rootData': {}}},
                        {animation: oj.ModuleAnimations['pushStart']
                        });
                self.moduleConfig = moduleConfig;

                // Redirect to login page if JWT token is expired
                var currentTime = (new Date).getTime();
                var accessTokenSetTime = Number(sessionInfo.getFromSession(sessionInfo.accessTokenSetTime));
                var accessTokenExpireTime = Number(sessionInfo.getFromSession(sessionInfo.expiresIn)) * 1000; // Convert to milliseconds
                if ((currentTime - accessTokenSetTime) >= accessTokenExpireTime && router.stateId() !== 'home') {
                    sessionInfo.removeAllFromSession(); // Clear session attributes
                    router.go('home');
                }

                self.checkIfOnboardingComplete = function () {
                    if (sessionInfo.getFromSession(sessionInfo.isOnboardingComplete)) {
                        router.go('dashboard');
                    }
                };
                self.checkIfOnboardingComplete();

                self.isDomainDetailsGiven = ko.observable(false);

                //screenrange observable for responsive alignment
                self.screenRange = oj.ResponsiveKnockoutUtils.createScreenRangeObservable();
                self.isLoggedInUser = ko.observable(sessionInfo.getFromSession(sessionInfo.isLoggedInUser));
                self.wrapperRestEndPoint = ko.observable("https://140.86.1.93/HexiCloudRESTAPI/resources/rest/myservices");
                self.containerName = ko.observable(sessionInfo.getFromSession(sessionInfo.containerName));
                self.loggedInUser = ko.observable(sessionInfo.getFromSession(sessionInfo.loggedInUser));
                self.loggedInUserRole = ko.observable(sessionInfo.getFromSession(sessionInfo.loggedInUserRole));
                self.phoneNumber = ko.observable(sessionInfo.getFromSession(sessionInfo.phoneNumber));
                self.changingNumber = ko.observable(false);
                self.userFirstLastName = ko.observable(sessionInfo.getFromSession(sessionInfo.userFirstLastName));
                self.userClmRegistryId = ko.observable(sessionInfo.getFromSession(sessionInfo.userClmRegistryId));
                self.isChatInitialized = ko.observable(false);
                self.isDashboardSelected = ko.observable(true);
                self.isUseCaseSelected = ko.observable(false);
                self.isResourceSelected = ko.observable(false);
                self.isContactSelected = ko.observable(false);
                self.currentSelectedCss = "selectedList";

                self.slideInEffect = ko.observable('slideIn');
                self.slideOutEffect = ko.observable('slideOut');


                self.showHeaderNav = ko.computed(function () {
                    var id = router.currentState().id;
                    var pages = ["dashboard", "useCases", "faqs"];
                    return (pages.indexOf(id) > -1) ? '' : 'visibility-hidden';
                });

                self.showPreloader = function () {
                    $("#preloader").removeClass("oj-sm-hide");
                    $("#routingContainer").css("pointer-events", "none");
                    $("#routingContainer").css("opacity", "0.5");
                };

                self.hidePreloader = function () {
                    $("#preloader").addClass("oj-sm-hide");
                    $("#routingContainer").css("pointer-events", "");
                    $("#routingContainer").css("opacity", "");
                };
                
                self.goToPage = function(id) {
                    router.go(id);
                };

                self.screenRange = oj.ResponsiveKnockoutUtils.createScreenRangeObservable();
                self.viewportSize = ko.computed(function () {
                    var range = self.screenRange();
                    console.log(range.toUpperCase());
                    return range.toUpperCase();
                });

                self.isScreenSMorMD = ko.computed(function () {
                    return (self.viewportSize() === "SM" || self.viewportSize() === "MD");
                });

                self.isScreenLGorXL = ko.computed(function () {
                    return (self.viewportSize() === "LG" || self.viewportSize() === "XL");
                });

                self.slideInAnimate = function (duration, delay) {
                    if (self.slideInEffect() && oj.AnimationUtils[self.slideInEffect()]) {
                        var jElem = $('.' + self.getStateId() + '-page');
                        console.log(jElem);
//                        var jElem = $('#module');

                        // jElem.css('backgroundColor', self.sampleBackground);

                        var animateOptions = {'delay': delay ? delay + 'ms' : '',
                            'duration': duration + 'ms',
                            'timingFunction': 'ease-in-out'};
                        $.extend(animateOptions, self.effectOptions);

                        // Invoke the animation effect method with options
                        oj.AnimationUtils[self.slideInEffect()](jElem[0], animateOptions);
                    }
                };

                self.slideOutAnimate = function (duration, delay) {
                    if (self.slideOutEffect() && oj.AnimationUtils[self.slideOutEffect()]) {
                        var jElem = $('.' + self.getStateId() + '-page');
                        console.log(jElem);
//                        var jElem = $('#module');

                        // jElem.css('backgroundColor', self.sampleBackground);

                        var animateOptions = {'delay': delay ? delay + 'ms' : '',
                            'duration': duration + 'ms',
                            'timingFunction': 'ease-in-out'};
                        $.extend(animateOptions, self.effectOptions);

                        // Invoke the animation effect method with options
                        oj.AnimationUtils[self.slideOutEffect()](jElem[0], animateOptions);
                    }
                };

                self.getStateId = function () {
                    return router.currentState().id;
                };

                self.FailCallBackFn = function (xhr) {
                    hidePreloader();
                    console.log(xhr);
                    errorHandler.showAppError("ERROR_GENERIC", xhr);
                };

                self.dashboardServices = ko.observableArray([]);

                self.toggleContactType = function () {
                    self.clearSelectedList();
                    self.isContactSelected(true);
                    if ($("#contactType").hasClass("oj-sm-hide")) {
                        $("#contactType").removeClass("oj-sm-hide");
                        $("#contactToggle").text("keyboard_arrow_up");
                    } else {
                        $("#contactType").addClass("oj-sm-hide");
                        $("#contactToggle").text("keyboard_arrow_down");
                    }
                };

                self.toggleResourcesType = function () {
                    if ($("#resourcesType").hasClass("oj-sm-hide")) {
                        $("#resourcesType").removeClass("oj-sm-hide");
                        $("#resourcesToggle").text("keyboard_arrow_up");
                    } else {
                        $("#resourcesType").addClass("oj-sm-hide");
                        $("#resourcesToggle").text("keyboard_arrow_down");
                    }
                };

                self.toggleLeft = function () {
                    if ($("#navigationDrawerLeft").hasClass('oj-offcanvas-open')) {
                        oj.OffcanvasUtils.close(navigationDrawerLeft);
//                        $("#navigationIconLeft").removeClass('oj-sm-hide');
                        return true;
                    }
//                    $("#navigationIconLeft").addClass('oj-sm-hide');
                    window.scrollTo(0, 0);
                    return (oj.OffcanvasUtils.open(navigationDrawerLeft));
                };

                self.routeToDashboard = function (data, event) {
                    service.updateCurrentStep({
                        "userId": loggedInUser(),
                        "userRole": loggedInUserRole(),
                        "curStepCode": event.currentTarget.id,
                        "preStepCode": getStateId(),
                        "userAction": "Clicked Dashboard"
                    }, true);
                    routeTo(data, event);
                    self.isDashboardSelected(true);
                };

                self.routeToUsecase = function (data, event) {
                    service.updateCurrentStep({
                        "userId": loggedInUser(),
                        "userRole": loggedInUserRole(),
                        "curStepCode": event.currentTarget.id,
                        "preStepCode": getStateId(),
                        "userAction": "Clicked Use Cases"
                    }, true);
                    routeTo(data, event);
                    self.isUseCaseSelected(true);
                };

                self.routeToResources = function (data, event) {
                    //routeTo(data,event);
                    self.clearSelectedList();
                    self.isResourceSelected(true);
                    self.toggleResourcesType();
                };

                self.routeToFAQs = function (data, event) {
                    //routeTo(data,event);
                    service.updateCurrentStep({
                        "userId": loggedInUser(),
                        "userRole": loggedInUserRole(),
                        "curStepCode": event.currentTarget.id,
                        "preStepCode": getStateId(),
                        "userAction": "Clicked FAQ's"
                    }, true);
                    self.clearSelectedList();
                    routeTo(data, event);
                };

                var routeTo = function (data, event) {
                    console.log(event.currentTarget.id);
                    self.clearSelectedList();
                    router.go(event.currentTarget.id + '/');
                    self.toggleLeft();
                };

                self.clearSelectedList = function () {
                    self.isDashboardSelected(false);
                    self.isUseCaseSelected(false);
                    self.isResourceSelected(false);
                    self.isContactSelected(false);
                };


                self.capturedEvent = function (data, event) {
                    // Clear session attributes on user logout

                    if (event.currentTarget.id === 'logout') {
                        sessionInfo.removeAllFromSession();
                    }

                    self.toggleContactType();
                    self.toggleLeft();
                    selectedTemplate(event.currentTarget.id + '_content');
                    $("#tech_support").show();
                };

                self.logout = function (data, event) {

                    var logoutSuccessCallback = function () {
                        sessionInfo.removeAllFromSession();
                        self.toggleLeft();
                        $("#tech_support").hide();
                        self.isDashboardSelected(true);
                        self.isUseCaseSelected(false);
                        self.isResourceSelected(false);
                        self.isContactSelected(false);
                        router.go('home/');

                    };
                    service.logout().then(logoutSuccessCallback);

                };

                $(window).resize(function () {
                    if (oj.ResponsiveUtils.compare(self.screenRange(), oj.ResponsiveUtils.SCREEN_RANGE.LG) < 0) {
                        self.isChatInitialized(false);
                    }
//                    self.autoAlignContent();
                });

                self.selectedTemplate = ko.observable('');

                self.references = {
                    "selectedValueRef": self.selectedTemplate
                };

            }
            ;


            $(document).ready(function () {
//                $("#navigationIconLeft").click(function() {
//                    self.toggleLeft();
//                });
                // setup the Navigation and Ancillary offcanvases for the responsive layout
                oj.OffcanvasUtils.setupResponsive(navigationDrawerLeft);

                oj.Router.sync().then(function () {
                    ko.applyBindings(viewModel(), document.getElementById('routing-container'));
                });
            });
        });

