import React, { useEffect, useMemo, useRef, useState } from "react";
import { ImageFormItem, WrapperHeader, WrapperUploadFile } from "./style";
import { Button, message, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { StyledForm } from "../AdminProduct/style";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import * as UserService from "../../services/UserService";
import { getBase64 } from "../../utils";

const AdminUser = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [detailsForm] = StyledForm.useForm();
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: "",
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserService.updateUser(id, { ...rests }, access_token);
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    return UserService.deleteUser(id, token);
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { isPending: isPendingProduct, data: users } = queryUser;

  const fetchGetDetailsUser = async (id) => {
    const res = await UserService.getDetailsUser(id);
    if (res?.data) {
      setStateUserDetails(res.data);
      detailsForm.setFieldsValue(res.data);
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailsUser(rowSelected);
      setIsPendingUpdate(true);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Xóa người dùng thành công!");
      setIsModalOpenDelete(false);
      queryUser.refetch();
    } else if (isErrorDeleted) {
      message.error(`Xóa người dùng thất bại! ${dataDeleted?.message || ""}`);
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success("Xóa sản phẩm thành công!");
    } else if (isErrorDeletedMany) {
      message.error(`Xóa sản phẩm thất bại!`);
    }
  }, [isSuccessDeletedMany]);

  const handleDeleteUser = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token });
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    detailsForm.resetFields();
  };

  const handleDeleteManyUser = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file?.preview || "",
    });
  };

  const handleSearch = (confirm) => confirm();
  const handleReset = (clearFilters) => clearFilters();

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] || ""}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (visible) =>
        visible && setTimeout(() => searchInput.current?.select(), 100),
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        { text: "True", value: "TRUE" },
        { text: "False", value: "FALSE" },
      ],
      onFilter: (value, record) => record.isAdmin === value,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOutlined
            style={{ color: "orange", fontSize: "20px", cursor: "pointer" }}
            onClick={() => setIsOpenDrawer(true)}
          />
          <DeleteOutlined
            style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
            onClick={() => setIsModalOpenDelete(true)}
          />
        </div>
      ),
    },
  ];

  const dataTable = useMemo(
    () =>
      users?.data?.map((user) => ({
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "TRUE" : "FALSE",
      })) || [],
    [users]
  );

  const onUpdateUser = () => {
    if (!rowSelected || !user?.access_token) {
      message.error("Vui lòng chọn người dùng và đảm bảo đã đăng nhập!");
      return;
    }

    mutationUpdate.mutate(
      {
        id: rowSelected,
        access_token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onError: (err) => {
          message.error(
            `Cập nhật người dùng thất bại! ${
              err.message || "Lỗi không xác định"
            }`
          );
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật người dùng thành công!");
      handleCloseDrawer();
      queryUser.refetch();
    } else if (isErrorUpdated) {
      message.error(
        `Cập nhật người dùng thất bại! ${
          dataUpdated?.message || "Lỗi không xác định"
        }`
      );
    }
  }, [isSuccessUpdated, isErrorUpdated, dataUpdated]);

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUser}
          columns={columns}
          isPending={isPendingProduct}
          data={dataTable}
          onRow={(record) => ({
            onClick: () => setRowSelected(record._id),
          })}
        />
      </div>

      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={handleCloseDrawer}
        width="90%"
      >
        <Loading isPending={isPendingUpdate || isPendingUpdated}>
          <StyledForm
            form={detailsForm}
            name="details"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="off"
          >
            <StyledForm.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <InputComponent
                value={stateUserDetails.email}
                onChange={handleOnChangeDetails}
                name="email"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnChangeDetails}
                name="phone"
              />
            </StyledForm.Item>

            <StyledForm.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập số đia chi!" }]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnChangeDetails}
                name="address"
              />
            </StyledForm.Item>

            <ImageFormItem>
              <StyledForm.Item
                label="Avatar"
                name="avatar"
                rules={[
                  { required: true, message: "Vui lòng chọn hình ảnh avatar!" },
                ]}
              >
                <WrapperUploadFile
                  onChange={handleOnchangeAvatarDetails}
                  maxCount={1}
                >
                  <Button>Select file</Button>
                  {stateUserDetails?.avatar && (
                    <img
                      src={stateUserDetails?.avatar}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt="avatar"
                    />
                  )}
                </WrapperUploadFile>
              </StyledForm.Item>
            </ImageFormItem>

            <StyledForm.Item wrapperCol={{ offset: 20, span: 6 }}>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </StyledForm.Item>
          </StyledForm>
        </Loading>
      </DrawerComponent>

      <ModalComponent
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        onOk={handleDeleteUser}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn chắc chắn muốn xóa người dùng này?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
