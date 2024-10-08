import React, {useEffect, useState} from 'react'
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {useGetBalance, useWithdraw} from 'services/src/profile'
import Header from 'components/Header'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {formatCurrency} from 'utils/index'
import CommonButton from 'components/Button'
import {appStore} from 'state/app'
import ModalSuccess from 'components/ModalSuccess'
import {goBack} from 'navigation/utils/navigationUtils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    marginTop: 16,
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
  wrapperTopContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  rowBalance: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  balance: {
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  amount: {
    fontSize: Fonts.fontSize[20],
    lineHeight: 24,
    color: Colors.black,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  error: {
    color: Colors.red,
    fontSize: Fonts.fontSize[12],
    marginTop: -16,
    marginLeft: 20,
    marginBottom: 20,
  },
})

const amounts = [1000000, 2000000, 3000000]

const Withdraw = () => {
  const {triggerGetBalance, balance} = useGetBalance()
  const setLoading = appStore(state => state?.setLoading)
  const {triggerWithdraw} = useWithdraw()
  const [amountSelected, setAmountSelected] = useState<number>()
  const [value, setValue] = useState<string>('')
  const fee = 0
  const [errorAmount, setErrorAmount] = useState('')

  const [showModalWithdraw, setShowModalWithdraw] = useState<{
    value: boolean
    type: 'SUCCESS' | 'FAIL'
  }>({value: false, type: 'SUCCESS'})

  const onWithdraw = async () => {
    if (+value > balance) {
      setErrorAmount('Số dư không đủ')
      return
    }
    if (+value < 50000) {
      setErrorAmount('Số tiền rút tối thiểu là 50.000đ')
      return
    }
    setLoading(true)
    try {
      const response = await triggerWithdraw({amount: +value})
      if (response?.data) {
        setShowModalWithdraw({value: true, type: 'SUCCESS'})
      }
    } catch (err) {
      setShowModalWithdraw({value: true, type: 'FAIL'})
    } finally {
      setLoading(false)
    }
  }

  const onSelectAmount = (amount: number) => () => {
    if (errorAmount) {
      setErrorAmount('')
    }
    setAmountSelected(amount)
    setValue(amount.toString())
  }

  const onChangeAmount = (value: string) => {
    if (errorAmount) {
      setErrorAmount('')
    }
    setValue(value?.replace(/\./g, ''))
  }

  useEffect(() => {
    triggerGetBalance()
  }, [])

  const onBackdropPress = () => {
    setShowModalWithdraw({value: false, type: 'SUCCESS'})
    goBack()
  }

  const renderInputAmount = () => {
    return (
      <View style={{...styles.wrapperInputAmount, ...styles.pdHZ20}}>
        <CommonText text="Nhập số tiền (đ)" />
        <TextInput
          value={value ? formatCurrency(+value?.replace(/\./g, '')) : ''}
          onChangeText={onChangeAmount}
          keyboardType="numeric"
          returnKeyType="done"
          placeholder="Nhập số tiền bạn cần rút"
          placeholderTextColor={Colors.textSecondary}
          style={value ? styles.inputValue : styles.input}
        />
      </View>
    )
  }

  const renderResult = () => {
    return (
      <View style={{...styles.pdHZ20, ...styles.mt20}}>
        <View style={styles.rowItem}>
          <CommonText text="Số tiền rút" />
          <CommonText text={formatCurrency(+value?.replace(/\./g, '')) + 'đ'} />
        </View>
        <View style={styles.rowItem}>
          <CommonText text="Phí giao dịch" />
          <CommonText text={formatCurrency(fee) + 'đ'} />
        </View>
        <View style={styles.rowItem}>
          <CommonText text="Tổng trừ ví" styles={styles.total} />
          <CommonText
            text={formatCurrency(+value?.replace(/\./g, '') - fee) + 'đ'}
            styles={styles.totalValue}
          />
        </View>
      </View>
    )
  }

  const renderListAmount = () => {
    return (
      <View style={styles.pdHZ20}>
        <CommonText text="Số tiền cần rút (đ)" styles={styles.textAmount} />
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
    )
  }

  return (
    <View style={styles.container}>
      <Header title="Yêu cầu rút tiền" />
      <View style={styles.wrapperTopContent}>
        <View style={styles.rowBalance}>
          <CommonText text="Số dư hiện tại (đ): " styles={styles.balance} />
          <CommonText text={formatCurrency(balance)} styles={styles.amount} />
        </View>
      </View>
      <View style={styles.line} />

      <View style={styles.content}>
        {renderListAmount()}
        <View style={styles.line} />
        {renderInputAmount()}
        {errorAmount !== '' && (
          <CommonText text={errorAmount} styles={styles.error} />
        )}
        <View style={styles.line} />
        {renderResult()}
      </View>
      <CommonButton
        text="Gửi yêu cầu"
        isDisable={!value}
        onPress={onWithdraw}
        buttonStyles={styles.btnDeposit}
      />

      <ModalSuccess
        onBackdropPress={onBackdropPress}
        isVisible={showModalWithdraw.value}
        type={showModalWithdraw.type}
        title={showModalWithdraw.type === 'FAIL' ? 'Thất bại' : 'Thành công'}
        desc={
          showModalWithdraw.type === 'FAIL'
            ? 'Vui lòng gửi lại yêu cầu sau'
            : 'Yêu cầu của bạn sẽ được xử lý trong 1-2 ngày làm việc'
        }
      />
    </View>
  )
}

export default Withdraw
