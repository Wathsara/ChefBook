import React from 'react';
import { TouchableOpacity, Text, View, FlatList, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { f, auth, database , storage} from "../../config/config";
import { Icon } from 'react-native-elements';
class home extends React.Component {
    constructor(props){
        super(props);
    ;
        this.state = {
            photo: [],
            refresh: false,
            loading: true
        }

    }

    componentDidMount = () => {
        this.loadFeed();



    }

    loadFeed = () => {
        this.setState({
            refresh:true,
            photo: []

        });

        var that = this;
        database.ref('recepies').orderByChild('posted').once('value').then(function (snapshot) {
            const exsist = (snapshot.val() != null);
            if(exsist) data = snapshot.val();
            // console.log(data);
            var photo = that.state.photo;
            for(var photos in data){
                let photoO = data[photos];
                let tempId = photos;
                database.ref('users').child(photoO.author).once('value').then(function (snapshot) {
                    const exsist = (snapshot.val() != null);
                    if(exsist) data = snapshot.val();


                    photo.push({
                        id:tempId,
                        url: photoO.image,
                        fName: photoO.foodName,
                        author: data.username,
                        authorPhoto: data.avatar,
                        authorName: data.name,
                        posted: that.timeConvertor(photoO.posted),
                        authorId: photoO.author


                    });
                    console.log(photo);

                    that.setState({
                        refresh: false,
                        loading: false
                    });
                }).catch(error => console.log(error));


                }

        }).catch(error => console.log(error));

    }

    loadNew = () => {
        this.loadFeed();

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
    render() {
      return (
        <View style={{flex: 1}}>
            <View style={{height: 70 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'center', alignItems: 'center' }}>
                <Text style = {{fontSize: 24}}>Home</Text>
            </View>

            { this.state.loading == true ? (
                <View style={{flex: 1 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style = {{fontSize: 18}}>LOADING ...</Text>
                </View>
            ): (
                <FlatList
                refreshing = {this.state.refresh}
                onRefresh = {this.loadNew}
                data = {this.state.photo}
                keyExtractor = {(item , index) => index.toString()}
                style={{flex:1}}
                renderItem={({item , index}) => (
                    <View key={index} style={{width: '100%', marginBottom: 10 , borderBottomWidth:1.5, borderColor:'#7CFC00', overflow:'hidden', justifyContent: 'space-between'}}>
                        <View style={{flexDirection:'row', width:'100%', padding:10 ,justifyContent: 'space-between'}}>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity style={{flexDirection:'row'}} onPress={() => this.props.navigation.navigate('userProfile' , { userId : item.authorId})}>
                                    <Image source={{uri: item.authorPhoto}} style={{width:30 , height:30, borderRadius:100}}/>
                                    <Text>{ item.authorName}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text>{ item.posted}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('recipe' , { id : item.id})}>
                                <ImageBackground source={{uri: item.url }} style={{height: 275 , width: '100%' , resizeMode: 'cover'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 275 , width: '100%' , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 32 , color: 'white', textAlign: 'center'}}>{ item.fName}</Text>

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
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('comment' , { recipeId : item.id})}>
                                        <Image source={{uri:'https://cdn1.iconfinder.com/data/icons/social-object-set-2-1/74/42-512.png'}} style={{width:30 , height:30}}/>
                                    </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                />
            )}

        </View>

      );
    }
  }
 export default home;