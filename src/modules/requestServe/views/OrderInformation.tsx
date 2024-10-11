import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, NativeEventEmitter } from 'react-native';
import CommonText from 'components/CommonText';
import { Colors } from 'assets/Colors';
import { Fonts } from 'assets/Fonts';
import Header from 'components/Header';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/typings';
import { formatCurrency, totalPrice, totalSalePrice } from '../utils';
import { Icons } from 'assets/icons';
import { payments, showMessageError } from 'utils/index';
import { navigate } from 'navigation/utils/navigationUtils';
import CommonButton from 'components/Button';
import { useCancelTrip, useCreateSearchHistory, useCreateTrip, useGetPaymentStatus } from 'services/src/serveRequest/serveService';
import { appStore } from 'state/app';
import { ParamsCreateTrip, ResponseCreateTrip } from 'services/src/typings';
import { userStore } from 'state/user';
import { serveRequestStore } from 'state/serveRequest/serveRequestStore';
import { omit } from 'lodash';
import { SocketEvents, SocketService } from 'socketIO';
import { EventBus, EventBusType } from 'observer';
import { useGetBalance } from 'services/src/profile';
import dayjs from 'dayjs';

import VnpayMerchant, { VnpayMerchantModule } from 'src/lib/react-native-vnpay-merchant';
import ModalSuccess from 'components/ModalSuccess';
import PopupFailedPayment from 'components/PopupFailedPayment';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { reasonsCancel } from '../constants';

const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

let NUMBER_RETRY = 10;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
  },
  pdHz20: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  wrapperTopContent: {
    marginTop: 38,
    paddingHorizontal: 20,
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desc: {
    color: Colors.textSecondary,
    marginBottom: 4,
    flex: 1,
  },
  value: {
    color: Colors.black,
    flex: 1,
  },
  viewItemCenter: {
    flex: 0.5,
    textAlign: 'center',
  },
  viewItemRight: {
    flex: 0.5,
    textAlign: 'right',
  },
  mb4: {
    marginBottom: 4,
  },
  rowItemPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textHolder: {
    color: Colors.textSecondary,
  },
  salePrice: {
    color: Colors.flamingo,
  },
  payPrice: {
    color: Colors.main,
  },
  mgV4: {
    marginVertical: 4,
  },
  line: {
    marginVertical: 16,
    backgroundColor: Colors.gallery,
    height: 0.5,
    width: Dimensions.get('screen').width - 40,
    borderRadius: 0.5,
  },
  bigLine: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.gallery,
    marginTop: 12,
    marginBottom: 16,
  },
  textImage: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    marginBottom: 8,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 12,
    marginRight: 16,
  },
  wrapperViewImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btCamera: {
    width: 96,
    height: 96,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderStyle: 'dotted',
  },
  wrapperCamera: {
    flex: 1,
    position: 'relative',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  camera: {
    flex: 1,
  },
  payment: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    marginBottom: 16,
  },
  containerImages: {
    paddingHorizontal: 16,
  },
  rowItemPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  textPayment: {
    color: Colors.black,
    marginLeft: 12,
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
  rowTotalPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 14,
  },
  textPrice: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    color: Colors.black,
  },
  deposit: {
    color: Colors.main,
    fontSize: Fonts.fontSize[12],
    marginTop: -20,
    marginLeft: 32,
    marginBottom: 28,
  },
  wrapperItemTaker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  rowItemTaker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textMain: {
    color: Colors.main,
  },
  time: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    marginBottom: 12,
  },
  rowTime: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  title: {
    marginLeft: 4,
    marginTop: -4,
  },
  note: {
    marginLeft: 12,
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[12],
  },
});

interface Props {
  route: RouteProp<RootNavigatorParamList, 'OrderInformation'>;
}

const InformationOrder = ({ route }: Props) => {
  const { services } = route?.params;
  const { triggerGetBalance, balance } = useGetBalance();
  const { triggerGetPaymentStatus } = useGetPaymentStatus();
  const { triggerCancelTrip } = useCancelTrip();
  const { triggerCreateTrip } = useCreateTrip();
  const isFocused = useIsFocused();
  const socketService = SocketService.getInstance();
  const { triggerCreateHistory } = useCreateSearchHistory();
  const { user: customer, setUser } = userStore(state => state);
  const { setLoading } = appStore(state => state);
  const actionSheetFailedPaymentRef = useRef<ActionSheetRef>(null);

  const { latitude, longitude, updateTripID, note, address, name, schedule } = serveRequestStore(state => state);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [typePayment, setTypePayment] = useState<number>(3);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const isScheduleTime = schedule;
  const [loadingButton, setLoadingButton] = useState(false);

  const [checkPaymentAppCallApp, setCheckPaymentAppCallApp] = useState<{
    isCallApp: boolean;
    tripId: string;
    paymentUrl: string;
    response: ResponseCreateTrip | null;
  }>({
    isCallApp: false,
    tripId: '',
    paymentUrl: '',
    response: null,
  });

  const total = totalPrice(services);
  const sales = totalSalePrice(services);
  const pay = total - sales;

  const rotation = useRef(new Animated.Value(0)).current;

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderInformation = () => {
    return (
      <View style={styles.wrapperTopContent}>
        <View style={styles.rowTitle}>
          <CommonText text="Loại" styles={styles.desc} />
          <CommonText text="Số lượng" styles={{ ...styles.desc, ...styles.viewItemCenter }} />
          <CommonText text="Đơn giá" styles={{ ...styles.desc, ...styles.viewItemRight }} />
        </View>
        {services?.map((item, index) => (
          <View style={{ ...styles.rowTitle, ...styles.mb4 }} key={index}>
            <CommonText text={item?.name ?? ''} styles={styles.value} />
            <CommonText text={`${item?.quantity}`} styles={{ ...styles.value, ...styles.viewItemCenter }} />
            <CommonText text={`${formatCurrency(item?.price)}đ`} styles={{ ...styles.value, ...styles.viewItemRight }} />
          </View>
        ))}
      </View>
    );
  };

  const renderPrice = () => {
    return (
      <View style={styles.pdHz20}>
        <View style={styles.rowItemPrice}>
          <CommonText text="Tổng tiền" styles={styles.textHolder} />
          <CommonText text={`${formatCurrency(total)}đ`} />
        </View>

        <View style={styles.rowItemPrice}>
          <CommonText text="Giảm giá" styles={{ ...styles.textHolder, ...styles.mgV4 }} />
          <CommonText text={`-${formatCurrency(sales)}đ`} styles={styles.salePrice} />
        </View>

        <View style={styles.rowItemPrice}>
          <CommonText text="Tổng thanh toán" styles={styles.textHolder} />
          <CommonText text={`${formatCurrency(pay)}đ`} styles={styles.payPrice} />
        </View>
      </View>
    );
  };

  const renderTimeSchedule = () => {
    return (
      <View style={styles.pdHz20}>
        <CommonText text="Thời gian - địa điểm đặt lịch" styles={styles.time} />
        <View style={styles.rowTime}>
          <Icons.Clock />
          <CommonText text={dayjs(schedule).format('HH:mm DD/MM/YYYY')} styles={styles.title} />
        </View>
        <View style={styles.rowTime}>
          <Icons.LocationSmall />
          <CommonText text={address} styles={styles.title} />
        </View>
        {note !== '' && <CommonText text={note} styles={styles.note} />}
      </View>
    );
  };

  const renderPayment = () => {
    return (
      <View style={styles.pdHz20}>
        <CommonText text="Thanh toán bằng" styles={styles.payment} />
        {payments?.map((item, index) => {
          const useTakerWallet = item?.id === 3;
          return (
            <View key={index}>
              <TouchableOpacity style={styles.rowItemPayment} onPress={() => setTypePayment(item.id)}>
                {typePayment === item?.id ? <Icons.Checked /> : <Icons.UnChecked />}
                {useTakerWallet ? (
                  <View style={styles.wrapperItemTaker}>
                    <View style={styles.rowItemTaker}>
                      <CommonText text={item?.name} styles={styles.textPayment} />
                      <CommonText styles={styles.textMain} text={' (Số dư ví: ' + formatCurrency(balance) + 'đ)'} />
                    </View>
                    <TouchableOpacity onPress={onPressReload} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
                        <Icons.Reload />
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <CommonText text={item?.name} styles={styles.textPayment} />
                )}
              </TouchableOpacity>
              {useTakerWallet && balance < total && (
                <TouchableOpacity onPress={onPressDeposit}>
                  <CommonText text="Nạp thêm tiền vào ví để sử dụng" styles={styles.deposit} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderButtonOrder = () => (
    <View style={styles.wrapperBottom}>
      <View style={styles.rowTotalPrice}>
        <CommonText text="Tổng cộng" />
        <CommonText text={`${formatCurrency(pay)}đ`} styles={styles.textPrice} />
      </View>
      <CommonButton isDisable={balance < pay && typePayment === 3} text="Đặt đơn" onPress={onPressOrder} isLoading={loadingButton} />
    </View>
  );

  const onBackdropPress = () => {
    setShowModalSuccess(false);
    navigate('BottomStack');
  };

  const onOrder = async (): Promise<ResponseCreateTrip> => {
    try {
      const newServices = services.map(item => omit(item, 'name'));
      const params: ParamsCreateTrip = {
        customerId: customer.id ?? '',
        latitude: `${latitude}`,
        longitude: `${longitude}`,
        paymentMethod: payments?.find(item => item?.id === typePayment)?.key || 'OFFLINE_PAYMENT',
        services: newServices,
        addressNote: note ?? '',
        address,
        ...(isScheduleTime && { scheduleTime: dayjs(schedule).valueOf() }),
      };

      const response = await triggerCreateTrip(params);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const showCancelOrder = () => {
    actionSheetFailedPaymentRef?.current?.show();
    NUMBER_RETRY = 10;
    setLoading(false);
  };

  const checkStatusPayment = async ({ tripId, paymentUrl, response }: { tripId: string; paymentUrl: string; response: ResponseCreateTrip }) => {
    try {
      setLoading(true);
      const statusPayment = await triggerGetPaymentStatus({ id: tripId });
      if (statusPayment?.data === 'PAID') {
        onSuccess(response);
      } else if (statusPayment?.data === 'PENDING') {
        if (NUMBER_RETRY > 0) {
          NUMBER_RETRY -= 1;
          setTimeout(() => {
            checkStatusPayment({ paymentUrl, tripId, response });
          }, 2000);
        } else {
          showCancelOrder();
        }
      } else {
        showCancelOrder();
      }
    } catch {
      showMessageError('Có lỗi xảy ra khi thanh toán!');
    } finally {
      // setLoading(false)
    }
  };

  const paymentByCreditCard = async ({ paymentUrl, tripId, response }: { paymentUrl: string; tripId: string; response: ResponseCreateTrip }) => {
    eventEmitter.addListener('PaymentBack', async (e: { resultCode: number }) => {
      console.log('Sdk back!', e);
      if (e) {
        switch (e.resultCode) {
          case 97: //thanh toán thành công trên webview
            checkStatusPayment({ tripId, paymentUrl, response });
            break;
          case 10: //Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...) lúc này app tích hợp sẽ cần lưu lại cái PNR, khi nào người dùng mở lại app tích hợp thì sẽ gọi kiểm tra trạng thái thanh toán của PNR Đó xem đã thanh toán hay chưa.
            // FIXME:
            setCheckPaymentAppCallApp({
              tripId,
              paymentUrl,
              response,
              isCallApp: true,
            });
            break;
          case 98: //giao dịch thanh toán bị failed
            showMessageError('Thanh toán không thành công!');
            break;
          case -1: //Người dùng nhấn back từ sdk để quay lại
          case 99:
            // setLoadingButton(false)
            setCheckPaymentAppCallApp({
              tripId,
              paymentUrl,
              response,
              isCallApp: true,
            });
            break;
          default:
            break;
        }
      }
      eventEmitter.removeAllListeners('PaymentBack');
    });
    VnpayMerchant.show({
      isSandbox: false,
      scheme: 'taker',
      title: 'Lựa chọn phương thức thanh toán',
      titleColor: '#333333',
      beginColor: '#ffffff',
      endColor: '#ffffff',
      tmn_code: 'TAKER001',
      paymentUrl: paymentUrl,
      iconBackName: 'icon_back',
    });
  };

  const onPressOrder = async () => {
    setLoading(true);
    setLoadingButton(true);
    try {
      const response = await onOrder();
      if (response?.data?.paymentUrl) {
        paymentByCreditCard({
          paymentUrl: response?.data?.paymentUrl,
          tripId: response?.data?.tripId,
          response: response,
        });
      } else {
        if (response?.data?.tripId) {
          onSuccess(response);
          setLoading(false);
          if (customer.newUser) setUser({ ...customer, newUser: false });
        } else {
          showMessageError('Có lỗi xảy ra, vui lòng thử lại sau');
          setLoadingButton(false);
          setLoading(false);
        }
      }
    } catch (err) {
      showMessageError('Có lỗi xảy ra, vui lòng thử lại sau');
      setLoadingButton(false);
      setLoading(false);
    } finally {
      // setLoading(false)
    }
  };

  const onSuccess = (response: ResponseCreateTrip) => {
    updateTripID(response?.data?.tripId);
    socketService.emit(SocketEvents.FIND_CLOSET_SHOE_MAKERS, {
      tripId: response?.data?.tripId,
      location: { lat: latitude, lng: longitude },
    });
    EventBus.emit(EventBusType.CREATE_ORDER_SUCCESS);
    const reOrder = () => {
      socketService.emit(SocketEvents.FIND_CLOSET_SHOE_MAKERS, {
        tripId: response?.data?.tripId,
        location: { lat: latitude, lng: longitude },
      });
    };
    triggerCreateHistory({
      latitude: `${latitude}`,
      longitude: `${longitude}`,
      name,
      address,
    });
    if (isScheduleTime) {
      setShowModalSuccess(true);
    } else {
      navigate('FindMaker', {
        total: pay,
        reOrder: reOrder,
        tripId: response?.data?.tripId,
        paymentMethod: typePayment,
      });
    }
  };

  const onPressReload = async () => {
    try {
      setIsReload(true);
      await triggerGetBalance();
    } catch (err) {
    } finally {
      setTimeout(() => {
        setIsReload(false);
      }, 900);
    }
  };

  const onPressDeposit = () => navigate('Deposit');

  const onClosePopupFailedPayment = async () => {
    try {
      actionSheetFailedPaymentRef?.current?.hide();
      setLoading(true);
      const response = await triggerCancelTrip({
        tripId: checkPaymentAppCallApp?.tripId,
        reason: reasonsCancel[4].name,
      });
      if (response?.data) {
        setLoadingButton(false);
      }
    } catch (err) {
      showMessageError('Có lỗi xảy ra khi hủy dịch vụ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused && checkPaymentAppCallApp?.isCallApp && checkPaymentAppCallApp?.response) {
      checkStatusPayment({
        tripId: checkPaymentAppCallApp?.tripId,
        paymentUrl: checkPaymentAppCallApp?.paymentUrl,
        response: checkPaymentAppCallApp?.response,
      });
    }
  }, [isFocused, checkPaymentAppCallApp]);

  useEffect(() => {
    if (isFocused) {
      triggerGetBalance();
    }
  }, [isFocused, triggerGetBalance]);

  useEffect(() => {
    if (isReload) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      rotation.stopAnimation();
      rotation.setValue(0);
    }
  }, [isReload, rotation]);

  return (
    <View style={styles.wrapper}>
      <Header title="Thông tin đặt hàng" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {renderInformation()}
        <View style={styles.line} />
        {renderPrice()}
        <View style={styles.bigLine} />
        {isScheduleTime && (
          <>
            {renderTimeSchedule()}
            <View style={styles.bigLine} />
          </>
        )}
        {renderPayment()}
      </ScrollView>
      {renderButtonOrder()}

      <ModalSuccess onBackdropPress={onBackdropPress} isVisible={showModalSuccess} title="Thành công" desc="Bạn đã đặt lịch thành công" />
      <PopupFailedPayment ref={actionSheetFailedPaymentRef} onClose={onClosePopupFailedPayment} />
    </View>
  );
};

export default InformationOrder;
