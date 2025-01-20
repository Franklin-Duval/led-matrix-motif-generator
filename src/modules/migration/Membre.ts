import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const Membre = (dataSIB3: any[], dataSIB4: any[]) => {
  let membreSIB3 = dataSIB3[0];
  let persMSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const societaireSIB4 = getRecord(dataSIB4[1], 'PersonneId');
  const adresseSIB4 = getRecord(dataSIB4[2], 'Id');

  persMSIB4 = persMSIB4.map((pers: any) => {
    return {
      ...pers,
      'Societaire.NumeroMembre':
        societaireSIB4[pers.Id]?.NumeroMembre || 'NULL',
      'Societaire.Code': societaireSIB4[pers.Id]?.Code || 'NULL',
      'Societaire.DateAdhesion': societaireSIB4[pers.Id]?.DateAdhesion || 'NULL',
      'Societaire.DateDemission': societaireSIB4[pers.Id]?.DateDemission || 'NULL',
      'Societaire.Message': societaireSIB4[pers.Id]?.Message || 'NULL',
      'Societaire.IsSensible': societaireSIB4[pers.Id]?.IsSensible || 'NULL',
      'Societaire.IsExported': societaireSIB4[pers.Id]?.IsExported || 'NULL',

      'AdresseId.Adresse.Telephone':
        adresseSIB4[pers.AdresseId]?.Telephone || 'NULL',
      'AdresseId.Adresse.QuartierId':
        adresseSIB4[pers.AdresseId]?.QuartierId || 'NULL',
      'AdresseId.Adresse.Mobile': adresseSIB4[pers.AdresseId]?.Mobile || 'NULL',
      'AdresseId.Adresse.Email': adresseSIB4[pers.AdresseId]?.Email || 'NULL',
      'AdresseId.Adresse.NomRue': adresseSIB4[pers.AdresseId]?.NomRue || 'NULL',
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
  temp.push(`MBR_ID | Id`);
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < membreSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < persMSIB4.length; j++) {
      // clés primaires : MBR_NUM
      if (
        membreSIB3[i]['MBR_NUM'] === persMSIB4[j]['Societaire.NumeroMembre']
      ) {
        temp = ['OK'];
        temp.push(`${membreSIB3[i]['MBR_ID']} | ${persMSIB4[j]['Id']}`);
        found = true;
        for (let matColumns of machingColumns) {
          if (membreSIB3[i][matColumns[0]] === persMSIB4[j][matColumns[1]]) {
            temp.push(
              `${membreSIB3[i][matColumns[0]] || 'NULL'} = ${
                persMSIB4[j][matColumns[1]] || 'NULL'
              }`,
            );
          } else {
            temp.push(
              `${membreSIB3[i][matColumns[0]] || 'NULL'} -> ${
                persMSIB4[j][matColumns[1]] || 'NULL'
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
      temp.push(`${membreSIB3[i]['MBR_ID']} | `);
      for (let matColumns of machingColumns) {
        temp.push(`${membreSIB3[i][matColumns[0]]} -> `);
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
    [membreSIB3.length, persMSIB4.length, membreSIB3.length - persMSIB4.length],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(membreSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(persMSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Membre');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Membre');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Membre');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Membre');
  XLSX.writeFile(wb, `RevueMigration - Membres.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['MBR_NUM', 'Societaire.NumeroMembre'],
  ['MBR_SJC_ID', 'SituationJudiciaireId'],
  ['MBR_DT_DEBUT_INTERDICTION', 'DateDebutInterdictionJudiciaire'],
  ['MBR_DT_FIN_INTERDICTION', 'DateFinInterdictionJudiciaire'],
  ['MBR_BL_PHY', 'IsPhysique'],

  // Sociétaire ->
  ['MBR_CSS_ID', 'Societaire.Code'],
  ['MBR_DT_ADH', 'Societaire.DateAdhesion'],
  ['MBR_DT_DEM', 'Societaire.DateDemission'],
  ['MBR_CH_MESSAGE', 'Societaire.Message'],
  ['MBR_BL_SENSIBLE', 'Societaire.IsSensible'],
  ['MBR_BL_EXPORTED_DIGIBANK', 'Societaire.IsExported'],

  // Adresse
  ['MBR_CH_TEL', 'AdresseId.Adresse.Telephone'],
  ['MBR_QUA_ID', 'AdresseId.Adresse.QuartierId'],
  ['MBR_CH_TEL_MOBFAX', 'AdresseId.Adresse.Mobile'],
  ['MBR_CH_EMAIL', 'AdresseId.Adresse.Email'],
  ['MBR_CH_RUEVILLABP', 'AdresseId.Adresse.NomRue'],
];
