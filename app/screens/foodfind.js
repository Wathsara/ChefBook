import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View,Image } from 'react-native';
import { TfImageRecognition, TensorFlow } from 'react-native-tensorflow';
import { Camera, Permissions } from 'expo';

class foodfind extends React.Component {

    constructor() {
        super()
        this.image = require('../data/f.png');

        this.state = {
            result: "",
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,

        }
    }

    componentDidMount() {
        this.recognizeImage()
        this.permissionCam()
    }

    async permissionCam() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    async recognizeImage() {

        // try {
        //     const tfImageRecognition =  new TfImageRecognition({
        //         model,
        //         labels
        //     })
        //
        //
        //
        //     const results = await tfImageRecognition.recognize({
        //         image: this.image
        //     })
        //
        //     const resultText = `Name: ${results[0].name} - Confidence: ${results[0].confidence}`
        //     this.setState({result: resultText})
        //
        //     await tfImageRecognition.close()
        // } catch(err) {
        //     console.log(err);
        // }
    }

    render() {

        const {hasCameraPermission} = this.state;
        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                    <Camera style={{flex: 1 }} type={this.state.type}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text
                                    style={{fontSize: 18, marginBottom: 10, color: 'white'}}>
                                    {' '}Flip{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    results: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    image: {
        width: 150,
        height: 100
    },
});
export default foodfind;