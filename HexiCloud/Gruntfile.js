/**
 Copyright (c) 2015, 2017, Oracle and/or its affiliates.
 The Universal Permissive License (UPL), Version 1.0
 */
'use strict';

var path = require('path');

module.exports = function (grunt) {

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'scripts/grunt/config')
    });

    grunt.loadNpmTasks("grunt-oraclejet");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
//    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask("build", "Public task. Calls oraclejet-build to build the oraclejet application. Can be customized with additional build tasks.", function (buildType) {
        grunt.task.run([`oraclejet-build:${buildType}`]);
        grunt.task.run([`cssmin`]);
//        grunt.task.run([`imagemin`]);
        grunt.task.run([`processhtml`]);
        grunt.task.run([`war`]);
    });

    grunt.registerTask("serve", "Public task. Calls oraclejet-serve to serve the oraclejet application. Can be customized with additional serve tasks.", function (buildType) {
        grunt.task.run([`oraclejet-serve:${buildType}`]);
    });
};

