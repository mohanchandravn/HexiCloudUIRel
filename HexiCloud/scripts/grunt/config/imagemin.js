/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = {
    dist: {
        options: {
            optimizationLevel: 5
        },
        files: [{
                expand: true,
                cwd: 'public_html/css/img',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'web/css/img'
            }]
    }
};