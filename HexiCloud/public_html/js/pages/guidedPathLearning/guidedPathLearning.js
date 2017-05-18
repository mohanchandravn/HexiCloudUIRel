/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * guidedPathLearning module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'pdfjs-dist/build/pdf', 'config/serviceConfig', 'util/errorhandler', 'ojs/ojknockout', 'ojs/ojprogressbar'
], function (oj, $, ko, pdfjs) {

    /**
     * The view model for the main content view template
     */
    function guidedPathLearningViewModel(params) {

        var self = this;
        var router = params.ojRouter.parentRouter;

        self.areGuidedPathSectionsLoaded = ko.observable(false);
        self.selectedGuidedPathSection = ko.observable();
        self.selectedGuidedPathSubSection = ko.observable();
        if (params.rootData.selectedGuidedPathSection) {
            self.selectedGuidedPathSection(params.rootData.selectedGuidedPathSection);
        }

        // The workerSrc property shall be specified.
        pdfjs.PDFJS.workerSrc = 'pdfjs-1.7.225/build/pdf.worker.js';

        self.pdfDoc = ko.observable();
        self.pageNum = ko.observable(1);
        self.pageRendering = ko.observable(false);
        self.pageNumPending = ko.observable(null);
        self.scale = ko.observable(1.8);
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
                        getPDFDoc(self.selectedGuidedPathSubSection().publicLink);
                    }
                    return;
                }
            }
        };

        function getPDFDoc(docURL) {
            self.canvas(document.getElementById('the-canvas')),
                    self.ctx(self.canvas().getContext('2d'));

            // document.getElementById('prev').addEventListener('click', self.onPrevPage());
            // document.getElementById('next').addEventListener('click', self.onNextPage());

            if (self.pageNum() == 1) {
                document.getElementById('prev').disabled = true;
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

                console.log('Total no of pages: ' + self.pdfDoc().numPages);

                // Initial/first page rendering
                renderPage(self.pageNum());
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
                document.getElementById('prev').disabled = true;
                document.getElementById('next').disabled = false;
            } else {
                document.getElementById('prev').disabled = false;
                document.getElementById('next').disabled = false;
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
                document.getElementById('next').disabled = true;
                document.getElementById('prev').disabled = false;
            } else {
                document.getElementById('next').disabled = false;
                document.getElementById('prev').disabled = false;
            }

            queueRenderPage(self.pageNum());
        };

        self.onGoToPage = function () {
            var pageNo = parseInt(document.getElementById('goToPageNo').value);
            self.pageNum(isNaN(pageNo) ? 1 : pageNo);

            if (self.pageNum() < 2) {
                document.getElementById('prev').disabled = true;
                document.getElementById('next').disabled = false;
            } else if (self.pageNum() >= self.pdfDoc().numPages) {
                document.getElementById('next').disabled = true;
                document.getElementById('prev').disabled = false;
            } else {
                document.getElementById('prev').disabled = false;
                document.getElementById('next').disabled = false;
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

        self.handleAttached = function () {
            self.getSelectedGuidedPathSection();
        };
    }

    return guidedPathLearningViewModel;
});
