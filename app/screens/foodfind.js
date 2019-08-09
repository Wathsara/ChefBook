import React from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Image, ScrollView, ActivityIndicator, Button, Dimensions } from 'react-native';
import { TfImageRecognition, TensorFlow } from 'react-native-tensorflow';
import { Camera, Permissions } from 'expo';
class foodfind extends React.Component {

    constructor() {
        super()
        this.image = require('../data/f.png');

        this.state = {
            result: "",
            loading: false
        }
    }

    componentDidMount() {

    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                 <View style={{ height: 70, backgroundColor: '#FB8C00', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground source={require('../data/heading.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                        <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, color: '#ffffff',paddingTop:30 }}>Search</Text>
                        </ImageBackground>
                    </ImageBackground>
                </View>

                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('searchFood')} style={{marginVertical:1}}>
                            <ImageBackground source={{ uri: 'https://flavorverse.com/wp-content/uploads/2017/12/Afghan-Foods.jpg' }} style={{ height: 275, width: '100%', resizeMode: 'cover' }}>
                                <ImageBackground source={require('../data/black.jpg')} style={{ height: 275, width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>Find Food</Text>
                                </ImageBackground>
                            </ImageBackground>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('searchChefs')} style={{marginVertical:1}}>
                            <ImageBackground source={{ uri: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/02/24/17/chef.jpg?w968h681' }} style={{ height: 275, width: '100%', resizeMode: 'cover' }}>
                                <ImageBackground source={require('../data/black.jpg')} style={{ height: 275, width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>Find Chefs</Text>
                                </ImageBackground>
                            </ImageBackground>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('serchImage')} style={{marginVertical:1}}>
                            <ImageBackground source={{ uri: 'https://ak1.picdn.net/shutterstock/videos/23368831/thumb/1.jpg' }} style={{ height: 275, width: '100%', resizeMode: 'cover' }}>
                                <ImageBackground source={require('../data/black.jpg')} style={{ height: 275, width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>Find recipe By Image</Text>
                                </ImageBackground>
                            </ImageBackground>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>

        )


    }

}

export default foodfind;