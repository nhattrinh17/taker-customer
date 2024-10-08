import React from 'react'
import {View, StyleSheet} from 'react-native'
import {Colors} from 'assets/Colors'
import Header from 'components/Header'
import {WebView} from 'react-native-webview'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'CommonWebView'>
}

const CommonWebView = (props: Props) => {
  const {title, url} = props?.route?.params || {}
  return (
    <View style={styles.container}>
      <Header title={title} />
      <WebView source={{uri: url}} />
    </View>
  )
}

export default CommonWebView
