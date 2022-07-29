const sample_title = 'Star Wars';

var min = (data, key) => {
    return Math.min(...data.map(o => isNaN(Number(o[key])) ? 0 : Number(o[key])));
}
var max = (data, key) => {
    return Math.max(...data.map(o => isNaN(Number(o[key])) ? 0 : Number(o[key])));
}

var intro = () => {
    destroy();
    var introContainer = document.getElementById('intro');
    introContainer.classList.add('overlay');
    document.getElementById('conclusion').classList.remove('overlay');
}

var conclusion = () => {
    destroy();
    var container = document.getElementById('conclusion');
    container.classList.add('overlay');
    document.getElementById('intro').classList.remove('overlay');
}

var dictionary = [
    {name: 'ID', description: 'Unique row identifier, used as primary key of data set.'},
    {name: 'IMDB ID', description: 'Primary key of movie within IMDB, the original source of the data.'},
    {name: 'Popularity', description: 'Popularity index of the movie. As of 2015, Jurassic World had the highest popularity index of movies released since 1960, with a value of 32.985763.'},
    {name: 'Budget ($)', description: 'Movie budget in USD, not adjusted for inflation.'},
    {name: 'Revenue ($)', description: 'Box office revenue of the movie in USD, not adjusted for inflation.'},
    {name: 'Title', description: 'Movie title'},
    {name: 'Cast', description: 'First and last names of the main cast of the movie, pipe delimited.'},
    {name: 'URL', description: 'Web address of the movie.'},
    {name: 'Director', description: 'First and last name of the movie director.'},
    {name: 'Tagline', description: 'Advertising slogan of the movie.'},
    {name: 'Keywords', description: 'Pipe delimited list of common words associated with the content or plot of the movie.'},
    {name: 'Overview', description: 'Plot description of the movie.'},
    {name: 'Runtime (Minutes)', description: 'Length of the cinematic release in minutes.'},
    {name: 'Genres', description: 'Pipe delimited list of genres applicable to the movie.'},
    {name: 'Production Company', description: 'Name of the primary production company of the movie.'},
    {name: 'Release Date', description: 'Original US cinematic release date of the movie, mm/dd/yyyy formatted.'},
    {name: 'Rating Count', description: 'Number of IMDB critic ratings.'},
    {name: 'Rating Average', description: 'Average critic rating of the movie, rated on a 10 point scale.'},
    {name: 'Release Year', description: 'Year of the original cinematic release.'},
    {name: 'Inflation Multiplier', description: 'Multiplier required to adjust original monetary values (budget and revenue) to 2015.'},
    {name: 'Budget (Inflation Adjusted)', description: 'Budget of the movie in USD, adjusted for inflation.'},
    {name: 'Revenue (Inflation Adjusted)', description: 'Box office revenue of the movie in USD, adjusted for inflation.'},
    {name: 'Return on Investment (Inflation Adjusted)', description: 'How many times the movie made its budget back in revenue, adjusted for inflation. Used to determine box office profitability of the movie.'},
    {name: 'Earnings (Inflation Adjusted)', description: 'Net profit of the movie in USD, adjusted for inflation.'},
];

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
        description: 'This scatterplot displays monetary and popularity statistics of box office releases between 1960 and 2015, including inflation adjusted revenue and budget USD values. <b>Annotations</b> have been added that point out interesting insights of the data. For example, <b>5 of the top 7</b> movies by popularity index between 1960 and 2015 had an inflation adjusted budget between $130 and $160 million.',
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
            annotations: (data) => [
                {
                    location: (props) => {
                        var titles = [
                            'Jurassic World',
                        ];   
                        var circle = Array.from(document.querySelectorAll('circle')).find(c => titles.includes(c.__data__['Title']));
                        var positions = [{ height: circle.r.baseVal.value * 2, width: circle.r.baseVal.value * 2, x: circle.cx.baseVal.value, y: circle.cy.baseVal.value, r: circle.r.baseVal.value }];
                        props.x = positions.map(m => m.x).sort((a, b) => a - b)[0] + margin.left;
                        props.y = positions.map(m => m.y).sort((a, b) => a - b)[0] + margin.top;
                        props.subject.radius = positions.map(m => m.width).reduce((a, b) => a + b) / 2 + 10;
                        props.subject.radiusPadding = 0;
                        props.dx = (props.dx * 2.5 * width() / 1920) + 20;
                        props.dy = props.dy * height() / 1080;
                        return props;
                    },
                    delay: 2200,
                    type: annotationType.circle,
                    note: { 
                        label: 'Despite this popularity, only one of these top 7 exceeded $1 billion in revenue.',
                        class: 'vis1' 
                    },
                    x: 400,
                    y: 250,
                    dx: 250,
                    dy: -75,
                    subject: {
                        radius: 50,
                        radiusPadding: 0
                    },
                    data: data.filter(d => Number(d['Popularity']) > 12)
                },
                {
                    location: (props) => {
                        var titles = [
                            'Mad Max: Fury Road',
                            'Interstellar',
                            'Guardians of the Galaxy',
                            'Captain America: The Winter Soldier'
                        ];   
                        var circles = Array.from(document.querySelectorAll('circle')).filter(c => titles.includes(c.__data__['Title']));
                        var positions = circles.map(circle => { return { height: circle.r.baseVal.value * 2, width: circle.r.baseVal.value * 2, x: circle.cx.baseVal.value, y: circle.cy.baseVal.value, r: circle.r.baseVal.value } });
                        
                        props.x = positions.map(m => m.x).reduce((a, b) => a + b) / positions.length + margin.left - 10;
                        props.y = positions.map(m => m.y).reduce((a, b) => a + b) / positions.length + margin.top + 10;
                        props.subject.radius = (positions.map(m => m.x + (m.r * 2)).sort((a, b) => b - a)[0] - positions.map(m => m.x - m.r).sort((a, b) => a - b)[0]) / 2 + 15; // - positions.map(m => m.x - m.r).sort((a, b) => a - b); // positions.map(m => m.width).reduce((a, b) => a + b) / 2;
                        props.subject.radiusPadding = 0;
                        props.dx = (props.dx * width() / 1920) + 120;
                        props.dy = props.dy * height() / 1080 + 25; // - 125;
                        return props;
                    },
                    delay: 2200,
                    type: annotationType.circle,
                    note: { 
                        label: '5 of the top 7 most popular movies from 1960 to 2015 had a budget between 130 and 160 million USD.',
                        class: 'vis1' 
                    },
                    x: 410,
                    y: 360,
                    dx: 300,
                    dy: -185,
                    subject: {
                        radius: 60,
                        radiusPadding: 0
                    },
                    data: data.filter(d => Number(d['Popularity']) > 12)
                }
            ],
            x: 'Budget (Inflation Adjusted)',
            y: 'Revenue (Inflation Adjusted)',
            size: 'Popularity',
            title: (data) => 'Budget, Revenue, and Popularity of Box Office Releases Between ' + min(data, 'Release Year') + ' and ' + max(data, 'Release Year'),
            color: (row) => row['Release Year'].substring(0,3) + '0',
            colorbuckets: (data) => data.map(d => Number(d['Release Year'].substring(0,3) + '0')).sort().filter((v, i, a) => a.indexOf(v) == i),
            data: (self, data) => data.filter(d => Number(d[self.x]) > 0 && Number(d[self.y] > 0)),
            func: (self, data) => scatterplot(self.data(self, data), self.title(data), 0, max(data, self.x), 0, max(data, self.y), self.x, self.y, self.size, 'Release Decade', ['blue', 'orange'], self.colorbuckets(data), self.color, self.annotations(self.data(self, data)))
        }
    },
    {
        name: 'Step 2',
        description: 'This stacked column chart displays total inflation adjusted USD revenue of box office releases between 1960 and 2015, and breaks those down by genre. An <b>annotation</b> has been added that point out interesting insights of the data. For example, <b>the bottom 6</b> genres by total revenue between 1960 and 2015 were <b>Music, War, History, Western, Documentary, Foreign</b>',
        properties: [
            {
                name: 'X Axis',
                value: 'Genre',
                description: 'Most relevant genre of the movie.',
                class: 'east'
            },
            {
                name: 'Y Axis',
                value: 'Revenue (Inflation Adjusted)',
                description: 'Total revenue of movies released for the genre in USD, adjusted for inflation to normalize values to 2015.',
                class: 'north'
            },
            {
                name: 'Color',
                value: 'Release Decade',
                description: 'Decades in the source data set range from the 1960s to the 2010s.',
                class: 'palette'
            }
        ],
        content: {
            annotations: (data) => [
                {
                    location: (props) => {                       
                        var g = Array.from(document.querySelectorAll('svg#chart > g:not(.annotation-group) > g:last-of-type > g')).slice(-6);
                        var rects = g.map(x => Array.from(x.querySelectorAll('rect')).map(m => { return { height: m.height.baseVal.value, width: m.width.baseVal.value, y: m.y.baseVal.value, x: m.x.baseVal.value } }));
                        var positions = rects.map(k => { return { height: k.map(x => x.height).reduce((a, b) => Number(a) + Number(b)), width: k[0].width, ymin: Math.min(...(k.map(x => x.y))), ymax: Math.max(...(k.map(x => x.y))), x: Math.min(...(k.map(x => x.x))) } });
	                    var sorted = positions.sort((a, b) => a.x - b.x);
                        var gap = sorted[1].x - sorted[0].x - sorted[0].width;

                        props.x = positions.map(m => m.x).sort((a, b) => a - b)[0] + margin.left - gap / 2;
                        props.y = positions.map(m => m.ymin).sort((a, b) => a - b)[0] + margin.top - gap / 2;
                        props.subject.width = positions.map(m => m.width).reduce((a, b) => a + b) + gap * positions.length;
                        props.subject.height = (positions.map(m => m.height).sort((a, b) => b - a)[0] + gap * 2) + margin.top;
                        props.dx = -(props.dx * 3 * width() / 1920);
                        props.dy = props.dy * 3 * height() / 1080;

                        return props;
                    },

                    delay: 1000,
                    type: annotationType.rectangle,
                    note: { 
                        label: 'Music, War, History, Western, Documentary, and Foreign genres have a significantly lower share of overall revenue than other genres.',
                        class: 'vis2' 
                    },
                    x: 625,
                    y: 375,
                    dx: 50,
                    dy: -150,
                    subject: {
                        height: 125,
                        width: 250,
                        radiusPadding: 0
                    }
                }
            ],
            title: (data) => 'Inflation Adjusted Revenue by Genre and Release Decade',
            heightkey: 'Revenue (Inflation Adjusted)',
            stackkey: 'Release Year',
            columnkey: 'Genres',
            columngroups: (self, data) => data.flatMap(d => d[self.columnkey].split('|')).filter((v, i, a) => a.indexOf(v) == i).filter(x => x != '').filter(x => x != 'TV Movie'),
            stackgroups: (self, data) => data.flatMap(d => Number(d[self.stackkey].substring(0, 3) + '0')).filter((v, i, a) => a.indexOf(v) == i).filter(x => x != '').sort(a => a),
            ymax: (self, data) => Math.round(Number(self.columngroups(self, data).map(g => {
                return data.filter(d => d[self.columnkey].includes(g)).map(d => d[self.heightkey]).map(d => parseFloat(d)).reduce((a,b)=>Number(a)+Number(b))
            }).sort((a, b) => a < b)[0]) / 1000000000) * 1000000000,
            groupfunc: (row, group) => Number(row['Release Year'].substring(0,3) + '0') == group,
            columnfunc: (row, column) => row['Genres'].includes(column),
            data: (self, data) => data.filter(d => Number(d[self.heightkey]) > 0 && Number(d[self.heightkey] > 0)),
            func: (self, data) => stackedbar(self.data(self, data), self.title(data), self.columngroups(self, data), self.stackgroups(self, data), self.heightkey, 'Genre', 0, self.ymax(self, data), 'Release Decade', ['orange', 'blue'], self.columnfunc, self.groupfunc, self.annotations(self.data(self, data)))
        }
    },
    {
        name: 'Step 3',
        description: 'This 100% stacked column chart displays inflation adjusted revenue breakdown of genres by decade. By  doing this, we see interesting trends in the data that suggest genres that have decreased in popularity over time, seen resurgences after decades of low revenue, or became popular more recently. For example, an <b>annotations</b> has been added that shows the <b>Western, History, Music, and War</b> genres each saw significant portions of their total revenue from movies released in the 1960s-1970s, suggesting they have become less popular over time.',
        properties: [
            {
                name: 'X Axis',
                value: 'Genre',
                description: 'Most relevant genre of the movie.',
                class: 'east'
            },
            {
                name: 'Y Axis',
                value: 'Percentage of Total',
                description: 'By genre, what percentage of total inflation adjusted revenue is attributed to each decade.',
                class: 'north'
            },
            {
                name: 'Color',
                value: 'Release Decade',
                description: 'Decades in the source data set range from the 1960s to the 2010s.',
                class: 'palette'
            }
        ],
        content: {
            annotations: (data) => [
                {
                    location: (props) => {                       
                        var g = document.querySelectorAll('svg#chart > g:not(.annotation-group) > g:last-of-type > g:last-of-type')[0];
	                    var rects = Array.from(g.querySelectorAll('rect')).filter(r => ['Western','History','Music','War'].find(f => f == r.__data__.data['column']) != null);
                        var positions = rects.map(m => { return {height: m.height.baseVal.value, width: m.width.baseVal.value, y: m.y.baseVal.value, x: m.x.baseVal.value } });
                        var sorted = positions.sort((a, b) => a.x - b.x);
                        var gap = sorted[1].x - sorted[0].x - sorted[0].width;

                        props.x = positions.map(m => m.x).sort((a, b) => a - b)[0] + margin.left - gap / 2;
                        props.y = positions.map(m => m.y).sort((a, b) => b - a)[0] + margin.top - gap / 2;
                        props.subject.width = positions.map(m => m.width).reduce((a, b) => a + b) + gap * positions.length;
                        props.subject.height = positions.map(m => m.height).sort((a, b) => b - a)[0] + gap * 2;
                        props.dx = props.dx * 3 * width() / 1920;
                        props.dy = props.dy * 3 * height() / 1080;

                        return props;
                    },

                    delay: 1000,
                    type: annotationType.rectangle,
                    note: { 
                        label: 'Music, War, History, and Western genres have larger shares of revenue from the 1960s decade than other genres, suggesting they have decreased in popularity.',
                        class: 'vis3' 
                    },
                    x: 225,
                    y: 45,
                    dx: 220,
                    dy: 150,
                    subject: {
                        height: 100,
                        width: 150,
                        radiusPadding: 0
                    }
                }
            ],
            title: (data) => 'Genre Revenue Breakdown by Decade',
            yname: 'Percentage of Genre Revenue',
            stackkey: 'Release Year',
            columnkey: 'Genres',
            columngroups: (self, data) => data.flatMap(d => d[self.columnkey].split('|')).filter((v, i, a) => a.indexOf(v) == i).filter(x => x != '').filter(x => x != 'TV Movie'),
            stackgroups: (self, data) => data.flatMap(d => Number(d[self.stackkey].substring(0, 3) + '0')).filter((v, i, a) => a.indexOf(v) == i).filter(x => x != '').sort(a => a),
            ymax: (self, data) => 100,
            groupfunc: (row, group) => Number(row['Release Year'].substring(0,3) + '0') == group,
            columnfunc: (row, column) => row['Genres'].includes(column),
            heightfunc: (data, column, group) => { 
                var columnValue = data.filter(d => Number(d['Release Year'].substring(0,3)+'0') == group)
                    .filter(d => d['Genres'].includes(column))
                    .map(d => Number(d['Revenue (Inflation Adjusted)']))
                    .filter(d => d > 0)
                    .reduce((a,b) => a + b, 0);

                var totalValue = data.filter(d => d['Genres'].includes(column))
                    .map(d => Number(d['Revenue (Inflation Adjusted)']))
                    .filter(d => d > 0)
                    .reduce((a,b) => a + b, 0);

                return columnValue / totalValue * 100
            },
            columnsortfunc: (data, column, group) => data.filter(f => f['Genres'].includes(column)).filter(f => f['Release Year'].substring(0,3) + '0' == group).map(z => Number(z['Revenue (Inflation Adjusted)'])).reduce((a,b) => a + b, 0),
            data: (self, data) => data.filter(d => d['Has Financial Data']),
            func: (self, data) => stackedcolumn100(self.data(self, data), self.title(data), self.columngroups(self, data), self.stackgroups(self, data), self.yname, 'Genre', 0, self.ymax(self, data), 'Release Decade', ['orange', 'blue'], self.heightfunc, self.columnfunc, self.groupfunc, self.columnsortfunc, self.annotations(self.data(self, data)))
        }
    },
    {
        name: 'Step 4',
        filters: [
            {
                id: 'revenue',
                name: 'Revenue (Inflation Adjusted)',
                label: (min = 0, max = 0) => { return { min: Math.floor(min).toLocaleString(), max: Math.ceil(max).toLocaleString() } },
                min: (data) => min(data, 'Revenue (Inflation Adjusted)'),
                max: (data) => max(data, 'Revenue (Inflation Adjusted)'),
                filter: (data, min, max) => data.filter(d => d['Revenue (Inflation Adjusted)'] >= Math.floor(min)).filter(d => d['Revenue (Inflation Adjusted)'] <= Math.ceil(max)),
                func: (self, container, chart, data) => slider(chart, data, self.id, container, self.name, self.min, self.max, self.filter, self.label)
            },
            {
                id: 'budget',
                name: 'Budget (Inflation Adjusted)',
                label: (min = 0, max = 0) => { return { min: Math.floor(min).toLocaleString(), max: Math.ceil(max).toLocaleString() } },
                min: (data) => min(data, 'Budget (Inflation Adjusted)'),
                max: (data) => max(data, 'Budget (Inflation Adjusted)'),
                filter: (data, min, max) => data.filter(d => d['Budget (Inflation Adjusted)'] >= Math.floor(min)).filter(d => d['Budget (Inflation Adjusted)'] <= Math.ceil(max)),
                func: (self, container, chart, data) => slider(chart, data, self.id, container, self.name, self.min, self.max, self.filter, self.label)
            },
            {
                id: 'year',
                name: 'Release Year',
                label: (min = 0, max = 0) => { return { min: min, max: max } },
                min: (data) => min(data, 'Release Year'),
                max: (data) => max(data, 'Release Year'),
                filter: (data, min, max) => data.filter(d => d['Release Year'] >= Math.floor(min)).filter(d => d['Release Year'] <= Math.ceil(max)),
                func: (self, container, chart, data) => slider(chart, data, self.id, container, self.name, self.min, self.max, self.filter, self.label)
            },
            {
                id: 'runtime',
                name: 'Runtime (Minutes)',
                label: (min = 0, max = 0) => { return { min: min, max: max } },
                min: (data) => min(data, 'Runtime (Minutes)'),
                max: (data) => max(data, 'Runtime (Minutes)'),
                filter: (data, min, max) => data.filter(d => d['Runtime (Minutes)'] >= Math.floor(min)).filter(d => d['Runtime (Minutes)'] <= Math.ceil(max)),
                func: (self, container, chart, data) => slider(chart, data, self.id, container, self.name, self.min, self.max, self.filter, self.label)
            },
            {
                id: 'rating',
                name: 'Rating Average',
                label: (min = 0, max = 0) => { return { min: min, max: max } },
                min: (data) => 0,
                max: (data) => 10,
                filter: (data, min, max) => data.filter(d => d['Rating Average'] >= Math.floor(min)).filter(d => d['Rating Average'] <= Math.ceil(max)),
                func: (self, container, chart, data) => slider(chart, data, self.id, container, self.name, self.min, self.max, self.filter, self.label)
            },
            {
                id: 'genre',
                name: 'Genre',
                values: (data) => data.map(d => d['Genres']).flatMap(m => m.split('|')).filter((v, i, a) => a.indexOf(v) == i),
                filter: (data, list) => list.length == 0 ? data : data.filter(d => d['Genres'].split('|').filter(f => list.find(l => l == f)).length > 0),
                func: (self, container, chart, data) => stringList(chart, data, self.id, container, self.name, [], self.values, self.filter)
            },
            {
                id: 'director',
                name: 'Director',
                values: (data) => data.map(d => d['Director']).flatMap(m => m.split('|')).filter((v, i, a) => a.indexOf(v) == i),
                filter: (data, list) => list.length == 0 ? data : data.filter(d => d['Director'].split('|').filter(f => list.find(l => l == f)).length > 0),
                func: (self, container, chart, data) => stringList(chart, data, self.id, container, self.name, [], self.values, self.filter)
            },
            {
                id: 'company',
                name: 'Production Company',
                values: (data) => data.map(d => d['Production Company']).flatMap(m => m.split('|')).filter((v, i, a) => a.indexOf(v) == i).filter(x => x.trim() != ''),
                filter: (data, list) => list.length == 0 ? data : data.filter(d => d['Production Company'].split('|').filter(f => list.find(l => l == f)).length > 0),
                func: (self, container, chart, data) => stringList(chart, data, self.id, container, self.name, [], self.values, self.filter)
            }
        ],
        content: {
            annotations: (data) => [],
            x: 'Budget (Inflation Adjusted)',
            y: 'Revenue (Inflation Adjusted)',
            size: 'Popularity',
            title: (data) => 'Budget, Revenue, and Popularity of Box Office Releases',
            color: (row) => row['Release Year'].substring(0,3) + '0',
            colorbuckets: (data) => data.map(d => Number(d['Release Year'].substring(0,3) + '0')).sort().filter((v, i, a) => a.indexOf(v) == i),
            data: (self, data) => data.filter(d => Number(d[self.x]) > 0 && Number(d[self.y] > 0)),
            prompt: 'The message delivering portion of this Martini Glass narrative visualization has now completed, and you may now explore the data on your own to learn additional insights. Utilize the filters on the right to manipulate the data being displayed, and hover over chart elements for on-demand details.',
            func: (self, data) => scatterplot(self.data(self, data), self.title(data), min(data, self.x), max(data, self.x), min(data, self.y), max(data, self.y), self.x, self.y, self.size, 'Release Decade', ['blue', 'orange'], self.colorbuckets(data), self.color, self.annotations(self.data(self, data)), true)
        }
    }
];

showPrompt = (prompt) => {
    if (prompt == '' || prompt == null)
        return;
    var body = document.getElementsByTagName('body')[0];
    var overlay = document.createElement('div');
    overlay.classList.add('conclusion-overlay');
    var message = document.createElement('div');
    message.classList.add('message-container');
    var text = document.createElement('span');
    text.innerText = prompt;
    message.appendChild(text);
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('message-controls-container');
    var button = document.createElement('button');
    button.innerText = 'OK';
    button.onclick = () => {
        Array.from(document.getElementsByClassName('conclusion-overlay')).forEach(x => x.remove());
    }
    buttonContainer.appendChild(button);
    message.appendChild(buttonContainer);
    overlay.appendChild(message);
    body.appendChild(overlay);
}

generate = async (chart) => {
    get(function(data) {
        window.data = data;
        showPrompt(chart.content.prompt);
        if (data != null && chart.content != null) {
            chart.content.func(chart.content, data);
            if (chart.content.data != null)
                setupFilters(chart, chart.content.data(chart.content, data));
        }
    });
};

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
    destroy();
    currentStep += modifier;
    if (currentStep < 0)
        currentStep = steps.length - 1;
    if (currentStep > steps.length - 1)
        currentStep = 0;
    var current = document.getElementsByClassName('step-active')[0];
    current.classList.remove('step-active');
    var next = document.getElementsByClassName('step')[currentStep];
    next.classList.add('step-active');

    if (document.getElementsByClassName('overlay').length > 0)
        document.getElementsByClassName('overlay')[0].classList.remove('overlay');

    changeProperties(steps[currentStep].description, steps[currentStep].properties);
    await generate(steps[currentStep]);
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

    var table = document.getElementById('data-sample');
    var body = table.querySelector('tbody');
    get(function(data) {
        var item = data.find(d => d['Title'] == sample_title);
        dictionary.forEach(field => {
            var row = document.createElement('tr');
            var name = document.createElement('td');
            var value = document.createElement('td');
            var desc = document.createElement('td');
            name.textContent = field.name;
            value.textContent = item[field.name];
            desc.textContent = field.description;
            row.appendChild(name);
            row.appendChild(value);
            row.appendChild(desc);
            body.appendChild(row);
        });
    });

    changeStep(0);
}

setup();

window.addEventListener('resize', () => {
    var chart = document.getElementById('chart');
    var height = chart.height.baseVal.value;
    var width = chart.width.baseVal.value;
    var containerWidth = document.getElementById('vis').offsetWidth;
    var containerHeight = document.getElementById('vis').offsetHeight;
    if (containerWidth < 500)
        return;
    console.log(containerWidth);
    chart.style.transform = 'scale(' + (1 + (1 - width / containerWidth)) + ')';
    console.log(chart.style.transform);
    chart.style.marginLeft = ((containerWidth - width) / 2);
    chart.style.marginTop = ((containerHeight - height) / 2);
});
