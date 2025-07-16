import { styled } from 'styled-components';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    height: 44px;
`

export const WrapperButtonShow = styled(ButtonComponent)`
  width: 240px !important;
  height: 38px !important;
  border-radius: 4px !important;
  border: 1px solid rgb(11, 116, 229) !important;
  background-color: '#fff' !important;
  color: ${(props) => (props.disabled ? '#fff' : 'rgb(13, 116, 229)')} !important;
  font-weight: 600 !important;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')} !important;
  transition: all 0.3s ease !important;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? '#ccc' : 'rgb(13, 116, 229)'} !important;
    color: #fff !important;
  }
`;




export const WrapperButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px; /* Khoảng cách với danh sách CartComponent */
`;

export const WrapperProducts = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
`