import React from 'react';
import {
    TouchableOpacity, Text, View, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, ToastAndroid,
    ScrollView, StyleSheet
} from 'react-native';
import {database, f} from "../../config/config";
import { SocialIcon } from 'react-native-elements';
import PTRView from 'react-native-pull-to-refresh';

class comment extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            refresh: false,
            loggedin: false,
            commentsList: [],
            loaded: false,
            newComment:'',
            newCommentId: this.uniqueId(),
            newNotificationId: this.uniqueId(),

        }
    }
    _refresh = () => {
        return new Promise((resolve) => {
            setTimeout(()=>{resolve()}, 2000)
            this.reload();
        });
    }

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
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

    check = async () => {

        var params = this.props.navigation.state.params;

        if(params){
            if(params.recipeId){
                this.setState({
                    recipeId: params.recipeId
                });
                this.fetchInfo(params.recipeId);
                var that = this;
                database.ref('recepies').child(params.recipeId).child('author').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if(exist) data = snapshot.val();
                    that.setState({
                        owner:data
                    });
                });


            }
        }

    }

    fetchInfo = (recipeId) => {

        var that = this;
        database.ref('comments').child(recipeId).orderByChild('posted').on("value" , (function (snapshot) {
            const exsist = (snapshot.val() != null);

            if(exsist){
                data = snapshot.val();

                var commentsList = that.state.commentsList;
                for(var comments in data){
                    let commentOBJ = data[comments]
                    commentsList.push({
                        image: commentOBJ.avatar,
                        author: commentOBJ.author,
                        authorId: commentOBJ.authorId,
                        comment: commentOBJ.comment,
                        posted: commentOBJ.posted,

                    });

                }
                console.log(commentsList);
                that.setState({
                    loaded:true
                })
            }else{
                that.setState({
                    commentsList:[],
                    loaded:true
                })
            }

        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }
    renderComments = () => {
        this.state.commentsList.sort((a,b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
        this.state.commentsList.reverse();
        return this.state.commentsList.map((items , index) => {
            {console.log(items.image)}
            return (
                <View style={styles.cardContainer}>
                    <View style={styles.cardHedear}>
                        <View style={styles.profilePicArea}>
                            <TouchableOpacity  onPress={() => this.props.navigation.navigate('userProfile' , { userId : items.authorId})}>
                                <Image style={styles.userImage} source={{uri: items.image}}/>
                            </TouchableOpacity>
                            {this.props.count>0 &&
                            <View style={styles.badgeCount}>
                                <Text style={styles.countText}>{this.props.count}</Text>
                            </View>
                            }
                        </View>
                        <View style={styles.userDetailArea}>
                            <View style={styles.userNameRow}>
                                <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between' , flexWrap:'wrap'}} onPress={() => this.props.navigation.navigate('userProfile' , { userId : items.authorId})}>
                                    <Text style={styles.nameText}>{items.author}</Text>
                                    <Text style={{alignSelf: 'flex-end'}}>{this.timeConvertor(items.posted)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.meaasageRow}>
                                <Text style={styles.meaasageText}>{items.comment}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            )
        });



    }

    componentDidMount = () => {
        this.check()

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
    postComment = () => {

        var comment = this.state.newComment;
        var recipeId = this.state.recipeId;
        var userId = f.auth().currentUser.uid;
        var date = Date.now();
        var posted = Math.floor(date / 1000 )
        var newCommentId = this.uniqueId()
        var newNotificationId = this.uniqueId()
        var that = this;



        var userName = this.state.name;
        var image = this.state.avatar;
        var owner = this.state.owner;
        var message = "Commented On Your Recipe"


        if(comment == '') {
            ToastAndroid.show('Please Enter A Comment', ToastAndroid.SHORT);

        }else{
            this.setState({
                comment: ''
            });
            var newCommentObject = {
               author:userName,
               authorId:userId,
               posted:posted,
               avatar:image,
               comment:comment
            }
            var notification = {
                author:userName,
                authorId:userId,
                posted:posted,
                avatar:image,
                message:message,
                recipe:recipeId
            }
            console.log("name "+ this.state.name );
            database.ref('/comments/'+recipeId+'/'+newCommentId).set(newCommentObject);
            if(userId != owner){
                database.ref('/notifications/'+owner+'/'+newNotificationId).set(notification);
            }

        }
    }


    render() {
        return (

            <View style={{flex: 1}}>
                <View style={{flexDirection:'row', height: 70 , paddingTop: 30 , backgroundColor: '#FB8C00', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{textAlign:'left'}} onPress={() => this.props.navigation.goBack()}>
                        <Text style={{fontWeight:'bold', padding:10 , fontSize:14 , width:100}}>Back</Text>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 20}}>Comments</Text>
                    <Text style = {{fontSize: 18, width:100}}></Text>
                </View>
                <PTRView onRefresh={this._refresh} >
                <View style={{flex:1}}>
                    {this.state.loaded == true ? (
                        <View style={{flex:1}}>
                            {this.state.commentsList.length ==0 ? (
                                <View style={{flex: 1 , justifyContent:'center', alignItems:'center'}}>
                                    <Text>No comments..</Text>
                                </View>
                            ) : (
                                <View style={styles.container}>
                                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                                        {this.renderComments()}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    ):(
                        <View style={{flex: 1, justifyContent:'center' , alignItems:'center'}}>
                            <ActivityIndicator size="large" color="#0000ff"/>
                            <Text>Loading Comments..</Text>
                        </View>
                    )}

                </View>
                </PTRView>


                {this.state.loggedin == true ? (
                    <KeyboardAvoidingView style={{padding:10,marginBottom:10}} enabled={true} behavior = "padding">
                        <TextInput underlineColorAndroid = "#428AF8" style={{borderRadius:5, borderColor:'grey' , marginHorizontal:10, marginVertical:10 , padding:5 }}
                                   placeholder={'Enter Comment Here'}
                                   editable={true}
                                   multiline={true}
                                   maxlength={750}
                                   onChangeText={(text) => this.setState({newComment:text}) }
                        />
                        <TouchableOpacity onPress={this.postComment} style={{alignSelf:'center' , marginHorizontal:'auto', width:90, backgroundColor:'purple' , borderRadius:5}}>
                            <Text style={{textAlign:'center', color:'white' , fontSize:14}}>Comment</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                ) : (
                    <View style={{flex:1, justifyContent:'center' , alignItems:'center'}}>
                        <TouchableOpacity>
                            <SocialIcon style={{width:200}} title='Sign In With Facebook'  button  type='facebook' />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

        );
    }
}
const styles = StyleSheet.create({
    cardContainer: {
        flex:1,
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
        height:80,
        flexDirection:'row'
    },
    profilePicArea:{
        flex:0.25,
        // width:deviceWidth * 0.2,
        // backgroundColor:'red',
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
        flex:0.4,

        // width:deviceWidth * 0.8,
        // backgroundColor:'yellow',
        paddingTop:10
    },
    meaasageRow:{
        flex:0.6,
        marginTop:5
        // width:deviceWidth * 0.8,
        // backgroundColor:'blue'
    },
    userImage:{
        height:60,
        width:60,
        borderRadius:30
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
        alignItems:'center',
        paddingBottom:10
    },

});
export default comment;