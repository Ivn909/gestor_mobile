import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(filters.category);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const formatted = categories.map((cat) => ({
      label: cat.name,
      value: cat.name,
    }));
    setItems(formatted);
  }, [categories]);

  useEffect(() => {
    setValue(filters.category);
  }, [filters.category]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={filters.name}
        onChangeText={(text) => onFilterChange("name", text)}
      />

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Categoría"
        onChangeValue={(val) => onFilterChange("category", val || "")}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    zIndex: 1000,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 48,
    width: "100%",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    width: "100%",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
  },
});

export default FilterInventory;
