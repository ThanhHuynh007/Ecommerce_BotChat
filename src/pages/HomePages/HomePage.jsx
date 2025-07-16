import React, { useEffect, useState } from 'react';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { WrapperButtonContainer, WrapperButtonShow, WrapperProducts, WrapperTypeProduct } from './style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slide1 from '../../assets/images/slide11.jpg';
import slide2 from '../../assets/images/slide22.jpg';
import slide3 from '../../assets/images/slide33.jpg';
import CartComponent from '../../components/CartComponent/CartComponent';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(6)
  const [typeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit);
    return res
  };
  
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK') {
      setTypeProducts(res?.data)
    }
  }

  const { isPending, data: products, isPreviousData, isError, error } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <Loading isPending={isPending || loading}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperTypeProduct>
          {typeProducts.map((item, index) => (
            <TypeProduct name={item} key={`${item}-${index}`} />
          ))}
        </WrapperTypeProduct>
      </div>
      <div className="body" style={{ width: '100%', backgroundColor: '#efefef' }}>
        <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
          <SliderComponent arrImages={[slide1, slide2, slide3]} />
          {isError ? (
              <div>Lỗi khi tải sản phẩm: {error.message}</div>
            ) : (
              <WrapperProducts>
                {products?.data?.map((product) => (
                  <CartComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                ))}
              </WrapperProducts>
            )}
          <WrapperButtonContainer>
            <WrapperButtonContainer>
              <WrapperButtonShow
                textButton={isPreviousData ? 'Load more' : "Xem thêm"}
                type="outline"
                disabled={products?.total === products?.data?.length}
                onClick={() => setLimit((prev) => prev + 6)}
              />
            </WrapperButtonContainer>
          </WrapperButtonContainer>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;