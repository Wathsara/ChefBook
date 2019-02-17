import React from 'react';
import { Text, View, Image , TouchableOpacity } from 'react-native';
import { f, auth, database , storage} from "../../config/config";

class userProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: false

        }
    }

    check = () => {
        var params = this.props.navigation.state.params;
        if(params){
            if(params.userId){
                this.setState({
                    userId: params.userId
                });
                this.fetchInfo(params.userId);

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
    componentDidMount = () => {
        this.check();
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
                            <Text style = {{fontSize: 20}}>@{this.state.userName}</Text>
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
                                        <Text style={{fontSize:18,fontWeight: 'bold' }}>256</Text>
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

                                <View style={{marginLeft:15 , justifyContent:'center' , alignItems:'center'}}>
                                    <TouchableOpacity >
                                        <Text style={{fontSize: 18, width:200 , borderWidth:1.5 ,borderRadius:25 , borderColor:'blue', textAlign:'center'}}>Follow</Text>
                                    </TouchableOpacity>
                                </View>

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