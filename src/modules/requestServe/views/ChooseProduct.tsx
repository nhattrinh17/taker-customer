/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Platform, Animated } from 'react-native';
import CommonText from 'components/CommonText';
import { Colors } from 'assets/Colors';
import { Icons } from 'assets/icons';
import { Fonts } from 'assets/Fonts';
import ControlNumber from './components/ControlNumber';
import { formatCurrency, totalPricePayment } from '../utils';
import Header from 'components/Header';
import { navigate } from 'navigation/utils/navigationUtils';
import { useGetListService } from 'services/src/serveRequest/serveService';
import { appStore } from 'state/app';
import { ItemService } from 'services/src/typings';
import { isNil } from 'lodash';
import FastImage from 'react-native-fast-image';
import { s3Url } from 'services/src/APIConfig';
import { userStore } from 'state/user';
const TAKE = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rowItemProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gallery,
  },
  leftItemProduct: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapperNameProduct: {
    marginLeft: 8,
  },
  nameProduct: {
    fontSize: Fonts.fontSize[14],
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    color: Colors.black,
    marginBottom: 4,
  },
  containerList: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contentContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  wrapperBottom: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: Colors.white,
  },
  btOrder: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.main,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 20,
  },
  rowLeftBtOrder: {
    alignItems: 'center',
    marginRight: 10,
  },
  totalPrice: {
    color: Colors.white,
    fontWeight: '700',
  },
  countProduct: {
    color: Colors.white,
  },
  whiteDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.white,
    borderRadius: 3,
    marginHorizontal: 10,
  },
  wrapperPrice: {
    flexDirection: 'row',
  },
  price: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  sale: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textPrimary,
    fontWeight: '500',
    marginRight: 6,
  },
  wrapperDiscount: {
    backgroundColor: Colors.red,
    padding: 4,
    borderRadius: 4,
    marginTop: 4,
    width: 80,
  },
  discount: {
    fontSize: Fonts.fontSize[10],
    color: Colors.white,
  },
  rowCount: {
    flexDirection: 'row',
    alignItems: 'center',
    color: Colors.white,
  },
  count: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    marginRight: 4,
    color: Colors.white,
  },
  serve: {
    color: Colors.white,
  },
  ml2: {
    marginLeft: 2,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fastImage: {
    width: 56,
    height: 56,
  },
});

const ChooseProduct = () => {
  const { loading, setLoading } = appStore(state => state);
  const customer = userStore(state => state.user);
  const [products, setProducts] = useState<{
    data: ItemService[];
    isLoading: boolean;
    enableLoadMore: boolean;
  }>({
    data: [],
    isLoading: false,
    enableLoadMore: true,
  });

  const [services, setServices] = useState<serve.Services[]>([]);

  const shakeAnimationValue = useRef(new Animated.Value(0)).current;
  const { triggerListService } = useGetListService();

  const getListServices = async (params: { take: number; skip: number }) => {
    if (!products?.enableLoadMore || products?.isLoading || loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await triggerListService(params);
      if (response?.data?.length) {
        const moreProducts = customer.newUser ? response?.data : response?.data.filter(item => !item.experienceOnce);
        setProducts({
          data: [...products.data, ...moreProducts],
          isLoading: false,
          enableLoadMore: response?.data?.length < TAKE ? false : true,
        });
      } else {
        setProducts({
          data: [...products.data],
          isLoading: false,
          enableLoadMore: false,
        });
      }
    } catch (err) {
      console.log('Err ==>', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListServices({ take: TAKE, skip: 0 });
  }, []);

  const animateShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimationValue, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimationValue, {
        toValue: -1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimationValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressPlus = (item: ItemService) => () => {
    const itemService = services.find(service => service?.serviceId === item?.id);
    if (itemService) {
      if (!item.experienceOnce || itemService.quantity == 0) {
        itemService.quantity += 1;
        setServices([...services]);
        animateShake();
      }
    } else {
      const newItem: serve.Services = {
        name: item.name,
        serviceId: item.id,
        quantity: 1,
        price: item.price,
        discountPrice: item.discountPrice,
      };
      setServices([...services, newItem]);
      animateShake();
    }
  };

  const onPressMinus = (item: ItemService) => () => {
    const itemService = services.find(service => service?.serviceId === item?.id);
    if (itemService) {
      itemService.quantity -= 1;
      setServices([...services]);
      animateShake();
    }
  };

  const totalCountProduct = () => {
    return services.filter(item => item?.quantity > 0).reduce((total, item) => total + item?.quantity, 0);
  };

  const count = totalCountProduct();

  const onPressOrder = () => {
    if (!count) {
      return;
    }
    const newServices = services.filter(item => item?.quantity > 0);
    navigate('OrderInformation', { services: newServices });
  };

  const onEndReached = () => getListServices({ take: TAKE, skip: products.data?.length });

  const renderKeyExtractor = (item: ItemService) => `${item?.id}`;

  const renderItemProduct = ({ item }: { item: ItemService }) => {
    const itemService = services.find(e => e?.serviceId === item?.id);
    return (
      <View style={styles.rowItemProduct}>
        <View style={styles.leftItemProduct}>
          <FastImage
            style={styles.fastImage}
            source={{
              uri: `${s3Url}${item?.icon}`,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.wrapperNameProduct}>
            <CommonText text={item?.name} styles={styles.nameProduct} />
            <View style={styles.wrapperPrice}>
              <CommonText
                text={`${formatCurrency(item?.price)}đ`}
                styles={{
                  ...styles.price,
                  textDecorationLine: item?.discountPrice ? 'line-through' : 'none',
                }}
              />
              {!isNil(item?.discountPrice) && <CommonText text={`${formatCurrency(item?.discountPrice ?? 0)}đ`} styles={styles.sale} />}
            </View>
            {!isNil(item?.discountPrice) && (
              <View style={styles.wrapperDiscount}>
                <CommonText text={`Tiết kiệm ${item?.discount}%`} styles={styles.discount} />
              </View>
            )}
          </View>
        </View>
        {itemService && itemService?.quantity > 0 ? (
          <ControlNumber count={itemService?.quantity} onPressMinus={onPressMinus(item)} onPressPlus={onPressPlus(item)} />
        ) : (
          <TouchableOpacity onPress={onPressPlus(item)}>
            <Icons.AddToCart />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderTotalProduct = () => {
    return (
      <View style={styles.wrapperBottom}>
        <TouchableOpacity style={styles.btOrder} onPress={onPressOrder} disabled={count === 0}>
          <View style={styles.rowCenter}>
            <Animated.View
              style={{
                ...styles.rowLeftBtOrder,
                transform: [
                  {
                    rotate: shakeAnimationValue.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-20deg', '20deg'],
                    }),
                  },
                ],
              }}>
              {count !== 0 ? (
                <View>
                  <Icons.Cart />
                </View>
              ) : (
                <Icons.EmptyCart />
              )}
            </Animated.View>

            <View style={styles.ml2}>
              <CommonText text="Giỏ hàng" styles={styles.totalPrice} />
              {count !== 0 && (
                <View style={styles.rowCount}>
                  <CommonText text={`${count}`} styles={styles.count} />
                  <CommonText text="dịch vụ" styles={styles.serve} />
                </View>
              )}
            </View>
          </View>

          <CommonText text={`${formatCurrency(totalPricePayment(services))}đ`} styles={styles.totalPrice} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Chọn dịch vụ" />
      <FlatList data={products.data} renderItem={renderItemProduct} keyExtractor={renderKeyExtractor} contentContainerStyle={styles.contentContainer} onEndReachedThreshold={0.1} onEndReached={onEndReached} />
      <View>{renderTotalProduct()}</View>
    </View>
  );
};

export default ChooseProduct;
