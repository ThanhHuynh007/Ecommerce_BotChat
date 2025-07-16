import { Input } from 'antd';
import React, { forwardRef } from 'react';

// Bọc component bằng forwardRef
const InputComponent = forwardRef(({ size, placeholder, style, ...rests }, ref) => {
  return (
    <Input
      ref={ref} // Gắn ref vào Ant Design Input
      size={size}
      placeholder={placeholder}
      style={style}
      {...rests}
    />
  );
});

export default InputComponent;
