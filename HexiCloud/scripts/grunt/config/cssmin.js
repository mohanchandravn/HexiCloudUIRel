/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = {

//        target: {
//            files: [{
//                    expand: true,
//                    cwd: 'web/css',
//                    src: ['hc-*.css', '!*.min.css'],
//                    dest: 'web/css',
//                    ext: '.min.css'
//                }]
//        }

dist: {
//      options: {
//         banner: '/*! MyLib.js 1.0.0 | Aurelio De Rosa (@AurelioDeRosa) | MIT Licensed */'
//      },
      files: {
         'web/css/style.min.css': ['web/css/**/hc-*.css']
      }
  }


};