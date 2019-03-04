import React from 'react';
import { Text, View, Image , TouchableOpacity , Dimensions , ScrollView, TouchableHighlight } from 'react-native';
import { f, auth, database , storage} from "../../config/config";
import { Icon,SocialIcon  } from 'react-native-elements';
var {width , height} = Dimensions.get('window');
import { Permissions, Notifications } from 'expo';
class profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loggedin: false,
            active: 0,
            photo: [],
            loaded: false,
            follow:[],
            following:[]
        }



    }
    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if(user){

                that.setState({
                    loggedin: true,
                    active:0
                });
                let us = f.auth().currentUser;
                let userId = f.auth().currentUser.uid;
                that.registerForPushNotificationsAsync(userId)

                database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) {
                        var data= snapshot.val();
                        that.setState({
                            name: data
                        })
                        database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
                            const exist = (snapshot.val() != null);
                            if (exist){
                                var data = snapshot.val();
                                that.setState({
                                    avatar: data,
                                });
                            }

                        })
                        database.ref('users').child(userId).child('follower').on('value' , (function (snapshot) {
                            const exsist = (snapshot.val() != null);
                            if( exsist) {
                                var data=snapshot.val();
                                console.log(data)
                                var followers = that.state.follow
                                for(var follow in data){
                                    let followObj = data[follow]
                                    followers.push({
                                        name:followObj.name,
                                        avatar:followObj.avatar,
                                        friend:followObj.friend
                                    });
                                }
                            }else{
                                that.setState({
                                    follow:[]
                                })
                            }

                        }),function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });

                        database.ref('users').child(userId).child('following').on('value' , (function (snapshot) {
                            const exsist = (snapshot.val() != null);
                            if( exsist) {
                                var data=snapshot.val();
                                let followings = that.state.following
                                for(var following in data){
                                    let followingObj = data[following]
                                    followings.push({
                                        name:followingObj.name,
                                        avatar:followingObj.avatar,
                                        friend:followingObj.friend
                                    });
                                }
                            }else{
                                that.setState({
                                    following:[]
                                })
                            }

                        }),function (errorObject) {
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
                        database.ref('users/' +userId).set(newUser).catch((error) => console.log(error));
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
                        database.ref('users').child(userId).child('follower').on('value' , (function (snapshot) {
                            const exsist = (snapshot.val() != null);
                            if( exsist) {
                                var data=snapshot.val();
                                console.log(data)
                                var followers = that.state.follow
                                for(var follow in data){
                                    let followObj = data[follow]
                                    followers.push({
                                        friend:followObj.friend,
                                        name:followObj.name,
                                        avatar:followObj.avatar,
                                    });
                                }
                            }else{
                                that.setState({
                                    follow:[]
                                })
                            }

                        }),function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });

                        database.ref('users').child(userId).child('following').on('value' , (function (snapshot) {
                            const exsist = (snapshot.val() != null);
                            if( exsist) {
                                var data=snapshot.val();
                                let followings = that.state.following
                                for(var following in data){
                                    let followingObj = data[following]
                                    followings.push({
                                        friend: followingObj.friend,
                                        name: followingObj.name,
                                        avatar: followingObj.avatar,
                                    });
                                }
                            }else{
                                that.setState({
                                    following:[]
                                })
                            }

                        }),function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                        that.loadFeed();
                    }

                })

            }else{
                that.setState({
                    loggedin: false,
                    photo:[]
                })


            }
        })

    }

    loadFeed = () => {

        var uid = f.auth().currentUser.uid;
        this.setState({
            photo: [],
            active:0

        });

        var that = this;
        database.ref('users').child(uid).child('recepies').on('value' , (function (snapshot) {
            that.setState({
                photo: []
            });
            const exsist = (snapshot.val() != null);
            if(exsist) {
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

                    loaded: true
                })
            }

         }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    photoClick = (active) => {
        this.setState({
            active:active
        })

    }

    postClick = (active) => {
        this.setState({
            active:active
        })

    }

    saveClick = (active) => {
        this.setState({
            active:active
        })


    }


    renderSection = () => {


        if(this.state.active == 0 && this.state.loggedin == true){

            return this.state.photo.map((image , index) => {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('recipe' , { id : image.id})}>
                        <View key={index} style={[{width:(width)/3} , {height:(width)/3}]}>
                            <Image source={{uri:image.url}} style={{width:undefined , height:undefined , flex:1 , marginHorizontal:1 , marginVertical:2}}/>
                        </View>
                    </TouchableOpacity>
                )
            });
        }

        if(this.state.active == 1){
            return (
                <View>
                    <Text>Post Section</Text>
                </View>
            )
        }

        if(this.state.active == 2){
            return (
                <View>
                    <Text>Saved Section</Text>
                </View>
            )
        }
        this.setState({
            photo: []
        });
    }


    logout = () => {
        this.setState({
            loggedin: false,
            active:0,
            photo: [],
        });
        f.auth().signOut();


    }


    loginWithFacebook = async () => {
        const { type , token } = await Expo.Facebook.logInWithReadPermissionsAsync(
            '558501394651388' ,
            { permissions : ['email' , 'public_profile']}
        )
        if(type == 'success'){
            const credentials = f.auth.FacebookAuthProvider.credential(token) ;
            f.auth().signInWithCredential(credentials).catch((error) => {
                console.log(error)
            });
            this.setState({
               photo: [],
            });

        }

    }

    registerForPushNotificationsAsync = async(userId) => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } =  await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        console.log("token = " + token )

    }




    render() {

      return (
        <View style={{flex:1}}>
            <View style={{height: 70 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'center', alignItems: 'center' }}>
               <Text style = {{fontSize: 18}}>Profile</Text>
            </View>
            { this.state.loggedin == true ? (
                <View style={{flex:1}}>

                    <View style={{flexDirection:'row' , justifyContent:'space-evenly' , padding:5}}>
                        <View>
                            <Image source={{uri: this.state.avatar}} style={{width:50 , height:50 , borderRadius:25}}/>
                        </View>
                        <View style={{flexDirection:'column', height:45}}>
                            <View style={{justifyContent:'center' , alignItems:'center'}}>
                                <Text style={{fontSize:18,fontWeight: 'bold' }}>{ this.state.name}</Text>
                            </View>
                            <View style={{marginLeft:15 , justifyContent:'center' , alignItems:'center', flexDirection:'row'}}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('following' , { followingList : this.state.following})}>
                                    <Text style={{fontSize: 18, width:100 , borderWidth:1.5 ,borderRadius:25 , borderColor:'blue', textAlign:'center'}}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.logout}>
                                    <Text style={{fontSize: 18, width:100 , borderWidth:1.5 ,borderRadius:25 , borderColor:'blue', textAlign:'center' , marginLeft:5}}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row' , justifyContent:'space-evenly' , padding:5, marginVertical:25}}>
                        <TouchableOpacity style={{marginLeft:5 , justifyContent:'center' , alignItems:'center'}}>
                            <Text style={{fontSize:18,fontWeight: 'bold' }}>{ this.state.photo.length }</Text>
                            <Text>Recepies</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate('follow' , { followList : this.state.follow})} style={{marginLeft:15 , justifyContent:'center' , alignItems:'center' }}  >
                            <Text style={{fontSize:18, fontWeight: 'bold' }}>{this.state.follow.length}</Text>
                            <Text>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('following' , { followingList : this.state.following})} >
                            <View style={{marginLeft:15 , justifyContent:'center' , alignItems:'center' }}>
                                <Text style={{fontSize:18, fontWeight: 'bold' }}>{this.state.following.length}</Text>
                                <Text>Following</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1, marginTop:20}}>
                        <View style={{flexDirection:'row', justifyContent:'space-around' , height:15 , alignItems:'center'}}>
                            <TouchableOpacity onPress={() => this.photoClick(0) }  >
                                <Icon name='ios-images'   type='ionicon'  color='#517fa4'  />

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.saveClick(2) } active={ this.state.active == 2 }>
                                <Icon
                                    name='save'
                                    type='font-awesome'
                                    color='#517fa4'
                                />
                            </TouchableOpacity>

                        </View>

                        <View style={{flex:1}}>
                            <ScrollView style={{flex:1, marginTop:10}}>
                                {this.state.loaded == true && this.state.loggedin== true ? (
                                    <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
                                        {this.renderSection()}

                                    </View>
                                ) : (
                                    <View style={{flexDirection:'row'}}>


                                    </View>
                                )}

                            </ScrollView>
                        </View>
                    </View>



                </View>

            ) : (
                <View style={{flex:1, justifyContent:'center' , alignItems:'center'}}>
                    <TouchableOpacity onPress={this.loginWithFacebook}>
                        <SocialIcon style={{width:200}} title='Sign In With Facebook'  button  type='facebook' />
                    </TouchableOpacity>

                </View>

            )}

        </View>
      );
    }
  }
 export default profile;