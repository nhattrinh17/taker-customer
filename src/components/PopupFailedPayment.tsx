import React, {useRef, forwardRef, useImperativeHandle} from 'react'
import {Dimensions, StyleSheet, View} from 'react-native'
import CommonText from 'components/CommonText'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import {Colors} from 'assets/Colors'
import {TouchableOpacity} from 'react-native-gesture-handler'

const styles = StyleSheet.create({
  actionSheet: {
    paddingHorizontal: 28,
    paddingBottom: 58,
    paddingTop: 50,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginTop: 22,
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontSize: Fonts.fontSize[18],
    fontWeight: 'bold',
    color: '#00AFE6',
    marginBottom: 6,
  },
  desc: {
    color: Colors.textSecondary,
    marginTop: 22,
    textAlign: 'center',
    marginBottom: 26,
  },
  btAccept: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: Dimensions.get('screen').width - 60,
  },
  textAccept: {
    color: Colors.main,
    fontWeight: '600',
  },
})

interface Props {
  onClose: () => void
}

const PopupFailedPayment = forwardRef<ActionSheetRef, Props>(
  ({onClose}, ref) => {
    const actionSheetRef = useRef<ActionSheetRef>(null)

    useImperativeHandle(
      ref,
      () => {
        return {
          show() {
            actionSheetRef.current?.show()
          },
          hide() {
            actionSheetRef.current?.hide()
          },
        }
      },
      [],
    )

    return (
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.actionSheet}
        // onTouchBackdrop={onClose}
        closeOnTouchBackdrop={false}>
        <View style={styles.container}>
          <Icons.PayFailed />
          <CommonText
            text={'Đơn hàng sẽ bị huỷ \ndo thanh toán chưa thành công'}
            styles={styles.desc}
          />
          <TouchableOpacity style={styles.btAccept} onPress={onClose}>
            <CommonText text="Đồng ý" styles={styles.textAccept} />
          </TouchableOpacity>
        </View>
      </ActionSheet>
    )
  },
)

export default PopupFailedPayment
