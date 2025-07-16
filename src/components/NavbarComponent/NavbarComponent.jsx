import { Checkbox, Col, Rate, Row } from "antd";
import React from "react";
import {
  WrapperContent,
  WrapperLableText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";

const NavBarComponent = () => {
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option, index) => (
          <WrapperTextValue key={index}>{option}</WrapperTextValue>
        ));

      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <Checkbox key={index} style={{ marginLeft: 0 }} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      case "star":
        return options.map((option, index) => (
          <div key={index} style={{ display: "flex" }}>
            <Rate style={{ fontSize: "12px" }} disabled defaultValue={option} />
            <span>{`Từ ${option} sao`}</span>
          </div>
        ));

      case "price":
        return options.map((option, index) => (
          <WrapperTextPrice key={index}>{option}</WrapperTextPrice>
        ));

      default:
        return null;
    }
  };


  return (
    <div>
      <WrapperLableText>Lable</WrapperLableText>
      <WrapperContent>
        {renderContent("text", ["Casio", "Orient", "G-SHOCK"])}
      </WrapperContent>
    </div>
  );
};

export default NavBarComponent;
