function controlFromSlider(fromSlider, toSlider, fromInput, toInput, label = (val) => '') {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
  var labels = label(fromSlider.value, toSlider.value);
  fromInput.value = labels.min;
  toInput.value = labels.max;
}

function controlToSlider(fromSlider, toSlider, toInput, fromInput, label = (val) => '') {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
  var labels = label(fromSlider.value, toSlider.value);
  fromInput.value = labels.min;
  toInput.value = labels.max;
}

function getParsed(currentFrom, currentTo) {
  const from = Number(currentFrom.value);
  const to = Number(currentTo.value);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.getElementById(currentTarget.id);
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
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
    container.classList.add('form_control_container');
    var element = document.createElement('div');
    element.classList.add('form_control_container__time');
    element.innerText = label;
    var input = document.createElement('input');
    input.classList.add('form_control_container__time__input');
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
    rangeContainer.classList.add('range_container');
    var sliders = document.createElement('div');
    sliders.classList.add('sliders_control');

    var from = sliderInput(minVal, maxVal, 'slider-min', minVal, 'fromSlider_' + id);
    var to = sliderInput(minVal, maxVal, 'slider-max', maxVal, 'toSlider_' + id);
    var inputContainer = document.createElement('div');
    inputContainer.classList.add('form_control');
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
    
    fillSlider(from, to, '#C6C6C6', '#25daa5', to);
    setToggleAccessible(to);
    
    from.oninput = () => controlToSlider(from, to, toContainer.input, fromContainer.input, label);
    to.oninput = () => controlFromSlider(from, to, fromContainer.input, toContainer.input, label);

    return {
        reset: (data) => {
            var minElement = document.getElementById('fromSlider_' + id);
            var maxElement = document.getElementById('toSlider_' + id);
            minElement.value = min(data);
            maxElement.value = max(data);
            controlToSlider(from, to, toContainer.input, fromContainer.input, label);
            controlFromSlider(from, to, fromContainer.input, toContainer.input, label);
        },
        filter: (data) => {
            var minElement = document.getElementById('fromSlider_' + id).value;
            var maxElement = document.getElementById('toSlider_' + id).value;
            return filter(data, minElement, maxElement);
        }
    };
}