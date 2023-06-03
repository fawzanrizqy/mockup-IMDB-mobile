import React, { useState } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const SnapCarousel = ({ movies }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);


    // const { getMovies: movies } = data;
    const [scale, setScale] = useState(1);
    const [savedScale, setSavedScale] = useState(1);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            setScale(savedScale * e.scale);
        })
        .onEnd(() => {
            setSavedScale(scale)
        });


    const handleImagePress = (index) => {
        setSelectedImageIndex(index);
    };

    const handleModalClose = () => {
        setSelectedImageIndex(null);
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => handleImagePress(index)} style={{ alignItems: "center" }}>
            <Image
                source={{ uri: item.imgUrl }}
                style={{ width: '80%', height: Dimensions.get('window').height / 2.5 }}
                resizeMode="contain"
            />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <Carousel
                data={movies}
                renderItem={renderItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width}
                onSnapToItem={(index) => setActiveSlide(index)}
            />
            <Pagination
                dotsLength={movies ? movies.length : 0}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.paginationDot}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
            <Modal visible={selectedImageIndex !== null} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <GestureDetector gesture={pinchGesture}>
                        <Image
                            source={{ uri: movies[selectedImageIndex]?.imgUrl }}
                            style={[styles.fullScreenImage, { transform: [{ scale }] }]}
                            resizeMode="contain"
                        />
                    </GestureDetector>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        position: 'absolute',
        bottom: 0,
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        width: '58%',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 120,
        right: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 5,
        padding: 10,
        zIndex: 1,
        fontSize: 10,
        fontWeight: "bold"
    },
    closeButtonText: {
        fontSize: 15,
        color: '#FFFFFF',
    },
    fullScreenImage: {
        width: '90%',
        height: Dimensions.get('window').height * 0.8,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: -50,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default SnapCarousel;