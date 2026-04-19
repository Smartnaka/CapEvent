import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { MomentCaptureScreen } from './src/screens/MomentCaptureScreen';
import { DailySummaryScreen } from './src/screens/DailySummaryScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MomentCaptureScreen />
      <DailySummaryScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
});
