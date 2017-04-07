/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * header module
 */
define(['text!./header.html', 'ojs/ojcore', 'knockout'
], function (template) {
    /**
     * The view model for the main content view template
     */
    function headerContentViewModel() { }
    
    return {viewModel: headerContentViewModel, template: template};
});
