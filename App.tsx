/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import Canvas from './src/screens/Canvas';
import { TabletsProvider } from './src/context/TabletsContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TabletsProvider>
        <SafeAreaView style={styles.flex}>
          <Canvas />
        </SafeAreaView>
      </TabletsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
