import Header from 'components/Header'
import React, {useState} from 'react'
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native'
import {Fonts} from 'assets/Fonts'
import {Colors} from 'assets/Colors'
import CommonText from 'components/CommonText'
import {Icons} from 'assets/icons'
import CommonButton from 'components/Button'
import ModalSuccess from './components/ModalSuccess'
import {goBack, navigate} from 'navigation/utils/navigationUtils'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'
import {appStore} from 'state/app'
import {useRateTrip} from 'services/src/serveRequest/serveService'
import {showMessageError} from 'utils/index'
import FastImage from 'react-native-fast-image'
import {s3Url} from 'services/src/APIConfig'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    flex: 1,
    paddingTop: 38,
    paddingHorizontal: 20,
  },
  itemMaker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    marginBottom: 2,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[12],
  },
  wrapperName: {
    marginLeft: 12,
    flex: 1,
  },
  line: {
    width: '100%',
    height: 0.5,
    backgroundColor: Colors.border,
    marginTop: 22,
    marginBottom: 18,
  },
  rate: {
    marginBottom: 14,
  },
  star: {
    marginHorizontal: 5,
  },
  reason: {
    marginTop: 28,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gallery,
    fontFamily: Fonts.fontFamily.AvertaRegular,
    fontSize: Fonts.fontSize[14],
    height: 100,
    color: Colors.black,
  },
  btSend: {
    borderRadius: 6,
    marginBottom: 40,
  },
  rowStar: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
})
interface Props {
  route: RouteProp<RootNavigatorParamList, 'RateOrder'>
}

const RateOrder = ({route}: Props) => {
  const {setLoading} = appStore(state => state)
  const {triggerRateTrip} = useRateTrip()
  const {tripId, shoemakerId, prevScreen, onRateSuccess, infoShoeMaker} =
    route.params
  const [star, setStar] = React.useState<number>(0)
  const [reason, setReason] = useState('')
  const [showModal, setShowModal] = useState(false)

  const onPressSendRate = async () => {
    try {
      setLoading(true)
      const response = await triggerRateTrip({
        tripId: tripId ?? '',
        shoemakerId: shoemakerId ?? '',
        rating: star,
        comment: reason,
      })
      if (response?.data?.toUpperCase() === 'SUCCESS') {
        setShowModal(true)
        onRateSuccess?.(star)
      }
    } catch (err) {
      showMessageError('Có lỗi xảy ra khi đánh giá dịch vụ!')
    } finally {
      setLoading(false)
    }
  }

  const onBackdropPress = () => {
    setShowModal(false)
    if (prevScreen) {
      goBack()
    } else {
      navigate('BottomStack')
    }
  }

  const renderItemMaker = () => {
    return (
      <View style={styles.itemMaker}>
        <FastImage
          style={styles.image}
          source={{
            uri: s3Url + infoShoeMaker?.avatar,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.wrapperName}>
          <CommonText text={'Người thực hiện'} styles={styles.title} />
          <CommonText
            text={infoShoeMaker?.fullName ?? ''}
            styles={styles.name}
          />
        </View>
      </View>
    )
  }

  const renderRate = () => {
    return (
      <View>
        <CommonText text="Mức độ hài lòng" styles={styles.rate} />
        <View style={styles.rowStar}>
          {[1, 2, 3, 4, 5].map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setStar(item)}
                style={styles.star}>
                {star !== 0 && star >= item ? (
                  <Icons.StarFull />
                ) : (
                  <Icons.Star />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderReason = () => {
    return (
      <View>
        <CommonText text="Lý do bạn chưa hài lòng" styles={styles.reason} />
        <TextInput
          allowFontScaling={false}
          value={reason}
          onChangeText={setReason}
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
          placeholder="Hãy chia sẻ nhận xét của bạn để Taker cải thiện hơn về chất lượng dịch vụ"
          placeholderTextColor={Colors.textSecondary}
          style={styles.input}
          returnKeyType="done"
          blurOnSubmit={true}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header title="Đánh giá" onPress={onBackdropPress} />
      <View style={styles.wrapper}>
        {renderItemMaker()}
        <View style={styles.line} />
        {renderRate()}
        {renderReason()}
      </View>
      <CommonButton
        isDisable={!star}
        text="Gửi"
        buttonStyles={styles.btSend}
        onPress={onPressSendRate}
      />
      <ModalSuccess
        isVisible={showModal}
        title="Đã gửi đánh giá"
        desc="Cảm ơn quý khách đã sử dụng dịch vụ"
        onBackdropPress={onBackdropPress}
      />
    </View>
  )
}

export default RateOrder
