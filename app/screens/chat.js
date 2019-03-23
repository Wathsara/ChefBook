import React from 'react';
import {
    TouchableOpacity, Text, View, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, ToastAndroid,
    ScrollView, StyleSheet
} from 'react-native';
import {database, f} from "../../config/config";
import { SocialIcon } from 'react-native-elements';
import PTRView from 'react-native-pull-to-refresh';
class notification extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            refresh: false,
            loggedin: false,
            chatList: [],
            loaded: false,

        }
    }

    _refresh = () => {
        return new Promise((resolve) => {
            setTimeout(()=>{resolve()}, 2000)
            this.componentDidMount();
        });
    }

    timePlural = (s) => {
        if(s==1){
            return ' ago'
        }else{
            return 's ago'
        }
    }

    timeConvertor = (timestamp) => {
        var a = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - a)/ 1000 );

        var interval = Math.floor(seconds/31536000);
        if(interval > 1){
            return interval+' Year'+this.timePlural(interval);
        }

        var interval = Math.floor(seconds/2592000);
        if(interval > 1){
            return interval+' Month'+this.timePlural(interval);
        }

        var interval = Math.floor(seconds/86400);
        if(interval > 1){
            return interval+' Day'+this.timePlural(interval);
        }

        var interval = Math.floor(seconds/3600);
        if(interval > 1){
            return interval+' Hour'+this.timePlural(interval);
        }

        var interval = Math.floor(seconds/60);
        if(interval > 1){
            return interval+' Minute'+this.timePlural(interval);
        }

        return Math.floor(seconds)+' Second'+this.timePlural(seconds)
    }


    fetchchats = (userId) => {

        var that = this;
        var userId = f.auth().currentUser.uid;
        database.ref('users').child(userId).child('userChats').on('value' , (function (snapshot) {
            const exist = (snapshot.exists());
            that.setState({
                chatList: [],
            })
            if (exist) {
                var data = snapshot.val();
                const exsist = (snapshot.exists());
                if(exsist){

                    var data = snapshot.val()
                    var chatList = that.state.chatList;
                    Object.keys(data).forEach(key => {
                       var tempdata = data[key];
                        Object.keys(tempdata).forEach(key => {
                           chatList.push({
                               posted:tempdata[key].posted,
                               lastMessage:tempdata[key].lastMessage,
                               name:tempdata[key].name,
                               avatar:tempdata[key].avatar,
                               id:tempdata[key].friend
                           })
                        });
                    });

                    console.log(chatList);
                    that.setState({
                        loaded:true
                    })
                }else{
                    that.setState({
                        chatList:[],
                        loaded:true
                    })
                }
            }
        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }
    renderMessageList = () => {
        this.state.chatList.sort((a,b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
        this.state.chatList.reverse();

        return this.state.chatList.map((items , index) => {
            return (
                <TouchableOpacity  onPress={()=> this.props.navigation.navigate('message' , { userId : items.id})}>
                    <View style={styles.cardContainer}>
                        <View style={styles.cardHedear}>
                            <View style={styles.profilePicArea}>
                                <Image style={styles.userImage} source={{uri:items.avatar}}/>
                            </View>
                            <View style={styles.userDetailArea}>
                                <View style={styles.userNameRow}>
                                    <Text style={styles.nameText}>{items.name}</Text>
                                    <Text style={styles.nameText}>{this.timeConvertor(items.posted)}</Text>
                                </View>
                                <View style={styles.meaasageRow}><Text style={styles.meaasageText}>{items.lastMessage}</Text></View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        });

    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if(user){
                that.setState({
                    loggedin: true,
                });
                that.fetchchats()
                var userId = f.auth().currentUser.uid;
                database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if(exist) data = snapshot.val();
                    console.log(data)
                    that.setState({
                        name:data
                    });
                });

                database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if(exist) data = snapshot.val();
                    console.log(data)
                    that.setState({
                        avatar:data,

                    });
                });


            }else{
                that.setState({
                    loggedin: false
                })


            }
        })

    }

    render() {
        return (
            <View  style={{flex: 1}}>

                <View style={{height: 70 , paddingTop: 30 , backgroundColor: '#FB8C00', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'center', alignItems: 'center' }}>
                    <Text style = {{fontSize: 24, color:'#ffffff'}}>Chat</Text>
                </View>
                <View style={styles.container}>
                    {this.state.loggedin == true ? (
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                        {this.renderMessageList()}
                    </ScrollView>
                    ):(
                        <View style={{flex:1, justifyContent:'center' , alignItems:'center'}}>
                            <TouchableOpacity>
                                <SocialIcon style={{width:200}} title='Sign In With Facebook'  button  type='facebook' />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>



            </View>
        );
    }
}
const styles = StyleSheet.create({
    cardContainer: {
        width:'90%',
        backgroundColor:'#fff',
        borderRadius:5,
        borderColor:'#FB8C00',
        borderWidth:1,
        // height:200,
        alignItems:'center',
        justifyContent:'flex-start',
        // marginBottom:20,
        marginTop:10
    },
    cardHedear:{
        marginLeft:10,
        marginTop:5,
        marginRight:10,
        // marginBottom:10,
        // width:deviceWidth,
        height:'auto',
        flexDirection:'row'
    },
    profilePicArea:{
        flex:0.25,
        alignItems:'center',
        justifyContent:'center'
    },
    userDetailArea:{
        flex:0.75,
        paddingLeft:8,
        flexDirection:'column',

    },
    userNameRow:{
        flex:0.4,        
        paddingTop:2,
        justifyContent:'space-between',
        
    },
    meaasageRow:{
        flex:0.6,
        // width:deviceWidth * 0.8,
        // backgroundColor:'blue'
    },
    userImage:{
        height:30,
        width:30,
        borderRadius:15
    },
    badgeCount:{
        backgroundColor:'#3d9bf9',
        height:20,
        width:20,
        borderRadius:10,
        alignItems:'center',
        justifyContent: 'center',
        position:'absolute',
        bottom:10,
        right:10
    },
    imageThumbnails:{
        height:70,
        width:70,
        borderRadius:35,
    },
    detailRow:{
        width:'100%',
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:5,
        marginTop:10
    },
    thumbnailRow:{
        flex:1,
        width:'100%',
        // backgroundColor:'red',
        flexDirection:'row',
        justifyContent:'space-evenly',
        paddingTop:30,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:30
    },

    //Font styles

    nameText:{
        fontSize:14,
        color:'#4e5861',
        fontWeight:'bold',
        flexWrap:'wrap'
    },
    meaasageText:{
        fontSize:16,
        color:'#95a3ad'
    },
    paraText:{
        fontSize:16,
        color:'#555f68'
    },
    countText:{
        color:'#fff',
        fontSize:12,
        fontWeight:'bold'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        width:'100%',

    },
    scrollView:{
        width:'100%',
        backgroundColor:'#e8e8e8',


    },
    scrollViewContent:{
        alignItems:'center',
        paddingBottom:10
    },

});
export default notification;