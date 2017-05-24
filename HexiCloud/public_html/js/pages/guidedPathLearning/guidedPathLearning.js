/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * guidedPathLearning module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'util/errorhandler', 'pdfjs-dist/build/pdf', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojknockout', 'ojs/ojprogressbar'
], function (oj, $, ko, service, errorHandler, pdfjs) {

    /**
     * The view model for the main content view template
     */
    function guidedPathLearningViewModel(params) {

        var self = this;
        var router = params.ojRouter.parentRouter;
                
        self.selectedUseCase = params.rootData.selectedUseCase;
        self.areGuidedPathSectionsLoaded = ko.observable(false);
        self.selectedPathId = ko.observable();
        self.selectedPathLabel = ko.observable('');
        self.lastSubSectionToRead = ko.observable(false);
        self.nextButtonLabel = ko.observable("Next");
        self.selectedGuidedPathSection = ko.observable();
        self.selectedGuidedPathSubSection = ko.observable();
        
        if (params.rootData.selectedGuidedPathSection) {
            self.selectedGuidedPathSection(params.rootData.selectedGuidedPathSection);
        }
        if (params.rootData.selectedPathId) {
            self.selectedPathId(params.rootData.selectedPathId);
        }
        if (params.rootData.selectedPathLabel) {
            self.selectedPathLabel(params.rootData.selectedPathLabel);
        }

        self.lastSubSectionToRead(params.rootData.lastSubSectionToRead);

        if (self.lastSubSectionToRead()) {
            self.nextButtonLabel("Finish");
        }
        
        self.breadCrumbs = ko.observableArray([{id: 'useCaseDiscovery', label: self.selectedUseCase.title}, 
                                               {id: 'guidedPathDetails', label: self.selectedPathLabel()},
                                               {id: 'guidedPathLearning', label: self.selectedGuidedPathSection().description}]);

        // The workerSrc property shall be specified.
        pdfjs.PDFJS.workerSrc = 'pdfjs-1.7.225/build/pdf.worker.js';

        self.pdfDoc = ko.observable();
        self.pageNum = ko.observable(1);
        self.pageRendering = ko.observable(false);
        self.pageNumPending = ko.observable(null);
        self.scale = ko.observable(1);
        self.canvas = ko.observable();
        self.ctx = ko.observable();

        self.getSelectedGuidedPathSection = function () {
            var sectionDocs = self.selectedGuidedPathSection().sectionDocs;
            for (var idx = 0; idx < sectionDocs.length; idx++) {
                if (sectionDocs[idx].sectionDocId === self.selectedGuidedPathSection().selectedSectionDocId) {
                    self.selectedGuidedPathSubSection(sectionDocs[idx]);
                    self.areGuidedPathSectionsLoaded(true);

                    // Load the PDF document
                    if (self.selectedGuidedPathSubSection().docType === "PDF") {
                        getPDFDoc(self.selectedGuidedPathSubSection().publicLink, self.selectedGuidedPathSubSection().pageNumber, self.selectedGuidedPathSubSection().status);
                    } else {
                        hidePreloader();
                    }
                    return;
                }
            }
        };

        function getPDFDoc(docURL, curPageNumber, status) {
            
            self.canvas(document.getElementById('the-canvas')), self.ctx(self.canvas().getContext('2d'));
            if (self.pageNum() == 1) {
                $('#prev').removeClass('prevEnabled');
                $('#prev').addClass('prevDisabled');
            }

            if (self.scale() <= 1) {
                document.getElementById('zoomOut').disabled = true;
            }

            /**
             * Asynchronously downloads PDF.
             */
            docURL = 'https://cors-anywhere.herokuapp.com/' + docURL; // CORS proxy
            pdfjs.PDFJS.getDocument(docURL).then(function (pdfDoc_) {
                self.pdfDoc(pdfDoc_);
                document.getElementById('page_count').textContent = self.pdfDoc().numPages;
//                if (status !== null && curPageNumber !== 0) {
//                    if (status === 'I') {
//                        self.onGoToPage(curPageNumber);
//                    }
//                } else {
//                    // Initial/first page rendering
//                    renderPage(self.pageNum());
//                }
                self.onGoToPage(curPageNumber);
            });
            
        }

        /**
         * Get page info from document, resize canvas accordingly, and render page.
         * @param num Page number.
         */
        function renderPage(num) {
            if (self.pdfDoc() !== undefined) {
                self.pageRendering(true);
                // Using promise to fetch the page
                self.pdfDoc().getPage(num).then(function (page) {
                    var viewport = page.getViewport(self.scale());
                    self.canvas().height = viewport.height;
                    self.canvas().width = viewport.width;

                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: self.ctx(),
                        viewport: viewport
                    };
                    var renderTask = page.render(renderContext);

                    // Wait for rendering to finish
                    renderTask.promise.then(function () {
                        self.pageRendering(false);
                        if (self.pageNumPending() !== null) {
                            // New page rendering is pending
                            renderPage(self.pageNumPending());
                            self.pageNumPending(null);
                        }
                    });
                });

                // Update page counters
                document.getElementById('page_num').textContent = self.pageNum();
                $('.hide-on-doc-load').removeClass('display-none');
                hidePreloader();
            }
        }

        /**
         * If another page rendering in progress, waits until the rendering is
         * finised. Otherwise, executes rendering immediately.
         */
        function queueRenderPage(num) {
            if (self.pageRendering()) {
                self.pageNumPending(num);
            } else {
                renderPage(num);
                self.updateLearning(num, 'I');
            }
        }

        /**
         * Displays previous page.
         */
        self.onPrevPage = function () {
            if (self.pdfDoc() === undefined || self.pageNum() <= 1) {
                return;
            }
            self.pageNum(self.pageNum() - 1);

            if (self.pageNum() <= 1) {
                $('#prev').removeClass('prevEnabled');
                $('#prev').addClass('prevDisabled');
                $('#next').removeClass('nextDisabled');
                $('#next').addClass('nextEnabled');
                $('#nextArrowCont').removeClass('nextHidden');
                $('#nextButtonCont').addClass('nextHidden');
            } else {
                $('#prev').removeClass('prevDisabled');
                $('#prev').addClass('prevEnabled');
                $('#next').removeClass('nextDisabled');
                $('#next').addClass('nextEnabled');
                $('#nextArrowCont').removeClass('nextHidden');
                $('#nextButtonCont').addClass('nextHidden');
            }

            queueRenderPage(self.pageNum());
        };

        /**
         * Displays next page.
         */
        self.onNextPage = function () {
            if (self.pdfDoc() === undefined || self.pageNum() >= self.pdfDoc().numPages) {
                return;
            }
            self.pageNum(self.pageNum() + 1);

            if (self.pageNum() >= self.pdfDoc().numPages) {
                $('#next').removeClass('nextEnabled');
                $('#next').addClass('nextDisabled');
                $('#prev').removeClass('prevDisabled');
                $('#prev').addClass('prevEnabled');
                $('#nextArrowCont').addClass('nextHidden');
                $('#nextButtonCont').removeClass('nextHidden');
            } else {
                $('#prev').removeClass('prevDisabled');
                $('#prev').addClass('prevEnabled');
                $('#next').removeClass('nextDisabled');
                $('#next').addClass('nextEnabled');
                $('#nextArrowCont').removeClass('nextHidden');
                $('#nextButtonCont').addClass('nextHidden');
            }

            queueRenderPage(self.pageNum());
        };

        self.onGoToPage = function (num) {
//            var pageNo = parseInt(document.getElementById('goToPageNo').value);
            self.pageNum((isNaN(num) || num === 0) ? 1 : num);

            if (self.pageNum() < 2) {
                $('#prev').removeClass('prevEnabled');
                $('#prev').addClass('prevDisabled');
                $('#next').removeClass('nextDisabled');
                $('#next').addClass('nextEnabled');
                $('#nextArrowCont').removeClass('nextHidden');
                $('#nextButtonCont').addClass('nextHidden');
            } else if (self.pageNum() >= self.pdfDoc().numPages) {
                $('#prev').removeClass('prevDisabled');
                $('#prev').addClass('prevEnabled');
                $('#nextArrowCont').addClass('nextHidden');
                $('#nextButtonCont').removeClass('nextHidden');
                $('#next').removeClass('nextEnabled');
                $('#next').addClass('nextDisabled');
            } else {
                $('#prev').removeClass('prevDisabled');
                $('#prev').addClass('prevEnabled');
                $('#next').removeClass('nextDisabled');
                $('#next').addClass('nextEnabled');
                $('#nextArrowCont').removeClass('nextHidden');
                $('#nextButtonCont').addClass('nextHidden');
            }

            renderPage(self.pageNum());
        };

        self.zoomIn = function () {
            if (self.scale() < 3) {
                self.scale(self.scale() + 0.5);
                renderPage(self.pageNum());
                if (self.scale() < 3) {
                    document.getElementById('zoomIn').disabled = false;
                    document.getElementById('zoomOut').disabled = false;
                } else {
                    document.getElementById('zoomIn').disabled = true;
                    document.getElementById('zoomOut').disabled = false;
                }
            }
        };

        self.zoomOut = function () {
            if (self.scale() > 1) {
                self.scale(self.scale() - 0.5);
                renderPage(self.pageNum());
                if (self.scale() > 1) {
                    document.getElementById('zoomOut').disabled = false;
                    document.getElementById('zoomIn').disabled = false;
                } else {
                    document.getElementById('zoomOut').disabled = true;
                    document.getElementById('zoomIn').disabled = false;
                }
            }
        };

        self.getTimeToCompleteByDocType = function (docType, timeToComplete) {
            if (docType === "PDF") {
                return timeToComplete + " read";
            } else if (docType === "VIDEO") {
                return timeToComplete;
            }
        };

        self.onClickFeedback = function () {
            if (selectedTemplate() === "") {
                selectedTemplate('email_content');
            }
            $("#tech_support").slideToggle();
        };
        
        self.updateLearning = function (num, docStatus) {
            var updateLearningHistorySuccessCbFn = function (data, status) {
                hidePreloader();
            };

            var updateLearningHistoryFailCbFn = function (xhr) {
                hidePreloader();
                console.log(xhr);
                errorHandler.showAppError("ERROR_GENERIC", xhr);
            };

            var jsonData = {
                "learningUpdate": {
                    "pathId": self.selectedPathId(),
                    "sectionID": self.selectedGuidedPathSection().sectionID,
                    "sectionDocId": self.selectedGuidedPathSubSection().sectionDocId,
                    "pageNumber": num,
                    "status": docStatus
                }
            };
            service.updateLearningHistory(jsonData).then(updateLearningHistorySuccessCbFn, updateLearningHistoryFailCbFn);
        };

        self.completeSubSection = function () {
            self.updateLearning(self.pageNum(), 'C');
            if (self.lastSubSectionToRead()) {
                params.rootData.selectedGuidedPathId = self.selectedPathId();
                router.go('guidedPathDetails');
            } else {
                var sectionDocs = self.selectedGuidedPathSection().sectionDocs;
                var curDisplayOrder = self.selectedGuidedPathSubSection().docOrder;
                var nextDocFound = false;
                for (var idx = 0; idx < sectionDocs.length; idx++) {
                    if (sectionDocs[idx].docOrder === curDisplayOrder) {
                        self.selectedGuidedPathSection().sectionDocs[idx].status = 'C';
                    }
                    if (sectionDocs[idx].docOrder > curDisplayOrder && sectionDocs[idx].status !== 'C') {
                        self.selectedGuidedPathSubSection(sectionDocs[idx]);
                        nextDocFound = true;
                        break;
                    }
                }
                var curDocId = self.selectedGuidedPathSubSection().sectionDocId;
                var foundInCompleteDoc = false;
                for (var idx = 0; idx < sectionDocs.length; idx++) {
                    if (sectionDocs[idx].sectionDocId !== curDocId && sectionDocs[idx].status !== 'C') {
                        self.lastSubSectionToRead(false);
                        self.nextButtonLabel("Next");
                        foundInCompleteDoc = true;
                        break;
                    }
                }

                if (nextDocFound) {
                    $('.hide-on-doc-load').addClass('display-none');
                    showPreloader();
                    if (!foundInCompleteDoc) {
                        self.lastSubSectionToRead(true);
                        self.nextButtonLabel("Finish");
                    }
                    // Load the PDF document
                    if (self.selectedGuidedPathSubSection().docType === "PDF") {
                        getPDFDoc(self.selectedGuidedPathSubSection().publicLink, self.selectedGuidedPathSubSection().pageNumber, self.selectedGuidedPathSubSection().status);
                    } else {
                        hidePreloader();
                    }

                } else {
                    params.rootData.selectedGuidedPathId = self.selectedPathId();
                    router.go('guidedPathDetails');
                }
            }
        };
        
        self.onBreadCrumbSelection = function(data, event) {
            params.rootData.selectedUseCase = self.selectedUseCase;
            if (data.id === 'guidedPathDetails') {
                params.rootData.selectedGuidedPathId = self.selectedPathId();
            }
            router.go(data.id);
        };

        self.handleAttached = function () {
            showPreloader();
            self.getSelectedGuidedPathSection();
        };
    }

    return guidedPathLearningViewModel;
});
