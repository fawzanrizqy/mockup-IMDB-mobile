import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Dimensions, Image, Pressable, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_MOVIES } from "../queries";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-elements';
import LoadingScreen from "../components/LoadingScreen";

const CardMovie = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable style={{ height: 650, padding: 5 }} onPress={() => {
            navigation.navigate('Details', {
                movieId: item.id,
            });
        }}>
            <View style={styles.cardItem}>
                <Image source={{ uri: item.imgUrl }} style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, height: "100%", width: "100%", flex: 3, marginBottom: 10 }} />
                <Text style={styles.textCard}><Icon name="star" size={15} color="yellow" /> {item.rating}</Text>
                <Text style={[styles.titleCard, { marginBottom: -20 }]}>{`${item.title}\n`}<Text style={{ color: "white", fontWeight: "normal" }}>{item.synopsis}</Text>
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10, marginLeft: 10 }}>
                    <Badge badgeStyle={{ backgroundColor: "#3D3C3A", margin: 5, padding: 5, height: 30 }} value={item.years} />
                    <Badge badgeStyle={{ backgroundColor: "#3D3C3A", margin: 5, padding: 5, height: 30 }} value={item.type} />
                    <Badge badgeStyle={{ backgroundColor: "#3D3C3A", margin: 5, padding: 5, height: 30 }} value={item.duration} />
                </View>
            </View>
        </Pressable>
    )
}

export const SearchPage = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");
    const { data, loading, error } = useQuery(GET_MOVIES);

    const filteredMovies = data?.getMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchText.toLowerCase())
    );

    if (error) return <Text>{error.message}</Text>;
    if (loading) return <LoadingScreen />
    return (
        <>
            <StatusBar style="inverted" />
            <SafeAreaView style={[styles.container, { backgroundColor: "#111016", height: Dimensions.get("window").height }]}>

                <View style={[styles.searchContainer, { marginBottom: -50, zIndex: 5 }]}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search movies"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <View style={{ height: Dimensions.get("screen").height, alignItems: "center" }}>
                    <View style={styles.section}>
                        <SafeAreaView>
                            <Text style={{ marginLeft: 5, marginBottom: 10, fontWeight: "bold", color: "white", fontSize: 28 }}><Text style={{ fontWeight: "bold", color: "#e7c412", fontSize: 30 }}>|</Text> Movies</Text>
                            <FlatList
                                style={{ flex: 1 }}
                                data={filteredMovies}
                                renderItem={({ item }) => <CardMovie item={item} />}
                                keyExtractor={(movie) => movie.id.toString()}
                            />
                        </SafeAreaView>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        backgroundColor: "#111016",
        height: Dimensions.get("window").height,
    },
    section: {
        backgroundColor: "rgba(43, 37, 35, 0.2)",
        flex: 1,
        width: Dimensions.get('window').width,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        marginBottom: 10,
        elevation: 9,
        alignItems: "center"
    },
    cardItem: {
        borderRadius: 20,
        paddingBottom: 10,
        backgroundColor: "rgba(61, 60, 58,0.2)",
        width: 300,
        flex: 1,
        marginEnd: 10,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        marginBottom: 10,
        elevation: 9,
    },
    titleCard: {
        color: "white",
        marginLeft: 10,
        flex: 1,
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textCard: {
        color: "white",
        marginLeft: 10,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 2,
    },
    searchContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    searchInput: {
        backgroundColor: "#4D4646",
        color: "white",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
});