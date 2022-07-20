var datasource = '../data/data.csv';
var container = 'div#vis';
var width = () => document.getElementById('vis').offsetWidth - margin.left - margin.right;
var height = () => document.getElementById('vis').offsetHeight - margin.top - margin.bottom;
var margin = {left: 100, right: 100, top: 50, bottom: 50};

var get = async function(callback) {
    var data = await d3.csv(datasource);
    callback(data);
}

var destroy = () => {
    d3.select('#chart').remove()
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

var scatterplot = (data, xmin = 0, xmax, ymin = 0, ymax, xkey, ykey) => {
    var svg = getSvg();

    var x = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([0, width()]);
    svg.append('g')
        .attr('transform', 'translate(0,' + height() + ')')
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([height(), 0]);
    svg.append('g')
        .call(d3.axisLeft(y));

    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', function(d) { return x(d[xkey]) })
            .attr('cy', function(d) { return y(d[ykey]) })
            .attr('r', 1.5)
            .style('fill', 'blue');
}

var barchart = () => {
    var svg = getSvg();
}