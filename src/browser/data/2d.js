//https://stackoverflow.com/questions/2405772/is-there-a-way-to-dynamically-extend-the-html5-canvas-without-clearing-whats-dr
const margin = { top: 20, right: 20, bottom: 40, left: 100 };
const height = 700 - margin.top - margin.bottom;
const width = 1600/**4*5*/ - margin.left - margin.right;

function showTimeSince(startTime) {
    const currentTime = new Date().getTime();
    const runtime = currentTime - startTime;
    document.getElementById('timeRendering').innerHTML = runtime + 'ms';
}

function paintCanvas(canvas, data, x, y, xKey, yKey) {
    let startTime = new Date().getTime();

    const context = canvas.getContext("2d");

    let i = 0;
    function doABatch() {
        for (var j = 0; j < 50000 && i < data.length; j++ && i++) {
            const d = data[i];
            context.fillStyle = d3.hsl((d.hue/255)*360, 1, 0.5, 0.01);
            context.fillRect(x(d[xKey]), y(d[yKey]), 0.5, 0.5);
        }
        showTimeSince(startTime);
        if (i < data.length) {
            setTimeout(doABatch, 0);
        }
    }
    doABatch();
}

function makeACanvas(data, xKey, yKey, domains) {
    // Make a container div for our graph elements to position themselves against
    const graphDiv = d3.select('body')
        .append('div')
        .style('position', 'relative')
        .style('height', height + margin.top + margin.bottom + 'px')
        .style('width', width + margin.left + margin.right + 'px');

    // Make a canvas for the points
    const canvas = graphDiv.selectAll('canvas').data([0]);
    canvas.enter().append('canvas')
        .attr('height', height)
        .attr('width', width)
        .style('position', 'absolute')
        .style('top', margin.top + 'px')
        .style('left', margin.left + 'px');

    // Make an SVG for axes
    const svg = graphDiv.selectAll('svg').data([0]);
    svg.enter().append('svg')
        .style('position', 'absolute')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    // Create groups for axes
    const xAxisG = svg.selectAll('g.' + xKey).data([0]);
    xAxisG.enter().append('g')
        .attr('class', 'x')
        .attr('transform', 'translate(' + margin.left + ', ' + (margin.top + height) + ')')
        .append('text')
        .attr('text-anchor', 'left')
        .attr("transform", `translate(0,30)`)
        .text(xKey);

    const yAxisG = svg.selectAll('g.' + yKey).data([0]);
    yAxisG.enter().append('g')
        .attr('class', 'y')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .append('text')
        .attr('text-anchor', 'left')
        .attr("transform", `rotate(-90) translate(-${height},-30)`)
        .text(yKey);

    // Create scales
    const x = d3.scale.linear()
        .domain(domains[xKey])
        .range([0, width]);
    const y = d3.scale.linear()
        .domain(domains[yKey])
        .range([height, 0]);

    // Create axes
    const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        // .ticks(150);
    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');
    xAxisG.call(xAxis);
    yAxisG.call(yAxis);

    paintCanvas(canvas.node(), data, x, y, xKey, yKey);
}

d3.csv("../data/878452Wc4n1uEFvZ.csv", function(data) {

    console.log('data loaded');

    const makeADomain = (data, key) => d3.extent(data, d => +d[key]);
    const domains = {
        birthdate: makeADomain(data, 'birthdate'),
        age: makeADomain(data, 'age'),
        position: makeADomain(data, 'position'),
        ballRadius: makeADomain(data, 'ballRadius'),
        mutationRate: makeADomain(data, 'mutationRate'),
        generation: makeADomain(data, 'generation'),
        hue: makeADomain(data, 'hue'),
        restitution: makeADomain(data, 'restitution')
    };

    makeACanvas(data, 'birthdate', 'generation', domains);
    makeACanvas(data, 'birthdate', 'age', domains);
    makeACanvas(data, 'birthdate', 'position', domains);
    makeACanvas(data, 'birthdate', 'ballRadius', domains);
    makeACanvas(data, 'birthdate', 'hue', domains);
    makeACanvas(data, 'birthdate', 'mutationRate', domains);
    makeACanvas(data, 'birthdate', 'restitution', domains);

    makeACanvas(data, 'generation', 'age', domains);
    makeACanvas(data, 'generation', 'ballRadius', domains);
    makeACanvas(data, 'generation', 'hue', domains);
    makeACanvas(data, 'generation', 'mutationRate', domains);
    makeACanvas(data, 'generation', 'restitution', domains);

    makeACanvas(data, 'position', 'generation', domains); // TODO Add width argument
    makeACanvas(data, 'position', 'age', domains); // TODO Add width argument
    makeACanvas(data, 'position', 'ballRadius', domains); // TODO Add width argument
    makeACanvas(data, 'position', 'hue', domains); // TODO Add width argument
    makeACanvas(data, 'position', 'mutationRate', domains); // TODO Add width argument
    makeACanvas(data, 'position', 'restitution', domains); // TODO Add width argument

    makeACanvas(data, 'age', 'generation', domains); // TODO Add width argument
    makeACanvas(data, 'age', 'ballRadius', domains); // TODO Add width argument
    makeACanvas(data, 'age', 'mutationRate', domains); // TODO Add width argument
    makeACanvas(data, 'age', 'restitution', domains); // TODO Add width argument

    makeACanvas(data, 'hue', 'age', domains); // TODO Add width argument
    makeACanvas(data, 'hue', 'ballRadius', domains); // TODO Add width argument
    makeACanvas(data, 'hue', 'mutationRate', domains); // TODO Add width argument
    makeACanvas(data, 'hue', 'restitution', domains); // TODO Add width argument
});
