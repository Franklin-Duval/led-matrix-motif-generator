import XLSX from 'sheetjs-style';

export const Comptabilite = (dataSIB3: any[], dataSIB4: any[]) => {
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // ----------------- INTEGRITE

  // set Header content of excel table
  let temp = ['Status']; // first column
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < dataSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < dataSIB4.length; j++) {
      // clés primaires (COM_CG_ID, CompteComptableId)
      if (dataSIB3[i]['COM_CG_ID'] === dataSIB4[j]['CompteComptableId']) {
        temp = ['OK'];
        found = true;
        for (let matColumns of machingColumns) {
          if (dataSIB3[i][matColumns[0]] === dataSIB4[j][matColumns[1]]) {
            temp.push(
              `${dataSIB3[i][matColumns[0]]} = ${dataSIB4[j][matColumns[1]]}`,
            );
          } else {
            temp.push(
              `${dataSIB3[i][matColumns[0]]} -> ${dataSIB4[j][matColumns[1]]}`,
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
        temp.push(`${dataSIB3[i][matColumns[0]]} -> `);
      }
      dataInSheet.push(temp);
    }
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
    [dataSIB3.length, dataSIB4.length, dataSIB3.length - dataSIB4.length],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(dataSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(dataSIB4);
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
