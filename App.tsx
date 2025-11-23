/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler'; // must be FIRST
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';
import React from 'react';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Text>App</Text>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;
