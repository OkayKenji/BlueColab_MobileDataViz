import { Camera, CameraType } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Switch, Button, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Image, SafeAreaView, FlatList, TouchableHighlight } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function AiScreen({ navigation }) {

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [aiReplyVisible, setAIVisible] = useState(false);
  const [speciesData, setSpeciesData] = useState([]);
  const [jsonData, setJsonData] = useState(null);


  useEffect(() => {
    // Import the local JSON file using require
    const localJson = require('../../assets/USRIISv2_MasterList.json');

    // Access the JSON data
    setJsonData(localJson);

    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      }
    };

    getLocation();
  }, []); // Run only once when the component mounts


  // permission handling
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: onPictureSaved });
    }
  };

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
  }

  const onPictureSaved = (photo) => {
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  const __savePhoto = async () => {
    const uri = capturedImage.uri;
    uploadImage(uri);
    setAIVisible(true);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setPreviewVisible(true);

      // Check if the result contains the 'assets' array
      if (result.assets && result.assets.length > 0) {
        // Use the first item in the 'assets' array
        setCapturedImage(result.assets[0]);
      } else {
        // Fallback to using the 'uri' property if 'assets' is not available (for older versions)
        setCapturedImage(result);
      }
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const uploadImage = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('organs', 'auto');

      // Append the image file to FormData
      formData.append('images', {
        uri: imageUri,
        name: 'image.png',
        type: 'image/png',
      });

      // Use the formData object in your API request
      const apiKey = '2b10RIKodP0IQc4eGgBJFaABO'; // Replace with your actual PlantNet API key
      const apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseData = await response.json();



      if (response.status == 404) {

        return;
      }

      let plantList = responseData.results;

      // attaches links to images of the plants
      const promises = plantList.map(async (item) => {
        try {
          const result1 = await getImages(item.gbif.id);
          item.imgs = result1;
        } catch (error) {
          console.error(`Error for ${item.species.scientificNameWithoutAuthor}: ${error.message}`);
        }
      });

      await Promise.all(promises);


      try {
        const rows = jsonData.scientificName;

        // Iterate over CSV rows
        rows.forEach((row) => {
          currentName = row;
          plantList.forEach((species) => {
            const scientificNameWithoutAuthor = species.species.scientificNameWithoutAuthor;

            if (scientificNameWithoutAuthor === currentName) {
              species.invasive = true;
            } else if (species.invasive === true) {
              // edge case
            } else {
              species.invasive = false;
            }
          });
        });

        console.log('Finished reading the CSV file.');
        setSpeciesData(plantList);
        // console.log(result.data.results);
      } catch (error) {
        console.error(`An error occurred: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
      }



      if (responseData != 'Species not found') {
        setSpeciesData(responseData.results);
      } else {
        setSpeciesData([
          {
            species: {
              scientificNameWithoutAuthor: "Error! Could not identify a plant.",
              commonNames: []
            },
            score: 0,
            invasive: false
          }
        ]);
      }

    } catch (error) {
      // Handle errors
      console.error('Error uploading image: ', error);
    }
  };

  // gets images of plants
  async function getImages(id) {
    try {
      const apiUrl = `https://api.gbif.org/v1/species/${id}/media`;
      const response = await axios.get(apiUrl);

      const listOfNames = response.data.results.map(obj => obj.identifier);

      return listOfNames;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }

  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (aiReplyVisible ? (<AIResponse speciesData={speciesData} navigation={navigation} />) : (<CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />)
      ) : (<Camera style={styles.camera} type={type} ref={(ref) => { this.camera = ref }} >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture} >
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage} >
            <Text style={styles.text}>Photo from Phone</Text>
          </TouchableOpacity>
        </View>
      </Camera>)}
    </View>
  );
}

const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
  // console.log('The photo', photo)
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                analyze photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}
const ImageGallery = ({ imageUrls }) => {

  return (
    <View style={styles.container}>
      <Text>Sample Images (if available):</Text>
      <FlatList
        data={imageUrls}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.thumbnail} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const Item = ({ title, score, commonNames, isInvasive, isEnabled, imgs }) => {

  if (isEnabled && score < 0.01) {
    return <></>
  }


  if (commonNames.length <= 0)
    return (<View style={styles.item}>
      <Text style={styles.sidewaystitle}><Text>{title}</Text></Text>
      <Text>Score: {Math.round(score * 10000) / 100}</Text>
      <Text>Invasive: {isInvasive ? "Yes" : "No"}</Text>
      <ImageGallery imageUrls={imgs} />
    </View>)
  else if ((commonNames.length == 1)) {
    return (<View style={styles.item}>
      <Text style={styles.title}>{commonNames[0]}</Text>
      <Text>Scientific Name: <Text style={styles.sideways} >{title}</Text></Text>
      <Text>Score: {Math.round(score * 10000) / 100}</Text>
      <Text>Invasive: {isInvasive ? "Yes" : "No"}</Text>
      <ImageGallery imageUrls={imgs} />
    </View>)
  } else if ((commonNames.length > 1)) {
    return (<View style={styles.item}>
      <Text style={styles.title}>{commonNames[0]}</Text>
      <Text>Other Common Name(s): {commonNames.slice(1).join(", ")}</Text>
      <Text>Scientific Name: <Text style={styles.sideways} >{title}</Text></Text>
      <Text>Score: {Math.round(score * 10000) / 100}</Text>
      <Text>Invasive: {isInvasive ? "Yes" : "No"}</Text>
      <ImageGallery imageUrls={imgs} />
    </View>)
  }
};

const AIResponse = ({ speciesData, navigation }) => {


  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      }
    };

    getLocation();
  }, []); // Run only once when the component mounts


  const loadingImages = [
    "https://cdn.dribbble.com/users/2882885/screenshots/7861928/media/a4c4da396c3da907e7ed9dd0b55e5031.gif",
    "https://media.tenor.com/DHkIdy0a-UkAAAAC/loading-cat.gif",
    "https://64.media.tumblr.com/bdaea39db57dc0b48d763262514268db/tumblr_mgj44mNyST1s199fdo1_500.gif",
    "https://cdn.dribbble.com/users/160117/screenshots/3197970/main.gif",
  ];

  const displaySpecies = (species) => {
    if (species.length > 0) { // valid array received
      return (
        <SafeAreaView style={styles.container}>
          <View>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text>Display responses with a score above 1%.</Text>
          </View>

          <View>
            {errorMsg ? (
              <Text>{errorMsg}</Text>
            ) : location ? (
              <Text>
                <ClosetLocation lat={location.coords.latitude} long={location.coords.longitude} navigation={navigation}></ClosetLocation>
              </Text>
            ) : (
              <Text>Loading Location...</Text>
            )}
          </View>

          <FlatList
            data={species}
            renderItem={({ item }) => <Item title={item.species.scientificNameWithoutAuthor} score={item.score} commonNames={item.species.commonNames} isInvasive={item.invasive} isEnabled={isEnabled} imgs={item.imgs} />}
            keyExtractor={item => item.species.scientificNameWithoutAuthor}
          />
        </SafeAreaView>
      );
    } else { // an error or we're still waiting for a response from a server
      return (
        <View>
          <Text>Loading...</Text>
          <Image
            source={{ uri: loadingImages[Math.floor(Math.random() * loadingImages.length)] }}
            style={{ height: 500, width: 400 }} // Adjust the dimensions as needed
          />
        </View>
      );
    }


  }

  return (
    displaySpecies(speciesData)
  )
}

const ClosetLocation = ({ lat, long, navigation }) => {
  const handleChoatePress = () => {
    navigation.navigate("Choate");
  };
  const handlePoughPress = () => {
    navigation.navigate("Pough");
  };
  const handleWPPress = () => {
    navigation.navigate("WP");
  };
  const handleYonkPress = () => {
    navigation.navigate("Yonk");
  };
  // Example usage:
  const coordinates1 = { latitude: lat, longitude: long };

  const locationList = [
    { location: "Choate", latitude: 41.127462, longitude: -73.8088307 },
    { location: "Yonkers", latitude: 40.936250, longitude: -73.904306 },
    { location: "West Point", latitude: 41.3862049, longitude: -73.95513879 },
    { location: "Pough", latitude: 41.721667, longitude: -73.941111 }
  ]

  let minDistance = haversineDistance(coordinates1, locationList[0]);
  let minLocation = locationList[0].location;

  for (let location of locationList) {
    if (haversineDistance(coordinates1, location) < minDistance) {
      minLocation = location.location;
      minDistance = haversineDistance(coordinates1, location);
    }
  }

  if (minLocation == "Choate") {
    return (<View>
      <TouchableHighlight
        onPress={() => {
          handleChoatePress();
        }}
      > 
        <View>
          <Text>Invasive Species have an effect on your water! Choate Pond is the closest body of water we have access of. Click here to learn more.</Text>
        </View>
      </TouchableHighlight></View>)
  } else if (minLocation == "Yonkers") {
    return (<View>
      <TouchableHighlight
        onPress={() => {
          handleYonkPress();
        }}
      > 
        <View>
          <Text>Invasive Species have an effect on your water! Yonkers is the closest body of water we have access of. Click here to learn more.</Text>
        </View>
      </TouchableHighlight></View>)
  } else if (minLocation == "West Point") {
    return (<View>
      <TouchableHighlight
        onPress={() => {
          handleWPPress();
        }}
      > 
        <View>
          <Text>Invasive Species have an effect on your water! West Point is the closest body of water we have access of. Click here to learn more.</Text>
        </View>
      </TouchableHighlight></View>)
  } else if (minLocation == "Pough") {
    return (<View>
      <TouchableHighlight
        onPress={() => {
          handlePoughPress();
        }}
      > 
        <View>
          <Text>Invasive Species have an effect on your water! Poughkeepsie is the closest body of water we have access of. Click here to learn more.</Text>
        </View>
      </TouchableHighlight></View>)
  } else {
    return (<View>
      <TouchableHighlight
        onPress={() => {
          handleChoatePress();
        }}
      > 
        <View>
          <Text>Invasive Species have an effect on your water! Choate Pond is the closest body of water we have access of. Click here to learn more.</Text>
        </View>
      </TouchableHighlight></View>)
  }




  // return (
  //   <View><Text>Hello {minLocation} at {minDistance} km</Text></View>
  // )
}

function haversineDistance(coord1, coord2) {
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  const R = 6371; // Earth radius in kilometers

  const lat1 = toRadians(coord1.latitude);
  const lon1 = toRadians(coord1.longitude);
  const lat2 = toRadians(coord2.latitude);
  const lon2 = toRadians(coord2.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  sidewaystitle: {
    fontSize: 32,
    fontStyle: 'italic'
  },
  sideways: {
    fontStyle: 'italic'
  },

  thumbnail: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: 'cover', // or 'contain' for different scaling options
  },
});

