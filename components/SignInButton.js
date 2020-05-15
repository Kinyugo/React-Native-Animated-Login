import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function SignInButton({
  customStyles: {containerStyles, textStyles},
  text,
}) {
  return (
    <View
      style={{
        ...styles.container,
        ...containerStyles,
      }}>
      <Text style={{...styles.buttonText, ...textStyles}}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
