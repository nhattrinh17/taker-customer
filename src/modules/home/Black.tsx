import CommonText from 'components/CommonText'
import React from 'react'
import {StyleSheet, View, ScrollView} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 400,
  },
  text: {
    fontSize: 16,
  },
})

const Black = () => (
  <ScrollView style={styles.container}>
    <View style={styles.content}>
      <CommonText text="Chưa có thông tin" styles={styles.text} />
    </View>
  </ScrollView>
)

export default Black
