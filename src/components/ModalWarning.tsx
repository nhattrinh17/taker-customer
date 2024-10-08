import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import CommonText from 'components/CommonText'
import React from 'react'
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native'
import Modal from 'react-native-modal'
import CommonButton from './Button'

const styles = StyleSheet.create({
  modalWarning: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  contentModalWarning: {
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
  headerWarning: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowAction: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  btAction: {
    width: Dimensions.get('screen').width / 2 - 50,
  },
  btReject: {
    backgroundColor: Colors.nobel,
    width: Dimensions.get('screen').width / 2 - 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 30,
  },
  reject: {
    fontSize: Fonts.fontSize[14],
    fontFamily: Fonts.fontFamily.AvertaSemiBold,
    fontWeight: '500',
  },
  accept: {
    fontSize: Fonts.fontSize[14],
  },
})

interface Props {
  showModalWarning: boolean
  onClose: () => void
  title: string
  description: string
  onAccept?: (value: boolean) => void
  showActions?: boolean
}

const ModalWarning = ({
  onClose,
  showModalWarning,
  title,
  description,
  onAccept,
  showActions = false,
}: Props) => {
  const onPressAccept = (value: boolean) => () => {
    onAccept?.(value)
  }

  return (
    <Modal
      isVisible={showModalWarning}
      style={styles.modalWarning}
      onBackdropPress={onClose}>
      <View style={styles.contentModalWarning}>
        <View style={styles.iconClose}>
          <TouchableOpacity onPress={onClose}>
            <Icons.Close />
          </TouchableOpacity>
        </View>
        <View style={styles.headerWarning}>
          <Icons.Warning />
          <CommonText
            text="Quý khách lưu ý"
            styles={styles.titleModalWarning}
          />
        </View>
        <CommonText text={title} styles={styles.labelModalWarning} />
        {description && (
          <CommonText text={description} styles={styles.labelModalWarning} />
        )}
        {showActions && (
          <View style={styles.rowAction}>
            <TouchableOpacity style={styles.btReject}>
              <CommonText text="Từ chối" styles={styles.reject} />
            </TouchableOpacity>
            <CommonButton
              text="Đồng ý"
              onPress={onPressAccept(true)}
              buttonStyles={styles.btAction}
              textStyles={styles.accept}
            />
          </View>
        )}
      </View>
    </Modal>
  )
}

export default ModalWarning
