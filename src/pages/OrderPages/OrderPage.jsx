import { Checkbox, Form } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  CustomCheckbox,
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperStyleHeaderDilivery,
  WrapperTotal,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slices/orderSlide";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slices/userSlide";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepConponent/StepComponent";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onChange = useCallback((e) => {
    const value = e.target.value;
    setListChecked((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  const handleOnchangeCheckAll = useCallback((e) => {
    if (e.target.checked) {
      const newListChecked = order?.orderItems?.map((item) => item?.product) || [];
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  }, [order?.orderItems]);

  const handleChangeCount = useCallback(
    (type, idProduct, limited) => {
      if (type === "increase" && !limited) {
        dispatch(increaseAmount({ idProduct }));
      } else if (type === "decrease" && !limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    },
    [dispatch]
  );

  const handleDeleteOrder = useCallback(
    (idProduct) => {
      dispatch(removeOrderProduct({ idProduct }));
    },
    [dispatch]
  );

  const handleRemoveAllOrder = useCallback(() => {
    if (listChecked?.length > 0) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  }, [dispatch, listChecked]);

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked, dispatch]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      const newDetails = {
        city: user?.city || "",
        name: user?.name || "",
        address: user?.address || "",
        phone: user?.phone || "",
      };
      setStateUserDetails(newDetails);
      form.setFieldsValue(newDetails);
    }
  }, [isOpenModalUpdateInfo, user, form]);

  const handleChangeAddress = useCallback(() => {
    setIsOpenModalUpdateInfo(true);
  }, []);

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result || 0;
  }, [order?.orderItemsSlected]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + (cur.price * cur.amount * totalDiscount) / 100;
    }, 0);
    return Number(result) || 0;
  }, [order?.orderItemsSlected]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 20000 && priceMemo < 500000) {
      return 10000;
    } else if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo, order?.orderItemsSlected]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

  const handleAddCard = useCallback(() => {
    if (!order?.orderItemsSlected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  }, [order?.orderItemsSlected, user, navigate]);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    return UserService.updateUser(id, { ...rests }, token);
  });

  const { isPending, data } = mutationUpdate;

  const handleCancleUpdate = useCallback(() => {
    setStateUserDetails({
      name: "",
      phone: "",
      address: "",
      city: "",
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  }, [form]);

  const handleUpdateInforUser = useCallback(() => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  }, [stateUserDetails, user, dispatch, mutationUpdate]);

  const handleOnchangeDetails = useCallback((e) => {
    setStateUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const itemsDelivery = [
    {
      title: "20.000 VND",
      description: "Dưới 200.000 VND",
    },
    {
      title: "10.000 VND",
      description: "Từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "Free ship",
      description: "Trên 500.000 VND",
    },
  ];

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3 style={{ fontWeight: "bold", paddingTop: "15px", margin: "0" }}>
          Giỏ hàng
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          <WrapperLeft>
            <h4 style={{ margin: "3px 0 10px" }}>Phí giao hàng</h4>
            <WrapperStyleHeaderDilivery>
              <StepComponent
                items={itemsDelivery}
                current={
                  diliveryPriceMemo === 10000
                    ? 1
                    : diliveryPriceMemo === 20000
                    ? 0
                    : 2
                }
              />
            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <CustomCheckbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                />
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAllOrder}
                />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((item) => (
                <WrapperItemOrder key={item?.product}>
                  <div
                    style={{
                      width: "390px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <CustomCheckbox
                      onChange={onChange}
                      value={item?.product}
                      checked={listChecked.includes(item?.product)}
                    />
                    <img
                      src={item?.image}
                      style={{
                        width: "77px",
                        height: "79px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        width: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item?.name}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      <span style={{ fontSize: "15px", color: "#242424" }}>
                        {convertPrice(item?.price)}
                      </span>
                    </span>
                    <WrapperCountOrder>
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleChangeCount("decrease", item?.product, item?.amount === 1)
                        }
                      >
                        <MinusOutlined style={{ color: "#000", fontSize: "10px" }} />
                      </button>
                      <WrapperInputNumber
                        value={item?.amount}
                        size="small"
                        min={1}
                        max={item?.countInstock}
                      />
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleChangeCount(
                            "increase",
                            item?.product,
                            item?.amount === item?.countInstock
                          )
                        }
                      >
                        <PlusOutlined style={{ color: "#000", fontSize: "10px" }} />
                      </button>
                    </WrapperCountOrder>
                    <span
                      style={{
                        color: "rgb(255, 66, 78)",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {convertPrice(item?.price * item?.amount)}
                    </span>
                    <DeleteOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteOrder(item?.product)}
                    />
                  </div>
                </WrapperItemOrder>
              ))}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%", paddingTop: "30px" }}>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {`${user?.address} ${user?.city}`}
                  </span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "#9255FD", cursor: "pointer" }}
                  >
                    Thay đổi
                  </span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Giảm giá</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceDiscountMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(diliveryPriceMemo)}
                  </span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254, 56, 52)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(totalPriceMemo)}
                  </span>
                  <span style={{ color: "#000", fontSize: "11px" }}>
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={handleAddCard}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "360px",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
                marginLeft: "40px",
                marginTop: "-5px",
              }}
              textButton={"Mua hàng"}
            />
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancleUpdate}
        onOk={handleUpdateInforUser}
      >
        <Loading isPending={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Vui lòng nhập thành phố!" }]}
            >
              <InputComponent
                value={stateUserDetails.city}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;