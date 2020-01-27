import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, View, Text, TextInput, TouchableOpacity} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import search from '../assets/search.png';
import api from '../services/api';
import {connect, disconnect, subscribeToNewDevs} from '../services/socket';

function Main({navigation}){

    const [devs, setDevs] = useState([]);
    const [location, setLocation] = useState(null);
    const [techs, setTechs] = useState('');

    useEffect(() => {
        function loadInitialPosition(){
            Geolocation.getCurrentPosition(info => {
                setLocation({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                });
            });
        }
        loadInitialPosition();
    }, []);

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);

    if(!location){
        return null;
    }

    function setupWebSocket(){
        disconnect();

        const {latitude, longitude} = location;
        connect(
            latitude,
            longitude,
            techs
        );
    }

    async function loadDevs(){
        const {latitude, longitude} = location;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: techs
            }
        });
        setDevs(response.data.devs);
        setupWebSocket();
    }

    function handleRegionChanged(region){
        setLocation(region);
    }

    return(
        <>
            <MapView style={styles.map} initialRegion={location} onRegionChangeComplete={handleRegionChanged}>
                {devs.map(dev => (
                    <Marker key={dev._id} coordinate={{latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0]}}>
                    <   Image style={styles.avatar} source={{uri: dev.avatar_url}} />
                        <Callout onPress={() => {
                            navigation.navigate('Profile', {github_username: dev.github_username});
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>                    
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Buscar devs por Techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />
                <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
                    <Image source={search} style={styles.imageSearch} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio: {
        color: '#666',
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },
    imageSearch: {
        height: 20,
        width: 20
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',    //iOS
        shadowOpacity: 0.2,     //iOS
        shadowOffset: {    
            width: 4,           //iOS
            height: 4           //iOS
        },
        elevation: 2
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    }
});

export default Main;
