import XLSX from 'sheetjs-style';

export const Produit = (dataSIB3: any[], dataSIB4: any[]) => {
  const prodSIB3 = dataSIB3[0];
  const prodSIB4 = dataSIB4[0];
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

  for (let i = 0; i < prodSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < prodSIB4.length; j++) {
      // clés primaires (PRD_ID, Id)
      if (prodSIB3[i]['PRD_ID'] === prodSIB4[j]['Id']) {
        temp = ['OK'];
        found = true;
        for (let matColumns of machingColumns) {
          if (prodSIB3[i][matColumns[0]] === prodSIB4[j][matColumns[1]]) {
            temp.push(
              `${prodSIB3[i][matColumns[0]]} = ${prodSIB4[j][matColumns[1]]}`,
            );
          } else {
            temp.push(
              `${prodSIB3[i][matColumns[0]]} -> ${prodSIB4[j][matColumns[1]]}`,
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
        temp.push(`${prodSIB3[i][matColumns[0]]} -> `);
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
    [prodSIB3.length, prodSIB4.length, prodSIB3.length - prodSIB4.length],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(prodSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(prodSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Produit');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Produit');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Produit');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Produit');
  XLSX.writeFile(wb, `RevueMigration - Produit.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['PRD_ID', 'Id'],
  ['PRD_TTP_ID', 'TypeProduitId'],
  ['PRD_CH_COD', 'Code'],
  ['PRD_CH_NOM', 'Nom'],
  ['PRD_DT_DEBUT', 'DateDebut'],
  ['PRD_DT_FIN', 'DateFin'],
  ['PRD_E_NBMAX', 'NbreMaxParMembre'],
  ['PRD_E_NBHISTO', 'HistoriqueNbreJour'],
  ['PRD_N_TXDOS', 'TauxFraisDossier'],
  ['PRD_I_DOSMINI', 'FraisDossierMin'],
  ['PRD_I_DOSMINI', 'FraisDossierMin'],
  // ['PRD_CH_LIBMNT', 'LibelleMontant'],
  ['PRD_E_MNTMINI', 'MontantMin'],
  ['PRD_E_MNTMAX', 'MontantMax'],
  // ['PRD_CH_LIBTX', 'LibelleTaux'],
  ['PRD_E_TXMAX', 'TauxMax'],
  ['PRD_E_TXMINI', 'TauxMin'],
  ['PRD_N_TXOUV', 'TauxOuverture'],
  ['PRD_E_OUVMINI', 'OuvertureMin'],
  ['PRD_E_OUVMAXI', 'OuvertureMax'],
  ['PRD_N_TXCLO', 'TauxCloture'],
  ['PRD_E_CLOMINI', 'ClotureMin'],
  ['PRD_E_CLOMAXI', 'ClotureMax'],
  ['PRD_CH_CPTP1', 'LibelleComptePrincipal1'],
  ['PRD_CH_CPTP2', 'LibelleComptePrincipal2'],
  ['PRD_CH_CPTP3', 'LibelleComptePrincipal3'],
  ['PRD_CH_CPTG1', 'LibelleCompteGestion1'],
  ['PRD_CH_CPTG2', 'LibelleCompteGestion2'],
  ['PRD_BL_MOBJ', 'IsMonoObjet'],
  ['ACTIF', 'Actif'],
  ['PRD_N_VALEURPART', 'ValeurPart'],
];
