/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * breadcrumb module
 */
define(['text!./breadcrumb.html', 'ojs/ojcore'
], function (template) {
    
    /**
     * The view model for the main content view template
     */
    function breadcrumbContentViewModel(params) {
        
        var self = this;
        
        self.breadcrumbs = params.breadcrumbs;
        
        var router = params.parentParams.ojRouter.parentRouter;
        
        self.onBreadcrumbSelection = function(data, event) {
            router.go(data.id);
        };
    }

    return {viewModel: breadcrumbContentViewModel, template: template};
});
