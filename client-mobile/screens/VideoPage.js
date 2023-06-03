import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import YoutubeIframe from 'react-native-youtube-iframe';
import { GET_MOVIES, GET_MOVIES_BY_ID } from '../queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Badge } from 'react-native-elements'
import LoadingScreen from '../components/LoadingScreen';



export const VideoPage = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [playing, setPlaying] = useState(false);
    const { loading, error, data } = useQuery(GET_MOVIES);

    const { getMovies: movies } = data;
    const [selectedMovie, setSelectedMovie] = useState(movies[0]?.id);

    const handleSnapToItem = useCallback((index) => {
        setActiveSlide(index);
    }, []);

    const handleChangeDetail = () => {
        setSelectedMovie(movies[activeSlide].id);
    }

    useEffect(() => {
        handleChangeDetail();
    }, [activeSlide])

    const DetailCard = ({ idMovie }) => {
        const [dispatch, { data, loading }] = useLazyQuery(GET_MOVIES_BY_ID);
        useEffect(() => { dispatch({ variables: { getMovieByIdId: +idMovie } }); }, [])

        if (loading) return <LoadingScreen />

        return (
            <View style={[styles.cardItem]}>
                <View style={[styles.detailsContainer, { paddingBottom: 20 }]}>
                    <Text style={styles.title}>{data?.getMovieById.title} </Text>
                    <Text style={styles.subtitle}>{data?.getMovieById.years}    {data?.getMovieById.duration}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Badge badgeStyle={{ backgroundColor: "#111016", margin: 5, padding: 5, height: 30, marginBottom: 10 }} value={data?.getMovieById.Genre.name} />
                        <Badge badgeStyle={{ backgroundColor: "#111016", margin: 5, padding: 5, height: 30, marginBottom: 10 }} value={data?.getMovieById.type} />
                        <Badge badgeStyle={{ backgroundColor: "#e7c412", margin: 5, padding: 5, height: 30, marginBottom: 10 }} textStyle={{ color: "black" }} value={data?.getMovieById.rating} />
                    </View>
                    <Text style={[styles.textDetail, { marginTop: 10 }]}>{data?.getMovieById.synopsis}</Text>
                </View>
            </View>
        )
    }

    const onStateChanged = useCallback(state => {
        if (state === 'ended') {
            setPlaying(false);
        }
        if (state === 'playing') {
            setPlaying(true);
        }
        if (state === 'paused') {
            setPlaying(false);
        }
    }, []);

    const renderItem = ({ item, index }) => (
        <View style={{ alignItems: "center", height: 350 }}>
            <View style={{
                backgroundColor: 'black',
                height: 350,
                width: '100%',

                position: 'relative',
            }}>
                <View style={styles.centerContent}>
                    {activeSlide === index ? (
                        <YoutubeIframe
                            height={Dimensions.get('window').height / 2.5}
                            width="100%"
                            play={playing}
                            videoId={item.trailerUrl.split("?v=")[1].split("&")[0]}
                            onChangeState={onStateChanged}
                        />
                    ) : item.trailerUrl ? (
                        <LoadingScreen />
                    ) : (
                        <Text style={{ color: "white" }}>No trailer available</Text>
                    )}
                </View>
            </View>
            <View style={[styles.titleContainer, { display: playing ? "none" : "flex", }]}>
                <Image
                    source={{ uri: item.imgUrl ? item.imgUrl : "https://i.pinimg.com/originals/82/68/c7/8268c7aadf0a9077396836037307adeb.jpg" }}
                    style={styles.thumbnail}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={{ marginTop: 10, marginLeft: 5, marginBottom: 10, fontWeight: "bold", color: "white", fontSize: 28 }}>
                    <Text style={{ fontWeight: "bold", color: "#e7c412", fontSize: 30 }}>|</Text> Featured Trailers
                </Text>
                <View>
                    <Carousel
                        data={movies}
                        renderItem={renderItem}
                        sliderWidth={Dimensions.get('screen').width}
                        itemWidth={Dimensions.get('screen').width}
                        onSnapToItem={handleSnapToItem}
                    />
                    <Pagination
                        dotsLength={movies ? movies.length : 0}
                        activeDotIndex={activeSlide}
                        containerStyle={styles.paginationContainer}
                        dotStyle={styles.paginationDot}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                    />
                </View>
                <DetailCard idMovie={selectedMovie} />
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        backgroundColor: "#111016",
        height: Dimensions.get('window').height,
    },
    titleContainer: {
        position: 'absolute',
        bottom: 0,
        left: 5,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailsContainer: {
        flex: 1,
        padding: 10,
        marginTop: -10,
        alignItems: "flex-start"
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    paginationContainer: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 1,
        backgroundColor: '#FFFFFF',
    },
    subtitle: {
        color: "grey",
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 5
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    thumbnail: {
        width: 100,
        height: 150,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        padding: 10
    },
    textDetail: {
        color: "white",
        fontSize: 16,
    },
    title: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 5,
        marginLeft: 5
    },
    cardItem: {
        flexDirection: "row",
        borderRadius: 5,
        // backgroundColor: "#4D4646",
        width: Dimensions.get("window").width,
        margin: 10,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        padding: 10
    },
});