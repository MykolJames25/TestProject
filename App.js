import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import VariantSelect from "./components/VariantSelect";
import { isDeepEqual } from "./utils/utils";

const PRODUCT_URL = `https://9xozpkins4.execute-api.ap-southeast-1.amazonaws.com/dev/api/product`;

export default function App() {
  const [variant, setVariant] = useState();
  const [prodInfo, setProdInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState();
  const [variantAvailable, setVariantAvailable] = useState();

  const getProductInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(PRODUCT_URL);
      const json = await res.json();
      setProdInfo(json.product);
      let variantObj = {};
      for (const option of json.product.options) {
        const key = option.name;
        const defaultValue = option.values[0];
        variantObj[key] = defaultValue;
      }
      const firstAvailableVaraint = json.product.variants.find(
        (variant) => variant.isAvailable
      );
      const availableVariant = prodInfo.variants.filter(
        (val) => val.options.color == firstAvailableVaraint.options.color
      );
      setVariantAvailable(availableVariant);
      setVariant(firstAvailableVaraint.options);
      setSelectedVariant(firstAvailableVaraint);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductInfo();
  }, []);

  const updateSelectedVaraint = (variantName, value) => {
    let updatedVariant = JSON.parse(JSON.stringify(variant));
    updatedVariant[variantName] = value;
    const variantDetail = prodInfo.variants.find((val) =>
      isDeepEqual(val.options, updatedVariant)
    );
    const availableVariant = prodInfo.variants.filter(
      (val) => val.options[variantName] == updatedVariant[variantName]
    );
    setVariant({ ...variant, ...updatedVariant });
    setSelectedVariant(variantDetail);
    setVariantAvailable(availableVariant);
  };

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {prodInfo && selectedVariant && (
        <View style={styles.container}>
          {/* Carousel */}
          <View style={styles.imageCarouselContainer}>
            <TouchableOpacity style={styles.carouselButtons}>
              <Text style={styles.carouselButtonsText}>{"<"}</Text>
            </TouchableOpacity>
            <View>
              <Image
                source={{
                  uri: prodInfo.image,
                }}
                style={{ width: 250, height: 300 }}
              />
              <Text
                style={{ textAlign: "center", fontSize: 12, paddingTop: 4 }}
              >
                1 out of 4 image/s
              </Text>
            </View>
            <TouchableOpacity style={styles.carouselButtons}>
              <Text style={styles.carouselButtonsText}>{">"}</Text>
            </TouchableOpacity>
          </View>
          {/* Phone Details */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {prodInfo.name}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {selectedVariant.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "white",
                textDecorationLine: "underline",
              }}
            >
              Mobile Phones
            </Text>
            <View>
              <Text>STARS HERE</Text>
            </View>
            <Text
              style={{
                fontSize: 20,
                color: "#FFB40F",
                fontWeight: "bold",
              }}
            >
              PHP{" "}
              {selectedVariant.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              alignSelf: "stretch",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              <Text style={styles.varaintText}>VARIANTS:</Text>
              {prodInfo.options.map((option, index) => (
                <VariantSelect
                  key={`option-${index}`}
                  selected={variant}
                  option={option}
                  availableVariant={variantAvailable}
                  onVariantSelect={updateSelectedVaraint}
                />
              ))}
            </View>
          </View>
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 30,
  },
  imageCarouselContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  carouselButtons: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#FFB40F",
  },
  carouselButtonsText: {
    color: "white",
  },
  carouselButtonsDisabled: {
    backgroundColor: "#FF803E",
  },
  varaintText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
});
