import React from 'react';
import Expo from 'expo';
import { StyleSheet, Text, View, Button, Animated } from 'react-native';

const getContacts = async () => {
  let permissionResult = await Expo.Permissions.getAsync(Expo.Permissions.CONTACTS);

  if (permissionResult.status !== 'granted') {
    permissionResult = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
  }
  if (permissionResult.status !== 'granted') return;

  const contacts = await Expo.Contacts.getContactsAsync({
    fields: [
      Expo.Contacts.PHONE_NUMBERS,
    ],
    pageSize: 10000,
    pageOffset: 0,
  });
  return contacts.data.length;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contactsLength: null,
      width: new Animated.Value(50),
    };
    this.handlePressButton = this.handlePressButton.bind(this);
  }

  async handlePressButton() {
    const contactsLength = await getContacts();
    this.setState({
      contactsLength,
    });
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          this.state.width,
          {
            toValue: 200,
          }
        ),
        Animated.timing(
          this.state.width,
          {
            toValue: 50,
          }
        ),
      ]),
    ).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.animatedSquare, { width: this.state.width }]}/>
        <Text>Contacts Length: {this.state.contactsLength}</Text>
        <Button title={'get contacts'} onPress={this.handlePressButton}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedSquare: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
  },
});
