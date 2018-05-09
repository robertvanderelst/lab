/*jslint
    browser: true
    regexp: true
    nomen: true
    unparam: true
*/

/*global
    console
*/

/* TEDOEN:
    * Handles mogen elkaar niet kruisen. Min niet meer dan Max, Max niet minder dan Min
*/

function QSA(el) {
    return document.querySelectorAll(el);
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
            var inputMin = dragElement.closest('.filter-list').querySelector('.filter-range input[id$="-min"]'),
                inputMax = dragElement.closest('.filter-list').querySelector('.filter-range input[id$="-max"]'),
                minValue = parseInt(inputMin.getAttribute('placeholder'), 10),
                maxValue = parseInt(inputMax.getAttribute('placeholder'), 10),
                maxTravel = 100;
            if (dragElement.classList.contains('slider-handle-min')) {
                inputMin.value = Math.floor((maxValue - minValue) * (dragElement.style.left.slice(0, -1) / maxTravel) + minValue);

                if (dragElement.style.left < 0) {
                    inputMin.value = minValue;
                }

                if (dragElement.style.left > maxTravel) {
                    inputMin.value = maxValue;
                }
            }

            if (dragElement.classList.contains('slider-handle-max')) {
                inputMax.value = Math.floor((maxValue - minValue) * (dragElement.style.left.slice(0, -1) / maxTravel) + minValue);

                if (dragElement.style.left < 0) {
                    inputMax.value = minValue;
                }

                if (dragElement.style.left > maxTravel) {
                    inputMax.value = maxValue;
                }
            }

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
        }
    }

    function startDrag(e) {
        var target;

        if (window.hasOwnProperty('ontouchstart') === true) {
            hasTouch = true;
        }

        if (e.target.classList.contains('slider-handle')) {
            target = e.target;
            dragParent = target.parentNode;
            dragElement = target;

            if (hasTouch) {
                posX = e.targetTouches[0].pageX;
            } else {
                posX = e.clientX;
            }

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

        var aSliderMax = QSA('.slider-handle-max');
        [].forEach.call(aSliderMax, function (anchor, i) {
            anchor.style.left = '100%';
        });
    }

    InitDragDrop();
}());

(function () {
    var aRangeFields = QSA('.filter-range input'),
        minValue,
        maxValue,
        perc;

    [].forEach.call(aRangeFields, function (anchor, i) {
        anchor.addEventListener('keyup', function () {
            if (/-min/.test(anchor.id) === true) {
                minValue = parseInt(anchor.getAttribute('placeholder'), 10);
                maxValue = parseInt(anchor.closest('.filter-range').querySelector('[id$="-max"]').getAttribute('placeholder'), 10);

                if (anchor.value < minValue) {
                    perc = 0;
                } else if (anchor.value > maxValue) {
                    perc = 100;
                } else {
                    perc = ((anchor.value - minValue) / (maxValue - minValue)) * 100;
                }

                anchor.closest('.filter-list').querySelector('.slider-handle-min').style.left = perc + '%';
            }

            if (/-max/.test(anchor.id) === true) {
                minValue = parseInt(anchor.closest('.filter-range').querySelector('[id$="-min"]').getAttribute('placeholder'), 10);
                maxValue = parseInt(anchor.getAttribute('placeholder'), 10);

                if (anchor.value < minValue) {
                    perc = 0;
                } else if (anchor.value > maxValue) {
                    perc = 100;
                } else {
                    perc = ((anchor.value - minValue) / (maxValue- minValue)) * 100;
                }

                anchor.closest('.filter-list').querySelector('.slider-handle-max').style.left = perc + '%';
            }
        });
    });
}());
