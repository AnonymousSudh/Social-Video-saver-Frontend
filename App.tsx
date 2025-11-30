import React from 'react';
import { StatusBar } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { DownloadProvider } from './src/context/DownloadContext';

const App = () => {
  return (
    <DownloadProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </DownloadProvider>
  );
};

export default App;
