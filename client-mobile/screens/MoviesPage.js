
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable, ScrollView } from "react-native"
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_MOVIES } from "../queries";
import SnapCarousel from "../components/SnapCarousel";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-elements'
import LoadingScreen from "../components/LoadingScreen";



const CardMovie = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable style={{ height: 400, padding: 5 }} onPress={() => {
            navigation.navigate('Details', {
                movieId: item.id,
            });
        }} >
            <View style={styles.cardItem}>
                <Image source={{
                    uri: item.imgUrl ? item.imgUrl : "https://i.pinimg.com/originals/82/68/c7/8268c7aadf0a9077396836037307adeb.jpg"
                }} style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, height: "100%", width: "100%", flex: 3, marginBottom: 10 }} />
                <Text style={styles.textCard}><Icon name="star" size={15} color="#e7c412" /> {item.rating}</Text>
                <Text style={[styles.titleCard, { marginBottom: -20 }]}>{item.title}</Text>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10, marginLeft: 10 }}>
                    <Badge badgeStyle={{ backgroundColor: "#4D4646", margin: 5, padding: 5, height: 30 }} value={item.years} />
                    <Badge badgeStyle={{ backgroundColor: "#4D4646", margin: 5, padding: 5, height: 30 }} value={item.type} />
                    <Badge badgeStyle={{ backgroundColor: "#4D4646", margin: 5, padding: 5, height: 30 }} value={item.duration} />
                </View>
            </View>
        </Pressable>
    )

}

const CardCast = ({ item }) => {

    return (
        <>
            {
                item.Casts.map((cast, index) => {
                    return (
                        <View style={{ height: 400, padding: 5 }} key={cast.id} >
                            <View style={[styles.cardItem, { alignItems: "center" }]}>
                                <Image source={{
                                    uri: cast.profilePict ? cast.profilePict : "https://i.pinimg.com/originals/82/68/c7/8268c7aadf0a9077396836037307adeb.jpg"
                                }} style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, height: "100%", width: "100%", flex: 3, marginBottom: 10 }} />
                                <Text style={[styles.titleCard, { marginBottom: -50 }]}>{cast.name}</Text>
                            </View>
                        </View>
                    )
                })
            }
        </>
    )

}


export const MoviesPage = ({ navigation }) => {

    const { data, loading, error } = useQuery(GET_MOVIES);

    if (error) return <Text>{error.message}</Text>;
    if (loading) return <LoadingScreen />

    return (
        <>
            <StatusBar style="inverted" />
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ backgroundColor: "#111016", height: Dimensions.get("window").height }}>
                    <Text style={{ marginLeft: 5, marginBottom: 10, flex: 1, fontWeight: "bold", color: "white", fontSize: 28 }}><Text style={{ fontWeight: "bold", color: "#e7c412", fontSize: 30 }}>|</Text> Featured Movies</Text>

                    <View style={{ height: 400, marginBottom: 20, marginTop: 10 }}>
                        {
                            data && (
                                <SnapCarousel movies={data && data.getMovies} />
                            )
                        }
                    </View>
                    <Text style={{ marginLeft: 5, marginBottom: 10, flex: 1, fontWeight: "bold", color: "white", fontSize: 28 }}><Text style={{ fontWeight: "bold", color: "#e7c412", fontSize: 30 }}>|</Text> Fans Favorites</Text>
                    <View style={{ height: 450 }}>
                        <View style={styles.section}>
                            <FlatList
                                style={{ flex: 1 }}
                                horizontal={true}
                                data={data?.getMovies}
                                renderItem={({ item }) => <CardMovie item={item} />}
                                keyExtractor={(movie) => movie.id}
                            />
                        </View>
                    </View>
                    <Text style={{ marginLeft: 5, marginBottom: 10, flex: 1, fontWeight: "bold", color: "white", fontSize: 28 }}><Text style={{ fontWeight: "bold", color: "#e7c412", fontSize: 30 }}>|</Text> Top Casts</Text>
                    <View style={{ height: 450 }}>
                        <View style={styles.section}>
                            <FlatList
                                style={{ flex: 1 }}
                                horizontal={true}
                                data={data?.getMovies}
                                renderItem={({ item }) => <CardCast item={item} />}
                                keyExtractor={(movie) => movie.id}
                            />
                        </View>
                    </View>
                </ScrollView>
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
        backgroundColor: "rgba(43, 37, 35, 0.1)",
        flex: 1, width: Dimensions.get('window').width, padding: 10,
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
    cardItem:
    {
        borderRadius: 20,
        paddingBottom: 10,
        backgroundColor: "#4D4646",
        width: 210,
        flex: 1,
        height: 350,
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
    titleCard: { color: "white", marginLeft: 10, flex: 1, fontSize: 15, fontWeight: "bold", marginBottom: 10 },
    textCard: { color: "white", marginLeft: 10, fontWeight: "bold", textAlign: "left", marginBottom: 2 },
});