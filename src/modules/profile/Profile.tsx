import React, {useState} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native'
import CommonText from 'components/CommonText'
import Avatar from 'components/Avatar'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import {navigate} from 'navigation/utils/navigationUtils'
import Modal from 'react-native-modal'
import {useLogout} from 'services/src/auth'
import {userStore} from 'state/user'
import {appStore} from 'state/app'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  top: {
    alignItems: 'center',
    marginTop: 40,
  },
  name: {
    marginTop: 6,
    fontSize: Fonts.fontSize[18],
    fontWeight: 'bold',
  },
  section: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionBox: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  label: {
    marginTop: 10,
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  textMenu: {
    fontSize: Fonts.fontSize[15],
    color: Colors.textPrimary,
    fontWeight: '500',
    marginLeft: 12,
  },
  itemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textDetail: {
    color: Colors.main,
    fontWeight: '700',
    marginLeft: 24,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 0,
    marginBottom: 0,
  },
  contentModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
    alignContent: 'center',
  },
  labelModal: {
    marginTop: 8,
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[15],
  },
  itemModal: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  textLogout: {
    color: Colors.red,
    fontWeight: '600',
    fontSize: Fonts.fontSize[15],
  },
  itemCancel: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 30,
  },
  connectGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  connectBtn: {
    marginLeft: 10,
  },

  containerWarning: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 16,
    borderRadius: 12,
  },
  labelWarning: {
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[13],
  },
})

const Profile = () => {
  const {top} = useSafeAreaInsets()
  const setLoading = appStore(state => state.setLoading)
  const [showModal, setShowModal] = useState<boolean>(false)
  const {triggerLogout} = useLogout()
  const setToken = userStore(state => state.setToken)
  const setUser = userStore(state => state.setUser)
  const user = userStore(state => state.user)

  const logout = async () => {
    try {
      setLoading(true)
      const respone = await triggerLogout()
      if (respone.type === 'success') {
        setShowModal(false)
        setToken('')
        setUser({})
      }
    } catch (err) {
      console.log('Error ==>', err)
    } finally {
      setLoading(false)
    }
  }

  const onBackdropPress = () => {
    setShowModal(false)
  }

  const onPressTouch = () => {
    console.log('onPressTouch')
  }
  const actionsInfo = [
    {
      icon: <Icons.PersonWallet />,
      title: 'Ví Taker',
      onPress: () => navigate('Wallet'),
    },
    {
      icon: <Icons.PersonLink />,
      title: 'Giới thiệu bạn bè',
      onPress: () => navigate('Referral'),
    },
    {
      icon: <Icons.PersonInfo />,
      title: 'Thông tin cá nhân',
      onPress: () => navigate('Infomation'),
    },
  ]

  const socialLinks = [
    {url: 'https://www.youtube.com/@Takervietnam', icon: <Icons.Youtube />},
    {
      url: 'https://www.tiktok.com/@taker.viet.nam?_t=8mt1qxXJvtv&_r=1',
      icon: <Icons.Tiktok />,
    },
    {
      url: 'https://www.facebook.com/takervietnam',
      icon: <Icons.Facebook />,
    },
    {url: 'https://taker.vn', icon: <Icons.Web />},
  ]
  const actionsSupport = [
    {
      icon: <Icons.PersonSuport />,
      title: 'Trung tâm hỗ trợ',
      onPress: () => navigate('Support'),
    },
    {
      icon: <Icons.Privacy />,
      title: 'Điều khoản và chính sách',
      onPress: () => navigate('Privacy'),
    },
    {
      icon: <Icons.PersonPhone />,
      title: 'Hỗ trợ khách hàng',
      right: '1900252262',
      onPress: () => Linking.openURL('tel:1900252262'),
    },
    {
      icon: <Icons.WebPerson />,
      title: 'Kết nối',
      right: (
        <View style={styles.connectGroup}>
          {socialLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.connectBtn}
              onPress={() => Linking.openURL(link.url)}>
              {link.icon}
            </TouchableOpacity>
          ))}
        </View>
      ),
      onPress: onPressTouch,
    },
  ]

  const actionsAccount = [
    {
      icon: <Icons.PersonKey />,
      title: 'Đổi mật khẩu',
      onPress: () => navigate('ChangePassword'),
    },
    {
      icon: <Icons.PersonSetting />,
      title: 'Cài đặt tài khoản',
      onPress: () => navigate('AccountSetting'),
    },
    {
      icon: <Icons.PersonLogout />,
      title: 'Đăng xuất',
      onPress: () => setShowModal(true),
    },
  ]

  const renderActions = (items: Array<any>) => (
    <View>
      {items.map((item, index) => (
        <TouchableOpacity
          key={`${index}`}
          style={styles.itemMenu}
          onPress={item.onPress}>
          <View style={styles.itemLeft}>
            {item?.icon}
            <CommonText text={item.title} styles={styles.textMenu} />
          </View>
          <TouchableOpacity>
            <CommonText text={item?.right} styles={styles.textDetail} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{...styles.wrapper, marginTop: top}}>
        <View style={styles.top}>
          <Avatar />
          <CommonText text={user?.fullName ?? ''} styles={styles.name} />
        </View>

        <View style={styles.containerWarning}>
          <CommonText
            text="Kính gửi quý khách, Taker không chịu trách nhiệm về rủi ro tài sản ngoài ứng dụng. Vui lòng chỉ đặt dịch vụ qua ứng dụng Taker."
            styles={styles.labelWarning}
          />
        </View>

        <View style={styles.section}>
          <CommonText text="Thông tin" styles={styles.label} />
          <View style={styles.sectionBox}>{renderActions(actionsInfo)}</View>
        </View>

        <View style={styles.section}>
          <CommonText text="Hỗ trợ & sử dụng" styles={styles.label} />
          <View style={styles.sectionBox}>{renderActions(actionsSupport)}</View>
        </View>

        <View style={styles.section}>
          <CommonText text="Tài khoản" styles={styles.label} />
          <View style={styles.sectionBox}>{renderActions(actionsAccount)}</View>
        </View>
      </View>

      <Modal
        isVisible={showModal}
        style={styles.modal}
        onBackdropPress={onBackdropPress}>
        <View style={styles.contentModal}>
          <View style={styles.itemModal}>
            <CommonText
              text="Bạn có chắc chắn muốn đăng xuất ?"
              styles={styles.labelModal}
            />
          </View>
          <TouchableOpacity style={styles.itemModal} onPress={() => logout()}>
            <CommonText text="Đăng xuất" styles={styles.textLogout} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemCancel}
            onPress={() => setShowModal(false)}>
            <CommonText text="Huỷ" styles={styles.labelModal} />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default Profile
