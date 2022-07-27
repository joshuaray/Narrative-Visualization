const sliderColors = {
    slider: 'blue',
    range: 'orange'
}

updateLabels = (from, to, labels) => {
    from.value = labels.min;
    to.value = labels.max;
}

operateFrom = (fromSlider, toSlider, fromInput, toInput, label = (val) => '') => {
  var [from, to] = parseSliders(fromSlider, toSlider);
  setSliderColor(fromSlider, toSlider, sliderColors.slider, sliderColors.range, toSlider);
  fromSlider.value = from > to ? to : fromSlider.value;
  fromInput.value = from > to ? to : from;
  updateLabels(fromInput, toInput, label(fromSlider.value, toSlider.value));
}

operateTo = (fromSlider, toSlider, toInput, fromInput, label = (val) => '') => {
  var [from, to] = parseSliders(fromSlider, toSlider);
  setSliderColor(fromSlider, toSlider, sliderColors.slider, sliderColors.range, toSlider);
  setToggle(toSlider);
  toInput.value = from <= to ? to : from;
  toSlider.value = from <= to ? to : from;
  updateLabels(fromInput, toInput, label(fromSlider.value, toSlider.value));
}

parseSliders = (from, to) => [Number(from.value), Number(to.value)];

setSliderColor = (from, to, colorSlider, colorRange, slider) => {
    var positionFrom = from.value - to.min;
    var positionTo = to.value - to.min;
    var distance = to.max - to.min;
    var fromColors = [colorSlider, colorRange];
    var toColors = [colorRange, colorSlider];

    slider.style.background = 'linear-gradient(to right, ' + 
        fromColors[0] + ' 0%,' +
        fromColors.map((color, i) => color + ' ' + Math.ceil(positionFrom / distance * 100) + '%') + ',' + 
        toColors.map((color, i) => color + ' ' + Math.ceil(positionTo / distance * 100) + '%') + ',' +
        toColors[toColors.length - 1] + ' 100%)';
}

setToggle = (currentTarget) => {
  var to = document.getElementById(currentTarget.id);
  to.style.zIndex = Number(currentTarget.value) <= 0 ? 2 : 0;
}

sliderInput = (min = '', max = '', classs = '', value = '', id = '') => {
    var input = document.createElement('input');
    input.setAttribute('type', 'range');
    input.setAttribute('min', min);
    input.setAttribute('max', max);
    input.classList.add(classs);
    input.setAttribute('value', min);
    input.id = id;
    input.value = value;
    return input;
}

labelInput = (min, max, label, id, value) => {
    var container = document.createElement('div');
    var element = document.createElement('div');
    element.innerText = label;
    var input = document.createElement('input');
    input.id = id;
    input.value = value;
    input.min = min;
    input.max = max;
    input.readOnly = true;
    container.appendChild(element);
    container.appendChild(input);
    return {container: container, element: element, input: input};
}

slider = (chart, data, id, container, name = '', min = (data) => 0, max = (data) => 0, filter = () => {}, label = (min, max) => {min = '', max = ''}) => {
    var minVal = min(data);
    var maxVal = max(data);
    
    container.classList.add('slider');
    var rangeContainer = document.createElement('div');
    rangeContainer.classList.add('slider-container');
    var sliders = document.createElement('div');
    sliders.classList.add('slider-controls');

    var from = sliderInput(minVal, maxVal, 'slider-min', minVal, 'fromSlider_' + id);
    var to = sliderInput(minVal, maxVal, 'slider-max', maxVal, 'toSlider_' + id);
    var inputContainer = document.createElement('div');
    inputContainer.classList.add('slider-input-container');
    var labels = label(minVal, maxVal);
    var fromContainer = labelInput(minVal, maxVal, 'From', 'fromInput', labels.min);
    var toContainer = labelInput(minVal, maxVal, 'To', 'toInput', labels.max);
    inputContainer.appendChild(fromContainer.container);
    inputContainer.appendChild(toContainer.container);
        
    sliders.appendChild(from);
    sliders.appendChild(to);
    rangeContainer.appendChild(sliders);
    rangeContainer.appendChild(inputContainer);
    container.appendChild(rangeContainer);
    
    setSliderColor(from, to, sliderColors.slider, sliderColors.range, to);
    setToggle(to);
    
    from.oninput = () => operateTo(from, to, toContainer.input, fromContainer.input, label);
    to.oninput = () => operateFrom(from, to, fromContainer.input, toContainer.input, label);
    from.onmouseup = () => document.getElementById('filter-apply').click();
    to.onmouseup = () => document.getElementById('filter-apply').click();

    return {
        reset: (data) => {
            var minElement = document.getElementById('fromSlider_' + id);
            var maxElement = document.getElementById('toSlider_' + id);
            minElement.value = min(data);
            maxElement.value = max(data);
            operateTo(from, to, toContainer.input, fromContainer.input, label);
            operateFrom(from, to, fromContainer.input, toContainer.input, label);
        },
        filter: (data) => {
            var minElement = document.getElementById('fromSlider_' + id).value;
            var maxElement = document.getElementById('toSlider_' + id).value;
            return filter(data, minElement, maxElement);
        }
    };
}