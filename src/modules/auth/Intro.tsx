import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import CommonText from 'components/CommonText'
import Banner from 'components/Banner'
import {navigate} from 'navigation/utils/navigationUtils'
import Modal from 'react-native-modal'
import ModalWarning from 'components/ModalWarning'
import Post from 'components/Post'

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.main,
  },
  mainContainer: {
    flex: 1,
    zIndex: 1,
    position: 'relative',
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flex: 2,
    backgroundColor: Colors.main,
    paddingLeft: 16,
    paddingBottom: 48,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
  },
  slogan: {
    color: Colors.white,
    fontSize: 16,
    marginTop: 4,
    paddingLeft: 4,
  },
  main: {
    flex: 5,
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
  },
  top: {
    backgroundColor: Colors.white,
    marginTop: -40,
    width: '100%',
    height: 64,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.border,
    borderColor: Colors.border,
    borderWidth: 1,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: {
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[15],
    fontWeight: '400',
  },
  topLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[14],
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleModal: {
    marginTop: 8,
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[18],
    fontWeight: '600',
  },
  labelModal: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[15],
  },
  bottomRegister: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#22313F',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  wrapperRegister: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  btnRegister: {
    flex: 1,
    height: 48,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 8,
    backgroundColor: '#ECFAFC',
  },
  textRegister: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[16],
    fontWeight: '600',
  },
  btnLogin: {
    flex: 1,
    height: 48,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 8,
    backgroundColor: Colors.main,
  },
  textLogin: {
    color: Colors.white,
    fontSize: Fonts.fontSize[16],
    fontWeight: '600',
  },
  // Modal Warning
  modalWarning: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  contentModallWarning: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  iconClose: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  headerWarning: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleModalWarning: {
    color: Colors.red,
    fontSize: Fonts.fontSize[18],
    fontWeight: '600',
    marginLeft: 6,
    marginTop: 2,
  },
  labelModalWarning: {
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[14],
    marginTop: 10,
  },
  // End Modal Warning

  // 4 Functions menu
  wrapperFuntions: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 16,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 6,
  },
  // End 4 Functions menu
})

const Intro = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showModalWarning, setShowModalWarning] = useState<boolean>(true)

  const onBackdropPress = () => {
    setShowModal(false)
  }
  const onPressContinue = () => {
    setShowModal(true)
  }

  const onCloseModalWarning = () => setShowModalWarning(false)

  const actions = [
    {
      icon: <Icons.Shoe />,
      title: 'Gọi phục vụ',
      onPress: () => onPressContinue(),
    },
    {
      icon: <Icons.TimeHome />,
      title: 'Đặt lịch',
      onPress: () => onPressContinue(),
    },
    {
      icon: <Icons.Bike />,
      title: 'Taker Bike',
      onPress: () => onPressContinue(),
    },
    {
      icon: <Icons.CleanHome />,
      title: 'Dọn nhà',
      onPress: () => onPressContinue(),
    },
    {
      icon: <Icons.Store />,
      title: 'Cửa hàng',
      onPress: () => onPressContinue(),
    },
  ]
  const renderActions = () => (
    <View style={styles.wrapperFuntions}>
      {actions.map((item, index) => (
        <TouchableOpacity
          key={`${index}`}
          style={styles.item}
          onPress={item.onPress}>
          {item?.icon}
          <CommonText text={item.title} styles={styles.label} />
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderRegister = () => (
    <View style={styles.wrapperRegister}>
      <TouchableOpacity
        style={styles.btnRegister}
        onPress={() => {
          setShowModal(false)
          navigate('Phone')
        }}>
        <CommonText text="Đăng ký" styles={styles.textRegister} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnLogin}
        onPress={() => {
          setShowModal(false)
          navigate('Phone')
        }}>
        <CommonText text="Đăng nhập" styles={styles.textLogin} />
      </TouchableOpacity>
    </View>
  )

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Icons.LogoText />
        <CommonText text="VUA ĐÁNH GIÀY CÔNG NGHỆ" styles={styles.slogan} />
      </View>
    )
  }

  // const renderModalWarning = () => {
  //   return (
  //     <ModalWarning
  //       title="Taker không có nghĩa vụ đảm bảo rủi ro về tài sản của quý khách khi sử dụng dịch vụ ngoài ứng dụng Taker."
  //       description="Taker khuyến cáo quý khách chỉ sử dụng dịch vụ đặt qua ứng dụng."
  //       showModalWarning={showModalWarning}
  //       onClose={onCloseModalWarning}
  //     />
  //   )
  // }

  const renderModalLogin = () => {
    return (
      <Modal
        isVisible={showModal}
        style={styles.modal}
        onBackdropPress={onBackdropPress}>
        <View style={styles.contentModal}>
          <CommonText text="Sử dụng Taker ngay!" styles={styles.titleModal} />
          <CommonText
            text="Chỉ sau một phút, bạn có thể truy cập vào các dịch vụ của chúng tôi, nhận ưu đãi và hơn thế nữa"
            styles={styles.labelModal}
          />
          {renderRegister()}
        </View>
      </Modal>
    )
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.safeArea} />
        <View style={styles.mainContainer}>
          {renderHeader()}
          <View style={styles.main}>
            <View style={styles.top}>
              <View>
                <CommonText
                  text="Bạn chưa có tài khoản Taker ?"
                  styles={styles.topTitle}
                />
                <CommonText
                  text="Đăng ký để hưởng các tiện ích!"
                  styles={styles.topLabel}
                />
              </View>
              <TouchableOpacity onPress={() => navigate('Phone')}>
                <Icons.ArrowRight />
              </TouchableOpacity>
            </View>

            {renderActions()}
            <Banner onPressContinue={onPressContinue} type={''} />
            <Post onPressContinue={onPressContinue} type={''} />
            {renderModalLogin()}
            {/* {renderModalWarning()} */}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomRegister}>{renderRegister()}</View>
    </>
  )
}

export default Intro
