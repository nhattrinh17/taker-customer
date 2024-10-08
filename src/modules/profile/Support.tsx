import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import Header from 'components/Header'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import {navigate} from 'navigation/utils/navigationUtils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  topTitle: {
    fontSize: Fonts.fontSize[18],
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  topSubTitle: {
    fontSize: Fonts.fontSize[16],
    color: Colors.main,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 20,
  },
  itemTitle: {
    fontSize: Fonts.fontSize[16],
    color: Colors.textPrimary,
  },
  bottom: {
    marginBottom: 24,
  },
  bottomBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 40,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  bottomBtnTitle: {
    fontSize: Fonts.fontSize[16],
    color: Colors.textPrimary,
    fontWeight: '500',
  },
})

const items = [
  {
    id: '1',
    title: 'Trung Tâm Hỗ Trợ Khách Hàng',
    url: 'https://taker.vn/cau-hoi-thuong-gap/',
  },
  {
    id: '2',
    title: 'Khảo Sát Đánh Giá Ý Kiến Khách Hàng',
    url: 'https://taker.vn/khao-sat-danh-gia-y-kien-khach-hang/',
  },
  {
    id: '3',
    title: 'Quy tắc ứng xử của Khách Hàng',
    url: 'https://taker.vn/quy-tac-ung-xu-cua-khach-hang/',
  },
  {
    id: '4',
    title: 'Hướng dẫn thanh toán VNPAY',
    url: 'https://help.taker.vn/guideNnpay.html',
  },
]

const renderItem = (items: Array<any>) => (
  <View>
    {items.map((item, index) => (
      <TouchableOpacity
        key={`${index}`}
        style={styles.itemContainer}
        onPress={() =>
          navigate('CommonWebView', {title: item.title, url: item.url})
        }>
        <CommonText text={item.title} styles={styles.itemTitle} />
        <Icons.ForwardToRight />
      </TouchableOpacity>
    ))}
  </View>
)

const Support = () => (
  <View style={styles.container}>
    <Header title="Trung tâm hỗ trợ" />
    <ScrollView style={styles.wrapper}>
      <CommonText text="Xin chào," styles={styles.topSubTitle} />
      <CommonText
        text="Bạn muốn hỗ trợ về vấn đề gì ?"
        styles={styles.topTitle}
      />
      {renderItem(items)}
    </ScrollView>
    <View style={styles.bottom}>
      <TouchableOpacity
        style={styles.bottomBtn}
        onPress={() => Linking.openURL('tel:1900252262')}>
        <CommonText
          text="Gọi nhân viên hỗ trợ"
          styles={styles.bottomBtnTitle}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomBtn}
        onPress={() =>
          Linking.openURL('https://www.facebook.com/takervietnam')
        }>
        <CommonText
          text="Chat với nhân viên hỗ trợ"
          styles={styles.bottomBtnTitle}
        />
      </TouchableOpacity>
    </View>
  </View>
)

export default Support
