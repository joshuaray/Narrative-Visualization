var min = (data, key) => {
    return Math.min(...data.map(o => isNaN(Number(o[key])) ? 0 : Number(o[key])));
}
var max = (data, key) => {
    return Math.max(...data.map(o => isNaN(Number(o[key])) ? 0 : Number(o[key])));
}

var intro = () => {
    destroy();
    var container = document.getElementById('intro');
    container.classList.add('overlay');
    document.getElementById('conclusion').classList.remove('overlay');
}

var conclusion = () => {
    destroy();
    var container = document.getElementById('conclusion');
    container.classList.add('overlay');
    document.getElementById('intro').classList.remove('overlay');
}

var currentStep = 0;
var steps = [
    {
        name: 'Introduction',
        description: '',
        content: {
            func: (self) => intro()
        }
    },
    {
        name: 'Step 1',
        description: '',
        content: {
            x: 'Budget (Inflation Adjusted)',
            y: 'Earnings (Inflation Adjusted)',
            func: (self) => scatterplot(data, 0, max(data, self.x), 0, max(data, self.y), self.x, self.y)
        }
    },
    {
        name: 'Step 2',
        description: '',
        content: {
            func: (self) => barchart()
        }
    },
    {
        name: 'Step 3',
        description: '',
        content: {
            func: (self) => barchart()
        }
    },
    {
        name: 'Conclusion',
        description: '',
        content: {
            func: (self) => conclusion()
        }
    }
];

generate = async (content) => {
    get(function(data) {
        window.data = data;
        content.func(content);
    });
};

var changeStep = async (modifier) => {
    currentStep += modifier;
    if (currentStep < 0)
        currentStep = steps.length - 1;
    if (currentStep > steps.length - 1)
        currentStep = 0;
    var current = document.getElementsByClassName('step-active')[0];
    current.classList.remove('step-active');
    var next = document.getElementsByClassName('step')[currentStep];
    next.classList.add('step-active');

    if (currentStep != 0 && currentStep != steps.length - 1)
        if (document.getElementsByClassName('overlay').length > 0)
            document.getElementsByClassName('overlay')[0].classList.remove('overlay');

    await generate(steps[currentStep].content);
}

var setup = () => {
    var container = document.getElementById('slide-progress');
    steps.forEach((item, index) => {
        if (index != 0) {
            var divider = document.createElement('div');
            divider.classList.add('divider');
            container.appendChild(divider);
        }
        var i = document.createElement('div');
        i.classList.add('step');
        if (index == currentStep)
            i.classList.add('step-active');
        var point = document.createElement('div');
        point.classList.add('point');
        i.appendChild(point);
        var p = document.createElement('p');
        p.textContent = item.name;
        i.appendChild(p);
        container.appendChild(i);
    });
    changeStep(0);
}

setup();