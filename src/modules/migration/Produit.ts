import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const Produit = (dataSIB3: any[], dataSIB4: any[]) => {
  let prodSIB3 = dataSIB3[0];
  let prodSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const prodAVueSIB4 = getRecord(dataSIB4[1], 'ProduitId');
  const prodAEchSIB4 = getRecord(dataSIB4[2], 'ProduitId');
  const prodCredSIB4 = getRecord(dataSIB4[3], 'ProduitAEcheanceId');
  const prodCourSIB4 = getRecord(dataSIB4[4], 'ProduitAVueId');
  const prodATermeSIB4 = getRecord(dataSIB4[5], 'ProduitAEcheanceId');
  const prodAResFondSIB4 = getRecord(dataSIB4[6], 'ProduitCreditId');

  prodSIB4 = prodSIB4.map((prod: any) => {
    return {
      ...prod,
      'ProdiutAVue.Code': prodAVueSIB4[prod.Id]?.Code || 'NULL',
      'ProdiutAVue.NbreCotisationAnnuelle':
        prodAVueSIB4[prod.Id]?.NbreCotisationAnnuelle || 'NULL',
      'ProdiutAVue.IsParSocial': prodAVueSIB4[prod.Id]?.IsParSocial || 'NULL',
      'ProdiutAVue.MethodeCalculInteret':
        prodAVueSIB4[prod.Id]?.MethodeCalculInteret || 'NULL',
      'ProdiutAVue.IsDateValeur': prodAVueSIB4[prod.Id]?.IsDateValeur || 'NULL',
      'ProdiutAVue.MontantPartSociale':
        prodAVueSIB4[prod.Id]?.MontantPartSociale || 'NULL',

      'ProdiutAEcheance.Code': prodAEchSIB4[prod.Id]?.Code || 'NULL',
      'ProdiutAEcheance.LibelleDuree':
        prodAEchSIB4[prod.Id]?.LibelleDuree || 'NULL',
      'ProdiutAEcheance.DureeMin': prodAEchSIB4[prod.Id]?.DureeMin || 'NULL',
      'ProdiutAEcheance.DureeMax': prodAEchSIB4[prod.Id]?.DureeMax || 'NULL',
      'ProdiutAEcheance.LibellePeriode':
        prodAEchSIB4[prod.Id]?.LibellePeriode || 'NULL',
      'ProdiutAEcheance.PeriodeMin':
        prodAEchSIB4[prod.Id]?.PeriodeMin || 'NULL',
      'ProdiutAEcheance.PeriodeMax':
        prodAEchSIB4[prod.Id]?.PeriodeMax || 'NULL',
      'ProdiutAEcheance.IsDiffereAmortissement':
        prodAEchSIB4[prod.Id]?.IsDiffereAmortissement || 'NULL',
      'ProdiutAEcheance.DiffereEcheance':
        prodAEchSIB4[prod.Id]?.DiffereEcheance || 'NULL',
      'ProdiutAEcheance.IsTaciteReconduction':
        prodAEchSIB4[prod.Id]?.IsTaciteReconduction || 'NULL',
      'ProdiutAEcheance.IsPrelevementMensuel':
        prodAEchSIB4[prod.Id]?.IsPrelevementMensuel || 'NULL',

      'ProduitCredit.ProduitAEcheanceId':
        prodCredSIB4[prod.Id]?.ProduitAEcheanceId || 'NULL',
      'ProduitCredit.TauxPenaliteRetard':
        prodCredSIB4[prod.Id]?.TauxPenaliteRetard || 'NULL',
      'ProduitCredit.DelaiPenalite':
        prodCredSIB4[prod.Id]?.DelaiPenalite || 'NULL',
      'ProduitCredit.NbreJourDeclassement1':
        prodCredSIB4[prod.Id]?.NbreJourDeclassement1 || 'NULL',
      'ProduitCredit.NbreJourDeclassement2':
        prodCredSIB4[prod.Id]?.NbreJourDeclassement2 || 'NULL',
      'ProduitCredit.TauxRetard': prodCredSIB4[prod.Id]?.TauxRetard || 'NULL',
      'ProduitCredit.NbreJourDeclassement3':
        prodCredSIB4[prod.Id]?.NbreJourDeclassement3 || 'NULL',
      'ProduitCredit.TauxProvision1':
        prodCredSIB4[prod.Id]?.TauxProvision1 || 'NULL',
      'ProduitCredit.TauxProvision2':
        prodCredSIB4[prod.Id]?.TauxProvision2 || 'NULL',
      'ProduitCredit.TauxProvision3':
        prodCredSIB4[prod.Id]?.TauxProvision3 || 'NULL',
      'ProduitCredit.IsMethodeInteret':
        prodCredSIB4[prod.Id]?.IsMethodeInteret || 'NULL',
      'ProduitCredit.TauxBlocageEpargne':
        prodCredSIB4[prod.Id]?.TauxBlocageEpargne || 'NULL',
      'ProduitCredit.NombreAnciennete':
        prodCredSIB4[prod.Id]?.NombreAnciennete || 'NULL',
      'ProduitCredit.TauxRemboursementAnticipe':
        prodCredSIB4[prod.Id]?.TauxRemboursementAnticipe || 'NULL',
      'ProduitCredit.RemboursementMin':
        prodCredSIB4[prod.Id]?.RemboursementMin || 'NULL',
      'ProduitCredit.RemboursementMax':
        prodCredSIB4[prod.Id]?.RemboursementMax || 'NULL',
      'ProduitCredit.IsDeclassementContencieuxAuto':
        prodCredSIB4[prod.Id]?.IsDeclassementContencieuxAuto || 'NULL',
      'ProduitCredit.DelaiDeclassementCDL':
        prodCredSIB4[prod.Id]?.DelaiDeclassementCDL || 'NULL',
      'ProduitCredit.IsDeclassementAutomatique':
        prodCredSIB4[prod.Id]?.IsDeclassementAutomatique || 'NULL',
      'ProduitCredit.DelaiDeclassementContencieux':
        prodCredSIB4[prod.Id]?.DelaiDeclassementContencieux || 'NULL',
      'ProduitCredit.IsPrelevementAssuranceParEcheance':
        prodCredSIB4[prod.Id]?.IsPrelevementAssuranceParEcheance || 'NULL',
      'ProduitCredit.IsFraisRestructuration':
        prodCredSIB4[prod.Id]?.IsFraisRestructuration || 'NULL',
      'ProduitCredit.NbreJourDeclassement4':
        prodCredSIB4[prod.Id]?.NbreJourDeclassement4 || 'NULL',
      'ProduitCredit.TauxProvision4':
        prodCredSIB4[prod.Id]?.TauxProvision4 || 'NULL',
      'ProduitCredit.NbreJourDeclassement5':
        prodCredSIB4[prod.Id]?.NbreJourDeclassement5 || 'NULL',

      'ProduitCourant.Code': prodCourSIB4[prod.Id]?.Code || 'NULL',
      'ProduitCourant.TauxAssuranceDeces':
        prodCourSIB4[prod.Id]?.TauxAssuranceDeces || 'NULL',
      'ProduitCourant.MontantAssuranceDecesMin':
        prodCourSIB4[prod.Id]?.MontantAssuranceDecesMin || 'NULL',
      'ProduitCourant.MontantAssuranceDecesMax':
        prodCourSIB4[prod.Id]?.MontantAssuranceDecesMax || 'NULL',
      'ProduitCourant.IsAutoriseDecouvert':
        prodCourSIB4[prod.Id]?.IsAutoriseDecouvert || 'NULL',
      'ProduitCourant.LibelleCommissionDecouvert':
        prodCourSIB4[prod.Id]?.LibelleCommissionDecouvert || 'NULL',
      'ProduitCourant.CommissionDecouvert':
        prodCourSIB4[prod.Id]?.CommissionDecouvert || 'NULL',
      'ProduitCourant.CommissionDecouvertMax':
        prodCourSIB4[prod.Id]?.CommissionDecouvertMax || 'NULL',
      'ProduitCourant.TauxCreditAgio':
        prodCourSIB4[prod.Id]?.TauxCreditAgio || 'NULL',
      'ProduitCourant.TauxCreditAgioMax':
        prodCourSIB4[prod.Id]?.TauxCreditAgioMax || 'NULL',
      'ProduitCourant.TauxDebitAgio':
        prodCourSIB4[prod.Id]?.TauxDebitAgio || 'NULL',
      'ProduitCourant.TauxDebitAgioMax':
        prodCourSIB4[prod.Id]?.TauxDebitAgioMax || 'NULL',
      'ProduitCourant.MontantAgioMin':
        prodCourSIB4[prod.Id]?.MontantAgioMin || 'NULL',
      'ProduitCourant.DecouvertMax':
        prodCourSIB4[prod.Id]?.DecouvertMax || 'NULL',
      'ProduitCourant.DateLimiteDecouvert':
        prodCourSIB4[prod.Id]?.DateLimiteDecouvert || 'NULL',
      'ProduitCourant.NbreJourDeclassementCCODB':
        prodCourSIB4[prod.Id]?.NbreJourDeclassementCCODB || 'NULL',
      'ProduitCourant.LibelleComptePrincipal1_2':
        prodCourSIB4[prod.Id]?.LibelleComptePrincipal1_2 || 'NULL',

      'ProduitAReserveFond.ProduitCreditId':
        prodAResFondSIB4[prod.Id]?.ProduitCreditId || 'NULL',
      'ProduitAReserveFond.LibelleDureeGlobale':
        prodAResFondSIB4[prod.Id]?.LibelleDureeGlobale || 'NULL',
      'ProduitAReserveFond.DureeGlobaleMin':
        prodAResFondSIB4[prod.Id]?.DureeGlobaleMin || 'NULL',
      'ProduitAReserveFond.DureeGlobalMax':
        prodAResFondSIB4[prod.Id]?.DureeGlobalMax || 'NULL',
      'ProduitAReserveFond.NbreEcheanceAvantProchainDeblocage':
        prodAResFondSIB4[prod.Id]?.NbreEcheanceAvantProchainDeblocage || 'NULL',
      'ProduitAReserveFond.IsAssuranceMontantProduit':
        prodAResFondSIB4[prod.Id]?.IsAssuranceMontantProduit || 'NULL',
      'ProduitAReserveFond.IsAssuranceOuvertureProduit':
        prodAResFondSIB4[prod.Id]?.IsAssuranceOuvertureProduit || 'NULL',
      'ProduitAReserveFond.IsFraisOuvertureDossier':
        prodAResFondSIB4[prod.Id]?.IsFraisOuvertureDossier || 'NULL',

      'ProduitATerme.ProduitAEcheanceId':
        prodATermeSIB4[prod.Id]?.ProduitAEcheanceId || 'NULL',
      'ProduitATerme.IsRupture': prodATermeSIB4[prod.Id]?.IsRupture || 'NULL',
      'ProduitATerme.TauxRupture':
        prodATermeSIB4[prod.Id]?.TauxRupture || 'NULL',
      'ProduitATerme.LibelleDepot':
        prodATermeSIB4[prod.Id]?.LibelleDepot || 'NULL',
      'ProduitATerme.DepotMin': prodATermeSIB4[prod.Id]?.DepotMin || 'NULL',
      'ProduitATerme.DepotMax': prodATermeSIB4[prod.Id]?.DepotMax || 'NULL',
      'ProduitATerme.IsTauxEnVigueur':
        prodATermeSIB4[prod.Id]?.IsTauxEnVigueur || 'NULL',
      'ProduitATerme.IsCapitalisationInteret':
        prodATermeSIB4[prod.Id]?.IsCapitalisationInteret || 'NULL',
      'ProduitATerme.JoursRetardMax':
        prodATermeSIB4[prod.Id]?.JoursRetardMax || 'NULL',
      'ProduitATerme.TauxAdditionnel':
        prodATermeSIB4[prod.Id]?.TauxAdditionnel || 'NULL',
      'ProduitATerme.MethodeCalculInteret':
        prodATermeSIB4[prod.Id]?.MethodeCalculInteret || 'NULL',
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
    [prodSIB3.length, prodSIB4.length, prodSIB3.length - prodSIB4.length],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
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

  // Produit A Vue
  ['PRD_CH_COD', 'ProdiutAVue.Code'],
  ['PRD_E_COT', 'ProdiutAVue.NbreCotisationAnnuelle'],
  ['PRD_BL_SOC', 'ProdiutAVue.IsParSocial'],
  ['PRD_BL_INTLIV', 'ProdiutAVue.MethodeCalculInteret'],
  ['PRD_BL_DATVAL', 'ProdiutAVue.IsDateValeur'],
  ['PRD_N_PARTSOC', 'ProdiutAVue.MontantPartSociale'],

  // Produit A Echéance
  ['PRD_CH_COD', 'ProdiutAEcheance.Code'],
  ['PRD_CH_LIBDUR', 'ProdiutAEcheance.LibelleDuree'],
  ['PRD_E_DURMINI', 'ProdiutAEcheance.DureeMin'],
  ['PRD_E_DURMAX', 'ProdiutAEcheance.DureeMax'],
  ['PRD_CH_LIBPER', 'ProdiutAEcheance.LibellePeriode'],
  ['PRD_E_PERMINI', 'ProdiutAEcheance.PeriodeMin'],
  ['PRD_E_PERMAX', 'ProdiutAEcheance.PeriodeMax'],
  ['PRD_BL_DIFAMO', 'ProdiutAEcheance.IsDiffereAmortissement'],
  ['PRD_I_DIFECH', 'ProdiutAEcheance.DiffereEcheance'],
  ['PRD_BL_RECOND', 'ProdiutAEcheance.IsTaciteReconduction'],
  ['PRD_BL_PERMENS', 'ProdiutAEcheance.IsPrelevementMensuel'],

  // Produit Courant
  ['PRD_CH_COD', 'ProduitCourant.Code'],
  ['PRD_N_TXASS', 'ProduitCourant.TauxAssuranceDeces'],
  ['PRD_I_ASSMINI', 'ProduitCourant.MontantAssuranceDecesMin'],
  ['PRD_I_ASSMAX', 'ProduitCourant.MontantAssuranceDecesMax'],
  ['PRD_BL_AUTDEC', 'ProduitCourant.IsAutoriseDecouvert'],
  ['PRD_CH_LIBCOMDEC', 'ProduitCourant.LibelleCommissionDecouvert'],
  ['PRD_N_COMDEC', 'ProduitCourant.CommissionDecouvert'],
  ['PRD_N_COMDECMAXI', 'ProduitCourant.CommissionDecouvertMax'],
  ['PRD_N_TXCREDAGIO', 'ProduitCourant.TauxCreditAgio'],
  ['PRD_N_TXCREDAGIOMAX', 'ProduitCourant.TauxCreditAgioMax'],
  ['PRD_N_TXDEBAGIO', 'ProduitCourant.TauxDebitAgio'],
  ['PRD_N_TXDEBAGIOMAX', 'ProduitCourant.TauxDebitAgioMax'],
  ['PRD_N_MNTMINIAGIOS', 'ProduitCourant.MontantAgioMin'],
  ['PRD_N_AUTDECMAXI', 'ProduitCourant.DecouvertMax'],
  ['PRD_DT_LIMITDEC', 'ProduitCourant.DateLimiteDecouvert'],
  ['PRD_E_NBREJOURS_CCODB', 'ProduitCourant.NbreJourDeclassementCCODB'],
  ['PRD_CH_CPTP1_2', 'ProduitCourant.LibelleComptePrincipal1_2'],

  // Produit Credit
  ['PRD_ID', 'ProduitCredit.ProduitAEcheanceId'],
  ['PRD_N_TXRTD', 'ProduitCredit.TauxPenaliteRetard'],
  ['PRD_E_DELPEN', 'ProduitCredit.DelaiPenalite'],
  ['PRD_E_PERDEC1', 'ProduitCredit.NbreJourDeclassement1'],
  ['PRD_E_PERDEC2', 'ProduitCredit.NbreJourDeclassement2'],
  ['PRD_E_PERDEC3', 'ProduitCredit.NbreJourDeclassement3'],
  ['PRD_E_PRVDEC1', 'ProduitCredit.TauxProvision1'],
  ['PRD_E_PRVDEC2', 'ProduitCredit.TauxProvision2'],
  ['PRD_E_PRVDEC3', 'ProduitCredit.TauxProvision3'],
  ['PRD_BL_METINT', 'ProduitCredit.IsMethodeInteret'],
  ['PRD_E_BLCEPA', 'ProduitCredit.TauxBlocageEpargne'],
  ['PRD_I_ANCCRE', 'ProduitCredit.NombreAnciennete'],
  ['PRD_N_TXANTI', 'ProduitCredit.TauxRemboursementAnticipe'],
  ['PRD_N_RBSMINI', 'ProduitCredit.RemboursementMin'],
  ['PRD_N_RBSMAXI', 'ProduitCredit.RemboursementMax'],
  ['PRD_BL_CONTAUTO', 'ProduitCredit.IsDeclassementContencieuxAuto'],
  ['PRD_E_DELDECLASCDL', 'ProduitCredit.DelaiDeclassementCDL'],
  ['PRD_BL_DECLASCONT', 'ProduitCredit.IsDeclassementAutomatique'],
  ['PRD_E_DELDECLASCONT', 'ProduitCredit.DelaiDeclassementContencieux'],
  ['PRD_BL_ECH_ASS', 'ProduitCredit.IsPrelevementAssuranceParEcheance'],
  ['PRD_BL_FRAIS_RESTRUCT', 'ProduitCredit.IsFraisRestructuration'],
  ['PRD_E_PERDEC22', 'ProduitCredit.NbreJourDeclassement4'],
  ['PRD_E_PRVDEC22', 'ProduitCredit.TauxProvision4'],
  ['PRD_E_PERDEC33', 'ProduitCredit.NbreJourDeclassement5'],

  // Produit A Reserve Fond
  ['PRD_ID', 'ProduitAReserveFond.ProduitCreditId'],
  ['PRD_CH_LIBDURGLOBALE', 'ProduitAReserveFond.LibelleDureeGlobale'],
  ['PRD_E_DURGLOBMINI', 'ProduitAReserveFond.DureeGlobaleMin'],
  ['PRD_E_DURGLOBMAX', 'ProduitAReserveFond.DureeGlobalMax'],
  [
    'PRD_E_DEBLOCAGEAPRES',
    'ProduitAReserveFond.NbreEcheanceAvantProchainDeblocage',
  ],
  ['PRD_BL_ASS_MNTPRD', 'ProduitAReserveFond.IsAssuranceMontantProduit'],
  ['PRD_BL_ASS_OUVPRD', 'ProduitAReserveFond.IsAssuranceOuvertureProduit'],
  ['PRD_BL_FRAISDOSS_OUVPRD', 'ProduitAReserveFond.IsFraisOuvertureDossier'],

  // Produit A Terme
  ['PRD_ID', 'ProduitATerme.ProduitAEcheanceId'],
  ['PRD_BL_RUPT', 'ProduitATerme.IsRupture'],
  ['PRD_N_TXRUPT', 'ProduitATerme.TauxRupture'],
  ['PRD_CH_LIBDEP', 'ProduitATerme.LibelleDepot'],
  ['PRD_E_DEPMIN', 'ProduitATerme.DepotMin'],
  ['PRD_E_DEPMAX', 'ProduitATerme.DepotMax'],
  ['PRD_BL_TX_VIGUEUR', 'ProduitATerme.IsTauxEnVigueur'],
  ['PRD_BL_CAPT_INTERETS', 'ProduitATerme.IsCapitalisationInteret'],
  ['PRD_E_NBJRRETARD', 'ProduitATerme.JoursRetardMax'],
  ['PRD_N_TXADD', 'ProduitATerme.TauxAdditionnel'],
  ['PRD_BL_INTLIV', 'ProduitATerme.MethodeCalculInteret'],
];
