import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions, Platform, AppState, Linking } from 'react-native';
import { PermissionStatus } from 'react-native-permissions';
import { Colors } from 'assets/Colors';
import { Fonts } from 'assets/Fonts';
import { Icons } from 'assets/icons';
import Banner from 'components/Banner';
import Post from 'components/Post';
import CommonText from 'components/CommonText';
import { userStore } from 'state/user';
import { navigate } from 'navigation/utils/navigationUtils';
import { serveRequestStore } from 'state/serveRequest/serveRequestStore';
import { formatCurrency, renderStatusActivity, showMessageWarning } from 'utils/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import PopupOpenSetting from 'components/PopupOpenSetting';
import { ActionSheetRef } from 'react-native-actions-sheet';
import usePermission from 'hooks/locationPermission';
import { EventBus, EventBusType } from 'observer';
import { SocketEvents, SocketService } from 'socketIO';
import { StatusActivity } from 'modules/activity/typings';
import { cloneDeep, isEmpty } from 'lodash';
import { useGetBalance } from 'services/src/profile';
import { useIsFocused } from '@react-navigation/native';
import { useCancelTrip, useGetPaymentStatus, useGetServiceInProgress } from 'services/src/serveRequest/serveService';
import { appStore } from 'state/app';
import PopupFailedPayment from 'components/PopupFailedPayment';
import { reasonsCancel } from 'modules/requestServe/constants';
import { ResponseServiceInProgress } from 'services/src/typings';
import ModalPromotion from 'components/ModalPromotion';
import PopupHaveOrder from 'components/PopupHaveOrder';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    zIndex: 1,
    position: 'relative',
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: Colors.main,
    position: 'relative',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    flex: 2,
    backgroundColor: Colors.main,
    paddingLeft: 16,
    paddingBottom: 48,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
  },
  slogan: {
    color: Colors.white,
    fontSize: 16,
    marginTop: 4,
    paddingLeft: 4,
  },
  main: {
    flex: 5,
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
  },
  top: {
    backgroundColor: Colors.white,
    marginTop: -40,
    width: '100%',
    height: 64,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.border,
    borderColor: Colors.border,
    borderWidth: 1,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: 'row',
  },
  leftTop: {
    flex: 1,
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderColor: Colors.border,
    paddingRight: 16,
  },
  number: {
    flexDirection: 'row',
  },
  iconWallet: {
    marginRight: 8,
  },
  lable: {
    fontSize: Fonts.fontSize[13],
    color: Colors.textSecondary,
  },
  addWallet: {
    color: Colors.main,
    marginLeft: 4,
  },
  rightTop: {
    flex: 1,
    marginLeft: 16,
  },
  buttonCopy: {
    marginLeft: 4,
    marginTop: 2,
  },
  banner: {
    width: 360,
    height: 240,
    borderRadius: 12,
    marginTop: 16,
  },
  modalWarning: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  contentModallWarning: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  iconClose: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  headerWarning: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleModalWarning: {
    color: Colors.red,
    fontSize: Fonts.fontSize[18],
    fontWeight: '600',
    marginLeft: 6,
    marginTop: 2,
  },
  labelModalWarning: {
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[14],
    marginTop: 10,
  },
  wrapperFuntions: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 16,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 6,
  },
  itemInProgress: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: Colors.mainBackground,
    width: Dimensions.get('screen').width - 32,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.main,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    zIndex: 20,
  },
  statusInprogress: {
    marginLeft: 10,
  },
  idOrder: {
    color: Colors.textSecondary,
  },
});

const isIOS = Platform.OS === 'ios';

const Home = () => {
  const { triggerGetBalance, balance } = useGetBalance();
  const { triggerServiceInProgress } = useGetServiceInProgress();
  const { triggerGetPaymentStatus } = useGetPaymentStatus();
  const { triggerCancelTrip } = useCancelTrip();

  const isFocused = useIsFocused();
  const user = userStore(state => state.user);
  const { top } = useSafeAreaInsets();
  const { checkPermissionLocation, requestPermissionLocation } = usePermission();
  const socketService = SocketService.getInstance();
  const { setLoading } = appStore(state => state);

  const { updateSchedule, updateLocation } = serveRequestStore(state => state);
  const { orderInProgress, updateOrderInProgress } = serveRequestStore(state => state);

  const [showModalPromotion, setShowModalPromotion] = useState<boolean>(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const actionSheetProcessRef = useRef<ActionSheetRef>(null);
  const actionSheetFailedPaymentRef = useRef<ActionSheetRef>(null);
  const [granted, setGranted] = useState<PermissionStatus>();
  const appState = useRef(AppState.currentState);
  const [checkStatusPayment, setCheckStatusPayment] = useState<{
    isChecked: boolean;
    isPaid: boolean;
  }>({ isChecked: false, isPaid: true });

  const onPressViewOrder = async () => {
    if (!checkStatusPayment?.isPaid) {
      //need to cancel the order
      return actionSheetFailedPaymentRef?.current?.show();
    }

    if (granted === 'granted') {
      socketService.off(SocketEvents.TRIP_STATUS);
      socketService.off(SocketEvents.FIND_CLOSET_SHOE_MAKERS);

      const { shoemaker } = orderInProgress?.[0];
      updateLocation({
        latitude: Number(orderInProgress?.[0]?.latitude),
        longitude: Number(orderInProgress?.[0]?.longitude),
        address: orderInProgress?.[0]?.address,
      });
      navigate('RequestServeStack', {
        screen: 'FindMaker',
        params: {
          tripId: orderInProgress?.[0]?.id,
          total: orderInProgress?.[0]?.totalPrice,
          statusOrder: orderInProgress?.[0]?.status,
          infoShoeMaker: shoemaker,
          paymentMethod: orderInProgress?.[0]?.paymentMethod,
        },
      });
    } else {
      actionSheetRef?.current?.show();
    }
  };

  const checkEnableGPSAndroid = async () => {
    try {
      const isEnableLocation = await isLocationEnabled();
      if (isEnableLocation) {
        return true;
      }
      const response = await promptForEnableLocationIfNeeded({
        interval: 10000,
        waitForAccurate: true,
      });
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const navigateToVerifyAcc = () => {
    navigate('AuthStack', {
      screen: 'Otp',
      params: { phone: user.phone, userId: user.id, isForget: false },
    });
  };

  const onPressRequestServe = async () => {
    // if (!user.isVerified) return navigateToVerifyAcc();
    if (!user.isVerified) return showMessageWarning('Bạn cần xác nhận tài khoản trước');
    if (orderInProgress?.length) {
      return actionSheetProcessRef?.current?.show();
    }
    if (granted === 'granted') {
      updateSchedule(null);
      navigate('RequestServeStack');
    } else {
      actionSheetRef?.current?.show();
    }
  };

  const onPressScheduleServe = async () => {
    if (orderInProgress?.length) {
      return actionSheetProcessRef?.current?.show();
    }
    if (granted === 'granted') {
      navigate('Schedule');
    } else {
      actionSheetRef?.current?.show();
    }
  };

  console.log('Granted ===>', granted);

  const checkPermission = async () => {
    try {
      const response = await checkPermissionLocation();
      setGranted(response);
      if (response === 'granted') {
        actionSheetRef?.current?.hide();
        if (isIOS) {
          EventBus.emit(EventBusType.HAVE_PERMISSION_LOCATION);
        } else {
          const enableGPSAndroid = await checkEnableGPSAndroid();
          if (enableGPSAndroid) {
            EventBus.emit(EventBusType.HAVE_PERMISSION_LOCATION);
          }
        }
      } else if (response === 'denied' || response === 'blocked') {
        actionSheetRef?.current?.show();
      }
    } catch (err) {
      actionSheetRef?.current?.show();
    }
  };

  const onPressContinue = async () => {
    if (isIOS) {
      if (granted === 'denied') {
        const responseRequest = await requestPermissionLocation();
        if (responseRequest === 'granted') {
          actionSheetRef?.current?.hide();
          EventBus.emit(EventBusType.HAVE_PERMISSION_LOCATION);
        }
      } else if (granted === 'blocked') {
        Linking.openSettings();
      }
    } else {
      console.log('run android ===>', granted);
      if (granted === 'denied') {
        const responseRequest = await requestPermissionLocation();
        if (responseRequest === 'granted') {
          const enableGPSAndroid = await checkEnableGPSAndroid();
          if (enableGPSAndroid) {
            EventBus.emit(EventBusType.HAVE_PERMISSION_LOCATION);
          }
        } else {
          actionSheetRef?.current?.hide();
          Linking.openSettings();
        }
      } else if (granted === 'blocked') {
        Linking.openSettings();
      }
    }
  };

  const onDeposit = () => navigate('Deposit');

  const updateStatusOrder = (status: StatusActivity) => {
    const clonedOrders = cloneDeep(orderInProgress);
    clonedOrders[0].status = status;
    updateOrderInProgress(clonedOrders);
  };

  const getOrderInProgress = useCallback(async () => {
    if (!isEmpty(orderInProgress)) {
      try {
        const response = await triggerServiceInProgress();
        console.log('🚀 ~ getOrderInProgress ~ response?.data?.[0]?.status:', response?.data);
        if (response?.data?.length) {
          updateStatusOrder(response?.data?.[0]?.status);
        }
      } catch (err) {
        //
      }
    }
  }, [orderInProgress]);

  const listenerTripStatus = () => {
    socketService.on(SocketEvents.TRIP_STATUS, response => {
      if (response?.status === StatusActivity.COMPLETED) {
        socketService.off(SocketEvents.TRIP_STATUS);
        EventBus.emit(EventBusType.FINISHED_ORDER);
      } else {
        updateStatusOrder(response?.status);
      }
    });
  };

  const checkStatusPaymentFunc = async (id: string) => {
    try {
      setLoading(true);
      const response = await triggerGetPaymentStatus({ id });
      setCheckStatusPayment({
        isChecked: true,
        isPaid: response?.data === 'PAID',
      });
    } catch (err) {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    EventBus.on(EventBusType.BACK_TO_HOME, async () => {
      let order: ResponseServiceInProgress;
      try {
        order = await triggerServiceInProgress();
      } catch (err) {}
      socketService.on(SocketEvents.TRIP_STATUS, response => {
        if (response?.status === StatusActivity.COMPLETED) {
          socketService.off(SocketEvents.TRIP_STATUS);
          EventBus.emit(EventBusType.FINISHED_ORDER);
        } else {
          const clonedOrders = cloneDeep(order?.data);
          clonedOrders[0].status = response?.status;
          updateOrderInProgress(clonedOrders);
        }
      });
    });
  }, []);

  useEffect(() => {
    checkPermission();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        getOrderInProgress();
        checkPermission();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      triggerGetBalance();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isEmpty(orderInProgress) && isFocused) {
      listenerTripStatus();
      socketService.once(SocketEvents.FIND_CLOSET_SHOE_MAKERS, data => {
        if (data?.type === SocketEvents.NOT_FOUND) {
          updateStatusOrder(StatusActivity.NOT_FOUND);
        }
      });
    }
    if (!isEmpty(orderInProgress) && !checkStatusPayment.isChecked && orderInProgress[0]?.paymentMethod === 'CREDIT_CARD') {
      checkStatusPaymentFunc(orderInProgress[0]?.id);
    }
  }, [orderInProgress]);

  useEffect(() => {
    if (granted === 'granted') {
      setShowModalPromotion(true);
    }
  }, [granted]);

  const actions = [
    {
      icon: <Icons.Shoe />,
      title: 'Taker Shoes',
      onPress: onPressRequestServe,
    },
    {
      icon: <Icons.Bike />,
      title: 'Taker Bike',
      onPress: () => navigate('Bike'),
    },
    {
      icon: <Icons.TimeHome />,
      title: 'Taker Food',
      onPress: onPressScheduleServe,
    },
    // {
    //   icon: <Icons.CleanHome />,
    //   title: 'Ứng dụng',
    //   onPress: () => navigate('CleanHouse'),
    // },
    {
      icon: <Icons.Store />,
      title: 'Ứng dụng',
      onPress: () => navigate('Store'),
    },
  ];

  const renderActions = () => (
    <View style={styles.wrapperFuntions}>
      {actions.map((item, index) => (
        <TouchableOpacity key={`${index}`} style={styles.item} onPress={item.onPress}>
          {item?.icon}
          <CommonText text={item.title} styles={styles.label} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Icons.LogoText />
        <CommonText text="VUA ĐÁNH GIÀY CÔNG NGHỆ" styles={styles.slogan} />
      </View>
    );
  };

  const renderMenu = () => {
    return (
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigate('Wallet')} style={styles.leftTop}>
          <View style={styles.iconWallet}>
            <Icons.Wallet />
          </View>
          <View>
            <CommonText text="Ví Taker" styles={styles.lable} />
            <View style={styles.number}>
              <CommonText text={`${formatCurrency(balance)}đ`} />
              <TouchableOpacity onPress={onDeposit}>
                <CommonText text="Nạp tiền" styles={styles.addWallet} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Referral')} style={styles.rightTop}>
          <View>
            <CommonText text="Mã giới thiệu của bạn" styles={styles.lable} />
            <View style={styles.number}>
              <CommonText text={user?.phone ?? ''} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderOrderInProgress = () => {
    if (!orderInProgress?.length) {
      return;
    }
    return (
      <TouchableOpacity style={styles.itemInProgress} onPress={onPressViewOrder}>
        <Icons.CheckList />
        <View style={styles.statusInprogress}>
          <CommonText text={renderStatusActivity(orderInProgress?.[0]?.status)} />
          <CommonText text={`Đơn hàng #${orderInProgress?.[0]?.orderId}`} styles={styles.idOrder} />
        </View>
      </TouchableOpacity>
    );
  };

  const onCloseModalPromotion = () => {
    setShowModalPromotion(false);
  };

  const onClosePopupProcessOrder = () => actionSheetProcessRef?.current?.hide();

  const onClosePopupFailedPayment = async () => {
    try {
      actionSheetFailedPaymentRef?.current?.hide();
      const response = await triggerCancelTrip({
        tripId: orderInProgress[0]?.id,
        reason: reasonsCancel[4].name,
      });
      if (response?.data) {
        EventBus.emit(EventBusType.CANCEL_ORDER_SUCCESS);
      }
    } catch (err) {
      //
    } finally {
      //
    }
  };

  return (
    <>
      <ScrollView style={{ ...styles.container }} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={{ ...styles.mainContainer, marginTop: top }}>
          {renderHeader()}
          <View style={styles.main}>
            {renderMenu()}
            {renderActions()}
            <Banner type="home" />
            <Post type="home" />
          </View>
        </View>

        {/* <ModalPromotion
          showModalPromotion={showModalPromotion}
          onClose={onCloseModalPromotion}
          onPressPromotion={onPressRequestServe}
        /> */}

        <PopupHaveOrder ref={actionSheetProcessRef} onClose={onClosePopupProcessOrder} />

        <PopupOpenSetting granted={granted} ref={actionSheetRef} onPressContinue={onPressContinue} />
        <PopupFailedPayment ref={actionSheetFailedPaymentRef} onClose={onClosePopupFailedPayment} />
      </ScrollView>
      {renderOrderInProgress()}
    </>
  );
};

export default Home;
