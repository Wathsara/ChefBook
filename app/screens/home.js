import React from 'react';
import { TouchableOpacity, Text, View, FlatList, Image, ImageBackground } from 'react-native';

class home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            photo: [0,1,2,3,4],
            refresh: false
        }
    }

    loadnew = () => {
        this.setState({
            refresh: true
        });
        this.setState({
            photo: [0,4],
            refresh: false
        });

    }
    render() {
      return (
        <View style={{flex: 1}}>
            <View style={{height: 70 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'center', alignItems: 'center' }}>
                <Text style = {{fontSize: 18}}>Home</Text>
            </View>
            <FlatList
                refreshing = {this.state.refresh}
                onRefresh = {this.loadnew}
                data = {this.state.photo}
                keyExtractor = {(item , index) => index.toString()}
                style={{flex:1}}
                renderItem={({item , index}) => (
                    <View key={index} style={{width: '100%', marginBottom: 10 , borderBottomWidth:1.5, borderColor:'#7CFC00', overflow:'hidden', justifyContent: 'space-between'}}>
                        <View style={{flexDirection:'row', width:'100%', padding:10 ,justifyContent: 'space-between'}}>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity style={{flexDirection:'row'}}>
                                    <Image source={{uri:'https://amp.businessinsider.com/images/5b21635a1ae6621f008b51cd-750-562.jpg'}} style={{width:30 , height:30, borderRadius:100}}/>
                                    <Text>Thuhini Lourdes</Text>
                                </TouchableOpacity>
                            </View>
                            <Text>2min ago</Text>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <ImageBackground source={{uri: 'https://dev-recipes.instantpot.com/wp-content/uploads/2017/06/Instant-Pot-Cajun-Chicken-Rice-Image.jpg'}} style={{height: 275 , width: '100%' , resizeMode: 'cover'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 275 , width: '100%' , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 32 , color: 'white', textAlign: 'center'}}>Thuhi Rice</Text>

                                    </ImageBackground>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View style={{flexDirection:'row', width:'100%', padding:10 ,justifyContent: 'space-between'}}>
                                <View style={{flexDirection:'row'}}>
                                    <TouchableOpacity>
                                         <Image source={{uri:'https://www.clipartmax.com/png/middle/166-1667680_face-savoring-food-icon-tasty-emoji.png'}} style={{width:30 , height:30}}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Image source={{uri:'https://cdn4.iconfinder.com/data/icons/smiley-5-1/32/421-512.png'}} style={{width:30 , height:30 , marginLeft:12}}/>
                                    </TouchableOpacity>
                                </View>
                                    <TouchableOpacity>
                                        <Image source={{uri:'https://cdn1.iconfinder.com/data/icons/social-object-set-2-1/74/42-512.png'}} style={{width:30 , height:30}}/>
                                    </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />

        </View>

      );
    }
  }
 export default home;