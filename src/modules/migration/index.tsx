import styled from '@emotion/styled';
import { Button, Select, Upload } from 'antd';
import { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { BounceLoader } from 'react-spinners';
import XLSX from 'sheetjs-style';
import { Comptabilite } from './Comptabilite';
import { CompteClient } from './CompteClient';
import { DemandePret } from './DemandePret';
import { Engagement } from './Engagement';
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
      height: 300px;
      box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
      border-radius: 15px;
      margin: 10px;
      padding: 15px;
    }
  }
`;

export const MigrationRevuePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [table, setTable] = useState('');
  const [fichSIB3, setFichSIB3] = useState<any[]>([]);
  const [fichSIB4, setFichSIB4] = useState<any[]>([]);

  const isButtonDisAbled = () => {
    if (table !== '' && fichSIB3.length !== 0 && fichSIB4.length !== 0)
      return false;
    else return true;
  };

  const testIntégrite = () => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsBinaryString(fichSIB3[0].originFileObj);
    reader.onload = function (e) {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const dataSIB3 = XLSX.utils.sheet_to_json(worksheet);

      const reader2 = new FileReader();
      reader2.readAsBinaryString(fichSIB4[0].originFileObj);
      reader2.onload = function (e) {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const dataSIB4 = XLSX.utils.sheet_to_json(worksheet);

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
            // code block
            break;
          case 'Engagements':
            Engagement(dataSIB3, dataSIB4);
            break;
          default:
          // code block
        }
        setIsLoading(false);
      };
    };
  };

  return (
    <Container>
      <div className='top-header'>
        <p>Migration review</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <Select
          value={table}
          style={{ width: 300, marginBottom: 15 }}
          options={tableOptions}
          onChange={(val) => {
            setTable(val);
          }}
        />
        <BounceLoader size={30} color='blue' loading={isLoading} />
      </div>

      <div className='content'>
        <div className='box-container'>
          <div className='box'>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Fichier SIBanque 3 <br />
            </p>
            <Upload
              accept='.xls, .xlsx'
              onChange={(info) => {
                setFichSIB3(info.fileList);
              }}
            >
              <Button icon={<FaUpload style={{ marginRight: 10 }} />}>
                Sélectionnez le fichier SIB3
              </Button>
            </Upload>
          </div>
          <div className='box'>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Fichier SIBanque 4 <br />
            </p>
            <Upload
              accept='.xls, .xlsx'
              onChange={(info) => {
                setFichSIB4(info.fileList);
              }}
            >
              <Button icon={<FaUpload style={{ marginRight: 10 }} />}>
                Sélectionnez le(s) fichier(s) SIB4
              </Button>
            </Upload>
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
  { key: 'Type_Produit', value: 'Type_Produit' },
  { key: 'Engagements', value: 'Engagements' },
  { key: 'Garanties', value: 'Garanties' },
  { key: 'Cautions', value: 'Cautions' },
  { key: 'Demande_Pret', value: 'Demande_Pret' },
  { key: 'Membres', value: 'Membres' },
  { key: 'Membres_physique', value: 'Membres_physique' },
  { key: 'Membre_moral', value: 'Membre_moral' },
  { key: 'Compte_Client', value: 'Compte_Client' },
  { key: 'Produit', value: 'Produit' },
  { key: 'Ordre', value: 'Ordre' },
  { key: 'Ordre_Detail', value: 'Ordre_Detail' },
  { key: 'Avis_Et_Decision', value: 'Avis_Et_Decision' },
  { key: 'Comptabilite', value: 'Comptabilite' },
];
