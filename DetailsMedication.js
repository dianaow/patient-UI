import { select } from 'd3-selection';
import { groups } from 'd3-array';
import { medication } from './medication.js';

export default function Details({
  containerId,
  ID,
  width,
  dataset,
  outerAccessorCol,
}) {
  const ghostGrps = [
    { ghostGroup: 1, value: 'Allergies' },
    { ghostGroup: 2, value: 'ISH Medication' },
    { ghostGroup: 2, value: 'Recreational' },
    { ghostGroup: 3, value: 'Other Medication' },
  ];

  dataset.forEach((d) => {
    d.ghostGroup = ghostGrps.find((g) => g.value === d['Category']).ghostGroup;
  });

  const allergies = medication.filter((d) => d['Status 2'] === 'Allergy');

  let data = groups(
    dataset,
    (d) => d['ghostGroup'],
    (d) => d[outerAccessorCol]
  );

  data = data
    .concat([[1, [['Allergies', allergies]]]])
    .sort((a, b) => a[0] - b[0]);

  select(`#${containerId}`)
    .append('div')
    //.style('text-align', 'center')
    .style('font-family', 'Montserrat')
    .style('font-weight', 'bold')
    .style('margin', '40px 0px 10px 0px')
    .html('Current Medication');

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
    .selectAll('.boxes')
    .data(data, (d) => d[0])
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
          .style('margin', '6px')
          .style('width', '31%');

        return root;
      },
      (update) => update
    )
    .append('div')
    .selectAll('.marker-group')
    .data(
      (d) => d[1],
      (d, i) => d[outerAccessorCol] + '-' + i
    )
    .join(
      // append markers inside each div
      (enter) => {
        const markerCurrent = enter
          .append('div')
          .attr('class', (d, i) => `marker-group marker-group-${i}`);

        markerCurrent
          .append('p')
          .style('border-bottom', '1px solid black')
          .style('padding', '2px 6px')
          .style('font-weight', 'black')
          .style('font-size', '14px')
          .style('font-family', 'Montserrat')
          .html((d) => d[0]);

        markerCurrent
          .selectAll('.marker-text')
          .data((d) => d[1])
          .join(
            (enter) => {
              const root = enter
                .append('div')
                .attr('class', (_, i) => `marker-text marker-text-${i}`)
                .style('position', 'relative')
                .style('font-size', '10px')
                .style('color', (d) =>
                  d['Status 2'] === 'Allergy' ? 'red' : 'black'
                )
                .html((d) =>
                  d['Name of drug'].includes('PO')
                    ? d['Name of drug'].split('PO')[0] +
                      ' ' +
                      d['Episode static'] +
                      ' PO'
                    : d['Name of drug']
                );

              return root;
            },
            (update) => update
          );

        return markerCurrent;
      },
      (update) => update
    );
}
