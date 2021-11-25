import styled from '@emotion/styled';
import { Button, Image, Spin } from 'antd';
import { useState } from 'react';
import stop from '../../../assets/images/stop.png';
import logo from '../../../assets/images/welcome.png';

const InfoContainer = styled.div`
  width: 300px;
  padding: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  .text-center {
    text-align: center;
  }

  .text-description {
    font-size: 16px;
    color: grey;
    margin-bottom: 20px;
  }

  .resend-link {
    font-size: 14px;

    p {
      text-decoration: underline;
      color: #1890ff;
      cursor: pointer;
    }
  }

  .top-line {
    background-color: purple;
    height: 5px;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }

  @media (min-width: 768px) {
    width: 500px;
  }
`;
export const MessageContainer = ({
  title,
  description,
  showError,
  onClick,
}: {
  title: string;
  description?: string;
  showError?: boolean;
  onClick?: () => void;
}) => {
  // const router = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  // const companyCode = router.location.query.companyCode as string;

  return (
    <InfoContainer>
      <div className='top-line'></div>
      <div>
        {!showError && <h1 className='text-center'>Félicitations</h1>}
        <Image
          alt='felicitation'
          src={showError ? stop : logo}
          width={200}
          height={100}
          style={{ objectFit: 'contain' }}
          preview={false}
        />
      </div>
      <h2 className='text-center'>{title} </h2>
      {description && (
        <div>
          <h3 className='text-center text-description'>{description}</h3>
          <h3 className='text-center resend-link'>
            Si vous n’avez pas reçu de mail d’ici 2 mins
            <span style={{ color: '#f44336' }}>(vérifiez vos spams)</span>,
            <br />
            <p
              onClick={async () => {
                setIsLoading(true);
                // await resendValidationEmail(company as CompanyEntity);
                setIsLoading(false);
              }}
            >
              cliquez ici pour envoyer un nouveau lien de verification par email
            </p>
          </h3>
          <Spin spinning={isLoading} />
        </div>
      )}
      {onClick && (
        <div>
          <Button
            type='primary'
            onClick={onClick}
            size='large'
            style={{ backgroundColor: '#7a39e0', border: 0 }}
          >
            Continuer
          </Button>
        </div>
      )}
    </InfoContainer>
  );
};
