import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const Garantie = (dataSIB3: any[], dataSIB4: any[]) => {
  let garaSIB3 = dataSIB3[0];
  let garaSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const dPrtSIB3 = getRecord(dataSIB3[1], 'DP_ID');
  const membreSIB3 = getRecord(dataSIB3[2], 'MBR_ID');
  const dPrtSIB4 = getRecord(dataSIB4[1], 'Id');
  const societaireSIB4 = getRecord(dataSIB4[2], 'Id');
  const cptCliSIB4 = getRecord(dataSIB4[3], 'Id');

  garaSIB3 = garaSIB3.map((gar: any) => {
    return {
      ...gar,
      'GAR_MBR_ID.Membres.MBR_NUM':
        membreSIB3[gar.GAR_MBR_ID]?.MBR_NUM || 'NULL',
      'GAR_DP_ID.DemandePret.DP_DT_DEM':
        dPrtSIB3[gar.GAR_DP_ID]?.DP_DT_DEM || 'NULL',
      'GAR_DP_ID.DemandePret.DP_E_MNTDEM':
        dPrtSIB3[gar.GAR_DP_ID]?.DP_E_MNTDEM || 'NULL',
      'GAR_DP_ID.DemandePret.DP_PRD_ID':
        dPrtSIB3[gar.GAR_DP_ID]?.DP_PRD_ID || 'NULL',
    };
  });

  garaSIB4 = garaSIB4.map((gar: any) => {
    return {
      ...gar,
      'CompteClientId.CompteClient.NumeroCompte':
        cptCliSIB4[gar.CompteClientId]?.NumeroCompte || 'NULL',
      'SocietaireId.Societaire.NumeroMembre':
        societaireSIB4[gar.SocietaireId]?.NumeroMembre || 'NULL',
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
  temp.push(`GAR_ID | Id`);
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < garaSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < garaSIB4.length; j++) {
      // clés primaires GAR_DT_SAISIE, GAR_CH_LIB, GAR_E_MNTEVAL
      if (
        garaSIB3[i]['GAR_DT_SAISIE'] === garaSIB4[j]['DateSaisie'] &&
        garaSIB3[i]['GAR_CH_LIB'] === garaSIB4[j]['Libelle'] &&
        garaSIB3[i]['GAR_E_MNTEVAL'] === garaSIB4[j]['Montant']
        //&& garaSIB3[i]['GAR_DP_ID.DemandePret.DP_DT_DEM'] ===
        //   garaSIB4[j]['DemandePretId.DemandePret.DateDemande'] &&
        // garaSIB3[i]['GAR_DP_ID.DemandePret.DP_E_MNTDEM'] ===
        //   garaSIB4[j]['DemandePretId.DemandePret.MontantDemande']
      ) {
        temp = ['OK'];
        temp.push(`${garaSIB3[i]['GAR_ID']} | ${garaSIB4[j]['Id']}`);
        found = true;
        for (let matColumns of machingColumns) {
          if (garaSIB3[i][matColumns[0]] === garaSIB4[j][matColumns[1]]) {
            temp.push(
              `${garaSIB3[i][matColumns[0]]} = ${garaSIB4[j][matColumns[1]]}`,
            );
          } else {
            temp.push(
              `${garaSIB3[i][matColumns[0]]} -> ${garaSIB4[j][matColumns[1]]}`,
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
        temp.push(`${garaSIB3[i][matColumns[0]]} -> `);
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
    [garaSIB3.length, garaSIB4.length, garaSIB3.length - garaSIB4.length],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(garaSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(garaSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Garantie');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Garantie');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Garantie');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Garantie');
  XLSX.writeFile(wb, `RevueMigration - Garantie.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['GAR_DT_SAISIE', 'DateSaisie'],
  ['GAR_CH_LIB', 'Libelle'],
  ['GAR_E_MNTEVAL', 'Montant'],
  ['GAR_CSS_ID', 'Code'],
  ['GAR_DP_ID.DemandePret.DP_DT_DEM', 'DemandePretId.DemandePret.DateDemande'],
  [
    'GAR_DP_ID.DemandePret.DP_E_MNTDEM',
    'DemandePretId.DemandePret.MontantDemande',
  ],
  ['GAR_DP_ID.DemandePret.DP_PRD_ID', 'DemandePretId.DemandePret.ProduitId'],
  ['GAR_CCL_ID', 'CompteClientId.CompteClient.NumeroCompte'],
  ['GAR_MBR_ID.Membres.MBR_NUM', 'SocietaireId.Societaire.NumeroMembre'],
  // ['GAR_UTI_ID', 'UtilisateurId'],
];
