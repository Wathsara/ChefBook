import React from 'react';
import {
    TouchableOpacity, Text, View, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, ToastAndroid,
    ScrollView, StyleSheet
} from 'react-native';
import { database, f } from "../../config/config";
import { SocialIcon } from 'react-native-elements';
import PTRView from 'react-native-pull-to-refresh';
class notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            loggedin: false,
            messageList: [],
            loaded: false,
            newMessage: '',
            newMessageId: this.uniqueId(),
            newChatId: this.uniqueId(),
        }
    }

    check = () => {
        var params = this.props.navigation.state.params;
        if (params) {
            if (params.userId) {
                this.setState({
                    friendId: params.userId
                });
                var that = this;
                database.ref('users').child(params.userId).child('name').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) data = snapshot.val();
                    console.log(data)
                    that.setState({
                        fname: data
                    });
                });
                database.ref('users').child(params.userId).child('avatar').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) data = snapshot.val();
                    console.log(data)
                    that.setState({
                        favatar: data,

                    });
                });
                this.fetchMessages(params.userId);
                this.loadFeed(params.userId);

            }
        }

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

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    fetchMessages = () => {

        var that = this;
        var userId = f.auth().currentUser.uid;
        database.ref('users').child(userId).child('userChats').child(this.state.friendId).on('value', (function (snapshot) {
            const exist = (snapshot.exists());
            if (exist) {

                var data = snapshot.val();
                database.ref('chatMessages').child(Object.keys(data)[0]).on('value', (function (snapshot) {
                    const exsist = (snapshot.exists());
                    if (exsist) {
                        that.setState({
                            messageList: []
                        })
                        var data = snapshot.val()
                        console.log(Object.keys(data)[0].message);
                        var messageList = that.state.messageList;
                        Object.keys(data).forEach(key => {
                            messageList.push({
                                message: data[key].message,
                                posted: data[key].posted,
                                sendby: data[key].sendby,
                            });

                        });

                        console.log(messageList);
                        that.setState({
                            loaded: true
                        })
                    } else {
                        that.setState({
                            messageList: [],
                            loaded: true
                        })
                    }
                }), function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            }
        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }
    renderMessages = () => {
        { console.log(this.state.avatar) }
        this.state.messageList.sort((a, b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
        // this.state.messageList.reverse();
        return this.state.messageList.map((item, index) => {
            return (
                <View>
                    {item.sendby != f.auth().currentUser.uid ? (
                        <View style={styles.cardContainerReciever}>
                            <View style={styles.cardHedear}>
                                <View style={styles.userDetailArea}>
                                    <View style={styles.userNameRow}><Text style={styles.nameText}>{this.timeConvertor(item.posted)}</Text></View>
                                    <View style={styles.meaasageRow}><Text style={styles.meaasageText}>{item.message}</Text></View>
                                </View>
                            </View>
                        </View>
                    ) : (
                            <View style={styles.cardContainerSender}>
                                <View style={styles.cardHedear}>
                                    <View style={styles.userDetailArea}>
                                        <View style={styles.userNameRow}><Text style={styles.nameText}>{this.timeConvertor(item.posted)}</Text></View>
                                        <View style={styles.meaasageRow}><Text style={styles.meaasageText}>{item.message}</Text></View>
                                    </View>
                                </View>
                            </View>
                        )}
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
                that.check()
                var userId = f.auth().currentUser.uid;
                database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) data = snapshot.val();
                    console.log(data)
                    that.setState({
                        name: data
                    });
                });
                database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) data = snapshot.val();
                    console.log(data)
                    that.setState({
                        avatar: data,

                    });
                });
            } else {
                that.setState({
                    loggedin: false
                })
            }
        })

    }

    sendMessage = () => {
        var that = this;
        var date = Date.now();
        var posted = Math.floor(date / 1000)
        var userId = f.auth().currentUser.uid;
        database.ref('users').child(userId).child('userChats').child(this.state.friendId).once('value').then(function (snapshot) {
            const exist = (snapshot.exists());
            if (exist) {
                data = snapshot.val();
                let cId = (Object.keys(data)[0]);
                var newMessage = {
                    sendby: userId,
                    message: that.state.newMessage,
                    status: 0,
                    posted: posted

                }
                that.setState({
                    newMessageId: that.uniqueId(),
                })
                database.ref('/chatMessages/' + cId + '/' + that.state.newMessageId).set(newMessage);
                database.ref('/users/' + userId + '/userChats/' + that.state.friendId + '/' + cId).update({ posted: posted, lastMessage: that.state.newMessage });
                database.ref('/users/' + that.state.friendId + '/userChats/' + userId + '/' + cId).update({ posted: posted, lastMessage: that.state.newMessage });
                that.setState({
                    newMessage: '',
                })
            } else {
                // alert("no HIll")
                var chatUserf = {
                    lastMessage: that.state.newMessage,
                    posted: posted,
                    friend: that.state.friendId,
                    name: that.state.fname,
                    avatar: that.state.favatar
                }

                var chatUser = {
                    lastMessage: that.state.newMessage,
                    posted: posted,
                    friend: userId,
                    name: f.auth().currentUser.displayName,
                    avatar: f.auth().currentUser.photoURL
                }

                var newMessage = {
                    sendby: userId,
                    message: that.state.newMessage,
                    status: 0,
                    posted: posted

                }
                database.ref('/users/' + userId + '/userChats/' + that.state.friendId + '/' + that.state.newChatId).set(chatUserf);
                database.ref('/users/' + that.state.friendId + '/userChats/' + userId + '/' + that.state.newChatId).set(chatUser);
                database.ref('/chatMessages/' + that.state.newChatId + '/' + that.state.newMessageId).set(newMessage);

            }
        }).catch()
        that.textInput.clear()

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', height: 70, paddingTop: 30, backgroundColor: '#FB8C00', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{ textAlign: 'left' }} onPress={() => this.props.navigation.goBack()}>
                        <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 14, width: 100 }}>Back</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14 }}>{this.state.fname}</Text>
                    <Text style={{ fontSize: 18, width: 100 }}></Text>
                </View>
                <View style={styles.container}>
                    {this.state.loggedin == true ? (
                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}
                            ref={ref => this.scrollView = ref}
                            onContentSizeChange={(contentWidth, contentHeight) => {
                                this.scrollView.scrollToEnd({ animated: true });
                            }}>
                            <View>
                                {this.renderMessages()}
                            </View>

                        </ScrollView>
                    ) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity>
                                    <SocialIcon style={{ width: 200 }} title='Sign In With Facebook' button type='facebook' />
                                </TouchableOpacity>
                            </View>
                        )}
                </View>
                {this.state.loggedin == true ? (
                    <KeyboardAvoidingView style={{ marginBottom: 10 }} enabled={true} behavior="padding">
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextInput underlineColorAndroid="#428AF8" style={{ borderRadius: 5, borderColor: 'grey', marginHorizontal: 5, marginVertical: 5, padding: 5, width: '80%' }}
                                placeholder={'Enter Message Here'}
                                editable={true}
                                multiline={false}
                                maxlength={100}
                                onChangeText={(text) => this.setState({ newMessage: text })}
                                ref={input => { this.textInput = input }}
                            />
                            <TouchableOpacity onPress={this.sendMessage} style={{ alignSelf: 'center', marginHorizontal: 'auto', width: 90, backgroundColor: 'purple', borderRadius: 5, width: '10%' }}>
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 14 }}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>

                ) : (
                        <View></View>
                    )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    cardContainerReciever: {
        width: '70%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#FB8C00',
        borderWidth: 1,
        height: 'auto',
        justifyContent: 'flex-start',
        // marginBottom:20,
        marginTop: 10,
        marginLeft: 3,
    },
    cardContainerSender: {
        width: '70%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#FB8C00',
        borderWidth: 1,
        height: 'auto',
        alignSelf: 'flex-end',
        // marginBottom:20,
        marginTop: 5,
        marginRight: 3
    },
    cardHedear: {
        marginLeft: 10,
        marginTop: 5,
        marginRight: 10,
        // marginBottom:10,
        // width:deviceWidth,
        height: 'auto',
        flexDirection: 'row'
    },
    profilePicArea: {
        flex: 0.10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userDetailArea: {
        paddingLeft: 8,
        height: 'auto',
        // width:deviceWidth * 0.8,
        flexDirection: 'column',
        // backgroundColor:'green'
    },
    userNameRow: {
        flex: 0.2,
        // width:deviceWidth * 0.8,
        // backgroundColor:'yellow',
        paddingTop: 10
    },
    meaasageRow: {
        flex: 0.6,

    },
    userImage: {
        height: 30,
        width: 30,
        borderRadius: 15
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
        fontSize: 10,
        color: '#4e5861',

    },
    meaasageText: {
        fontSize: 16,
        color: '#050608'
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
        paddingBottom: 10
    },

});
export default notification;