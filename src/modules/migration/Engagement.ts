import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const Engagement = (dataSIB3: any[], dataSIB4: any[]) => {
  let engSIB3 = dataSIB3[0];
  let engSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const dPrtSIB3 = getRecord(dataSIB3[1], 'DP_ID');
  const dPrtSIB4 = getRecord(dataSIB4[1], 'Id');

  engSIB3 = engSIB3.map((eng: any) => {
    return {
      ...eng,
      'ENG_DP_ID.DemandePret.DP_DT_DEM':
        dPrtSIB3[eng.ENG_DP_ID]?.DP_DT_DEM || 'NULL',
      'ENG_DP_ID.DemandePret.DP_E_MNTDEM':
        dPrtSIB3[eng.ENG_DP_ID]?.DP_E_MNTDEM || 'NULL',
      'ENG_DP_ID.DemandePret.DP_PRD_ID':
        dPrtSIB3[eng.ENG_DP_ID]?.DP_PRD_ID || 'NULL',
    };
  });

  engSIB4 = engSIB4.map((gar: any) => {
    return {
      ...gar,
      'DemandePretId.DemandePret.DateDemande':
        dPrtSIB4[gar.DemandePretId]?.DateDemande || 'NULL',
      'DemandePretId.DemandePret.MontantDemande':
        dPrtSIB4[gar.DemandePretId]?.MontantDemande || 'NULL',
      'DemandePretId.DemandePret.ProduitId':
        dPrtSIB4[gar.DemandePretId]?.ProduitId || 'NULL',
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
  temp.push(`ENG_ID | Id`);
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < engSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < engSIB4.length; j++) {
      // champs de jointures (ENG_DT_SAISIE, DateSaisie)
      if (engSIB3[i]['ENG_DT_SAISIE'] === engSIB4[j]['DateSaisie']) {
        temp = ['OK'];
        temp.push(`${engSIB3[i]['ENG_ID']} | ${engSIB4[j]['Id']}`);
        found = true;
        for (let matColumns of machingColumns) {
          if (engSIB3[i][matColumns[0]] === engSIB4[j][matColumns[1]]) {
            temp.push(
              `${engSIB3[i][matColumns[0]]} = ${engSIB4[j][matColumns[1]]}`,
            );
          } else {
            temp.push(
              `${engSIB3[i][matColumns[0]]} -> ${engSIB4[j][matColumns[1]]}`,
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
      temp.push(`${engSIB3[i]['ENG_ID']} | `);
      for (let matColumns of machingColumns) {
        temp.push(`${engSIB3[i][matColumns[0]]} -> `);
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
    [engSIB3.length, engSIB4.length, engSIB3.length - engSIB4.length],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(engSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(engSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Engagement');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Engagement');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Engagement');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Engagement');
  XLSX.writeFile(wb, `RevueMigration - Engagement.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['ENG_TEN_ID', 'TypeEngagementId'],
  ['ENG_E_MNT', 'montant'],
  ['ENG_I_ETAT', 'EtatEngagementId'],
  ['ENG_DT_SAISIE', 'DateSaisie'],
  ['ENG_DT_DEB', 'DateDebut'],
  ['ENG_DT_FIN', 'DateFin'],
  ['ENG_CH_DESC', 'Description'],
  ['ENG_DP_ID.DemandePret.DP_DT_DEM', 'DemandePretId.DemandePret.DateDemande'],
  [
    'ENG_DP_ID.DemandePret.DP_E_MNTDEM',
    'DemandePretId.DemandePret.MontantDemande',
  ],
  ['ENG_DP_ID.DemandePret.DP_PRD_ID', 'DemandePretId.DemandePret.ProduitId'],
];
