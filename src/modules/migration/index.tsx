import styled from '@emotion/styled';
import { Button, Select, Upload } from 'antd';
import { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { BeatLoader, BounceLoader } from 'react-spinners';
import XLSX from 'sheetjs-style';
import { Comptabilite } from './Comptabilite';
import { CompteClient } from './CompteClient';
import { DemandePret } from './DemandePret';
import { Engagement } from './Engagement';
import { Garantie } from './Garantie';
import { Produit } from './Produit';
import { TypeProduit } from './TypeProduit';

const Container = styled.div`
  color: black;

  .top-header {
    background-color: #212121;
    height: 50px;
    width: 100%;
    padding 5px;
    color: white;

    > p {
      text-align: center;
      font-family: Arial;
      font-size: 25px;
    }
  }

  .content {
    max-width: 85%;
    margin: auto;
  }

  .box-container {
    display: flex;
    justify-content: space-between;

    .box {
      width: 50%;
      min-height: 300px;
      box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
      border-radius: 15px;
      margin: 10px;
      padding: 15px;
    }
  }
`;

export const MigrationRevuePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [table, setTable] = useState('');
  const [tablesToImportSIB3, setTablesToImportSIB3] = useState<string[]>([]);
  const [tablesToImportSIB4, setTablesToImportSIB4] = useState<string[]>([]);
  const [fileSIB3, setFileSIB3] = useState<any>();
  const [fileSIB4, setFileSIB4] = useState<any>();
  const [dataSIB3, setDataSIB3] = useState<any[]>([]);
  const [dataSIB4, setDataSIB4] = useState<any[]>([]);

  const isButtonDisAbled = () => {
    if (table !== '' && dataSIB3.length !== 0 && dataSIB4.length !== 0)
      return false;
    else return true;
  };

  const readExcelFile = (excelFile: any, DB: string) => {
    if (DB === '1') {
      setIsLoadingFile(true);
      let reader = new FileReader();
      reader.readAsBinaryString(excelFile.originFileObj);
      reader.onload = function (e) {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        setDataSIB3([...dataSIB3, XLSX.utils.sheet_to_json(worksheet)]);
        setIsLoadingFile(false);
      };
    } else {
      setIsLoadingFile(true);
      let reader = new FileReader();
      reader.readAsBinaryString(excelFile.originFileObj);
      reader.onload = function (e) {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        setDataSIB4([...dataSIB4, XLSX.utils.sheet_to_json(worksheet)]);
        setIsLoadingFile(false);
      };
    }
  };

  const testIntégrite = () => {
    setIsLoading(true);
    switch (table) {
      case 'Demande_Pret':
        DemandePret(dataSIB3, dataSIB4);
        break;
      case 'Type_Produit':
        TypeProduit(dataSIB3, dataSIB4);
        break;
      case 'Comptabilite':
        Comptabilite(dataSIB3, dataSIB4);
        break;
      case 'Produit':
        Produit(dataSIB3, dataSIB4);
        break;
      case 'Compte_Client':
        CompteClient(dataSIB3, dataSIB4);
        break;
      case 'Cautions':
        // code block
        break;
      case 'Garanties':
        Garantie(dataSIB3, dataSIB4);
        break;
      case 'Engagements':
        Engagement(dataSIB3, dataSIB4);
        break;
      default:
      // code block
    }
    setIsLoading(false);
    setDataSIB3([]);
    setDataSIB4([]);
  };

  return (
    <Container>
      <div className='top-header'>
        <p>Migration review</p>
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Select
            value={table}
            style={{ width: 300, marginBottom: 15, marginRight: 10 }}
            options={tableOptions}
            onChange={(val) => {
              setTable(val);
              setTablesToImportSIB3(
                tableOptions.find((tab) => tab.value === val)?.tablesSIB3 || [],
              );
              setTablesToImportSIB4(
                tableOptions.find((tab) => tab.value === val)?.tablesSIB4 || [],
              );
            }}
          />
          <BounceLoader size={30} color='blue' loading={isLoading} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isLoadingFile && (
            <>
              Reading...{' '}
              <BeatLoader
                style={{ marginLeft: 5 }}
                size={5}
                color='red'
                loading={isLoadingFile}
              />
            </>
          )}
        </div>
      </div>

      <div className='content'>
        <div className='box-container'>
          <div className='box'>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Fichier SIBanque 3 <br />
            </p>
            {tablesToImportSIB3.length !== 0 && (
              <div>
                <p style={{ margin: 0 }}>
                  Tables à importer (respecter l'ordre)
                </p>
                <ul>
                  {tablesToImportSIB3.map((tab) => (
                    <li key={tab}>{tab}</li>
                  ))}
                </ul>
              </div>
            )}
            <Upload
              accept='.xls, .xlsx'
              onChange={(info) => {
                setFileSIB3(info.file);
              }}
            >
              <Button icon={<FaUpload style={{ marginRight: 10 }} />}>
                Sélectionnez le fichier SIB3
              </Button>
            </Upload>
            <Button
              type='primary'
              onClick={() => {
                readExcelFile(fileSIB3, '1');
              }}
            >
              Read
            </Button>
          </div>
          <div className='box'>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Fichier SIBanque 4 <br />
            </p>
            {tablesToImportSIB4.length !== 0 && (
              <div>
                <p style={{ margin: 0 }}>
                  Tables à importer (respecter l'ordre)
                </p>
                <ul>
                  {tablesToImportSIB4.map((tab) => (
                    <li key={tab}>{tab}</li>
                  ))}
                </ul>
              </div>
            )}
            <Upload
              accept='.xls, .xlsx'
              onChange={(info) => {
                setFileSIB4(info.file);
              }}
            >
              <Button icon={<FaUpload style={{ marginRight: 10 }} />}>
                Sélectionnez le(s) fichier(s) SIB4
              </Button>
            </Upload>
            <Button
              type='primary'
              onClick={() => {
                readExcelFile(fileSIB4, '2');
              }}
            >
              Read
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h3>Test d'Ingérité et/ou d'Exhaustivité</h3>
          <Button
            type='primary'
            onClick={testIntégrite}
            disabled={isButtonDisAbled()}
            icon={<FaUpload style={{ marginRight: 10 }} />}
            loading={isLoading}
          >
            Exécuter et télécharger le résultat
          </Button>
        </div>
      </div>
    </Container>
  );
};

const tableOptions = [
  {
    key: 'Type_Produit',
    value: 'Type_Produit',
    tablesSIB3: ['TypeProduit'],
    tablesSIB4: ['TypeProduit'],
  },
  {
    key: 'Engagements',
    value: 'Engagements',
    tablesSIB3: ['Engagements', 'DemandePret'],
    tablesSIB4: ['Engagements', 'DemandePret'],
  },
  {
    key: 'Garanties',
    value: 'Garanties',
    tablesSIB3: ['Garanties', 'DemandePret', 'Membres'],
    tablesSIB4: ['Garanties', 'DemandePret', 'Societaire', 'CompteClient'],
  },
  {
    key: 'Demande_Pret',
    value: 'Demande_Pret',
    tablesSIB3: ['DemandePret'],
    tablesSIB4: ['DemandePret'],
  },
  {
    key: 'Membres',
    value: 'Membres',
    tablesSIB3: ['Membres'],
    tablesSIB4: ['Membres'],
  },
  {
    key: 'Membres_physique',
    value: 'Membres_physique',
    tablesSIB3: ['Membres_physique'],
    tablesSIB4: ['Membres_physique'],
  },
  {
    key: 'Membre_moral',
    value: 'Membre_moral',
    tablesSIB3: ['Membre_moral'],
    tablesSIB4: ['Membre_moral'],
  },
  {
    key: 'Compte_Client',
    value: 'Compte_Client',
    tablesSIB3: ['CompteClient'],
    tablesSIB4: [
      'CompteClient',
      'Compte A Vue',
      'Compte A Echéance',
      'Compte Courant',
      'Compte crédit',
      'CreditRevolving',
    ],
  },
  {
    key: 'Produit',
    value: 'Produit',
    tablesSIB3: ['Produit'],
    tablesSIB4: ['Produit'],
  },
  {
    key: 'Ordre',
    value: 'Ordre',
    tablesSIB3: ['Ordre'],
    tablesSIB4: ['Ordre'],
  },
  {
    key: 'Ordre_Detail',
    value: 'Ordre_Detail',
    tablesSIB3: ['OrdreDetail'],
    tablesSIB4: ['OrdreDetail'],
  },
  {
    key: 'Avis_Et_Decision',
    value: 'Avis_Et_Decision',
    tablesSIB3: ['AvisEtDecision', 'DemandePret', 'Membres'],
    tablesSIB4: ['AvisEtDecision', 'DemandePret', 'Societaire'],
  },
  {
    key: 'Comptabilite',
    value: 'Comptabilite',
    tablesSIB3: ['Comptabilite'],
    tablesSIB4: ['Comptabilite'],
  },
  {
    key: 'Cautions',
    value: 'Cautions',
    tablesSIB3: ['Cautions'],
    tablesSIB4: ['Cautions'],
  },
];
