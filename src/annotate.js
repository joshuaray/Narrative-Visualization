const annotationType = {
    'label': d3.annotationLabel,
    'circle': d3.annotationCalloutCircle,
    'rectangle': d3.annotationCalloutRect
};

var annotate = (annotations = []) => {
    if (annotations != null && annotations.length > 0)
        d3.select('svg')
            .append('g')
            .attr('opacity', 0)
            .attr('class', 'annotation-group ' + annotations[0].note.class)
            .call(d3.annotation()
                .editMode(false)
                .notePadding(15)
                .type(annotations[0].type)
                .annotations(annotations))
            .transition()
            .delay(annotations[0].delay)
                .attr('opacity', 1);
}