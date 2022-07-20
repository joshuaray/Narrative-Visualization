var dataSource = './data/data.csv';

var get = function(callback) {
    d3.csv(dataSource, function(data) {
        callback(data);
    });
}