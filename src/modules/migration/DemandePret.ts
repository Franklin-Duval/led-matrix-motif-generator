import XLSX from 'sheetjs-style';

export const DemandePret = (dataSIB3: any[], dataSIB4: any[]) => {
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
      // champs de jointure
      if (
        dataSIB3[i]['DP_DT_DEM'] === dataSIB4[j]['DateDemande'] &&
        dataSIB3[i]['DP_I_DUR_PRETDEM'] === dataSIB4[j]['DureeDemande'] &&
        dataSIB3[i]['DP_I_DUR_PRETACCORDE'] === dataSIB4[j]['DureeAccorde'] &&
        dataSIB3[i]['DP_PRD_ID'] === dataSIB4[j]['ProduitId'] &&
        dataSIB3[i]['DP_E_MNTDEM'] === dataSIB4[j]['MontantDemande'] &&
        dataSIB3[i]['DP_E_MNTACCORDE'] === dataSIB4[j]['MontantAccorde'] &&
        dataSIB3[i]['MBR_NUM'] === dataSIB4[j]['NumeroMembre']
      ) {
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
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - DemandePret');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - DemandePret');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 DemandePret');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 DemandePret');
  XLSX.writeFile(wb, `RevueMigration - DemandePret.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  // ['DP_ID', 'Id'],
  ['DP_DT_DEM', 'DateDemande'],
  ['DP_I_TYPEDEM', 'TypeDemandePretId'],
  ['DP_I_DUR_PRETDEM', 'DureeDemande'],
  ['DP_I_DUR_PRETACCORDE', 'DureeAccorde'],
  ['DP_I_AGENTCREDIT', 'AgentCreditId'],
  // ['DP_OBJ_ID', 'ObjetId'],
  ['DP_PRD_ID', 'ProduitId'],
  ['DP_E_MNTDEM', 'MontantDemande'],
  ['DP_E_MNTACCORDE', 'MontantAccorde'],
  ['DP_I_ETAT', 'EtatDemandePretId'],
  ['DP_BL_CLOSE', 'IsClosed'],
  ['DP_DERN_UTI_ID', 'UtilisateurId'],
  ['DP_CSS_ID', 'Code'],
  // ['DP_MBR_ID', 'SocietaireId'],
  ['DP_E_REVENUMENSUEL', 'RevenuMensuel'],
  ['DP_BL_CONV', 'IsConventionne'],
  ['DP_E_DURGLOBALE_PRETDEM', 'DureeGlobaleDemandee'],
  ['DP_E_DURGLOBALE_PRETACCORDEE', 'DureeGlobaleAccordee'],
  ['DP_ID_SUP', 'CompteSupportId'],
  ['DP_E_CAPAUGM_DEM', 'SupplementDemande'],
  ['DP_E_CAPAUGM_ACCORDE', 'SupplementAccorde'],
  ['DP_DT_OUV', 'DateOuverture'],
  ['DP_N_TAUX', 'TauxPret'],
  ['DP_E_PER', 'PeriodiciteRemboursement'],
  ['DP_DT_ECH', 'DateEcheance'],
  ['DP_N_TXASS', 'TauxAssurance'],
  ['DP_BL_ECH_ASS', 'IsPrelevementEcheanceAssurance'],
  ['DP_BL_DIFAMO', 'DiffereAmortissementId'],
  ['DP_BL_PRELEV_INT', 'TypePrelevementInteretCIF'],
  ['DP_I_DIFECH', 'NombreEcheanceDiffere'],
  ['DP_BL_RECOND', 'IsTaciteReconduction'],
  ['DP_BL_METINT', 'MethodeCalculInteret'],
  ['DP_ID_AV_RESTRUCT', 'CompteAvantRestructurationId'],
  ['DP_I_CRDTRESTRUC', 'TypeRestructurationId'],
  ['DP_BL_PRECOM', 'IsPrecomptageInteret'],
  ['DP_TYP_MBP_ID', 'TypeMembrePhysiqueId'],
];
