/*jslint
    browser: true
    regexp: true
    nomen: true
    unparam: true
*/

/*global
    console
*/

function QSA(el) {
    return document.querySelectorAll(el);
}

function setInputValue(dragElement, which) {
    var inputMin = dragElement.closest('.filter-list').querySelector('.filter-range input[id$="-min"]'),
        inputMax = dragElement.closest('.filter-list').querySelector('.filter-range input[id$="-max"]'),
        minValue = parseInt(inputMin.getAttribute('placeholder'), 10),
        maxValue = parseInt(inputMax.getAttribute('placeholder'), 10),
        maxTravel = 100,
        el;

    if (which === 'min') {
        el = inputMin;
    } else {
        el = inputMax;
    }

    el.value = Math.floor((maxValue - minValue) * (dragElement.style.left.slice(0, -1) / maxTravel) + minValue);

    if (dragElement.style.left < 0) {
        el.value = minValue;
    }

    if (dragElement.style.left > maxTravel) {
        el.value = maxValue;
    }
}

function setHandlePosition(anchor, which) {
    var opposite,
        minValue,
        maxValue,
        perc;

    if (which === 'min') {
        opposite = 'max';
    } else {
        opposite = 'min';
    }

    minValue = parseInt(anchor.getAttribute('placeholder'), 10);
    maxValue = parseInt(anchor.closest('.filter-range').querySelector('[id$="-' + opposite + '"]').getAttribute('placeholder'), 10);

    if (anchor.value < minValue) {
        perc = 0;
    } else if (anchor.value > maxValue) {
        perc = 100;
    } else {
        perc = ((anchor.value - minValue) / (maxValue - minValue)) * 100;
    }

    anchor.closest('.filter-list').querySelector('.slider-handle-' + which).style.left = perc + '%';
}


(function () {
    "use strict";

    var posX = 0,           // mouse starting X position
        offsetX = 0,        // current element X offset
        dragElement,        // needs to be passed from OnMouseDown to OnMouseMove
        dragParent,
        hasTouch = false;

    function releaseDrag(e) {
        if (dragElement) {
            if (dragElement.classList.contains('slider-handle-min')) {
                setInputValue(dragElement, 'min');
            }

            if (dragElement.classList.contains('slider-handle-max')) {
                setInputValue(dragElement, 'max');
            }

            dragElement.classList.remove('dragging');

            document.removeEventListener('mousemove', OnMouseMove);
            document.removeEventListener('touchmove', OnMouseMove);
            document.onselectstart = null;
            dragElement = null;
        }
    }

    function OnMouseMove(e) {
        var clientX,
            travel;

        if (dragElement) {
            if (hasTouch) {
                clientX = e.targetTouches[0].pageX;
            } else {
                clientX = e.clientX;
            }

            travel = ((offsetX + clientX - posX) / window.getComputedStyle(dragParent, null).getPropertyValue('width').slice(0, -2)) * 100;

            if (travel < 0) {
                dragElement.style.left = '0%';
            } else if (travel > 100) {
                dragElement.style.left = '100%';
            } else {
                dragElement.style.left = travel + '%';
            }

            if (dragElement.classList.contains('slider-handle-min')) {
                var handleMax = dragElement.nextElementSibling;
                if (parseInt(dragElement.style.left.slice(0, -1), 10) >= parseInt(handleMax.style.left.slice(0, -1), 10)) {
                    dragElement.style.left = handleMax.style.left;
                }

                setInputValue(dragElement, 'min');
            }

            if (dragElement.classList.contains('slider-handle-max')) {
                var handleMin = dragElement.previousElementSibling;
                if (parseInt(dragElement.style.left.slice(0, -1), 10) <= parseInt(handleMin.style.left.slice(0, -1), 10)) {
                    dragElement.style.left = handleMin.style.left;
                }
                setInputValue(dragElement, 'max');
            }
        }
    }

    function startDrag(e) {
        if (window.hasOwnProperty('ontouchstart') === true) {
            hasTouch = true;
        }

        if (e.target.classList.contains('slider-handle')) {
            dragElement = e.target;
            dragParent = dragElement.parentNode;

            if (hasTouch) {
                posX = e.targetTouches[0].pageX;
            } else {
                posX = e.clientX;
            }

            dragElement.classList.add('dragging');

            offsetX = Math.floor((dragElement.style.left.slice(0, -1) / 100) * window.getComputedStyle(dragParent, null).getPropertyValue('width').slice(0, -2));

            document.addEventListener('mousemove', OnMouseMove);
            document.addEventListener('touchmove', OnMouseMove);
            document.body.focus();
            document.onselectstart = function () { return false; };
            return false;
        } else {
            return true;
        }
    }

    function InitDragDrop() {
        document.addEventListener('mousedown', startDrag);
        document.addEventListener('mouseup', releaseDrag);

        document.addEventListener('touchstart', startDrag);
        document.addEventListener('touchend', releaseDrag);

        var aSliderMin = QSA('.slider-handle-min');
        [].forEach.call(aSliderMin, function (anchor, i) {
            anchor.style.left = '0%';
        });

        var aSliderMax = QSA('.slider-handle-max');
        [].forEach.call(aSliderMax, function (anchor, i) {
            anchor.style.left = '100%';
        });
    }

    InitDragDrop();
}());

(function () {
    "use strict";

    var aRangeFields = QSA('.filter-range input');

    [].forEach.call(aRangeFields, function (anchor, i) {
        anchor.addEventListener('keyup', function () {
            if (/-min/.test(anchor.id) === true) {
                setHandlePosition(anchor, 'min');
            }

            if (/-max/.test(anchor.id) === true) {
                setHandlePosition(anchor, 'max');
            }
        });
    });
}());
