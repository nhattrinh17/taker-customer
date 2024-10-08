import React from 'react'
import {View, StyleSheet, TouchableOpacity, Linking} from 'react-native'
import CommonText from 'components/CommonText'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import {Colors} from 'assets/Colors'
import FastImage from 'react-native-fast-image'
import {s3Url} from 'services/src/APIConfig'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    marginBottom: 2,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[12],
  },
  wrapperName: {
    marginLeft: 12,
    flex: 1,
  },
  phone: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
})

interface Props {
  name: string
  phoneNumber: string
  title?: string
  avatar: string
}

const ItemMaker = ({name, phoneNumber, title, avatar}: Props) => {
  const onPressPhone = async () => {
    // const canOpen = await Linking.canOpenURL(`tel:${phoneNumber}`)
    // console.log('canOpen ===>', {canOpen, phoneNumber})
    Linking.openURL(`tel:${phoneNumber}`)
  }

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={{
          uri: s3Url + avatar,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.wrapperName}>
        <CommonText text={name} styles={styles.name} />
        <CommonText text={title ?? 'Thợ đánh giày'} styles={styles.title} />
      </View>
      <TouchableOpacity onPress={onPressPhone} style={styles.phone}>
        <Icons.Phone />
      </TouchableOpacity>
    </View>
  )
}

export default ItemMaker
