import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonSearch = (props) => {
  const {
    size, placeholder, textButton,
    backgroundColorInput = '#fff',
    backgroundColorButton= 'rgb(13, 92, 182)',
    colorButton = '#fff',
    onChange,
  } = props
  
  return (
    <div style={{ display: "flex" }}>
        <InputComponent
          size={size} 
          placeholder={placeholder}
          style={{ backgroundColor: backgroundColorInput, border: 'none', borderRadius: 0 }}
          onChange={onChange}
        />
        <ButtonComponent 
          size={size} 
          icon={<SearchOutlined color={colorButton} style={{color: '#fff'}} />}
          styleButton={{background: backgroundColorButton, border: 'none', borderRadius: 0 }}
          textButton={textButton} 
          styleTextButton={{ color: colorButton}}
        />
    </div>
  )
}

export default ButtonSearch