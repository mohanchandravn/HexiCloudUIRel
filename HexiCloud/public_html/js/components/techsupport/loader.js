"use strict";
define(['ojs/ojcore', 'text!./techsupport.html', './techsupport','text!./techsupport.json','css!./techsupport', 'ojs/ojcomposite'],
        function (oj, view, viewModel,metadata) {
            "user-strict";
            oj.Composite.register('tech-support', {
                view: {inline: view},
                viewModel: {inline: viewModel},
                metadata: {inline: JSON.parse(metadata)}
            });

        });