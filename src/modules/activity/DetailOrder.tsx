/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {View, StyleSheet, ScrollView} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import Header from 'components/Header'
import {
  formatCurrency,
  renderStatusActivity,
  renderTypePayment,
} from 'utils/index'
import {Icons} from 'assets/icons'
import FastImage from 'react-native-fast-image'
import {s3Url} from 'services/src/APIConfig'
import {Fonts} from 'assets/Fonts'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'
import {DetailOrder} from 'services/src/typings'
import {StatusActivity} from './typings'
import {isEmpty} from 'lodash'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingBottom: 30,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  textPlaceholder: {
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  mt12: {
    marginTop: 12,
  },
  ph22: {
    paddingHorizontal: 22,
  },
  rowItemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  total: {
    fontWeight: '600',
  },
  line: {
    backgroundColor: Colors.gallery,
    width: '100%',
    height: 6,
    marginTop: 20,
    marginBottom: 20,
  },
  rowStar: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 10,
  },
  star: {
    marginHorizontal: 2,
  },
  rowItemRate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholder: {
    color: Colors.textSecondary,
    marginRight: 24,
  },
  rowItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageOrder: {
    width: 74,
    height: 74,
    borderRadius: 12,
    marginRight: 12,
  },
  mt16: {
    marginTop: 16,
  },
  wrapperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  phoneNumber: {
    fontSize: Fonts.fontSize[12],
    marginTop: 4,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
  },
  address: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    flexShrink: 1,
  },
  position: {
    fontSize: Fonts.fontSize[12],
    fontWeight: '700',
  },
  distance: {
    color: Colors.main,
    fontWeight: '700',
  },
  wrapperInformation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mb14: {
    marginBottom: 14,
  },
  rate: {
    flexShrink: 1,
  },
  flex1: {
    flex: 1,
  },
  ml10: {
    marginLeft: 10,
  },
  statusPayment: {
    color: Colors.main,
  },
  status: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    textAlign: 'center',
    marginBottom: 12,
  },
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'DetailOrder'>
}

const DetailOrderScreen = ({route}: Props) => {
  const item: DetailOrder = route?.params?.itemDetail
  const status: string = route?.params?.status
  const totalPrice = item?.totalPrice ?? 0

  const renderStatus = () => {
    return (
      <CommonText
        text={renderStatusActivity(status) ?? ''}
        styles={{
          ...styles.status,
          color: status === StatusActivity.COMPLETED ? Colors.main : Colors.red,
        }}
      />
    )
  }

  const renderRate = () => {
    const rating = item?.rating?.rating
    return (
      <View style={styles.ph22}>
        <View style={[styles.rowItemRate]}>
          <CommonText text="Đánh giá của bạn" />
          <View style={styles.rowStar}>
            {[1, 2, 3, 4, 5].map((itemStar, index) => {
              return (
                <View key={index} style={styles.star}>
                  {rating !== null && +rating >= itemStar ? (
                    <Icons.StarFull />
                  ) : (
                    <Icons.Star />
                  )}
                </View>
              )
            })}
          </View>
        </View>

        {item?.rating?.comment !== '' && (
          <View
            style={{
              ...styles.rowItem,
              marginBottom: 16,
              marginTop: 14,
            }}>
            <CommonText text="Nhận xét:" styles={styles.placeholder} />
            <CommonText text={item?.rating?.comment} styles={styles.rate} />
          </View>
        )}

        {item?.receiveImages?.length > 0 && (
          <View style={styles.rowItem}>
            <CommonText
              text="Ảnh trước:"
              styles={{...styles.placeholder, width: 70}}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item?.receiveImages?.map((itemImage, index) => (
                <FastImage
                  key={index}
                  style={styles.imageOrder}
                  source={{
                    uri: s3Url + itemImage,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {item?.completeImages?.length > 0 && (
          <View style={[styles.rowItem, {marginBottom: 0}]}>
            <CommonText
              text="Ảnh sau:"
              styles={{...styles.placeholder, width: 70}}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item?.completeImages?.map((itemImage, index) => (
                <FastImage
                  key={index}
                  style={styles.imageOrder}
                  source={{
                    uri: s3Url + itemImage,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    )
  }

  const renderInfoOrder = () => {
    return (
      <View style={styles.ph22}>
        <CommonText text="Thông tin đơn hàng" styles={styles.textPlaceholder} />
        {item?.services?.map((item, index) => (
          <View key={index} style={styles.rowItemMenu}>
            <CommonText text={`${item.quantity} ${item.name}`} />
            <CommonText
              text={`${formatCurrency(item?.discountPrice ?? item?.price)} đ`}
            />
          </View>
        ))}
        <View style={styles.rowItemMenu}>
          <CommonText text="Tổng tiền" styles={styles.total} />
          <CommonText
            text={formatCurrency(totalPrice) + ' đ'}
            styles={styles.total}
          />
        </View>
        <CommonText
          text={renderTypePayment(item?.paymentMethod)}
          styles={styles.statusPayment}
        />
      </View>
    )
  }

  const renderInformationCustomer = () => {
    return (
      <View style={styles.ph22}>
        <CommonText
          text="Thông tin thợ thực hiện"
          styles={{...styles.textPlaceholder, ...styles.mb14}}
        />
        <View style={styles.wrapperInfo}>
          <FastImage
            style={styles.avatar}
            source={{
              uri: s3Url + item?.shoemaker?.avatar,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.wrapperInformation}>
            <View>
              <CommonText text={item?.shoemaker?.name} />
              <CommonText
                text={item?.shoemaker?.phone}
                styles={styles.phoneNumber}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header title={`ĐƠN HÀNG #${item?.orderId}`} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.content}>
        <View style={styles.wrapper}>
          {renderStatus()}

          {status === StatusActivity.COMPLETED && !isEmpty(item?.rating) && (
            <>
              <View style={styles.line} />
              {renderRate()}
              <View style={styles.line} />
            </>
          )}
          {renderInfoOrder()}
          <View style={styles.line} />
          {!isEmpty(item?.shoemaker) && renderInformationCustomer()}
        </View>
      </ScrollView>
    </View>
  )
}

export default DetailOrderScreen
