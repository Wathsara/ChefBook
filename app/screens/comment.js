import React from 'react';
import { TouchableOpacity, Text, View , TextInput , Image , ActivityIndicator , KeyboardAvoidingView , ToastAndroid , ScrollView} from 'react-native';
import {database, f} from "../../config/config";
import { SocialIcon } from 'react-native-elements';
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

    check = () => {
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
        this.setState({
            commentList: []
        });

        var that = this;
        database.ref('comments').child(recipeId).orderByChild('posted').once('value').then(function (snapshot) {
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
                // console.log(commentsList);
                that.setState({
                    loaded:true
                })
            }else{
                that.setState({
                    commentsList:[],
                    loaded:true
                })
            }
        }).catch(error => console.log(error))

    }
    renderComments = () => {
        this.state.commentsList.sort((a,b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
        this.state.commentsList.reverse();

        return this.state.commentsList.map((items , index) => {
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
                            <Text style={{fontSize:16,paddingHorizontal:15}}> {items.comment} </Text>
                        </View>
                    </View>
                </View>
            )
        });

    }

    componentDidMount = () => {
        this.check();
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

            this.reload()


        }
    }

    reload = () => {
        this.setState({
            commentsList:[],

        })
        this.fetchInfo(this.state.recipeId);
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flexDirection:'row', height: 70 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{textAlign:'left'}} onPress={() => this.props.navigation.goBack()}>
                        <Text style={{fontWeight:'bold', padding:10 , fontSize:14 , width:100}}>Back</Text>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 20}}>Comments</Text>
                    <Text style = {{fontSize: 18, width:100}}></Text>
                </View>
                <View style={{flex:1}}>
                    {this.state.loaded == true ? (
                        <View style={{flex:1}}>
                            {this.state.commentsList.length ==0 ? (
                                <View style={{flex: 1 , justifyContent:'center', alignItems:'center'}}>
                                    <Text>No comments..</Text>
                                </View>
                            ) : (
                                <ScrollView style={{flex: 1}}>
                                    {this.renderComments()}
                                </ScrollView>
                            )}

                        </View>
                    ):(
                        <View style={{flex: 1, justifyContent:'center' , alignItems:'center'}}>
                            <ActivityIndicator size="large" color="#0000ff"/>
                            <Text>Loading Comments..</Text>
                        </View>
                    )}

                </View>


                {this.state.loggedin == true ? (
                    <KeyboardAvoidingView style={{padding:15,marginBottom:10}} enabled={true} behavior = "padding">
                        <TextInput underlineColorAndroid = "#428AF8" style={{borderRadius:5, borderColor:'grey' , marginHorizontal:10, marginVertical:10 , padding:5, height:75 }}
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
export default comment;