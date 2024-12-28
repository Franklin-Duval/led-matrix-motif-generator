import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const CompteClient = (dataSIB3: any[], dataSIB4: any[]) => {
  let cptCLISIB3 = dataSIB3[0];
  let cptCLISIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const cptAVueSIB4 = getRecord(dataSIB4[1], 'CompteClientId');
  const cptAEchSIB4 = getRecord(dataSIB4[2], 'CompteClientId');
  const cptCredSIB4 = getRecord(dataSIB4[3], 'CompteAEcheanceId');
  const cptCourSIB4 = getRecord(dataSIB4[4], 'CompteAVueId');
  const cptRevSIB4 = getRecord(dataSIB4[5], 'CompteAVueId');

  cptCLISIB4 = cptCLISIB4.map((cpt: any) => {
    return {
      ...cpt,
      'CompteAVue.NombreCotisation':
        cptAVueSIB4[cpt.Id]?.NombreCotisation || 'NULL',
      'CompteAVue.PeriodiciteCalculInteret':
        cptAVueSIB4[cpt.Id]?.PeriodiciteCalculInteret || 'NULL',
      'CompteAVue.MethodeCalculInteret':
        cptAVueSIB4[cpt.Id]?.MethodeCalculInteret || 'NULL',
      'CompteAVue.NombrePrelevement':
        cptAVueSIB4[cpt.Id]?.NombrePrelevement || 'NULL',
      'CompteAVue.RIBId': cptAVueSIB4[cpt.Id]?.RIBId || 'NULL',
      'CompteAVue.TraceGelCompteId':
        cptAVueSIB4[cpt.Id]?.TraceGelCompteId || 'NULL',
      'CompteAVue.DateDernierReleveImprime':
        cptAVueSIB4[cpt.Id]?.DateDernierReleveImprime || 'NULL',

      'CompteAEcheance.CompteSupportId':
        cptAEchSIB4[cpt.Id]?.CompteSupportId || 'NULL',
      'CompteAEcheance.DatePremiereEcheance':
        cptAEchSIB4[cpt.Id]?.DatePremiereEcheance || 'NULL',
      'CompteAEcheance.TauxRupture': cptAEchSIB4[cpt.Id]?.TauxRupture || 'NULL',
      'CompteAEcheance.Periodicite': cptAEchSIB4[cpt.Id]?.Periodicite || 'NULL',
      'CompteAEcheance.Duree': cptAEchSIB4[cpt.Id]?.Duree || 'NULL',
      'CompteAEcheance.HasReconductionTacite':
        cptAEchSIB4[cpt.Id]?.HasReconductionTacite || 'NULL',
      'CompteAEcheance.DeffereAmortissementId':
        cptAEchSIB4[cpt.Id]?.DeffereAmortissementId || 'NULL',
      'CompteAEcheance.NombreEcheanceDiffere':
        cptAEchSIB4[cpt.Id]?.NombreEcheanceDiffere || 'NULL',
      'CompteAEcheance.MethodeCalculInteret':
        cptAEchSIB4[cpt.Id]?.MethodeCalculInteret || 'NULL',
      'CompteAEcheance.MontantEcheance':
        cptAEchSIB4[cpt.Id]?.MontantEcheance || 'NULL',
      'CompteAEcheance.CapitalAugmente':
        cptAEchSIB4[cpt.Id]?.CapitalAugmente || 'NULL',
      'CompteAEcheance.HasCapitalisationInteret':
        cptAEchSIB4[cpt.Id]?.HasCapitalisationInteret || 'NULL',

      'CompteCredit.IsPrecomptageInteret':
        cptCredSIB4[cpt.Id]?.IsPrecomptageInteret || 'NULL',
      'CompteCredit.TauxRemboursementAnticipe':
        cptCredSIB4[cpt.Id]?.TauxRemboursementAnticipe || 'NULL',
      'CompteCredit.MontantMinimumAnticipe':
        cptCredSIB4[cpt.Id]?.MontantMinimumAnticipe || 'NULL',
      'CompteCredit.MontantMaximumAnticipe':
        cptCredSIB4[cpt.Id]?.MontantMaximumAnticipe || 'NULL',
      'CompteCredit.TauxRetard': cptCredSIB4[cpt.Id]?.TauxRetard || 'NULL',
      'CompteCredit.DelaiPenalite':
        cptCredSIB4[cpt.Id]?.DelaiPenalite || 'NULL',
      'CompteCredit.CommissionDecouvert':
        cptCredSIB4[cpt.Id]?.CommissionDecouvert || 'NULL',
      'CompteCredit.TauxAgioCrediteur':
        cptCredSIB4[cpt.Id]?.TauxAgioCrediteur || 'NULL',
      'CompteCredit.TauxAgioDebiteur':
        cptCredSIB4[cpt.Id]?.TauxAgioDebiteur || 'NULL',
      'CompteCredit.CreditRestructure':
        cptCredSIB4[cpt.Id]?.CreditRestructure || 'NULL',
      'CompteCredit.DatePenalite': cptCredSIB4[cpt.Id]?.DatePenalite || 'NULL',
      'CompteCredit.CompteAvantRestructurationId':
        cptCredSIB4[cpt.Id]?.CompteAvantRestructurationId || 'NULL',
      'CompteCredit.TypePrelevementInteretCIF':
        cptCredSIB4[cpt.Id]?.TypePrelevementInteretCIF || 'NULL',
      'CompteCredit.IsPrelevementEcheanceAssurance':
        cptCredSIB4[cpt.Id]?.IsPrelevementEcheanceAssurance || 'NULL',
      'CompteCredit.TauxAssurance':
        cptCredSIB4[cpt.Id]?.TauxAssurance || 'NULL',
      'CompteCredit.TotalAssurancePaye':
        cptCredSIB4[cpt.Id]?.TotalAssurancePaye || 'NULL',
      'CompteCredit.HasFraisRestructuration':
        cptCredSIB4[cpt.Id]?.HasFraisRestructuration || 'NULL',
      'CompteCredit.DemandePretId':
        cptCredSIB4[cpt.Id]?.DemandePretId || 'NULL',
      'CompteCredit.FraisDossierCredit':
        cptCredSIB4[cpt.Id]?.FraisDossierCredit || 'NULL',
      'CompteCredit.FraisOuvertureCredit':
        cptCredSIB4[cpt.Id]?.FraisOuvertureCredit || 'NULL',
      'CompteCredit.IsCreditConventionne':
        cptCredSIB4[cpt.Id]?.IsCreditConventionne || 'NULL',
      'CompteCredit.NombreRemboursementAnticipe':
        cptCredSIB4[cpt.Id]?.NombreRemboursementAnticipe || 'NULL',
      'CompteCredit.IdContaminateur':
        cptCredSIB4[cpt.Id]?.IdContaminateur || 'NULL',
      'CompteCredit.ReportEcheanceId':
        cptCredSIB4[cpt.Id]?.ReportEcheanceId || 'NULL',

      'CompteCourant.MontantAutorisationDecouvert':
        cptCourSIB4[cpt.Id]?.MontantAutorisationDecouvert || 'NULL',
      'CompteCourant.MontantAgioDu':
        cptCourSIB4[cpt.Id]?.MontantAgioDu || 'NULL',
      'CompteCourant.CommissionDecouvertDu':
        cptCourSIB4[cpt.Id]?.CommissionDecouvertDu || 'NULL',
      'CompteCourant.DatelimiteDecouvert':
        cptCourSIB4[cpt.Id]?.DatelimiteDecouvert || 'NULL',
      'CompteCourant.AssuranceDecouvertDu':
        cptCourSIB4[cpt.Id]?.AssuranceDecouvertDu || 'NULL',
      'CompteCourant.IsDecouvertBloque':
        cptCourSIB4[cpt.Id]?.IsDecouvertBloque || 'NULL',

      'CompteRevolving.DureeGlobaleCredit':
        cptRevSIB4[cpt.Id]?.DureeGlobaleCredit || 'NULL',
      'CompteRevolving.DateDernierDeblocage':
        cptRevSIB4[cpt.Id]?.DateDernierDeblocage || 'NULL',
      'CompteRevolving.NombreDeblocage':
        cptRevSIB4[cpt.Id]?.NombreDeblocage || 'NULL',
      'CompteRevolving.IsAssuranceSurMontantProduit':
        cptRevSIB4[cpt.Id]?.IsAssuranceSurMontantProduit || 'NULL',
      'CompteRevolving.HasAssuranceOuvertureProduit':
        cptRevSIB4[cpt.Id]?.HasAssuranceOuvertureProduit || 'NULL',
      'CompteRevolving.HasFraisDossPayeOuvertureProduit':
        cptRevSIB4[cpt.Id]?.HasFraisDossPayeOuvertureProduit || 'NULL',
    };
  });

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

  // let wsSIB3 = XLSX.utils.json_to_sheet(cptCLISIB3);
  // let wsSIB4 = XLSX.utils.json_to_sheet(cptCLISIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Compte client');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Compte client');
  // XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Compte client');
  // XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Compte client');
  XLSX.writeFile(wb, `RevueMigration - Compte client.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['CCL_ID', 'NumeroCompte'],
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
  ['CCL_UTI_ID', 'UtilisateurId'],

  // Compte A Vue
  ['CCL_E_COT', 'CompteAVue.NombreCotisation'],
  ['CCL_E_PERINT', 'CompteAVue.PeriodiciteCalculInteret'],
  ['CCL_BL_INTLIV', 'CompteAVue.MethodeCalculInteret'],
  ['CCL_NB_PRELEV', 'CompteAVue.NombrePrelevement'],
  ['CCL_CH_RIB', 'CompteAVue.RIBId'],
  ['CCL_TRG_ID', 'CompteAVue.TraceGelCompteId'],
  ['CCL_DT_DERNIERE_IMPRESSION_RELEVE', 'CompteAVue.DateDernierReleveImprime'],

  // Compte A Echéance
  ['CCL_ID_SUP', 'CompteAEcheance.CompteSupportId'],
  ['CCL_DT_ECH', 'CompteAEcheance.DatePremiereEcheance'],
  ['CCL_N_TXRUPT', 'CompteAEcheance.TauxRupture'],
  ['CCL_E_PER', 'CompteAEcheance.Periodicite'],
  ['CCL_E_DUR', 'CompteAEcheance.Duree'],
  ['CCL_BL_RECOND', 'CompteAEcheance.HasReconductionTacite'],
  ['CCL_BL_DIFAMO', 'CompteAEcheance.DeffereAmortissementId'],
  ['CCL_I_DIFECH', 'CompteAEcheance.NombreEcheanceDiffere'],
  ['CCL_BL_METINT', 'CompteAEcheance.MethodeCalculInteret'],
  ['CCL_E_MNTECH', 'CompteAEcheance.MontantEcheance'],
  ['CCL_E_CAPAUGM', 'CompteAEcheance.CapitalAugmente'],
  ['CCL_BL_CAPT_INTERETS', 'CompteAEcheance.HasCapitalisationInteret'],

  // Compte crédit
  ['CCL_E_MNTBLO', 'CompteCredit.MontantBloque'],
  ['CCL_BL_PRECOM', 'CompteCredit.IsPrecomptageInteret'],
  ['CCL_N_TXANTI', 'CompteCredit.TauxRemboursementAnticipe'],
  ['CCL_N_ANTIMINI', 'CompteCredit.MontantMinimumAnticipe'],
  ['CCL_N_ANTIMAXI', 'CompteCredit.MontantMaximumAnticipe'],
  ['CCL_N_TXRTD', 'CompteCredit.TauxRetard'],
  ['CCL_E_DELPEN', 'CompteCredit.DelaiPenalite'],
  ['CCL_N_COMDEC', 'CompteCredit.CommissionDecouvert'],
  ['CCL_N_TXCREDAGIO', 'CompteCredit.TauxAgioCrediteur'],
  ['CCL_N_TXDEBAGIO', 'CompteCredit.TauxAgioDebiteur'],
  ['CCL_I_CRDTRESTRUC', 'CompteCredit.CreditRestructure'],
  ['CCL_DT_CALCULPEN', 'CompteCredit.DatePenalite'],
  ['CCL_ID_AV_RESTRUCT', 'CompteCredit.CompteAvantRestructurationId'],
  ['CCL_BL_PRELEV_INT', 'CompteCredit.TypePrelevementInteretCIF'],
  ['CCL_BL_ECH_ASS', 'CompteCredit.IsPrelevementEcheanceAssurance'],
  ['CCL_N_TXASS', 'CompteCredit.TauxAssurance'],
  ['CCL_E_CPTASS', 'CompteCredit.TotalAssurancePaye'],
  ['CCL_BL_FRAIS_RESTRUCT', 'CompteCredit.HasFraisRestructuration'],
  ['CCL_DP_ID', 'CompteCredit.DemandePretId'],
  ['CCL_E_FRAISDOSS', 'CompteCredit.FraisDossierCredit'],
  ['CCL_E_FRAISOUV', 'CompteCredit.FraisOuvertureCredit'],
  ['CCL_BL_CONV', 'CompteCredit.IsCreditConventionne'],
  ['CCL_I_RBTANTICIP', 'CompteCredit.NombreRemboursementAnticipe'],
  ['CCL_ID_CONTAMINATEUR', 'CompteCredit.IdContaminateur'],
  ['CCL_RPE_ID', 'CompteCredit.ReportEcheanceId'],

  // Compte courant
  ['CCL_E_AUTDEC', 'CompteCourant.MontantAutorisationDecouvert'],
  ['CCL_N_AGIO_DU', 'CompteCourant.MontantAgioDu'],
  ['CCL_N_COMDEC_DU', 'CompteCourant.CommissionDecouvertDu'],
  ['CCL_DT_LIMITDEC', 'CompteCourant.DatelimiteDecouvert'],
  ['CCL_N_ASSDEC_DU', 'CompteCourant.AssuranceDecouvertDu'],
  ['CCL_BL_BLOQDEC', 'CompteCourant.IsDecouvertBloque'],

  // Compte revolving
  ['CCL_E_DURGLOBALE', 'CompteRevolving.DureeGlobaleCredit'],
  ['CCL_DT_DERNDEBLO', 'CompteRevolving.DateDernierDeblocage'],
  ['CCL_I_NBREDEBLO', 'CompteRevolving.NombreDeblocage'],
  ['CCL_BL_ASS_MNTPRD', 'CompteRevolving.IsAssuranceSurMontantProduit'],
  ['CCL_BL_ASS_OUVPRD', 'CompteRevolving.HasAssuranceOuvertureProduit'],
  [
    'CCL_BL_FRAISDOSS_OUVPRD',
    'CompteRevolving.HasFraisDossPayeOuvertureProduit',
  ],
];
