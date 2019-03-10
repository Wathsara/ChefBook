import React from 'react';
import {
    TouchableOpacity, Text, View, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, ToastAndroid,
    ScrollView, StyleSheet
} from 'react-native';
import {database, f} from "../../config/config";
import { SocialIcon } from 'react-native-elements';
import PTRView from 'react-native-pull-to-refresh';
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['name'];

class follow extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            refresh: false,
            loggedin: false,
            commentsList: [],
            loaded: false,
            searchTerm: "",


        }
    }
    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }
    _refresh = () => {
        return new Promise((resolve) => {
            setTimeout(()=>{resolve()}, 2000)
            this.reload();
        });
    }

    check = async () => {

        var params = this.props.navigation.state.params;

        if(params){
            if(params.followList){
                this.setState({
                    followList: params.followList,
                    loaded:true
                });
            }
        }

    }

    renderFollowers = () => {
        const filtered = this.state.followList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        return filtered.map((items , index) => {
            {console.log(items.image)}
            return (
                <View key={items.name} style={styles.cardContainer}>
                    <View style={styles.cardHedear}>
                        <View style={styles.profilePicArea}>
                            <TouchableOpacity  onPress={() => this.props.navigation.navigate('userProfile' , { userId : items.friend})}>
                                <Image style={styles.userImage} source={{uri: items.avatar}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userDetailArea}>
                            <View style={styles.userNameRow}>
                                <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between' , flexWrap:'wrap'}} onPress={() => this.props.navigation.navigate('userProfile' , { userId : items.friend})}>
                                    <Text style={styles.nameText}>{items.name}</Text>
                                </TouchableOpacity>
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

    render() {
        return (

            <View style={{flex: 1}}>
                <View style={{flexDirection:'row', height: 70 , paddingTop: 30 , backgroundColor: '#FB8C00', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{textAlign:'left'}} onPress={() => this.props.navigation.goBack()}>
                        <Text style={{fontWeight:'bold', padding:10 , fontSize:14 , width:100}}>Back</Text>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 20}}>Followers</Text>
                    <Text style = {{fontSize: 18, width:100}}></Text>
                </View>
                <PTRView onRefresh={this._refresh} >
                    <View style={{flex:1}}>
                        {this.state.loaded == true ? (
                            <View style={{flex:1}}>
                                {this.state.commentsList.length ==0 ? (
                                    <View style={{flex: 1 , justifyContent:'center', alignItems:'center'}}>
                                        <Text>No Followers..</Text>
                                    </View>
                                ) : (
                                    <View style={styles.container}>
                                        <SearchInput
                                            onChangeText={(term) => { this.searchUpdated(term) }}
                                            style={styles.searchInput}
                                            placeholder="Search your Followers"
                                        />
                                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                                            {this.renderFollowers()}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                        ):(
                            <View style={{flex: 1, justifyContent:'center' , alignItems:'center'}}>
                                <ActivityIndicator size="large" color="#0000ff"/>
                                <Text>Loading Followers..</Text>
                            </View>
                        )}

                    </View>
                </PTRView>
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
    searchInput:{
        padding: 8,
        borderColor: '#CCC',
        borderWidth: 1,
        width:340,
        backgroundColor:'#fff',
        marginTop:3
    }

});
export default follow;