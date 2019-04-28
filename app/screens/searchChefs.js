import React from 'react';
import {
    TouchableOpacity, Text, View, ImageBackground, Image, ActivityIndicator, KeyboardAvoidingView, ToastAndroid,
    ScrollView, StyleSheet, FlatList
} from 'react-native';
import { database, f } from "../../config/config";
import SearchInput, { createFilter } from 'react-native-search-filter';
import { SocialIcon } from 'react-native-elements';
import PTRView from 'react-native-pull-to-refresh';
import { PacmanIndicator } from 'react-native-indicators';
const KEYS_TO_FILTERS = ['name'];
class searchChefs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            refresh: false,
            loggedin: false,
            chefList: [],
            loaded: false,
            searchTerm: "",
            searchAttribute: "name",


        }
    }
    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }

    _refresh = () => {
        return new Promise((resolve) => {
            setTimeout(() => { resolve() }, 2000)
            this.reload();
        });
    }

    renderChefs = () => {
        const filtered = this.state.chefList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        return filtered.map((items, index) => {
            { console.log(items.image) }
            return (
                <View key={items.name} style={styles.cardContainer}>
                    <View style={styles.cardHedear}>
                        <View style={styles.profilePicArea}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('userProfile', { userId: items.id })}>
                                <Image style={styles.userImage} source={{ uri: items.url }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userDetailArea}>
                            <View style={styles.userNameRow}>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }} onPress={() => this.props.navigation.navigate('userProfile', { userId: items.id })}>
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
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                that.setState({
                    loggedin: true,
                });
                var userId = f.auth().currentUser.uid;
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


            } else {
                that.setState({
                    loggedin: false
                })


            }
        })

        var that = this;
        database.ref('users').orderByChild('posted').once('value', (function (snapshot) {
            const exsist = (snapshot.val() != null);
            if (exsist) {
                data = snapshot.val();
                // console.log(data);
                var chefList = that.state.chefList;
                for (var photos in data) {
                    let photoO = data[photos];
                    let tempId = photos;
                    if(tempId != f.auth().currentUser.uid){
                        chefList.push({
                            id: tempId,
                            url: photoO.avatar,
                            name: photoO.name
                        });

                    }                   

                }
                that.setState({
                    loaded: true
                })
            }
        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }

    render() {

        return (

            <View style={{ flex: 1, backgroundColor: '#e8e8e8' }}>
                <View style={{ height: 70, backgroundColor: '#FB8C00', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground source={require('../data/heading.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                        <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            <View flexDirection='row' style={{ paddingTop: 30 }}>
                                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => this.props.navigation.goBack()}>
                                    <Text style={{ color: 'white', fontSize: 14, width: 115, textAlign: 'left' }}>Back</Text>
                                </TouchableOpacity>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Search Chefs</Text>
                                <Text style={{ fontSize: 18, width: 115 }}></Text>
                            </View>
                        </ImageBackground>
                    </ImageBackground>
                </View>
                <View style={{ flex: 1 }}>
                    {this.state.loaded == true ? (
                        <View style={{ flex: 1 }}>
                            {this.state.chefList.length == 0 ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>No Chefs..</Text>
                                </View>
                            ) : (
                                    <View style={styles.container}>
                                        <SearchInput
                                            onChangeText={(term) => { this.searchUpdated(term) }}
                                            style={styles.searchInput}
                                            placeholder="Search your Followings"
                                        />
                                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                                            {this.renderChefs()}
                                        </ScrollView>
                                    </View>
                                )}
                        </View>
                    ) : (
                            <View style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                <ImageBackground source={{ uri: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/02/24/17/chef.jpg?w968h681' }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                                    <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                        <PacmanIndicator size={70} color="white" />
                                    </ImageBackground>
                                </ImageBackground>
                            </View>
                        )}

                </View>

            </View>

        );
    }
}
const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#FB8C00',
        borderWidth: 1,
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // marginBottom:20,
        marginTop: 10
    },
    cardHedear: {
        marginLeft: 10,
        marginTop: 5,
        marginRight: 10,
        // marginBottom:10,
        // width:deviceWidth,
        height: 'auto',
        flexDirection: 'row'
    },
    profilePicArea: {
        flex: 0.25,
        // width:deviceWidth * 0.2,
        // backgroundColor:'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userDetailArea: {
        flex: 0.75,
        paddingLeft: 8,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    userNameRow: {
        flex: 0.4,
        justifyContent: 'center'

    },
    meaasageRow: {
        flex: 0.6,
        marginTop: 5
        // width:deviceWidth * 0.8,
        // backgroundColor:'blue'
    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginVertical: 2
    },
    badgeCount: {
        backgroundColor: '#3d9bf9',
        height: 20,
        width: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    imageThumbnails: {
        height: 70,
        width: 70,
        borderRadius: 35,
    },
    detailRow: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        marginTop: 10
    },
    thumbnailRow: {
        flex: 1,
        width: '100%',
        // backgroundColor:'red',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 30
    },

    //Font styles

    nameText: {
        fontSize: 14,
        color: '#4e5861',
        fontWeight: 'bold'
    },
    meaasageText: {
        fontSize: 16,
        color: '#95a3ad'
    },
    paraText: {
        fontSize: 16,
        color: '#555f68'
    },
    countText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        width: '100%',

    },
    scrollView: {
        width: '100%',
        backgroundColor: '#e8e8e8',


    },
    scrollViewContent: {
        alignItems: 'center',
        paddingBottom: 10
    },
    searchInput: {
        padding: 8,
        borderColor: '#CCC',
        borderWidth: 1,
        width: 340,
        backgroundColor: '#fff',
        marginTop: 3
    }

});
export default searchChefs;