import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const MembrePhysique = (dataSIB3: any[], dataSIB4: any[]) => {
  let membrePSIB3 = dataSIB3[0];
  let persPSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const membreSIB3 = getRecord(dataSIB3[1], 'MBR_ID');
  const societaireSIB4 = getRecord(dataSIB4[1], 'PersonneId');
  const infosPPSIB4 = getRecord(dataSIB4[2], 'PersonneId');
  const infosBICSIB4 = getRecord(dataSIB4[3], 'PersonneId');

  membrePSIB3 = membrePSIB3.map((physique: any) => {
    return {
      ...physique,
      MBP_DT_NAISS: (physique.MBP_DT_NAISS as string).slice(0, 10),
      'MBP_MBR_ID.Membre.MBR_NUM':
        membreSIB3[physique.MBP_MBR_ID]?.MBR_NUM || 'NULL',
    };
  });

  persPSIB4 = persPSIB4.map((phy: any) => {
    return {
      ...phy,
      DateNaissance: (phy.DateNaissance as string).slice(0, 10),
      'PersonneId.Societaire.NumeroMembre':
        societaireSIB4[phy.PersonneId]?.NumeroMembre || 'NULL',
      'PersonneId.InfosPP.CategorieSocioProfessionnelId':
        infosPPSIB4[phy.PersonneId]?.CategorieSocioProfessionnelId || 'NULL',
      'PersonneId.InfosPP.NombreEnfant':
        infosPPSIB4[phy.PersonneId]?.NombreEnfant || 'NULL',
      'PersonneId.InfosPP.DatePieceIdentite':
        infosPPSIB4[phy.PersonneId]?.DatePieceIdentite || 'NULL',
      'PersonneId.InfosPP.NumeroMembre':
        infosPPSIB4[phy.PersonneId]?.NumeroMembre || 'NULL',
      'PersonneId.InfosPP.ProfessionId':
        infosPPSIB4[phy.PersonneId]?.ProfessionId || 'NULL',
      'PersonneId.InfosPP.Employeur':
        infosPPSIB4[phy.PersonneId]?.Employeur || 'NULL',
      'PersonneId.InfosPP.DateEmbauche':
        infosPPSIB4[phy.PersonneId]?.DateEmbauche || 'NULL',
      'PersonneId.InfosPP.TypeContratId':
        infosPPSIB4[phy.PersonneId]?.TypeContratId || 'NULL',
      'PersonneId.InfosPP.NombrePersonneACharge':
        infosPPSIB4[phy.PersonneId]?.NombrePersonneACharge || 'NULL',
      'PersonneId.InfosPP.LIeuDelivrancePieceIdentite':
        infosPPSIB4[phy.PersonneId]?.LIeuDelivrancePieceIdentite || 'NULL',
      'PersonneId.InfosPP.AnneeExperience':
        infosPPSIB4[phy.PersonneId]?.AnneeExperience || 'NULL',
      'PersonneId.InfosPP.RevenuMensuel':
        infosPPSIB4[phy.PersonneId]?.RevenuMensuel || 'NULL',
      'PersonneId.InfosPP.CypePieceCodeservice':
        infosPPSIB4[phy.PersonneId]?.CypePieceCodeservice || 'NULL',
      'PersonneId.InfosPP.MatriculeSolde':
        infosPPSIB4[phy.PersonneId]?.MatriculeSolde || 'NULL',

      'PersonneId.InfosBIC.IsConsentementBIC':
        infosBICSIB4[phy.PersonneId]?.IsConsentementBIC || 'NULL',
      'PersonneId.InfosBIC.StatutClientId':
        infosBICSIB4[phy.PersonneId]?.StatutClientId || 'NULL',
      'PersonneId.InfosBIC.TypePieceId':
        infosBICSIB4[phy.PersonneId]?.TypePieceId || 'NULL',
      'PersonneId.InfosBIC.NomMarital':
        infosBICSIB4[phy.PersonneId]?.NomMarital || 'NULL',
      'PersonneId.InfosBIC.NomPere':
        infosBICSIB4[phy.PersonneId]?.NomPere || 'NULL',
      'PersonneId.InfosBIC.PrenomPere':
        infosBICSIB4[phy.PersonneId]?.PrenomPere || 'NULL',
      'PersonneId.InfosBIC.NomNaissanceMere':
        infosBICSIB4[phy.PersonneId]?.NomNaissanceMere || 'NULL',
      'PersonneId.InfosBIC.PrenomMere':
        infosBICSIB4[phy.PersonneId]?.PrenomMere || 'NULL',
      'PersonneId.InfosBIC.PayeEmissionPieceId':
        infosBICSIB4[phy.PersonneId]?.PayeEmissionPieceId || 'NULL',
      'PersonneId.InfosBIC.DateFinValiditePiece':
        infosBICSIB4[phy.PersonneId]?.DateFinValiditePiece || 'NULL',
      'PersonneId.InfosBIC.IdentifiantBancaireUnique':
        infosBICSIB4[phy.PersonneId]?.IdentifiantBancaireUnique || 'NULL',
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

  for (let i = 0; i < membrePSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < persPSIB4.length; j++) {
      // clés primaires : MBM_CH_RS, MBM_CH_RCS, MBM_DT_CRE
      if (
        membrePSIB3[i]['MBP_MBR_ID.Membre.MBR_NUM'] ===
        persPSIB4[j]['PersonneId.Societaire.NumeroMembre']
      ) {
        temp = ['OK'];
        found = true;
        for (let matColumns of machingColumns) {
          if (membrePSIB3[i][matColumns[0]] === persPSIB4[j][matColumns[1]]) {
            temp.push(
              `${membrePSIB3[i][matColumns[0]]} = ${
                persPSIB4[j][matColumns[1]]
              }`,
            );
          } else {
            temp.push(
              `${membrePSIB3[i][matColumns[0]]} -> ${
                persPSIB4[j][matColumns[1]]
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
        temp.push(`${membrePSIB3[i][matColumns[0]]} -> `);
      }
      dataInSheet.push(temp);
    }
  }

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
      membrePSIB3.length,
      persPSIB4.length,
      membrePSIB3.length - persPSIB4.length,
    ],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(membrePSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(persPSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Membre Physique');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Membre Physique');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Membre Physique');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Membre Physique');
  XLSX.writeFile(wb, `RevueMigration - Membre Physique.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['MBP_MBR_ID.Membre.MBR_NUM', 'PersonneId.Societaire.NumeroMembre'],
  ['MBP_SEX_ID', 'SexeId'],
  ['MBP_ECV_ID', 'EtatCivilId'],
  ['MBP_TIT_ID', 'TitreId'],
  ['MBP_CH_NOM', 'Nom'],
  ['MBP_CH_NOMCOMP', 'NomComplementaire'],
  ['MBP_CH_PRENOM', 'Prenom'],
  ['MBP_DT_NAISS', 'DateNaissance'],
  ['MBP_CH_NEA', 'LieuNaissance'],
  ['MBP_CH_NUMIDT', 'NumeroPieceIdentite'],
  ['MBP_TYPE_MBP_ID', 'TypeMembrePhysiqueId'],
  ['MBP_EVS_ID', 'IsVivant'],
  ['MBP_BL_PRO', 'IsProfessionnel'],

  // InfosPersonnePhysique ->
  ['MBP_CSP_ID', 'CategorieSocioProfessionnelId'],
  ['MBP_E_NBENF', 'NombreEnfant'],
  ['MBP_DT_IDT', 'DatePieceIdentite'],
  ['MBP_CH_PROF', 'ProfessionId'],
  ['MBP_CH_EMP', 'Employeur'],
  ['MBP_DT_EMB', 'DateEmbauche'],
  ['MBP_TYP_CON_ID', 'TypeContratId'],
  ['MBP_I_PERSACHARGE', 'NombrePersonneACharge'],
  ['MBP_CH_LIEUIDT', 'LIeuDelivrancePieceIdentite'],
  ['MBP_I_EXP', 'AnneeExperience'],
  ['MBP_E_REVENUMENSUEL', 'RevenuMensuel'],
  ['MBP_CH_CODESERVICE', 'CypePieceCodeservice'],
  ['MBP_CH_MATRICULESOLDE', 'MatriculeSolde'],

  // InfosBIC ->
  ['MBP_BL_CONSENTEMENT_BIC', 'IsConsentementBIC'],
  ['MBP_SCL_ID', 'StatutClientId'],
  ['MBP_TPI_ID', 'TypePieceId'],
  ['MBP_CH_NOM_MARITAL', 'NomMarital'],
  ['MBP_CH_NOM_PERE', 'NomPere'],
  ['MBP_CH_PRENOM_PERE', 'PrenomPere'],
  ['MBP_CH_NOM_NAISS_MERE', 'NomNaissanceMere'],
  ['MBP_CH_PRENOM_MERE', 'PrenomMere'],
  ['MBP_PAY_EMI_PIECE_ID', 'PayeEmissionPieceId'],
  ['MBP_DT_FIN_VALIDITE_PIECE', 'DateFinValiditePiece'],
  ['MBP_CH_ID_BANQUE_UNIQUE', 'IdentifiantBancaireUnique'],
];
