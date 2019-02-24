import React from 'react';
import {
    Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView, Picker,
    ToastAndroid
} from 'react-native';
import { f, auth, database , storage} from "../../config/config";
import { Permissions , ImagePicker } from 'expo';
import { Icon , SocialIcon} from 'react-native-elements';
class newR extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loggedin: false,
            imageid: this.uniqueId(),
            imageSelected : false,
            uploading : false,
            discription :'',
            foodName:'',
            ingrediants: '',
            progress:0

        }

    }

    _checkPermissons = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            camere:status
        })

        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({
            camereRol:statusRoll
        })
    }
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    findNewIamge = async () => {
        this._checkPermissons();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality:1
        });
        console.log(result);

        if(!result.cancelled){
            console.log("upload Image")
            this.setState({
                imageSelected: true,
                imageid : this.uniqueId(),
                uri: result.uri
            });
            // this.uploadImage(result.uri)
        }else{
            console.log('Cancelled');
            this.setState({
                imageSelected: false,
            });
        }
    }

    publish = () => {
        if(this.state.uploading == false){
            if (this.state.discription != '' && this.state.foodName != '' && this.state.ingrediants != ''){
                this.uploadImage(this.state.uri)
            }else{
                ToastAndroid.show('Please Fill Out All the Fields!..', ToastAndroid.SHORT);

            }
        }else {
            console.log("Ignoring");
        }

    }

    uploadImage = async (uri) => {

        var that = this;
        var userId = f.auth().currentUser.uid;
        var imageId = this.state.imageid;

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];

        this.setState({
            currentFileType:ext,
            uploading:true
        });
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function(e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        var filePath = imageId+'.'+that.state.currentFileType;

        var uploadTask = storage.ref('user/'+userId+'/img').child(filePath).put(blob);

        uploadTask.on('state_changed' , function (snapshot) {
            let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            that.setState({
                progress:progress
            });
        } , function (error) {
            console.log(error);
        } , function () {
            that.setState({
                progress:100
            });
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                alert(downloadURL);
                that.setDatabse(downloadURL);

            })
        })

    }

    setDatabse = (imageURL) => {

        var imageid = this.state.imageid;
        var userID = f.auth().currentUser.uid;
        var discription = this.state.discription;
        var foodName = this.state.foodName;
        var ingrediants = this.state.ingrediants;
        var category = this.state.category;
        var date = Date.now();
        var posted = Math.floor(date / 1000 )
        const recepiesObj = {
            author:userID,
            discription : discription,
            foodName: foodName,
            image: imageURL,
            ingrediants:ingrediants,
            category:category,
            posted: posted,
            yummies:0
        };

        database.ref('/recepies/'+imageid).set(recepiesObj);
        database.ref('users/'+userID+'/recepies/'+imageid).set(recepiesObj);
        database.ref('users/'+userID+'/'+category+'/'+imageid).set(recepiesObj);
        database.ref(category+'/'+imageid).set(recepiesObj);


        alert('SuccessFully Published!!');

        this.setState({
            imageSelected : false,
            uploading : false,
            discription :'',
            foodName:'',
            ingrediants: '',
            progress:0
        });


    }
    changeImage = () => {
        this.setState({
            imageSelected:false
        })
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if(user){
                that.setState({
                    loggedin: true
                })
            }else{
                that.setState({
                    loggedin: false
                })


            }
        })
    }



    render() {
        return (
            <KeyboardAvoidingView  style={{flex:1}} enabled={true} behavior = "padding">
                <View style={{flexDirection:'row', height: 70 , paddingTop: 30 , backgroundColor: '#ffffff', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{textAlign:'left'}} onPress={() => this.props.navigation.goBack()}>
                        <Text style={{fontWeight:'bold', padding:10 , fontSize:12 , width:100}}>Go Back</Text>
                    </TouchableOpacity>
                    <Text style = {{fontSize: 20}}>New Recipe</Text>
                    <Text style = {{fontSize: 18, width:100}}></Text>
                </View>
                { this.state.loggedin == true && this.state.uploading == false ? (
                    <View style={{flex:1 }}>
                        { this.state.imageSelected == true ? (

                            <ScrollView>
                                <KeyboardAvoidingView enabled={true}>

                                    <View style={{justifyContent:'center' , alignItems:'center'}}>
                                        <Image source={{uri: this.state.uri}} style={{width:120 , height:120, alignSelf:'center'}}/>
                                        <TouchableOpacity style={{textAlign:'left'}} onPress={() => this.changeImage()}>
                                            <Text style={{fontWeight:'bold', padding:10 , fontSize:12 , width:100}}>Change Image</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput selectionColor='#428AF8' underlineColorAndroid = "#428AF8"  style={{ borderRadius:5, borderColor:'grey', marginHorizontal:10, marginVertical:10 , padding:5 }}
                                               placeholder={'Enter Food Name Here'}
                                               editable={true}
                                               maxlength={50}
                                               onChangeText={(text) => this.setState({foodName:text}) }
                                    />
                                    <Picker
                                        mode='dropdown'
                                        selectedValue={this.state.category}
                                        style={{height: 50, width: '100%' , padding:15, marginHorizontal:10 }}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({category: itemValue})
                                        }>
                                        <Picker.Item style={{padding:10, borderBottomWidth:1, marginVertical:2 }} label="Breakfast" value="breakfast" />
                                        <Picker.Item style={{padding:10, borderBottomWidth:1, marginVertical:2 }} label="Dinner" value="dinner" />
                                        <Picker.Item style={{padding:10, borderBottomWidth:1, marginVertical:2 }} label="Lunch" value="lunch" />
                                        <Picker.Item style={{padding:10, borderBottomWidth:1, marginVertical:2 }} label="Cake" value="cake" />
                                        <Picker.Item style={{padding:10, borderBottomWidth:1, marginVertical:2 }} label="Beverages" value="beverages" />
                                        <Picker.Item style={{padding:10, borderBottomWidth:1, marginVertical:2 }} label="Sweet" value="other" />
                                        <Picker.Item style={{padding:10, borderBottomWidth:1, marginVertical:2 }} label="Other" value="other" />

                                    </Picker>

                                    <TextInput underlineColorAndroid = "#428AF8" style={{borderRadius:5, borderColor:'grey' , marginHorizontal:10, marginVertical:10 , padding:5, height:75 }}
                                               placeholder={'Enter Ingrediants Here'}
                                               editable={true}
                                               multiline={true}
                                               maxlength={750}
                                               onChangeText={(text) => this.setState({ingrediants:text}) }
                                    />
                                    <TextInput underlineColorAndroid = "#428AF8" style={{borderRadius:5, borderColor:'grey',  marginHorizontal:10, marginVertical:10 , padding:5, height:150 }}
                                               placeholder={'Enter how to Cook Here'}
                                               editable={true}
                                               multiline={true}
                                               maxlength={750}
                                               onChangeText={(text) => this.setState({discription:text}) }
                                    />

                                    <TouchableOpacity onPress={this.publish} style={{alignSelf:'center' , marginHorizontal:'auto', width:90, backgroundColor:'purple' , borderRadius:5}}>
                                        <Text style={{textAlign:'center', color:'white' , fontSize:20}}>Publish</Text>
                                    </TouchableOpacity>
                                </KeyboardAvoidingView>
                            </ScrollView>


                        ) : (
                        <View style={{flex:1 , justifyContent:'center' , alignItems:'center'}}>
                            <View style={{height:'100%', width:'100%', justifyContent:'center' , alignItems:'center'}}>
                                <TouchableOpacity onPress={() => {this.findNewIamge()}} style={{ justifyContent:'center' , alignItems:'center' , height:'100%', width:'100%', backgroundColor:'#D3D3D3', borderStyle: 'dashed', borderWidth:1.5, borderColor:'#000'}}>
                                    <Text style={{textAlign:'center', fontSize:18}}>Upload Image</Text>
                                    <Icon name='ios-images'   type='ionicon'  color='#517fa4'  />
                                </TouchableOpacity>
                            </View>
                        </View>
                        )}
                    </View>


                ) : (
                    <View style={{flex:1 , justifyContent:'center' , alignItems:'center'}}>
                        <View style={{flex:1, justifyContent:'center' , alignItems:'center'}}>
                            { this.state.uploading == true && this.state.loggedin == true ? (
                                <View style={{flex:1 , justifyContent: 'center' , alignItems:'center'}}>
                                    <Text style={{fontSize:15,marginVertical:10}}>{this.state.progress}%</Text>
                                    <ActivityIndicator size="large" color="#0000ff"/>
                                    <Text style={{fontSize:15,marginVertical:10}} >Publishing ...</Text>
                                </View>
                            ) : (
                                <View style={{flex:1 , justifyContent:'center' , alignItems:'center'}}>
                                    <Text style={{marginVertical:5}}>SignIn to Publish</Text>
                                     <TouchableOpacity>
                                        <SocialIcon style={{width:200}} title='Sign In With Facebook'  button  type='facebook' />
                                     </TouchableOpacity>

                                </View>

                            )}
                        </View>
                    </View>

                )}


            </KeyboardAvoidingView>
        );
    }
}
export default newR;