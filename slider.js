/*jslint
    browser: true
    regexp: true
    nomen: true
    unparam: true
*/

/*global
    console
*/

(function () {
    "use strict";

    function QSA(el) {
        return document.querySelectorAll(el);
    }

    var posX = 0,           // mouse starting X position
        offsetX = 0,        // current element X offset
        dragElement,        // needs to be passed from OnMouseDown to OnMouseMove
        dragParent;

    function ExtractNumber(value) {
        var n = parseInt(value, 10);

        return n === null || isNaN(n) ? 0 : n;
    }

    function releaseDrag(e) {
        if (dragElement) {
            var inputMin = dragParent.parentNode.querySelector('#test-min'),
                inputMax = dragParent.parentNode.querySelector('#test-max'),
                minValue = parseInt(inputMin.getAttribute('placeholder'), 10),
                maxValue = parseInt(inputMax.getAttribute('placeholder'), 10),
                maxTravel = window.getComputedStyle(dragParent, null).getPropertyValue('width').slice(0, -2) - window.getComputedStyle(dragElement, null).getPropertyValue('width').slice(0, -2);

            if (dragElement.classList.contains('slider-handle-min')) {
                inputMin.value = Math.floor((maxValue - minValue) * (dragElement.style.left.slice(0, -2) / maxTravel) + minValue);

                if (dragElement.style.left < 0) {
                    inputMin.value = minValue;
                }

                if (dragElement.style.left >= maxTravel) {
                    inputMin.value = maxValue;
                }
            }

            if (dragElement.classList.contains('slider-handle-max')) {
                inputMax.value = Math.floor((maxValue - minValue) * (dragElement.style.left.slice(0, -2) / maxTravel) + minValue);

                if (dragElement.style.left < 0) {
                    inputMax.value = minValue;
                }

                if (dragElement.style.left > maxTravel) {
                    inputMax.value = maxValue + '|';
                }
            }

            // we're done with these events until the next OnMouseDown

            document.removeEventListener('mousemove', OnMouseMove);
            document.removeEventListener('touchmove', OnMouseMove);

            document.onselectstart = null;

            // this is how we know we're not dragging
            dragElement = null;
        }
    }

    function OnMouseMove(e) {
        if (dragElement) {
            var travel = offsetX + e.clientX - posX;

            if (travel < 0) {
                dragElement.style.left = 0;
            } else if (travel > (window.getComputedStyle(dragParent, null).getPropertyValue('width').slice(0, -2) - window.getComputedStyle(dragElement, null).getPropertyValue('width').slice(0, -2))) {
                dragElement.style.left = (window.getComputedStyle(dragParent, null).getPropertyValue('width').slice(0, -2) - window.getComputedStyle(dragElement, null).getPropertyValue('width').slice(0, -2)) + 'px';
            } else {
                dragElement.style.left = travel + 'px';
            }
        }
    }

    function startDrag(e) {
        var target;

        if (e.target.classList.contains('slider-handle')) {
            target = e.target;
            dragParent = target.parentNode;

            // grab the mouse position
            posX = e.clientX;

            // grab the clicked element's position
            offsetX = ExtractNumber(target.style.left);

            // we need to access the element in OnMouseMove
            dragElement = target;

            // tell our code to start moving the element with the mouse
            document.addEventListener('mousemove', OnMouseMove);
            document.addEventListener('touchmove', OnMouseMove);

            // cancel out any text selections
            document.body.focus();

            // prevent text selection
            document.onselectstart = function () { return false; };

            // prevent text selection (except IE)
            return false;
        } else {
            return true;
        }
    }

    function InitDragDrop() {
        var aSliderMax = QSA('.slider-handle-max');
        document.addEventListener('mousedown', startDrag);
        document.addEventListener('mouseup', releaseDrag);

        document.addEventListener('touchstart', startDrag);
        document.addEventListener('touchend', releaseDrag);

        [].forEach.call(aSliderMax, function (anchor, i) {
            anchor.style.left = (window.getComputedStyle(anchor.parentNode, null).getPropertyValue('width').slice(0, -2) - window.getComputedStyle(anchor, null).getPropertyValue('width').slice(0, -2)) + 'px'
        });
    }

    InitDragDrop();
}());
