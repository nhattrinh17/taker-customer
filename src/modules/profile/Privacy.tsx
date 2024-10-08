import React from 'react'
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
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
    width: '94%',
  },
})

const items = [
  {
    id: '1',
    title: 'Bộ quy tắc ứng xử của TAKER',
    url: 'https://help.taker.vn/privacy/boquytac.html',
  },
  {
    id: '2',
    title: 'Chính sách Bảo mật, điều khoản sử dụng',
    url: 'https://help.taker.vn/privacy/chinhsachbaomat.html',
  },
  {
    id: '3',
    title: 'Quy định Hoạt Động của Thợ Giày',
    url: 'https://help.taker.vn/privacy/quydinhthogiay.html',
  },
  {
    id: '4',
    title: 'Quy trình sử dụng dịch vụ - Giao nhận',
    url: 'https://help.taker.vn/privacy/quydinhdichvu.html',
  },
  {
    id: '5',
    title: 'Chính Sách Hoàn Hủy Dịch Vụ',
    url: 'https://help.taker.vn/privacy/chinhsachhoahuy.html',
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

const Privacy = () => (
  <View style={styles.container}>
    <Header title="Điều khoản và chính sách" />
    <ScrollView style={styles.wrapper}>{renderItem(items)}</ScrollView>
  </View>
)

export default Privacy
