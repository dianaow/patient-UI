import { select } from 'd3-selection';
import { groups } from 'd3-array';
import {
  tooltipContraceptionContentRange,
  tooltipContraceptionClickContentRange,
} from './consts.js';

export default function DetailsContraception({
  containerId,
  ID,
  width,
  dataset,
  outerAccessorCol,
  selectedDate,
}) {
  let clicked = false;

  const tooltip = select('#tooltip');

  const getCurrent = (d) => {
    if (d.timestamp && d.timestamp.getTime() === selectedDate.getTime()) {
      return true;
    } else if (
      d['Date end'] === 'ongoing' &&
      new Date(d['Date start']).getTime() <= selectedDate.getTime()
    ) {
      return true;
    } else if (
      new Date(d['Date end']).getTime() >= selectedDate.getTime() &&
      new Date(d['Date start']).getTime() <= selectedDate.getTime()
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getCurrent1 = (d) => {
    if (d.timestamp && d.timestamp.getTime() === selectedDate.getTime()) {
      return true;
    } else if (
      d['Date end'] === 'ongoing' &&
      new Date(d['Date start']).getTime() <= selectedDate.getTime()
    ) {
      return true;
    } else if (new Date(d['Date end']).getTime() <= selectedDate.getTime()) {
      return true;
    } else if (
      new Date(d['Date start']).getTime() <= selectedDate.getTime() 
    ) {
      return true;
    } else if (new Date(d['Date start']).getTime() > selectedDate.getTime()) {
      return false;
    } else {
      return false;
    }
  };

  const getLabelColor = (d) => {
    if (d['Name of method'] === 'mTop') {
      if (!d['Date']) {
        return '#d3d3d3';
      } else if (getCurrent1(d) && d['Status 1'] !== 'Complication') {
        return 'black';
      } else if (getCurrent1(d) && d['Status 1'] === 'Complication') {
        return 'red';
      } else {
        return '#d3d3d3';
      }
    } else {
      if (!d['Date'] && !d['Date start'] && !d['Date end']) {
        return '#d3d3d3';
      } else if (getCurrent1(d) && d['Status 2'] !== 'UKMEC (cont) 4') {
        return 'black';
      } else if (getCurrent1(d) && d['Status 2'] === 'UKMEC (cont) 4') {
        return 'red';
      } else {
        return '#d3d3d3';
      }
    }
  };

  const ghostGrps = [
    { ghostGroup: 1, value: 'IUD' },
    { ghostGroup: 2, value: 'IUS' },
    { ghostGroup: 3, value: 'IMP' },
    { ghostGroup: 4, value: 'Depo' },
    { ghostGroup: 4, value: 'Sayana' },
    { ghostGroup: 5, value: 'POP' },
    { ghostGroup: 6, value: 'COC' },
    { ghostGroup: 6, value: 'Patch' },
    { ghostGroup: 6, value: 'Ring' },
    { ghostGroup: 7, value: 'LNG' },
    { ghostGroup: 7, value: 'UPA' },
    { ghostGroup: 8, value: 'mTOP' },
    { ghostGroup: 8, value: 'sTOP' },
  ];

  dataset.forEach((d) => {
    d.ghostGroup = ghostGrps.find(
      (g) => g.value === d['Name of method']
    ).ghostGroup;
  });

  dataset = dataset
    .sort((a, b) => a.ghostGroup - b.ghostGroup)
    .sort(
      (a, b) =>
        (b['Date']
          ? new Date(b['Date']).getTime()
          : new Date(b['Date due start']).getTime()) -
        (a['Date']
          ? new Date(a['Date']).getTime()
          : new Date(a['Date due start']).getTime())
    );

  const data = groups(
    dataset.filter(
      (v, i, a) =>
        a.findIndex((v2) => v2['Name of method'] === v['Name of method']) === i
    ),
    (d) => d['ghostGroup'],
    (d) => d[outerAccessorCol]
  );

  select(`#${containerId}`)
    .append('div')
    //.style('text-align', 'center')
    .style('font-family', 'Montserrat')
    .style('font-weight', 'bold')
    .style('margin', '40px 0px 10px 0px')
    .html('Contraception');

  const container = select(`#${containerId}`)
    .append('div')
    .attr('id', 'details' + ID)
    .attr('width', width)
    .style('background-color', 'white')
    .style('border-radius', '10px')
    .style('box-shadow', '5px 10px 10px rgb(0 0 0 / 0.2)')
    .style('padding', '15px');
  //.style('display', 'flex')
  //.style('flex-wrap', 'wrap');

  container
    .selectAll('.boxes')
    .data(data, (d) => d[0])
    .join(
      (enter) => {
        const root = enter
          .append('div')
          .attr('class', (_, i) => `boxes box-${i}`)
          .style('border-radius', '8px')
          .style('margin', '6px')

        return root;
      },
      (update) => update
    )
    .append('div')
    .style('display', 'flex')
    //.style('flex-wrap', 'wrap')
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
          .style('width', '85px')
          .style('height', '38px');

        const markerGroup = root
          .append('div')
          .style('position', 'relative')
          .style('width', '60px')
          .style('height', '38px');

        const markers = markerGroup
          .selectAll('.marker')
          .data(
            (d) => d[1],
            (d) => d[outerAccessorCol]
          )
          .join(
            (enter) => {
              const markerCurrent = enter
                .append('div')
                .style('position', 'absolute')
                .attr('class', 'marker marker-current')
                .style('width', '30px')
                .style('height', '20px')
                .style('background-color', (d) => d['color1'])
                .style('opacity', (d) => (getCurrent(d) ? 1 : 0.3))
                .on('click', onClick)
                .on('mouseover', onMouseEnter)
                .on('mouseout', onMouseLeave);

              const markerEndCircle = markerCurrent
                .append('div')
                .style('position', 'absolute')
                .attr('class', 'marker marker-end-circle')
                .style('transform', `translate(-10px,0px)`)
                .style('width', '20px')
                .style('height', '20px')
                .style('background-color', (d) => d['color'])
                .style('border-radius', '50%')
                //.style('border', '1px solid black')
                .style('display', 'inline-block');

              const markerEndArrow = markerCurrent
                .append('div')
                .style('position', 'absolute')
                .attr('class', 'marker marker-end-arrow')
                .style('transform', `translate(30px,-1px)`)
                .style('width', '0px')
                .style('height', '0px')
                .style('border-top', '11px solid transparent')
                .style('border-bottom', '10px solid transparent')
                .style('border-left', (d) => `13px solid ${d['color1']}`)
                .style('display', 'inline-block');

              enter
                .append('p')
                .style('position', 'absolute')
                .style('top', '14px')
                .style('font-weight', 'black')
                .style('font-size', '10px')
                .style('font-family', 'Montserrat')
                .style('color', (d) => getLabelColor(d))
                .style('opacity', 1)
                .html((d) => d['Name of method']);

              return markerCurrent;
            },
            (update) => update
          );

        return root;
      },
      (update) => update
    );

  function onMouseEnter(e, datum) {
    if (datum['Date start']) {
      action(e, datum);
      tooltip.html(tooltipContraceptionContentRange(datum));
    }
  }

  function onClick(e, datum) {
    if (datum['Date start']) {
      action(e, datum);
      tooltip.html(tooltipContraceptionClickContentRange(datum));
      clicked = !clicked;
    }
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
