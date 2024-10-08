import React from 'react'
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import {Images} from 'assets/Images'
import {formatCurrency} from 'modules/requestServe/utils'
import {ItemInProgress} from 'services/src/typings'
import {StatusActivity, TypePayment} from '../typings'
import {navigate} from 'navigation/utils/navigationUtils'
import {renderStatusActivity} from 'utils/index'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rowAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  leftAddress: {
    marginLeft: 12,
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: Fonts.fontSize[12],
    fontWeight: '700',
    marginBottom: 2,
  },
  avatar: {
    width: 29,
    height: 29,
  },
  info: {
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 14,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  money: {
    fontWeight: '600',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  cancelOrder: {
    color: Colors.main,
  },
  wrapperLeftIcon: {
    width: 34,
    height: 34,
  },
  wrapperEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyLabel: {
    textAlign: 'center',
    marginTop: 16,
  },
})

interface Props {
  onCancelSuccess: () => void
  inProgress: ItemInProgress[]
}

const Processing = ({inProgress, onCancelSuccess}: Props) => {
  const havePerformer =
    inProgress?.[0]?.status === StatusActivity.INPROGRESS ||
    inProgress?.[0]?.status === StatusActivity.COMPLETED

  const onPressCancelOrder = () => {
    navigate('RequestServeStack', {
      screen: 'CancelOrder',
      params: {tripId: inProgress?.[0]?.id, onCancelSuccess},
    })
  }

  const renderTypePayment = (type: string) => {
    switch (type) {
      case TypePayment.OFFLINE_PAYMENT:
        return 'Tiền mặt'
      default:
        return ''
    }
  }

  const renderLocation = () => {
    return (
      <View style={styles.rowAddress}>
        <View style={styles.wrapperLeftIcon}>
          <Icons.Locate />
        </View>
        <View style={styles.leftAddress}>
          <CommonText text="Vị trí đặt" styles={styles.title} />
          <CommonText text={inProgress?.[0]?.address} />
        </View>
      </View>
    )
  }

  const renderPerform = () => {
    return (
      <View style={styles.rowAddress}>
        <View style={styles.wrapperLeftIcon}>
          <Image source={Images.Avatar} style={styles.avatar} />
        </View>
        <View style={styles.leftAddress}>
          <CommonText text="Người thực hiện" styles={styles.title} />
          <CommonText text="Nguyễn Hoàng Nam" />
        </View>
      </View>
    )
  }

  const renderStatus = () => {
    return (
      <View style={styles.rowAddress}>
        <View style={styles.wrapperLeftIcon}>
          <Icons.Status />
        </View>
        <View style={styles.leftAddress}>
          <CommonText text="Trạng thái" styles={styles.title} />
          <CommonText text={renderStatusActivity(inProgress?.[0]?.status)} />
        </View>
      </View>
    )
  }

  const renderInfoOrder = () => {
    return (
      <View>
        <CommonText text="Thông tin đơn hàng" styles={styles.info} />
        {inProgress?.[0]?.services?.map((item, _index) => {
          const price = item?.discountPrice ?? item?.price * item?.quantity
          return (
            <View style={styles.rowItem} key={_index}>
              <CommonText
                text={`${
                  +item?.quantity < 9 ? `0${item?.quantity}` : item?.quantity
                } ${item?.name}`}
              />
              <CommonText text={`${formatCurrency(price)} đ`} />
            </View>
          )
        })}
        <View style={styles.rowItem}>
          <CommonText text="Tổng tiền" styles={styles.money} />
          <CommonText
            text={`${formatCurrency(inProgress?.[0]?.totalPrice)} đ`}
            styles={styles.money}
          />
        </View>
        <View style={styles.line} />
        <View style={styles.rowItem}>
          <CommonText text="Thanh toán bằng" />
          <CommonText
            text={renderTypePayment(inProgress?.[0]?.paymentMethod)}
          />
        </View>
        {[StatusActivity.SEARCHING, StatusActivity.ACCEPTED]?.includes(
          inProgress?.[0]?.status,
        ) && (
          <TouchableOpacity onPress={onPressCancelOrder}>
            <CommonText text="Huỷ đơn hàng này" styles={styles.cancelOrder} />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const renderEmpty = () => {
    return (
      <View style={styles.wrapperEmpty}>
        <Icons.NoticeEmpty />
        <CommonText text="Chưa có hoạt động" styles={styles.emptyLabel} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {!inProgress?.length ? (
        renderEmpty()
      ) : (
        <>
          {renderLocation()}
          {havePerformer && renderPerform()}
          {renderStatus()}
          {renderInfoOrder()}
        </>
      )}
    </View>
  )
}

export default Processing
