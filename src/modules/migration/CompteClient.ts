import XLSX from 'sheetjs-style';

export const CompteClient = (dataSIB3: any[], dataSIB4: any[]) => {
  const cptCLISIB3 = dataSIB3[0];
  const cptCLISIB4 = dataSIB4[0];
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

  for (let i = 0; i < cptCLISIB3.length; i++) {
    let found = false;
    for (let j = 0; j < cptCLISIB4.length; j++) {
      // clés primaires (CCL_ID , NumeroCompte)
      if (cptCLISIB3[i]['CCL_ID'] === cptCLISIB4[j]['NumeroCompte']) {
        temp = ['OK'];
        found = true;
        for (let matColumns of machingColumns) {
          if (cptCLISIB3[i][matColumns[0]] === cptCLISIB4[j][matColumns[1]]) {
            temp.push(
              `${cptCLISIB3[i][matColumns[0]]} = ${
                cptCLISIB4[j][matColumns[1]]
              }`,
            );
          } else {
            temp.push(
              `${cptCLISIB3[i][matColumns[0]]} -> ${
                cptCLISIB4[j][matColumns[1]]
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
        temp.push(`${cptCLISIB3[i][matColumns[0]]} -> `);
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
      cptCLISIB3.length,
      cptCLISIB4.length,
      cptCLISIB3.length - cptCLISIB4.length,
    ],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(cptCLISIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(cptCLISIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Compte client');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Compte client');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Compte client');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Compte client');
  XLSX.writeFile(wb, `RevueMigration - Compte client.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['CCL_PRD_ID', 'ProduitId'],
  ['CCL_DT_OUV', 'DateOuverture'],
  ['CCL_E_MNTPRD', 'MontantProduit'],
  ['CCL_E_CPTP1', 'ComptePrincipal1'],
  ['CCL_E_CPTP2', 'ComptePrincipal2'],
  ['CCL_E_CPTP3', 'ComptePrincipal3'],
  ['CCL_E_CPTG1', 'CompteGestion1'],
  ['CCL_E_CPTG2', 'CompteGestion2'],
  ['CCL_N_TAUX', 'Taux'],
  ['CCL_DT_DEROP', 'DateDerniereOperation'],
  ['CCL_DT_CLO', 'DateCloture'],
  ['CCL_DT_TRAITEMENT', 'DateTraitement'],
  ['CCL_BL_DATVAL', 'IsDateValeur'],
  // ['CCL_E_MNTBLO', 'MontantBloque'],
  ['CCL_UTI_ID', 'UtilisateurId'],
];
