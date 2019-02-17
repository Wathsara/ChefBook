import React from 'react';
import { Text, View, Image , TouchableOpacity } from 'react-native';
import { f, auth, database , storage} from "../../config/config";

class profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loggedin: false

        }
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if(user){
                that.setState({
                    loggedin: true
                })
            }else{
                that.setState({
                    loggedin: false
                })


            }
        })
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
                            <Image source={{uri: 'https://amp.businessinsider.com/images/5b21635a1ae6621f008b51cd-750-562.jpg'}} style={{width:100 , height:100 , borderRadius:50}}/>
                        </View>
                        <View style={{flexDirection:'column', height:45}}>
                            <View style={{justifyContent:'center' , alignItems:'center'}}>
                                <Text style={{fontSize:18,fontWeight: 'bold' }}>Wathsara Daluwatta</Text>
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
                                    <Text style={{fontSize: 18, width:200 , borderWidth:1.5 ,borderRadius:25 , borderColor:'blue', textAlign:'center'}}>Edit Profile</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>


                </View>

            ) : (
                <View>

                   <Text>Please login</Text>

                </View>

            )}

        </View>
      );
    }
  }
 export default profile;