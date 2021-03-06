import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import * as ImgPicker from "expo-image-picker";
import { useAppContext } from "~/contexts/AppContext";
import { Ionicons } from "@expo/vector-icons";

export default function ImagePicker({ onTakeImage, selectedImage }) {
  const { appColors } = useAppContext();
  const [pickedImage, setPickedImage] = useState(selectedImage);

  const verifyPermissionMedia = async () => {
    const { status } = await ImgPicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Media Not Access",
        "We need permission to access media device",
        [
          {
            text: "Okey",
            style: "destructive",
          },
        ]
      );
      return false;
    } else {
      return true;
    }
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissionMedia();
    if (!hasPermission) {
      return;
    }
    const image = await ImgPicker.launchImageLibraryAsync({
      mediaTypes: ImgPicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.2,
    });

    if (!image.cancelled) {
      setPickedImage(image.uri);
      onTakeImage(image.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.5} onPress={takeImageHandler}>
        <View
          style={{
            ...styles.pickerWrap,
            backgroundColor: appColors.input.background,
            borderColor: appColors.input.border,
          }}
        >
          {pickedImage ? (
            <Image
              style={styles.image}
              source={{ uri: pickedImage }}
              resizeMethod="resize"
            />
          ) : (
            <View style={styles.emptyImage}>
              <Ionicons
                name="camera"
                color={appColors.input.border}
                size={50}
              />
              <Text
                style={{ ...styles.label, color: appColors.input.palceholder }}
              >
                Upload a Image
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  pickerWrap: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  emptyImage: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
