import XLSX from 'sheetjs-style';

const getRecord = (data: any, key: string) => {
  const record: Record<string, any> = data.reduce((acc: any, obj: any) => {
    acc[obj[key]] = obj;
    return acc;
  }, {} as Record<string, any>);
  return record;
};

export const MembreMoral = (dataSIB3: any[], dataSIB4: any[]) => {
  let membreMSIB3 = dataSIB3[0];
  let persMSIB4 = dataSIB4[0];
  let wb = XLSX.utils.book_new();
  let dataInSheet: any[] = [];

  // JOIN TABLES
  const membreSIB3 = getRecord(dataSIB3[1], 'MBR_ID');
  const societaireSIB4 = getRecord(dataSIB4[1], 'PersonneId');

  membreMSIB3 = membreMSIB3.map((moral: any) => {
    return {
      ...moral,
      'MBM_MBR_ID.Membre.MBR_NUM':
        membreSIB3[moral.MBM_MBR_ID]?.MBR_NUM || 'NULL',
    };
  });

  persMSIB4 = persMSIB4.map((moral: any) => {
    return {
      ...moral,
      'PersonneId.Societaire.NumeroMembre':
        societaireSIB4[moral.PersonneId]?.NumeroMembre || 'NULL',
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
  temp.push(`MBM_MBR_ID | PersonneId`);
  for (let matColumns of machingColumns) {
    temp.push(`${matColumns[0]} = ${matColumns[1]}`);
  }
  dataInSheet.push(temp);
  temp = [];

  for (let i = 0; i < membreMSIB3.length; i++) {
    let found = false;
    for (let j = 0; j < persMSIB4.length; j++) {
      // clés primaires : MBM_CH_RS, MBM_CH_RCS, MBM_DT_CRE
      if (
        membreMSIB3[i]['MBM_MBR_ID.Membre.MBR_NUM'] ===
        persMSIB4[j]['PersonneId.Societaire.NumeroMembre']
      ) {
        temp = ['OK'];
        temp.push(
          `${membreMSIB3[i]['MBM_MBR_ID']} | ${persMSIB4[j]['PersonneId']}`,
        );
        found = true;
        for (let matColumns of machingColumns) {
          if (membreMSIB3[i][matColumns[0]] === persMSIB4[j][matColumns[1]]) {
            temp.push(
              `${membreMSIB3[i][matColumns[0]]} = ${
                persMSIB4[j][matColumns[1]]
              }`,
            );
          } else {
            temp.push(
              `${membreMSIB3[i][matColumns[0]]} -> ${
                persMSIB4[j][matColumns[1]]
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
      temp.push(`${membreMSIB3[i]['MBM_MBR_ID']} | `);
      for (let matColumns of machingColumns) {
        temp.push(`${membreMSIB3[i][matColumns[0]]} -> `);
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
    [
      membreMSIB3.length,
      persMSIB4.length,
      membreMSIB3.length - persMSIB4.length,
    ],
    ['', '', ''],
    ['OK', 'KO', '--'],
    [count.OK, count.KO, count['--']],
  ];
  let wsExh = XLSX.utils.aoa_to_sheet(dataInSheet); // array to sheet

  let wsSIB3 = XLSX.utils.json_to_sheet(membreMSIB3);
  let wsSIB4 = XLSX.utils.json_to_sheet(persMSIB4);
  XLSX.utils.book_append_sheet(wb, wsInteg, 'Intégrité - Membre Moral');
  XLSX.utils.book_append_sheet(wb, wsExh, 'Exhaustivité - Membre Moral');
  XLSX.utils.book_append_sheet(wb, wsSIB3, 'SIB3 Membre Moral');
  XLSX.utils.book_append_sheet(wb, wsSIB4, 'SIB4 Membre Moral');
  XLSX.writeFile(wb, `RevueMigration - Membre Moral.xlsx`);
};

// colonnes SIB3 -> SIB4
const machingColumns = [
  ['MBM_MBR_ID.Membre.MBR_NUM', 'PersonneId.Societaire.NumeroMembre'],
  ['MBM_CH_RS', 'RaisonSociale'],
  ['MBM_CH_RCS', 'RegistreCommerce'],
  ['MBM_DT_CRE', 'DateCreation'],
  ['MBM_STA_ID', 'StatutId'],
  ['MBM_SCT_ID', 'SecteurId'],
  ['MBM_BL_GRP', 'IsGroupement'],
  ['MBM_BL_PARTSOC', 'IsPartSociale'],
  ['MBM_E_CA', 'ChiffreAffaire'],
  ['MBM_E_CAP', 'Capital'],
  ['MBM_I_NBREMP', 'NombreEmploye'],
  ['MBM_CH_SIGLE', 'Sigle'],
];
