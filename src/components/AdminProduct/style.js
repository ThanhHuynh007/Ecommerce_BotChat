import { Upload, Form } from 'antd';
import styled from 'styled-components';

export const WrapperHeader = styled.h1`
  color: #000;
  font-size: 14px;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;

export const WrapperUploadFile = styled(Upload)`
  display: flex;
  align-items: center;
  gap: 20px; /* Tăng khoảng cách giữa nút và ảnh lên 20px */
  flex-wrap: nowrap;

  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  & .ant-upload-list-item-container {
    display: none;
  }

  & .ant-btn {
    height: 32px;
    padding: 4px 15px;
    margin-right: 10px;
  }

  & img {
    margin: 0 !important; /* Ghi đè margin inline nếu có */
  }
`;

export const ImageFormItem = styled.span`
  & .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
    gap: 20px; /* Đồng bộ gap với WrapperUploadFile */
    flex-wrap: nowrap;
  }

  & .ant-upload-wrapper .ant-upload {
    display: flex;
    align-items: center;
  }
`;

export const StyledForm = styled(Form)`
  &.ant-form-horizontal .ant-form-item-label {
    flex-grow: 0;
    display: flex;
    align-items: center;
  }
`;