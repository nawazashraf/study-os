import { routine } from "@/data/routine";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const data = [
  ...new Map(
    Object.values(routine)
      .flat()
      .filter((item) => item.subject !== "Recess")
      .map((item) => [
        item.subject,
        {
          label: item.subject,
          value: item.id,
        },
      ]),
  ).values(),
];

interface DropdownComponentProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const DropdownComponent = ({ value, onChange }: DropdownComponentProps) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#3B82F6" }]}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemTextStyle={styles.itemTextStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Subject"
        searchPlaceholder="Search Subject..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item?.value ?? null);
          setIsFocus(false);
        }}
        activeColor="#27272A"
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "#3B82F6" : "#FFFFFF"}
            name="book"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  dropdown: {
    height: 50,
    backgroundColor: "#18181B",
    borderColor: "#3F3F46",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  dropdownContainer: {
    backgroundColor: "#18181B",
    borderColor: "#3F3F46",
    borderRadius: 12,
  },

  icon: {
    marginRight: 8,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  placeholderStyle: {
    fontSize: 16,
    color: "#A1A1AA",
  },

  selectedTextStyle: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  inputSearchStyle: {
    borderRadius: 50,
    height: 40,
    fontSize: 16,
    color: "#FFFFFF",
  },

  itemTextStyle: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
