import {RouteProp} from '@react-navigation/native';
import {Colors} from 'assets/Colors';
import {Fonts} from 'assets/Fonts';
import {Icons} from 'assets/icons';
import {RootNavigatorParamList} from 'navigation/typings';
import {navigate} from 'navigation/utils/navigationUtils';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MapView, {
  Details,
  Marker,
  PROVIDER_GOOGLE,
  Region,
  Circle,
} from 'react-native-maps';
import {serveRequestStore} from 'state/serveRequest/serveRequestStore';
import StatusOrder from './components/StatusOrder';
import {SocketEvents, SocketService} from 'socketIO';
import {EventBus, EventBusType} from 'observer';
import {StatusActivity} from 'modules/activity/typings';
import ModalConfirmCancel from './components/ModalConfirmCancel';
import {useCancelTrip} from 'services/src/serveRequest/serveService';
import {reasonsCancel} from '../constants';
import {showMessageError} from 'utils/index';
import {delay} from 'lodash';

const {width, height} = Dimensions.get('screen');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

interface Props {
  route: RouteProp<RootNavigatorParamList, 'FindMaker'>;
}

const FindMaker = (props: Props) => {
  const {total, tripId, statusOrder, infoShoeMaker, reOrder, paymentMethod} =
    props?.route?.params;
  const socketService = SocketService.getInstance();
  const {triggerCancelTrip} = useCancelTrip();

  const {orderInProgress} = serveRequestStore(state => state);

  const {latitude, longitude} = serveRequestStore(state => {
    return {
      latitude: +state.latitude,
      longitude: +state.longitude,
    };
  });

  const [status, setStatus] = useState<StatusActivity>(
    statusOrder ?? StatusActivity.SEARCHING,
  );

  const [informationShoeMaker, setInformationShoeMaker] =
    useState<serve.InformationShoeMaker | null>(infoShoeMaker ?? null);

  const [circleRadius] = useState(new Animated.Value(10));
  const [showModalConfirmCancel, setShowModalConfirmCancel] = useState(false);

  const customerLocation: {
    latitude: number;
    longitude: number;
  } = {
    latitude,
    longitude,
  };

  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const [shoeMakers, setShoeMakers] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: infoShoeMaker?.latitude ?? 0,
    longitude: infoShoeMaker?.longitude ?? 0,
  });

  const triggerReOrder = () => {
    socketService.emit(SocketEvents.FIND_CLOSET_SHOE_MAKERS, {
      tripId: tripId,
      location: {lat: latitude, lng: longitude},
    });
  };

  useEffect(() => {
    socketService.on(SocketEvents.FIND_CLOSET_SHOE_MAKERS, data => {
      if (data?.type === SocketEvents.NOT_FOUND) {
        return delay(() => {
          setStatus(StatusActivity.NOT_FOUND);
        }, 10000);
      }
      const shoeMaker = data as serve.ResponseInformationShoeMaker;
      if (shoeMaker.data?.lat && shoeMaker.data?.lng) {
        EventBus.emit(EventBusType.FIND_CLOSET_SHOE_MAKERS);
        setInformationShoeMaker(shoeMaker.data);
        setStatus(StatusActivity.WAITING);
        setShoeMakers({
          latitude: shoeMaker.data.lat,
          longitude: shoeMaker.data.lng,
        });
      }
    });

    socketService.on(SocketEvents.UPDATE_LOCATION, location => {
      setShoeMakers({
        latitude: location.lat,
        longitude: location.lng,
      });
    });

    socketService.on(SocketEvents.TRIP_STATUS, response => {
      EventBus.emit(EventBusType.UPDATE_STATUS_ORDER);
      if (response?.status === StatusActivity.COMPLETED) {
        EventBus.emit(EventBusType.FINISHED_ORDER);
      }
      setStatus(response?.status);
    });

    return () => {
      socketService.off(SocketEvents.FIND_CLOSET_SHOE_MAKERS);
      socketService.off(SocketEvents.UPDATE_LOCATION);
      socketService.off(SocketEvents.TRIP_STATUS);
    };
  }, []);

  useEffect(() => {
    if (statusOrder === StatusActivity.SEARCHING) {
      triggerReOrder();
    }
  }, []);

  useEffect(() => {
    const animateCircle = () => {
      Animated.sequence([
        Animated.timing(circleRadius, {
          toValue: 150,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(circleRadius, {
          toValue: 10,
          duration: 0,
          useNativeDriver: false,
        }),
      ]).start(({finished}) => {
        if (finished) {
          animateCircle();
        }
      });
    };
    if (status === StatusActivity.SEARCHING) {
      animateCircle();
    }
  }, [status]);

  const onRegionChangeComplete = (_newRegion: Region, _details: Details) => {
    //
  };

  const onRegionChange = (_newRegion: Region, _details: Details) => {
    //
  };

  const onConfirmCancel = (value: boolean) => async () => {
    if (value) {
      try {
        const response = await triggerCancelTrip({
          tripId,
          reason: reasonsCancel[3].name,
        });
        if (response?.data === 'SUCCESS') {
          EventBus.emit(EventBusType.CANCEL_ORDER_SUCCESS);
          navigate('BottomStack');
        }
      } catch (err) {
        showMessageError('Có lỗi xảy ra khi hủy đơn, vui lòng thử lại sau.');
      }
    }
    setShowModalConfirmCancel(false);
  };

  const onClose = () => {
    if (
      [
        // StatusActivity.MEETING,
        StatusActivity.SEARCHING,
        StatusActivity.NOT_FOUND,
      ].includes(status)
    ) {
      setShowModalConfirmCancel(true);
    } else {
      navigate('BottomStack');
      setTimeout(() => {
        EventBus.emit(EventBusType.BACK_TO_HOME, orderInProgress);
      }, 1500);
    }
  };

  const onCancel = () => {
    navigate('CancelOrder', {tripId});
  };

  const onPressRetry = () => {
    if (reOrder) {
      reOrder();
    } else {
      triggerReOrder();
    }
    setStatus(StatusActivity.SEARCHING);
  };

  const onPressRate = () => {
    navigate('RateOrder', {
      tripId,
      shoemakerId: informationShoeMaker?.id ?? infoShoeMaker?.id,
      infoShoeMaker: informationShoeMaker ?? infoShoeMaker,
    });
  };

  const renderButtonBack = () => (
    <TouchableOpacity style={styles.buttonBack} onPress={onClose}>
      <Icons.Close />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={region}
        style={styles.mapView}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        mapType="standard"
        scrollDuringRotateOrZoomEnabled={false}>
        <Marker coordinate={customerLocation} tracksViewChanges={false}>
          <View style={{zIndex: 9}}>
            <Icons.Marker />
          </View>
        </Marker>
        {shoeMakers?.latitude !== 0 && (
          <Marker
            coordinate={{
              latitude: +shoeMakers?.latitude,
              longitude: +shoeMakers?.longitude,
            }}
            anchor={{x: 0.5, y: 0.4}}
            tracksViewChanges={false}>
            <Icons.ShoeMaker />
          </Marker>
        )}
        {status === 'SEARCHING' && (
          <AnimatedCircle
            center={customerLocation}
            radius={circleRadius}
            fillColor="rgba(0,165,79,0.2)"
            strokeColor="rgba(0,165,79,0.2)"
            zIndex={8}
          />
        )}
      </MapView>
      <StatusOrder
        paymentMethod={paymentMethod}
        informationShoeMaker={informationShoeMaker}
        status={status}
        total={total}
        onPressRate={onPressRate}
        onCancel={onCancel}
        onPressRetry={onPressRetry}
      />
      {renderButtonBack()}
      <ModalConfirmCancel
        onConfirm={onConfirmCancel}
        showModal={showModalConfirmCancel}
      />
    </View>
  );
};

export default FindMaker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  mapView: {
    flex: 1,
  },
  bottomView: {
    paddingTop: 20,
    paddingBottom: 48,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  viewAddress: {
    borderRadius: 4,
    backgroundColor: Colors.gallery,
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 50,
  },
  wrapperAddress: {
    marginLeft: 12,
  },
  nameLocation: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  addressLocation: {
    color: Colors.textSecondary,
  },
  rowNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  textNote: {
    fontSize: Fonts.fontSize[12],
    color: Colors.cerulean,
    marginLeft: 8,
  },
  btChoose: {
    marginTop: 20,
  },
  wrapperErrorView: {
    marginTop: 16,
    backgroundColor: Colors.lavenderBlush,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
  rowTextErr: {
    flex: 1,
    marginLeft: 12,
  },
  titleErr: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    color: Colors.red,
  },
  descErr: {
    fontSize: Fonts.fontSize[12],
  },
  buttonBack: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 20,
    marginTop: 60,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  ml12: {
    marginLeft: 12,
  },
  inputNote: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.main,
    marginTop: 18,
    borderRadius: 6,
    fontSize: Fonts.fontSize[14],
    fontFamily: Fonts.fontFamily.AvertaRegular,
  },
  wrapperFinding: {
    backgroundColor: Colors.white,
    paddingTop: 12,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  rowTopFinding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowFinding: {
    paddingLeft: 16,
    flex: 1,
  },
  textStatus: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[12],
  },
  finding: {
    color: Colors.main,
    fontWeight: '600',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  line: {
    width: '100%',
    height: 0.5,
    backgroundColor: Colors.gallery,
    marginVertical: 12,
  },
  rowTypeCash: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 42,
  },
  cash: {
    fontSize: Fonts.fontSize[12],
    color: Colors.textSecondary,
  },
  btCancel: {
    marginBottom: 20,
  },
  btRetry: {
    borderRadius: 6,
    marginBottom: 20,
  },
  rowTopWaiting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeWaiting: {
    color: Colors.main,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  textWaiting: {
    marginLeft: 8,
  },
  btRate: {
    borderRadius: 6,
  },
  mb16: {
    marginBottom: 16,
  },
  iconShoeMaker: {
    width: 40,
    height: 40,
  },
});
