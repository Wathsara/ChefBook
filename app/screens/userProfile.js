import React from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { f, auth, database, storage } from "../../config/config";
import { Icon } from 'react-native-elements';
import Ionicons from "react-native-vector-icons/FontAwesome";
var { width, height } = Dimensions.get('window');
import { PacmanIndicator } from 'react-native-indicators';
class userProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            active: 0,
            photo: [],
            ploaded: false,
            follow: [],
            following: [],
            saved:[]

        }
    }
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }
    check = () => {
        var params = this.props.navigation.state.params;
        var id = f.auth().currentUser.uid;
        if (params) {
            if (params.userId) {
                this.setState({
                    userId: params.userId
                });
                this.fetchInfo(params.userId);
                this.loadFeed(params.userId);
                var that = this;
                database.ref('users').child(id).child('following').child(params.userId).on('value', (function (snapshot) {
                    if (snapshot.val()) {
                        that.setState({
                            followingState: true
                        })
                    }

                }), function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            }
        }

    }

    fetchInfo = (userId) => {

        var that = this;

        database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) data = snapshot.val();
            that.setState({
                name: data
            });
        })

        database.ref('users').child(userId).child('userName').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) data = snapshot.val();
            that.setState({
                userName: data
            });
        })

        database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) data = snapshot.val();
            that.setState({
                avatar: data,
                loaded: true
            });
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
                        friendId: followObj
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
                        friendId: followingObj
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
    }

    loadFeed = (uid) => {


        this.setState({
            photo: [],
            active: 0

        });

        var that = this;
        database.ref('users').child(uid).child('recepies').once('value').then(function (snapshot) {
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
                that.setState({

                    ploaded: true
                })
            }

        }).catch(error => console.log(error));

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


        if (this.state.active == 0) {

            return this.state.photo.map((image, index) => {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('recipe', { id: image.id })}>
                        <View key={index} style={[{ width: (width) / 3 }, { height: (width) / 3 }]}>
                            <Image source={{ uri: image.url }} style={{ width: undefined, height: undefined, flex: 1 }} />
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
    }

    componentDidMount = () => {
        this.check();
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                that.setState({
                    loggedin: true,
                });

            } else {
                that.setState({
                    loggedin: false
                })


            }
        })

    }

    follow = () => {
        var date = Date.now();
        var posted = Math.floor(date / 1000)

        var fid = this.state.userId;
        var fName = this.state.name;
        var fPic = this.state.avatar;
        var myId = f.auth().currentUser.uid;
        var myName = f.auth().currentUser.displayName;
        var myPic = f.auth().currentUser.photoURL;

        var follower = {
            name: myName,
            avatar: myPic,
            friend: myId,
        }

        var following = {
            name: fName,
            avatar: fPic,
            friend: fid,
        }

        var notification = {
            author: myName,
            authorId: myId,
            posted: posted,
            avatar: myPic,
            message: "Followed You",
        }
        database.ref('/notifications/' + fid + '/' + this.uniqueId()).set(notification);
        database.ref('/users/' + myId + '/following/' + fid).set(following);
        database.ref('/users/' + fid + '/follower/' + myId).set(follower);
        this.setState({
            followingState: true
        })


    }

    unfollow = () => {

        var fid = this.state.userId;
        var myId = f.auth().currentUser.uid;



        database.ref('/users/' + myId + '/following/' + fid).remove();
        database.ref('/users/' + fid + '/follower/' + myId).remove();
        this.setState({
            followingState: false
        })

    }



    render() {
        return (
            <View style={{ flex: 1 }}>

                {this.state.loaded == true ? (

                    <View style={{ flex: 1 }}>
                        <View style={{ height: 70, backgroundColor: '#FB8C00', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                            <ImageBackground source={require('../data/heading.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                                <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    <View flexDirection='row' style={{ paddingTop: 30 }}>
                                        <TouchableOpacity style={{ textAlign: 'left' }} onPress={() => this.props.navigation.goBack()}>
                                            <Text style={{ color: 'white', fontSize: 14, width: 100 }}>Back</Text>
                                        </TouchableOpacity>
                                        <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>{this.state.userName}</Text>
                                        <Text style={{ fontSize: 18, width: 100 }}></Text>
                                    </View>
                                </ImageBackground>
                            </ImageBackground>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 5 }}>
                            <View>
                                <Image source={{ uri: this.state.avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                            </View>
                            <View style={{ flexDirection: 'column', height: 45 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 5, marginVertical: 25 }}>
                                    <View style={{ marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.photo.length}</Text>
                                        <Text>Recepies</Text>
                                    </View>
                                    <View style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.follow.length}</Text>
                                        <Text>Followers</Text>
                                    </View>
                                    <View style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.following.length}</Text>
                                        <Text>Following</Text>
                                    </View>
                                </View>

                                <View>
                                    {this.state.userId != f.auth().currentUser.uid && this.state.loaded == true && this.state.followingState != true ? (

                                        <View style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('message', { userId: this.state.userId })}>
                                                <Text style={{ fontSize: 18, width: 100, borderWidth: 1.5, borderRadius: 25, borderColor: '#FF847C', textAlign: 'center' }}>Chat</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this.follow}>
                                                <Text style={{ fontSize: 18, width: 100, borderWidth: 1.5, borderRadius: 25, borderColor: '#FF847C', textAlign: 'center', marginLeft: 5 }}>Follow</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                            <View>
                                                {this.state.followingState != false && this.state.userId != f.auth().currentUser.uid ? (
                                                    <View style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('message', { userId: this.state.userId })}>
                                                            <Text style={{ fontSize: 18, width: 100, borderWidth: 1.5, borderRadius: 25, borderColor: '#FF847C', textAlign: 'center' }}>Chat</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={this.unfollow}>
                                                            <Text style={{ fontSize: 18, width: 100, borderWidth: 1.5, borderRadius: 25, borderColor: '#FF847C', textAlign: 'center', marginLeft: 5 }}>UnFollow</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                        <View />

                                                    )}
                                            </View>
                                        )}
                                </View>

                            </View>

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
                                    {this.state.ploaded == true ? (
                                        <View style={{ flexDirection: 'row' }}>
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

                ) : (
                        <View style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                            <ImageBackground source={{ uri: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/02/24/17/chef.jpg?w968h681' }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                                <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    <PacmanIndicator size={70} color="white" />
                                </ImageBackground>
                            </ImageBackground>
                        </View>

                    )}

            </View>
        );
    }
}
export default userProfile;