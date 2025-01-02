import XLSX from 'sheetjs-style';

export const DemandePret = (dataSIB3: any[], dataSIB4: any[]) => {
  const dPrtSIB3 = dataSIB3[0];
  const dPrtSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

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

  for (let i = 0; i < dPrtSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < dPrtSIB4.length; j++) {
      // champs de jointure
      if (
        dPrtSIB3[i]['DP_DT_DEM'] === dPrtSIB4[j]['DateDemande'] &&
        dPrtSIB3[i]['DP_I_DUR_PRETDEM'] === dPrtSIB4[j]['DureeDemande'] &&
        dPrtSIB3[i]['DP_I_DUR_PRETACCORDE'] === dPrtSIB4[j]['DureeAccorde'] &&
        dPrtSIB3[i]['DP_PRD_ID'] === dPrtSIB4[j]['ProduitId'] &&
        dPrtSIB3[i]['DP_E_MNTDEM'] === dPrtSIB4[j]['MontantDemande'] &&
        dPrtSIB3[i]['DP_E_MNTACCORDE'] === dPrtSIB4[j]['MontantAccorde'] &&
        dPrtSIB3[i]['MBR_NUM'] === dPrtSIB4[j]['NumeroMembre']
      ) {
        temp = ['OK'];
        found = true;
        for (let matColumns of machingColumns) {
          if (dPrtSIB3[i][matColumns[0]] === dPrtSIB4[j][matColumns[1]]) {
            temp.push(
              `${dPrtSIB3[i][matColumns[0]]} = ${dPrtSIB4[j][matColumns[1]]}`,
            );
          } else {
            temp.push(
              `${dPrtSIB3[i][matColumns[0]]} -> ${dPrtSIB4[j][matColumns[1]]}`,
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
        temp.push(`${dPrtSIB3[i][matColumns[0]]} -> `);
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
    [dPrtSIB3.length, dPrtSIB4.length, dPrtSIB3.length - dPrtSIB4.length],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(dPrtSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(dPrtSIB4);
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
