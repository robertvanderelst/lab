(function ($) {
    "use strict";

    // Declare variables
    var has_classes = '', el = '', selected_file = '', type = '', optgroup_index = 1, selected_class = '', index = '', index_nr = '', select_open = false; 
    $.proforma = {
        // Options to be determined
        options: {
            prefix: 'pf-',
            checkboxClass: 'checkbox',
            radioClass: 'radio',
            checkedClass: 'checked',
            selectClass:   'select',
            selectedClass:   'selected',
            selectOptgroupClass: 'select-optgroup',
            selectMainitemClass: 'select-mainitem',
            selectSubitemClass: 'select-subitem',
            multipleClass:   'multiple',
            fileValueClass: 'file_value',
            fileValueDefaultText: 'No file selected',
            fileButtonClass: 'file_select',
            fileButtonText: 'Choose File'
        },
        elements: []
    };

    // Start plugin
    $.fn.proforma = function (options) {
        options = $.extend($.proforma.options, options);

        // Click outside select will hide select
        $("html").on('click', function () {
            if (select_open === true) {
                $("." + options.prefix + options.selectClass + " > ul").css({'visibility': 'hidden'})
				select_open = false;
            }
        });
        
		// Init: define type for select and textarea
        function init(el) {
            if (el[0].tagName === 'SELECT') { type = 'select'; }
            if (el[0].tagName === 'TEXTAREA') { type = 'textarea'; }
        }

        // Set File Element value
        function setFileValue(el, val) {
            val = val.substring(val.lastIndexOf('\\') + 1, val.length);
            val = val.substring(val.lastIndexOf('/') + 1, val.length);
            el.parent().find("." + options.prefix + options.fileValueClass).text(val);
        }

        // Set Select value
        function setSelectValue(el, index) {
            el.find('option')[index].selected = "selected";
            el.next().find('> span').html(el.find('option')[index].label);
            el.next().find('> ul').css({'visibility': 'hidden'});
        }

        // Replace field with other HTML elements
        function replaceField(el, type) {
            // Hide field outside viewport
            if (!(/^text|textarea$/.test(type))) {
                $(el).css({"display": "none", "visibility": "hidden"});
            }

            switch (type) {
            case 'checkbox':
            case 'radio':
				// Replace
				has_classes = options.prefix + options[type + 'Class'];
                if (el.prop('checked')) {
                    has_classes = has_classes + ' ' + options.checkedClass;
                }

                $(el).after('<span class="' + has_classes + '" rel="' + el.attr('name') + '"></span>');

				// Event handler
				el.parent().on('click', function () {
                    if (type === 'radio') {
                        $("input[name='" + el.prop('name') + "']").each(function () {
                            $(this).next().removeClass(options.checkedClass);
                        });
                    }

					if ($(this).find('input').prop('checked')) {
						$(this).find('span').addClass(options.checkedClass);
					} else {
						$(this).find('span').removeClass(options.checkedClass);
					}
				});
                break;

            case 'select':
                // Replace
				if ($(el).children().size() > 0) {
					$(el).after('<span class="' + options.prefix + options.selectClass + '"><span></span><ul></ul></span>');
					$(el).children().each(function () {
						if ($(this)[0].tagName === 'OPTGROUP' && $(this).children().size() > 0) {
                            $(this).parents().find("." + options.prefix + options.selectClass + " > ul").append('<li class="' + options.prefix + options.selectOptgroupClass + '" rel="optgroup-' + optgroup_index + '"><span>' +  $(this).attr('label') + '</span><ul></ul></li>');

							$(this).children().each(function () {
                                selected_class = '';
                                if ($(this).prop('selected')) {
                                    selected_class = ' class="' + options.selectedClass + '"';
                                }

								$("." + options.prefix + options.selectClass + " > ul").find('li[rel="optgroup-' + optgroup_index + '"] > ul').append('<li class="' + options.prefix + options.selectSubitemClass + '"><a href="#"' + selected_class + ' rel="index-' + $(this)[0].index + '">' + $(this).text() + '</a></li>');
							});

                            optgroup_index += 1;
						} else {
                            selected_class = '';
                            if ($(this).prop('selected')) {
                                selected_class = ' class="' + options.selectedClass + '"';
                            }

                            if ($(this)[0].index === 0) {
                                $(this).parents().find("." + options.prefix + options.selectClass + " > span").text($(this)[0].label);
                            } else {
                                $(this).parents().find("." + options.prefix + options.selectClass + " > ul").append('<li class="' + options.prefix + options.selectMainitemClass + '"><a href="#"' + selected_class + ' rel="index-' + $(this)[0].index + '">' + $(this).text() + '</a></li>');
                            }
						}
					});
				}

                // Event handler
                $("." + options.prefix + options.selectClass + " > span").on('click', function (e) {
                    select_open = true;
					e.stopPropagation();
                    $(this).next().css({'visibility': 'visible'});
                });

                $("." + options.prefix + options.selectClass).find('a').on('click', function (e) {
                    e.preventDefault();
                    $("." + options.prefix + options.selectClass + " a").each(function () {
                        $(this).removeClass(options.selectedClass);
                    });
                    $(this).addClass(options.selectedClass);
                    index_nr = $(this).prop('rel');
                    index_nr = index_nr.substring(index_nr.lastIndexOf('-') + 1, index_nr.length);
                    setSelectValue(el, index_nr);
                });
                break;

            case 'file':
				// Replace
				$(el).after('<div class="file"><div class="' + options.prefix + options.fileValueClass + '">' + options.fileValueDefaultText + '</div><a href="#select" class="' + options.prefix + options.fileButtonClass + '">' + options.fileButtonText + '</a></div>');

				// Event handler
				$(el).next().find('a.' + options.prefix + options.fileButtonClass).on('click', function () {
					$(el).trigger('click');

					selected_file = $(el).val(); // IE
					if (selected_file.length > 0) {
						setFileValue(el, selected_file);
					} else { // FF, Chrome
						$(el).on('change', function () {
							setFileValue(el, $(el).val());
						});
					}
				});
                break;
            }
        }

        // Call it!
        return this.each(function () {
            el = $(this);
            type = el.attr("type");
            init(el);
            replaceField(el, type);
        });
    };
})(jQuery);