import React from 'react';
import { Text, View, Image , TouchableOpacity , ScrollView, ActivityIndicator  } from 'react-native';
import { f, auth, database , storage} from "../../config/config";
import { Card } from 'react-native-elements'



class userProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: false

        }
    }

    check = () => {
        var params = this.props.navigation.state.params;
        if(params){
            if(params.id){
                this.setState({
                    id: params.id
                });
                console.log(params.id);
                this.fetchInfo(params.id);

            }
        }

    }

    fetchInfo = (id) => {
        var that = this;
        database.ref('recepies').child(id).child('foodName').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();
            that.setState({
                foodName:data
            });
        })

        database.ref('recepies').child(id).child('discription').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();
            that.setState({
                discription:data
            });
        })

        database.ref('recepies').child(id).child('ingrediants').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();
            that.setState({
                ingrediants:data
            });
        })

        database.ref('recepies').child(id).child('image').once('value').then(function (snapshot) {
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();
            that.setState({
                image:data,
                loaded:true
            });
        })
    }
    componentDidMount = () => {
        this.check();
    }



    render() {
        return (
            <View style={{flex:1}}>

                { this.state.loaded == true ? (


                    <View style={{flex:1 , backgroundColor: '#e8e8e8'}}>

                        <View style={{flexDirection:'row', height: 70 , paddingTop: 30 , backgroundColor: '#FB8C00', borderColor: '#7CFC00' , borderBottomWidth: 1.5 , justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity style={{textAlign:'left'}} onPress={() => this.props.navigation.goBack()}>
                                <Text style={{fontWeight:'bold', padding:10 , fontSize:14 , width:100}}>Back</Text>
                            </TouchableOpacity>
                            <Text style = {{fontSize: 20}}>Recipe</Text>
                            <Text style = {{fontSize: 18, width:100}}></Text>
                        </View>

                        <ScrollView style={{flex:1 , flexDirection:'column'  }}>
                            <Card
                                title={ this.state.foodName}
                                image={{uri: this.state.image }}>

                            </Card>
                            <Card
                                title="Ingredients">
                                <Text style={{marginBottom: 10}}>
                                    { this.state.ingrediants}
                                </Text>
                            </Card>
                            <Card
                                title="Description">

                                <Text style={{marginBottom: 10}}>
                                    { this.state.discription}
                                </Text>

                            </Card>
                        </ScrollView>


                    </View>

                ) : (
                    <View style={{flex:1 , justifyContent:'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff"/>
                        <Text>LOADING...</Text>

                    </View>

                )}

            </View>
        );
    }
}
export default userProfile;