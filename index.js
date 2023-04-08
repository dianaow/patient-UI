// Import stylesheets
import './style.css';
import Timeline from './Timeline';
import Header from './Header';
import { fullData } from './data.js';
import { STIs } from './sti.js';
import { BBIs } from './bbi.js';
import { other } from './other.js';
import { vaccines } from './vaccines.js';
import { contraception } from './contraception.js';
import { medication } from './medication.js';
import { test_results, colorTests } from './consts.js';

const YEAR = 2022;

// STI
let datasetSTI = STIs.map((d, i) => {
  return {
    ...d,
    timestamp: new Date(d['Date']),
    taxonomicCD:
      d['Category2'] === 'STIs' || d['Category2'] === 'Ulcer swabs'
        ? d['Name of test'].split(' ')[1] +
          ' ' +
          d['Name of test'].split(' ')[2]
        : d['Name of test'],
    color: colorTests[test_results.indexOf(d['Result 1'])],
    Row: fullData.find(
      (el) => el.Section === 'STIs' && el['Name of test'] === d['Name of test']
    ).Row,
  };
});

const detailItemsSTI = datasetSTI.map((d) => d['Name of test']);
const sortOrderSTI = fullData
  .filter((d) => d.Section === 'STIs')
  .map((d) => d['Name of test']);

const datasetSTIEmpty = fullData
  .filter((d) => d.Section === 'STIs')
  .map((d) => {
    if (detailItemsSTI.indexOf(d['Name of test']) === -1) {
      return {
        ...d,
        timestamp: null,
        taxonomicCD:
          d['Category2'] === 'STIs' || d['Category2'] === 'Ulcer swabs'
            ? d['Name of test'].split(' ')[1] +
              ' ' +
              d['Name of test'].split(' ')[2]
            : d['Name of test'],
      };
    }
  });

datasetSTI = datasetSTI
  .concat(datasetSTIEmpty)
  .filter((d) => d)
  .sort(
    (a, b) =>
      sortOrderSTI.indexOf(a['Name of test']) -
      sortOrderSTI.indexOf(b['Name of test'])
  )
  .sort((a, b) => a['Row'] - b['Row']);

const y2STIDomain = [...new Set(datasetSTI.map((d) => d['Category2']))];
/////////// STI ///////////

// BBI
let datasetBBI = BBIs.map((d, i) => {
  return {
    ...d,
    timestamp: new Date(d['Date']),
    taxonomicCD: d['Name of test'],
    color: colorTests[test_results.indexOf(d['Result 1'])],
    dummy: d['Category'] + '-' + d['Name of test'],
    Row: fullData.find(
      (el) => el.Section === 'BBIs' && el['Name of test'] === d['Name of test']
    ).Row,
  };
});

const detailItemsBBI = datasetBBI.map((d) => d.dummy);
const sortOrderBBI = fullData
  .filter((d) => d.Section === 'BBIs')
  .map((d) => d['Name of test']);
const sortOrderBBICategory = ['HIV', 'STS', 'HAV', 'HBV', 'HCV', 'Other'];

const datasetBBIEmpty = fullData
  .filter((d) => d.Section === 'BBIs')
  .map((d) => {
    if (
      detailItemsBBI.indexOf(d['Category'] + '-' + d['Name of test']) === -1
    ) {
      return {
        ...d,
        timestamp: null,
        taxonomicCD: d['Name of test'],
      };
    }
  });

datasetBBI = datasetBBI
  .concat(datasetBBIEmpty)
  .filter((d) => d)
  .sort(
    (a, b) =>
      sortOrderBBI.indexOf(a['Name of test']) -
      sortOrderBBI.indexOf(b['Name of test'])
  )
  .sort((a, b) => a['Row'] - b['Row'])
  .sort(
    (a, b) =>
      sortOrderBBICategory.indexOf(a['Category']) -
      sortOrderBBICategory.indexOf(b['Category'])
  );

const y2BBIDomain = [...new Set(datasetBBI.map((d) => d['Category2']))];
/////////// BBI ///////////

// Other
let datasetOther = other.map((d, i) => {
  return {
    ...d,
    timestamp: new Date(d['Date']),
    taxonomicCD: d['Name of test'],
    color: colorTests[test_results.indexOf(d['Result 1'])],
    Row: fullData.find(
      (el) =>
        el.Section === 'Other Tests' && el['Name of test'] === d['Name of test']
    ).Row,
  };
});

const datasetOtherEmpty = fullData
  .filter((d) => d.Section === 'Other Tests')
  .map((d, i) => {
    return {
      ...d,
      timestamp: null,
      taxonomicCD: d['Name of test'],
    };
  });

datasetOther = datasetOtherEmpty.concat(datasetOther).filter((d) => d);

const y2OtherDomain = [...new Set(datasetOther.map((d) => d['Category2']))];
/////////// Other ///////////

// VACCINES
let datasetVaccine = vaccines
  .filter((d) => d['Date'] !== null)
  .map((d, i) => {
    return {
      ...d,
      timestamp: new Date(d['Date']),
      color: 'green',
      color1: '#FFFF00',
      'Status 1': 'Administered',
      taxonomicCD: d['Name of vax'],
      Category: d['Name of vax'],
      Category2: 'Vaccines',
      'Date due start': null,
      'Date due end': null
    };
  });

const detailItemsVaccine = datasetVaccine.map((d) => d['Name of vax']);

const datasetVaccineEmpty = fullData
  .filter((d) => d.Section === 'Vaccines')
  .map((d) => {
    if (detailItemsVaccine.indexOf(d['Name of vax']) === -1) {
      return {
        ...d,
        timestamp: null,
        taxonomicCD: d['Name of vax'],
      };
    }
  });

datasetVaccine = datasetVaccine.concat(datasetVaccineEmpty).filter((d) => d);

const datasetVaccineLines = vaccines
  .filter((d) => d['Date due start'] !== null)
  .map((d, i) => {
    return {
      ...d,
      taxonomicCD: d['Name of vax'],
      Category: d['Name of vax'],
      Category2: 'Vaccines',
      color: d['Date'] != null ? '#FFFF00' : '#FF0000',
      'Status 1': d['Date'] != null ? 'Within due date' : 'Missed',
      'Date start': d['Date due start'],
      'Date end': d['Date due end'],
    };
  });
/////////// VACCINES ///////////

// CONTRACEPTION
const colorContraception = ['#00AEAE', '#FFFF00', '#FFAC1C', '#FF0000'];
const ukmec = ['UKMEC 1', 'UKMEC 2', 'UKMEC 3', 'UKMEC 4'];

let datasetContraception = contraception
  .filter((d) => d['Date'] !== null)
  .map((d, i) => {
    return {
      ...d,
      timestamp: new Date(d['Date']),
      taxonomicCD: d['Name of method'],
      Category: d['Name of method'],
      color:
        d['Status 1'] === null
          ? '#ffffff'
          : colorContraception[
              ukmec.indexOf(d['Status 1'].replace('(init) ', ''))
            ],
      color1:
        d['Status 2'] === null
          ? '#ffffff'
          : colorContraception[
              ukmec.indexOf(d['Status 2'].replace('(cont) ', ''))
            ],
    };
  });

const detailItemsContraception = datasetContraception.map(
  (d) => d['Name of method']
);

const datasetContraceptionEmpty = contraception
  .filter((d) => !d['Date'])
  .map((d) => {
    if (detailItemsContraception.indexOf(d['Name of method']) === -1) {
      return {
        ...d,
        timestamp: null,
        taxonomicCD: d['Name of method'],
        color:
          d['Status 1'] === null
            ? '#ffffff'
            : colorContraception[
                ukmec.indexOf(d['Status 1'].replace('(init) ', ''))
              ],
        color1:
          d['Status 2'] === null
            ? '#ffffff'
            : colorContraception[
                ukmec.indexOf(d['Status 2'].replace('(cont) ', ''))
              ],
      };
    }
  });

const sortOrderContraceptionCategory = [
  'IUD',
  'IUS',
  'Implant',
  'Injectables',
  'Progesterone-only pill',
  'Combined Hormonal Contraception',
  'Emergency Contraception',
  'Termination of Pregnancy',
];

datasetContraception = datasetContraception
  .concat(datasetContraceptionEmpty)
  .filter((d) => d)
  .sort(
    (a, b) =>
      sortOrderContraceptionCategory.indexOf(a['Category2']) -
      sortOrderContraceptionCategory.indexOf(b['Category2'])
  );

const datasetContraceptionInUse = contraception
  .filter((d) => d['Date start'] !== null)
  .map((d, i) => {
    return {
      ...d,
      taxonomicCD: d['Name of method'],
      Category: d['Name of method'],
      color:
        d['Status 1'] === null
          ? '#000000'
          : colorContraception[
              ukmec.indexOf(d['Status 1'].replace('(init) ', ''))
            ],
      color1:
        d['Status 2'] === null
          ? '#000000'
          : colorContraception[
              ukmec.indexOf(d['Status 2'].replace('(cont) ', ''))
            ],
      line: 1,
    };
  });

const datasetContraceptionActive = contraception
  .filter((d) => d['Category2'] === 'Implant')
  .map((d, i) => {
    return {
      ...d,
      taxonomicCD: d['Name of method'],
      Category: d['Name of method'],
      color: '#0000FF',
      line: 2,
    };
  });

const y2ContraceptionDomain = [
  ...new Set(datasetContraception.map((d) => d['Category2']).filter((d) => d)),
];
/////////// CONTRACEPTION ///////////

// MEDICATION
const getMedicationColors = (d) => {
  if (d['Status 2'] === 'Allergy') {
    return '#FF0000';
  } else if (new Date(d['Date end']) < new Date()) {
    return '#A9A9A9';
  } else if (d['Date end'] === 'ongoing') {
    return '#000000';
  }
};

const datasetMedication = medication
  .filter((d) => d['Date'] !== null)
  .map((d, i) => {
    return {
      ...d,
      timestamp: new Date(d['Date']),
      taxonomicCD: d['Name of drug'],
      Category: d['Name of drug'],
      Category2: d['Category'],
      color: getMedicationColors(d),
      'Status 1': d['Status 2'] || 'Administered',
    };
  })
  .sort(
    (a, b) =>
      sortOrderSTI.indexOf(a['Name of test']) -
      sortOrderSTI.indexOf(b['Name of test'])
  );

const datasetMedicationRange = medication
  .filter((d) => d['Date start'] !== null)
  .map((d, i) => {
    return {
      ...d,
      taxonomicCD: d['Name of drug'],
      Category: d['Name of drug'],
      Category2: d['Category'],
      color: getMedicationColors(d),
      'Status 1': d['Status 2'] || 'Administered',
    };
  });

const y2MedDomain = [
  ...new Set(
    datasetMedication
      .concat(datasetMedicationRange)
      .map((d) => d.Category2)
      .filter((d) => d)
  ),
];
/////////// MEDICATION ///////////

const dates = datasetSTI
  .concat(
    datasetBBI,
    datasetOther,
    datasetVaccine,
    datasetContraception,
    datasetMedication
  )
  .filter((d) => d['timestamp'])
  .map((d) => d['timestamp'])
  .filter(
    (date, i, self) =>
      self.findIndex((d) => d.getTime() === date.getTime()) === i
  );

Header({
  containerId: 'xaxis-header',
  year: YEAR,
  xAccessorCol: 'timestamp',
  dates,
  datasetSTI,
  datasetBBI,
  datasetOther,
  datasetVaccine: datasetVaccineLines.concat(datasetVaccine),
  datasetContraception: datasetContraception.concat(datasetContraceptionInUse),
  datasetMedication: medication,
});

Timeline({
  containerId: 'timeline1',
  dataset: datasetSTI,
  xAccessorCol: 'timestamp',
  yAccessorCol: 'Category3',
  y2AccessorCol: 'Category2',
  colorAccessorCol: 'color',
  y2Domain: y2STIDomain,
  year: YEAR,
  id: 'STIs',
});

Timeline({
  containerId: 'timeline2',
  dataset: datasetBBI,
  xAccessorCol: 'timestamp',
  yAccessorCol: 'Category',
  y2AccessorCol: 'Category2',
  colorAccessorCol: 'color',
  y2Domain: y2BBIDomain,
  year: YEAR,
  id: 'BBIs',
});

Timeline({
  containerId: 'timeline2a',
  dataset: datasetVaccine,
  dataRanges: datasetVaccineLines,
  xAccessorCol: 'timestamp',
  yAccessorCol: 'Category',
  y2AccessorCol: 'Category2',
  colorAccessorCol: 'color',
  y2Domain: ['Vaccines'],
  year: YEAR,
  id: 'Vaccines',
});

Timeline({
  containerId: 'timeline3',
  dataset: datasetOther,
  xAccessorCol: 'timestamp',
  yAccessorCol: 'Category3',
  y2AccessorCol: 'Category2',
  colorAccessorCol: 'color',
  y2Domain: y2OtherDomain,
  year: YEAR,
  id: 'Other tests',
});

Timeline({
  containerId: 'timeline4',
  dataset: datasetContraception,
  dataRanges: datasetContraceptionInUse.concat(datasetContraceptionActive),
  xAccessorCol: 'timestamp',
  yAccessorCol: 'Category',
  y2AccessorCol: 'Category2',
  colorAccessorCol: 'color',
  y2Domain: y2ContraceptionDomain,
  year: YEAR,
  id: 'Contraception',
});

Timeline({
  containerId: 'timeline5',
  dataset: datasetMedication,
  dataRanges: datasetMedicationRange,
  xAccessorCol: 'timestamp',
  yAccessorCol: 'Category',
  y2AccessorCol: 'Category2',
  colorAccessorCol: 'color',
  y2Domain: y2MedDomain,
  year: YEAR,
  id: 'Medication',
});
