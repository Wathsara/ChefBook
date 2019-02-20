import React from 'react';
import { TouchableOpacity, Text, View, FlatList, Image, ImageBackground, ActivityIndicator, ScrollView } from 'react-native';
import { f, auth, database , storage} from "../../config/config";
import { Icon } from 'react-native-elements';
class home extends React.Component {
    constructor(props){
        super(props);
    ;
        this.state = {
            photo: [],
            refresh: false,
            loading: true,
            empty:false
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
            if(exsist) {
                data = snapshot.val();
                // console.log(data);
                var photo = that.state.photo;
                for (var photos in data) {
                    let photoO = data[photos];
                    let tempId = photos;
                    database.ref('users').child(photoO.author).once('value').then(function (snapshot) {
                        const exsist = (snapshot.val() != null);
                        if (exsist) data = snapshot.val();


                        photo.push({
                            id: tempId,
                            url: photoO.image,
                            fName: photoO.foodName,
                            author: data.username,
                            authorPhoto: data.avatar,
                            authorName: data.name,
                            posted: photoO.posted,
                            authorId: photoO.author,
                            category: photoO.category


                        });
                        console.log(photo);

                        that.setState({
                            refresh: false,
                            loading: false
                        });

                    }).catch(error => console.log(error));


                }
            }
        }).catch(error => console.log(error));



    }

    maekOrder = () => {
        this.state.photo.sort((a, b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
        this.state.photo.reverse();
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

    filterCategory = (category) => {
        var category = category
        this.setState({
            refresh:true,
            photo: []

        });

        var that = this;
        database.ref(category).orderByChild('posted').once('value').then(function (snapshot) {
            const exsist = (snapshot.val() != null);
            if(exsist) {
                data = snapshot.val();
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
                            posted: photoO.posted,
                            authorId: photoO.author,
                            category: photoO.category


                        });
                        console.log(photo);

                        that.setState({
                            refresh: false,
                            loading: false
                        });

                    }).catch(error => console.log(error));


                }
            }
            that.state.photo.sort((a,b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
            that.state.photo.reverse();

        }).catch(error => console.log(error));


    }
    render() {
      return (
        <View style={{flex: 1}}>
            {this.maekOrder()}

            <View style={{height: 70 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'center', alignItems: 'center' }}>
                <Text style = {{fontSize: 24}}>Home</Text>
            </View>

            <View>
                <ScrollView horizontal={true} style={{marginVertical:3}}>
                    <View style={{flexDirection:'row'}}>
                        <View>
                            <TouchableOpacity onPress={() => this.filterCategory('breakfast')}>
                                <ImageBackground source={{uri: 'https://olo-images-live.imgix.net/9c/9cf9aba367a4491d89f5ddcc227a9879.jpg?auto=format%2Ccompress&q=60&cs=tinysrgb&w=500&h=333&fit=fill&fm=png32&bg=transparent&s=39190b5a3d1b6faeb656e6d97d68ff95'}} style={{height: 50 ,marginHorizontal:2, width: 75 , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 50 , width: 75 , resizeMode: 'cover' , justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 12 , color: 'white', textAlign: 'center',fontWeight: 'bold' }}>Breakfast</Text>
                                    </ImageBackground>
                                </ImageBackground>
                            </TouchableOpacity>

                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.filterCategory('lunch')}>
                                <ImageBackground source={{uri: 'https://www.ecoliteracy.org/sites/default/files/styles/hero_image_small/public/media/rethinking-school-lunch-guide.jpg?itok=JFKW4vOU&timestamp=1490386525'}} style={{height: 50 , width: 75 , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 50 , width: 75 , resizeMode: 'cover' , justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 12 , color: 'white', textAlign: 'center',fontWeight: 'bold' }}>Lunch</Text>
                                    </ImageBackground>
                                </ImageBackground>
                            </TouchableOpacity>

                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.filterCategory('dinner')}>
                                <ImageBackground source={{uri: 'https://img.taste.com.au/SN4APRsT/w720-h480-cfill-q80/taste/2017/05/steak-diane-dinner-bowl-126170-2.jpg'}} style={{height: 50 ,marginHorizontal:2, width: 75 , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 50 , width: 75 , resizeMode: 'cover' ,  justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 12 , color: 'white', textAlign: 'center',fontWeight: 'bold' }}>Dinner</Text>
                                    </ImageBackground>
                                </ImageBackground>
                            </TouchableOpacity>

                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.filterCategory('cake')}>
                                <ImageBackground source={{uri: 'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2018/02/easter-nest-cake.jpg?itok=-ZAZCCss'}} style={{height: 50 , width: 75 , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 50 , width: 75 , resizeMode: 'cover' ,  justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 12 , color: 'white', textAlign: 'center',fontWeight: 'bold' }}>Cake</Text>
                                    </ImageBackground>
                                </ImageBackground>
                            </TouchableOpacity>

                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.filterCategory('beverages')}>
                                <ImageBackground source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIfBY5naNC0jEWXkfqM3NprUhKX5xAjdfNnbHFnXzLgofan8hE'}} style={{height: 50 ,marginHorizontal:2, width: 75 , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 50 , width: 75 , resizeMode: 'cover' ,  justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 12 , color: 'white', textAlign: 'center',fontWeight: 'bold' }}>Beverages</Text>
                                    </ImageBackground>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.filterCategory('sweets')}>
                                <ImageBackground source={{uri: 'https://www.hindustantimes.com/rf/image_size_640x362/HT/p2/2015/11/10/Pictures/_8311bdee-878c-11e5-9788-42b4b9d38c49.jpg'}} style={{height: 50 , width: 75 , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 50 , width: 75 , resizeMode: 'cover' , justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 12 , color: 'white', textAlign: 'center',fontWeight: 'bold' }}>Sweets</Text>
                                    </ImageBackground>
                                </ImageBackground>
                            </TouchableOpacity>

                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.filterCategory('other')}>
                                <ImageBackground source={{uri: 'https://www.cdc.gov/features/salmonella-food/salmonella-food_456px.jpg'}} style={{height: 50 ,marginHorizontal:2, width: 75 , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 50 , width: 75 , resizeMode: 'cover' , justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 12 , color: 'white', textAlign: 'center',fontWeight: 'bold' }}>Other</Text>
                                    </ImageBackground>
                                </ImageBackground>
                            </TouchableOpacity>

                        </View>
                    </View>

                </ScrollView>
            </View>


            { this.state.loading == true ? (
                <View style={{flex: 1 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style = {{fontSize: 18}}>Loading...</Text>
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
                            <Text>{ this.timeConvertor(item.posted)}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('recipe' , { id : item.id})}>
                                <ImageBackground source={{uri: item.url }} style={{height: 275 , width: '100%' , resizeMode: 'cover'}}>
                                    <ImageBackground source={{uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg'}} style={{height: 275 , width: '100%' , resizeMode: 'cover' , opacity:0.7, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontSize: 32 , color: 'white', textAlign: 'center'}}>{ item.fName}</Text>
                                        <Text style={{fontSize: 20 , color: 'white', textAlign: 'center'}}>#{ item.category}</Text>
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