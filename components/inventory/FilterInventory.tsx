// components/inventory/FilterInventory.tsx
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface FilterProps {
  filters: {
    name: string;
    category: string;
  };
  onFilterChange: (key: string, value: string) => void;
  categories: { id: number; name: string }[];
}

const FilterInventory: React.FC<FilterProps> = ({
  filters,
  onFilterChange,
  categories,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={filters.name}
        onChangeText={(text) => onFilterChange("name", text)}
      />

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={filters.category}
          onValueChange={(value) => onFilterChange("category", value)}
        >
          <Picker.Item label="Categoría" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    width: 160,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    width: 160,
  },
});

export default FilterInventory;
