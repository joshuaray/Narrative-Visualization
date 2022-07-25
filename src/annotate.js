const annotationType = {
    'label': d3.annotationLabel,
    'circle': d3.annotationCalloutCircle
};

var annotate = (annotations = []) => {
    d3.select('svg')
        .append('g')
        .attr('class', 'annotation-group ' + annotations[0].note.class)
        .call(d3.annotation()
            .editMode(false)
            .notePadding(15)
            .type(annotationType['circle'])
            .annotations(annotations));
}