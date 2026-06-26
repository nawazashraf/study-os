

import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

interface Props {
  date: Date;
  setDate: (date: Date) => void;
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const DatePicker = ({ date, setDate }: Props) => {
  const [show, setShow] = useState(false);

  const onChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShow(false);
    if (selected) setDate(selected);
  };

  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        className="bg-surface rounded-2xl px-4 py-3 flex-row items-center justify-between"
      >
        <Text className="text-text">{formatDate(date)}</Text>
        <Text className="text-muted text-sm">📅</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onChange}
          minimumDate={new Date()}
          themeVariant="dark"
        />
      )}

      {show && Platform.OS === "ios" && (
        <Pressable onPress={() => setShow(false)} className="items-center py-2">
          <Text className="text-primary font-medium">Done</Text>
        </Pressable>
      )}
    </View>
  );
};

export default DatePicker;
