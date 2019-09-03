import { StyleSheet, PixelRatio } from 'react-native'
import { getHeightPercent } from './ratio'

export default StyleSheet.create({
  container: {},
  modalContainer: {
    backgroundColor: 'white',
    flex: 1
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    height: 48,
    width: '70%'
  },
  inputOnly: {
    marginLeft: '15%'
  },
  touchFlag: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
    // height: 19
  },
  imgStyle: {
    resizeMode: 'contain',
    width: 25,
    // height: 19,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    // width: 30,
    // height: 30,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  itemCountry: {
    flexDirection: 'row',
    height: getHeightPercent(7),
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: '7%',
    width: 30,
    marginRight: 10
  },
  itemCountryName: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 2 / PixelRatio.get(),
    borderBottomColor: '#ccc'

  },
  countryName: {
    fontSize: getHeightPercent(2.2)
  },
  countryNameStyle: {

  },
  countryCode: {
    textAlign: 'right'
  },
  scrollView: {
    flex: 1
  },
  letters: {
    marginRight: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  letter: {
    height: 25,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  letterText: {
    textAlign: 'center',
    fontSize: getHeightPercent(2.2)
  },
  closeButton: {
    height: 48,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  }
})
