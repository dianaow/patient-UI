import { map, max, groups } from 'd3-array';
import { select } from 'd3-selection';
import { scaleTime, scaleBand, scaleLinear } from 'd3-scale';
import Details from './Details';
import Axis from './Axis';
import { getYOrder, tooltipContentRange, tooltipClickContentRange } from './consts.js';

export default function Timeline2({
  containerId,
  width,
  margin,
  dataset,
  dataRanges,
  xAccessorCol,
  yAccessorCol,
  y2AccessorCol,
  y2Domain,
  yAxis,
  showPrevious,
}) {
  const tooltip = select('#tooltip');
  const panel = select('#detail-panel');

  const dimensions = {
    width,
    margin: {
      top: margin?.top ?? 60,
      right: margin?.right ?? 0,
      bottom: margin?.bottom ?? 0,
      left: margin?.left ?? 190,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;

  // Access data and create scales
  const xAccessor = (d) => d[xAccessorCol];
  const xStartAccessor = (d) => d['timestamp_due_start'];
  const xEndAccessor = (d) => d['timestamp_due_end'];

  const xScale = scaleTime()
    .domain([new Date(2022, 0, 1), new Date(2022, 11, 31)])
    .range([0, dimensions.boundedWidth * 0.9]);

  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const xStartAccessorScaled = (d) => xScale(xStartAccessor(d));
  const xEndAccessorScaled = (d) => xScale(xEndAccessor(d));

  let y2Range = y2Domain.map((d, i) =>
    y2Domain[i - 1] ? getYOrder(y2Domain[i - 1]).length * 20 : 0
  );
  y2Range = y2Range.map((elem, index) =>
    y2Range.slice(0, index + 1).reduce((a, b) => a + b)
  );
  y2Range = y2Range.map((d) => d + dimensions.margin.top);

  const yScale2 = scaleLinear()
    .domain(y2Domain.map((d, i) => i))
    .range(y2Range);
  const maxHeight =
    max(y2Range) +
    getYOrder(y2Domain[y2Domain.length - 1]).length * 20 +
    dimensions.margin.top;

  const svg = select(`#${containerId}`)
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', maxHeight);

  const g = svg
    .append('g')
    .attr('class', 'wrapper')
    .attr(
      'transform',
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  if (yAxis && yAxis.show) {
    y2Domain.map((d, i) => {
      const yDomain = getYOrder(d).reverse();
      const yScale = scaleBand()
        .range([yDomain.length * 20, 8])
        .domain(yDomain);
      //.padding(0.3); // gives some spacing between bars

      g.append('g')
        .attr('id', containerId + '-yAxis-' + i)
        .attr(
          'transform',
          `translate(${0}, ${y2Domain.length === 1 ? 0 : yScale2(i)})`
        );
      Axis({
        containerId: containerId + '-yAxis-' + i,
        dimensions: {
          boundedHeight: yDomain.length * 20,
        },
        dimension: 'y',
        scale: yScale,
        ticks: {
          ...yAxis.ticks,
          tickValues: yDomain,
        },
      });
    });
    g.append('g')
      .attr('id', containerId + '-yAxis2')
      .attr('transform', `translate(${-85}, ${0})`);
    Axis({
      containerId: containerId + '-yAxis2',
      dimensions: {
        boundedHeight: maxHeight,
        width: dimensions.boundedWidth * 0.9,
      },
      dimension: 'y2',
      scale: yScale2,
      ticks: {
        ...yAxis.ticks,
        tickValues: y2Domain,
      },
    });
  }

  const data = groups(
    dataset,
    (d) => d[xAccessorCol],
    (d) => d[y2AccessorCol],
    (d) => d[yAccessorCol]
  );

  let aggregatedData = [];
  data.forEach((d) => {
    d[1].forEach((d0) => {
      const yDomain = getYOrder(d0[0]).reverse();
      const yScale = scaleBand()
        .domain(yDomain)
        .range([yDomain.length * 20, 8]);
      d0[1].forEach((d1) => {
        aggregatedData.push({
          ...d1[1][0],
          index: d1[1][0],
          aggNumber: d1[1].length,
          y:
            yScale(d1[1][0][yAccessorCol]) +
            (y2Domain.length === 1 ? 0 : yScale2(y2Domain.indexOf(d0[0]))),
        });
      });
    });
  });

  const ranges = g
    .selectAll('.ranges')
    .data(dataRanges)
    .join(
      (enter) => {
        const markerCurrent = enter
          .append('g')
          .attr('class', (_, i) => `ranges range-${i}`);

        markerCurrent
          .append('line')
          .attr('class', (d, i) => `line-${i}`)
          .attr('x1', (d) => xStartAccessorScaled(d))
          .attr(
            'y1',
            (d) =>
              aggregatedData.find(
                (el) => el['Name of vax'] === d['Name of vax']
              ).y
          )
          .attr('x2', (d) => xEndAccessorScaled(d))
          .attr(
            'y2',
            (d) =>
              aggregatedData.find(
                (el) => el['Name of vax'] === d['Name of vax']
              ).y
          )
          .attr('stroke-width', 5)
          .attr('cursor', 'pointer')
          .attr('stroke', (d) => d['color'])
          .attr('fill', 'none');

        return markerCurrent;
      },
      (update) => update
    );

  const markers = g
    .selectAll('.markers')
    .data(aggregatedData)
    .join(
      (enter) => {
        const markerCurrent = enter
          .append('g')
          .attr('class', (_, i) => `markers marker-${i}`);

        markerCurrent
          .append('rect')
          .attr(
            'class',
            (d, i) => `rect-${d[xAccessorCol]}-${d['Name of vax']}`
          )
          .attr('transform', (d) => `rotate(45, ${xAccessorScaled(d)}, ${d.y})`)
          .attr('x', (d) => xAccessorScaled(d) - 5)
          .attr('y', (d) => d.y - 5)
          .attr('height', 10)
          .attr('width', 10)
          .attr('cursor', 'pointer')
          .attr('fill', (d) => d['color'])
          .on('mouseover', onHover)
          .on('mouseout', onHoverOut)
          .on('click', onClick);

        return markerCurrent;
      },
      (update) => update
    );

  function onHover(e, datum) {
    action(e, datum);
    tooltip.html(tooltipContentRange(datum));
  }

  function onHoverOut(e, datum) {
    tooltip.style('opacity', 0)
  }

  function onClick(e, datum) {
    action(e, datum);
    tooltip.html(tooltipClickContentRange(datum));
  }

  function action(e, datum) {
    panel.html('');
    let x = xAccessorScaled(datum);
    let y = e.y;

    tooltip
      .style('opacity', 1)
      .style(
        'transform',
        `translate(` +
          `calc( -50% + ${x + dimensions.margin.left}px),` +
          `calc(-100% + ${y}px)` +
          `)`
      );

    Details({
      containerId: 'detail-panel',
      width: window.innerWidth * 0.45,
      dataset,
      outerAccessorCol: 'category',
      innerAccessorCol: 'taxonomicCD',
      colorAccessorCol: 'color',
      selectedDate: datum.timestamp,
      selectedCategory: datum.category3 || datum.category2,
      showPrevious,
    });
  }
}
