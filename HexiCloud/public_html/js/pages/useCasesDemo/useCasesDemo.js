/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCasesDemo module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'util/commonhelper', 'ojs/ojknockout', 'ojs/ojoffcanvas',
    'ojs/ojmasonrylayout', 'ojs/ojinputtext', 'ojs/ojcheckboxset', 'ojs/ojradioset', 'ojs/ojswitch', 'ojs/ojselectcombobox',, 'ojs/ojaccordion',
    'ojs/ojcollapsible', 'ojs/ojpopup', 'components/techsupport/loader'
], function (oj, $, ko, service, errorHandler, commonHelper) {
    /**
     * The view model for the main content view template
     */
    function useCasesDemoContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        var useCaseDrawerRight;

        useCaseDrawerRight = {
            "selector": "#useCaseDrawerRight",
            "edge": "end",
            "displayMode": "overlay",
            "autoDismiss": "none",
            "modality": "modal"
        };

        self.tracker = ko.observable();

        self.isAllUseCasesLoaded = ko.observable(false);
        self.isUseCasesForUserLoaded = ko.observable(false);
        
        self.isUseCaseSelected = ko.observable(false);
        self.isServiceSelected = ko.observable(false);
        self.isBenefitSelected = ko.observable(false);

        self.selectedUseCaseItems = ko.observableArray([]);
        self.hasSelectedOtherUseCase = ko.observable(false);
        self.otherUseCaseServiceItems = ko.observableArray([]);
        self.otherUseCaseBenefitsList = ko.observableArray([]);
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
        self.tailoredUseCases = ko.observableArray([]);

        self.otherUserCaseCount = ko.observable(0);

        self.allUseCases = [];
        self.useCasesForUser = [];

        self.useCaseItemsTemplate = ko.pureComputed(function () {
            return self.haveImplementedUseCases() === true ? 'useCaseItemsNonEditable' : 'useCaseItemsEditable';
        });

        var getAllUseCasesSuccessCbFn = function (data, status) {
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
            if (data.useCases) {
                var useCases = data.useCases;
                for (var idx = 0; idx < useCases.length; idx++) {
                    if (useCases[idx].title.length > 35) {
                        var trimTitle = useCases[idx].title.slice(0, 35);
                        useCases[idx].trimmedTitle = trimTitle + "...";
                    }
                }
                self.useCasesForUser = useCases;
                self.tailoredUseCases(useCases)
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
            self.otherUseCaseServiceItems(data.services);
            hidePreloader();
        };

        var getAllServicesFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
            errorHandler.showAppError("ERROR_GENERIC", xhr);
        };

        var getDecisionTreeSuccessCbFn = function (data, status) {
            self.useCasesSubQuestions([]);
            var subQuestions = data.decisionTree;
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
            hidePreloader();
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
            var id = event.currentTarget.id;
            id = id.substring(5);
            if (Number(id) !== 10) {
                $("#popup" + id).ojPopup('open', '#title' + id);
            }
        };

        self.closeInfoPopupUp = function(data, event) {
            var id = event.currentTarget.id;
            id = id.substring(5);
            if (Number(id) !== 10) {
                setTimeout(function() {
                    $("#popup" + id).ojPopup('close');
                }, 250);
            }
        };

        self.addOtherUseCase = function () {
            self.otherUserCaseCount(self.otherUserCaseCount() + 1);
//            self.otherUseCaseSummary = ko.observable('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet eros a velit laoreet tristique accumsan sed libero.');
//        self.otherUseCaseServicesUsed = ko.observableArray([]);
//        self.otherUseCaseBenefits = ko.observableArray(["   "]);
            self.otherUseCases.push({
                useCaseSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet eros a velit laoreet tristique accumsan sed libero.',
                useCaseServicesUsed: [],
                useCaseBenefits: '',
                otherUserCaseCount: self.otherUserCaseCount()
            });
            $( "#otherUseCasesAccordion" ).ojAccordion( "refresh" );
            $( "#otherUseCasesAccordion" ).ojAccordion( "option", "expanded", ["collapsible" + self.otherUseCases().length] );
        };
        
        self.removeOtherUseCase = function (data, event) {
            var id = event.currentTarget.id;
            id = id.replace('remove', '');  
            var otherUseCases = self.otherUseCases();
            otherUseCases.splice(id, 1);
            self.otherUseCases(otherUseCases);
            $( "#otherUseCasesAccordion" ).ojAccordion( "refresh" );
            $( "#otherUseCasesAccordion" ).ojAccordion( "option", "expanded", ["collapsible" + self.otherUseCases().length] );

            // To add missing collapsible icon on remove action
            $("#otherUseCasesAccordion span.oj-collapsible-header").each(function(index, elem){
                var collapsibleIcon = '<a href="#" class="oj-component-icon oj-clickable-icon-nocontext oj-collapsible-header-icon oj-collapsible-open-icon" aria-labelledby="oj-collapsible-collapsible1-header" role="button" aria-controls="oj-collapsible-collapsible1-content" aria-expanded="true"></a>';
                $(this).html(collapsibleIcon + $(this).text());                
            });
        };

        self.checkIfUseCaseAdded = function (id) {
            for (var idx = 0; idx < self.selectedUseCaseItems().length; idx++) {
                if (self.selectedUseCaseItems()[idx].id === id) {
                    return true;
                }
            }
            return false;
        };
        
        self.toggleUseCaseSelections = function (data, event) {
            var id = Number(event.currentTarget.id);
            if (id !== 10) { // Other use case
//                var foundAt = self.checkIfUseCaseAdded(id);
                if (self.checkIfUseCaseAdded(id)) {
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
                    $("#img10").removeClass("selected");
                    $("#" + id).removeClass("selected");
                    self.hasSelectedOtherUseCase(false);
                    self.selectedUseCaseItems.remove(function (item) {
                        return item.id === id;
                    });
//                    self.selectedUseCaseItems.splice(foundAt, 1);
                } else {
                    var benefitsSuccessCbFn = function (data, status) {
                        var benefits = data.benefits;
                        self.otherUseCaseBenefitsList([]);
                        for (var idx = 0; idx < benefits.length; idx++) {
                            self.otherUseCaseBenefitsList.push({value: benefits[idx].id, label: benefits[idx].label});
                        }
                        hidePreloader();
                    };
                    
                    var benefitsFailCbFn = function (xhr) {
                        hidePreloader();
                        console.log(xhr);
                        errorHandler.showAppError("ERROR_GENERIC", xhr);
                    };
                    
                    showPreloader();
                    // service to get other Use Cases benefits list
                    service.getUseCaseBenefits().then(benefitsSuccessCbFn, benefitsFailCbFn);
                    
                    self.otherUserCaseCount(self.otherUserCaseCount() + 1);
                    self.otherUseCases([]);
                    self.otherUseCases([{
                            useCaseSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet eros a velit laoreet tristique accumsan sed libero.',
                            useCaseServicesUsed: [],
                            useCaseBenefits: '',
                            otherUserCaseCount: self.otherUserCaseCount()
                        }]);
                    $("#img10").addClass("selected");
                    $("#" + id).addClass("selected");
                    self.hasSelectedOtherUseCase(true);
                    $( "#otherUseCasesAccordion" ).ojAccordion( "option", "expanded", ["collapsible" + self.otherUseCases().length] );
                }
            }
            
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
            }

            var array = self.useCasesQuestions();
            self.useCasesQuestions([]);
            for (var index = 0; index < array.length; index++) {
                if (index <= (self.inQuestion() - 1)) {
                    array[index].status = "completed";
                    array[index + 1].status = "notStarted";
                }
            }
            self.useCasesQuestions(array);
            if (self.inQuestion() === 3) {         
                showPreloader();
                service.getUseCasesForUser().then(getUseCasesForUserSuccessCbFn, getUseCasesForUserFailCbFn);
                self.haveImplementedUseCases(true);
                self.goToStartUseCasesStep();
//                service.getUseCaseDemoSubQuestions(self.inQuestion()).then(subQuestionsSuccessCbFn, subQuestionsFailCbFn);
            } else {
                self.inQuestion(self.inQuestion() + 1);
            }
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
            if (!isCapturePhaseCompleted()) {
                showPreloader();
                
                var markUCCaptureCompletionSuccessCbFn = function (data, status) {
                    hidePreloader();
                };

                var markUCCaptureCompletionFailCbFn = function (xhr) {
                    hidePreloader();
                    console.log(xhr);
                    errorHandler.showAppError("ERROR_GENERIC", xhr);
                };

                service.markUCCaptureCompletion().then(markUCCaptureCompletionSuccessCbFn, markUCCaptureCompletionFailCbFn);
            }
            
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
                showPreloader();
                service.getDecisionTree().then(getDecisionTreeSuccessCbFn, getDecisionTreeFailCbFn);
            }
        };

        self.moveToNextSubQuestion = function (data, event) {
            var id = event.currentTarget.id;

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

            var currentQuestion = array[id - 1];
            var yesQId = currentQuestion.yesQId;
            var noQId = currentQuestion.noQId;
            
            var goToCompletionScreen = function() {
                array[foundAt].status = "completed";
                self.selectedSubQuestion([]);
                self.finalSubQuestionTitle('We have tailored these use cases that would fit perfectly with your provisioned services.');
                self.finalSubQuestionSelected(true);
                
                // To refresh the items in the JET component
                $("#masonryUseCases").ojMasonryLayout("refresh");
            }
            
            if (array[foundAt]) {
                array[foundAt].status = "completed";
            }

            if (hasSelectedYes) {
                if (commonHelper.isNullOrEmpty(yesQId)) {
                    goToCompletionScreen();
                } else {
                    self.selectedSubQuestion(array[self.getIndex(array, yesQId)]);
                    array[self.getIndex(array, yesQId)].status = "notStarted";
                }
            } else {
                if (commonHelper.isNullOrEmpty(noQId)) {
                    goToCompletionScreen();
                } else {
                    self.selectedSubQuestion(array[self.getIndex(array, noQId)]);
                    array[self.getIndex(array, noQId)].status = "notStarted";
                }
            }
            self.useCasesSubQuestions(array);
            
            var switchOffUseCases = [];
            
            if (hasSelectedYes) {
                if (!commonHelper.isNullOrEmpty(array[foundAt].yesSwitchOffCases)) {
                    switchOffUseCases = array[foundAt].yesSwitchOffCases.split(',');
                }               
            } else {
                if (!commonHelper.isNullOrEmpty(array[foundAt].noSwitchOffCases)) {
                    switchOffUseCases = array[foundAt].noSwitchOffCases.split(',');
                }
            }                
                
            for (var idx = 0; idx < self.allUseCases.length; idx++) {
                if ($.inArray(self.allUseCases[idx].id.toString(), switchOffUseCases) !== -1) {
                    if (self.isUseCaseExists(self.allUseCases[idx], self.tailoredUseCases())) {
                        $("#useCaseLayer" + self.allUseCases[idx].id).removeClass("oj-sm-hide");
                        $("#useCase" + self.allUseCases[idx].id).addClass("pointer-events-none");
                        self.tailoredUseCases().splice(self.getIndex(self.tailoredUseCases(), self.allUseCases[idx].id), 1);
                    }
                }                   
            }
        };
        
        self.getIndex = function(arr, id) {
            for (var idx in arr) {
                var useCase = arr[idx];
                if (useCase.id === id) {
                    return idx;
                }
            }
            return null;
        };
        
        self.isUseCaseExists = function (useCase, useCaseArr) {
            for (var idx in useCaseArr) {
                if (useCaseArr[idx].id === useCase.id) {
                    return true;
                }
            }
            return false;
        };
        
        self.getDetails = function (data, event) {
            if (data.id) {
                self.selectedUseCaseDetails(data);
                self.areUseCaseDetailsFetched(true);
                oj.OffcanvasUtils.open(useCaseDrawerRight);
                $(window).scrollTop(0);
            }
        };

        self.closeIt = function () {
            oj.OffcanvasUtils.close(useCaseDrawerRight);
        };

        self.finishTailoring = function () {            
            showPreloader();
            
            var saveUserUseCasesSuccessCbFn = function (data, status) {
                hidePreloader();
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

            if (tailoredUseCases.length > 0) {
                var jsonData = {
                    "userUseCases": tailoredUseCases
                };
                service.saveUserUseCases(jsonData).then(saveUserUseCasesSuccessCbFn, saveUserUseCasesFailCbFn);
            } else {
                hidePreloader();
                router.go('dashboard/');
            }
        };
        
        self.goToDashboard = function() {
            router.go('dashboard/');
        };
        
        self.serviceOptionChange = function (event, data) {
            self.isServiceSelected(data.value.length > 0);
        };
        
        self.benefitOptionChange = function (event, data) {
            self.isBenefitSelected(typeof data.value[0] === 'number' || (data.value.length === 0 && typeof data.previousValue === 'object'));
        };

        self.onClickFeedback = function() {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        self.handleAttached = function () {
            showPreloader();       
            if (isCapturePhaseCompleted()) {      
                self.goToStartUseCasesStep();
            }

            oj.OffcanvasUtils.setupResponsive(useCaseDrawerRight);
            service.getAllUseCases().then(getAllUseCasesSuccessCbFn, getAllUseCasesFailCbFn);
            service.getAllServices().then(getAllServicesSuccessCbFn, getAllServicesFailCbFn);
            service.getUseCasesForUser().then(getUseCasesForUserSuccessCbFn, getUseCasesForUserFailCbFn);
        };
    }

    return useCasesDemoContentViewModel;
});
