import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
class comment extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={{flex: 1 , justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity>
                    <Text>Comments</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default comment;