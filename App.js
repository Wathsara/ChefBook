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
import newR from './app/screens/newR.js';
import recipe from './app/screens/recipe.js';
import { Icon } from 'react-native-elements';
// import foodFind from './app/screens/foodfind.js'


const homeIcon =  <Icon name='camera-retro'   type='font-awesome'  color='#517fa4'  />

const TabStack = createBottomTabNavigator(
  {
    homeIcon: { screen: home ,
        navigationOptions: {
            tabBarLabel:"home",
            tabBarIcon: ({ tintColor }) => (
                <Icon name='ios-home'   type='ionicon'  color='#517fa4'  />
            )
        },
    },
    discover: { screen: discover ,
        navigationOptions: {
            tabBarLabel:"Discover",
            tabBarIcon: ({ tintColor }) => (
                <Icon name='ios-paper-plane'   type='ionicon'  color='#517fa4'  />
            )
        },
    },
    New : { screen : newR ,
        navigationOptions: {
            tabBarLabel:"New",
            tabBarIcon: ({ tintColor }) => (
                <Icon name='ios-add'   type='ionicon'  color='#517fa4'  />
            )
        },
    },
    profile: { screen: profile ,
        navigationOptions: {
            tabBarLabel:"Profile",
            tabBarIcon: ({ tintColor }) => (
                <Icon name='ios-person'   type='ionicon'  color='#517fa4'  />
            )
        },
    },
    notification: { screen: notification ,
      navigationOptions: {
          tabBarLabel:"Notifications",
          tabBarIcon: ({ tintColor }) => (
              <Icon name='ios-notifications'   type='ionicon'  color='#517fa4'  />
          )
      },
  }
    // foodFind: { screen: foodFind}

  } 

  
)
const MainStack = createStackNavigator(
    {
        Home: { screen : TabStack},
        userProfile : { screen : userProfile },
        comment : { screen : comment},
        recipe : { screen : recipe}

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
    homeIcon =  <Icon name='camera-retro'   type='font-awesome'  color='#517fa4'  />
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
