/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCasesDemo module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'util/commonhelper', 'ojs/ojknockout',
    'ojs/ojmasonrylayout', 'ojs/ojinputtext', 'ojs/ojcheckboxset', 'ojs/ojradioset', 'ojs/ojswitch', 'ojs/ojselectcombobox',, 'ojs/ojaccordion',
    'ojs/ojcollapsible', 'components/techsupport/loader'
], function (oj, $, ko, service, errorHandler, commonHelper) {
    /**
     * The view model for the main content view template
     */
    function useCasesDemoContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        var useCaseDrawerRight;//, navigationDrawerRight;

        useCaseDrawerRight = {
            "selector": "#useCaseDrawerRight",
            "edge": "end",
            "displayMode": "overlay",
            "autoDismiss": "none",
            "modality": "modal"
        };

        console.log('useCasesDemo page');

        self.tracker = ko.observable();

        self.isAllUseCasesLoaded = ko.observable(false);
        self.isUseCasesForUserLoaded = ko.observable(false);
        
        self.isUseCaseSelected = ko.observable(false);
        self.isServiceSelected = ko.observable(false);
        self.isBenefitSelected = ko.observable(false);

        self.selectedUseCaseItems = ko.observableArray([]);
        self.hasSelectedOtherUseCase = ko.observable(false);
        self.otherUseCaseServiceItems = ko.observableArray([]);
//        self.otherUseCaseBenefitsList = ko.observableArray([]);
        self.otherUseCaseBenefitsList = ko.observableArray([
            {value: 'benefits1', label: 'Cost reduction'},
            {value: 'benefits2', label: 'Time reduction / Faster Deployment'},
            {value: 'benefits3', label: 'Zero Administration'},
            {value: 'benefits4', label: 'Easy integration'},
            {value: 'benefits5', label: 'ROI Increase'},
            {value: 'benefits5', label: 'Flexibility'},
            {value: 'benefits5', label: 'Scalability'},
            {value: 'other', label: 'Other'}
        ]);
        self.otherUseCases = ko.observableArray([]);
        self.useCasesQuestions = ko.observableArray(
                [{
                        "status": "notStarted"
                    }, {
                        "status": null
                    }, {
                        "status": null
                    }, {
                        "status": null
                    }, {
                        "status": null
                    }, {
                        "status": null
                    }, {
                        "status": null
                    }]);
        self.useCasesSubQuestions = ko.observableArray([]);
        self.haveImplementedUseCases = ko.observable(false);
        self.inQuestion = ko.observable(1);
        self.isSubQuestionSelected = ko.observable(false);
        self.finalSubQuestionSelected = ko.observable(false);
        self.finalSubQuestionTitle = ko.observable();
        self.selectedSubQuestion = ko.observableArray([]);
        self.areUseCaseDetailsFetched = ko.observable(false);
        self.selectedUseCaseDetails = ko.observableArray([]);
        self.switchOffUseCases = ko.observableArray([]);
        self.tailoredUseCases = ko.observableArray([]);

        self.otherUserCaseCount = ko.observable(0);

        self.allUseCases = [];
        self.useCasesForUser = [];

        self.useCaseItemsTemplate = ko.pureComputed(function () {
            return self.haveImplementedUseCases() === true ? 'useCaseItemsNonEditable' : 'useCaseItemsEditable';
        });

        var getAllUseCasesSuccessCbFn = function (data, status) {
            console.log(status);
            console.log(data);
            if (data.useCases) {
                var useCases = data.useCases;
                for (var idx = 0; idx < useCases.length; idx++) {
                    if (useCases[idx].title.length > 35) {
                        var trimTitle = useCases[idx].title.slice(0, 35);
                        useCases[idx].trimmedTitle = trimTitle + "...";
                    }
                }
                self.allUseCases = useCases;
            }
            self.isAllUseCasesLoaded(true);
            hidePreloader();
        };

        var getAllUseCasesFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };
        
        var getUseCasesForUserSuccessCbFn = function (data, status) {
            console.log(status);
            console.log(data);
            if (data.useCases) {
                var useCases = data.useCases;
                for (var idx = 0; idx < useCases.length; idx++) {
                    if (useCases[idx].title.length > 35) {
                        var trimTitle = useCases[idx].title.slice(0, 35);
                        useCases[idx].trimmedTitle = trimTitle + "...";
                    }
                }
                self.useCasesForUser = useCases;
            }
            self.isUseCasesForUserLoaded(true);
            hidePreloader();
        };

        var getUseCasesForUserFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };

        var getAllServicesSuccessCbFn = function (data, status) {
            console.log(status);
            console.log(data);
            self.otherUseCaseServiceItems(data.services);
            hidePreloader();
        };

        var getAllServicesFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };

        var getDecisionTreeSuccessCbFn = function (data, status) {
            console.log(status);
            console.log(data);
            self.useCasesSubQuestions([]);
            var subQuestions = data.decisionTree;
            console.log(subQuestions);
            for (var idx = 0; idx < subQuestions.length; idx++) {
                if (idx === 0) {
                    self.useCasesSubQuestions.push({
                        "id": subQuestions[idx].id,
                        "question": subQuestions[idx].question,
                        "yesQId": subQuestions[idx].yesQId,
                        "noQId": subQuestions[idx].noQId,
                        "yesSwitchOffCases": subQuestions[idx].yesSwitchOffCases,
                        "noSwitchOffCases": subQuestions[idx].noSwitchOffCases,
                        "preQId": subQuestions[idx].preQId,
                        "status": "notStarted"
                    });
                } else {
                    self.useCasesSubQuestions.push({
                        "id": subQuestions[idx].id,
                        "question": subQuestions[idx].question,
                        "yesQId": subQuestions[idx].yesQId,
                        "noQId": subQuestions[idx].noQId,
                        "yesSwitchOffCases": subQuestions[idx].yesSwitchOffCases,
                        "noSwitchOffCases": subQuestions[idx].noSwitchOffCases,
                        "preQId": subQuestions[idx].preQId,
                        "status": null
                    });
                }
            }
            self.isSubQuestionSelected(true);
            self.selectedSubQuestion(self.useCasesSubQuestions()[0]);
        };

        var getDecisionTreeFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };
        
//        
//        self.updateQuestionStep = function() {
//            for ( var idx = self.inQuestion() - 1; idx < self.useCasesQuestions().length; idx++) {
//                
//            }
//        };

        self._showComponentValidationErrors = function (trackerObj) {
            trackerObj.showMessages();
            if (trackerObj.focusOnFirstInvalid()) {
                return false;
            }
            return true;
        };
        
        self.hasInvalidComponents = function () {
            var trackerObj = ko.utils.unwrapObservable(self.tracker),
                    hasInvalidComponents = trackerObj ? trackerObj["invalidShown"] : false;
            return hasInvalidComponents;
        };

        self.openInfoPopUp = function(data, event) {
            console.log(data);
            console.log(event);
        };

        self.addOtherUseCase = function () {
            self.otherUserCaseCount(self.otherUserCaseCount() + 1);
            console.log(self.otherUseCaseServiceItems());
            console.log(self.otherUseCaseServiceItems()[0]);
//            self.otherUseCaseSummary = ko.observable('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet eros a velit laoreet tristique accumsan sed libero.');
//        self.otherUseCaseServicesUsed = ko.observableArray([]);
//        self.otherUseCaseBenefits = ko.observableArray(["   "]);
            self.otherUseCases.push({
                useCaseSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet eros a velit laoreet tristique accumsan sed libero.',
                useCaseServicesUsed: [self.otherUseCaseServiceItems()[0].label],
                useCaseBenefits: '',
                otherUserCaseCount: self.otherUserCaseCount()
            });
            $( "#otherUseCasesAccordion" ).ojAccordion( "refresh" );
            $( "#otherUseCasesAccordion" ).ojAccordion( "option", "expanded", ["collapsible" + self.otherUseCases().length] );
        };

        self.checkIfUseCaseAdded = function (id) {
            for (var idx = 0; idx < self.selectedUseCaseItems().length; idx++) {
                if (self.selectedUseCaseItems()[idx].id === id) {
                    console.log('found at ' + idx);
                    return true;
                }
            }
            console.log('not found');
            return false;
        };
        
        self.toggleUseCaseSelections = function (data, event) {
            var id = Number(event.currentTarget.id);
            console.log(id);
            console.log(self.selectedUseCaseItems());
            if (id !== 10) { // Other use case
//                var foundAt = self.checkIfUseCaseAdded(id);
                if (self.checkIfUseCaseAdded(id)) {
                    console.log('already added');
                    $("#" + id).removeClass("selected");
                    self.selectedUseCaseItems.remove(function (item) {
                        return item.id === id;
                    });
//                    self.selectedUseCaseItems.splice(foundAt, 1);
                } else {
                    $("#" + id).addClass("selected");

                    for (var idx = 0; idx < self.allUseCases.length; idx++) {
                        if (id === self.allUseCases[idx].id) {
                            self.selectedUseCaseItems().push(self.allUseCases[idx]);
                        }
                    }
//                    self.selectedUseCaseItems().push(id);
                }
            } else {
//                var foundAt = self.checkIfUseCaseAdded(id);
                if (self.hasSelectedOtherUseCase()) {
                    self.otherUseCases([]);
                    console.log('already added');
                    $("#img10").removeClass("selected");
                    $("#" + id).removeClass("selected");
                    self.hasSelectedOtherUseCase(false);
                    self.selectedUseCaseItems.remove(function (item) {
                        return item.id === id;
                    });
//                    self.selectedUseCaseItems.splice(foundAt, 1);
                } else {
                    console.log(self.otherUserCaseCount());
                    self.otherUserCaseCount(self.otherUserCaseCount() + 1);
                    console.log(self.otherUseCaseServiceItems());
                    self.otherUseCases([]);
                    self.otherUseCases([{
                            useCaseSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet eros a velit laoreet tristique accumsan sed libero.',
                            useCaseServicesUsed: [self.otherUseCaseServiceItems()[0].label],
                            useCaseBenefits: '',
                            otherUserCaseCount: self.otherUserCaseCount()
                        }]);
                    $("#img10").addClass("selected");
                    $("#" + id).addClass("selected");
                    self.hasSelectedOtherUseCase(true);
                    $( "#otherUseCasesAccordion" ).ojAccordion( "option", "expanded", ["collapsible" + self.otherUseCases().length] );
                }
            }
            console.log(self.selectedUseCaseItems());
            console.log(self.otherUseCases());
            
            self.isUseCaseSelected(self.selectedUseCaseItems().length > 0 || 
                (self.otherUseCases().length > 0 && self.otherUseCases()[0].otherUserCaseCount > 0)); 
        };
           
        self.disableNextButton = ko.pureComputed(function () {
            return !self.isUseCaseSelected() || self.hasInvalidComponents() || 
                (self.otherUseCases().length > 0 && self.otherUseCases()[0].otherUserCaseCount > 0 && self.disableAddAnotherButton());
        });
        
        self.disableAddAnotherButton = ko.pureComputed(function () {
            return !self.isServiceSelected() || !self.isBenefitSelected() || self.hasInvalidComponents();
        });
         
        self.moveToNextQuestion = function () {
            showPreloader();

            if (self.inQuestion() === 2) {
                showPreloader();
                console.log('selectedUseCaseItems - ' + JSON.stringify(self.selectedUseCaseItems()));
                console.log('otherUseCases - ' + JSON.stringify(self.otherUseCases()));

                var saveUserUseCasesSuccessCbFn = function (data, status) {
                    service.getUseCasesForUser().then(getUseCasesForUserSuccessCbFn, getUseCasesForUserFailCbFn);
                };

                var saveUserUseCasesFailCbFn = function (xhr) {
                    hidePreloader();
                    console.log(xhr);
                    errorHandler.showAppError("ERROR_GENERIC", xhr);
                };

                var allUseCasesSelected = [];
                for (var idx in self.selectedUseCaseItems()) {
                    var useCaseId = self.selectedUseCaseItems()[idx].id;
                    if (useCaseId) {
                        var jsonData = {
                            "useCaseId": useCaseId,
                            "code": "I"
                        };
                        allUseCasesSelected.push(jsonData);
                    }
                }

                for (var idx in self.otherUseCases()) {
                    var useCase = self.otherUseCases()[idx];
                    var services = useCase.useCaseServicesUsed === "" ? "" : useCase.useCaseServicesUsed.join();
                    var benefits = useCase.useCaseBenefits === "" ? "" : useCase.useCaseBenefits.join();
                    var jsonData = {
                        "useCaseId": 10,
                        "code": "I",
                        "summary": useCase.useCaseSummary,
                        "services": services,
                        "benefits": benefits
                    };
                    allUseCasesSelected.push(jsonData);
                }

                var jsonData = {
                    "userUseCases": allUseCasesSelected
                };
                service.saveUserUseCases(jsonData).then(saveUserUseCasesSuccessCbFn, saveUserUseCasesFailCbFn);

                console.log('allUseCasesSelected - ' + JSON.stringify(allUseCasesSelected));
            }

            console.log(self.useCasesQuestions());

            var array = self.useCasesQuestions();
            self.useCasesQuestions([]);
            for (var index = 0; index < array.length; index++) {
                if (index <= (self.inQuestion() - 1)) {
                    console.log(index);
                    array[index].status = "completed";
                    array[index + 1].status = "notStarted";
                }
            }
            self.useCasesQuestions(array);
            if (self.inQuestion() === 3) {         
                showPreloader();
                service.getUseCasesForUser().then(getUseCasesForUserSuccessCbFn, getUseCasesForUserFailCbFn);
                console.log(self.haveImplementedUseCases());
                console.log('making false to true of haveImplementedUseCases value');
                self.haveImplementedUseCases(true);
                self.goToStartUseCasesStep();
                console.log(self.haveImplementedUseCases());
//                service.getUseCaseDemoSubQuestions(self.inQuestion()).then(subQuestionsSuccessCbFn, subQuestionsFailCbFn);
            } else {
                self.inQuestion(self.inQuestion() + 1);
            }
            console.log(self.useCasesQuestions());
            if (self.hasSelectedOtherUseCase()) {
                // Validations
                var trackerObj = ko.utils.unwrapObservable(self.tracker);
                if (!this._showComponentValidationErrors(trackerObj)) {
                    return;
                }
            }

            hidePreloader();
        };

        self.goToStartUseCasesStep = function () {           
            var array = self.useCasesQuestions();
            self.useCasesQuestions([]);
            for (var index = 0; index < array.length; index++) {
                if (index < 3) {
                    array[index].status = "completed";
                    array[index + 1].status = "notStarted";
                }
            }
            self.inQuestion(4);
            self.useCasesQuestions(array);
            self.haveImplementedUseCases(true);
        };

        self.startTheUseCaseSelection = function (data, event) {
            for (var idx = 0; idx < self.useCasesQuestions().length; idx++) {
                if (self.useCasesQuestions()[idx].status === 'notStarted') {
                    self.inQuestion(idx + 1);
                }
            }
            if (self.inQuestion() === 4) {
                service.getDecisionTree().then(getDecisionTreeSuccessCbFn, getDecisionTreeFailCbFn);
            }
        };

        self.moveToNextSubQuestion = function (data, event) {
            var id = event.currentTarget.id;
            var useCases;

            // for matching with yes/no button id's
            var hasSelectedYes = id.startsWith("Y");
            id = id.substring(1);
            var foundAt;
            var array = self.useCasesSubQuestions();
            self.useCasesSubQuestions([]);

            // to get the id of selected sub question
            for (var index = 0; index < array.length; index++) {
                if (Number(id) === Number(array[index].id)) {
                    foundAt = index;
                }
            }

            // for checking whether it's last sub question or not
            if ((foundAt + 1) < array.length) {
                array[foundAt].status = "completed";
                array[foundAt + 1].status = "notStarted";
                self.useCasesSubQuestions(array);
                self.selectedSubQuestion(self.useCasesSubQuestions()[id]);
            } else {
                array[foundAt].status = "completed";
                self.useCasesSubQuestions(array);
                self.selectedSubQuestion([]);
                self.finalSubQuestionTitle('We have tailored these use cases that would fit perfectly with your provisioned services.');
                self.finalSubQuestionSelected(true);
                
                // To refresh the items in the JET component
                $("#masonryUseCases").ojMasonryLayout("refresh");
            }

            // to highlight the selected use cases for the matched sub questions
            if (hasSelectedYes) {
                useCases = array[foundAt].yesSwitchOffCases;
            } else {
                useCases = array[foundAt].noSwitchOffCases;
            }

            self.switchOffUseCases([]);
            if (!commonHelper.isNullOrEmpty(useCases)) {
                useCases = useCases.split(",");
                for (var idx = 0; idx < useCases.length; idx++) {
                    self.switchOffUseCases.push(Number(useCases[idx]));
                }

                console.log('Use Cases to be switched off: ' + self.switchOffUseCases());
                for (var idx = 0; idx < self.allUseCases.length; idx++) {
                    var searchStatus = $.inArray(self.allUseCases[idx].id, self.switchOffUseCases());
                    if (searchStatus !== -1) {
                        console.log(self.allUseCases[idx].id);
                        self.tailoredUseCases.push(self.allUseCases[idx]);
                        $("#useCaseLayer" + self.allUseCases[idx].id).removeClass("oj-sm-hide");
                        $("#useCase" + self.allUseCases[idx].id).addClass("pointer-events-none");
                    } else {
                        console.log('not found');
                    }
                }
            }
        };

        self.getDetails = function (data, event) {
            console.log(data);
            console.log(event);
            if (data.id) {
                self.selectedUseCaseDetails(data);
                self.areUseCaseDetailsFetched(true);
                oj.OffcanvasUtils.open(useCaseDrawerRight);
            }
        };

        self.closeIt = function () {
            oj.OffcanvasUtils.close(useCaseDrawerRight);
        };

        self.finishTailoring = function () {
            
            showPreloader();

            console.log('Tailored use cases : ');
            console.log(self.tailoredUseCases());
            
            var saveUserUseCasesSuccessCbFn = function (data, status) {
                hidePreloader();
                isUseCaseSelectionDone(true);
                router.go('dashboard/');
            };

            var saveUserUseCasesFailCbFn = function (xhr) {
                hidePreloader();
                console.log(xhr);
                errorHandler.showAppError("ERROR_GENERIC", xhr);
            };

            var tailoredUseCases = [];
            for (var idx in self.tailoredUseCases()) {
                var useCaseId = self.tailoredUseCases()[idx].id;
                if (useCaseId) {
                    var jsonData = {
                        "useCaseId": useCaseId,
                        "code": "T"
                    };
                    tailoredUseCases.push(jsonData);
                }
            }

            var jsonData = {
                "userUseCases": tailoredUseCases
            };
            service.saveUserUseCases(jsonData).then(saveUserUseCasesSuccessCbFn, saveUserUseCasesFailCbFn);
        };
        
        self.goToDashboard = function() {
            router.go('dashboard/');
        };
        
        self.serviceOptionChange = function (event, data) {
            self.isServiceSelected(data.value.length > 0);
        };
        
        self.benefitOptionChange = function (event, data) {
            self.isBenefitSelected(typeof data.value[0] === 'string' || (data.value.length === 0 && typeof data.previousValue === 'object'));
        };

        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        self.handleAttached = function () {
            showPreloader();
            oj.OffcanvasUtils.setupResponsive(useCaseDrawerRight);
            service.getAllUseCases().then(getAllUseCasesSuccessCbFn, getAllUseCasesFailCbFn);
            service.getAllServices().then(getAllServicesSuccessCbFn, getAllServicesFailCbFn);
            service.getUseCasesForUser().then(getUseCasesForUserSuccessCbFn, getUseCasesForUserFailCbFn);
        };
    }

    return useCasesDemoContentViewModel;
});
