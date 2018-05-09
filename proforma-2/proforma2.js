/*jslint
    browser: true
*/

/*global
    $, jQuery
*/

(function () {
    "use strict";

    var selected_file = '', el = '';

    function setFileValue(el, val) {
        val = val.substring(val.lastIndexOf('\\') + 1, val.length);
        val = val.substring(val.lastIndexOf('/') + 1, val.length);
        el.next().find('.styled-file-value').text(val);
    }

    $(document).ready(function () {
        $('body').addClass('has-js');

        $('.styled-file-button').text('Choose file');

        $('.styled-file input[type="file"]').on('touchstart click', function (e) {
            e.stopPropagation();
            selected_file = $(this).val(); // IE

            if (selected_file.length > 0) {
                setFileValue(el, selected_file);
            } else { // FF, Chrome
                $(this).on('change', function () {
                    setFileValue($(this), $(this).val());
                });
            }
        });
    });
}());
