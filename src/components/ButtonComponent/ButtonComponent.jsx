import { Button } from 'antd';
import React from 'react';

const ButtonComponent = ({ size, styleButton = {}, styleTextButton = {}, textButton = '', disabled = false, ...rests }) => {
  return (
    <Button 
      style={{
        ...styleButton,
        background: disabled ? '#ccc' : (styleButton.background || 'transparent')
      }}
      size={size} 
      {...rests}
      disabled={disabled}
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
};

export default ButtonComponent;