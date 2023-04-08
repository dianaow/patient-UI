import { select } from 'd3-selection';
import { groups } from 'd3-array';
import {
  tooltipContent,
  tooltipClickContent,
  getLabelColor,
} from './consts.js';

export default function Details({
  containerId,
  ID,
  width,
  dataset,
  outerAccessorCol,
  innerAccessorCol,
  colorAccessorCol,
  selectedDate,
  showPrevious,
  title,
}) {
  let clicked = false;

  const tooltip = select('#tooltip');

  const ghostGrps = [
    { ghostGroup: 1, value: 'Urine', rows: 1 },
    { ghostGroup: 1, value: 'U&Es', rows: 2 },
    { ghostGroup: 1, value: 'LFT & Bone', rows: 3 },
    { ghostGroup: 2, value: 'Haematology', rows: 5 },
    { ghostGroup: 3, value: 'Radiology', rows: 4 },
  ];

  const widthPercs = ['35%', '50%', '15%'];

  dataset.forEach((d) => {
    d.ghostGroup = ghostGrps.find((g) => g.value === d['Category']).ghostGroup;
  });
  

  const data = groups(
    dataset,
    (d) => d['ghostGroup'],
    (d) => d[outerAccessorCol],
    (d) => d['Row'],
    (d) => d[innerAccessorCol]
  );

  const colorAccessor = (d) => d[colorAccessorCol];

  const colorAccessorScaled = (d) => colorAccessor(d);

  if (ID === 1) {
    select(`#${containerId}`)
      .append('div')
      .style('margin', '0px 0px 5x 0px')
      .style('color', '#555')
      .html('Selected date');

    select(`#${containerId}`)
      .append('h3')
      .style('margin', '5px 0px 30px 0px')
      //.style('text-align', 'center')
      .html(
        selectedDate.getDate() +
          ' ' +
          selectedDate.toLocaleString('default', { month: 'short' }) +
          ' ' +
          selectedDate.getFullYear()
      );
  }

  select(`#${containerId}`)
    .append('div')
    //.style('text-align', 'center')
    .style('font-family', 'Montserrat')
    .style('font-weight', 'bold')
    .style('margin', '40px 0px 10px 0px')
    .html(title);

  const container = select(`#${containerId}`)
    .append('div')
    .attr('id', 'details' + ID)
    .attr('width', width)
    .style('display', 'flex')
    //.style('flex-wrap', 'wrap')
    .style('background-color', 'white')
    .style('border-radius', '10px')
    .style('box-shadow', '5px 10px 10px rgb(0 0 0 / 0.2)')
    .style('padding', '5px');

  container
    .selectAll('.groups')
    .data(data, (d) => d[0])
    .join(
      (enter) => {
        const root = enter
          .append('div')
          .attr('class', (_, i) => `groups group-${i}`)
          .style('width', (_, i) => widthPercs[i]);

        return root;
      },
      (update) => update
    )
    .append('div')
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .selectAll('.boxes')
    .data(
      (d) => d[1],
      (d, i) => d[0] + '-' + i
    )
    .join(
      (enter) => {
        const root = enter
          .append('div')
          .attr('class', (_, i) => `boxes box-${i}`)
          .style('border-radius', '8px')
          .style(
            'background',
            'linear-gradient(to bottom right, #efefef, white)'
          )
          .style('margin', '6px');

        root
          .append('p')
          .style('border-bottom', '1px solid black')
          .style('padding', '2px 6px')
          .style('font-weight', 'black')
          .style('font-size', '10px')
          .style('font-family', 'Montserrat')
          .html((d) => d[0]);

        return root;
      },
      (update) => update
    )
    .append('div')
    .selectAll('.marker-group-row')
    .data(
      (d) => d[1],
      (d, i) => d[0] + '-' + i
    )
    .join(
      (enter) => {
        return enter
          .append('div')
          .attr('class', (d) => `marker-group-row marker-group-row-${d[0]}`)
          .style('display', 'flex')
          .style('justify-content', 'center');
      },
      (update) => update
    )
    .selectAll('.marker-group')
    .data(
      (d) => d[1],
      (d, i) => d[0] + '-' + i
    )
    .join(
      // append markers inside each div
      (enter) => {
        const root = enter
          .append('div')
          .attr('class', (d) => `marker-group marker-group-${d[0]}`)
          .style('display', 'flex')
          .style('flex-direction', 'column')
          .style('padding', '2.5px')
          .style('width', '36px')
          .style('height', '42px');

        const markerGroup = root
          .append('div')
          .style('position', 'relative')
          .style('width', '36px')
          .style('height', '18px');

        const markers = markerGroup
          .selectAll('.marker')
          .data(
            (d) =>
              d[1].filter(
                (d) =>
                  d.timestamp &&
                  d.timestamp.getTime() === selectedDate.getTime()
              ),
            (d) => d[outerAccessorCol] + '-' + d[innerAccessorCol]
          )
          .join(
            (enter) => {
              const markerCurrent = enter
                .append('div')
                .style('position', 'absolute')
                .attr('class', 'marker marker-current')
                .style('top', '4px')
                .style('left', '13px')
                .style('width', '10px')
                .style('height', '10px')
                .style('background-color', colorAccessorScaled)
                .style('border', colorAccessorScaled)
                .style('border-radius', '5px')
                .on('click', onClick)
                .on('mouseover', onMouseEnter)
                .on('mouseout', onMouseLeave);

              enter
                .filter((d) => d['Episode static'])
                .append('div')
                .style('position', 'absolute')
                .attr('class', 'marker-text')
                .style('left', '5px')
                .attr('width', '16px')
                .attr('height', '5px')
                .style('font-size', '8px')
                .style('color', colorAccessorScaled)
                .html((d) => d['Episode static']);

              return markerCurrent;
            },
            (update) => update
          );

        root
          .append('div')
          .style('font-size', '10px')
          .style('font-color', '#555')
          .style('text-align', 'center')
          .style('color', (d) => getLabelColor(d[1], selectedDate))
          .html((d) => d[0]);

        return root;
      },
      (update) => update
    );

  function onMouseEnter(e, datum) {
    action(e, datum);
    tooltip.html(tooltipContent(datum));
  }

  function onClick(e, datum) {
    //if (clicked) {
    tooltip.style('opacity', 0);
    //} else {
    action(e, datum);
    tooltip.html(tooltipClickContent(datum));
    clicked = !clicked;
    //}
  }

  function action(e, datum) {
    const x = e.x;
    const y = e.y;
    tooltip
      .style('opacity', 1)
      .style(
        'transform',
        `translate(` +
          `calc( -50% + ${x}px),` +
          `calc(-100% + ${y + window.scrollY}px)` +
          `)`
      );
  }

  function onMouseLeave() {
    if (clicked) return;
    setTimeout(function () {
      tooltip.style('opacity', 0);
    }, 350);
  }
}
