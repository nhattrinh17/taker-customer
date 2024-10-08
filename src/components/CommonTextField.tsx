import {Colors} from 'assets/Colors'
import React from 'react'
import {StyleSheet, TextInput, View, Dimensions, Text} from 'react-native'
import CommonText from './CommonText'

const styles = StyleSheet.create({
  containerInput: {},
  label: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  required: {
    color: Colors.red,
    marginTop: 2,
  },
  wrapperInput: {
    height: 48,
    width: Dimensions.get('screen').width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  error: {
    color: Colors.red,
    lineHeight: 20,
    marginBottom: 12,
  },
})

interface InputProps {
  label: string
  value?: string
  onChangeText: (value: string) => void
  placeholder?: string
  textError?: string
  editable?: boolean | true
  isRequired?: boolean | false
}

const CommonTextField = (props: InputProps) => {
  return (
    <View style={[styles.containerInput]}>
      <View style={styles.label}>
        <CommonText text={props.label} />
        {props.isRequired && <Text style={styles.required}> *</Text>}
      </View>
      <View style={styles.wrapperInput}>
        <TextInput
          allowFontScaling={false}
          {...props}
          style={styles.input}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholderTextColor={Colors.textSecondary}
          placeholder={props.placeholder}
          editable={props.editable}
        />
      </View>
      {props.textError !== '' && (
        <CommonText text={props.textError} styles={styles.error} />
      )}
    </View>
  )
}
export default CommonTextField
