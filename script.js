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
        description: 'This scatterplot displays monetary and popularity statistics of box office releases between 1960 and 2015, including inflation adjusted revenue and budget USD values. <b>Annotations</b> have been added that point out interesting insights of the data. For example, <b>5 of the top 10</b> movies by popularity index between 1960 and 2015 had an inflation adjusted budget between $150 and $170 million.',
        properties: [
            {
                name: 'X Axis',
                value: 'Budget (Inflation Adjusted)',
                description: 'Total production budget of the movie in USD, adjusted for inflation to normalize all movies to 2015.',
                class: 'east'
            },
            {
                name: 'Y Axis',
                value: 'Revenue (Inflation Adjusted)',
                description: 'Total box office ticket revenue of the movie in USD, adjusted for inflation to normalize all movies to 2015.',
                class: 'north'
            },
            {
                name: 'Color',
                value: 'Release Decade',
                description: 'Decades in the source data set range from the 1960s to the 2010s.',
                class: 'palette'
            },
            {
                name: 'Size',
                value: 'Popularity',
                description: 'Popularity index of the movie. Ranges from least popular movie <b>North and South, Book I</b> with a popularity index of <b>0.0000065</b> to the most popular movie <b>Jurassic World</b> with an index of <b>32.985763</b>.',
                class: 'scatter_plot'
            }
        ],
        content: {
            x: 'Budget (Inflation Adjusted)',
            y: 'Revenue (Inflation Adjusted)',
            size: 'Popularity',
            title: (data) => 'Budget, Revenue, and Popularity of Box Office Releases Between ' + min(data, 'Release Year') + ' and ' + max(data, 'Release Year'),
            color: (row) => row['Release Year'].substring(0,3) + '0',
            data: (self, data) => data.filter(d => Number(d[self.x]) > 0 && Number(d[self.y] > 0)),
            func: (self, data) => scatterplot(self.data(self, data), self.title(data), 0, max(data, self.x), 0, max(data, self.y), self.x, self.y, self.size, min(data, 'Release Year').toString().substring(0, 3) + '0', max(data, 'Release Year').toString().substring(0, 3) + '0', 'Release Decade', self.color)
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

setupFilters = (filters = [{type: '', name: '', values: [], filterKey: ''}]) => {
    var container = document.getElementById('controls');
    if (filters.filter(f => f.name != '').length == 0) {
        container.classList.add('hidden');
        return;
    }
    else 
        container.classList.remove('hidden');
        console.log(filters);
}

changeProperties = (description = '', properties = [{name: '', description: '', value: '', class: ''}]) => {
    var container_description = document.getElementById('description');
    if (description == '' || description == null)
        container_description.classList.add('hidden');
    else 
        container_description.classList.remove('hidden');
    container_description.querySelector('p').innerHTML = description;

    var container = document.getElementById('properties');
    container.querySelectorAll('div').forEach(d => { if (d != null) d.remove() });
    if (properties.filter(p => p.name != '').length == 0) {
        container.classList.add('hidden');
        return;
    }
    else 
        container.classList.remove('hidden');
    properties.forEach(p => {
        var div = document.createElement('div');
        div.classList.add('property');
        var title = document.createElement('div');
        title.classList.add('property-title');
        var i = document.createElement('span');
        i.classList.add('material-icons');
        i.textContent = p.class;
        title.appendChild(i);
        var prop = document.createElement('span');
        prop.classList.add('property-name');
        prop.textContent = p.name + ': ' + p.value;
        title.appendChild(prop);
        div.appendChild(title);
        var desc = document.createElement('p');
        desc.innerHTML = p.description;
        div.appendChild(desc);
        container.appendChild(div);
    });
}

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

    setupFilters(steps[currentStep].filters);
    changeProperties(steps[currentStep].description, steps[currentStep].properties);
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