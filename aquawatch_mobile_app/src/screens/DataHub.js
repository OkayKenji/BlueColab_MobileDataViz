import React from "react";
import {
  View,
  ScrollView
} from "react-native";
import styles from "../../styles";
import CustomCard from "../components/CustomCard";


export default function DataHub({ navigation }) {
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <CustomCard imageSource={require("../../assets/homescreen/PXL_20221014_204618892.png")}
          paragraph="Choate Pond is in the center of the Pace University campus. This Pond and many others flow out into the Hudson River, contributing to its overall water quality which is why we look at its quality and Pace University's contribution to either better or worse Hudson water quality."
          buttonText="Choate Data"
          cardContainer={styles.dataHubWidget}
          buttonAction={handleChoatePress}
        ></CustomCard>

        <CustomCard imageSource={{ uri: "https://cdn18.picryl.com/photo/2019/11/18/poughkeepsie-bridge-spanning-hudson-river-poughkeepsie-dutchess-county-ny-e51f90-1024.jpg" }}
          paragraph="Poughkeepsie is the furthest north out of all the data points in this app. Ideally this would have the highest water quality as the pollution of the bigger towns down below could not reach it."
          buttonText="Poughkeepsie Data"
          cardContainer={styles.dataHubWidget}
          buttonAction={handlePoughPress}
        ></CustomCard>

        <CustomCard imageSource={{ uri: "https://www.stripes.com/incoming/522n9n-3011234658_baf0dc3ac9_c.jpg/alternates/LANDSCAPE_910/3011234658_baf0dc3ac9_c.jpg" }}
          paragraph="The West Point Military academy is still north of Pace, closer to areas such as Beacon and Cold Spring."
          buttonText="West Point Data"
          cardContainer={styles.dataHubWidget}
          buttonAction={handleWPPress}
        ></CustomCard>

        <CustomCard imageSource={{ uri: "https://res.cloudinary.com/simpleview/image/upload/v1522775889/clients/westchesterny/shutterstock_20108908_1__b0a14121-1a73-4fe0-b578-cac657063725.jpg" }}
          paragraph="Yonkers is the furthest south out of all the data shown. Being closest to NYC we expect this point to be the lowest quality and we at Pace University contribute to this part of the river."
          buttonText="Yonkers Data"
          cardContainer={styles.dataHubWidget}
          buttonAction={handleYonkPress}
        ></CustomCard>
      </View>
    </ScrollView>
  );
}
