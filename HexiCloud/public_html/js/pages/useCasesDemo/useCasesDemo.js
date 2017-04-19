/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * useCases module
 */
define(['knockout', 'jquery', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojmasonrylayout'
], function (ko) {
    /**
     * The view model for the main content view template
     */
    function useCasesContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        console.log('useCasesDemo page');
        
        self.useCasesQuestionsCount = ko.observableArray([1, 2, 3, 4, 5, 6, 7]);
        self.useCaseItems = [
            { title: 'Apps Unlimited',
              description: 'Lorem ipsum dolor sit amet',
              imgPath: 'css/img/Asset 5.png',
              sizeClass: 'oj-masonrylayout-tile-1x1' },
            { title: 'Lift-and-Shift',
              description: 'Lorem ipsum dolor sit amet',
              imgPath: 'css/img/Asset 6.png',
              sizeClass: 'oj-masonrylayout-tile-1x1' },
            { title: 'Non-Oracle Workloads',
              description: 'Lorem ipsum dolor sit amet',
              imgPath: 'css/img/Asset 7.png',
              sizeClass: 'oj-masonrylayout-tile-1x1' },
            { title: 'Backup',
              description: 'Lorem ipsum dolor sit amet',
              imgPath: 'css/img/Asset 8.png',
              sizeClass: 'oj-masonrylayout-tile-1x1' },
            { title: 'Disaster Recovery',
              description: 'Lorem ipsum dolor sit amet',
              imgPath: 'css/img/Asset 9.png',
              sizeClass: 'oj-masonrylayout-tile-1x1' }
        ];
        
//        self.useCaseItems = [
//            { title: 'Apps Unlimited',
//              description: 'Lorem ipsum dolor sit amet',
//              imgPath: 'css/img/Asset 5.png',
//              sizeClass: 'oj-masonrylayout-tile-1x1' },
//            { title: 'Lift-and-Shift',
//              description: 'Lorem ipsum dolor sit amet',
//              imgPath: 'css/img/Asset 5.png',
//              sizeClass: 'oj-masonrylayout-tile-1x1' },
//            { title: 'Non-Oracle Workloads',
//              description: 'Lorem ipsum dolor sit amet',
//              imgPath: 'css/img/Asset 5.png',
//              sizeClass: 'oj-masonrylayout-tile-1x1' },
//            { title: 'Backup',
//              description: 'Lorem ipsum dolor sit amet',
//              imgPath: 'css/img/Asset 5.png',
//              sizeClass: 'oj-masonrylayout-tile-1x1' },
//            { title: 'Disaster Recovery',
//              description: 'Lorem ipsum dolor sit amet',
//              imgPath: 'css/img/Asset 5.png',
//              sizeClass: 'oj-masonrylayout-tile-1x1' }
//        ];
  }
    
    return useCasesContentViewModel;
});
