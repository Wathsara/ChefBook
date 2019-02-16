import React from 'react';
import { StyleSheet, Text, View, Container } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import home from './app/screens/home.js';
import discover from './app/screens/discover.js';
import profile from './app/screens/profile.js';
import notification from './app/screens/notification.js';
// import foodFind from './app/screens/foodfind.js'
const MainStack = createBottomTabNavigator(
  {
    home: { screen: home },
    discover: { screen: discover },
    profile: { screen: profile },
    notification: { screen: notification } 
    // foodFind: { screen: foodFind}

  } 

  
)
const AppContainer = createAppContainer(MainStack);

export default class App extends React.Component {
 
  render() {
    return (
      
        <AppContainer />
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
