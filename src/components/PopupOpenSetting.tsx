import React, {useRef, forwardRef, useImperativeHandle} from 'react'
import {StyleSheet, View, Dimensions, Platform} from 'react-native'
import CommonText from 'components/CommonText'
import CommonButton from 'components/Button'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import {Colors} from 'assets/Colors'
import {PermissionStatus} from 'react-native-permissions'

const styles = StyleSheet.create({
  actionSheet: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    height: Dimensions.get('screen').height * 0.6,
  },
  container: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginTop: 30,
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontSize: Fonts.fontSize[20],
    fontWeight: 'bold',
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[15],
    marginVertical: 14,
  },
})

interface Props {
  onPressContinue: () => void
  granted: PermissionStatus | undefined
}

const isIOS = Platform.OS === 'ios'

const LocationPermission = forwardRef<ActionSheetRef, Props>(
  ({onPressContinue, granted}, ref) => {
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
      <ActionSheet ref={actionSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.container}>
          <View>
            <CommonText
              text="Cho phép Taker truy cập vị trí"
              styles={styles.title}
            />
            <CommonText
              text="Cho phép Taker sử dụng vị trí của bạn để phục vụ việc đặt dịch vụ đánh giày được tốt hơn. Bạn hoàn toàn có thể thay đổi cấp quyền trong phần Cài đặt điện thoại bất cứ lúc nào."
              styles={styles.desc}
            />
          </View>
          <Icons.LocationPermission />
          <CommonButton
            text={
              isIOS && granted === 'blocked'
                ? 'Cho phép truy cập vị trí'
                : 'Tiếp tục'
            }
            onPress={onPressContinue}
          />
        </View>
      </ActionSheet>
    )
  },
)

export default LocationPermission
