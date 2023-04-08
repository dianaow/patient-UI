import { max, groups } from 'd3-array';
import { select } from 'd3-selection';
import { scaleTime, scaleBand, scaleLinear } from 'd3-scale';
import {
  getStartDate,
  getEndDate,
  getArrowHead,
  test_results,
} from './consts.js';

import Axis from './Axis';
import {
  tooltipContent,
  tooltipClickContent,
  tooltipContentRange,
  tooltipClickContentRange,
  tooltipVaccineContent,
  tooltipVaccineClickContent,
  tooltipVaccineContentRange,
  tooltipMedicationContent,
  tooltipMedicationClickContent,
  tooltipMedicationContentRange,
  tooltipMedicationClickContentRange,
  tooltipContraceptionContent,
  tooltipContraceptionClickContent,
  tooltipContraceptionContentRange,
  tooltipContraceptionClickContentRange,
  getYOrder,
  generateArrow,
} from './consts.js';

export default function Timeline({
  containerId,
  year,
  width,
  margin,
  dataset,
  dataRanges,
  xAccessorCol,
  yAccessorCol,
  y2AccessorCol,
  colorAccessorCol,
  y2Domain,
  id,
}) {
  const tooltip = select('#tooltip');

  const dimensions = {
    width: width || window.innerWidth * 0.55 - 50,
    margin: {
      top: margin?.top ?? 5,
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
    .domain([new Date(year, 0, 1), new Date(year, 11, 31)])
    .range([0, dimensions.boundedWidth * 0.98]);

  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const xStartAccessorScaled = (d) => xScale(xStartAccessor(d));
  const xEndAccessorScaled = (d) => xScale(xEndAccessor(d));

  const colorAccessor = (d) => d[colorAccessorCol];
  const colorAccessorScaled = (d) => colorAccessor(d);

  const BAND_HEIGHT = id === 'Vaccines' ? 18 : 26;

  let y2Range = y2Domain.map((d, i) =>
    y2Domain[i - 1] ? getYOrder(y2Domain[i - 1]).length * BAND_HEIGHT : 0
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
    getYOrder(y2Domain[y2Domain.length - 1]).length * BAND_HEIGHT +
    dimensions.margin.top;

  const detailsCard = document.getElementById(
    'details' + containerId.replace(/[^0-9]/g, '').toString()
  );

  select(`#${containerId}`)
    .style(
      'transform',
      `translate(0px, ${
        containerId.replace(/[^0-9]/g, '') - 1 > 0
          ? id === 'Vaccines'
            ? detailsCard.getBoundingClientRect().y + 40 + 'px'
            : detailsCard.getBoundingClientRect().y - 120 + 'px'
          : '25px'
      })`
    )
    .style('position', 'absolute');

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

  let yPos = [];

  y2Domain.map((d, i) => {
    const yDomain = getYOrder(d).reverse();
    const yScale = scaleBand()
      .range([yDomain.length * BAND_HEIGHT, 8])
      .domain(yDomain);
    //.padding(0.3); // gives some spacing between bars
    yDomain.map((item) => {
      yPos.push({
        category: item,
        y: yScale(item) + (y2Domain.length === 1 ? 0 : yScale2(i) ?? 0),
      });
    });
    g.append('g')
      .attr('id', containerId + '-yAxis-' + i)
      .attr(
        'transform',
        `translate(${0}, ${y2Domain.length === 1 ? 0 : yScale2(i)})`
      );
    Axis({
      containerId: containerId + '-yAxis-' + i,
      dimensions: {
        boundedHeight: yDomain.length * BAND_HEIGHT - 8,
      },
      dimension: 'y',
      scale: yScale,
      ticks: {
        tickValues: yDomain,
        style: {
          text: { color: '#555' },
        },
      },
      dataset: dataRanges ? dataset.concat(dataRanges) : dataset,
      id,
    });
  });

  g.append('g')
    .attr('id', containerId + '-yAxis2')
    .attr('transform', `translate(${-85}, ${0})`);

  Axis({
    containerId: containerId + '-yAxis2',
    dimensions: {
      boundedHeight: maxHeight,
      width: dimensions.boundedWidth * 0.96,
    },
    dimension: 'y2',
    scale: yScale2,
    ticks: {
      tickValues: y2Domain,
      style: {
        text: { color: '#fff' },
      },
    },
  });

  const data = groups(
    dataset
      .filter((d) => d.timestamp && d.timestamp.getFullYear() === year)
      .sort(
        (a, b) =>
          test_results.indexOf(a['Result 1']) -
          test_results.indexOf(b['Result 1'])
      ),
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
        .range([yDomain.length * BAND_HEIGHT, 8]);

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

  if (dataRanges) {
    let dataRangesFiltered = dataRanges
      .filter(
        (d) =>
          new Date(d['Date start']).getFullYear() === year ||
          new Date(d['Date end']).getFullYear() === year ||
          d['Date end'] === 'ongoing'
      )
      .map((d, i) => {
        return {
          ...d,
          timestamp_due_start: getStartDate(
            year,
            d['Date start'],
            d['Date end']
          ),
          timestamp_due_end: getEndDate(year, d['Date end']),
          arrow: getArrowHead(
            year,
            getStartDate(year, d['Date start'], d['Date end']),
            getEndDate(year, d['Date end'])
          ),
        };
      });

    const getY = (d) => {
      return (
        yPos.find((el) => el['category'] === d['Category']).y +
        (d.line === 2 ? 5 : 0)
      );
    };

    const colors = [
      ...new Set(dataset.concat(dataRangesFiltered).map(colorAccessor)),
    ];
    colors.map((color) => {
      generateArrow(svg, 'left', color);
      generateArrow(svg, 'right', color);
    });

    const getArrow = (d, direction) => {
      if (!d.arrow) return null;
      if (d.arrow === 'right' && direction === 'right') {
        return `url(${'#triangle-right-' + d.color})`;
      } else if (d.arrow === 'left' && direction === 'left') {
        return `url(${'#triangle-left-' + d.color})`;
      } else if (d.arrow === 'both') {
        return `url(${'#triangle-' + direction + '-' + d.color})`;
      } else {
        return null;
      }
    };

    const ranges = g
      .selectAll('.ranges')
      .data(dataRangesFiltered)
      .join(
        (enter) => {
          const markerCurrent = enter
            .append('g')
            .attr('class', (_, i) => `ranges range-${i}`);

          markerCurrent
            .append('line')
            .attr('class', (d, i) => `line-${i}`)
            .attr('x1', (d) => xStartAccessorScaled(d))
            .attr('y1', (d) => getY(d))
            .attr('x2', (d) => xEndAccessorScaled(d))
            .attr('y2', (d) => getY(d))
            .attr('stroke-width', (d) => (d.line === 2 ? 1.5 : 5))
            .attr('cursor', 'pointer')
            .attr('stroke', colorAccessorScaled)
            .attr('fill', 'none')
            .attr('marker-end', (d) => getArrow(d, 'right'))
            .attr('marker-start', (d) => getArrow(d, 'left'))
            .on('mouseover', (e, datum) => onHover(e, datum, id, true))
            .on('mouseout', onHoverOut)
            .on('click', (e, datum) => onClick(e, datum, id, true));

          return markerCurrent;
        },
        (update) => update
      );
  }

  const markers = g
    .selectAll('.markers')
    .data(aggregatedData)
    .join(
      (enter) => {
        const markerCurrent = enter
          .append('g')
          .attr('class', (_, i) => `markers marker-${i}`)
          .on('mouseover', (e, datum) => onHover(e, datum, id, false))
          .on('mouseout', onHoverOut)
          .on('click', (e, datum) => onClick(e, datum, id, false));

        if (id === 'Vaccines') {
          markerCurrent.attr(
            'transform',
            (d) => `translate(${xAccessorScaled(d) - 8}, ${d.y - 8})`
          );
          markerCurrent
            .append('svg')
            .attr('class', (d, i) => `vaccine-${d[xAccessorCol]}-${i}`)
            .attr('viewBox', '0 0 512 512')
            .attr('width', '16px')
            .attr('height', '16px')
            .append('path')
            .attr('fill', colorAccessorScaled)
            .attr('stroke-width', '0px')
            .attr(
              'd',
              'M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V43.5c0 49.9-60.3 74.9-95.6 39.6L120.2 75C107.7 62.5 87.5 62.5 75 75s-12.5 32.8 0 45.3l8.2 8.2C118.4 163.7 93.4 224 43.5 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H43.5c49.9 0 74.9 60.3 39.6 95.6L75 391.8c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l8.2-8.2c35.3-35.3 95.6-10.3 95.6 39.6V480c0 17.7 14.3 32 32 32s32-14.3 32-32V468.5c0-49.9 60.3-74.9 95.6-39.6l8.2 8.2c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-8.2-8.2c-35.3-35.3-10.3-95.6 39.6-95.6H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H468.5c-49.9 0-74.9-60.3-39.6-95.6l8.2-8.2c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-8.2 8.2C348.3 118.4 288 93.4 288 43.5V32zM176 224a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm128 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z'
            );

          markerCurrent
            .filter((d) => d['Timeline static'])
            .append('text')
            .attr('class', (d, i) => `vaccine-text-${d[xAccessorCol]}-${i}`)
            .attr('width', '16px')
            .attr('height', '5px')
            .attr('font-size', '8px')
            .text((d) => d['Timeline static']);
        } else if (id === 'Medication') {
          markerCurrent.attr(
            'transform',
            (d) => `translate(${xAccessorScaled(d)}, ${d.y})`
          );
          markerCurrent
            .append('svg')
            .attr('class', (d, i) => `med-${d[xAccessorCol]}-${i}`)
            .attr('viewBox', '-16 -16 32 32')
            .attr('width', '16px')
            .attr('height', '16px')
            .append('path')
            .attr('fill', colorAccessorScaled)
            .attr('stroke-width', '0px')
            .attr('d', 'M0 16 L16 -16 L-16 -16 Z');
        } else {
          markerCurrent
            .append('rect')
            .attr('class', (d, i) => `rect-${d[xAccessorCol]}-${i}`)
            .attr(
              'transform',
              (d) => `rotate(45, ${xAccessorScaled(d)}, ${d.y})`
            )
            .attr('x', (d) => xAccessorScaled(d) - 5)
            .attr('y', (d) => d.y - 5)
            .attr('height', 10)
            .attr('width', 10)
            .attr('cursor', 'pointer')
            .attr('fill', colorAccessorScaled);

          markerCurrent
            .filter((d) => d['Timeline static'])
            .append('text')
            .attr('class', (d, i) => `text-${d[xAccessorCol]}-${i}`)
            .attr('width', '16px')
            .attr('height', '5px')
            .attr('font-size', '8px')
            .text((d) => d['Timeline static']);
        }

        return markerCurrent;
      },
      (update) => update
    );

  function onHover(e, datum, type, isRange) {
    action(e, datum, isRange);
    if (type === 'Contraception') {
      tooltip.html(
        isRange
          ? tooltipContraceptionContentRange(datum)
          : tooltipContraceptionContent(datum)
      );
    } else if (type === 'Vaccines') {
      tooltip.html(
        isRange
          ? tooltipVaccineContentRange(datum)
          : tooltipVaccineContent(datum)
      );
    } else if (type === 'Medication') {
      tooltip.html(
        isRange
          ? tooltipMedicationContentRange(datum)
          : tooltipMedicationContent(datum)
      );
    } else {
      tooltip.html(
        isRange ? tooltipContentRange(datum) : tooltipContent(datum)
      );
    }
  }

  function onHoverOut() {
    tooltip.style('opacity', 0);
  }

  function onClick(e, datum, type, isRange) {
    if (type === 'Contraception') {
      action(e, datum, false);
      tooltip.html(
        isRange
          ? tooltipContraceptionClickContentRange(datum)
          : tooltipContraceptionClickContent(datum)
      );
    } else if (type === 'Vaccines') {
      action(e, datum, isRange);
      tooltip.html(
        isRange
          ? tooltipVaccineContentRange(datum)
          : tooltipVaccineClickContent(datum)
      );
    } else if (type === 'Medication') {
      action(e, datum, isRange);
      tooltip.html(
        isRange
          ? tooltipMedicationClickContentRange(datum)
          : tooltipMedicationClickContent(datum)
      );
    } else {
      action(e, datum, isRange);
      tooltip.html(
        isRange ? tooltipClickContentRange(datum) : tooltipClickContent(datum)
      );
    }
  }

  function action(e, datum, isRange) {
    const x = xAccessorScaled(datum);
    const y = e.y;
    tooltip
      .style('opacity', 1)
      .style(
        'transform',
        `translate(` +
          `calc( -50% + ${
            dimensions.margin.left -
            4 +
            (isRange
              ? (xEndAccessorScaled(datum) - xStartAccessorScaled(datum)) / 2 +
                xStartAccessorScaled(datum)
              : x)
          }px + 50px),` +
          `calc(-100% + ${y + window.scrollY}px)` +
          `)`
      );
  }
}
