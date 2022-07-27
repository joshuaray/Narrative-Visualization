const annotationType = {
    'label': d3.annotationLabel,
    'circle': d3.annotationCalloutCircle,
    'rectangle': d3.annotationCalloutRect
};

var annotate = (annotations = []) => {
    if (annotations == null || annotations.length == 0)
        return;

    annotations.forEach(annotation => {
        var props = annotation;
        if (annotation.location != null)
            props = annotation.location(props);

        d3.select('svg')
            .append('g')
            .attr('opacity', 0)
            .attr('class', 'chart-annotation annotation-group ' + props.note.class)
            .call(d3.annotation()
                .editMode(false)
                .notePadding(15)
                .type(props.type)
                .annotations([props]))
            .transition()
            .delay(150)
                .attr('opacity', 1);
    });    
}