import React from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import styles from "../../styles";

const HomeScreenButtons = (props) => {
  console.log(props)

  return (
    <View style={props.cardContainer}>
      <Image source={props.imageSource} style={styles.imageContainer} />
      <Text style={styles.homeParagraphText}>
        {props.paragraph}
      </Text>

      <TouchableHighlight
        onPress={props.buttonAction}

      >
        <View style={styles.generalButton}>
          <Text style={styles.mainButtonText}>{props.buttonText}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default HomeScreenButtons;
