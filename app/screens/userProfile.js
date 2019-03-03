import React from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { f, auth, database , storage} from "../../config/config";
import { Icon } from 'react-native-elements';
var {width , height} = Dimensions.get('window');
class userProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            active: 0,
            photo: [],
            ploaded: false

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
        if(params){
            if(params.userId){
                this.setState({
                    userId: params.userId
                });
                this.fetchInfo(params.userId);
                this.loadFeed(params.userId);
                var that=this;
                database.ref('users').child(id).child('following').child(params.userId).on('value' , (function (snapshot) {
                    if(snapshot.val()){
                        that.setState({
                            following:true
                        })
                    }

                }),function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            }
        }

    }

    fetchInfo = (userId) => {

        var that = this;
        database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();
            that.setState({
                name:data
            });
        })

        database.ref('users').child(userId).child('userName').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();
            that.setState({
                userName:data
            });
        })

        database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();
            that.setState({
                avatar:data,
                loaded:true
            });
        })
    }

    loadFeed = (uid) => {


        this.setState({
            photo: [],
            active:0

        });

        var that = this;
        database.ref('users').child(uid).child('recepies').once('value').then(function (snapshot) {
            const exsist = (snapshot.val() != null);
            if( exsist) {
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


        if(this.state.active == 0){

            return this.state.photo.map((image , index) => {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('recipe' , { id : image.id})}>
                        <View key={index} style={[{width:(width)/3} , {height:(width)/3}]}>
                            <Image source={{uri:image.url}} style={{width:undefined , height:undefined , flex:1}}/>
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
    }

    componentDidMount = () => {
        this.check();
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if(user){
                that.setState({
                    loggedin: true,
                });

            }else{
                that.setState({
                    loggedin: false
                })


            }
        })

    }

    follow = () => {
        var date = Date.now();
        var posted = Math.floor(date / 1000 )

        var fid = this.state.userId;
        var fName = this.state.name;
        var fPic = this.state.avatar;
        var myId = f.auth().currentUser.uid;
        var myName = f.auth().currentUser.displayName;
        var myPic = f.auth().currentUser.photoURL;

        var follower = {
            name:myName,
            avatar:myPic
        }

        var following = {
            name:fName,
            avatar: fPic
        }

        var notification = {
            author:myName,
            authorId:myId,
            posted:posted,
            avatar:myPic,
            message:"Followed You",
        }
        database.ref('/notifications/'+fid+'/'+this.uniqueId()).set(notification);
        database.ref('/users/'+myId+'/following/'+fid).set(following);
        database.ref('/users/'+fid+'/follower/'+myId).set(follower);
        this.setState({
            following:true
        })


    }

    unfollow = () => {

        var fid = this.state.userId;
       var myId = f.auth().currentUser.uid;



        database.ref('/users/'+myId+'/following/'+fid).remove();
        database.ref('/users/'+fid+'/follower/'+myId).remove();
        this.setState({
            following:false
        })

    }



    render() {
        return (
            <View style={{flex:1}}>

                { this.state.loaded == true ? (

                    <View style={{flex:1}}>
                        <View style={{flexDirection:'row', height: 70 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity style={{textAlign:'left'}} onPress={() => this.props.navigation.goBack()}>
                                <Text style={{fontWeight:'bold', padding:10 , fontSize:14 , width:100}}>Back</Text>
                            </TouchableOpacity>
                            <Text style = {{fontSize: 14, flexWrap:'wrap'}}>{this.state.userName}</Text>
                            <Text style = {{fontSize: 18, width:100}}></Text>
                        </View>

                        <View style={{flexDirection:'row' , justifyContent:'space-evenly' , padding:5}}>
                            <View>
                                <Image source={{uri: this.state.avatar}} style={{width:100 , height:100 , borderRadius:50}}/>
                            </View>
                            <View style={{flexDirection:'column', height:45}}>
                                <View style={{justifyContent:'center' , alignItems:'center'}}>
                                    <Text style={{fontSize:18,fontWeight: 'bold' }}>{this.state.name}</Text>
                                </View>
                                <View style={{flexDirection:'row' , justifyContent:'space-evenly' , padding:5, marginVertical:25}}>
                                    <View style={{marginLeft:5 , justifyContent:'center' , alignItems:'center'}}>
                                        <Text style={{fontSize:18,fontWeight: 'bold' }}>{this.state.photo.length}</Text>
                                        <Text>Recepies</Text>
                                    </View>
                                    <View style={{marginLeft:15 , justifyContent:'center' , alignItems:'center'}}>
                                        <Text style={{fontSize:18, fontWeight: 'bold' }}>2563</Text>
                                        <Text>Followers</Text>
                                    </View>
                                    <View style={{marginLeft:15 , justifyContent:'center' , alignItems:'center' }}>
                                        <Text style={{fontSize:18, fontWeight: 'bold' }}>256</Text>
                                        <Text>Following</Text>
                                    </View>
                                </View>

                                <View>
                                    {this.state.userId != f.auth().currentUser.uid && this.state.loaded==true && this.state.following != true ? (

                                        <View style={{marginLeft:15 , justifyContent:'center' , alignItems:'center', flexDirection:'row'}}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('message' , { userId : this.state.userId})}>
                                                <Text style={{fontSize: 18, width:100 , borderWidth:1.5 ,borderRadius:25 , borderColor:'blue', textAlign:'center'}}>Chat</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this.follow}>
                                                <Text style={{fontSize: 18, width:100 , borderWidth:1.5 ,borderRadius:25 , borderColor:'blue', textAlign:'center' , marginLeft:5}}>Follow</Text>
                                            </TouchableOpacity>
                                        </View>
                                        ):(
                                        <View>
                                            {this.state.following != false ? (
                                                <View style={{marginLeft:15 , justifyContent:'center' , alignItems:'center', flexDirection:'row'}}>
                                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('message' , { userId : this.state.userId})}>
                                                        <Text style={{fontSize: 18, width:100 , borderWidth:1.5 ,borderRadius:25 , borderColor:'blue', textAlign:'center'}}>Chat</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={this.unfollow}>
                                                        <Text style={{fontSize: 18, width:100 , borderWidth:1.5 ,borderRadius:25 , borderColor:'blue', textAlign:'center' , marginLeft:5}}>UnFollow</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                ):(
                                                    <View/>

                                            )}
                                        </View>
                                        )}
                                </View>

                            </View>

                        </View>
                        <View style={{flex:1, marginTop:20}}>
                            <View style={{flexDirection:'row', justifyContent:'space-around' , height:15 , alignItems:'center'}}>
                                <TouchableOpacity onPress={() => this.photoClick(0) }  >
                                    <Icon name='ios-images' type='ionicon'  color='#517fa4'  />
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
                                    {this.state.ploaded == true ? (
                                        <View style={{flexDirection:'row'}}>
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
                    <View style={{flex:1 , justifyContent:'center', alignItems: 'center'}}>

                        <Text>LOADING...</Text>

                    </View>

                )}

            </View>
        );
    }
}
export default userProfile;