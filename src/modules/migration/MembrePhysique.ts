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
  const infosPPSIB4 = getRecord(dataSIB4[2], 'NumeroMembre');
  const infosBICSIB4 = getRecord(dataSIB4[3], 'NumeroMembre');

  membrePSIB3 = membrePSIB3.map((physique: any) => {
    return {
      ...physique,
      MBP_DT_NAISS: (physique.MBP_DT_NAISS as string).slice(0, 10),
      'MBP_MBR_ID.Membre.MBR_NUM':
        membreSIB3[physique.MBP_MBR_ID]?.MBR_NUM || 'NULL',
    };
  });

  persPSIB4 = persPSIB4.map((phy: any) => {
    let num_membre = societaireSIB4[phy.PersonneId]?.NumeroMembre;
    return {
      ...phy,
      DateNaissance: (phy.DateNaissance as string).slice(0, 10),
      'PersonneId.Societaire.NumeroMembre':
        societaireSIB4[phy.PersonneId]?.NumeroMembre || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.CategorieSocioProfessionnelleId':
        infosPPSIB4[num_membre]?.CategorieSocioProfessionnelleId || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.NombreEnfant':
        infosPPSIB4[num_membre]?.NombreEnfant || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.DatePieceIdentite':
        infosPPSIB4[num_membre]?.DatePieceIdentite || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.NumeroMembre':
        infosPPSIB4[num_membre]?.NumeroMembre || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.ProfessionId':
        infosPPSIB4[num_membre]?.ProfessionId || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.Employeur':
        infosPPSIB4[num_membre]?.Employeur || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.DateEmbauche':
        infosPPSIB4[num_membre]?.DateEmbauche || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.TypeContratId':
        infosPPSIB4[num_membre]?.TypeContratId || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.NombrePersonneACharge':
        infosPPSIB4[num_membre]?.NombrePersonneACharge || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.LieuDelivrancePieceIdentite':
        infosPPSIB4[num_membre]?.LieuDelivrancePieceIdentite || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.AnneeExperience':
        infosPPSIB4[num_membre]?.AnneeExperience || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.RevenuMensuel':
        infosPPSIB4[num_membre]?.RevenuMensuel || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.CodeService':
        infosPPSIB4[num_membre]?.CodeService || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosPP.MatriculeSolde':
        infosPPSIB4[num_membre]?.MatriculeSolde || 'NULL',

      'PersonneId.Societaire.NumeroMembre.InfosBIC.IsConsentementBIC':
        infosBICSIB4[num_membre]?.IsConsentementBIC || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.StatutClientId':
        infosBICSIB4[num_membre]?.StatutClientId || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.TypePieceId':
        infosBICSIB4[num_membre]?.TypePieceId || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.NomMarital':
        infosBICSIB4[num_membre]?.NomMarital || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.NomPere':
        infosBICSIB4[num_membre]?.NomPere || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.PrenomPere':
        infosBICSIB4[num_membre]?.PrenomPere || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.NomNaissanceMere':
        infosBICSIB4[num_membre]?.NomNaissanceMere || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.PrenomMere':
        infosBICSIB4[num_membre]?.PrenomMere || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.PayeEmissionPieceId':
        infosBICSIB4[num_membre]?.PayeEmissionPieceId || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.DateFinValiditePiece':
        infosBICSIB4[num_membre]?.DateFinValiditePiece || 'NULL',
      'PersonneId.Societaire.NumeroMembre.InfosBIC.IdentifiantBancaireUnique':
        infosBICSIB4[num_membre]?.IdentifiantBancaireUnique || 'NULL',
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
  temp.push(`MBP_MBR_ID | PersonneId`);
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < membrePSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < persPSIB4.length; j++) {
      // clés primaires
      if (
        membrePSIB3[i]['MBP_MBR_ID.Membre.MBR_NUM'] ===
        persPSIB4[j]['PersonneId.Societaire.NumeroMembre']
      ) {
        temp = ['OK'];
        temp.push(
          `${membrePSIB3[i]['MBP_MBR_ID']} | ${persPSIB4[j]['PersonneId']}`,
        );
        found = true;
        for (let matColumns of machingColumns) {
          if (
            (membrePSIB3[i][matColumns[0]] || 'NULL') ===
            (persPSIB4[j][matColumns[1]] || 'NULL')
          ) {
            temp.push(
              `${membrePSIB3[i][matColumns[0]] || 'NULL'} = ${
                persPSIB4[j][matColumns[1]] || 'NULL'
              }`,
            );
          } else {
            temp.push(
              `${membrePSIB3[i][matColumns[0]] || 'NULL'} -> ${
                persPSIB4[j][matColumns[1]] || 'NULL'
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
      temp.push(`${membrePSIB3[i]['MBP_MBR_ID']} | `);
      for (let matColumns of machingColumns) {
        temp.push(`${membrePSIB3[i][matColumns[0]] || 'NULL'} -> `);
      }
      dataInSheet.push(temp);
    }
    if (temp[0] === 'OK') count.OK = count.OK + 1;
    else if (temp[0] === 'KO') count.KO = count.KO + 1;
    else count['--'] = count['--'] + 1;
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
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
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
  [
    'MBP_CSP_ID',
    'PersonneId.Societaire.NumeroMembre.InfosPP.CategorieSocioProfessionnelleId',
  ],
  ['MBP_E_NBENF', 'PersonneId.Societaire.NumeroMembre.InfosPP.NombreEnfant'],
  [
    'MBP_DT_IDT',
    'PersonneId.Societaire.NumeroMembre.InfosPP.DatePieceIdentite',
  ],
  ['MBP_CH_PROF', 'PersonneId.Societaire.NumeroMembre.InfosPP.ProfessionId'],
  ['MBP_CH_EMP', 'PersonneId.Societaire.NumeroMembre.InfosPP.Employeur'],
  ['MBP_DT_EMB', 'PersonneId.Societaire.NumeroMembre.InfosPP.DateEmbauche'],
  [
    'MBP_TYP_CON_ID',
    'PersonneId.Societaire.NumeroMembre.InfosPP.TypeContratId',
  ],
  [
    'MBP_I_PERSACHARGE',
    'PersonneId.Societaire.NumeroMembre.InfosPP.NombrePersonneACharge',
  ],
  [
    'MBP_CH_LIEUIDT',
    'PersonneId.Societaire.NumeroMembre.InfosPP.LieuDelivrancePieceIdentite',
  ],
  ['MBP_I_EXP', 'PersonneId.Societaire.NumeroMembre.InfosPP.AnneeExperience'],
  [
    'MBP_E_REVENUMENSUEL',
    'PersonneId.Societaire.NumeroMembre.InfosPP.RevenuMensuel',
  ],
  [
    'MBP_CH_CODESERVICE',
    'PersonneId.Societaire.NumeroMembre.InfosPP.CodeService',
  ],
  [
    'MBP_CH_MATRICULESOLDE',
    'PersonneId.Societaire.NumeroMembre.InfosPP.MatriculeSolde',
  ],

  // InfosBIC ->
  [
    'MBP_BL_CONSENTEMENT_BIC',
    'PersonneId.Societaire.NumeroMembre.InfosBIC.IsConsentementBIC',
  ],
  ['MBP_SCL_ID', 'PersonneId.Societaire.NumeroMembre.InfosBIC.StatutClientId'],
  ['MBP_TPI_ID', 'PersonneId.Societaire.NumeroMembre.InfosBIC.TypePieceId'],
  [
    'MBP_CH_NOM_MARITAL',
    'PersonneId.Societaire.NumeroMembre.InfosBIC.NomMarital',
  ],
  ['MBP_CH_NOM_PERE', 'PersonneId.Societaire.NumeroMembre.InfosBIC.NomPere'],
  [
    'MBP_CH_PRENOM_PERE',
    'PersonneId.Societaire.NumeroMembre.InfosBIC.PrenomPere',
  ],
  [
    'MBP_CH_NOM_NAISS_MERE',
    'PersonneId.Societaire.NumeroMembre.InfosBIC.NomNaissanceMere',
  ],
  [
    'MBP_CH_PRENOM_MERE',
    'PersonneId.Societaire.NumeroMembre.InfosBIC.PrenomMere',
  ],
  [
    'MBP_PAY_EMI_PIECE_ID',
    'PersonneId.Societaire.NumeroMembre.InfosBIC.PayeEmissionPieceId',
  ],
  [
    'MBP_DT_FIN_VALIDITE_PIECE',
    'PersonneId.Societaire.NumeroMembre.InfosBIC.DateFinValiditePiece',
  ],
  [
    'MBP_CH_ID_BANQUE_UNIQUE',
    'PersonneId.Societaire.NumeroMembre.InfosBIC.IdentifiantBancaireUnique',
  ],
];
