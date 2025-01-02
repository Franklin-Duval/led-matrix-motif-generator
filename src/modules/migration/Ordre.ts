import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const Ordre = (dataSIB3: any[], dataSIB4: any[]) => {
  let OrdreSIB3 = dataSIB3[0];
  let OrdreSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const cptCliSIB4 = getRecord(dataSIB4[1], 'Id');

  OrdreSIB4 = OrdreSIB4.map((ord: any) => {
    return {
      ...ord,
      'CompteClientId.CompteClient.NumeroCompte':
        cptCliSIB4[ord.CompteClientId]?.NumeroCompte || 'NULL',
    };
  });

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

  for (let i = 0; i < OrdreSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < OrdreSIB4.length; j++) {
      // clés primaires : ORD_HE_SAI , ORD_I_CPTJRS
      if (
        OrdreSIB3[i]['ORD_HE_SAI'] === OrdreSIB4[j]['DateSysteme'] &&
        OrdreSIB3[i]['ORD_I_CPTJRS'] === OrdreSIB4[j]['CompteurJour']
      ) {
        temp = ['OK'];
        found = true;
        for (let matColumns of machingColumns) {
          if (OrdreSIB3[i][matColumns[0]] === OrdreSIB4[j][matColumns[1]]) {
            temp.push(
              `${OrdreSIB3[i][matColumns[0]]} = ${OrdreSIB4[j][matColumns[1]]}`,
            );
          } else {
            temp.push(
              `${OrdreSIB3[i][matColumns[0]]} -> ${
                OrdreSIB4[j][matColumns[1]]
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
        temp.push(`${OrdreSIB3[i][matColumns[0]]} -> `);
      }
      dataInSheet.push(temp);
    }
    if (temp[0] === 'OK') count.OK = count.OK + 1;
    else if (temp[0] === 'KO') count.KO = count.KO + 1;
    else count['--'] = count['--'] + 1;
  }

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
    [OrdreSIB3.length, OrdreSIB4.length, OrdreSIB3.length - OrdreSIB4.length],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  // let wsSIB3 = XLSX.utils.json_to_sheet(OrdreSIB3);
  // let wsSIB4 = XLSX.utils.json_to_sheet(OrdreSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Ordre');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Ordre');
  // XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Ordre');
  // XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Ordre');
  XLSX.writeFile(wb, `RevueMigration - Ordre.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['ORD_HE_SAI', 'DateSysteme'],
  ['ORD_I_CPTJRS', 'CompteurJour'],
  ['ORD_DT_SAI', 'DateSaisie'],
  ['ORD_CH_PCE', 'Piece'],
  // ['ORD_OPE_ID', 'OperationId'],
  ['ORD_CH_TYP_OPE', 'TypeOperation'],
  ['ORD_CCL_ID', 'CompteClientId.CompteClient.NumeroCompte'],
  ['ORD_BL_AUTO', 'IsAutomatique'],
  // ['ORD_GCH_ID', 'GuichetId'],
];
