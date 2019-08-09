
import React from 'react';
import { Text, View, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { Camera, Permissions, ImageManipulator } from 'expo';
import { storage, f } from "../../config/config";
import { PulseIndicator } from 'react-native-indicators';

const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
    apiKey: 'c614253af2bd4e299c7f2085acd265cd',
});
process.nextTick = setImmediate;

export default class SearchByImage extends React.Component {
    state = {
        hasCameraPermission: null,
        predictions: [],
        step: 0

    };
    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }
    capturePhoto = async () => {
        if (this.camera) {
            var photo = await this.camera.takePictureAsync();
            this.setState({
                photo: photo.uri,
                step: 1
            })
            return photo.uri;
        }
    };
    resize = async photo => {
        let manipulatedImage = await ImageManipulator.manipulateAsync(
            photo,
            [{ resize: { height: 300, width: 300 } }],
            { base64: true }
        );
        return manipulatedImage.base64;
    };
    predict = async image => {

        let predictions = await clarifai.models.predict({
            id: 'Food',
            version: '683e5976d16f4811951f5b70f1fdc524'
        },
            image
        );
        return predictions;
    };
    objectDetection = async () => {

        let photo = await this.capturePhoto();
        let resized = await this.resize(photo);
        let predictions = await this.predict(resized);
        this.setState({ predictions: predictions.outputs[0].data.concepts });
        console.log(this.state.predictions)
        this.setState({
            step: 2
        })
    };

    render() {
        const { hasCameraPermission, predictions } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else if (this.state.step == 0) {
            return (
                <View style={{ flex: 1 }}>
                    <Camera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={{ flex: 1 }}
                        type={this.state.type}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'column',
                                justifyContent: 'flex-end'
                            }}
                        >

                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignItems: 'center',
                                    backgroundColor: 'blue',
                                    height: '10%',
                                }}
                                onPress={this.objectDetection}
                            >
                                <Text style={{ fontSize: 30, color: 'white', padding: 15 }}>
                                    {' '}
                                    Detect Food{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        } else if (this.state.step == 1) {
            return (
                <View style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground source={{ uri: this.state.photo }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                        <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                flex: 1,
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{ marginTop: '50%', alignSelf: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>Analysing...</Text>
                                <PulseIndicator size={70} color="white" />
                            </View>
                        </ImageBackground>
                    </ImageBackground>
                </View>
            )
        } else if (this.state.step == 2) {
            return (
                <View style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#7CFC00', borderBottomWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground source={{ uri: this.state.photo }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }}>
                        <ImageBackground source={require('../data/black.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                flex: 1,
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {this.state.predictions[0].value < 0.9 ? (
                                    <Text style={{ marginTop: '50%', alignSelf: 'center', justifyContent: 'center', fontSize: 25, color: '#fff' }}>Sorry We cant Recognize</Text>
                                ) : (
                                        <Text style={{ marginTop: '50%', alignSelf: 'center', justifyContent: 'center', fontSize: 25, color: '#fff' }}>{this.state.predictions[0].name}</Text>

                                    )}
                                <TouchableOpacity
                                        style={{
                                            flex: 0.1,
                                            alignItems: 'center',
                                            backgroundColor: 'blue',
                                            height: 'auto',
                                            width:"100%",
                                            justifyContent:'center',
                                            alignItems:'center'
                                        }}
                                        onPress={() => this.setState({ step: 0 })}
                                    >
                                        <Text style={{ fontSize: 20, color: 'white', padding: 15 }}>
                                            Go Back
                                </Text>
                                    </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </ImageBackground>
                </View>

            )
        }
    }
}