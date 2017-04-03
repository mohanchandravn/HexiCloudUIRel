/**
 * Copyright © 2016, Oracle and/or its affiliates. All rights reserved.
 */

/**
 * Singleton with all common helper methods
 */
define([
], function () {
    'use strict';

    function CommonHelper() {

        var self = this;

        self.phoneRegExpPattern = '^[0-9]+$';        
    }

    return new CommonHelper();
});
