import React, { useEffect, useState, useMemo, useRef } from "react";
import { WrapperHeader, WrapperUploadFile, ImageFormItem } from "./style";
import { Button, message, Select, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../utils";
import { StyledForm } from "./style";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
// THAY ĐỔI: Thêm lodash.debounce để giới hạn gọi API
import debounce from "lodash.debounce";
import { useMutationHooks } from "./../../hooks/useMutationHook";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [createForm] = StyledForm.useForm();
  const [detailsForm] = StyledForm.useForm();
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
    newType: "",
    discount: "",
  });
  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
    discount: "",
  });
  const [fileList, setFileList] = useState([]);
  const [detailsFileList, setDetailsFileList] = useState([]);

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      description,
      rating,
      image,
      type,
      countInStock,
      discount,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      rating,
      image,
      type,
      countInStock,
      discount,
    });
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const { isPending, isSuccess, isError, data, error } = mutation;
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

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  // THAY ĐỔI: Cập nhật getAllProducts để hỗ trợ phân trang
  const getAllProducts = async ({ page, pageSize }) => {
    const res = await ProductService.getAllProduct({ page, pageSize });
    return res;
  };
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });

  const { isPending: isPendingProduct, data: products } = queryProduct;

  // THAY ĐỔI: Thêm debounce cho fetchGetDetailsProduct
  const fetchGetDetailsProduct = debounce(async (id) => {
    const res = await ProductService.getDetailsProduct(id);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description || "",
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
      setDetailsFileList(
        res?.data?.image ? [{ url: res?.data?.image, status: "done" }] : []
      );
      detailsForm.setFieldsValue({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description || "",
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
    }
    setIsPendingUpdate(false);
  }, 500);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailsProduct(rowSelected);
      setIsPendingUpdate(true);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Tạo sản phẩm thành công!");
      handleCancel();
    } else if (isError) {
      message.error(`Tạo sản phẩm thất bại! ${error?.message || ""}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Xóa sản phẩm thành công!");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error(`Xóa sản phẩm thất bại! ${error?.message || ""}`);
    }
  }, [isSuccessDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success("Xóa sản phẩm thành công!");
    } else if (isErrorDeletedMany) {
      message.error(`Xóa sản phẩm thất bại! ${error?.message || ""}`);
    }
  }, [isSuccessDeletedMany]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật sản phẩm thành công!");
      handleCloseDrawer();
      // setRowSelected('');
    } else if (isErrorUpdated) {
      message.error(`Cập nhật sản phẩm thất bại! ${error?.message || ""}`);
    }
  }, [isSuccessUpdated]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      discount: "",
    });
    setFileList([]);
    createForm.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteManyProduct = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      discount: "",
    });
    setDetailsFileList([]);
    detailsForm.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const file = newFileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file?.preview || "",
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList: newFileList }) => {
    setDetailsFileList(newFileList);
    const file = newFileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file?.preview || "",
    });
  };

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const renderAction = () => {
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <EditOutlined
          style={{ color: "orange", fontSize: "25px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
        <DeleteOutlined
          style={{ color: "red", fontSize: "25px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };

  const handleSearch = (confirm) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

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
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()) || false,
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
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
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 500",
          value: ">=",
        },
        {
          text: "<= 500",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 500;
        }
        return record.price <= 500;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 4",
          value: ">=",
        },
        {
          text: "<= 4",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.rating >= 4;
        }
        return record.rating <= 4;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  // THAY ĐỔI: Sử dụng useMemo để tối ưu dataTable
  const dataTable = useMemo(() => {
    return Array.isArray(products?.data)
      ? products.data.map((product) => ({
          ...product,
          key: product._id,
        }))
      : [];
  }, [products]);

  const onUpdateProduct = () => {
    if (!rowSelected || !user?.access_token) {
      message.error("Vui lòng chọn sản phẩm và đảm bảo đã đăng nhập!");
      return;
    }
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
        onError: (err) => {
          message.error(
            `Cập nhật sản phẩm thất bại! ${err.message || "Lỗi không xác định"}`
          );
        },
      }
    );
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProduct}
          columns={columns}
          isPending={isPendingProduct}
          data={dataTable}
          onRow={(record) => ({
            onClick: () => setRowSelected(record._id),
          })}
        />
      </div>
      <ModalComponent
        forceRender
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isPending={isPending}>
          <StyledForm
            form={createForm}
            name="create"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <StyledForm.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Type"
              name="type"
              rules={[
                { required: true, message: "Vui lòng nhập loại sản phẩm!" },
              ]}
            >
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </StyledForm.Item>
            {stateProduct.type === "add_type" && (
              <StyledForm.Item
                label="New type"
                name="newType"
                rules={[
                  { required: true, message: "Vui lòng nhập loại sản phẩm!" },
                ]}
              >
                <InputComponent
                  value={stateProduct.newType}
                  onChange={handleOnChange}
                  name="newType"
                />
              </StyledForm.Item>
            )}
            <StyledForm.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng tồn kho!" },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnChange}
                name="countInStock"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnChange}
                name="price"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Vui lòng nhập đánh giá sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnChange}
                name="rating"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập discount của sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnChange}
                name="discount"
              />
            </StyledForm.Item>
            <ImageFormItem>
              <StyledForm.Item
                label="Image"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình ảnh sản phẩm!",
                  },
                ]}
                getValueFromEvent={() => stateProduct?.image}
              >
                <WrapperUploadFile
                  id="avatar"
                  onChange={handleOnchangeAvatar}
                  fileList={fileList}
                  maxCount={1}
                >
                  <Button>Select file</Button>
                  {stateProduct?.image && (
                    <img
                      src={stateProduct?.image}
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
                Submit
              </Button>
            </StyledForm.Item>
          </StyledForm>
        </Loading>
      </ModalComponent>

      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isPending={isPendingUpdate || isPendingUpdated}>
          <StyledForm
            form={detailsForm}
            name="details"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="off"
          >
            <StyledForm.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Type"
              name="type"
              rules={[
                { required: true, message: "Vui lòng nhập loại sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.type}
                onChange={handleOnChangeDetails}
                name="type"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng tồn kho!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnChangeDetails}
                name="countInStock"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnChangeDetails}
                name="price"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
                name="description"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Vui lòng nhập đánh giá sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnChangeDetails}
                name="rating"
              />
            </StyledForm.Item>
            <StyledForm.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập discount của sản phẩm!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnChangeDetails}
                name="discount"
              />
            </StyledForm.Item>
            <ImageFormItem>
              <StyledForm.Item
                label="Image"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình ảnh sản phẩm!",
                  },
                ]}
                getValueFromEvent={() => stateProductDetails.image}
              >
                <WrapperUploadFile
                  id="details-avatar"
                  onChange={handleOnchangeAvatarDetails}
                  fileList={detailsFileList}
                  maxCount={1}
                >
                  <Button>Select file</Button>
                  {stateProductDetails?.image && (
                    <img
                      src={stateProductDetails?.image}
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
                Apply
              </Button>
            </StyledForm.Item>
          </StyledForm>
        </Loading>
      </DrawerComponent>

      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn chắc chắc muốn xóa sản phẩm này?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
