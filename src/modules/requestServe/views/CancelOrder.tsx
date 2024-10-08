import React, {useState} from 'react'
import {View, StyleSheet} from 'react-native'
import Header from 'components/Header'
import CommonButton from 'components/Button'
import CommonText from 'components/CommonText'
import Dropdown from 'components/Dropdown'
import {reasonsCancel} from '../constants'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import ModalSuccess from './components/ModalSuccess'
import {useCancelTrip} from 'services/src/serveRequest/serveService'
import {appStore} from 'state/app'
import {showMessageError} from 'utils/index'
import {goBack, navigate} from 'navigation/utils/navigationUtils'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'
import {EventBus, EventBusType} from 'observer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 30,
    flex: 1,
  },
  reason: {
    marginBottom: 6,
  },
  warning: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[12],
    marginHorizontal: 20,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  btCancel: {
    borderRadius: 6,
    marginBottom: 40,
  },
})
interface Props {
  route: RouteProp<RootNavigatorParamList, 'CancelOrder'>
}

const CancelOrder = ({route}: Props) => {
  const {tripId, prevScreen, onCancelSuccess} = route?.params
  const {triggerCancelTrip} = useCancelTrip()
  const {setLoading} = appStore(state => state)
  const [showModalSuccess, setShowModalSuccess] = useState<boolean>(false)
  const [itemReason, setItemReason] = useState<components.ItemDropdown>(
    reasonsCancel[0],
  )

  const onPressItem = (item: components.ItemDropdown) => {
    setItemReason(item)
  }

  const onPressCancel = async () => {
    try {
      setLoading(true)
      const response = await triggerCancelTrip({
        reason: itemReason.name,
        tripId,
      })
      if (response?.data === 'SUCCESS') {
        setShowModalSuccess(true)
        EventBus.emit(EventBusType.CANCEL_ORDER_SUCCESS, () => {
          //
        })
      }
    } catch (err) {
      showMessageError('Có lỗi xảy ra khi hủy dịch vụ!')
    } finally {
      setLoading(false)
    }
  }

  const onBackdropPress = () => {
    onCancelSuccess?.()
    setShowModalSuccess(false)
    if (prevScreen) {
      goBack()
    } else {
      navigate('BottomStack')
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Hủy đặt dịch vụ" />
      <View style={styles.wrapper}>
        <CommonText
          text="Vui lòng chọn lí do hủy dịch vụ"
          styles={styles.reason}
        />
        <Dropdown
          data={reasonsCancel}
          itemActive={itemReason}
          onPress={onPressItem}
        />
      </View>
      <View>
        <CommonText
          text="Việc hủy dịch vụ nhiều có thể dẫn tới khóa tài khoản. Bạn hãy cân nhắc trước khi hủy."
          styles={styles.warning}
        />
        <CommonButton
          text="Có, hủy ngay"
          onPress={onPressCancel}
          buttonStyles={styles.btCancel}
        />
      </View>
      <ModalSuccess
        onBackdropPress={onBackdropPress}
        isVisible={showModalSuccess}
        title="Đã hủy thành công"
        desc="Cám ơn quý khách đã sử dụng dịch vụ"
      />
    </View>
  )
}

export default CancelOrder
