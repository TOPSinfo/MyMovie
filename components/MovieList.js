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
const demoPic = 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
const MyMovieList = ({ movieData = [] }) => {
    const [selectedTab, setSelectedTab] = useState(1)
    const [movies, setMovies] = useState([])
    const [openID, setOpenID] = useState(null)
    function checkData(movies) {
        if (movies) {
            var myMovieData = movies.filter((item) => {
                if (selectedTab == 0) {
                    return item.watched
                }
                if (selectedTab == 1) {
                    return !item.watched
                }
            })
            return myMovieData
        }
    }

    useEffect(() => {
        setMovies(checkData(movieData))
    }, [movieData, selectedTab])

    async function toggleCheck(index) {
        var tempMovie = [...movies]
        tempMovie[index].watched = !tempMovie[index].watched
        await AsyncStorage.setItem('movieData', JSON.stringify(tempMovie))
        setMovies(checkData(tempMovie))
    }
    function openAccordian(id) {
        if (openID == id) {
            setOpenID(null)
        } else {
            setOpenID(id)
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    const displayList = ({ item, index }) => {
        return (
            <View style={styles.displayListContainer}>
                <TouchableOpacity onPress={() => openAccordian(item.id)} style={styles.arrowButton}>
                    <Icon name={openID == item.id ? 'keyboard-arrow-down' : "keyboard-arrow-right"} type="MaterialIcons" style={{ fontSize: 36, color: '#6062D7' }} />
                    <Text style={styles.titleText}>{item.original_title}</Text>
                </TouchableOpacity>
                {item.id == openID ?
                    <View style={styles.detailContainer}>
                        <Image source={{ uri: item.poster_path ? 'https://image.tmdb.org/t/p/w500' + item.poster_path : demoPic }} style={styles.image} />
                        <View style={styles.movieDetails}>
                            <Text style={styles.textTitle}>Release: {item.release_date}</Text>
                            <Text style={styles.textTitle}>IMDB Score:{item.popularity}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 6 }}>
                                <Text style={{ color: '#31404D', fontWeight: 'bold' }}>Watched:</Text><CheckBox color={item.watched ? '#6062D7' : 'lightgrey'} checked={item.watched} onPress={() => toggleCheck(index)} />
                            </View>
                        </View>
                    </View> : null
                }
            </View>
        )
    }
    function localSearch(text) {
        if (text && movies) {
            var SearchData = movieData.filter((item) => item.original_title.toLowerCase().includes(text.toLowerCase()))
            console.log('SearchData', SearchData)
            setMovies(checkData(SearchData))
        } else {
            setMovies(checkData(movieData))
        }
    }
    const _loademptyData = () => {
        return (
            <View style={styles.noData}>
                <Text>No data available</Text>
            </View>
        )
    }
    return (
        <>
            <View style={styles.listContainer}>
                <TextInput onChangeText={(value) => localSearch(value)} style={{ width: '80%', height: 40 }} placeholder="Search My Movie" />
            </View>
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setSelectedTab(1)}
                    style={{ left: 20, alignItems: 'center', borderBottomWidth: selectedTab == 1 ? 3 : 0, borderBottomColor: '#6D6FF2' }}>
                    <Icon name="eye-off-outline" type="MaterialCommunityIcons" style={{ color: selectedTab == 1 ? '#6D6FF2' : 'black' }} />
                    <Text style={{ color: selectedTab == 1 ? '#6D6FF2' : 'black' }}>Unwatched</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab(0)}
                    style={{ left: 40, alignItems: 'center', borderBottomWidth: selectedTab == 0 ? 3 : 0, borderBottomColor: '#6D6FF2' }}>
                    <Icon name="eye-outline" type="MaterialCommunityIcons" style={{ color: selectedTab == 0 ? '#6D6FF2' : 'black' }} />
                    <Text style={{ color: selectedTab == 0 ? '#6D6FF2' : 'black' }}>Watched</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                ListEmptyComponent={_loademptyData}
                contentContainerStyle={{ paddingBottom: '50%' }}
                keyExtractor={(item, index) => index.toString()}
                data={movies}
                renderItem={displayList}
            />
        </>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        width: '90%',
        marginTop: 20,
        borderWidth: 2,
        borderRadius: 4,
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        borderColor: 'lightgrey'
    },
    tabContainer: {
        flexDirection: 'row',
        marginTop: 20
    },
    noData: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textTitle: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#31404D',
        fontWeight: 'bold'
    },
    displayListContainer: {
        marginHorizontal: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#A4B3BF'
    },
    arrowButton: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        height: 100,
        width: 100
    },
    movieDetails: {
        flexDirection: 'column',
        paddingLeft: 15
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#31404D',
        width: '80%'
    },
    detailContainer: {
        flexDirection: 'row',
        padding: 10
    }

})
export default MyMovieList