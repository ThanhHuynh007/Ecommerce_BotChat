import { Badge, Col, Popover } from 'antd'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperLogo, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import { CaretDownOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import ButtonSearch from '../ButtonInputSearch/ButtonSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slices/userSlide'
import { useEffect, useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import logoXcenter from '../../assets/images/companyLogo.png';
import { searchProduct } from '../../redux/slices/productSlide';

const Header = ({ isHiddenSearch = false, isHiddenCart = false}) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const order = useSelector((state) => state.order);
  const [isPending, setIsPending] = useState(false)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  
  const handleLogout = async () => {
    setIsPending(true);
    try {
        await UserService.logoutUser();
        dispatch(resetUser());
    } catch (err) {
        console.error('Lỗi đăng xuất:', err.response?.data || err.message);
    } finally {
        setIsPending(false);
    }
  };

  useEffect(() => {
    setIsPending(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setIsPending(false)
  }, [user?.name, user?.avatar])

  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile-user')
    }else if(type === 'admin') {
      navigate('/system/admin')
    }else if(type === 'my-order') {
      navigate('/my-order',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{ width: '100%', background: 'rgb(26, 148, 255)', display: 'flex', justifyContent: 'center' }}> 
        <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset'}} >
            <Col span={5}>
              <WrapperTextHeader>
                <WrapperLogo alt='Logo' src={logoXcenter} onClick={() => navigate('/')}/>
              </WrapperTextHeader>
            </Col>
            {!isHiddenSearch && (
              <Col span={13}>
                <ButtonSearch
                  size="large" 
                  textButton="Search"
                  placeholder="Tim kiem"  
                  onChange={onSearch}
                  />
              </Col>
            )}
            <Col span={6} style={{display: "flex", gap: "54px", alignItems: "center"}}>
              <Loading isPending={isPending}>
                <WrapperHeaderAccount>
                  {userAvatar ? (
                  <img src={userAvatar} alt='avatar' 
                    style={{
                      height: '35px',
                      width: '35px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                  }}/>
                ) : (
                  <UserOutlined style={{ fontSize: '30px' }}/>
                )}
                {user?.access_token ? (
                  <>
                    <Popover content={content} trigger="click" open={isOpenPopup}>
                      <div style={{ cursor: 'pointer',maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                    </Popover>
                  </>
                ) : (
                  <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                    <WrapperTextHeaderSmall>Đăng nhập/ Đăng ký</WrapperTextHeaderSmall>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                      <CaretDownOutlined />
                    </div>
                  </div>
                )}
                
              </WrapperHeaderAccount>
              </Loading>
              {!isHiddenCart && (
                <div onClick={() => navigate('/order')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Badge count={order?.orderItems?.length} size='small'>
                      <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }}/>
                    </Badge>
                    <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                </div>
              )}
            </Col>
        </WrapperHeader>
    </div>
  )
}

export default Header