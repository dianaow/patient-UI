import { select } from 'd3-selection';
import { groups } from 'd3-array';
import {
  tooltipContent,
  tooltipClickContent,
  tooltipVaccineContent,
  tooltipVaccineClickContent,
  getLabelColor,
} from './consts.js';

export default function Details({
  containerId,
  ID,
  width,
  datasetBBI,
  datasetVaccine,
  outerAccessorCol,
  innerAccessorCol,
  colorAccessorCol,
  selectedDate,
  showPrevious,
  title,
}) {
  const tooltip = select('#tooltip');

  const getDataAndInRange = (d) => {
    if (new Date(d['Date']).getTime() === selectedDate.getTime()) {
      return true;
    } else if (
      new Date(d['Date due end']).getTime() >= selectedDate.getTime() &&
      new Date(d['Date due start']).getTime() <= selectedDate.getTime()
    ) {
      return true;
    } else {
      return false;
    }
  };

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
    .style('flex-direction', 'column')
    //.style('flex-wrap', 'wrap')
    .style('background-color', 'white')
    .style('border-radius', '10px')
    .style('box-shadow', '5px 10px 10px rgb(0 0 0 / 0.2)')
    .style('padding', '5px');

  const dataBBI = groups(
    datasetBBI,
    (d) => d[outerAccessorCol],
    (d) => d['Row'],
    (d) => d[innerAccessorCol]
  );

  const containerBBIWrapper = container.append('div').style('display', 'flex');

  containerBBIWrapper
    .selectAll('.boxes')
    .data(dataBBI, (d) => d[0])
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
          .style('margin', '3px')
          .style(
            'width',
            (_, i) => ['22%', '14%', '10%', '22%', '16%', '10%'][i]
          );

        root
          .append('p')
          .style('border-bottom', '1px solid black')
          .style('padding', '2px 6px')
          .style('font-weight', 'black')
          .style('font-size', '11px')
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
          .style('width', '39px')
          .style('height', '42px');

        const markerGroup = root
          .append('div')
          .style('position', 'relative')
          .style('width', '39px')
          .style('height', '18px');

        const markers = markerGroup
          .selectAll('.marker')
          .data(
            (d) =>
              d[1]
                .filter((d) => d.timestamp <= selectedDate)
                .sort((a, b) => a['timestamp'] - b['timestamp'])
                .slice(-5),
            (d) => d[outerAccessorCol] + '-' + d[innerAccessorCol]
          )
          .join(
            (enter) => {
              const markerCurrent = enter
                .append('div')
                .style('position', 'absolute')
                .attr('class', 'marker marker-current')
                .style(
                  'transform',
                  (d, i) =>
                    `translate(${
                      (showPrevious ? 5 * (i + 1) : 5) + 'px'
                    },0px)rotate(-135deg)`
                )
                .style('width', '6px')
                .style('height', '6px')
                .on('click', onClick)
                .on('mouseover', onMouseEnter)
                .on('mouseout', onMouseLeave);

              markerCurrent
                .filter(
                  (d) =>
                    d.timestamp &&
                    d.timestamp.getTime() === selectedDate.getTime()
                )
                .style('background-color', colorAccessorScaled);

              if (showPrevious) {
                markerCurrent
                  .filter(
                    (d) =>
                      d.timestamp &&
                      d.timestamp.getTime() < selectedDate.getTime()
                  )
                  .style('border-width', '2px')
                  .style('border-style', 'solid')
                  .style('border-color', colorAccessorScaled)
                  .style('border-left', colorAccessorScaled)
                  .style('border-bottom', colorAccessorScaled);
              }

              let clicked = false;

              function onMouseEnter(e, datum) {
                action(e, datum);
                tooltip.html(tooltipContent(datum));
              }

              function onClick(e, datum) {
                if (clicked) {
                  tooltip.style('opacity', 0);
                } else {
                  action(e, datum);
                  tooltip.html(tooltipClickContent(datum));
                  clicked = !clicked;
                }
              }

              function onMouseLeave() {
                if (clicked) return;
                setTimeout(function () {
                  tooltip.style('opacity', 0);
                }, 350);
              }

              return markerCurrent;
            },
            (update) => update
          );

        root
          .append('div')
          .style('font-size', '10px')
          .style('color', (d) => getLabelColor(d[1], selectedDate))
          .style('text-align', 'center')
          .html((d) => d[0]);

        return root;
      },
      (update) => update
    );

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

  datasetVaccine.forEach((d) => {
    d.ghostGroup = ghostGrps.find(
      (g) => g.value === d['Name of vax']
    ).ghostGroup;
    d;
  });

  const vaccine_status = ['Administered', 'Within due date', 'Missed'];

  const dataVaccine = groups(
    datasetVaccine,
    (d) => d['ghostGroup'],
    (d) => d['Name of vax']
  );
  console.log(dataVaccine);
  container.append('h3').html('Vaccines');

  const containerVaccineWrapper = container
    .append('div')
    .style('display', 'flex');

  containerVaccineWrapper
    .selectAll('.ghost-boxes')
    .data(dataVaccine, (d) => d[0])
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
          .style('margin', '3px')
          .style('width', (_, i) => ['40%', '10%', '25%', '25%'][i])
          .style('display', 'flex')
          .style('flex-direction', 'row')
          .style('justify-content', 'center');

        return root;
      },
      (update) => update
    )
    .selectAll('.marker-group')
    .data(
      (d) => d[1],
      (d, i) => d[0] + '-' + i
    )
    .join(
      (enter) => {
        const root = enter
          .append('div')
          .attr('class', (d) => {
            console.log(
              d[1]
                .filter((el) => getDataAndInRange(el))
                .sort(
                  (a, b) =>
                    vaccine_status.indexOf(a['Status 1']) -
                    vaccine_status.indexOf(b['Status 1'])
                )
            );
            return `marker-group marker-group-${d[0]}`;
          })
          .style('width', '50px')
          .style('height', '100px');

        const markerGroup = root
          .append('div')
          .style('position', 'relative')
          .style('width', '36px')
          .style('height', '36px');

        const markers = markerGroup
          .selectAll('.marker')
          .data((d) =>
            d[1].filter((el) => getDataAndInRange(el))
              ? [
                  d[1]
                    .filter((el) => getDataAndInRange(el))
                    .sort((a, b) =>
                      !a['Date due start']
                        ? vaccine_status.indexOf(a['Status 1']) -
                          vaccine_status.indexOf(b['Status 1'])
                        : 0
                    )[0],
                ]
              : []
          )
          .join(
            (enter) => {
              const markerCurrent = enter
                .append('div')
                //.style('position', 'absolute')
                .attr('class', 'marker marker-current')
                .style('width', '50px')
                //.style('min-height', '180px')
                .on('click', onClick)
                .on('mouseover', onMouseEnter)
                .on('mouseout', onMouseLeave);

              const marker = markerCurrent.append('div').style('width', '30px');

              marker
                .filter((d) => d)
                .append('svg')
                .attr('viewBox', '0 0 512 512')
                .append('path')
                .attr('fill', (d) => d.color)
                .attr('stroke-width', '0px')
                .attr(
                  'd',
                  'M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V43.5c0 49.9-60.3 74.9-95.6 39.6L120.2 75C107.7 62.5 87.5 62.5 75 75s-12.5 32.8 0 45.3l8.2 8.2C118.4 163.7 93.4 224 43.5 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H43.5c49.9 0 74.9 60.3 39.6 95.6L75 391.8c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l8.2-8.2c35.3-35.3 95.6-10.3 95.6 39.6V480c0 17.7 14.3 32 32 32s32-14.3 32-32V468.5c0-49.9 60.3-74.9 95.6-39.6l8.2 8.2c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-8.2-8.2c-35.3-35.3-10.3-95.6 39.6-95.6H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H468.5c-49.9 0-74.9-60.3-39.6-95.6l8.2-8.2c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-8.2 8.2C348.3 118.4 288 93.4 288 43.5V32zM176 224a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm128 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z'
                );

              let clicked = false;

              function onMouseEnter(e, datum) {
                action(e, datum);
                tooltip.html(tooltipVaccineContent(datum));
              }

              function onClick(e, datum) {
                if (clicked) {
                  tooltip.style('opacity', 0);
                } else {
                  action(e, datum);
                  tooltip.html(tooltipVaccineClickContent(datum));
                  clicked = !clicked;
                }
              }

              function onMouseLeave() {
                if (clicked) return;
                setTimeout(function () {
                  tooltip.style('opacity', 0);
                }, 350);
              }

              return marker;
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

  function action(e) {
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
}
