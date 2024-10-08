import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  View,
  FlatList,
} from 'react-native'
import {Images} from 'assets/Images'
import {navigate} from 'navigation/utils/navigationUtils'
import CommonText from './CommonText'
import {Fonts} from 'assets/Fonts'

const windowWidth = Dimensions.get('window').width
const styles = StyleSheet.create({
  wrapperBanner: {
    marginTop: 30,
    flex: 1,
  },
  titleSection: {
    marginBottom: 10,
    fontFamily: Fonts.fontFamily.AvertaSemiBold,
    fontWeight: '600',
    fontSize: Fonts.fontSize[20],
  },
  containerFlatlist: {
    marginRight: -8,
    marginLeft: -8,
  },
  containerItem: {
    width: (windowWidth - 50) / 2,
    height: (windowWidth + 80) / 2,
    marginRight: 8,
    marginLeft: 8,
  },
  imageBanner: {
    width: '100%',
    height: '70%',
    borderRadius: 8,
  },
  containerTitle: {
    height: '30%',
  },
})

interface PostProps {
  type: string
}

const Post = (props: PostProps & {onPressContinue?: () => void}) => {
  const {type, onPressContinue} = props

  const section1 = [
    {
      id: '1',
      src: Images.Post1,
      title: 'Dịch vụ đánh giày công nghệ số 1 tại Việt Nam tiện lợi - nhanh chóng',
      action: () =>
        navigate('CommonWebView', {
          title: 'Dịch vụ đánh giày công nghệ',
          url: 'https://help.taker.vn/aboutus.html',
        }),
    },
    {
      id: '2',
      src: Images.Post2,
      title: 'Click ngay trải nghiệm và săn Voucher từ Taker nào',
      action: () =>
        navigate('CommonWebView', {
          title: 'Trải nghiệm và săn Voucher',
          url: 'https://help.taker.vn/sale.html',
        }),
    },
    {
      id: '3',
      src: Images.Post3,
      title: 'Taker mang đến trải nghiệm đầy thú vị .. Cùng tìm hiểu nào',
      action: () =>
        navigate('CommonWebView', {
          title: 'Taker mang đến trải nghiệm',
          url: 'https://help.taker.vn/reason.html',
        }),
    },
    {
      id: '4',
      src: Images.Post4,
      title: 'Chia sẻ mã giới thiệu nhận ưu đãi lớn từ Taker',
      action: () => {
        if (type === 'home') {
          navigate('Referral')
        } else {
          onPressContinue?.()
        }
      },
    },
  ]

  const section2 = [
    {
      id: '5',
      src: Images.Post5,
      title: 'Taker xây dựng văn hóa ứng xử thân thiện chuyên nghiệp',
      action: () =>
        navigate('CommonWebView', {
          title: 'Taker xây dựng văn hóa',
          url: 'https://help.taker.vn/privacy/boquytac.html',
        }),
    },
    {
      id: '6',
      src: Images.Post6,
      title: 'Taker hướng đến sự chuyên nghiệp hình ảnh thợ giày công nghệ',
      action: () =>
        navigate('CommonWebView', {
          title: 'Dịch vụ đánh giày công nghệ',
          url: 'https://help.taker.vn/tool.html',
        }),
    },
  ]

  const section3 = [
    {
      id: '7',
      src: Images.Post7,
      title: 'Cùng tham gia trở thành thợ giày công nghệ đối tác của taker',
      action: () =>
        navigate('CommonWebView', {
          title: 'Trở thành thợ giày công nghệ',
          url: 'https://help.taker.vn/recruitment.html',
        }),
    },
    {
      id: '8',
      src: Images.Post8,
      title: 'Khám phá quy trình 9 bước vệ sinh giày công nghệ',
      action: () =>
        navigate('CommonWebView', {
          title: 'Quy trình 9 bước',
          url: 'https://help.taker.vn/procedure.html',
        }),
    },
  ]

  const section4 = [
    {
      id: '9',
      src: Images.Post9,
      title: 'Lướt nhanh chạm nhẹ thanh toán cực khỏe cùng VNPAY',
      action: () => {
        if (type === 'home') {
          navigate('RequestServeStack')
        } else {
          onPressContinue?.()
        }
      },
    },
  ]

  return (
    <View style={styles.wrapperBanner}>
      <CommonText
        text="Trung tâm tin tức & khuyến mại"
        styles={styles.titleSection}
      />
      <FlatList
        data={section1}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.containerFlatlist}
        renderItem={({item}) => (
          <View style={styles.containerItem}>
            <TouchableOpacity onPress={item.action}>
              <Image
                source={item.src}
                style={styles.imageBanner}
                resizeMode="cover"
              />
              <View style={styles.containerTitle}>
                <CommonText text={item.title} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      <CommonText text="Quy tắc & ứng xử Taker" styles={styles.titleSection} />
      <FlatList
        data={section2}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.containerFlatlist}
        renderItem={({item}) => (
          <View style={styles.containerItem}>
            <TouchableOpacity onPress={item.action}>
              <Image
                source={item.src}
                style={styles.imageBanner}
                resizeMode="cover"
              />
              <View style={styles.containerTitle}>
                <CommonText text={item.title} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      <CommonText
        text="Quy trình chăm sóc và tuyển dụng"
        styles={styles.titleSection}
      />
      <FlatList
        data={section3}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.containerFlatlist}
        renderItem={({item}) => (
          <View style={styles.containerItem}>
            <TouchableOpacity onPress={item.action}>
              <Image
                source={item.src}
                style={styles.imageBanner}
                resizeMode="cover"
              />
              <View style={styles.containerTitle}>
                <CommonText text={item.title} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      <CommonText
        text="Thanh toán tiện lợi một chạm"
        styles={styles.titleSection}
      />
      <FlatList
        data={section4}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.containerFlatlist}
        renderItem={({item}) => (
          <View style={styles.containerItem}>
            <TouchableOpacity onPress={item.action}>
              <Image
                source={item.src}
                style={styles.imageBanner}
                resizeMode="cover"
              />
              <View style={styles.containerTitle}>
                <CommonText text={item.title} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

export default Post
