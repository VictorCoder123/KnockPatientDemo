/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

//var Button = require('react-native-button');
var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;


var MOCKED_DATA = [
    {
        "kind": "redirect", // say, redirect or email
        "ifop_condition": "< 140", 
        "ifop_true_block": "#105", 
        "ifop_false_block": "#104", 
        "say_text": "Hello! Please enter your blood pressure with your phone's key pad. ", 
        "redirect_phone": "6151001000", 
        "email_body": "Don't eat too much junk food!", 
        "data_type": 1, 
        "email_to": "Mike", 
        "key": "#106", 
        "email_subject": "Suggestion for high blood pressure", 
        "op_kind": "ifop", 
        "email_from": "doctor@KnockPatient.com"
    }, 
    {
        "noop_next_block": null, 
        "kind": "say", 
        "email_to": "", 
        "key": "#104", 
        "op_kind": "noop", 
        "email_subject": "", 
        "say_text": "You have high blood pressure!", 
        "redirect_phone": "", 
        "email_from": "", 
        "email_body": ""
    }, 
    {
        "noop_next_block": null, 
        "kind": "say", 
        "email_to": "", 
        "key": "#105", 
        "op_kind": "noop", 
        "email_subject": "", 
        "say_text": "Your blood pressure is fine. ", 
        "redirect_phone": "", 
        "email_from": "", 
        "email_body": ""
    }
];

var get_block = function(data, key){
  var selected = {}
  data.forEach(function(block){
    if(block.key == key )
      selected = block;
  })
  return selected
}

var content_block = get_block(MOCKED_DATA, '#106')
var true_block = get_block(MOCKED_DATA, '#105')
var false_block = get_block(MOCKED_DATA, '#104')

var PhoneRedirect = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
          <Text style={styles.welcome}>
            Call Phone number for more details
          </Text>
          <TouchableHighlight onPress={this._onPressButton}>
            <Text style={styles.button}>
              {content_block.redirect_phone}
            </Text>
          </TouchableHighlight>
        </View>
    );
  }
});

var BloodPressureCheck = React.createClass({
  getInitialState: function(){
    return {
      result: "",
    };
  },

  render: function() {
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            { content_block.say_text }
          </Text>
        
          <TextInput 
            style={styles.textInput}
            placeholder="Enter your blood pressure"
            onChangeText={(text) => this.update_result(text)} />

          <Text style={styles.result}>
            {this.state.result}
          </Text>

          <TouchableHighlight onPress={this._onPressButton}>
            <Text style={styles.button}>
              Submit
            </Text>
          </TouchableHighlight>
        </View>
      );
  },

  _onPressButton: function(){

  },

  update_result: function(text){
    var say_text;
    var num = parseInt(text, 10);
    var operator = content_block.ifop_condition.split(" ")[0]
    var threshold_value = parseInt(content_block.ifop_condition.split(" ")[1], 10)
    var compare = {
      '<': function(a, b){ return a<b },
      '>': function(a, b){ return a>b },
      '=': function(a, b){ return a==b },
      '<=': function(a, b){ return a<=b },
      '>=': function(a, b){ return a>=b },
    }

    if(isNaN(num))
      say_text = "Please correct input."
    else if(compare[operator](num, threshold_value)) 
      say_text = true_block.say_text;
    else 
      say_text = false_block.say_text;

    this.setState({result:say_text})
  }

});

var Email = React.createClass({
  render: function() {
    return (
      <View style={styles.emailContainer}>
          <Text style={styles.email}>
            From: {content_block.email_from}
          </Text>
          <Text style={styles.email}>
            To: {content_block.email_to}
          </Text>
          <Text style={styles.email}>
            Subject: {content_block.email_subject}
          </Text>
          <Text style={styles.email}>
            Body: {content_block.email_body}
          </Text>   
      </View>
    );
  }
});

var InfoBlock = React.createClass({
  render: function() {
    // Display different view according to "kind"
    if(content_block.kind == 'redirect')
      return (
        <PhoneRedirect/>
      );
    else if(content_block.kind == 'say')
      return (
        <BloodPressureCheck/>
      );
    else if(content_block.kind == 'email')
      return(
        <Email/>
      )
    else 
      return(
        <View style={styles.container}>
        </View>
      )
  },

});



var KnockPatient = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.NavContainer}
        initialRoute={{
          title: 'Knock Patient',
          component: InfoBlock,
        }}/>
    );
  }
});

var styles = StyleSheet.create({
  NavContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  emailContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    top: 50,
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    top: 50,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 3,
    paddingHorizontal: 10,
    marginHorizontal: 30,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 30,
  },
  result: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
    margin: 30,
  },
  button: {
    padding: 8,
    fontSize: 20,
    textAlign: 'center',
    color: '#007AFF',
  },
  phone: {
    padding: 8,
    fontSize: 20,
    textAlign: 'center',
    color: '#007AFF',
  },
  email: {
    fontSize: 20,
    textAlign: 'auto',
    margin: 20,
  },
});

AppRegistry.registerComponent('KnockPatient', () => KnockPatient);
