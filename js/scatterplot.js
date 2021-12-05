import getAndPrepareData from "./getAndPrepareData.js";
import tooltip from "./tooltip.js";
import legend from "./legend.js";

getAndPrepareData().then(({ years, times, names, doping }) => {
    // graph constants
    const w = 500;
    const h = 360;
    const paddingX = 60;
    const paddingY = 40;
    const colors = ['#07B260', '#FF930A'];
    const formatTime = d3.timeFormat('%M:%S');
    // tooltip
    const { handleMouseover, handleMouseout, getGraphRect } = tooltip();

    const scatterPlot = d3.select('div.graph-container')
        .append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`)
        .attr('preserveAspectRatio', 'xMinYMin meet');

    // define xScale...
    const xScale = d3.scaleLinear()
        // (extend domain by 2 year for better visualization)
        .domain([d3.min(years, year => year - 1), d3.max(years, year => year + 1)])
        .range([paddingX, w - paddingX]);
    // ...and x axis
    const xAxis = d3.axisBottom(xScale).ticks(10, '');
    // define yScale...
    const yScale = d3.scaleTime()
        .domain([d3.max(times, time => time), d3.min(times, time => time)])
        .range([h - paddingY, paddingY]);
    // ...and y axis
    const yAxis = d3.axisLeft(yScale).ticks(10, '%M:%S');

    // draw x axis
    scatterPlot.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${h - paddingY})`)
        .call(xAxis);
    // draw y axis
    scatterPlot.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${paddingX}, 0)`)
        .call(yAxis);

    scatterPlot.selectAll('circle')
        .data(years)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', d => d)
        .attr('data-yvalue', (d, i) => times[i])
        .attr('data-name', (d, i) => names[i])
        .attr('data-time', (d, i) => formatTime(times[i]))
        .attr('cx', xScale)
        .attr('cy', (d, i) => yScale(times[i]))
        .attr('r', 4)
        .attr('stroke', '#333')
        .attr('stroke-width', '0.5')
        .attr('fill', (d, i) => doping[i] === "" ? colors[0] : colors[1])
        .on('mouseover', handleMouseover)
        .on('mouseout', handleMouseout);

    legend(scatterPlot, colors);

    // get graph-area dims after drawing for tooltip position
    getGraphRect();
})