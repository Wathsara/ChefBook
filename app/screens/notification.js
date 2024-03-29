import React from 'react';
import {
    TouchableOpacity, Text, View, ImageBackground, Image, ActivityIndicator, KeyboardAvoidingView, ToastAndroid,
    ScrollView, StyleSheet
} from 'react-native';
import { database, f } from "../../config/config";
import { SocialIcon } from 'react-native-elements';
import PTRView from 'react-native-pull-to-refresh';
import { PacmanIndicator } from 'react-native-indicators';
class notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            loggedin: false,
            notificationsList: [],
            loaded: false,

        }
    }

    _refresh = () => {
        return new Promise((resolve) => {
            setTimeout(() => { resolve() }, 2000)
            this.componentDidMount();
        });
    }

    timePlural = (s) => {
        if (s == 1) {
            return ' ago'
        } else {
            return 's ago'
        }
    }

    timeConvertor = (timestamp) => {
        var a = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - a) / 1000);

        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' Year' + this.timePlural(interval);
        }

        var interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' Month' + this.timePlural(interval);
        }

        var interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' Day' + this.timePlural(interval);
        }

        var interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' Hour' + this.timePlural(interval);
        }

        var interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' Minute' + this.timePlural(interval);
        }

        return Math.floor(seconds) + ' Second' + this.timePlural(seconds)
    }


    fetchInfo = (userId) => {

        this.setState({
            notificationsList: []
        });

        var that = this;
        database.ref('notifications').child(userId).orderByChild('posted').on('value', (function (snapshot) {
            const exsist = (snapshot.val() != null);
            that.setState({
                notificationsList: [],
                loaded: true
            })
            if (exsist) {
                let data = snapshot.val();
                var notificationsList = that.state.notificationsList;
                for (var noti in data) {
                    let notiOBJ = data[noti]
                    notificationsList.push({
                        image: notiOBJ.avatar,
                        author: notiOBJ.author,
                        authorId: notiOBJ.authorId,
                        recipeId: notiOBJ.recipe,
                        notification: notiOBJ.message,
                        posted: notiOBJ.posted,
                    });
                }
                console.log(notificationsList);
                that.setState({
                    loaded: true
                })
            } else {
                that.setState({
                    notificationsList: [],
                    loaded: true
                })
            }
        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }
    renderNotifications = () => {
        this.state.notificationsList.sort((a, b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
        this.state.notificationsList.reverse();

        return this.state.notificationsList.map((items, index) => {
            { console.log(items.image) }
            return (
                <View style={styles.cardContainer}>
                    <View style={styles.cardHedear}>
                        <View style={styles.profilePicArea}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('userProfile', { userId: items.authorId })}>
                                <Image style={styles.userImage} source={{ uri: items.image }} />
                            </TouchableOpacity>
                            {this.props.count > 0 &&
                                <View style={styles.badgeCount}>
                                    <Text style={styles.countText}>{this.props.count}</Text>
                                </View>
                            }
                        </View>
                        <View style={styles.userDetailArea}>
                            <View style={styles.userNameRow}>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }} onPress={() => this.props.navigation.navigate('userProfile', { userId: items.authorId })}>
                                    <Text style={styles.nameText}>{items.author}</Text>
                                    <Text style={{ alignSelf: 'flex-end' }}>{this.timeConvertor(items.posted)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.meaasageRow}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('comment', { recipeId: items.recipeId })}>
                                    <Text style={styles.meaasageText}>{items.notification}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )
        });



    }

    componentDidMount = () => {

        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                that.setState({
                    loggedin: true,
                });
                var userId = f.auth().currentUser.uid;
                that.fetchInfo(userId);
            } else {
                that.setState({
                    loggedin: false
                })


            }
        })

    }

    render() {
        return (

            <View style={{ flex: 1, backgroundColor: '#e8e8e8' }} >
                <View style={{ height: 70, backgroundColor: '#FB8C00', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground source={require('../data/heading.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                        <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, color: '#ffffff',paddingTop:30 }}>Notifications</Text>
                        </ImageBackground>
                    </ImageBackground>
                </View>
                <View style={{ flex: 1 }}>
                    {this.state.loaded == true ? (
                        <View style={{ flex: 1 }}>
                            {this.state.notificationsList.length == 0 ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>No Notifications..</Text>
                                </View>
                            ) : (
                                    <View style={styles.container}>
                                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                                            {this.renderNotifications()}
                                        </ScrollView>
                                    </View>
                                )}

                        </View>
                    ) : (
                            <View style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                <ImageBackground source={{ uri: 'https://flavorverse.com/wp-content/uploads/2017/12/Afghan-Foods.jpg' }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                                    <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                        <PacmanIndicator size={70} color="white" />
                                    </ImageBackground>
                                </ImageBackground>
                            </View>
                        )}

                </View>


                {this.state.loggedin == true ? (
                    <KeyboardAvoidingView style={{ padding: 15, marginBottom: 10 }} enabled={true} behavior="padding">

                    </KeyboardAvoidingView>
                ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity>
                                <SocialIcon style={{ width: 200 }} title='Sign In With Facebook' button type='facebook' />
                            </TouchableOpacity>
                        </View>
                    )}
            </View>

        );
    }
}
const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#FB8C00',
        borderWidth: 1,
        // height:200,
        alignItems: 'center',
        justifyContent: 'flex-start',
        // marginBottom:20,
        marginTop: 10
    },
    cardHedear: {
        marginLeft: 10,
        marginTop: 5,
        marginRight: 10,
        // marginBottom:10,
        // width:deviceWidth,
        height: 80,
        flexDirection: 'row'
    },
    profilePicArea: {
        flex: 0.25,
        // width:deviceWidth * 0.2,
        // backgroundColor:'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userDetailArea: {
        flex: 0.75,
        paddingLeft: 8,
        // width:deviceWidth * 0.8,
        flexDirection: 'column',
        // backgroundColor:'green'
    },
    userNameRow: {
        flex: 0.4,

        // width:deviceWidth * 0.8,
        // backgroundColor:'yellow',
        paddingTop: 10
    },
    meaasageRow: {
        flex: 0.6,
        marginTop: 5
        // width:deviceWidth * 0.8,
        // backgroundColor:'blue'
    },
    userImage: {
        height: 60,
        width: 60,
        borderRadius: 30
    },
    badgeCount: {
        backgroundColor: '#3d9bf9',
        height: 20,
        width: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    imageThumbnails: {
        height: 70,
        width: 70,
        borderRadius: 35,
    },
    detailRow: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        marginTop: 10
    },
    thumbnailRow: {
        flex: 1,
        width: '100%',
        // backgroundColor:'red',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 30
    },

    //Font styles

    nameText: {
        fontSize: 14,
        color: '#4e5861',
        fontWeight: 'bold'
    },
    meaasageText: {
        fontSize: 16,
        color: '#95a3ad'
    },
    paraText: {
        fontSize: 16,
        color: '#555f68'
    },
    countText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        width: '100%',

    },
    scrollView: {
        width: '100%',
        backgroundColor: '#e8e8e8',


    },
    scrollViewContent: {
        alignItems: 'center',
        paddingBottom: 10
    },

});
export default notification;