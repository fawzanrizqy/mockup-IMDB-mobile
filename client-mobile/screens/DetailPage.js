import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Dimensions, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_MOVIES_BY_ID, GET_USERS_BY_ID_USER } from "../queries";
import YoutubeIframe from 'react-native-youtube-iframe';
import { Badge } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingScreen from "../components/LoadingScreen";

const dimensionsForScreen = Dimensions.get('screen');


export const DetailPage = ({ navigation, route }) => {
    const { movieId } = route.params;
    const [playing, setPlaying] = useState(false);
    const { data, loading, error } = useQuery(GET_MOVIES_BY_ID, {
        variables: { getMovieByIdId: +movieId }
    });

    const { data: dataUser, loading: loadingUser, error: errorUser } = useQuery(GET_USERS_BY_ID_USER, { variables: { idUser: data?.getMovieById.authorId } });


    const youtube_id = data?.getMovieById.trailerUrl.split("?v=")[1].split("&")[0]

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

    if (loading) return <LoadingScreen />


    return (
        <ScrollView style={{ backgroundColor: "#111016" }}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>{data?.getMovieById.title}</Text>
                <Text style={styles.subtitle}>{data?.getMovieById.years}    {data?.getMovieById.type}   {data?.getMovieById.duration}</Text>

                <View style={{
                    backgroundColor: playing ? 'black' : 'transparent',
                    height: playing ? dimensionsForScreen.height : 250,
                    width: dimensionsForScreen.width,
                    position: playing ? "absolute" : "relative",
                    zIndex: 1
                }}
                >
                    <View style={styles.centerContent}>
                        {youtube_id ? (
                            <>
                                <YoutubeIframe
                                    height={250}
                                    width={dimensionsForScreen.width}
                                    play={playing}
                                    videoId={youtube_id}
                                    onChangeState={onStateChanged}
                                />
                            </>
                        ) : (<Text style={{ color: "white" }}>No trailer available</Text>)}
                    </View>

                </View>


                <View style={styles.cardItem}>
                    <Image
                        source={{ uri: data?.getMovieById.imgUrl ? data?.getMovieById.imgUrl : "https://www.movienewz.com/img/films/poster-holder.jpg" }}
                        style={styles.thumbnail}
                    />
                    <View style={styles.detailsContainer}>
                        <Badge badgeStyle={{ backgroundColor: "#111016", margin: 5, padding: 5, height: 30, marginBottom: 10 }} value={data?.getMovieById.Genre.name} />
                        <Text style={styles.textDetail}>{data?.getMovieById.synopsis} </Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: "white", padding: 10, paddingLeft: 0, fontSize: 15, fontWeight: "bold" }}><Icon name="star" size={15} color="#e7c412" /> {data?.getMovieById.rating} / 10</Text>
                        </View>

                    </View>
                </View>

                <View style={styles.cardItem}>
                    <Text style={[styles.subtitle, { fontSize: 13 }]}>Reviewed by: {dataUser?.getUserByIdUser.email} </Text>
                </View>

                <Text style={{ marginTop: 10, marginLeft: 5, flex: 1, fontWeight: "bold", color: "white", fontSize: 28 }}><Text style={{ fontWeight: "bold", color: "#e7c412", fontSize: 30 }}>|</Text> Casts</Text>
                <View style={styles.cardItem}>
                    <ScrollView horizontal={true}>

                        {
                            data?.getMovieById.Casts.map(actor => {
                                return (

                                    <View style={{ margin: 15, marginTop: 0 }} key={actor.id}>
                                        <Image
                                            source={{ uri: actor.profilePict ? actor.profilePict : "https://i.pinimg.com/originals/82/68/c7/8268c7aadf0a9077396836037307adeb.jpg" }}
                                            style={[styles.thumbnail, { borderRadius: 5, marginBottom: 10 }]} />
                                        <Text style={styles.textDetail}>{actor.name}</Text>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>

                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        backgroundColor: "#111016",

    },
    section: {
        padding: 10,
        backgroundColor: "#343432",
        width: Dimensions.get("window").width,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
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
    detailsContainer: {
        flex: 1,
        padding: 10,
        marginTop: -10,
        alignItems: "flex-start"
    },
    title: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 5,
        marginTop: -40,
        marginLeft: 5
    },
    subtitle: {
        color: "grey",
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 5
    },
    textDetail: {
        color: "white",
        fontSize: 16,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
});