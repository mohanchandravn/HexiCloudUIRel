/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCasesDemo module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojinputtext',
    'ojs/ojcheckboxset', 'ojs/ojradioset', 'ojs/ojswitch', 'ojs/ojselectcombobox'
], function (oj, $, ko, service) {
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
        self.selectedUseCaseItems = ko.observableArray([]);
        self.hasSelectedOtherUseCase = ko.observable(false);
        self.otherUseCaseServiceItems = ko.observableArray([]);
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
        self.areUseCaseDetailsFetched = ko.observable(true);
        self.selectedUseCaseDetails = ko.observableArray([]);
        
        self.agreement = ko.observable();
        
        self.otherUserCaseCount = ko.observable(0);
        
        self.useCaseItems = [];
        
        self.useCaseItemsTemplate = ko.pureComputed(function() {
            console.log(self.haveImplementedUseCases() === true ? 'useCaseItemsNonEditable' : 'useCaseItemsEditable');
            return self.haveImplementedUseCases() === true ? 'useCaseItemsNonEditable' : 'useCaseItemsEditable';
        });
        
        var useCaseItemsSuccessCbFn = function(data, status) {
            console.log(status);
            console.log(data);
            self.useCaseItems = data.useCases;
        };
        
        var useCaseItemsFailCbFn = function(xhr) {
            console.log(xhr);
        };
        
        var otherUseCaseServiceItemsSuccessCbFn = function(data, status) {
            self.otherUserCaseCount(self.otherUserCaseCount() + 1);
            console.log(status);
            console.log(data);
            self.otherUseCaseServiceItems(data.services);
            self.otherUseCases([{
                useCaseSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet eros a velit laoreet tristique accumsan sed libero.',
                useCaseServicesUsed: [self.otherUseCaseServiceItems()[0].label],
                useCaseBenefits: '',
                otherUserCaseCount: self.otherUserCaseCount()
            }]);
        };
        
        var otherUseCaseServiceItemsFailCbFn = function(xhr) {
            console.log(xhr);
        };
        
        var subQuestionsSuccessCbFn = function(data, status) {
            console.log(status);
            console.log(data);
            self.useCasesSubQuestions([]);
            var subQuestions = data.subQuestions;
            for (var idx = 0; idx < subQuestions.length; idx++) {
                if (idx === 0) {
                    self.useCasesSubQuestions.push({
                        "id": subQuestions[idx].id,
                        "title": subQuestions[idx].title,
                        "useCaseIds": subQuestions[idx].useCaseIds,
                        "status": "notStarted"
                    });
                } else {
                    self.useCasesSubQuestions.push({
                        "id": subQuestions[idx].id,
                        "title": subQuestions[idx].title,
                        "useCaseIds": subQuestions[idx].useCaseIds,
                        "status": null
                    });
                }
            }
            self.isSubQuestionSelected(true);
            self.selectedSubQuestion(self.useCasesSubQuestions()[0]);
        };
        
        var subQuestionsFailCbFn = function(xhr) {
            console.log(xhr);
        };
        
        var getUseCaseDetailsSuccessCbFn = function(data, status) {
            console.log(status);
            console.log(data);
            self.selectedUseCaseDetails(data);
        };
        
        var getUseCaseDetailsFailCbFn = function(xhr) {
            console.log(xhr);
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
        
        self.addOtherUseCase = function() {
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
        };
        
        self.toggleUseCaseSelections = function(data, event) {
            var id = event.currentTarget.id;
            if (id !== 'otherUseCase') {
                if (self.selectedUseCaseItems().indexOf(id) > -1) {
                    console.log('already added');
                    $("#" + id).removeClass("selected");
                    self.selectedUseCaseItems.remove(id);
                } else {
                    $("#" + id).addClass("selected");
                    self.selectedUseCaseItems().push(id);
                }
            } else {
                if (self.selectedUseCaseItems().indexOf(id) > -1) {
                    self.otherUseCases([]);
                    console.log('already added');
                    $("#otherUseCaseImg").removeClass("selected");
                    $("#" + id).removeClass("selected");
                    self.hasSelectedOtherUseCase(false);
                    self.selectedUseCaseItems.remove(id);                    
                } else {
                    console.log(self.otherUseCaseServiceItems());
                    self.otherUseCases([]);
                    self.otherUseCases([{
                        useCaseSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet eros a velit laoreet tristique accumsan sed libero.',
                        useCaseServicesUsed: [self.otherUseCaseServiceItems()[0].label],
                        useCaseBenefits: ''
                    }]);
                    $("#otherUseCaseImg").addClass("selected");
                    $("#" + id).addClass("selected");
                    self.hasSelectedOtherUseCase(true);
                    self.selectedUseCaseItems().push(id);
                }
            }
            console.log(self.selectedUseCaseItems());
        };
        
        self.moveToNextQuestion = function() {
            console.log(self.useCasesQuestions());
            
            var array = self.useCasesQuestions();
            self.useCasesQuestions([]);            
            for (var index = 0; index < array.length; index++) {
                if ( index <= (self.inQuestion() - 1) ) {
                    console.log(index);
                    array[index].status = "completed";
                    array[index + 1].status = "notStarted";
                }
            }            
            self.useCasesQuestions(array);
            if (self.inQuestion() === 3) {
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
                
                console.log(self.otherUseCases());
            }
        };
        
        self.goToStartUseCasesStep = function() {
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
        
        self.startTheUseCaseSelection = function(data, event) {
            for (var idx = 0; idx < self.useCasesQuestions().length; idx++) {
                if (self.useCasesQuestions()[idx].status === 'notStarted') {
                    self.inQuestion(idx + 1);
                }
            }
            if (self.inQuestion() === 4) {
//                self.haveImplementedUseCases(true);
                service.getUseCaseDemoSubQuestions(self.inQuestion()).then(subQuestionsSuccessCbFn, subQuestionsFailCbFn);
            }
        };
        
        self.moveToNextSubQuestion = function(data, event) {            
            var id = event.currentTarget.id;
            
            // for matching with yes/no button id's
            var hasSelectedYes = id.startsWith("Y");
            id = id.substring(1);
            var foundAt;
            var array = self.useCasesSubQuestions();
            self.useCasesSubQuestions([]);
            
            // to get the id of selected sub question
            for (var index = 0; index < array.length; index++) {
                if (id === array[index].id) {
                    foundAt = index;
                }
            }
            
            // for checking whether it's last sub question or not
            if ((foundAt + 1) < array.length ) {
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
            }
            
            if (hasSelectedYes) {
                // to highlight the selected use cases for the matched sub questions
                var useCases = array[foundAt].useCaseIds;
                selectedUseCases([]);
                $(".blur-selected-tile").removeClass("oj-sm-hide");
                $(".use-case-tile").addClass("pointer-events-none");
                for (var a = 0; a < useCases.length; a++) {
                    var tempObj;
                    for (var idx = 0; idx < self.useCaseItems.length; idx++) {
                        if (useCases[a].id === self.useCaseItems[idx].id) {
                            tempObj = {
                                id: self.useCaseItems[idx].id,
                                title: self.useCaseItems[idx].title,
                                description: self.useCaseItems[idx].description,
                                imgPath: self.useCaseItems[idx].imgPath
                            };
                        }
                    }
                    tempObj.subQuestionId = array[foundAt].id;
                    selectedUseCases.push(tempObj);
                    $("#useCaseLayer" + useCases[a].id).addClass("oj-sm-hide");
                    $("#useCase" + useCases[a].id).removeClass("pointer-events-none");
                }
            }
        };
        
        self.getDetails = function(data, event) {
            console.log(data);
            console.log(event);
            if (data.id === "88383") {
                oj.OffcanvasUtils.open(useCaseDrawerRight);
                service.getUseCaseDemoDetails(88383).then(getUseCaseDetailsSuccessCbFn, getUseCaseDetailsFailCbFn);
            }
        };
        
        self.closeIt = function() {
            oj.OffcanvasUtils.close(useCaseDrawerRight);
        };
        
        self.finishDemo = function() {
            if (selectedUseCases().length > 0) {
                useCasesSelected(true);
            } else {
                useCasesSelected(false);
            }
            console.log('Selected use cases are: ');
            console.log(selectedUseCases());
            router.go('dashboard/');
        };
        
        self.handleAttached = function() {
            oj.OffcanvasUtils.setupResponsive(useCaseDrawerRight);
            service.getDemoUseCaseItems().then(useCaseItemsSuccessCbFn, useCaseItemsFailCbFn);
            service.getotherUseCaseServiceItems().then(otherUseCaseServiceItemsSuccessCbFn, otherUseCaseServiceItemsFailCbFn);
        };
  }
    
    return useCasesDemoContentViewModel;
});
