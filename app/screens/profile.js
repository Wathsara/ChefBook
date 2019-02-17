import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { f, auth, database , storage} from "../../config/config";

class profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loggedin: false

        }
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
        <View style={{flex:1 , justifyContent:'center', alignItems:'center'}}>
            { this.state.loggedin == true ? (
                <Text>Your Profile</Text>
            ) : (
                <View>

                   <Text>Please login</Text>

                </View>

            )}

        </View>
      );
    }
  }
 export default profile;