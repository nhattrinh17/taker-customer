import React from 'react'
import {View, StyleSheet} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import Header from 'components/Header'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 10,
  },
})

const Bike = () => (
  <View style={styles.container}>
    <Header title="Taker Bike" />
    <View style={styles.wrapper}>
      <Icons.NotServed />
      <CommonText text="Địa điểm này chưa phục vụ" styles={styles.label} />
    </View>
  </View>
)

export default Bike
