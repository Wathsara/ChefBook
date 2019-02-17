import React from 'react';
import { StyleSheet, Text, View, Container } from 'react-native';
import { createBottomTabNavigator, createAppContainer , createStackNavigator } from 'react-navigation';
import{ f, auth , database , storage} from "./config/config";
import home from './app/screens/home.js';
import discover from './app/screens/discover.js';
import profile from './app/screens/profile.js';
import notification from './app/screens/notification.js';
import userProfile from './app/screens/userProfile.js';
import comment from './app/screens/comment.js';
// import foodFind from './app/screens/foodfind.js'
const TabStack = createBottomTabNavigator(
  {
    home: { screen: home },
    discover: { screen: discover },
    profile: { screen: profile },
    notification: { screen: notification } 
    // foodFind: { screen: foodFind}

  } 

  
)
const MainStack = createStackNavigator(
    {
        Home: { screen : TabStack},
        userProfile : { screen : userProfile },
        comment : { screen : comment}

    },
    {
        initialRoute: 'Home',
        mode: 'modal',
        headerMode: 'none'
    }
)
const MainContainer = createAppContainer(MainStack);

export default class App extends React.Component {

   constructor(props){
        super(props);
        this.login();
    }
  login = async() => {
    try {
        let user = await auth.signInWithEmailAndPassword('wvd.51461@gmail.com', '111111');
    }catch (error){
        console.log(error);
    }
  }
  render() {
    return (
      
        <MainContainer />
      
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
