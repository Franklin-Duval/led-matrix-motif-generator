import XLSX from 'sheetjs-style';

export const Comptabilite = (dataSIB3: any[], dataSIB4: any[]) => {
  const comptSIB3 = dataSIB3[0];
  const comptSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // ----------------- INTEGRITE

  // set Header content of excel table
  let count = {
    OK: 0,
    KO: 0,
    '--': 0,
  };
  let temp = ['Status']; // first column
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < comptSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < comptSIB4.length; j++) {
      // clés primaires (COM_CG_ID, CompteComptableId)
      if (comptSIB3[i]['COM_CG_ID'] === comptSIB4[j]['CompteComptableId']) {
        temp = ['OK'];
        found = true;
        for (let matColumns of machingColumns) {
          if (comptSIB3[i][matColumns[0]] === comptSIB4[j][matColumns[1]]) {
            temp.push(
              `${comptSIB3[i][matColumns[0]]} = ${comptSIB4[j][matColumns[1]]}`,
            );
          } else {
            temp.push(
              `${comptSIB3[i][matColumns[0]]} -> ${
                comptSIB4[j][matColumns[1]]
              }`,
            );
            temp[0] = 'KO';
          }
        }
        dataInSheet.push(temp);
        break;
      }
    }
    if (found === false) {
      temp = ['--'];
      for (let matColumns of machingColumns) {
        temp.push(`${comptSIB3[i][matColumns[0]]} -> `);
      }
      dataInSheet.push(temp);
    }
    if (temp[0] === 'OK') count.OK = count.OK + 1;
    else if (temp[0] === 'KO') count.KO = count.KO + 1;
    else count['--'] = count['--'] + 1;
  }
  console.log(dataInSheet);

  let wsInteg = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  // STYLE EXCEL FILE
  // get dimensions of worksheet with "!ref"
  const range = XLSX.utils.decode_range(wsInteg['!ref'] as string); // ex. range -> A1:C4

  // set styles to header
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      let cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

      if (row === 0) {
        // first line - Header style
        wsInteg[cellAddress].s = {
          font: { bold: true, sz: 11 },
        };
      } else if (col === 0) {
        // first column status
        if (wsInteg[cellAddress].v === 'OK')
          wsInteg[cellAddress].s = { fill: { fgColor: { rgb: '4caf50' } } };
        else wsInteg[cellAddress].s = { fill: { fgColor: { rgb: 'f44336' } } };
      } else {
        if (String(wsInteg[cellAddress].v).includes('->'))
          wsInteg[cellAddress].s = { fill: { fgColor: { rgb: 'f44336' } } };
      }
    }
  }

  // ----------------- EXHAUSTIVITE
  dataInSheet = [
    ['SIBanque 3', 'SIBanque 4', 'Résultat'],
    [comptSIB3.length, comptSIB4.length, comptSIB3.length - comptSIB4.length],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(comptSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(comptSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Comptabilité');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Comptabilité');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Comptabilité');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Comptabilité');
  XLSX.writeFile(wb, `RevueMigration - Comptabilite.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['COM_CG_ID', 'CompteComptableId'],
  ['COM_E_DEB', 'Debit'],
  ['COM_E_CRD', 'Credit'],
  ['COM_E_RPT', 'Report'],
];
