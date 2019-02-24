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
            notificationsList: [],
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


    fetchInfo = (userId) => {

        this.setState({
            notificationsList: []
        });

        var that = this;
        database.ref('notifications').child(userId).orderByChild('posted').on('value' , (function (snapshot) {
            const exsist = (snapshot.val() != null);
            that.setState({
                notificationsList:[],
                loaded:true
            })
            if(exsist){

                data = snapshot.val();

                var notificationsList = that.state.notificationsList;
                for(var noti in data){
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
                    loaded:true
                })
            }else{
                that.setState({
                    notificationsList:[],
                    loaded:true
                })
            }
        }),function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }
    renderNotifications = () => {
        this.state.notificationsList.sort((a,b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
        this.state.notificationsList.reverse();

        return this.state.notificationsList.map((items , index) => {
            {console.log(items.image)}
            return (

                <View>
                    <View key={index} style={{ borderColor:'grey' , borderWidth:1 , marginTop:3 , height:'auto'}}>
                        <View style={{flexDirection:'row', width:'100%', padding:10 ,justifyContent: 'space-between'}}>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity style={{flexDirection:'row'}} onPress={() => this.props.navigation.navigate('userProfile' , { userId : items.authorId})}>
                                    <Image source={{uri: items.image}} style={{width:30 , height:30, borderRadius:100}}/>
                                    <Text>{ items.author}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text>{ this.timeConvertor(items.posted)}</Text>
                        </View>
                        <View style={{flexWrap:'wrap'}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('comment' , { recipeId : items.recipeId})}>
                                <Text style={{fontSize:16,paddingHorizontal:15}}> {items.notification} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
                var userId = f.auth().currentUser.uid;
                that.fetchInfo(userId);
            }else{
                that.setState({
                    loggedin: false
                })


            }
        })

    }
    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if(user){
                that.setState({
                    loggedin: true,
                });
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
                <View style={{flexDirection:'row', height: 70 , paddingTop: 30 , backgroundColor: '#FB8C00', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{textAlign:'left'}} onPress={() => this.props.navigation.goBack()}>
                        <Text style={{fontWeight:'bold', padding:10 , fontSize:14 , width:100}}>Back</Text>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 20}}>Thuhini</Text>
                    <Text style = {{fontSize: 18, width:100}}></Text>
                </View>
                <View style={styles.container}>
                    {this.state.loggedin == true ? (
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

                        <View style={styles.cardContainerReciever}>
                            <View style={styles.cardHedear}>
                                <View style={styles.profilePicArea}>
                                    <Image style={styles.userImage} source={{uri:'https://graph.facebook.com/1647484025351983/picture'}}/>
                                    {this.props.count>0 &&
                                    <View style={styles.badgeCount}>
                                        <Text style={styles.countText}>{this.props.count}</Text>
                                    </View>
                                    }
                                </View>
                                <View style={styles.userDetailArea}>
                                    <View style={styles.userNameRow}><Text style={styles.nameText}></Text></View>
                                    <View style={styles.meaasageRow}><Text style={styles.meaasageText}>Hi There I am Using Watsapp</Text></View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardContainerSender}>
                            <View style={styles.cardHedear}>
                                <View style={styles.userDetailArea}>
                                    <View style={styles.userNameRow}><Text style={styles.nameText}></Text></View>
                                    <View style={styles.meaasageRow}><Text style={styles.meaasageText}>Hi There I am Using Watsapp</Text></View>
                                </View>
                                <View style={styles.profilePicArea}>
                                    <Image style={styles.userImage} source={{uri:'https://graph.facebook.com/1647484025351983/picture'}}/>
                                    {this.props.count>0 &&
                                    <View style={styles.badgeCount}>
                                        <Text style={styles.countText}>{this.props.count}</Text>
                                    </View>
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                        ):(
                        <View style={{flex:1, justifyContent:'center' , alignItems:'center'}}>
                            <TouchableOpacity>
                                <SocialIcon style={{width:200}} title='Sign In With Facebook'  button  type='facebook' />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View>
                    {this.state.loggedin == true ? (
                    <KeyboardAvoidingView style={{padding:10,marginBottom:10}} enabled={true} behavior = "padding">
                        <View>
                            <TextInput underlineColorAndroid = "#428AF8" style={{borderRadius:5, borderColor:'grey' , marginHorizontal:5, marginVertical:5 , padding:5 }}
                                       placeholder={'Enter Message Here'}
                                       editable={true}
                                       multiline={false}
                                       maxlength={100}
                                       onChangeText={(text) => this.setState({newComment:text}) }
                            />
                            <TouchableOpacity onPress={this.postComment} style={{alignSelf:'center' , marginHorizontal:'auto', width:90, backgroundColor:'purple' , borderRadius:5}}>
                                <Text style={{textAlign:'center', color:'white' , fontSize:14}}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                        ):(
                        <View></View>
                    )}
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    cardContainerReciever: {
        flex:1,
        width:'70%',
        backgroundColor:'#fff',
        borderRadius:5,
        borderColor:'#FB8C00',
        borderWidth:1,
        // height:200,
        alignItems:'center',
        justifyContent:'flex-start',
        // marginBottom:20,
        marginTop:10,
        marginLeft:3,
    },
    cardContainerSender: {
        flex:1,
        width:'70%',
        backgroundColor:'#fff',
        borderRadius:5,
        borderColor:'#FB8C00',
        borderWidth:1,
        // height:200,
        alignItems:'center',
        alignSelf:'flex-end',
        // marginBottom:20,
        marginTop:5,
        marginRight:3
    },
    cardHedear:{
        marginLeft:10,
        marginTop:5,
        marginRight:10,
        // marginBottom:10,
        // width:deviceWidth,
        height:80,
        flexDirection:'row'
    },
    profilePicArea:{
        flex:0.10,
        alignItems:'center',
        justifyContent:'center'
    },
    userDetailArea:{
        flex:0.75,
        paddingLeft:8,
        // width:deviceWidth * 0.8,
        flexDirection:'column',
        // backgroundColor:'green'
    },
    userNameRow:{
        flex:0.2,
        // width:deviceWidth * 0.8,
        // backgroundColor:'yellow',
        paddingTop:10
    },
    meaasageRow:{
        flex:0.6,

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
        fontWeight:'bold'
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
        paddingBottom:10
    },

});
export default notification;