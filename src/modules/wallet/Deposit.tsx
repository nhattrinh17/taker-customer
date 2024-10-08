import React, {useEffect, useRef, useState} from 'react'
import {
  Dimensions,
  NativeEventEmitter,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {useDeposit} from 'services/src/profile'
import VnpayMerchant, {
  VnpayMerchantModule,
} from 'src/lib/react-native-vnpay-merchant'
import Header from 'components/Header'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {formatCurrency, showMessageError} from 'utils/index'
import CommonButton from 'components/Button'
import {SocketEvents, SocketService} from 'socketIO'
const eventEmitter = new NativeEventEmitter(VnpayMerchantModule)
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'
import {Icons} from 'assets/icons'
import {goBack} from 'navigation/utils/navigationUtils'
import {appStore} from 'state/app'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    marginTop: 32,
  },
  textAmount: {
    marginBottom: 14,
  },
  rowAmount: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemAmount: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    width: Dimensions.get('screen').width / 3 - 24,
    paddingVertical: 16,
    marginBottom: 18,
  },
  itemAmountSelected: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    color: Colors.main,
  },
  line: {
    height: 6,
    width: Dimensions.get('screen').width,
    backgroundColor: Colors.border,
    marginTop: 2,
  },
  input: {
    fontWeight: '400',
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontSize: Fonts.fontSize[14],
    color: Colors.textPrimary,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
    marginTop: 18,
  },
  inputValue: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontSize: Fonts.fontSize[18],
    color: Colors.main,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
    marginTop: 18,
  },
  wrapperInputAmount: {
    marginTop: 20,
    marginBottom: 26,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  total: {
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontWeight: '700',
  },
  totalValue: {
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontWeight: '700',
    color: Colors.main,
  },
  btnDeposit: {
    marginBottom: 30,
  },
  pdHZ20: {
    paddingHorizontal: 20,
  },
  mt20: {
    marginTop: 20,
  },
  actionSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  status: {
    marginTop: 22,
    fontWeight: '700',
    fontSize: Fonts.fontSize[18],
    marginBottom: 6,
  },
  desc: {
    textAlign: 'center',
  },
  wrapper: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: 60,
  },
  error: {
    fontSize: Fonts.fontSize[12],
    color: Colors.red,
    marginTop: 8,
  },
})

const amounts = [100000, 200000, 300000, 500000, 1000000, 2000000]
const MINIMUM = 5000
const MAXIMUM = 1000000000

interface Transaction {
  amount: number
  status: string
  transactionId: string
}

type TransactionStatusMessages = {
  [key: number]: string
}

const transactionStatusMessages: TransactionStatusMessages = {
  0: 'Giao dịch thành công',
  7: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  9: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
  10: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  11: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
  12: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
  13: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
  24: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
  51: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
  65: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
  75: 'Ngân hàng thanh toán đang bảo trì.',
  79: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
  99: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
}
interface Props {
  route: RouteProp<RootNavigatorParamList, 'Deposit'>
}
const Deposit = ({route}: Props) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const {triggerDeposit} = useDeposit()
  const socketService = SocketService.getInstance()
  const setLoading = appStore(state => state?.setLoading)
  const [amountSelected, setAmountSelected] = useState<number>()
  const [value, setValue] = useState<string>('')
  const fee = 0
  const [transaction, setTransaction] = useState<Transaction>()
  const [error, setError] = useState('')

  const onDeposit = async () => {
    if (+value < MINIMUM || +value >= MAXIMUM) {
      setError('Số tiền hợp lệ từ 5.000 đến dưới 1 tỷ đồng')
      return
    }
    setLoading(true)
    try {
      const response = await triggerDeposit({amount: +value})
      if (response?.data) {
        eventEmitter.addListener('PaymentBack', e => {
          console.log('Sdk back!')
          if (e) {
            console.log('e.resultCode = ' + e.resultCode)
            switch (
              e.resultCode
              //resultCode == -1
              //vi: Người dùng nhấn back từ sdk để quay lại
              //en: back from sdk (user press back in button title or button back in hardware android)

              //resultCode == 10
              //vi: Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...) lúc này app tích hợp sẽ cần lưu lại cái PNR, khi nào người dùng mở lại app tích hợp thì sẽ gọi kiểm tra trạng thái thanh toán của PNR Đó xem đã thanh toán hay chưa.
              //en: user select app to payment (Mobile banking, wallet ...) you need save your PNR code. because we don't know when app banking payment successfully. so when user re-open your app. you need call api check your PNR code (is paid or unpaid). PNR: it's vnp_TxnRef. Reference code of transaction at Merchant system

              //resultCode == 99
              //vi: Người dùng nhấn back từ trang thanh toán thành công khi thanh toán qua thẻ khi gọi đến http://sdk.merchantbackapp
              //en: back from button (button: done, ...) in the webview when payment success. (incase payment with card, atm card, visa ...)

              //resultCode == 98
              //vi: giao dịch thanh toán bị failed
              //en: payment failed

              //resultCode == 97
              //vi: thanh toán thành công trên webview
              //en: payment success
            ) {
            }
          }
          eventEmitter.removeAllListeners('PaymentBack')
        })

        VnpayMerchant.show({
          isSandbox: false,
          scheme: 'taker',
          title: 'Lựa chọn phương thức thanh toán',
          titleColor: '#333333',
          beginColor: '#ffffff',
          endColor: '#ffffff',
          tmn_code: 'TAKER001',
          paymentUrl: response?.data,
        })
      }
    } catch (err) {
      showMessageError('Có lỗi xảy ra, vui lòng thử lại sau')
      console.log('errio=>>>', err)
    } finally {
      setLoading(false)
    }
  }

  const onSelectAmount = (amount: number) => () => {
    setAmountSelected(amount)
    setValue(amount.toString())
  }

  const onCloseActionSheet = () => {
    actionSheetRef?.current?.hide()
    route?.params?.callback?.()
    goBack()
  }

  const onChangeText = (text: string) => {
    if (error !== '') {
      setError('')
    }
    setValue(text?.replace(/\./g, ''))
  }

  useEffect(() => {
    socketService.once(SocketEvents.PAYMENT_STATUS, res => {
      console.log('PAYMENT_STATUS ===>', res)
      const response = res as unknown as Transaction
      setTransaction(response)
      actionSheetRef?.current?.show()
    })
  }, [])

  const renderInputAmount = () => {
    return (
      <View style={{...styles.wrapperInputAmount, ...styles.pdHZ20}}>
        <CommonText text="Nhập số tiền (đ)" />
        <TextInput
          value={value ? formatCurrency(+value?.replace(/\./g, '')) : ''}
          onChangeText={onChangeText}
          keyboardType="numeric"
          returnKeyType="done"
          placeholder="Nhập số tiền bạn cần nạp thêm"
          placeholderTextColor={Colors.textSecondary}
          style={value ? styles.inputValue : styles.input}
        />
        {error !== '' && <CommonText text={error} styles={styles.error} />}
      </View>
    )
  }

  const renderResult = () => {
    return (
      <View style={{...styles.pdHZ20, ...styles.mt20}}>
        <View style={styles.rowItem}>
          <CommonText text="Số tiền nạp" />
          <CommonText text={formatCurrency(+value?.replace(/\./g, '')) + 'đ'} />
        </View>
        <View style={styles.rowItem}>
          <CommonText text="Phí giao dịch" />
          <CommonText text={formatCurrency(fee) + 'đ'} />
        </View>
        <View style={styles.rowItem}>
          <CommonText text="Tổng thanh toán" styles={styles.total} />
          <CommonText
            text={formatCurrency(+value?.replace(/\./g, '') - fee) + 'đ'}
            styles={styles.totalValue}
          />
        </View>
      </View>
    )
  }

  const isSuccess = transaction?.status === '00'
  const statusCode = Number(transaction?.status)

  return (
    <View style={styles.container}>
      <Header title="Nạp tiền" />
      <View style={styles.content}>
        <View style={styles.pdHZ20}>
          <CommonText text="Số tiền nạp (đ)" styles={styles.textAmount} />
          <View style={styles.rowAmount}>
            {amounts.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  ...styles.itemAmount,
                  borderColor:
                    item === amountSelected ? Colors.main : Colors.border,
                }}
                onPress={onSelectAmount(item)}>
                <CommonText
                  text={`${formatCurrency(item)}`}
                  styles={{
                    ...(item === amountSelected && styles.itemAmountSelected),
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.line} />
        {renderInputAmount()}
        <View style={styles.line} />
        {renderResult()}
      </View>
      <CommonButton
        text="Thanh toán ngay"
        isDisable={!value}
        onPress={onDeposit}
        buttonStyles={styles.btnDeposit}
      />
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.actionSheet}
        onClose={onCloseActionSheet}>
        <View style={styles.wrapper}>
          {isSuccess ? <Icons.PaySuccess /> : <Icons.PayFailed />}
          <CommonText
            text={
              isSuccess ? 'Nạp tiền thành công' : 'Nạp tiền không thành công'
            }
            styles={{
              ...styles.status,
              color: isSuccess ? Colors.main : Colors.red,
            }}
          />
          <CommonText
            text={
              isSuccess
                ? `Bạn đã nạp thành công số tiền ${formatCurrency(
                    transaction?.amount,
                  )} đ`
                : transactionStatusMessages[statusCode]
            }
            styles={styles.desc}
          />
        </View>
      </ActionSheet>
    </View>
  )
}

export default Deposit
