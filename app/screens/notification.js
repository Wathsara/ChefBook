import React from 'react';
import { TouchableOpacity, Text, View , TextInput , Image , ActivityIndicator , KeyboardAvoidingView , ToastAndroid , ScrollView} from 'react-native';
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
        database.ref('notifications').child(userId).orderByChild('posted').once('value').then(function (snapshot) {
            const exsist = (snapshot.val() != null);

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
        }).catch(error => console.log(error))

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

    render() {
        return (
            <PTRView onRefresh={this._refresh} >
            <View style={{flex: 1}} >
                <View style={{flexDirection:'row', height: 70 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'center', alignItems: 'center' }}>
                    <Text style = {{fontSize: 20}}>Notifications</Text>

                </View>
                <View style={{flex:1}}>
                    {this.state.loaded == true ? (
                        <View style={{flex:1}}>
                            {this.state.notificationsList.length == 0 ? (
                                <View style={{flex: 1 , justifyContent:'center', alignItems:'center'}}>
                                    <Text>No Notifications..</Text>
                                </View>
                            ) : (
                                <ScrollView style={{flex: 1}}>
                                    {this.renderNotifications()}
                                </ScrollView>
                            )}

                        </View>
                    ):(
                        <View style={{flex: 1, justifyContent:'center' , alignItems:'center'}}>
                            <ActivityIndicator size="large" color="#0000ff"/>
                            <Text>Loading Notifications..</Text>
                        </View>
                    )}

                </View>


                {this.state.loggedin == true ? (
                    <KeyboardAvoidingView style={{padding:15,marginBottom:10}} enabled={true} behavior = "padding">

                    </KeyboardAvoidingView>
                ) : (
                    <View style={{flex:1, justifyContent:'center' , alignItems:'center'}}>
                        <TouchableOpacity>
                            <SocialIcon style={{width:200}} title='Sign In With Facebook'  button  type='facebook' />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            </PTRView>
        );
    }
}
export default notification;