import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const VariantSelect = ({
  selected,
  option,
  onVariantSelect,
  availableVariant,
}) => {
  const onSelect = (value) => {
    onVariantSelect(option.name, value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.variantTitle}>{option.name.toUpperCase()}:</Text>
      <View style={styles.optionsContainer}>
        {option.values.map((value, index) => {
          const variants = availableVariant.filter(
            (val) => val.options[option.name] == value
          );
          console.log("VariantSelect, variants", variants);
          return (
            <TouchableOpacity
              key={`option-${option.name}-${index}`}
              disabled={variants.length == 0}
              style={[
                styles.variantContainer,
                selected &&
                  selected[option.name] == value &&
                  styles.selectedVariant,
              ]}
              onPress={() => {
                onSelect(value);
              }}
            >
              <Text
                style={[
                  styles.variantText,
                  selected &&
                    selected[option.name] == value &&
                    styles.selectedVariantText,
                  variants.length == 0 && styles.variantTextNotAvailable,
                ]}
              >
                {value.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 5,
    borderColor: "green",
    borderWidth: 1,
    marginVertical: 5,
  },
  optionsContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "stretch",
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
  variantText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "green",
  },
  variantContainer: {
    backgroundColor: "white",
    width: "33%",
  },
  selectedVariant: {
    backgroundColor: "green",
  },
  selectedVariantText: {
    color: "white",
  },
  variantTextNotAvailable: {
    textDecorationLine: "line-through",
    color:"lightgray"
  },
});

export default VariantSelect;
