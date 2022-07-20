var currentStep = 0;
var steps = [
    {
        'name': 'Introduction',
        'description': ''
    },
    {
        'name': 'Step 1',
        'description': ''
    },
    {
        'name': 'Step 2',
        'description': ''
    },
    {
        'name': 'Step 3',
        'description': ''
    },
    {
        'name': 'Conclusion',
        'description': ''
    }
]

var setup = function() {
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
}

var changeStep = function(modifier) {
    currentStep += modifier;
    if (currentStep < 0)
        currentStep = steps.length - 1;
    if (currentStep > steps.length - 1)
        currentStep = 0;
    var current = document.getElementsByClassName('step-active')[0];
    current.classList.remove('step-active');
    var next = document.getElementsByClassName('step')[currentStep];
    next.classList.add('step-active');
}

setup();

get(function(data) {
    console.log(data);
});