import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Image,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { CheckBox, Icon, Root, Toast } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MovieList from './components/MovieList'
const demoPic = 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
const API = 'https://api.themoviedb.org/3/search/movie?api_key=95f605846def69fcd36dbd3fa3252e38&language=en-US'
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const App = () => {
  const [movieText, setMovieText] = useState(null)
  const [movieData, setMovieData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [loader, setLoader] = useState(true)
  const [myMovie, setMyMovie] = useState([])
  useEffect(() => {
    _getData()
  }, [])
  function _getData() {
    AsyncStorage.getItem('movieData').then((item) => {
      var oldData = JSON.parse(item)
      if (oldData) {
        setMyMovie(oldData)
      }
      setLoader(false)
    })
  }
  function searchMovie() {
    if (movieText) {
      fetch(API + `&query=${movieText}&page=1&include_adult=false`, {
        method: 'GET'
      }).then((res) => {
        return res.json()
      }).then((responseJson) => {
        if (responseJson.results && responseJson.results.length > 0) {
          setMovieData(responseJson.results)
        } else {
          setMovieData([])
        }
      }).catch((e) => {
        setMovieData([])
        alert("Something went wrong!")
      })
    }
  }
  function _openModal() {
    setModalVisible(true)
  }
  const SearchBox = () => {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Icon name="search" type="FontAwesome" style={styles.searchIcon} />
          <TextInput onFocus={() => _openModal()} style={styles.searchInput} placeholder="Search MovieDB" />
        </View>
        <TouchableOpacity onPress={() => _openModal()} style={styles.openModalButton}>
          <Icon style={styles.plusIcon} name="plus" type="Entypo" />
        </TouchableOpacity>
      </View>
    )
  }
  const _loademptyData = () => {
    return (
      <View style={styles.noData}>
        <Text>No data available</Text>
      </View>
    )
  }

  const searchMovieModal = () => {
    async function addMovieUnwatched(item) {
      item['watched'] = false
      const myData = [...myMovie]
      myData.push(item)
      AsyncStorage.setItem('movieData', JSON.stringify(myData))
      setMyMovie(myData)
      setModalVisible(false)
    }

    const AllMovie = ({ item, index }) => {
      return (
        <TouchableOpacity style={styles.modalList} onPress={() => addMovieUnwatched(item)}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: item.poster_path ? 'https://image.tmdb.org/t/p/w500' + item.poster_path : demoPic }}
              style={styles.image} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.modalTitleText}>{item.original_title}</Text>
              <Text style={styles.modalReleaseText}>Release date: {item.release_date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <Modal visible={modalVisible}>
        <SafeAreaView >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalLeftIcon} onPress={() => setModalVisible(false)}>
              <Icon name="arrow-back" type="MaterialIcons" />
            </TouchableOpacity>
            <View style={styles.modalInput}>
              <TextInput onChangeText={(value) => setMovieText(value)} style={styles.modalInputText} placeholder="Search MovieDB" />
            </View>
            {movieText ?
              <TouchableOpacity onPress={() => searchMovie()} style={styles.modalSearchButton}>
                <Icon style={{ color: 'white', fontSize: 15 }} name="search" type="FontAwesome" /></TouchableOpacity> : <View style={{ width: '15%' }} />
            }
          </View>
          <FlatList
            ListEmptyComponent={_loademptyData}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: '15%' }}
            keyExtractor={(item, index) => index.toString()}
            data={movieData}
            renderItem={AllMovie} />
        </SafeAreaView >
      </Modal>
    )
  }
  return (
    <Root>
      <>
        <StatusBar barStyle="dark-content" />
        {loader ?
          <View style={styles.loader}><ActivityIndicator color="black" /></View> :
          <SafeAreaView >
            {SearchBox()}
            <MovieList movieData={myMovie} />
            {searchMovieModal()}
          </SafeAreaView>
        }
      </>
    </Root>

  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  modalLeftIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 5
  },
  modalInput: {
    width: '70%',
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    borderColor: 'lightgrey'
  },
  modalSearchButton: {
    width: '15%',
    backgroundColor: '#6062D7',
    height: 40,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  modalInputText: {
    width: '80%',
    height: 40
  },
  modalList: {
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#A4B3BF'
  },
  modalTitleText: {
    fontSize: 18,
    width: '80%',
    color: '#31404D',
    fontWeight: 'bold',
  },
  modalReleaseText: {
    fontSize: 12,
    color: '#31404D',
    fontWeight: 'bold',
  },
  noData: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 50,
    width: 60
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5
  },
  inputContainer: {
    width: '70%',
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    borderColor: 'lightgrey'
  },
  searchIcon: {
    fontSize: 18,
    color: '#6D6FF2',
    left: 8,
    fontWeight: 'bold'
  },
  openModalButton: {
    width: '15%',
    backgroundColor: '#6062D7',
    height: 40,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  searchInput: {
    height: 40,
    marginLeft: 10
  },
  plusIcon: {
    color: 'white',
    fontSize: 15
  }
});

export default App;
