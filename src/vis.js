var datasource = '../data/data.csv';
var container = 'div#vis';
var font = "'Noto Sans', sans-serif";

var width = () => document.getElementById('vis').offsetWidth - margin.left - margin.right;
var height = () => document.getElementById('vis').offsetHeight - margin.top - margin.bottom;
var margin = {left: 150, right: 100, top: 50, bottom: 100};

var startingOpacity = 0.0;
var animationDelay = 200;

var get = async function(callback) {
    var data = await d3.csv(datasource);
    callback(data);
}

var destroy = () => {
    d3.select('#chart').remove();
}

var getSvg = () => {
    destroy();

    var svg = d3.select(container)
        .append('svg')
            .attr('id', 'chart')
            .attr('width', width() + margin.left + margin.right)
            .attr('height', height() + margin.top + margin.bottom)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    return svg;
}

var labels = (x, y, title) => {
    var svg = d3.select('svg');
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('y', margin.left / 4)
        .attr('x', height() / 2 * -1)
        .attr('dy', '12px')
        .attr('transform', 'rotate(-90)')
        .text(y)
        .style('font-size', '.8em')
        .attr('opacity', startingOpacity)
        .transition()
            .delay(animationDelay)
            .attr('opacity', 1)
            .style('font-size', '1em');
    
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('y', height() + margin.bottom)
        .attr('x', width() / 2 + margin.left)
        .attr('dy', '18px')
        .text(x)
        .style('font-size', '.8em')
        .attr('opacity', startingOpacity)
        .transition()
            .delay(animationDelay)
            .attr('opacity', 1)
            .style('font-size', '1em');

    svg.append('text')
        .attr('class', 'title')
        .attr('text-anchor', 'middle')
        .style('text-align', 'center')
        .attr('y', 15)
        .attr('x', width() / 2 + margin.left)
        .attr('dy', '12px')
        .style('font-size', '1em')
        .style('font-weight', 'bold')
        .text(title)
        .attr('opacity', 0)
        .transition()
            .delay(animationDelay)
            .attr('opacity', 1);
}

var colorlegend = (colors = [], min, max, title) => {
    var svg = d3.select('svg');
    var grad = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'grad')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');
    
    colors.forEach((c, i) => {
        var stop = grad.append('stop');
        stop.style('stop-color', c)
            .attr('offset', 100 * (i / (colors.length)) + '%');
        var stop2 = grad.append('stop');
        stop2.style('stop-color', c)
            .attr('offset', 100 * ((i == 0 ? 1 : i + 1) / (colors.length)) - 1 + '%')
    });

    var g = svg.append('g').attr('fill','white');
    g.append('rect')
        .attr('width', '20')
        .attr('height', 200)
        .attr('stroke', 'black')
        .attr('fill', 'url(#grad)')
        .attr('x', (width() + margin.left + margin.right / 2))
        .attr('y', margin.top)
        .attr('opacity', 0)
        .transition()
            .delay(animationDelay * 5)
            .attr('opacity', 1);
    
    g.append('text')
        .attr('class', 'colorlegend-text colorlegend-min')
        .text(min)
        .attr('x', width() + margin.right / 2 + margin.left - 2.5)
        .attr('y', margin.top - 5)
        .style('font-weight', 'bold')
        .style('font-size', '8pt')
        .attr('fill','black')
        .attr('opacity', 0)
        .transition()
            .delay(animationDelay * 5)
            .attr('opacity', 1);
        
    g.append('text')
        .attr('class', 'colorlegend-text colorlegend-max')
        .text(max)
        .attr('x', width() + margin.right / 2 + margin.left - 2.5)
        .attr('y', margin.top + 215)
        .style('font-weight', 'bold')
        .style('font-size', '8pt')
        .attr('fill','black')
        .attr('opacity', 0)
        .transition()
            .delay(animationDelay * 5)
            .attr('opacity', 1);
    
    g.append('text')
        .attr('class', 'colorlegend-title')
        .text(title)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(90)')
        .attr('y', (width() + margin.right + margin.left - 25) * -1)
        .attr('x', margin.top * 2)
        .style('width', '100%')
        .style('height', 'auto')
        .style('font-weight', 'bold')
        .style('font-size', '.8em')
        .attr('fill','black')
        .attr('opacity', 0)
        .transition()
            .delay(animationDelay * 5)
            .attr('opacity', 1);
}

var scatterplot = (data, title = '', xmin = 0, xmax, ymin = 0, ymax, xkey = '', ykey = '', radiusKey = '', colortitle = '', colorbuckets = [], colorfunc = (x) => 0) => {
    var svg = getSvg();
    xmax = xmax * 1.05;
    ymax = ymax * 1.05;

    var colors = ['white','blue'];
    var color = d3.scaleLinear().domain([colorbuckets[0], colorbuckets[colorbuckets.length - 1]]).range(colors);
    var x = d3.scaleLinear().domain([xmin, xmax]).range([0, width()]);
    var y = d3.scaleLinear().domain([ymin, ymax]).range([height(), 0]);

    var grid = svg.append('g')
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    grid.append('g').attr('transform', 'translate(0,' + height() + ')').call(d3.axisBottom(x))
        .call(g => g.selectAll('.tick').attr('opacity', 0).transition().delay((d, i) => 200 + i * 200).attr('opacity', 1))
        .call(g => g.selectAll('path.domain').attr('stroke-opacity', 0).transition().delay(1000).attr('stroke-opacity', 1));

    svg.append('g')
        .call(d3.axisLeft(y))
        .call(g => g.selectAll('.tick').attr('opacity', 0).transition().delay((d, i) => 200 + i * 100).attr('opacity', 1))
        .call(g => g.selectAll('path.domain').attr('stroke-opacity', 0).transition().delay(500).attr('stroke-opacity', 1));

    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', (d) => x(d[xkey]))
            .attr('cy', (d) => y(d[ykey]))
            .attr('r', (d) => (1 + (radiusKey == null ? 0 : Number(d[radiusKey]))) * 0.2)
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .style('opacity', 0.1)
            .style('fill', (d) => color(colorfunc(d)))
            .transition()
                .delay((d, i) => 250 + 30 * d[radiusKey])
                .style('opacity', 1)
            .transition()
                .delay((d, i) => 100 + 30 * d[radiusKey])
                .attr('r', (d) => 1 + (radiusKey == null ? 0 : Number(d[radiusKey])));

    labels(xkey, ykey, title);
    colorlegend(colorbuckets.map(c => color(c)), colorbuckets[0], colorbuckets[colorbuckets.length - 1], colortitle);
}

var stackedbar = (data, title = '', columngroups = [], stackgroups = [], heightkey = '', xkey = '', ymin = 0, ymax, colortitle = '', columnfunc = (row, column) => false, groupfunc = (row, group) => false) => {
    var svg = getSvg();
    ymax = ymax * 1.05;

    stackgroups = stackgroups.sort((a,b) => a - b);

    var color = d3.scaleLinear()
        .domain([0, stackgroups.length - 1])
        .range(['orange', 'blue']);

    var stacks = columngroups.map(col => {
        return data.filter(d => columnfunc(d, col))
            .flatMap(d => stackgroups
                .filter(s => groupfunc(d, s))
                    .map(group => {
                        return {groupindex: stackgroups.indexOf(group), group: group, columnindex: columngroups.indexOf(col), column: col, value: Number(d[heightkey])};
                    }) 
        )
    });

    var columnOrder = stacks.flatMap(s => s.map(x => x.columnindex)
        .filter((v, i, a) => a.indexOf(v) == i)
        .map(x => { 
            return { 
                columnindex: x, 
                column: stacks[x][0].column, 
                value: stacks[x].map(z => z.value).reduce((a,b) => a + b) } 
            })).sort((a, b) => -1 * (a.value - b.value)).map(m => m.column);

    stacks = stacks.map(s => s.map(x => x.groupindex + '|' + x.columnindex)
        .filter((v, i, a) => a.indexOf(v) == i)
        .map(x => { 
            return { 
                groupindex: x.split('|')[0], 
                columnindex: columnOrder.indexOf(stacks[x.split('|')[1]].find(y => y.groupindex == x.split('|')[0]).column), 
                group: stacks[x.split('|')[1]].find(y => y.groupindex == x.split('|')[0]).group, 
                column: stacks[x.split('|')[1]].find(y => y.groupindex == x.split('|')[0]).column, 
                value: stacks[x.split('|')[1]].filter(z => z.groupindex == x.split('|')[0]).map(z => z.value).reduce((a,b) => a + b) } 
            })).sort((a, b) => -1 * (a.map(z => z.value).reduce((x,y) => x + y) - b.map(z => z.value).reduce((x,y) => x + y)));

    var x = d3.scaleBand().domain(columnOrder).range([0, width()]).padding([0.2]);
    var y = d3.scaleLinear().domain([ymin, ymax]).range([height(), 0]);
        
    svg.append('g').attr('class', 'x-axis')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(0,' + height() + ')')
        .call(d3.axisBottom(x))
        .call(g => g.selectAll('.tick').attr('opacity', 0).transition().delay((d, i) => 200 + i * 50).attr('opacity', 1))
        .call(g => g.selectAll('path.domain').attr('stroke-opacity', 0).transition().delay(100).attr('stroke-opacity', 1));

    svg.append('g')
        .call(d3.axisLeft(y))
        .call(g => g.selectAll('.tick').attr('opacity', 0).transition().delay((d, i) => 200 + i * 75).attr('opacity', 1))
        .call(g => g.selectAll('path.domain').attr('stroke-opacity', 0).transition().delay(100).attr('stroke-opacity', 1));

    yfunc = (row) => stacks[row.columnindex].filter(s => s.groupindex < row.groupindex).map(s => s.value).reduce((a,b) => a + b, 0);

    svg.append('g')
        .selectAll('g')
        .data(stacks)
        .enter()
        .append('g')
            .selectAll()
            .data((d) => d)
            .enter()
            .append('rect')
            .attr('fill', (d) => color(d.groupindex))
            .attr('group', (d) => d.group)
            .attr('x', (d) => x(d.column))
            .attr('y', (d) => -1 * y(yfunc(d) + d.value) + y(yfunc(d) + d.value) * 0.01)
            .attr('opacity', 0)
            .attr('width', x.bandwidth())
            .attr('height', (d) => y(0))
            .transition()
                .delay((d, i) => 150 * i)
                .attr('opacity', 1)
                .attr('y', (d) => y(yfunc(d) + d.value))
                .attr('height', (d) => y(yfunc(d)) - (y(d.value + yfunc(d))));
                // .transition()
                //     .delay(100)
                //     .attr('opacity', 1);

    svg.select('.x-axis')
        .selectAll('text')
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(45)');

    var sortedcolors = stackgroups.sort((a,b) => a - b);
    labels(xkey, heightkey, title);
    colorlegend(stackgroups.map((c,i) => color(i)), sortedcolors[0], sortedcolors[sortedcolors.length - 1], colortitle);
}