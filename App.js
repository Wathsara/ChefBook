import React from 'react';
import { StyleSheet, Text, View, Container } from 'react-native';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { f, auth, database, storage } from "./config/config";
import home from './app/screens/home.js';
import discover from './app/screens/discover.js';
import profile from './app/screens/profile.js';
import notification from './app/screens/notification.js';
import userProfile from './app/screens/userProfile.js';
import comment from './app/screens/comment.js';
import newR from './app/screens/newR.js';
import recipe from './app/screens/recipe.js';
import chat from './app/screens/chat.js';
import message from './app/screens/message.js';
import { Icon, Badge } from 'react-native-elements';
import foodFind from './app/screens/foodfind.js';
import follow from './app/screens/follow.js';
import following from './app/screens/following.js';
import searchFood from './app/screens/searchFood.js';
import searchChefs from './app/screens/searchChefs.js';
import Ionicons from "react-native-vector-icons/FontAwesome";

console.disableYellowBox = true;
const homeIcon = <Icon name='camera-retro' type='font-awesome' color='#517fa4' />

const TabStack = createBottomTabNavigator(
    {
        homeIcon: {
            screen: home,
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="home" size={25} color={tintColor} />
                )
            },
        },
        discover: {
            screen: discover,
            navigationOptions: {
                tabBarLabel: "Discover",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="paper-plane" size={25} color={tintColor} />
                )
            },
        },
        profile: {
            screen: profile,
            navigationOptions: {
                tabBarLabel: "Profile",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="user" size={25} color={tintColor} />
                )
            },
        },
        New: {
            screen: newR,
            navigationOptions: {
                tabBarLabel: "New",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="plus" size={25} color={tintColor} />
                )
            },
        },
        

        notification: {
            screen: notification,
            navigationOptions: {
                tabBarLabel: "Notifications",
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        {1 != 0 ? (
                            <View>
                                <Badge status="error" />
                                <Ionicons name="bell" size={25} color={tintColor} />
                            </View>
                        ) : (
                                <View>
                                    <Ionicons name="bell" size={25} color={tintColor} />
                                </View>
                            )}
                    </View>

                )
            },
        },
        chat: {
            screen: chat,
            navigationOptions: {
                tabBarLabel: "Chat",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="comments" size={25} color={tintColor} />
                )
            },
        },
        lens: {
            screen: foodFind,
            navigationOptions: {
                tabBarLabel: "Search",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="search" size={25} color={tintColor} />
                )
            },
        },
        // foodFind: { screen: foodFind}

    },
    {
        tabBarOptions: {
            activeTintColor: "#FF847C",
            inactiveTintColor: "white",
            style: {
                backgroundColor: '#2A363B',
            }
        },
    } 
    


)
const MainStack = createStackNavigator(
    {
        Home: { screen: TabStack },
        userProfile: { screen: userProfile },
        comment: { screen: comment },
        recipe: { screen: recipe },
        message: { screen: message },
        follow: { screen: follow },
        following: { screen: following },
        searchFood: { screen: searchFood },
        searchChefs: { screen: searchChefs }

    },
    {
        initialRoute: 'Home',
        mode: 'modal',
        headerMode: 'none'
    }
)
const MainContainer = createAppContainer(MainStack);

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notiC: 0
        }

    }
    componentWillMount = () => {
        this.notiCount()
    }
    notiCount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                let userId = f.auth().currentUser.uid;

                database.ref('users').child(userId).child('notification').on('value', (function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) {
                        let data = snapshot.val()
                        that.setState({
                            notiC: data,
                        });
                    }
                }), function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
            }


        })
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
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
