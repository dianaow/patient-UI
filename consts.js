export const colorTests = ['red', 'yellow', 'green', 'grey'];

export const test_results = ['Abnormal', 'Equivocal', 'Normal', 'Not reported'];

export const getLabelColor = (d, selectedDate) => {
  let resultsUpToSelectedDate = d
    .filter(
      (d) =>
        (d.timestamp && d.timestamp.getTime() <= selectedDate.getTime()) ||
        new Date(d['Date start']).getTime() <= selectedDate.getTime()
    )
    .map((el) => el['Result 1'] || el['Status 1']);
  let res = resultsUpToSelectedDate.some(
    (el) => el === 'Abnormal' || el === 'Missed' || el === 'Allergy'
  );
  let resNone = resultsUpToSelectedDate.every((el) => !el);

  if (res) {
    return 'red';
  } else if (resNone) {
    return '#d3d3d3';
  } else if (!res) {
    return 'black';
  } else {
    return '#d3d3d3';
  }
};

export const tooltipMedicationContent = (d) =>
  `
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
<div>${d['Name of drug']}</div>
<div><b>Date: </b>${d['Date']}</div>
<div><b>Timeline static: </b>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div><b>Status hover: </b>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
`;

export const tooltipMedicationContentRange = (d) =>
  `
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
<div>${d['Name of drug']}</div>
<div><b>Date start: </b>${d['Date start']}</div>
<div><b>Date end: </b>${d['Date end']}</div>
<div><b>Timeline static: </b>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div><b>Status hover: </b>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
`;

export const tooltipMedicationClickContent = (d) =>
  `
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
<div>${d['Name of drug']}</div>
<div><b>Date: </b>${d['Date']}</div>
<div><b>Timeline static: </b>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div><b>Status hover: </b>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
  ${
    d['Clinician details'] && d['Clinician details'] !== ''
      ? ` <div><b>Clinician details: </b>${d['Clinician details']}</div>`
      : ''
  }
  ${
    d['Clinician'] && d['Clinician'] !== ''
      ? ` <div><b>Clinician: </b>${d['Clinician']}</div>`
      : ''
  }
  ${
    d['Clinic location'] && d['Clinic location'] !== ''
      ? ` <div><b>Clinic location: </b>${d['Clinic location']}</div>`
      : ''
  }
  ${
    d['Batch number'] && d['Batch number'] !== ''
      ? ` <div><b>Batch number: </b>${d['Batch number']}</div>`
      : ''
  }
  ${
    d['Expiry date'] && d['Expiry date'] !== ''
      ? ` <div><b>Expiry date: </b>${d['Expiry date']}</div>`
      : ''
  }
`;

export const tooltipMedicationClickContentRange = (d) =>
  `
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
<div>${d['Name of drug']}</div>
<div><b>Date start: </b>${d['Date start']}</div>
<div><b>Date end: </b>${d['Date end']}</div>
<div><b>Timeline static: </b>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
  <div><b>Status hover: </b>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
  ${
    d['Clinician details'] && d['Clinician details'] !== ''
      ? ` <div><b>Clinician details: </b>${d['Clinician details']}</div>`
      : ''
  }
  ${
    d['Clinician'] && d['Clinician'] !== ''
      ? ` <div><b>Clinician: </b>${d['Clinician']}</div>`
      : ''
  }
  ${
    d['Clinic location'] && d['Clinic location'] !== ''
      ? ` <div><b>Clinic location: </b>${d['Clinic location']}</div>`
      : ''
  }
  ${
    d['Batch number'] && d['Batch number'] !== ''
      ? ` <div><b>Batch number: </b>${d['Batch number']}</div>`
      : ''
  }
  ${
    d['Expiry date'] && d['Expiry date'] !== ''
      ? ` <div><b>Expiry date: </b>${d['Expiry date']}</div>`
      : ''
  }
`;

export const tooltipVaccineContent = (d) =>
  `
<div>${d['Date']}</div>
<div>${d['Name of vax']}</div>
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
  <div>${
    d['Episode static'] && d['Episode static'] !== '' ? d['Episode static'] : ''
  }</div>
<div>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
`;

export const tooltipVaccineContentRange = (d) =>
  `
<div><b>Date due start: </b>${d['Date start']}</div>
<div><b>Date due end: </b>${d['Date end']}</div>
<div>${d['Name of vax']}</div>
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
  <div>${
    d['Episode static'] && d['Episode static'] !== '' ? d['Episode static'] : ''
  }</div>
<div>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
`;

export const tooltipVaccineClickContent = (d) =>
  `
<div>${d['Date']}</div>
<div>${d['Name of vax']}</div>
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
${
  d['Clinician'] && d['Clinician'] !== ''
    ? ` <div><b>Clinician: </b>${d['Clinician']}</div>`
    : ''
}
${
  d['Clinic location'] && d['Clinic location'] !== ''
    ? ` <div><b>Clinic location: </b>${d['Clinic location']}</div>`
    : ''
}
${
  d['Brand'] && d['Brand'] !== ''
    ? ` <div><b>Brand: </b>${d['Brand']}</div>`
    : ''
}
${d['Dose'] && d['Dose'] !== '' ? ` <div><b>Dose: </b>${d['Dose']}</div>` : ''}
${d['Site'] && d['Site'] !== '' ? ` <div><b>Site: </b>${d['Site']}</div>` : ''}
${
  d['Bath number'] && d['Bath number'] !== ''
    ? ` <div><b>Bath number: </b>${d['Bath number']}</div>`
    : ''
}
${
  d['Expiry date'] && d['Expiry date'] !== ''
    ? ` <div><b>Expiry date: </b>${d['Expiry date']}</div>`
    : ''
}
`;

export const tooltipContraceptionContent = (d) =>
  `
  <div>${d['Date']}</div>
  <div>${d['Name of method']}</div>
  ${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
  ${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div>${
    d['Episode static'] && d['Episode static'] !== '' ? d['Episode static'] : ''
  }</div>
`;

export const tooltipContraceptionContentRange = (d) =>
  `
  ${d['Date start'] ? `<div><b>Date start: </b>${d['Date start']}</div>` : ''}
  ${d['Date end'] ? `<div><b>Date end: </b>${d['Date end']}</div>` : ''}
  ${
    d['Date inactive']
      ? `<div><b>Date inactive: </b>${d['Date inactive']}</div>`
      : ''
  }
  <div>${d['Name of method']}</div>
  ${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
  ${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div>${
    d['Episode static'] && d['Episode static'] !== '' ? d['Episode static'] : ''
  }</div>
`;

export const tooltipContraceptionClickContent = (d) =>
  `
  <div>${d['Date']}</div>
  <div>${d['Name of method']}</div>
  ${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
  ${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div>${
    d['Episode static'] && d['Episode static'] !== '' ? d['Episode static'] : ''
  }</div>
  ${
    d['Clinician details'] && d['Clinician details'] !== ''
      ? ` <div><b>Clinician details: </b>${d['Clinician details']}</div>`
      : ''
  }
  ${
    d['Clinician'] && d['Clinician'] !== ''
      ? ` <div><b>Clinician: </b>${d['Clinician']}</div>`
      : ''
  }
  ${
    d['Clinic location'] && d['Clinic location'] !== ''
      ? ` <div><b>Clinic location: </b>${d['Clinic location']}</div>`
      : ''
  }
  ${
    d['Brand'] && d['Brand'] !== ''
      ? ` <div><b>Brand: </b>${d['Brand']}</div>`
      : ''
  }
  ${
    d['Dose'] && d['Dose'] !== '' ? ` <div><b>Dose: </b>${d['Dose']}</div>` : ''
  }
  ${
    d['Site'] && d['Site'] !== '' ? ` <div><b>Site: </b>${d['Site']}</div>` : ''
  }
  ${
    d['Bath number'] && d['Bath number'] !== ''
      ? ` <div><b>Bath number: </b>${d['Bath number']}</div>`
      : ''
  }
  ${
    d['Expiry date'] && d['Expiry date'] !== ''
      ? ` <div><b>Expiry date: </b>${d['Expiry date']}</div>`
      : ''
  }
`;

export const tooltipContraceptionClickContentRange = (d) =>
  `
  ${d['Date start'] ? `<div><b>Date start: </b>${d['Date start']}</div>` : ''}
  ${d['Date end'] ? `<div><b>Date end: </b>${d['Date end']}</div>` : ''}
  ${
    d['Date inactive']
      ? `<div><b>Date inactive: </b>${d['Date inactive']}</div>`
      : ''
  }
  <div>${d['Name of method']}</div>
  ${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
  ${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div>${
    d['Episode static'] && d['Episode static'] !== '' ? d['Episode static'] : ''
  }</div>
  ${
    d['Clinician details'] && d['Clinician details'] !== ''
      ? ` <div><b>Clinician details: </b>${d['Clinician details']}</div>`
      : ''
  }
  ${
    d['Clinician'] && d['Clinician'] !== ''
      ? ` <div><b>Clinician: </b>${d['Clinician']}</div>`
      : ''
  }
  ${
    d['Clinic location'] && d['Clinic location'] !== ''
      ? ` <div><b>Clinic location: </b>${d['Clinic location']}</div>`
      : ''
  }
  ${
    d['Brand'] && d['Brand'] !== ''
      ? ` <div><b>Brand: </b>${d['Brand']}</div>`
      : ''
  }
  ${
    d['Dose'] && d['Dose'] !== '' ? ` <div><b>Dose: </b>${d['Dose']}</div>` : ''
  }
  ${
    d['Site'] && d['Site'] !== '' ? ` <div><b>Site: </b>${d['Site']}</div>` : ''
  }
  ${
    d['Bath number'] && d['Bath number'] !== ''
      ? ` <div><b>Bath number: </b>${d['Bath number']}</div>`
      : ''
  }
  ${
    d['Expiry date'] && d['Expiry date'] !== ''
      ? ` <div><b>Expiry date: </b>${d['Expiry date']}</div>`
      : ''
  }
`;

export const tooltipContentRange = (d) =>
  `
  ${d['Date start'] ? `<div><b>Date start: </b>${d['Date start']}</div>` : ''}
  ${d['Date end'] ? `<div><b>Date end: </b>${d['Date end']}</div>` : ''}
<div>${d['category']}</div>
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
`;

export const tooltipClickContentRange = (d) =>
  `
  ${d['Date start'] ? `<div><b>Date start: </b>${d['Date start']}</div>` : ''}
  ${d['Date end'] ? `<div><b>Date end: </b>${d['Date end']}</div>` : ''}
<div>${d['category']}</div>
${d['Status 1'] && d['Status 1'] !== '' ? `<div>${d['Status 1']}</div>` : ''}
${d['Status 2'] && d['Status 2'] !== '' ? `<div>${d['Status 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div>${
    d['Status hover'] && d['Status hover'] !== '' ? d['Status hover'] : ''
  }</div>
${
  d['Clinician'] && d['Clinician'] !== ''
    ? ` <div><b>Clinician: </b>${d['Clinician']}</div>`
    : ''
}
${
  d['Clinic location'] && d['Clinic location'] !== ''
    ? ` <div><b>Clinic location: </b>${d['Clinic location']}</div>`
    : ''
}
${
  d['Brand'] && d['Brand'] !== ''
    ? ` <div><b>Brand: </b>${d['Brand']}</div>`
    : ''
}
${d['Dose'] && d['Dose'] !== '' ? ` <div><b>Dose: </b>${d['Dose']}</div>` : ''}
${d['Site'] && d['Site'] !== '' ? ` <div><b>Site: </b>${d['Site']}</div>` : ''}
${
  d['Bath number'] && d['Bath number'] !== ''
    ? ` <div><b>Bath number: </b>${d['Bath number']}</div>`
    : ''
}
${
  d['Expiry date'] && d['Expiry date'] !== ''
    ? ` <div><b>Expiry date: </b>${d['Expiry date']}</div>`
    : ''
}
`;

export const tooltipContent = (d) =>
  `<div>${d['Date']}</div>
<div>${d['Name of test']}</div>
<div>${d['Result 1']}</div>
${d['Result 2'] && d['Result 2'] !== '' ? `<div>${d['Result 2']}</div>` : ''}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
${
  d['Result hover'] && d['Result hover'] !== ''
    ? `<div>${d['Result hover']}</div>`
    : ''
}
${
  d['aggNumber'] > 1
    ? `<div><b>CAUTION-this is an aggregated result from more than one test.</b>`
    : ''
}
`;

export const tooltipClickContent = (d) =>
  `<div><b>Date: </b>${d['Date']}</div>
<div><b>Name of test: </b>${d['Name of test']}</div>
<div><b>Result: </b>${d['Result 1']}</div>
${
  d['Result 2'] && d['Result 2'] !== ''
    ? `<div><b>Result 2: </b>${d['Result 2']}</div>`
    : ''
}
<div>${
    d['Timeline static'] && d['Timeline static'] !== ''
      ? d['Timeline static']
      : ''
  }</div>
<div>${
    d['Result hover'] && d['Result hover'] !== '' ? d['Result hover'] : ''
  }</div>
${
  d['Clinical details'] && d['Clinical details'] !== ''
    ? ` <div><b>Clinical details: </b>${d['Clinical details']}</div>`
    : ''
}
${
  d['Date received in lab'] && d['Date received in lab'] !== ''
    ? `<div><b>Date received in lab: </b>${d['Date received in lab']}</div>`
    : 'Not reported'
}
${
  d['Date reported'] && d['Date reported'] !== ''
    ? `<div><b>Date reported: </b>${d['Date reported']}</div>`
    : ''
}
${
  d['Lab reference'] && d['Lab reference'] !== ''
    ? `<div><b>Lab reference: </b>${d['Lab reference']}</div>`
    : ''
}
<div><b>Clinician: </b>${d['Clinician']}</div>
<div><b>Clinic location: </b>${d['Clinic location']}</div>
${
  d['aggNumber'] > 1
    ? `<div><b>CAUTION-this is an aggregated result from more than one test.</b>`
    : ''
}
`;

export const getYOrder = (y2) => {
  if (y2 === 'In-clinic tests') {
    return ['Urine dip', 'Preg', 'Microscopy', 'TV Ag'];
  } else if (y2 === 'Non-STI MC&S') {
    return ['Urine MC&S', 'HVS MC&S'];
  } else if (y2 === 'STIs') {
    return ['CT', 'LGV', 'GC', 'MGen'];
  } else if (y2 === 'Ulcer swabs') {
    return ['HSV swab', 'Syphilis swab', 'MPV swab'];
  } else if (y2 === 'Other') {
    return ['Other'];
  } else if (y2 === 'Blood-borne infections') {
    return ['HIV', 'STS', 'HAV', 'HBV', 'HCV', 'Other'];
  } else if (y2 === 'Biochemistry') {
    return ['Urine chem', 'U&E (set)', 'LFT (set)', 'Bone (set)'];
  } else if (y2 === 'Haematology') {
    return ['FBC (set)', 'Clotting (set)', 'Haematinics (set)'];
  } else if (y2 === 'Radiology') {
    return ['X-Ray', 'Ultrasound', 'CT scan', 'Other'];
  } else if (y2 === 'Vaccines') {
    return [
      'HAV vax',
      'HBV vax',
      'HPV vax',
      'MPV vax',
      'C-19 vax',
      'Flu vax',
      'Pneumo vax',
      'Other vax',
    ];
  } else if (y2 === 'IUD') {
    return ['IUD'];
  } else if (y2 === 'IUS') {
    return ['IUS'];
  } else if (y2 === 'Implant') {
    return ['IMP'];
  } else if (y2 === 'Injectables') {
    return ['Depo', 'Sayana'];
  } else if (y2 === 'Progesterone-only pill') {
    return ['POP'];
  } else if (y2 === 'Combined Hormonal Contraception') {
    return ['COC', 'Patch', 'Ring'];
  } else if (y2 === 'Emergency Contraception') {
    return ['UPA', 'LNG'];
  } else if (y2 === 'Termination of Pregnancy') {
    return ['mTOP', 'sTOP'];
  } else if (y2 === 'ISH Medication') {
    return [
      'Truvada PO',
      'Benzathine IM',
      'Doxycycline PO',
      'Aciclovir PO',
      'Ceftriaxone IM',
      'Azithromycin PO',
      'Plasters',
    ];
  } else if (y2 === 'Other Medication') {
    return [
      'Atorvastatin PO',
      'Citalopram PO',
      "St john's Wort PO",
      'Sertraline PO',
      'Venlaflaxine PO',
      'Co-Amoxiclav PO',
      'Ofloxacin PO',
    ];
  } else if (y2 === 'Recreational') {
    return ['Cocaine nasal', 'MDMA PO', 'Cannabis smoking', 'Cannabis oil'];
  }
};

export const getEndDate = (year, d) => {
  if (d === 'ongoing') {
    return new Date(year, 11, 31);
  } else if (new Date(d).getFullYear() > year) {
    return new Date(year, 11, 31);
  } else {
    return new Date(d);
  }
};

export const getStartDate = (year, d1, d2) => {
  if (d2 === 'ongoing' && new Date(d1) < new Date(year, 0, 1)) {
    return new Date(year, 0, 1);
  } else if (
    new Date(d1) < new Date(year, 0, 1) &&
    new Date(d2) > new Date(year, 0, 1)
  ) {
    return new Date(year, 0, 1);
  } else {
    return new Date(d1);
  }
};

export const getArrowHead = (year, d1, d2) => {
  if (
    d1.getTime() === new Date(year, 0, 1).getTime() &&
    d2.getTime() === new Date(year, 11, 31).getTime()
  ) {
    return 'both';
  } else if (d2.getTime() === new Date(year, 11, 31).getTime()) {
    return 'right';
  } else if (d1.getTime() === new Date(year, 0, 1).getTime()) {
    return 'left';
  } else {
    return 'none';
  }
};

export const defaultDetailsParams = {
  containerId: 'detail-panel',
  width: window.innerWidth * 0.45,
  outerAccessorCol: 'Category',
  innerAccessorCol: 'taxonomicCD',
  colorAccessorCol: 'color',
  showPrevious: true,
};

export const generateArrow = (svg, direction, color) => {
  const triangle = svg
    .append('defs')
    .append('marker')
    .attr('id', 'triangle-' + direction + '-' + color)
    .attr('viewBox', '0 0 4000 4000')
    .attr('refX', direction === 'left' ? '-20px' : '55px')
    .attr('refY', '50px')
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', 100)
    .attr('markerHeight', 100);

  triangle
    .append('path')
    .attr(
      'd',
      direction === 'left' ? 'M 0,50 97.5,5 97.5,95 Z' : 'M 95,50 5,95 5,0 z'
    )
    .attr('fill', color);
};
