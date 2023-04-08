import { select } from 'd3-selection';
import { scaleTime } from 'd3-scale';
import Axis from './Axis';
import Details from './Details';
import DetailsContraception from './DetailsContraception';
import DetailsVaccine from './DetailsVaccine';
import DetailsMedication from './DetailsMedication';
import DetailsOther from './DetailsOther';
import DetailsBBI from './DetailsBBI';
import { defaultDetailsParams, getEndDate, getStartDate } from './consts.js';

export default function Header({
  containerId,
  year,
  width,
  margin,
  xAccessorCol,
  dates,
  datasetSTI,
  datasetBBI,
  datasetOther,
  datasetVaccine,
  datasetContraception,
  datasetMedication,
}) {
  let clicked = false;

  const panel = select('#detail-panel');

  const dimensions = {
    width: width || window.innerWidth * 0.55 - 50,
    margin: {
      top: margin?.top ?? 0,
      right: margin?.right ?? 0,
      bottom: margin?.bottom ?? 0,
      left: margin?.left ?? 190,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;

  const xScale = scaleTime()
    .domain([new Date(year, 0, 1), new Date(year, 11, 31)])
    .range([0, dimensions.boundedWidth * 0.98]);

  const svg = select(`#${containerId}`)
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', 55);

  const g = svg
    .append('g')
    .attr('class', 'wrapper')
    .attr(
      'transform',
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  g.append('g').attr('id', 'xAxis');
  const months = Array.from({ length: 12 }, (item, i) => {
    return new Date(year, i, 15);
  });
  Axis({
    containerId: 'xAxis',
    dimensions,
    dimension: 'time',
    scale: xScale,
    ticks: {
      tickValues: months,
      formatTick: '%b',
      xOffset: 0,
    },
  });

  g.selectAll('.date')
    .data(dates.sort((a, b) => a.getTime() - b.getTime()))
    .join(
      (enter) => {
        return enter
          .append('text')
          .attr('class', 'date')
          .attr('x', (d) => xScale(d))
          .attr('y', (d, i) => {
            return xScale(dates[i + 1])
              ? xScale(dates[i + 1]) - xScale(dates[i]) < 16
                ? 54
                : 42
              : 42;
          })
          .style('font-size', '9px')
          .style('text-anchor', 'middle')
          .style('border-bottom', '1px solid #000')
          .style('fill', '#416FF8')
          .style('cursor', 'pointer')
          .html(
            (selectedDate) =>
              selectedDate.getDate() +
              ' ' +
              selectedDate.toLocaleString('default', { month: 'short' })
            //' ' +
            //(selectedDate.getYear() - 100)
          )
          .on('mouseover', onHover)
          .on('click', onClick);
      },
      (update) => update
    );

  const datum = dates.find(
    (d) => d.getTime() === dates[dates.length - 1].getTime()
  );

  select('#hover-line')
    .style('left', xScale(datum) + dimensions.margin.left + 45 + 'px')
    .style('opacity', 1);

  Details({
    ...defaultDetailsParams,
    ID: 1,
    selectedDate: datum,
    dataset: datasetSTI,
    title: 'STIs',
  });

  DetailsBBI({
    ...defaultDetailsParams,
    ID: 2,
    selectedDate: datum,
    datasetBBI: datasetBBI,
    datasetVaccine: datasetVaccine,
    title: 'BBI',
  });

  DetailsOther({
    ...defaultDetailsParams,
    ID: 3,
    selectedDate: datum,
    dataset: datasetOther,
    title: 'Other tests',
  });

  DetailsContraception({
    ...defaultDetailsParams,
    ID: 4,
    selectedDate: datum,
    dataset: datasetContraception,
    outerAccessorCol: 'Name of method',
  });

  const datasetMedication1 = datasetMedication
    .filter(
      (d) =>
        getEndDate(year, d['Date end']) >= datum.getTime() &&
        getStartDate(year, d['Date start']) <= datum.getTime()
    )
    .sort(
      (a, b) =>
        getEndDate(year, a['Date end']) - getStartDate(year, b['Date start'])
    );

  DetailsMedication({
    ...defaultDetailsParams,
    ID: 5,
    selectedDate: datum,
    dataset: datasetMedication1,
    outerAccessorCol: 'Category',
  });

  function onHover(e, datum) {
    if (clicked) return;
    action(e, datum);
  }

  function onClick(e, datum) {
    action(e, datum);
    clicked = !clicked;
  }

  function action(e, datum) {
    panel.html('');
    console.log('render details');

    const x = xScale(datum);

    select('#hover-line')
      .style('left', x + dimensions.margin.left + 45 + 'px')
      .style('opacity', 1);

    Details({
      ...defaultDetailsParams,
      ID: 1,
      selectedDate: datum,
      dataset: datasetSTI,
      title: 'STIs',
    });

    DetailsBBI({
      ...defaultDetailsParams,
      ID: 2,
      selectedDate: datum,
      datasetBBI: datasetBBI,
      datasetVaccine: datasetVaccine,
      title: 'BBI',
    });

    DetailsOther({
      ...defaultDetailsParams,
      ID: 3,
      selectedDate: datum,
      dataset: datasetOther,
      title: 'Other tests',
    });

    DetailsContraception({
      ...defaultDetailsParams,
      ID: 4,
      selectedDate: datum,
      dataset: datasetContraception,
      outerAccessorCol: 'Name of method',
    });

    const datasetMedication1 = datasetMedication
      .filter(
        (d) =>
          getEndDate(year, d['Date end']) >= datum.getTime() &&
          getStartDate(year, d['Date start']) <= datum.getTime()
      )
      .sort(
        (a, b) =>
          getEndDate(year, a['Date end']) - getStartDate(year, b['Date start'])
      );

    DetailsMedication({
      ...defaultDetailsParams,
      ID: 5,
      selectedDate: datum,
      dataset: datasetMedication1,
      outerAccessorCol: 'Category',
    });
  }
}
