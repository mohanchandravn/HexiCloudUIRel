define(['ojs/ojcore', 'text!./trainnavigation.html', './trainnavigation','text!./trainnavigation.json','css!./trainnavigation', 'ojs/ojcomposite'],
        function (oj, view, viewModel,metadata) {
            "user-strict";
            oj.Composite.register('train-navigation', {
                view: {inline: view},
                viewModel: {inline: viewModel},
                metadata: {inline: JSON.parse(metadata)}
            });

        });