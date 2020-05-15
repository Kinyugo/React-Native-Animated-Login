import React, {useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Asset} from 'expo-asset';
import {AppLoading} from 'expo';
import SignIn from './pages/SignIn';

function cacheImages(images = []) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  async function loadAssetsAsync() {
    const imageAssets = cacheImages([require('./assets/bg-phone.jpg')]);

    await Promise.all([...imageAssets]);
  }

  if (!isReady) {
    <AppLoading
      startAsync={loadAssetsAsync}
      onFinish={() => setIsReady(true)}
      onError={console.warn}
    />;
  }

  return <SignIn />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
