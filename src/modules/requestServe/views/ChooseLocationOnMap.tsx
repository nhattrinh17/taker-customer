import {RouteProp} from '@react-navigation/native'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import CommonButton from 'components/Button'
import CommonText from 'components/CommonText'
import {RootNavigatorParamList} from 'navigation/typings'
import {navigate, navigationRef} from 'navigation/utils/navigationUtils'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import React, {useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  LayoutChangeEvent,
  TextInput,
  Image,
} from 'react-native'
import MapView, {
  Details,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps'
import {
  usePlaceDetail,
  useSearchShoeMakers,
} from 'services/src/serveRequest/serveService'
import {LocationPlaceDetail} from 'services/src/typings'
import {serveRequestStore} from 'state/serveRequest/serveRequestStore'
import {Images} from 'assets/Images'
import {LATITUDE_DELTA, LONGITUDE_DELTA} from './ChooseLocation'

const DISTANCE_NEARBY = 15

interface Props {
  route: RouteProp<RootNavigatorParamList, 'ChooseLocationOnMap'>
}

const ChooseLocationOnMap = (props: Props) => {
  const {location, lat, lng} = props?.route?.params
  const updateLocation = serveRequestStore(state => state.updateLocation)
  const updateMaker = serveRequestStore(state => state.updateMaker)

  const {triggerGetDetailPlace} = usePlaceDetail()

  const {triggerSearchShoeMakers} = useSearchShoeMakers()

  const [loadingGetDetail, setLoadingGetDetail] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [onMapReady, setOnMapReady] = useState(false)
  const [note, setNote] = useState<string>('')

  const [detailLocation, setDetailLocation] =
    useState<LocationPlaceDetail>(location)

  const [customerMarker, setCustomerMarker] = useState<{
    latitude: number
    longitude: number
  }>({
    latitude: lat,
    longitude: lng,
  })

  const region: Region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  }

  const [shoeMakers, setShoeMakers] = useState<LatLng[]>([])

  const findShoeMakers = async () => {
    try {
      const response = await triggerSearchShoeMakers({
        latitude: customerMarker.latitude,
        longitude: customerMarker.longitude,
      })
      if (response?.data?.length) {
        setShoeMakers(response.data)
      }
    } catch (err) {
      console.log('Error find shoemaker ===>', err)
    }
  }

  const onMapReadyFunc = () => setOnMapReady(true)

  useEffect(() => {
    findShoeMakers()
  }, [])

  const getDetailLocation = async (latitude: number, longitude: number) => {
    setLoadingGetDetail(true)
    try {
      const response = await triggerGetDetailPlace({
        latitude,
        longitude,
      })
      if (response?.data?.length) {
        const firstLocation = response?.data[0]
        if (
          firstLocation.title === firstLocation?.address?.label &&
          response?.data?.length >= 2
        ) {
          const nearestLocation = response?.data?.find(
            e =>
              e?.title !== e?.address?.label && e?.distance < DISTANCE_NEARBY,
          )

          if (nearestLocation) {
            setDetailLocation(nearestLocation)
          } else {
            setDetailLocation(response?.data[0])
          }
        } else {
          setDetailLocation(response?.data[0])
        }
        setLoadingGetDetail(false)
      }
    } catch (err) {
      console.log('Error getDetailLocation ===>', err)
    }
  }

  const onRegionChangeComplete = (newRegion: Region, details: Details) => {
    if (!onMapReady) {
      return
    }
    if (details?.isGesture) {
      // if (newRegion.longitude !== customerMarker.longitude) {
      getDetailLocation(newRegion.latitude, newRegion.longitude)
      findShoeMakers()
      // }
    }
  }

  const onRegionChange = (newRegion: Region, details: Details) => {
    if (details?.isGesture) {
      if (newRegion.longitude !== customerMarker.longitude) {
        setCustomerMarker({
          latitude: newRegion.latitude,
          longitude: newRegion.longitude,
        })
      }
    }
  }

  const onChooseThisLocation = () => {
    updateLocation({
      latitude: customerMarker.latitude,
      longitude: customerMarker.longitude,
      note,
      address: detailLocation?.address?.label,
      name: detailLocation?.title,
    })
    updateMaker(shoeMakers[0])
    navigate('ChooseProduct')
  }

  const onPressBack = () => {
    navigationRef.goBack()
  }

  const onPressNote = () => setShowNote(true)

  const renderDontHaveShoeMaker = () => {
    return (
      <View style={styles.wrapperErrorView}>
        <Icons.ErrorLocation />
        <View style={styles.rowTextErr}>
          <CommonText
            text="Không tìm thấy thợ đánh giày."
            styles={styles.titleErr}
          />
          <CommonText
            text="Vui lòng chọn địa điểm khác hoặc thử lại vào thời gian khác."
            styles={styles.descErr}
          />
        </View>
      </View>
    )
  }

  const renderInputNote = () => (
    <TextInput
      value={note}
      allowFontScaling={false}
      onChangeText={setNote}
      style={styles.inputNote}
      placeholder="Ghi chú về địa điểm"
      placeholderTextColor={Colors.textSecondary}
    />
  )

  const renderViewAction = () => {
    return (
      <View>
        {!showNote ? (
          <TouchableOpacity style={styles.rowNote} onPress={onPressNote}>
            <Icons.Edit />
            <CommonText
              text="Ghi chú thêm về địa điểm"
              styles={styles.textNote}
            />
          </TouchableOpacity>
        ) : (
          renderInputNote()
        )}

        <CommonButton
          text="Chọn địa điểm này"
          onPress={onChooseThisLocation}
          buttonStyles={styles.btChoose}
        />
      </View>
    )
  }

  const renderSkeletonLoading = () => (
    <View style={styles.viewAddress}>
      <Icons.RedDot />
      <SkeletonPlaceholder borderRadius={4} backgroundColor={Colors.white}>
        <View style={styles.ml12}>
          <SkeletonPlaceholder.Item
            width={Dimensions.get('screen').width - 90}
            height={14}
          />
          <SkeletonPlaceholder.Item
            width={Dimensions.get('screen').width - 90}
            height={18}
            marginTop={2}
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  )

  const renderBottomView = () => {
    const renderTitle = detailLocation?.title !== detailLocation?.address?.label
    return (
      <View style={styles.bottomView}>
        {loadingGetDetail ? (
          renderSkeletonLoading()
        ) : (
          <View style={styles.viewAddress}>
            <Icons.RedDot />
            <View style={styles.wrapperAddress}>
              <>
                {renderTitle && (
                  <CommonText
                    text={detailLocation?.title ?? ''}
                    styles={styles.nameLocation}
                  />
                )}
                <CommonText
                  text={detailLocation?.address?.label ?? ''}
                  styles={styles.addressLocation}
                />
              </>
            </View>
          </View>
        )}

        {shoeMakers.length ? renderViewAction() : renderDontHaveShoeMaker()}
      </View>
    )
  }

  const renderButtonBack = () => (
    <TouchableOpacity style={styles.buttonBack} onPress={onPressBack}>
      <Icons.Back />
    </TouchableOpacity>
  )

  const onMapViewLayout = (_event: LayoutChangeEvent) => {
    //
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.keyboardAwareScrollView}
      extraScrollHeight={20}
      // enableOnAndroid={true}
    >
      <View style={styles.container}>
        <MapView
          onMapReady={onMapReadyFunc}
          onLayout={onMapViewLayout}
          provider={PROVIDER_GOOGLE}
          region={region}
          style={styles.mapView}
          onRegionChange={onRegionChange}
          onRegionChangeComplete={onRegionChangeComplete}
          mapType="standard"
          scrollDuringRotateOrZoomEnabled={false}>
          <Marker coordinate={customerMarker} tracksViewChanges={false}>
            <Icons.Marker />
          </Marker>
          {shoeMakers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              anchor={{x: 0.5, y: 0.4}}
              tracksViewChanges={false}>
              <Image source={Images.ShoeMaker} style={styles.iconShoeMaker} />
            </Marker>
          ))}
        </MapView>
        {renderBottomView()}
        {renderButtonBack()}
      </View>
    </KeyboardAwareScrollView>
  )
}

export default ChooseLocationOnMap

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
    zIndex: 99,
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
    marginRight: 8,
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
    color: Colors.black,
  },
  keyboardAwareScrollView: {
    flex: 1,
  },
  iconShoeMaker: {
    width: 40,
    height: 40,
  },
})
