ranges: function () {
    var posX = 0,           // mouse starting X position
        offsetX = 0,        // current element X offset
        dragElement,        // needs to be passed from OnMouseDown to OnMouseMove
        dragParent,
        hasTouch = false,
        aRangeFields;

    function setInputValue(dragElement, which) {
        var inputMin = dragElement.closest('.filter-list').querySelector('.filter-range input[id$="-min"]'),
            inputMax = dragElement.closest('.filter-list').querySelector('.filter-range input[id$="-max"]'),
            minValue = parseInt(inputMin.getAttribute('placeholder'), 10),
            maxValue = parseInt(inputMax.getAttribute('placeholder'), 10),
            el;

        if (which === 'min') {
            el = inputMin;
        } else {
            el = inputMax;
        }

        el.value = Math.floor((maxValue - minValue) * (dragElement.style.left.slice(0, -1) / 100) + minValue);

        if (dragElement.style.left < 0) {
            el.value = minValue;
        }

        if (dragElement.style.left > 100) {
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

    function OnMouseMove(e) {
        var clientX,
            travel,
            handleMin,
            handleMax;

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
                handleMax = dragElement.nextElementSibling;
                if (parseInt(dragElement.style.left.slice(0, -1), 10) >= parseInt(handleMax.style.left.slice(0, -1), 10)) {
                    dragElement.style.left = handleMax.style.left;
                }

                setInputValue(dragElement, 'min');
            }

            if (dragElement.classList.contains('slider-handle-max')) {
                handleMin = dragElement.previousElementSibling;
                if (parseInt(dragElement.style.left.slice(0, -1), 10) <= parseInt(handleMin.style.left.slice(0, -1), 10)) {
                    dragElement.style.left = handleMin.style.left;
                }
                setInputValue(dragElement, 'max');
            }
        }
    }


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
        }
    }

    function InitDragDrop() {
        var aSliderMin,
            aSliderMax;

        document.addEventListener('mousedown', startDrag);
        document.addEventListener('mouseup', releaseDrag);

        document.addEventListener('touchstart', startDrag);
        document.addEventListener('touchend', releaseDrag);

        aSliderMin = QSA('.slider-handle-min');
        [].forEach.call(aSliderMin, function (anchor, i) {
            anchor.style.left = '0%';
        });

        aSliderMax = QSA('.slider-handle-max');
        [].forEach.call(aSliderMax, function (anchor, i) {
            anchor.style.left = '100%';
        });
    }

    InitDragDrop();

    [].forEach.call(QSA('.filter-range-cta .button'), function (anchor, i) {
        anchor.addEventListener('click', function () {
            var rangedata = anchor.closest('.filter-list').dataset,
                range_min = QS('#' + rangedata.rangeid + '-min').getAttribute('placeholder'),
                range_max = QS('#' + rangedata.rangeid + '-max').getAttribute('placeholder'),
                range_start = QS('#' + rangedata.rangeid + '-min').value,
                range_end = QS('#' + rangedata.rangeid + '-max').value,
                new_range = rangedata.rangeid + '=' + range_min + '-' + range_max + '-' + range_start + '-' + range_end,
                url = rangedata.url,
                cnt = url.split('?'),
                glue = '?';

            if (range_start > 0 && range_end > 0) {
                if (cnt.length > 1) { glue = '&'; }
                window.location.href = url + glue + new_range;
            }
        });
    });

    aRangeFields = QSA('.filter-range input');

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
},
