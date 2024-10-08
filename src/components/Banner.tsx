import React, {useState, useEffect, useRef} from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  View,
} from 'react-native'
import {Images} from 'assets/Images'
import {navigate} from 'navigation/utils/navigationUtils'

const styles = StyleSheet.create({
  wrapperBanner: {
    flex: 1,
    marginTop: 20,
  },
})

interface BannerProps {
  type: string
}

const Banner = (props: BannerProps & {onPressContinue?: () => void}) => {
  const {type, onPressContinue} = props
  const [currentIndex, setCurrentIndex] = useState(0)
  const windowWidth = Dimensions.get('window').width
  const flatListRef = useRef()

  const banners = [
    {
      id: '1',
      src: Images.Banner1,
      action: () => {
        if (type === 'home') {
          navigate('RequestServeStack')
        } else {
          onPressContinue?.()
        }
      },
    },
    {
      id: '2',
      src: Images.Banner2,
      action: () =>
        navigate('CommonWebView', {
          title: 'Trở thành thợ giày công nghệ',
          url: 'https://help.taker.vn/recruitment.html',
        }),
    },
    {
      id: '3',
      src: Images.Banner3,
      action: () =>
        navigate('CommonWebView', {
          title: 'Quy tắc ứng xử',
          url: 'https://help.taker.vn/privacy/boquytac.html',
        }),
    },
    {
      id: '4',
      src: Images.Banner4,
      action: () =>
        navigate('CommonWebView', {
          title: 'Tiêu chuẩn đồng phục',
          url: 'https://help.taker.vn/tool.html',
        }),
    },
    {
      id: '5',
      src: Images.Banner5,
      action: () =>
        navigate('CommonWebView', {
          title: 'Quy trình chăm sóc',
          url: 'https://help.taker.vn/procedure.html',
        }),
    },
    {
      id: '6',
      src: Images.Banner6,
      action: () =>
        navigate('CommonWebView', {
          title: 'Dịch vụ đánh giày số 1',
          url: 'https://help.taker.vn/aboutus.html',
        }),
    },
    {
      id: '7',
      src: Images.Banner7,
      action: () =>
        navigate('CommonWebView', {
          title: 'Tại sao lựa chọn Taker',
          url: 'https://help.taker.vn/reason.html',
        }),
    },
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % banners.length)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [currentIndex])

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({animated: true, index: currentIndex})
    }
  }, [currentIndex])

  return (
    <View style={styles.wrapperBanner}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={{width: windowWidth - 32, height: (windowWidth - 32) / 2}}>
            <TouchableOpacity onPress={item.action}>
              <Image
                source={item.src}
                style={{width: '100%', height: '100%', borderRadius: 12}}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )}
        style={{borderRadius: 12}}
      />
    </View>
  )
}

export default Banner
