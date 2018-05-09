/*
PROFORMA 2.0

Author: Robert van der Elst
Copyright © 2014-2015

URL: http://www.github.com/robertvanderelst/proforma
Demo: http://lab.robertvanderelst.nl/proforma

*/

/*jslint browser: true*/
/*global $, document, navigator*/

(function () {
  "use strict";

  // Declare variables
  var el, el_current, type, has_classes, selectsubstitute, selected_file, selectInitialValue, optioncounter, optionclasses, selectedOption, currentList, currentListItems, currentItem, isMobileDevice = navigator.userAgent.match(/Mobi/i);

  $.proforma = {
    // Options
    options: {
      checkboxClass       : 'checkbox',
      checkedClass        : 'checked',
      desktopClass        : 'is-desktop',
      fileClass           : 'file',
      fileButtonClass     : 'file-button',
      fileButtonText      : 'Choose File',
      fileValueClass      : 'file-value',
      fileValueDefaultText: 'No file selected',
      optGroupClass       : 'optgroup',
      pluginClass         : 'proforma',
      prefix              : 'pf-',
      radioClass          : 'radio',
      selectedClass       : 'selected',
      selectClass         : 'select',
      selectValueClass    : 'select-value',
      visibleClass        : 'visible'
    },
    elements: []
  };

  // Start plugin
  $.fn.proforma = function (options) {
    options = $.extend($.proforma.options, options);

    // get types for select and textarea
    function getElementType(el) {
      type = el.attr("type");

      if (type === undefined) {
        // Select
        if (el[0].tagName === 'SELECT') { type = 'select'; }

        // Textarea
        if (el[0].tagName === 'TEXTAREA') { type = 'textarea'; }
      }

      return type;
    }

    // Set hover class on desired element
    function setHover(el, el_hover) {
      el.on('mouseover', function () {
        el_hover.addClass('hover');
      }).on('mouseout', function () {
        el_hover.removeClass('hover');
      });
    }

    // Set focus class on desired element
    function setFocus(el, el_focus) {
      el.on('focus', function () {
        el_focus.addClass('focus');
      }).on('blur', function () {
        el_focus.removeClass('focus');
      });

      el.focus();
    }

    // Set File Element value
    function setFileValue(el, val) {
      val = val.substring(val.lastIndexOf('\\') + 1, val.length);
      val = val.substring(val.lastIndexOf('/') + 1, val.length);
      el.parent().find("." + options.prefix + options.fileValueClass).text(val);
    }

    // Show options list above or below the element
    function showOptionsList(el) {
      if (el.parent().offset().top + el.parent().height() + el.next().height() >= $(document).height()) {
        el.next().addClass('reverse');
      }

      el.next().addClass(options.prefix + options.visibleClass);
    }

    function hideOptionsList(el) {
      el.next().removeClass('reverse');
      el.next().removeClass(options.prefix + options.visibleClass);
    }

    // Set Select value
    function setSelectValue(el, index) {
      el.find('option').each(function () {
        $(this).attr("selected", false);
      });
      el.find('option').eq(index).attr("selected", true);
    }

    // Replace field with other HTML elements
    function init(el, type) {
      // If el has parent with generic plugin class, don't do anything, otherwise do it!
      if (!el.parents('span').hasClass(options.pluginClass)) {
        switch (type) {

        case 'checkbox':
        case 'radio':
          // Wrap + add necessary classes
          has_classes = options.pluginClass + ' ' + options.prefix + options[type + 'Class'];
          if (el.prop('checked')) {
            has_classes = has_classes + ' ' + options.checkedClass;
          }

          el.wrap('<span class="' + has_classes + '"></span>');

          // EVENTS

          // Hover
          setHover(el, el.parent());

          // Focus
          setFocus(el, el.parent());

          // Click
          el.on('touchstart click', function (e) {
            e.stopPropagation();
            if (type === 'radio') {
              $("input[name='" + $(this).prop('name') + "']").each(function () {
                $(this).parent().removeClass(options.checkedClass);
              });
            }

            if ($(this).prop('checked')) {
              $(this).parent().addClass(options.checkedClass);
            } else {
              $(this).parent().removeClass(options.checkedClass);
            }
          });

          break;

        case 'file':
          // Wrap + add necessary classes
          has_classes = options.pluginClass + ' ' + options.prefix + options[type + 'Class'];
          el.wrap('<span class="' + has_classes + '"></span>');
          el.before('<span class="' + options.prefix + options.fileValueClass + '">' + options.fileValueDefaultText + '</span><span class=' + options.prefix + options.fileButtonClass + '>' + options.fileButtonText + '</span>');

          // EVENTS

          // Hover
          setHover(el, el.parent());

          // Focus
          setFocus(el, el.parent());

          // Click
          el.on('touchstart click', function (e) {
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

          break;

        // Rebuild of select
        case 'select':
          // If select has options and is not a multiple select
          if (el.children().length > 0 && !el.attr('multiple')) {

            // Find select value
            selectInitialValue = el.find('option').eq(el.prop('selectedIndex')).text();

            // Wrap select with container elements and element to hold value
            has_classes = options.pluginClass + ' ' + options.prefix + options[type + 'Class'];
            el.wrap('<span class="' + has_classes + '" />');
            el.parent().prepend('<span class="' + options.prefix + options.selectValueClass + '">' + selectInitialValue + '</span>');

            if (!isMobileDevice) {
              optioncounter = 0;

              // Desktop 
              el.addClass(options.prefix + options.desktopClass);

              // Build options list
              selectsubstitute = $('<ul class="options-list" />');
              el.children().each(function () {
                optionclasses = '';
                if ($(this)[0].tagName === 'OPTGROUP') {
                  selectsubstitute.append('<li class="' + options.prefix + options.optGroupClass + '"><span>' + $(this).attr('label') + '</span><ul></ul></li>');

                  $(this).children('option').each(function () {
                    optionclasses = '';

                    if ($(this).attr('selected')) {
                      selectInitialValue = $(this).text();
                      optionclasses = ' class="' + options.prefix + options.selectedClass + '"';
                    }
                    selectsubstitute.find('li:last-child ul').append('<li' + optionclasses + '><a href="#" data-option="' + optioncounter + '">' + $(this).text() + '</a></li>');

                    optioncounter += 1;
                  });
                } else {
                  if ($(this).attr('selected')) {
                    selectInitialValue = $(this).text();
                    optionclasses = ' class="' + options.prefix + options.selectedClass + '"';
                  }

                  selectsubstitute.append('<li' + optionclasses + '><a href="#" data-option="' + optioncounter + '">' + $(this).text() + '</a></li>');
                  optioncounter += 1;
                }
              });

              // Append Options list after select
              el.after(selectsubstitute);

              // EVENTS

              // Hover
              setHover(el.parent(), el.parent());

              // Focus
              setFocus(el, el.parent());

              // Click (Show options)
              el.parent().on('click', function (e) {
                e.stopPropagation();
                showOptionsList(el);
              });

              // Click (on option)
              currentListItems = el.next().find('a');
              el.next().find('a').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                selectedOption = $(this).attr('data-option');

                // Put value in span element
                $(this).parents('.' + options.prefix + options.selectClass).find('> span').text($(this).text());

                // Set correct value in select element
                setSelectValue(el, selectedOption);

                // Set option in custom list on active
                currentListItems.each(function () {
                  $(this).parent().removeClass(options.prefix + options.selectedClass);
                });

                $(this).parent().addClass(options.prefix + options.selectedClass);

                // Hide list
                hideOptionsList(el);
              });

              // Prevent default on space or enter...
              el.parent().on('keydown', function (e) {
                if (e.which === 13 || e.which === 32) {
                  e.preventDefault();
                }
              });

            } else {
              // Default behaviour for mobile
              el.on('change', function () {
                $(this).prev().text(el.find('option').eq(el.prop('selectedIndex')).text());
                //$(this).parents('.' + options.prefix + options.selectClass).find('> span').text($(this).text());
              });
            }
          }

          break;
        }
      }
    }

    // Click outside select will hide visible selects
    $("html").on('click', function () {
      $('.' + options.prefix + options.selectClass + ' ul').removeClass(options.prefix + options.visibleClass);
    });

    // Handle keydowns for accessibility, mostly for select
    $("html")
      .on('keydown', function (e) {
        // Check which element has focus and what type it is
        el_current = $(document.activeElement);

        if (el_current[0].tagName === "SELECT") {
          currentList = el_current.next();
          currentListItems = currentList.find('a');
        }

        switch (e.which) {
        case 38:
        case 40:
          e.preventDefault();
          break;

        default:
          break;
        }
      })
      .on('keyup', function (e) {
        // Check which element has focus and what type it is
        el_current = $(document.activeElement);

        if (el_current[0].tagName === "SELECT") {
          currentList = el_current.next();
          currentListItems = currentList.find('a');
        }

        switch (e.which) {
        case 13:
        case 32:
          // Space or Enter will open optionslist and sets focus on selected option (if any)
          if (currentList.length > 0 && !currentList.hasClass(options.prefix + options.visibleClass)) {
            showOptionsList(el_current);
            currentListItems.eq(el_current.prop('selectedIndex')).focus();
          } else {
            if (currentList.length > 0 && currentList.hasClass(options.prefix + options.visibleClass)) {
              // Put value in span element
              currentListItems.each(function (index) {
                if ($(this).parent().hasClass(options.prefix + options.selectedClass)) {
                  selectedOption = index;
                }
              });

              // Put value in span element
              currentList.parent().find('span').text(currentListItems.eq(selectedOption).text());
              setSelectValue(currentList.prev(), selectedOption);
              hideOptionsList(currentList.prev());
              setFocus(currentList.prev(), currentList.parent());
            }
          }
          break;

        case 27:
          // Escape hides list and sets focus back on element
          if (currentList.length > 0 && currentList.hasClass(options.prefix + options.visibleClass)) {
            hideOptionsList(currentList.prev());

            // Restore focus to select and replacement element
            currentList.prev().focus();
            currentList.parent().addClass('focus');
          }
          break;

        case 38:
          // Up arrow
          if (currentList.length > 0) {

            // Find active one
            currentItem = 0;
            $(currentListItems).each(function (index) {
              if ($(this).parent().hasClass(options.prefix + options.selectedClass)) {
                currentItem = index;
              }
            });

            // Set active item
            if (currentItem - 1 >= 0) {
              $(currentListItems).eq(currentItem).parent().removeClass(options.prefix + options.selectedClass);
              $(currentListItems).eq(currentItem - 1).parent().addClass(options.prefix + options.selectedClass);
              $(currentListItems).eq(currentItem - 1).focus();
            }

            // Get selected option
            currentListItems.each(function (index) {
              if ($(this).parent().hasClass(options.prefix + options.selectedClass)) {
                selectedOption = index;
              }
            });

            // Put value in span element
            currentList.parent().find('span').text(currentListItems.eq(selectedOption).text());
            setSelectValue(currentList.prev(), selectedOption);
          }
          break;

        case 40:
          // Down arrow
          if (currentList.length > 0) {

            // Find active one
            currentItem = 0;
            $(currentListItems).each(function (index) {
              if ($(this).parent().hasClass(options.prefix + options.selectedClass)) {
                currentItem = index;
              }
            });

            // Set active item
            if (currentItem + 1 <= currentListItems.length) {
              $(currentListItems).eq(currentItem).parent().removeClass(options.prefix + options.selectedClass);
              $(currentListItems).eq(currentItem + 1).parent().addClass(options.prefix + options.selectedClass);
              $(currentListItems).eq(currentItem + 1).focus();
            }

            // Get selected option
            currentListItems.each(function (index) {
              if ($(this).parent().hasClass(options.prefix + options.selectedClass)) {
                selectedOption = index;
              }
            });

            // Put value in span element
            currentList.parent().find('span').text(currentListItems.eq(selectedOption).text());
            setSelectValue(currentList.prev(), selectedOption);
          }
          break;

        case 9:
          // tab will close optionslist when open, but will keep focus on element
          if (currentList.length > 0 && currentList.hasClass(options.prefix + options.visibleClass)) {
            hideOptionsList(currentList.prev());
            setFocus(currentList.prev(), currentList.parent());
          }
          break;

        default:
          return;
        }
      });

    // Call it!
    return this.each(function () {
      el = $(this);
      type = getElementType(el);
      init(el, type);
    });
  };
}($, document, navigator));