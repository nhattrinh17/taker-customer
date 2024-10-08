import React, {useCallback, useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native'
import CommonText from 'components/CommonText'
import {Fonts} from 'assets/Fonts'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import _ from 'lodash'
import {goBack, navigate} from 'navigation/utils/navigationUtils'
import {
  useGetSearchHistory,
  usePlaceDetail,
  useSearchSuggestion,
} from 'services/src/serveRequest/serveService'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import {ItemSearchHistory, LocationPlaceDetail} from 'services/src/typings'
import Geolocation from '@react-native-community/geolocation'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const {width, height} = Dimensions.get('screen')

export const LATITUDE_DELTA = 0.005
export const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 16,
  },
  wrapperInputSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btBack: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wrapperInput: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: 40,
    borderRadius: 6,
    backgroundColor: Colors.gallery,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: Fonts.fontSize[14],
    fontFamily: Fonts.fontFamily.AvertaRegular,
    color: Colors.textPrimary,
  },
  wrapperCurrentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
    paddingHorizontal: 20,
  },
  renderCurrentLocation: {
    paddingHorizontal: 16,
  },
  currentLocation: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  valueCurrent: {
    color: Colors.textSecondary,
    marginTop: 4,
    marginRight: 10,
    minHeight: 22,
  },
  wrapperRecentLocation: {
    marginTop: 36,
    paddingHorizontal: 20,
    flex: 1,
  },
  wrapperResultSearchLocation: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  usedRecent: {
    fontSize: Fonts.fontSize[16],
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  rowItemRecent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentAddress: {
    flex: 1,
    marginLeft: 10,
    marginRight: 22,
  },
  resultAddress: {
    flex: 1,
    marginLeft: 10,
  },
  titleRecent: {
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontWeight: '700',
    marginBottom: 6,
  },
  addressRecent: {
    color: Colors.textSecondary,
  },
  line: {
    height: 0.5,
    backgroundColor: Colors.gallery,
    width: '100%',
    marginVertical: 16,
  },
  contentContainerResultSearch: {
    paddingTop: 36,
    paddingBottom: 50,
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  contentContainerRecent: {
    marginTop: 16,
    paddingBottom: 36,
    flexGrow: 1,
  },
  safeAreaView: {
    backgroundColor: 'white',
  },
  emptyList: {
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
  },
})

const ChooseLocation = () => {
  const {top} = useSafeAreaInsets()
  const {triggerGetDetailPlace} = usePlaceDetail()
  const {triggerGetSearchHistory} = useGetSearchHistory()
  const {triggerSearchSuggestion} = useSearchSuggestion()
  const [searchLocation, setSearchLocation] = useState<string>('')
  const [recentLocations, setRecentLocations] = useState<ItemSearchHistory[]>(
    [],
  )

  const [resultSearchLocation, setResultSearchLocation] = useState<
    LocationPlaceDetail[]
  >([])

  const [currentLocation, setCurrentLocation] = useState<LocationPlaceDetail>()
  const [location, setLocation] = useState<{lat: number; lng: number}>()

  const getCurrentLocation = async () => {
    try {
      Geolocation.getCurrentPosition(async res => {
        const {latitude, longitude} = res.coords
        setLocation({lat: latitude, lng: longitude})
        if (latitude && longitude) {
          const response = await triggerGetDetailPlace({
            latitude,
            longitude,
          })
          if (response?.data?.length) {
            setCurrentLocation(response.data?.[0])
          }
        }
      })
    } catch (err) {
      console.log('Error when get current location ===>', err)
      //
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const handleDebouneSearch = async (value: string) => {
    try {
      const response = await triggerSearchSuggestion({
        keyword: value.trim(),
        latitude: location?.lat ?? 0,
        longitude: location?.lng ?? 0,
      })
      console.log('response search ===>', response)
      if (response?.data?.length) {
        setResultSearchLocation(response.data)
      }
    } catch (err) {
      setResultSearchLocation([])
    }
  }

  const debounceFn = useCallback(_.debounce(handleDebouneSearch, 500), [
    location,
  ])

  const getSearchHistory = async () => {
    try {
      const response = await triggerGetSearchHistory()
      if (response?.data?.length) {
        setRecentLocations(response.data)
      }
      console.log('Response history ===>', response)
    } catch (err) {
      //
    }
  }

  useEffect(() => {
    getSearchHistory()
  }, [])

  const onSearchLocation = async (value: string) => {
    setSearchLocation(value)
    debounceFn(value)
  }

  const onPressCurrentLocation = () => {
    navigate('ChooseLocationOnMap', {
      location: currentLocation,
      lat: location?.lat,
      lng: location?.lng,
    })
  }

  const onPressItemResultSearch = (item: LocationPlaceDetail) => () => {
    navigate('ChooseLocationOnMap', {
      location: item,
      lat: item?.position?.lat,
      lng: item?.position?.lng,
    })
  }

  const onPressRecentLocation = (item: ItemSearchHistory) => () => {
    const itemLocationPlaceDetail: LocationPlaceDetail = {
      title: item?.name,
      address: {
        label: item?.address,
        countryCode: '',
        countryName: '',
        county: '',
        city: '',
        district: '',
        postalCode: '',
      },
      distance: 0,
      position: {
        lat: +item?.latitude,
        lng: +item?.longitude,
      },
    }
    navigate('ChooseLocationOnMap', {
      location: itemLocationPlaceDetail,
      lat: +item?.latitude,
      lng: +item?.longitude,
    })
  }

  const onGoBack = () => goBack()

  const renderInputSearch = () => {
    return (
      <View style={styles.wrapperInputSearch}>
        <TouchableOpacity style={styles.btBack} onPress={onGoBack}>
          <Icons.Back />
        </TouchableOpacity>

        <View
          style={{
            ...styles.wrapperInput,
            ...(searchLocation !== '' && {
              borderColor: Colors.cerulean,
              borderWidth: 1,
            }),
          }}>
          <Icons.RedDot />
          <TextInput
            value={searchLocation}
            onChangeText={onSearchLocation}
            style={styles.input}
            placeholder="Tìm địa điểm"
            placeholderTextColor={Colors.textPrimary}
            allowFontScaling={false}
          />
        </View>
      </View>
    )
  }

  const renderCurrentLocation = () => {
    return (
      <View style={styles.wrapperCurrentLocation}>
        <Icons.Target />
        <TouchableOpacity
          disabled={!currentLocation?.title}
          style={styles.renderCurrentLocation}
          onPress={onPressCurrentLocation}>
          <CommonText text="Vị trí hiện tại" styles={styles.currentLocation} />
          {currentLocation?.title ? (
            <CommonText
              text={currentLocation?.title}
              styles={styles.valueCurrent}
            />
          ) : (
            <SkeletonPlaceholder
              borderRadius={4}
              backgroundColor={Colors.gallery}>
              <SkeletonPlaceholder.Item
                width={Dimensions.get('screen').width - 90}
                height={22}
                marginTop={4}
              />
            </SkeletonPlaceholder>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  const renderKeyExtractor = (item: ItemSearchHistory, index: number) =>
    `${item?.name}, ${index}`

  const renderKeyExtractorResult = (item: LocationPlaceDetail, index: number) =>
    `${item?.title}, ${index}`

  const renderItem = ({item}: {item: ItemSearchHistory}) => {
    return (
      <TouchableOpacity
        style={styles.rowItemRecent}
        onPress={onPressRecentLocation(item)}>
        <Icons.Time />
        <View style={styles.recentAddress}>
          <CommonText text={item.name} styles={styles.titleRecent} />
          <CommonText text={item?.address} styles={styles.addressRecent} />
        </View>
        <Icons.ForwardToRight />
      </TouchableOpacity>
    )
  }

  const renderItemResultSearch = ({item}: {item: LocationPlaceDetail}) => {
    return (
      <TouchableOpacity
        style={styles.rowItemRecent}
        onPress={onPressItemResultSearch(item)}>
        <Icons.Location />
        <View style={styles.resultAddress}>
          <CommonText text={item.title} styles={styles.titleRecent} />
          <CommonText
            text={item.address?.label}
            styles={styles.addressRecent}
          />
        </View>
      </TouchableOpacity>
    )
  }

  const renderSeparator = () => <View style={styles.line} />
  const renderRecentLocationUsed = () => {
    return (
      <View style={styles.wrapperRecentLocation}>
        <CommonText text="Dùng gần đây" styles={styles.usedRecent} />
        <FlatList
          contentContainerStyle={styles.contentContainerRecent}
          data={recentLocations}
          keyExtractor={renderKeyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }

  const renderEmptyListSearch = () => {
    return null
    if (searchLocation !== '') {
      return (
        <View style={styles.emptyList}>
          <Icons.NotServed />
          <CommonText text="Không tìm thấy địa điểm" />
        </View>
      )
    }
    return null
  }

  const renderResultSearchLocation = () => {
    return (
      <FlatList
        contentContainerStyle={styles.contentContainerResultSearch}
        data={resultSearchLocation}
        keyExtractor={renderKeyExtractorResult}
        renderItem={renderItemResultSearch}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyListSearch}
      />
    )
  }

  return (
    <View style={{...styles.container, paddingTop: top}}>
      {renderInputSearch()}
      {!searchLocation ? (
        <>
          {renderCurrentLocation()}
          {renderRecentLocationUsed()}
        </>
      ) : (
        renderResultSearchLocation()
      )}
    </View>
  )
}

export default ChooseLocation
