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

    grad.selectAll('stop')
        .data(colors)
        .enter()
        .append('stop')
        .style('stop-color', function(d){ return d; })
        .attr('offset', function(d,i){
            return 100 * (i / (colors.length - 1)) + '%';
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

var scatterplot = (data, title, xmin = 0, xmax, ymin = 0, ymax, xkey, ykey, radiusKey, colormin = 0, colormax = 0, colortitle = '', colorfunc = (x) => 0) => {
    var svg = getSvg();
    xmax = xmax * 1.05;
    ymax = ymax * 1.05;

    var colors = ['white','blue'];
    var color = d3.scaleLinear().domain([colormin, colormax]).range(colors);
    var x = d3.scaleLinear().domain([xmin, xmax]).range([0, width()]);
    var y = d3.scaleLinear().domain([ymin, ymax]).range([height(), 0]);

    var grid = svg.append('g')
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    grid.append('g').attr('transform', 'translate(0,' + height() + ')').call(d3.axisBottom(x))
        .call(g => g.selectAll('.tick').attr('opacity', 0).transition().delay((d, i) => 200 + i * 200).attr('opacity', 1))
        .call(g => g.selectAll('path.domain').attr('stroke-opacity', 0).transition().delay(1000).attr('stroke-opacity', 1));

    svg.append('g')
        .call(d3.axisLeft(y))
        .call(g => g.selectAll('.tick').attr('opacity', 0).transition().delay((d, i) => 200 + i * 200).attr('opacity', 1))
        .call(g => g.selectAll('path.domain').attr('stroke-opacity', 0).transition().delay(1000).attr('stroke-opacity', 1));

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
    colorlegend(colors, colormin, colormax, colortitle);
}

var barchart = (data) => {
    var svg = getSvg();


}