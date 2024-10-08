import React, {useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  Share,
  Platform,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import Header from 'components/Header'
import {Fonts} from 'assets/Fonts'
import CommonButton from 'components/Button'
import {useGetReferral} from 'services/src/profile'
import {appStore} from 'state/app'
import {userStore} from 'state/user'
import moment from 'moment'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  bottom: {
    marginBottom: 24,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.main,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
  },
  labelBox: {
    color: Colors.white,
    fontSize: Fonts.fontSize[14],
    fontWeight: 'bold',
  },
  amount: {
    flexDirection: 'row',
  },
  unit: {
    color: Colors.white,
    marginTop: 9,
    marginLeft: 2,
  },
  labelAmount: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  codeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    color: Colors.textSecondary,
  },
  bodyCode: {
    fontWeight: 'bold',
    fontSize: Fonts.fontSize[16],
  },
  title: {
    fontWeight: 'bold',
    fontSize: Fonts.fontSize[16],
    color: Colors.textSecondary,
  },
  lists: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  listsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  listsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 16,
  },
  body: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textPrimary,
  },
  flatList: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    flexGrow: 1,
    paddingHorizontal: 16,
  },
})

const TAKE = 500

const Referral = () => {
  const {setLoading, loading} = appStore(state => state)
  const user = userStore(state => state.user)
  const {triggerGetReferral} = useGetReferral()
  const [referrals, setReferrals] = useState<{
    data: []
    enabledLoadMore: boolean
  }>({data: [], enabledLoadMore: true})

  const getReferral = async (params: {
    take: number
    skip: number
    isFirstTime: boolean
  }) => {
    if (!referrals?.enabledLoadMore || loading) {
      return
    }
    setLoading(true)
    try {
      setLoading(true)
      const response = await triggerGetReferral({
        take: params.take,
        skip: params.skip,
      })
      if (response?.data?.length) {
        setReferrals({
          data: params?.isFirstTime
            ? response?.data
            : [...referrals.data, ...response?.data],
          enabledLoadMore: response?.data?.length < TAKE ? false : true,
        })
      } else {
        setReferrals({...referrals, enabledLoadMore: false})
      }
      setLoading(false)
      console.log('referrals', referrals)
    } catch (err) {
      console.error('Error fetching Referral:', err)
    }
  }

  const onLoadMore = () =>
    getReferral({
      take: TAKE,
      skip: referrals.data.length,
      isFirstTime: false,
    })

  useEffect(() => {
    getReferral({take: TAKE, skip: 0, isFirstTime: true})
  }, [triggerGetReferral])

  const shareAppLink = () => {
    const urlAndroid =
      'https://play.google.com/store/apps/details?id=com.taker.customer'
    const urlIOS = 'https://apps.apple.com/vn/app/taker/id6478909775'
    const url = Platform.OS === 'ios' ? urlIOS : urlAndroid
    Share.share({
      message: `Bạn đã sẵn sàng nhận ngay voucher 200,000 VND từ Taker chưa? Chỉ cần giới thiệu 15 người bạn tải và đăng ký ứng dụng Taker, voucher hấp dẫn sẽ ngay lập tức thuộc về bạn!
      Cách thức tham gia: 1. Tải ngay ứng dụng Taker trên App Store và Google Play. 2 .Sử dụng mã giới thiệu  của bạn để mời 10 người bạn tải và đăng ký app. 3. Nhận ngay voucher 200,000 VND sau khi đủ 15 lượt giới thiệu thành công.
       ${url}`,
      url: url,
      title: 'GIỚI THIỆU BẠN BÈ - NHẬN VOUCHER 200,000 VND',
    })
  }

  const renderItem = ({item}) => {
    return (
      <View style={styles.listsItem}>
        <CommonText text={item?.phone} styles={styles.body} />
        <CommonText
          text={moment(item?.createdAt).format('HH:mm DD/MM/YYYY')}
          styles={styles.label}
        />
      </View>
    )
  }

  const renderEmptyList = () => (
    <View /> // Empty component
  )

  const renderKeyExtractor = item => item?.phone

  return (
    <View style={styles.container}>
      <Header title="Giới thiệu bạn bè" />
      <ScrollView style={styles.wrapper}>
        <View style={styles.box}>
          <View>
            <CommonText text="Đã giới thiệu" styles={styles.labelBox} />
            <View style={styles.amount}>
              <CommonText
                text={referrals?.data?.length?.toString() ?? '0'}
                styles={styles.labelAmount}
              />
              <CommonText text=" bạn bè" styles={styles.unit} />
            </View>
          </View>
          <Icons.Gift />
        </View>

        <View style={styles.codeWrapper}>
          <View>
            <CommonText text="Mã giới thiệu của bạn" styles={styles.label} />
            <CommonText text={user.phone} styles={styles.bodyCode} />
          </View>
          <TouchableOpacity onPress={() => Clipboard.setString(user.phone)}>
            <Icons.CopyReferral />
          </TouchableOpacity>
        </View>
        <FlatList
          data={referrals.data}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          // onEndReached={onLoadMore}
          contentContainerStyle={styles.contentContainer}
          onEndReachedThreshold={0.1}
          keyExtractor={renderKeyExtractor}
          ListEmptyComponent={renderEmptyList}
        />
      </ScrollView>
      <View style={styles.bottom}>
        <CommonButton text="CHIA SẺ" onPress={() => shareAppLink()} />
      </View>
    </View>
  )
}

export default Referral
