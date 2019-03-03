import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View,Image,TouchableHighlight,ActivityIndicator,Button,Dimensions } from 'react-native';
import { TfImageRecognition, TensorFlow } from 'react-native-tensorflow';
import { Camera, Permissions } from 'expo';
// import { RNCamera } from 'react-native-camera';
class foodfind extends React.Component {

    constructor() {
        super()
        this.image = require('../data/f.png');

        this.state = {
            result: "",
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            identifedAs: '',
            loading: false
        }
    }

    componentDidMount() {
        // this.recognizeImage()
        this.permissionCam()
    }

    takePicture = async function(){



            // Pause the camera's preview
            // this.camera.pausePreview();

            // Set the activity indicator
            // this.setState((previousState, props) => ({
            //     loading: true
            // }));

            // Set options
            const options = {
                base64: true
            };

            // Get the base64 version of the image
            let data = await this.camera.takePictureAsync();
            // console.log(data);
            // let data = require('../data/f.png');


            // Get the identified image
            this.identifyImage(data);

    }

    identifyImage(imageData){

        // Initialise Clarifai api
        const Clarifai = require('clarifai');

        const app = new Clarifai.App({
            apiKey: '675aa832ac894ab4a834bf92c83f1611'
        });
        app.models.predict("bd367be194cf45149e75f01d59f77ba7", imageData).then(
            function(response) {
                // do something with response
                var concepts = response.outputs[0].data.concepts[0].name;
                alert(concepts)
            },
            function(err) {
                // there was an error
            }
        );
        // app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "bd367be194cf45149e75f01d59f77ba7"})
        //     .then(generalModel => {
        //         return generalModel.predict("https://images-gmi-pmc.edge-generalmills.com/7ed1e04a-7ac6-4ca2-aa74-6c0938069062.jpg");
        //     })
        //     .then(response => {
        //         var concepts = response.outputs[0].data.concepts[0].name;
        //         alert(concepts)
        //     });

        // Identify the image
        // app.models.predict(Clarifai.GENERAL_MODEL, {base64: imageData})
        //     .then((response) => this.displayAnswer(response.outputs[0].data.concepts[0].name)
        //         .catch((err) => alert(err))
        //     );

    }

    displayAnswer(identifiedImage){

        // Dismiss the acitivty indicator
        alert("image is"+identifiedImage);
        this.setState({
            identifedAs:identifiedImage,
        });
        alert("image is"+identifiedImage);

        // Show an alert with the answer on
        Alert.alert(
            this.state.identifedAs,
            '',
            { cancelable: false }
        )

        // Resume the preview
        this.camera.resumePreview();
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

          return (
                <Camera ref={ref => {this.camera = ref;}} style={styles.preview}>
                    <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
                    <TouchableOpacity style={styles.captureButton} disabled={this.props.buttonDisabled} onPress={this.takePicture.bind(this)}>
                        <Text>capture</Text>
                    </TouchableOpacity>
                </Camera>

            )


    }

}
const styles = StyleSheet.create({
    captureButton: {
        marginBottom:30,
        width:160,
        borderRadius:10,
        backgroundColor: "white",
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
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