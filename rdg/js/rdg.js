(function () {
    "use strict";

    function QS(el) {
        return document.querySelector(el);
    }

    function QSA(el) {
        return document.querySelectorAll(el);
    }

    var components = {
        myrietveld: function (el) {
            [].forEach.call(el.querySelectorAll('button'), function (anchor) {
                anchor.addEventListener('click', function (e) {
                    if (!this.classList.contains('u-button-added')) {
                        this.classList.add('u-button-added');
                    } else {
                        this.classList.remove('u-button-added');
                    }
                });
            });
        },

        navigation: function(el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                el.parentNode.classList.toggle('u-nav-visible');
            });

            [].forEach.call(el.parentNode.querySelectorAll('a'), function (anchor) {
                anchor.addEventListener('click', function (e) {
                    anchor.closest('header').classList.remove('u-nav-visible');
                });
            });
        },
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Check for components
        var componentList = QSA('[data-component]');

        // Run functions/methods
        [].forEach.call(componentList, function (component) {
            if(component.dataset.component) {
                components[component.dataset.component](component);
            } else {
                console.log(components.dataset.component + ' does not exist');
            }
        });
    });
})();
