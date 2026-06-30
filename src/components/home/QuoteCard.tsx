import { quotes } from "@/data/quotes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text } from "react-native";

export default function QuoteCard() {
  const [index, setIndex] = useState(0);

  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -12,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((prev) => {
          let next = Math.floor(Math.random() * quotes.length);

          while (next === prev) {
            next = Math.floor(Math.random() * quotes.length);
          }

          return next;
        });

        translateY.setValue(12);

        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 350,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 350,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="rounded-2xl px-4 py-2 min-w-48 flex flex-row justify-center items-center"
    >
      <Text className="text-text text-lg leading-7 italic">
        <MaterialCommunityIcons name="comma" color={"#3b82f6"} />
        <MaterialCommunityIcons name="comma" color={"#3b82f6"} />
        {quotes[index].text}
      </Text>
    </Animated.View>
  );
}
