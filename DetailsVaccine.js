import { select } from 'd3-selection';
import { groups } from 'd3-array';
import { tooltipVaccineContent, tooltipVaccineClickContent } from './consts.js';

export default function DetailsVaccine({
  containerId,
  ID,
  width,
  dataset,
  outerAccessorCol,
  innerAccessorCol,
  selectedDate,
}) {
  let clicked = false;

  const tooltip = select('#tooltip');

  const getLabelColor = (d) => {
    if (!d['Status 1']) {
      return '#d3d3d3';
    } else if (d['Status 1'] && d['Status 1'] !== 'Missed') {
      return 'black';
    } else {
      return 'red';
    }
  };

  const ghostGrps = [
    { ghostGroup: 1, value: 'C-19 vax' },
    { ghostGroup: 1, value: 'Flu vax' },
    { ghostGroup: 1, value: 'Pneumo vax' },
    { ghostGroup: 1, value: 'Other vax' },
    { ghostGroup: 2, value: 'HAV vax' },
    { ghostGroup: 3, value: 'HBV vax' },
    { ghostGroup: 4, value: 'HPV vax' },
    { ghostGroup: 4, value: 'MPV vax' },
  ];

  const widthPercs = ['30%', '15%', '15%', '30%'];

  dataset.forEach((d) => {
    d.ghostGroup = ghostGrps.find(
      (g) => g.value === d['Name of vax']
    ).ghostGroup;
    d;
  });

  const data = groups(
    dataset.filter(
      (v, i, a) =>
        a.findIndex((v2) => v2['Name of vax'] === v['Name of vax']) === i
    ),
    (d) => d['ghostGroup']
  );
  
  const getColor = (d) => {
    if (d.timestamp && d.timestamp.getTime() <= selectedDate.getTime()) {
      return 'green';
    } else if (
      d.timestamp_due_end &&
      d.timestamp_due_end.getTime() > selectedDate.getTime() &&
      d.timestamp_due_start.getTime() < selectedDate.getTime()
    ) {
      return d.color;
    } else {
      return 'none';
    }
  };

  select(`#${containerId}`)
    .append('div')
    //.style('text-align', 'center')
    .style('font-family', 'Montserrat')
    .style('font-weight', 'bold')
    .style('margin', '40px 0px 10px 0px')
    .html('Vaccine');

  const container = select(`#${containerId}`)
    .append('div')
    .attr('id', 'details' + ID)
    .attr('width', width)
    .style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('background-color', 'white')
    .style('border-radius', '10px')
    .style('box-shadow', '5px 10px 10px rgb(0 0 0 / 0.2)')
    .style('padding', '15px');

  container
    .selectAll('.ghost-boxes')
    .data(data, (d) => d[0])
    .join(
      (enter) => {
        const root = enter
          .append('div')
          .attr('class', (_, i) => `ghost-boxes box-${i}`)
          .style('border-radius', '8px')
          .style(
            'background',
            'linear-gradient(to bottom right, #efefef, white)'
          )
          .style('margin', '6px')
          .style('width', (_, i) => widthPercs[i])
          .style('display', 'flex')
          .style('flex-direction', 'row')
          .style('justify-content', 'center');

        const markers = root
          .selectAll('.marker')
          .data(
            (d) => d[1],
            (d) => d[outerAccessorCol] + '-' + d[innerAccessorCol]
          )
          .join(
            (enter) => {
              const markerCurrent = enter
                .append('div')
                //.style('position', 'absolute')
                .attr('class', 'marker marker-current')
                .style('width', '50px')
                .style('min-height', '280px')
                .on('click', getColor(d) !== 'none' ? onClick : null)
                .on('mouseover', getColor(d) !== 'none' ? onMouseEnter : null)
                .on('mouseout', getColor(d) !== 'none' ? onMouseLeave : null);

              const marker = markerCurrent.append('div').style('width', '30px');

              marker
                .append('svg')
                .attr('viewBox', '0 0 512 512')
                .append('path')
                .attr('fill', (d) => getColor(d))
                .attr('stroke-width', '0px')
                .attr(
                  'd',
                  'M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V43.5c0 49.9-60.3 74.9-95.6 39.6L120.2 75C107.7 62.5 87.5 62.5 75 75s-12.5 32.8 0 45.3l8.2 8.2C118.4 163.7 93.4 224 43.5 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H43.5c49.9 0 74.9 60.3 39.6 95.6L75 391.8c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l8.2-8.2c35.3-35.3 95.6-10.3 95.6 39.6V480c0 17.7 14.3 32 32 32s32-14.3 32-32V468.5c0-49.9 60.3-74.9 95.6-39.6l8.2 8.2c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-8.2-8.2c-35.3-35.3-10.3-95.6 39.6-95.6H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H468.5c-49.9 0-74.9-60.3-39.6-95.6l8.2-8.2c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-8.2 8.2C348.3 118.4 288 93.4 288 43.5V32zM176 224a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm128 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z'
                );

              marker
                .append('div')
                .style('font-size', '10px')
                .style('font-color', '#555')
                .style('text-align', 'center')
                .style('color', (d) => getLabelColor(d))
                .html((d) => d['Name of vax']);

              return marker;
            },
            (update) => update
          );

        return root;
      },
      (update) => update
    );

  function onMouseEnter(e, datum) {
    action(e, datum);
    tooltip.html(tooltipVaccineContent(datum));
  }

  function onClick(e, datum) {
    action(e, datum);
    tooltip.html(tooltipVaccineClickContent(datum));
    clicked = !clicked;
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
