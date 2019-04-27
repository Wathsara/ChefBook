import React from 'react';
import { Text, View, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { f, auth, database, storage } from "../../config/config";
import { Card } from 'react-native-elements'
import { PacmanIndicator } from 'react-native-indicators';
import { Badge } from 'react-native-elements'

class userProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false

        }
    }

    check = () => {
        var params = this.props.navigation.state.params;
        if (params) {
            if (params.id) {
                this.setState({
                    id: params.id,
                    category: params.category
                });
                this.fetchInfo(params.id);
                var that = this;
                f.auth().onAuthStateChanged(function (user) {
                    if (user) {

                        var userId = f.auth().currentUser.uid;
                        that.setState({
                            loggedin: true,
                            userId: userId
                        });
                        database.ref('likes').child(params.id).child(f.auth().currentUser.uid).on('value', (function (snapshot) {
                            const exsist = (snapshot.val() != null);
                            if (exsist) {
                                that.setState({
                                    liked: true
                                })
                            } else {
                                that.setState({
                                    liked: false
                                })
                            }
                        }), function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });

                        database.ref('saves').child(params.id).child(f.auth().currentUser.uid).on('value', (function (snapshot) {
                            const exsist = (snapshot.val() != null);
                            if (exsist) {
                                that.setState({
                                    saved: true
                                })
                            } else {
                                that.setState({
                                    saved: false
                                })
                            }
                        }), function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });

                    }
                })
            }
        }
    }

    fetchInfo = (id) => {
        var that = this;
        database.ref('recepies').child(id).child('foodName').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) data = snapshot.val();
            that.setState({
                foodName: data
            });
        })

        database.ref('recepies').child(id).child('discription').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) data = snapshot.val();
            that.setState({
                discription: data
            });
        })

        database.ref('recepies').child(id).child('ingrediants').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) data = snapshot.val();
            that.setState({
                ingrediants: data
            });
        })

        database.ref('recepies').child(id).child('image').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) data = snapshot.val();
            that.setState({
                image: data,
                loaded: true
            });
        })
        database.ref('recepies').child(id).child('category').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) data = snapshot.val();
            that.setState({
                category: data,
            });
        })

        database.ref('recepies').child(id).child('yummies').on('value', (function (snapshot) {
            const exsist = (snapshot.val() != null);
            if (exsist) {
                data = snapshot.val()
                that.setState({
                    likes: data
                })
            }
        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        database.ref('recepies').child(id).child('saved').on('value', (function (snapshot) {
            const exsist = (snapshot.val() != null);
            if (exsist) {
                data = snapshot.val()
                that.setState({
                    saveCount: data
                })
            }
        }), function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        let count = 0;
        database.ref('comments').child(id).orderByChild('posted').once("value").then(function (snapshot) {
            const exsist = (snapshot.val() != null);
            if (exsist) {
                data = snapshot.val();
                for (var comments in data) {
                    count = count + 1;
                }
            } else {
                count = 0;
            }
            that.setState({
                comments: count
            })

        })
    }
    componentDidMount = () => {
        this.check();
    }
    insertYummy = (rId, category) => {
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
                database.ref('/likes/' + rId + '/' + userId).set(likeD);

            } else {
                let userId = f.auth().currentUser.uid;
                database.ref('recepies').child(rId).update({ yummies: 1 });
                database.ref(category).child(rId).update({ yummies: 1 });
                database.ref('/likes/' + rId).update({ yummies: newD });
                likeD = {
                    name: f.auth().currentUser.displayName
                }
                database.ref('recepies').child(rId).update({ yummies: newD });
                database.ref('/likes/' + rId + '/' + userId).set(likeD);
            }

        }).catch((error) => console.log(error))
    }

    insertSave = (rId, category) => {
        var that = this;
        database.ref('recepies').child(rId).child('saved').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) {
                let data = snapshot.val();
                let newD = data + 1;
                let userId = f.auth().currentUser.uid;
                likeD = {
                    name: f.auth().currentUser.displayName
                }
                saved = {
                    image: that.state.image
                }
                database.ref('recepies').child(rId).update({ saved: newD });
                database.ref(category).child(rId).update({ saved: newD });
                database.ref('/saves/' + rId + '/' + userId).set(likeD);
                database.ref('/users/' + userId + '/saved/' + rId).set(saved);

            } else {
                let userId = f.auth().currentUser.uid;
                database.ref('recepies').child(rId).update({ saved: 1 });
                database.ref(category).child(rId).update({ saved: 1 });
                database.ref('/saves/' + rId).update({ saved: newD });
                likeD = {
                    name: f.auth().currentUser.displayName
                }
                saved = {
                    image: that.state.image
                }
                database.ref('/saves/' + rId + '/' + userId).set(likeD);
                database.ref('/users/' + userId + '/saved/' + rId).set(saved);
            }

        }).catch((error) => console.log(error))
    }

    deleteYummy = (rId, category) => {
        var that = this;
        database.ref('recepies').child(rId).child('yummies').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) {
                let data = snapshot.val();
                let newD = data - 1;
                let userId = f.auth().currentUser.uid;
                likeD = {
                    name: f.auth().currentUser.displayName
                }
                database.ref('recepies').child(rId).update({ yummies: newD });
                database.ref(category).child(rId).update({ yummies: newD });
                database.ref('/likes/' + rId + '/' + userId).remove();
            }
        }).catch((error) => console.log(error))
    }
    deleteSave = (rId, category) => {
        var that = this;
        database.ref('recepies').child(rId).child('saved').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if (exist) {
                let data = snapshot.val();
                let newD = data - 1;
                let userId = f.auth().currentUser.uid;
                database.ref('recepies').child(rId).update({ saved: newD });
                database.ref(category).child(rId).update({ saved: newD });
                database.ref('/saves/' + rId + '/' + userId).remove();
                database.ref('/users/' + userId + '/saved/' + rId).remove()
            }
        }).catch((error) => console.log(error))
    }

    likeCount = () => {

    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                {this.state.loaded == true ? (


                    <View style={{ flex: 1, backgroundColor: '#e8e8e8' }}>

                        <View style={{ height: 70, backgroundColor: '#FB8C00', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                            <ImageBackground source={require('../data/heading.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                                <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    <View flexDirection='row' style={{ paddingTop: 30 }}>
                                        <TouchableOpacity style={{ alignSelf:'flex-start' }} onPress={() => this.props.navigation.goBack()}>
                                            <Text style={{ color: 'white', fontSize: 14, width: 150 ,textAlign:'left'}}>Back</Text>
                                        </TouchableOpacity>
                                        <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>Recipe</Text>
                                        <Text style={{ fontSize: 18, width: 150 }}></Text>
                                    </View>
                                </ImageBackground>
                            </ImageBackground>
                        </View>


                        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row', width: '100%', padding: 10, justifyContent: 'center' }}>
                                {this.state.loggedin == true ? (
                                    <View>
                                        {this.state.liked == true ? (
                                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.deleteYummy(this.state.id, this.state.category) }}>
                                                <Image source={{ uri: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/face-savouring-delicious-food.png' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                                <Badge value={this.state.likes} status="success" />
                                            </TouchableOpacity>
                                        ) : (
                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.insertYummy(this.state.id, this.state.category) }}>
                                                    <Image source={{ uri: 'https://www.inventicons.com//uploads/iconset/87/wm/512/Delicious-Emoticon-87.png' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                                    <Badge value={this.state.likes} status="success" />
                                                </TouchableOpacity>
                                            )}
                                    </View>
                                ) : (
                                        <View></View>
                                    )}

                                <View>
                                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('comment', { recipeId: this.state.id })}>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIMy4CpbsQdYw9t818-JCQVUmePpNb--71pIP7VUurgVXlRN54' }} style={{ width: 30, height: 30, borderRadius: 15, marginLeft: 12 }} />
                                        <Badge value={this.state.comments} status="success" />
                                    </TouchableOpacity>
                                </View>
                                {this.state.loggedin == true ? (
                                    <View>
                                        {this.state.saved == true ? (
                                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.deleteSave(this.state.id, this.state.category) }}>
                                                <Image source={{ uri: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/save-41-157698.png' }} style={{ width: 30, height: 30, borderRadius: 15, marginLeft: 12 }} />
                                                <Badge value={this.state.saveCount} status="success" />
                                            </TouchableOpacity>
                                        ) : (
                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.insertSave(this.state.id, this.state.category) }}>
                                                    <Image source={{ uri: 'https://cdn2.iconfinder.com/data/icons/apple-classic/100/Apple_classic_10Icon_5px_grid-04-512.png' }} style={{ width: 30, height: 30, borderRadius: 15, marginLeft: 12 }} />
                                                    <Badge value={this.state.saveCount} status="success" />
                                                </TouchableOpacity>
                                            )}
                                    </View>
                                ) : (
                                        <View></View>
                                    )}

                            </View>
                            <Card
                                title={this.state.foodName}
                                image={{ uri: this.state.image }}>

                            </Card>
                            <Card
                                title="Ingredients">
                                <Text style={{ marginBottom: 10 }}>
                                    {this.state.ingrediants}
                                </Text>
                            </Card>
                            <Card
                                title="Description">

                                <Text style={{ marginBottom: 10 }}>
                                    {this.state.discription}
                                </Text>

                            </Card>
                        </ScrollView>


                    </View>

                ) : (
                        <View style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                            <ImageBackground source={{ uri: 'https://flavorverse.com/wp-content/uploads/2017/12/Afghan-Foods.jpg' }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                                <ImageBackground source={{ uri: 'https://starksfitness.co.uk/starks-2018/wp-content/uploads/2019/01/Black-Background-DX58.jpg' }} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    <PacmanIndicator size={70} color="white" />
                                </ImageBackground>
                            </ImageBackground>
                        </View>

                    )}

            </View>
        );
    }
}
export default userProfile;