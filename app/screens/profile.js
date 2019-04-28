import React from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, ScrollView, ImageBackground, TextInput } from 'react-native';
import { f, auth, database, storage } from "../../config/config";
import { SocialIcon } from 'react-native-elements';
var { width, height } = Dimensions.get('window');
import { Card, Button } from 'react-native-elements'
import { Permissions, Notifications } from 'expo';
import Ionicons from "react-native-vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from "react-native-modal";
import { PacmanIndicator } from 'react-native-indicators';
class profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            active: 0,
            photo: [],
            loaded: false,
            follow: [],
            following: [],
            saved: [],
            modal: false,
            subject: '',
            question: ''
        }
    }
    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {

                that.setState({
                    loggedin: true,
                    active: 0
                });
                let us = f.auth().currentUser;
                let userId = f.auth().currentUser.uid;
                that.registerForPushNotificationsAsync(userId)
                database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) {
                        var data = snapshot.val();
                        that.setState({
                            name: data
                        })
                        database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
                            const exist = (snapshot.val() != null);
                            if (exist) {
                                var data = snapshot.val();
                                that.setState({
                                    avatar: data,
                                });
                            }

                        })
                        database.ref('users').child(userId).child('follower').on('value', (function (snapshot) {

                            const exsist = (snapshot.val() != null);
                            if (exsist) {
                                var data = snapshot.val();
                                console.log(data)
                                var followers = that.state.follow
                                for (var follow in data) {
                                    let followObj = data[follow]
                                    followers.push({
                                        name: followObj.name,
                                        avatar: followObj.avatar,
                                        friend: followObj.friend
                                    });
                                }
                            } else {
                                that.setState({
                                    follow: []
                                })
                            }

                        }), function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });

                        database.ref('users').child(userId).child('following').on('value', (function (snapshot) {

                            const exsist = (snapshot.val() != null);
                            if (exsist) {
                                var data = snapshot.val();
                                let followings = that.state.following
                                for (var following in data) {
                                    let followingObj = data[following]
                                    followings.push({
                                        name: followingObj.name,
                                        avatar: followingObj.avatar,
                                        friend: followingObj.friend
                                    });
                                }
                            } else {
                                that.setState({
                                    following: []
                                })
                            }

                        }), function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                        that.loadFeed();
                    } else {
                        let us = f.auth().currentUser;
                        var newUser = {
                            name: us.displayName,
                            email: us.email,
                            avatar: us.photoURL
                        }
                        database.ref('users/' + userId).set(newUser).catch((error) => console.log(error));
                        database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
                            const exist = (snapshot.val() != null);
                            if (exist) data = snapshot.val();
                            that.setState({
                                name: data,
                            });
                        }).catch((error) => console.log(error))
                        database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
                            const exist = (snapshot.val() != null);
                            if (exist) data = snapshot.val();
                            that.setState({
                                avatar: data,
                            });
                        }).catch((error) => console.log(error))
                        database.ref('users').child(userId).child('follower').on('value', (function (snapshot) {
                            const exsist = (snapshot.val() != null);
                            if (exsist) {
                                var data = snapshot.val();
                                console.log(data)
                                var followers = that.state.follow
                                for (var follow in data) {
                                    let followObj = data[follow]
                                    followers.push({
                                        friend: followObj.friend,
                                        name: followObj.name,
                                        avatar: followObj.avatar,
                                    });
                                }
                            } else {
                                that.setState({
                                    follow: []
                                })
                            }

                        }), function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });

                        database.ref('users').child(userId).child('following').on('value', (function (snapshot) {

                            const exsist = (snapshot.val() != null);
                            if (exsist) {
                                var data = snapshot.val();
                                let followings = that.state.following
                                for (var following in data) {
                                    let followingObj = data[following]
                                    followings.push({
                                        friend: followingObj.friend,
                                        name: followingObj.name,
                                        avatar: followingObj.avatar,
                                    });
                                }
                            } else {
                                that.setState({
                                    following: []
                                })
                            }

                        }), function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                        that.loadFeed();
                    }

                })

            } else {
                that.setState({
                    loggedin: false,
                    photo: []
                })


            }

        })

    }

    loadFeed = () => {

        var uid = f.auth().currentUser.uid;
        this.setState({
            photo: [],
            active: 0

        });

        var that = this;
        database.ref('users').child(uid).child('recepies').on('value', (function (snapshot) {
            that.setState({
                photo: []
            });
            const exsist = (snapshot.val() != null);
            if (exsist) {
                data = snapshot.val();
                var photo = that.state.photo;
                for (var photos in data) {
                    let photoO = data[photos];
                    let tempId = photos;
                    photo.push({
                        id: tempId,
                        url: photoO.image,
                        fName: photoO.foodName,

                    });

                    console.log(photo);
                }

            }

        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        database.ref('users').child(uid).child('saved').on('value', (function (snapshot) {
            that.setState({
                saved: []
            });
            const exsist = (snapshot.val() != null);
            if (exsist) {
                data = snapshot.val();
                var saved = that.state.saved;
                for (var saves in data) {
                    let saveO = data[saves];
                    let tempId = saves;
                    saved.push({
                        id: tempId,
                        url: saveO.image,
                    });
                    console.log(saved);
                }
                that.setState({
                    loaded: true
                })
            }

        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    photoClick = (active) => {
        this.setState({
            active: active
        })

    }

    postClick = (active) => {
        this.setState({
            active: active
        })

    }

    saveClick = (active) => {
        this.setState({
            active: active
        })


    }


    renderSection = () => {


        if (this.state.active == 0 && this.state.loggedin == true) {

            return this.state.photo.map((image, index) => {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('recipe', { id: image.id })}>
                        <View key={index} style={[{ width: (width) / 3 }, { height: (width) / 3 }]}>
                            <Image source={{ uri: image.url }} style={{ width: undefined, height: undefined, flex: 1, marginHorizontal: 1, marginVertical: 2 }} />
                        </View>
                    </TouchableOpacity>
                )
            });
        }

        if (this.state.active == 1) {
            return (
                <View>
                    <Text>Post Section</Text>
                </View>
            )
        }

        if (this.state.active == 2) {
            return this.state.saved.map((save, index) => {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('recipe', { id: save.id })}>
                        <View key={index} style={[{ width: (width) / 3 }, { height: (width) / 3 }]}>
                            <Image source={{ uri: save.url }} style={{ width: undefined, height: undefined, flex: 1, marginHorizontal: 1, marginVertical: 2 }} />
                        </View>
                    </TouchableOpacity>
                )
            });
        }
        this.setState({
            photo: []
        });
    }


    logout = () => {
        this.setState({
            loggedin: false,
            active: 0,
            photo: [],
        });
        f.auth().signOut();


    }


    loginWithFacebook = async () => {
        const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
            '558501394651388',
            { permissions: ['email', 'public_profile'] }
        )
        if (type == 'success') {
            const credentials = f.auth.FacebookAuthProvider.credential(token);
            f.auth().signInWithCredential(credentials).catch((error) => {
                console.log(error)
            });
            this.setState({
                photo: [],
            });

        }

    }

    registerForPushNotificationsAsync = async (userId) => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        console.log("token = " + token)

    }

    help = () => {
        this.setState({
            modal: true,
            question: '',
            subject: ''
        })
    }

    submitQuestion = () => {
        if (this.state.subject != '' && this.state.question != '') {
            this.setState({
                modal: false
            })
            if (this.state.subject != '' && this.state.question != '')

                var questionId = this.uniqueId();
            var userID = f.auth().currentUser.uid;
            var subject = this.state.subject;
            var question = this.state.question;
            var status = 0;
            var email = f.auth().currentUser.email;
            var name = f.auth().currentUser.displayName;
            var date = Date.now();
            var posted = Math.floor(date / 1000)
            const questionOBJ = {
                userId: userID,
                subject: subject,
                question: question,
                status: status,
                email: email,
                name: name,
                posted:posted
            }
            var uq = {
                status: status
            }

            database.ref('/users/' + userID + '/questions/' + questionId).set(uq);
            database.ref('/questions/' + questionId).set(questionOBJ);
            alert("Thank You!\nOur Team Will Get Back To You As soon As Possible");
            this.setState({
                question: '',
                subject: ''
            })
        }

    }

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 70, backgroundColor: '#FB8C00', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground source={require('../data/heading.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                        <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, color: '#ffffff', paddingTop: 30 }}>Profile</Text>
                        </ImageBackground>
                    </ImageBackground>
                </View>
                {this.state.loggedin == true ? (

                    <View style={{ flex: 1 }}>
                        {this.state.loaded == false ? (
                            <View style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                <ImageBackground source={{ uri: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/02/24/17/chef.jpg?w968h681' }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                                    <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                        <PacmanIndicator size={70} color="white" />
                                    </ImageBackground>
                                </ImageBackground>
                            </View>
                        ) : (
                                <View style={{ flex: 1 }}>
                                    <Modal
                                        isVisible={this.state.modal}
                                        deviceWidth={"100%"}
                                        deviceHeight={"100%"}
                                        onBackdropPress={() => this.setState({ modal: false })}
                                        style={{ justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ height: 'auto', width: 300, backgroundColor: '#2A363B', paddingBottom: 10 }}>
                                                <Card
                                                    title="Ask For Help">
                                                    <TextInput selectionColor='#428AF8' underlineColorAndroid="#428AF8" style={{ borderRadius: 5, borderColor: 'grey', marginHorizontal: 10, marginVertical: 10, padding: 5 }}
                                                        placeholder={'Subject'}
                                                        editable={true}
                                                        multiline={true}
                                                        maxlength={200}
                                                        onChangeText={(text) => this.setState({ subject: text })}
                                                        style={{ padding: 10 }}
                                                    />
                                                    <TextInput selectionColor='#428AF8' underlineColorAndroid="#428AF8" style={{ borderRadius: 5, borderColor: 'grey', marginHorizontal: 10, marginVertical: 10, padding: 5 }}
                                                        placeholder={'Ask Your Question'}
                                                        editable={true}
                                                        multiline={true}
                                                        maxlength={400}
                                                        onChangeText={(text) => this.setState({ question: text })}
                                                        style={{ padding: 10 }}
                                                    />
                                                    <Button
                                                        title="Submit"
                                                        type="outline"
                                                        onPress={() => this.submitQuestion()}
                                                    />
                                                </Card>
                                            </View>
                                        </View>
                                    </Modal>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 5 }}>
                                        <View>
                                            <Image source={{ uri: this.state.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                        </View>
                                        <View style={{ flexDirection: 'column', height: 45 }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.name}</Text>
                                            </View>
                                            <View style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                                <TouchableOpacity style={{ alignItems: "center", justifyContent: 'center', width: 100, borderWidth: 1.5, borderRadius: 12, borderColor: '#FF847C', marginLeft: 5 }} onPress={() => this.help()}>
                                                    <Ionicons name="question-circle" size={14} color='#000' />
                                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>Help</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={this.logout} style={{ alignItems: "center", justifyContent: 'center', width: 100, borderWidth: 1.5, borderRadius: 12, borderColor: '#FF847C', marginLeft: 5 }} >
                                                    <Icon name="logout" size={14} color='#000' />
                                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>Logout</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 5, marginVertical: 25 }}>
                                        <TouchableOpacity style={{ marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.photo.length}</Text>
                                            <Text>Recepies</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('follow', { followList: this.state.follow })} style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center' }}  >
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.follow.length}</Text>
                                            <Text>Followers</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('following', { followingList: this.state.following })} >
                                            <View style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.following.length}</Text>
                                                <Text>Following</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, marginTop: 20 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 15, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.photoClick(0)}  >
                                                {this.state.active == 0 ? (
                                                    <Ionicons name="image" size={25} color='#FF847C' />
                                                ) : (
                                                        <Ionicons name="image" size={25} color='#000' />
                                                    )}


                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.saveClick(2)} active={this.state.active == 2}>
                                                {this.state.active == 2 ? (
                                                    <Ionicons name="save" size={25} color='#FF847C' />
                                                ) : (
                                                        <Ionicons name="save" size={25} color='#000' />
                                                    )}

                                            </TouchableOpacity>

                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <ScrollView style={{ flex: 1, marginTop: 10 }}>
                                                {this.state.loaded == true && this.state.loggedin == true ? (
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        {this.renderSection()}

                                                    </View>
                                                ) : (
                                                        <View style={{ flexDirection: 'row' }}>


                                                        </View>
                                                    )}

                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            )}

                    </View>

                ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.loginWithFacebook}>
                                <SocialIcon style={{ width: 200 }} title='Sign In With Facebook' button type='facebook' />
                            </TouchableOpacity>

                        </View>

                    )}

            </View>
        );
    }
}
export default profile;