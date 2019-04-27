import React from 'react';
import { TouchableOpacity, Text, View, FlatList, Image, ImageBackground, ActivityIndicator, ScrollView } from 'react-native';
import { f, auth, database, storage } from "../../config/config";
import { Icon } from 'react-native-elements';
import { Badge } from 'react-native-elements'
import { PacmanIndicator } from 'react-native-indicators';
class home extends React.Component {
    constructor(props) {
        super(props);
        ;
        this.state = {
            photo: [],
            refresh: false,
            loading: true,
            empty: false,
            loggedin: false,

        }

    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {

                var userId = f.auth().currentUser.uid;
                that.setState({
                    loggedin: true,
                    userId: userId
                });
                database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) data = snapshot.val();
                    console.log(data)
                    that.setState({
                        name: data
                    });
                });

                database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
                    const exist = (snapshot.val() != null);
                    if (exist) data = snapshot.val();
                    console.log(data)
                    that.setState({
                        avatar: data,

                    });
                });
                that.loadFeed();


            } else {
                that.setState({
                    loggedin: false
                })


            }
        })

    }

    loadFeed = () => {
        this.setState({
            refresh: true,
            photo: []


        });

        var that = this;

        database.ref('recepies').orderByChild('posted').once('value').then(function (snapshot) {
            const exsist = (snapshot.val() != null);
            if (exsist) {
                data = snapshot.val();
                // console.log(data);

                for (var photos in data) {
                    let photoO = data[photos];
                    let tempId = photos;
                    let photo = that.state.photo;
                    let count = 0;
                    database.ref('comments').child(tempId).orderByChild('posted').once("value").then(function (snapshot) {
                        const exsist = (snapshot.val() != null);
                        if(exsist){
                            data = snapshot.val();                                            
                            for(var comments in data){
                                count = count + 1;
                            }                                            
                        }else{
                            count = 0;
                        }
            
                    })
                    database.ref('users').child(photoO.author).once('value').then(function (snapshot) {
                        const exsisting = (snapshot.val() != null);
                        if (exsisting) {
                            data = snapshot.val();
                            database.ref('users').child(that.state.userId).child('following').child(photoO.author).once('value').then(function (snapshot) {
                                const exsists = (snapshot.val() != null);
                                if (exsists) {   
                                    photo.push({
                                        id: tempId,
                                        url: photoO.image,
                                        fName: photoO.foodName,
                                        author: data.username,
                                        authorPhoto: data.avatar,
                                        authorName: data.name,
                                        posted: photoO.posted,
                                        authorId: photoO.author,
                                        category: photoO.category,
                                        yummy: photoO.yummies,
                                        commentCount: count
                                    });

                                }
                                that.setState({
                                    refresh: false,
                                    loading: false
                                });
                            })
                        }


                    })

                }

            }
        })

    }

    maekOrder = () => {
        this.state.photo.sort((a, b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
        this.state.photo.reverse();
    }

    loadNew = () => {
        this.loadFeed();

    }

    timePlural = (s) => {
        if (s == 1) {
            return ' ago'
        } else {
            return 's ago'
        }
    }

    timeConvertor = (timestamp) => {
        var a = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - a) / 1000);

        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' Year' + this.timePlural(interval);
        }

        var interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' Month' + this.timePlural(interval);
        }

        var interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' Day' + this.timePlural(interval);
        }

        var interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' Hour' + this.timePlural(interval);
        }

        var interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' Minute' + this.timePlural(interval);
        }

        return Math.floor(seconds) + ' Second' + this.timePlural(seconds)
    }

    filterCategory = (category) => {
        var category = category
        this.setState({
            refresh: true,
            photo: []

        });

        var that = this;
        database.ref(category).orderByChild('posted').once('value').then(function (snapshot) {
            const exsist = (snapshot.val() != null);
            if (exsist) {
                data = snapshot.val();
                // console.log(data);
                var photo = that.state.photo;
                for (var photos in data) {
                    let photoO = data[photos];
                    let tempId = photos;
                    let count = 0;
                    database.ref('comments').child(tempId).orderByChild('posted').once("value").then(function (snapshot) {
                        const exsist = (snapshot.val() != null);
                        if (exsist) {
                            data = snapshot.val();
                            for (var comments in data) {
                                count = count + 1;
                            }
                        } else {
                            count = 0;
                        }
                    })
                    database.ref('users').child(photoO.author).once('value').then(function (snapshot) {
                        const exsist = (snapshot.val() != null);
                        if (exsist) {
                            data = snapshot.val();
                            database.ref('users').child(that.state.userId).child('following').child(photoO.author).once('value').then(function (snapshot) {
                                const exsists = (snapshot.val() != null);
                                if (exsists) {
                                    photo.push({
                                        id: tempId,
                                        url: photoO.image,
                                        fName: photoO.foodName,
                                        author: data.username,
                                        authorPhoto: data.avatar,
                                        authorName: data.name,
                                        posted: photoO.posted,
                                        authorId: photoO.author,
                                        category: photoO.category,
                                        yummy: photoO.yummies,
                                        commentCount:count
                                    });

                                }
                                that.setState({
                                    refresh: false,
                                    loading: false
                                });
                            })
                        }
                    })
                }
            }
            that.state.photo.sort((a, b) => (a.posted > b.posted) ? 1 : ((b.posted > a.posted) ? -1 : 0));
            that.state.photo.reverse();

        })
    }

    insertYummy = (rId , category ) => {
        var that = this;
        database.ref('recepies').child(rId).child('yummies').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) {
                let data = snapshot.val();
                let newD = data + 1;
                let userId = f.auth().currentUser.uid;
                likeD = {
                    name: f.auth().currentUser.displayName
                }
                database.ref('recepies').child(rId).update({ yummies: newD });
                database.ref(category).child(rId).update({ yummies: newD });

            } else {
                let userId = f.auth().currentUser.uid;
                database.ref('recepies').child(rId).update({ yummies: 1 });
                database.ref('/likes/' + rId).update({ yummies: newD });
                likeD = {
                    name: f.auth().currentUser.displayName
                }
                database.ref('recepies').child(rId).update({ yummies: newD });
                database.ref('/likes/' + rId + '/' + userId).set(likeD);
            }

        }).catch((error) => console.log(error))
    }

    likeCount = (rid) => {
        database.ref('recepies').child(rid).child('yummies').on('value', (function (snapshot) {
            const exsist = (snapshot.val() != null);
            if (exsist) {
                var data = snapshot.val();
                console.log(data)
                return (data);
            }
        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }

    checkLike = (recipe) => {
        var that = this;
        database.ref('likes').child(recipe).child('total').on('value', (function (snapshot) {
            const exsist = (snapshot.val() != null);
            if (exsist) {
                var data = snapshot.val();
                return (data)
            }
        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.maekOrder()}

                <View style={{ height: 70, backgroundColor: '#FB8C00', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground source={require('../data/heading.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                        <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, color: '#ffffff',paddingTop:30 }}>Home</Text>
                        </ImageBackground>
                    </ImageBackground>
                </View>
                {this.state.loading == false ? (
                    <View>
                        <ScrollView horizontal={true} style={{ marginVertical: 3 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <TouchableOpacity onPress={() => this.filterCategory('breakfast')}>
                                        <ImageBackground source={{ uri: 'https://olo-images-live.imgix.net/9c/9cf9aba367a4491d89f5ddcc227a9879.jpg?auto=format%2Ccompress&q=60&cs=tinysrgb&w=500&h=333&fit=fill&fm=png32&bg=transparent&s=39190b5a3d1b6faeb656e6d97d68ff95' }} style={{ height: 50, marginHorizontal: 2, width: 75, resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <ImageBackground source={require('../data/black.jpg')} style={{ height: 50, width: 75, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Breakfast</Text>
                                            </ImageBackground>
                                        </ImageBackground>
                                    </TouchableOpacity>

                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.filterCategory('lunch')}>
                                        <ImageBackground source={{ uri: 'https://www.ecoliteracy.org/sites/default/files/styles/hero_image_small/public/media/rethinking-school-lunch-guide.jpg?itok=JFKW4vOU&timestamp=1490386525' }} style={{ height: 50, width: 75, resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <ImageBackground source={require('../data/black.jpg')} style={{ height: 50, width: 75, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Lunch</Text>
                                            </ImageBackground>
                                        </ImageBackground>
                                    </TouchableOpacity>

                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.filterCategory('dinner')}>
                                        <ImageBackground source={{ uri: 'https://img.taste.com.au/SN4APRsT/w720-h480-cfill-q80/taste/2017/05/steak-diane-dinner-bowl-126170-2.jpg' }} style={{ height: 50, marginHorizontal: 2, width: 75, resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <ImageBackground source={require('../data/black.jpg')} style={{ height: 50, width: 75, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Dinner</Text>
                                            </ImageBackground>
                                        </ImageBackground>
                                    </TouchableOpacity>

                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.filterCategory('cake')}>
                                        <ImageBackground source={{ uri: 'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2018/02/easter-nest-cake.jpg?itok=-ZAZCCss' }} style={{ height: 50, width: 75, resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <ImageBackground source={require('../data/black.jpg')} style={{ height: 50, width: 75, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Cake</Text>
                                            </ImageBackground>
                                        </ImageBackground>
                                    </TouchableOpacity>

                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.filterCategory('beverages')}>
                                        <ImageBackground source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIfBY5naNC0jEWXkfqM3NprUhKX5xAjdfNnbHFnXzLgofan8hE' }} style={{ height: 50, marginHorizontal: 2, width: 75, resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <ImageBackground source={require('../data/black.jpg')} style={{ height: 50, width: 75, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Beverages</Text>
                                            </ImageBackground>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.filterCategory('sweets')}>
                                        <ImageBackground source={{ uri: 'https://www.hindustantimes.com/rf/image_size_640x362/HT/p2/2015/11/10/Pictures/_8311bdee-878c-11e5-9788-42b4b9d38c49.jpg' }} style={{ height: 50, width: 75, resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <ImageBackground source={require('../data/black.jpg')} style={{ height: 50, width: 75, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Sweets</Text>
                                            </ImageBackground>
                                        </ImageBackground>
                                    </TouchableOpacity>

                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.filterCategory('other')}>
                                        <ImageBackground source={{ uri: 'https://www.cdc.gov/features/salmonella-food/salmonella-food_456px.jpg' }} style={{ height: 50, marginHorizontal: 2, width: 75, resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <ImageBackground source={require('../data/black.jpg')} style={{ height: 50, width: 75, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Other</Text>
                                            </ImageBackground>
                                        </ImageBackground>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </ScrollView>
                    </View>
                ) : (
                        <View></View>
                    )}

                {this.state.loading == true ? (
                    <View style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <ImageBackground source={{ uri: 'https://flavorverse.com/wp-content/uploads/2017/12/Afghan-Foods.jpg' }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                            <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                <PacmanIndicator size={70} color="white" />
                            </ImageBackground>
                        </ImageBackground>
                    </View>

                ) : (
                        <View style={{ flex: 1, backgroundColor: '#FB8C00' }}>
                            <FlatList
                                refreshing={this.state.refresh}
                                onRefresh={this.loadNew}
                                data={this.state.photo}
                                keyExtractor={(item, index) => index.toString()}
                                style={{ flex: 1, backgroundColor: '#ffffff' }}
                                renderItem={({ item, index }) => (
                                    <View key={index} style={{ width: '100%', backgroundColor: '##ffffff', marginBottom: 10, borderBottomWidth: 1.5, borderColor: '#FB8C00', overflow: 'hidden', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', width: '100%', padding: 10, justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('userProfile', { userId: item.authorId })}>
                                                    <Image source={{ uri: item.authorPhoto }} style={{ width: 30, height: 30, borderRadius: 100 }} />
                                                    <Text>{item.authorName}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text>{this.timeConvertor(item.posted)}</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('recipe', { id: item.id , category:item.category})}>
                                                <ImageBackground source={{ uri: item.url }} style={{ height: 275, width: '100%', resizeMode: 'cover' }}>
                                                    <ImageBackground source={require('../data/black.jpg')} style={{ height: 275, width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>{item.fName}</Text>
                                                        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>#{item.category}</Text>
                                                        <View style={{ flexDirection: 'row', width: '100%', padding: 10, justifyContent: 'center' }}>
                                                            <View>
                                                                <View style={{ flexDirection: 'row' }} >
                                                                    <Image source={{ uri: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/face-savouring-delicious-food.png' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                                                    <Badge value={item.yummy} status="success" />
                                                                </View>
                                                            </View>
                                                            <View>
                                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('comment', { recipeId: item.id })}>
                                                                    <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIMy4CpbsQdYw9t818-JCQVUmePpNb--71pIP7VUurgVXlRN54' }} style={{ width: 30, height: 30,borderRadius: 15, marginLeft: 12 }} />
                                                                    <Badge value={item.commentCount} status="success" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </ImageBackground>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            {/* <View >
                                                {this.state.loggedin == true ? (
                                                    <View style={{ flexDirection: 'row', width: '100%', padding: 10, justifyContent: 'space-between' }}>
                                                        <View>
                                                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.insertYummy(item.id) }}>
                                                                <Image source={{ uri: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/face-savouring-delicious-food.png' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                                                <Image source={{ uri: 'https://www.svgimages.com/svg-image/s5/yummy-smiley-icon-256x256.png' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                                                <Badge value={item.yummy} status="success" />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View>
                                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('comment', { recipeId: item.id })}>
                                                                <Image source={{ uri: 'https://cdn4.iconfinder.com/data/icons/contact-us-19/48/61-512.png' }} style={{ width: 30, height: 30, marginLeft: 12 }} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ) : (
                                                        <View style={{ flexDirection: 'row', width: '100%', padding: 10, justifyContent: 'space-between' }}>
                                                            <View>
                                                                <View style={{ flexDirection: 'row' }} >
                                                                    <Image source={{ uri: 'https://www.svgimages.com/svg-image/s5/yummy-smiley-icon-256x256.png' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                                                    <Text>{this.likeCount(item.id)} yummies</Text>
                                                                </View>
                                                            </View>
                                                            <View>
                                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('comment', { recipeId: item.id })}>
                                                                    <Image source={{ uri: 'https://cdn4.iconfinder.com/data/icons/contact-us-19/48/61-512.png' }} style={{ width: 30, height: 30, marginLeft: 12 }} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    )}

                                            </View> */}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    )}

            </View>

        );
    }
}
export default home;