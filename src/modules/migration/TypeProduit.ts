import XLSX from 'sheetjs-style';

export const TypeProduit = (dataSIB3: any[], dataSIB4: any[]) => {
  const TyProdSIB3 = dataSIB3[0];
  const TyProdSIB4 = dataSIB4[0];
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

  for (let i = 0; i < TyProdSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < TyProdSIB4.length; j++) {
      // clés primaires (TTP_ID, Id)
      if (TyProdSIB3[i]['TTP_ID'] === TyProdSIB4[j]['Id']) {
        temp = ['OK'];
        found = true;
        for (let matColumns of machingColumns) {
          if (TyProdSIB3[i][matColumns[0]] === TyProdSIB4[j][matColumns[1]]) {
            temp.push(
              `${TyProdSIB3[i][matColumns[0]]} = ${
                TyProdSIB4[j][matColumns[1]]
              }`,
            );
          } else {
            temp.push(
              `${TyProdSIB3[i][matColumns[0]]} -> ${
                TyProdSIB4[j][matColumns[1]]
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
        temp.push(`${TyProdSIB3[i][matColumns[0]]} -> `);
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
    [
      TyProdSIB3.length,
      TyProdSIB4.length,
      TyProdSIB3.length - TyProdSIB4.length,
    ],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(TyProdSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(TyProdSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - TypeProduit');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - TypeProduit');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 TypeProduit');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 TypeProduit');
  XLSX.writeFile(wb, `RevueMigration - TypeProduit.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['TTP_ID', 'Id'],
  ['TTP_CH_CODE', 'Code'],
  ['TTP_CH_NOM', 'Nom'],
  ['TTP_BL_PARTSOC', 'IsPartSociale'],
  ['TTP_BL_MONO', 'IsMono'],
  ['TTP_BL_SUP', 'IsSupport'],
  ['TTP_BL_MNT', 'IsMontant'],
  ['TTP_BL_TAUX', 'IsTaux'],
  ['TTP_BL_DUR', 'IsDuree'],
  ['TTP_BL_PER', 'Periodicite'],
  ['TTP_BL_OUV', 'IsOuverture'],
  ['TTP_BL_CLO', 'IsCloture'],
  ['TTP_BL_DECOUV', 'IsDecouvert'],
  ['TTP_BL_DIFAMO', 'IsDifferreAmortissement'],
  ['TTP_BL_CALINTLIV', 'IsCalculIneteretLIVCER'],
  ['TTP_BL_LIVRUPT', 'IsRupture'],
  ['TTP_BL_RECOND', 'IsReconduction'],
  ['TTP_BL_PRECOM', 'IsPrecompte'],
  ['TTP_BL_CALINTCRE', 'IsMethodeCalculInteret'],
  ['TTP_BL_TXRTD', 'IsTauxRetard'],
  ['TTP_BL_RETARD', 'IsRetard'],
  ['TTP_BL_PROV', 'IsProvision'],
  ['TTP_BL_CPTP1', 'IsComptePrincipal1'],
  ['TTP_BL_CPTP2', 'IsComptePrincipal2'],
  ['TTP_BL_CPTP3', 'IsComptePrincipal3'],
  ['TTP_BL_CPTG1', 'IsCompteGestion1'],
  ['TTP_BL_CPTG2', 'IsCompteGestion2'],
  ['TTP_BL_BLCEPA', 'IsBlocageEpargne'],
  ['TTP_BL_ANC', 'IsAnciennete'],
  ['TTP_BL_FRAISDOS', 'IsFraisDossier'],
  ['TTP_BL_TAUXASS', 'IsTauxAssurance'],
  ['TTP_BL_ANTICIPE', 'IsAnticipe'],
  ['TTP_BL_DEPOT', 'IsDepot'],
  ['TTP_BL_FRAISDEBLOCAGE', 'IsFraisDeblocage'],
  ['ACTIF', 'Actif'],
];
