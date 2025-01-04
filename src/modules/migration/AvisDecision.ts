import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const AvisEtDecision = (dataSIB3: any[], dataSIB4: any[]) => {
  let aedSIB3 = dataSIB3[0];
  let aedSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const dPrtSIB3 = getRecord(dataSIB3[1], 'DP_ID');
  const membreSIB3 = getRecord(dataSIB3[2], 'MBR_ID');
  const dPrtSIB4 = getRecord(dataSIB4[1], 'Id');
  const societaireSIB4 = getRecord(dataSIB4[2], 'Id');

  aedSIB3 = aedSIB3.map((aed: any) => {
    return {
      ...aed,
      'AED_MBR_ID.Membres.MBR_NUM':
        membreSIB3[aed.AED_MBR_ID]?.MBR_NUM || 'NULL',
      'AED_DP_ID.DemandePret.DP_DT_DEM':
        dPrtSIB3[aed.AED_DP_ID]?.DP_DT_DEM || 'NULL',
      'AED_DP_ID.DemandePret.DP_E_MNTDEM':
        dPrtSIB3[aed.AED_DP_ID]?.DP_E_MNTDEM || 'NULL',
      'AED_DP_ID.DemandePret.DP_PRD_ID':
        dPrtSIB3[aed.AED_DP_ID]?.DP_PRD_ID || 'NULL',
    };
  });

  aedSIB4 = aedSIB4.map((aed: any) => {
    return {
      ...aed,
      'SocietaireId.Societaire.NumeroMembre':
        societaireSIB4[aed.SocietaireId]?.NumeroMembre || 'NULL',
      'DemandePretId.DemandePret.DateDemande':
        dPrtSIB4[aed.DemandePretId]?.DateDemande || 'NULL',
      'DemandePretId.DemandePret.MontantDemande':
        dPrtSIB4[aed.DemandePretId]?.MontantDemande || 'NULL',
      'DemandePretId.DemandePret.ProduitId':
        dPrtSIB4[aed.DemandePretId]?.ProduitId || 'NULL',
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
  temp.push(`AED_ID | Id`);
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < aedSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < aedSIB4.length; j++) {
      // champs de jointures
      if (
        aedSIB3[i]['AED_DP_ID.DemandePret.DP_DT_DEM'] ===
          aedSIB4[j]['DemandePretId.DemandePret.DateDemande'] &&
        aedSIB3[i]['AED_DP_ID.DemandePret.DP_E_MNTDEM'] ===
          aedSIB4[j]['DemandePretId.DemandePret.MontantDemande'] &&
        aedSIB3[i]['AED_DT_SAISIE'] === aedSIB4[j]['DateSaisie'] &&
        aedSIB3[i]['AED_DT_EVAL'] === aedSIB4[j]['DateEvaluation'] &&
        aedSIB3[i]['AED_DT_TRANSM'] === aedSIB4[j]['DateTransmission']
      ) {
        temp = ['OK'];
        temp.push(`${aedSIB3[i]['AED_ID']} | ${aedSIB4[j]['Id']}`);
        found = true;
        for (let matColumns of machingColumns) {
          if (aedSIB3[i][matColumns[0]] === aedSIB4[j][matColumns[1]]) {
            temp.push(
              `${aedSIB3[i][matColumns[0]]} = ${aedSIB4[j][matColumns[1]]}`,
            );
          } else {
            temp.push(
              `${aedSIB3[i][matColumns[0]]} -> ${aedSIB4[j][matColumns[1]]}`,
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
        temp.push(`${aedSIB3[i][matColumns[0]]} -> `);
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
    [aedSIB3.length, aedSIB4.length, aedSIB3.length - aedSIB4.length],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(aedSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(aedSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - AvisEtDecision');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - AvisEtDecision');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 AvisEtDecision');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 AvisEtDecision');
  XLSX.writeFile(wb, `RevueMigration - AvisEtDecision.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  // ['AED_DP_ID', 'DemandePretId'],
  ['AED_I_ETAT', 'EtatAvisEtDecisionId'],
  ['AED_CSS_ID', 'Code'],
  ['AED_TI_ID', 'TypeInstanceId'],
  ['AED_DT_SAISIE', 'DateSaisie'],
  ['AED_DT_EVAL', 'DateEvaluation'],
  ['AED_DT_TRANSM', 'DateTransmission'],
  // ['AED_UTI_ID', 'UtilisateurId'],
  // ['AED_I_AGENT', 'AgentUtilisateurId'],
  ['AED_CH_CPTERENDU', 'CompteRendu'],
  ['AED_MBR_ID.Membres.MBR_NUM', 'SocietaireId.Societaire.NumeroMembre'],
  ['AED_DP_ID.DemandePret.DP_DT_DEM', 'DemandePretId.DemandePret.DateDemande'],
  [
    'AED_DP_ID.DemandePret.DP_E_MNTDEM',
    'DemandePretId.DemandePret.MontantDemande',
  ],
  ['AED_DP_ID.DemandePret.DP_PRD_ID', 'DemandePretId.DemandePret.ProduitId'],
];
