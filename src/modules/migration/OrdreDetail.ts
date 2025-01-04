import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const OrdreDetail = (dataSIB3: any[], dataSIB4: any[]) => {
  let OrdreDetSIB3 = dataSIB3[0];
  let OrdreDetSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const ordreSIB3 = getRecord(dataSIB3[1], 'ORD_ID');
  const ordreSIB4 = getRecord(dataSIB4[1], 'Id');
  const cptCliSIB4 = getRecord(dataSIB4[2], 'Id');

  OrdreDetSIB3 = OrdreDetSIB3.map((ordDet: any) => {
    return {
      ...ordDet,
      'DOR_ORD_ID.Ordre.ORD_HE_SAI':
        ordreSIB3[ordDet.DOR_ORD_ID]?.ORD_HE_SAI || 'NULL',
      'DOR_ORD_ID.Ordre.ORD_I_CPTJRS':
        ordreSIB3[ordDet.DOR_ORD_ID]?.ORD_I_CPTJRS || 'NULL',
    };
  });

  OrdreDetSIB4 = OrdreDetSIB4.map((ordDet: any) => {
    return {
      ...ordDet,
      'OrdreId.Ordre.DateSysteme':
        ordreSIB4[ordDet.OrdreId]?.DateSysteme || 'NULL',
      'OrdreId.Ordre.CompteurJour':
        ordreSIB4[ordDet.OrdreId]?.CompteurJour || 'NULL',
      'CompteClientId.CompteClient.NumeroCompte':
        cptCliSIB4[ordDet.CompteClientId]?.NumeroCompte || 'NULL',
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
  temp.push(`DOR_ID | Id`);
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < OrdreDetSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < OrdreDetSIB4.length; j++) {
      // clés primaires : DOR_ORD_ID.ORD_HE_SAI , DOR_ORD_ID.ORD_I_CPTJRS
      if (
        OrdreDetSIB3[i]['DOR_ORD_ID.Ordre.ORD_HE_SAI'] ===
          OrdreDetSIB4[j]['OrdreId.Ordre.DateSysteme'] &&
        OrdreDetSIB3[i]['DOR_ORD_ID.Ordre.ORD_I_CPTJRS'] ===
          OrdreDetSIB4[j]['OrdreId.Ordre.CompteurJour'] &&
        OrdreDetSIB3[i]['DOR_BL_SENS'] === OrdreDetSIB4[j]['IsSens'] &&
        OrdreDetSIB3[i]['DOR_I_MNT'] === OrdreDetSIB4[j]['Montant']
      ) {
        temp = ['OK'];
        temp.push(`${OrdreDetSIB3[i]['DOR_ID']} | ${OrdreDetSIB4[j]['Id']}`);
        found = true;
        for (let matColumns of machingColumns) {
          if (
            OrdreDetSIB3[i][matColumns[0]] === OrdreDetSIB4[j][matColumns[1]]
          ) {
            temp.push(
              `${OrdreDetSIB3[i][matColumns[0]]} = ${
                OrdreDetSIB4[j][matColumns[1]]
              }`,
            );
          } else {
            temp.push(
              `${OrdreDetSIB3[i][matColumns[0]]} -> ${
                OrdreDetSIB4[j][matColumns[1]]
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
        temp.push(`${OrdreDetSIB3[i][matColumns[0]]} -> `);
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
    [
      OrdreDetSIB3.length,
      OrdreDetSIB4.length,
      OrdreDetSIB3.length - OrdreDetSIB4.length,
    ],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Ordre Détail');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Ordre Détail');
  XLSX.writeFile(wb, `RevueMigration - Ordre Détail.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['DOR_ORD_ID.Ordre.ORD_HE_SAI', 'OrdreId.Ordre.DateSysteme'],
  ['DOR_ORD_ID.Ordre.ORD_I_CPTJRS', 'OrdreId.Ordre.CompteurJour'],
  ['DOR_CCL_ID', 'CompteClientId.CompteClient.NumeroCompte'],
  ['DOR_BL_SENS', 'IsSens'],
  ['DOR_I_MNT', 'Montant'],
];
