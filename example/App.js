import React from 'react'
import { StyleSheet, Text, View, PixelRatio } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginTop: 5,
    backgroundColor: 'transparent'
  },
  data: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#ddd',
    borderColor: '#888',
    borderWidth: 1 / PixelRatio.get(),
    color: '#777'
  }
})

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cca2: 'FR',
      callingCode: ''
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Country Picker !</Text>
        <CountryPicker
          onChange={value => {
            this.setState({ cca2: value.cca2, callingCode: value.callingCode })
          }}
          cca2={this.state.cca2}
          filterable
        />
        <Text style={styles.instructions}>press on the flag</Text>
        {this.state.country && (
          <Text style={styles.data}>
            {JSON.stringify(this.state.country, null, 2)}
          </Text>
        )}
      </View>
    )
  }
}
