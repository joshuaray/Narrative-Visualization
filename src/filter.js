var default_data;

filterLabel = (container, name) => {
    var label = document.createElement('h3');
    label.classList.add('filter-name');
    label.textContent = name;
    container.appendChild(label);
}

setupFilters = (chart, data) => {
    default_data = data;
    var filters = [];

    document.querySelectorAll('filter').forEach(f => f.remove());
    var container = document.getElementById('filters');
    if ((chart.filters ?? []).length == 0) {
        container.parentElement.classList.add('hidden');
        return;
    }
    else 
        container.parentElement.classList.remove('hidden');
    chart.filters.forEach((f, i) => {
        var filterContainer = document.createElement('filter');
        filterContainer.id = 'filter-' + i;
        filterLabel(filterContainer, f.name);
        container.appendChild(filterContainer);
        filters.push(f.func(f, filterContainer, chart, data));
    });

    document.getElementById('filter-reset').onclick = () => {
        chart.content.func(chart.content, default_data);
        for (var x = 0; x < filters.length; x++)
            filters[x].reset(default_data);
    };
    document.getElementById('filter-apply').onclick = () => {
        var filtered = default_data;
        for (var x = 0; x < filters.length; x++)
            filtered = filters[x].filter(filtered);
            console.log(filtered);
        chart.content.func(chart.content, filtered);
    }
}
