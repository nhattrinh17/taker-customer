import React, {useState, useEffect} from 'react'
import {View, StyleSheet, ScrollView} from 'react-native'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import Header from 'components/Header'
import CommonTextField from 'components/CommonTextField'
import CommonButton from 'components/Button'
import {useUpdateInfomation} from 'services/src/profile'
import {useGetProfile} from 'services/src/profile'
import Modal from 'react-native-modal'
import {userStore} from 'state/user'
import {appStore} from 'state/app'
import CommonText from 'components/CommonText'
import {navigate} from 'navigation/utils/navigationUtils'
import Avatar from 'components/Avatar'
import {userInfo} from 'state/user/typings'
import ListBank from 'components/ListBank'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  bottom: {
    marginBottom: 24,
    backgroundColor: Colors.white,
    paddingVertical: 8,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
  },
  contentModal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 38,
    paddingBottom: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  success: {
    fontWeight: '600',
    marginTop: 8,
    color: Colors.textPrimary,
  },
})

const Infomation = () => {
  const setLoading = appStore(state => state.setLoading)
  const user = userStore(state => state.user)
  const setUser = userStore(state => state.setUser)
  const {trigger} = useUpdateInfomation()
  const {triggerGetProfile} = useGetProfile()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [fullName, setFullName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [bankName, setBankName] = useState<string>('')
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('')
  const [bankAccountName, setBankAccountName] = useState<string>('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await triggerGetProfile()
        setLoading(false)
        if (response?.data) {
          setFullName(response.data.fullName)
          setPhone(response.data.phone)
          setEmail(response.data.email)
          setBankName(response.data.bankName)
          setBankAccountNumber(response.data.accountNumber)
          setBankAccountName(response.data.accountName)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [triggerGetProfile])

  const onChangeFullName = (value: string) => {
    setFullName(value)
  }
  const onChangePhone = (value: string) => {
    setPhone(value)
  }
  const onChangeEmail = (value: string) => {
    setEmail(value)
  }
  const onChangeBankAccountNumber = (value: string) => {
    setBankAccountNumber(value)
  }
  const onChangeBankAccountName = (value: string) => {
    setBankAccountName(value)
  }

  const onBackdropPress = () => {
    setShowModal(false)
  }

  const onSave = async () => {
    try {
      setLoading(true)
      const response = await trigger({
        id: user.id,
        fullName,
        email,
        bankName,
        bankAccountNumber,
        bankAccountName,
      })
      setLoading(false)
      const newUser: userInfo = {
        ...user,
        fullName: fullName,
      }
      setUser(newUser)
      if (response.type === 'success') {
        setShowModal(true)
        setTimeout(() => {
          setShowModal(false)
          navigate('Profile')
        }, 2000)
      }
    } catch (err) {
      console.log('Error ==>', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Thông tin cá nhân" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <Avatar />
          <CommonTextField
            label="Họ tên"
            value={fullName}
            onChangeText={onChangeFullName}
          />
          <CommonTextField
            label="Số điện thoại"
            value={phone}
            onChangeText={onChangePhone}
            editable={false}
          />
          <CommonTextField
            label="Email"
            value={email}
            onChangeText={onChangeEmail}
          />
          <CommonTextField
            label="Số tài khoản"
            value={bankAccountNumber}
            onChangeText={onChangeBankAccountNumber}
          />
          <CommonTextField
            label="Tên chủ tài khoản"
            value={bankAccountName}
            onChangeText={onChangeBankAccountName}
          />
          <ListBank
            onSelectBankValue={value => setBankName(value)}
            bankName={bankName}
          />
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <CommonButton text="LƯU" onPress={onSave} />
      </View>
      <Modal
        isVisible={showModal}
        style={styles.modal}
        onBackdropPress={onBackdropPress}>
        <View style={styles.contentModal}>
          <Icons.Success />
          <CommonText text="Lưu thông tin thành công" styles={styles.success} />
        </View>
      </Modal>
    </View>
  )
}

export default Infomation
