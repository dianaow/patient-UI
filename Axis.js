import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { select } from 'd3-selection';
import { getLabelColor } from './consts.js';

function deepMergeObject(targetObject = {}, sourceObject = {}) {
  // clone the source and target objects to avoid the mutation
  const copyTargetObject = JSON.parse(JSON.stringify(targetObject));
  const copySourceObject = JSON.parse(JSON.stringify(sourceObject));
  // Iterating through all the keys of source object
  Object.keys(copySourceObject).forEach((key) => {
    if (
      typeof copySourceObject[key] === 'object' &&
      !Array.isArray(copySourceObject[key])
    ) {
      // If property has nested object, call the function recursively
      copyTargetObject[key] = deepMergeObject(
        copyTargetObject[key],
        copySourceObject[key]
      );
    } else {
      // else merge the object source to target
      copyTargetObject[key] = copySourceObject[key];
    }
  });

  return copyTargetObject;
}

function getTickFormatFunc(formatStr) {
  if (formatStr) {
    return /.[0-3]/.test(formatStr) ? format(formatStr) : timeFormat(formatStr);
  } else {
    return null;
  }
}
export const defaultAxisConfig = {
  label: {
    labelClassName: '',
    // Axis label
    text: null,
    //Axis label position
    position: 'middle',
  },
  ticks: {
    tickClassName: '',
    // Tick label formatter function
    formatTick: null,
    // Set the approximate number of axis ticks (will be passed to D3's axis constructor)
    numberOfTicks: 3,
    // Number of pixels to move tick position horizontally by
    xOffset: 0,
    // Number of pixels to move tick position vertically by
    yOffset: 0,
    // Explicitly set tick values
    tickValues: null,
    // Determines tick length. (If inner, tick line take full chart width. If outer, tick line is outside of chart. If point, tick line stops at marker position on chart)
    type: 'inner',
    style: {
      line: { color: '#E4E5E7', strokeDashArray: null },
      text: { color: '#555' },
    },
  },
  line: {
    lineClassName: '',
    color: '#555',
    // Sets whether to draw the domain line or not
    show: false,
  },
};

function Axis({
  containerId,
  dimensions,
  dimension,
  scale,
  label,
  ticks,
  line,
  dataset,
  id,
}) {
  label = deepMergeObject(defaultAxisConfig.label, label);
  ticks = deepMergeObject(defaultAxisConfig.ticks, ticks);
  line = deepMergeObject(defaultAxisConfig.line, line);

  switch (dimension) {
    case 'x':
      return AxisHorizontal({
        containerId,
        scale,
        dimensions,
        label,
        ticks,
        line,
      });
    case 'time':
      ticks.tickValues = ticks.tickValues.map((d) => new Date(d));
      return AxisHorizontal({
        containerId,
        scale,
        dimensions,
        label,
        ticks,
        line,
      });
    case 'y':
      return AxisVertical({
        containerId,
        scale,
        dimensions,
        label,
        ticks,
        line,
        dimension,
        dataset,
        id,
      });
    case 'y2':
      return AxisVertical({
        containerId,
        scale,
        dimensions,
        label,
        ticks,
        line,
        dimension,
      });
    default:
      throw new Error('Please specify x or y dimension!');
  }
}

function AxisHorizontal({
  containerId,
  dimensions,
  scale,
  label,
  ticks,
  line,
}) {
  const formatFunc = getTickFormatFunc(ticks.formatTick);

  //select(`#${containerId}`).select('.AxisHorizontal').remove();

  const g = select(`#${containerId}`)
    .append('g')
    .attr('class', 'Axis AxisHorizontal')
    .attr('transform', `translate(${ticks.xOffset}, ${ticks.yOffset})`);

  if (line.show) {
    g.append('line')
      .attr('class', line.lineClassName || '')
      .attr('x1', 0)
      .attr('x2', dimensions.boundedWidth)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', line.color);
  }

  const ticksGroup = g
    .selectAll('g')
    .data(ticks.tickValues || [])
    .enter()
    .append('g')
    .attr('class', ticks.tickClassName || '')
    .attr('transform', (tick) => `translate(${scale(tick)}, 10)`);

  ticksGroup
    .append('rect')
    .attr('rx', 4)
    .attr('x', -(dimensions.boundedWidth / ticks.tickValues.length - 6) * 0.5)
    .attr('width', dimensions.boundedWidth / ticks.tickValues.length - 6)
    .attr('height', 20)
    .attr('fill', '#416FF8');
  //attr('stroke', '#ffffff')

  ticksGroup
    .append('text')
    .attr('x', ticks.style?.text.x ?? 0)
    .attr('y', ticks.style?.text.y ?? 5)
    .attr('fill', 'white')
    .attr('dy', '0.71em')
    .attr('text-anchor', 'middle')
    .attr('font-size', dimensions.width <= 650 ? '8px' : '12px')
    .attr('font-weight', 500)
    .text((tick) => (formatFunc ? formatFunc(tick) : tick));

  if (label) {
    g.append('text')
      .attr('class', label.labelClassName || '')
      .attr(
        'transform',
        `translate(${
          label.position === 'end'
            ? dimensions.boundedWidth
            : label.position === 'start'
            ? 0
            : dimensions.boundedWidth / 2
        }, ${dimensions.margin.bottom - 10})`
      )
      .attr('text-anchor', label.position === 'end' ? 'end' : 'middle')
      .attr('fill', '#818CA2')
      .attr('font-size', dimensions.width <= 650 ? '12px' : '16px')
      .text(label.text || '');
  }
}

function AxisVertical({
  containerId,
  dimensions,
  scale,
  label,
  ticks,
  line,
  dimension,
  dataset,
  id,
}) {
  const formatFunc = getTickFormatFunc(ticks.formatTick);

  //select(`#${containerId}`).select('.AxisVertical').remove();

  const g = select(`#${containerId}`)
    .append('g')
    .attr('class', 'Axis AxisVertical')
    .attr('transform', `translate(${-ticks.xOffset}, ${ticks.yOffset})`);

  if (line.show) {
    g.append('line')
      .attr('class', line.lineClassName || '')
      .attr('x1', ticks.xOffset / 2 - 1)
      .attr('x2', ticks.xOffset / 2 - 1)
      .attr('y2', dimensions.boundedHeight)
      .attr('stroke', line.color);
  }

  const ticksGroup = g
    .selectAll('g')
    .data(ticks.tickValues || [])
    .enter()
    .append('g')
    .attr('class', ticks.tickClassName || '')
    .attr(
      'transform',
      (tick, index) =>
        `translate(${ticks.xOffset / 2}, ${
          (scale(dimension === 'y2' ? index : tick) ?? 0) + ticks.yOffset
        })`
    );

  if (dimension === 'y2') {
    ticksGroup
      .append('rect')
      .attr('rx', 8)
      .attr('x', 80)
      .attr('y', 0)
      .attr('width', dimensions.width + 25)
      .attr(
        'height',
        (d, i) =>
          document
            .getElementById(containerId.split('-')[0] + '-yAxis-' + i)
            .getBoundingClientRect().height
      )
      .attr('fill', '#EFEFEF');
  }

  ticksGroup
    .append('rect')
    .attr('rx', dimension === 'y2' ? 8 : 0)
    .attr('x', -95)
    .attr('y', dimension === 'y2' ? 0 : -10)
    .attr('width', 85)
    .attr('height', (d, i) =>
      dimension === 'y2'
        ? document
            .getElementById(containerId.split('-')[0] + '-yAxis-' + i)
            .getBoundingClientRect().height
        : Math.floor(dimensions.boundedHeight / ticks.tickValues.length)
    )
    .attr('fill', '#ffffff')
    .attr('stroke', dimension === 'y2' ? '#EFEFEF' : 'transparent');

  ticksGroup
    .append('text')
    .attr('x', ticks.style?.text.x ?? -5)
    .attr('y', (d, i) =>
      dimension === 'y2'
        ? document
            .getElementById(containerId.split('-')[0] + '-yAxis-' + i)
            .getBoundingClientRect().height / 2
        : 4
    )
    .attr('dx', -4)
    .attr('fill', dimension === 'y2' ? '#000' : '#555')
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'end')
    .attr('font-size', dimensions.width <= 650 ? '8px' : '10px')
    .attr('font-weight', dimension === 'y2' ? 900 : 500)
    .style('font-family', dimension === 'y2' ? 'Montserrat' : 'Karla')
    .style('fill', (tick) => {
      const col =
        id === 'STIs' || id === 'Other tests' ? 'Category3' : 'Category';
      return dataset
        ? getLabelColor(
            dataset.filter((d) => d[col] === tick),
            new Date()
          )
        : 'black';
    })
    .text((tick) => (formatFunc ? formatFunc(tick) : tick));

  if (label) {
    g.append('text')
      .attr('class', label.labelClassName || '')
      .attr(
        'transform',
        `translate(${
          ticks.xOffset / 2 - (dimensions.width <= 650 ? 35 : 50)
        }, ${
          label.position === 'end'
            ? 0
            : label.position === 'start'
            ? dimensions.boundedHeight
            : dimensions.boundedHeight / 2
        }) rotate(-90)`
      )
      .attr('text-anchor', label.position === 'end' ? 'end' : 'middle')
      .attr('fill', '#cfdee7')
      .attr('font-size', dimensions.width <= 650 ? '12px' : '16px')
      .text(label.text || '');
  }
}

export default Axis;
