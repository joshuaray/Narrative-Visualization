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
            func: (self, data) => intro()
        }
    },
    {
        name: 'Step 1',
        description: '',
        content: {
            x: 'Budget (Inflation Adjusted)',
            y: 'Earnings (Inflation Adjusted)',
            size: 'Popularity',
            title: (data) => 'Budget, Earnings, and Popularity of Box Office Releases Between ' + min(data, 'Release Year') + ' and ' + max(data, 'Release Year'),
            color: (row) => row['Release Year'].substring(0,3) + '0',
            data: (self, data) => data.filter(d => Number(d[self.x]) > 0 && Number(d[self.y] > 0)),
            func: (self, data) => scatterplot(self.data(self, data), self.title(data), 0, max(data, self.x), 0, max(data, self.y), self.x, self.y, self.size, min(data, 'Release Year').toString().substring(0, 3) + '0', max(data, 'Release Year').toString().substring(0, 3) + '0', 'Release Year', self.color)
        }
    },
    {
        name: 'Step 2',
        description: '',
        content: {
            color: (row) => null,
            func: (self, data) => barchart(data)
        }
    },
    {
        name: 'Step 3',
        description: '',
        content: {
            color: (row) => null,
            func: (self, data) => barchart(data)
        }
    },
    {
        name: 'Conclusion',
        description: '',
        content: {
            func: (self, data) => conclusion()
        }
    }
];

generate = async (content) => {
    get(function(data) {
        content.func(content, data);
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

window.addEventListener('resize', () => changeStep(0));