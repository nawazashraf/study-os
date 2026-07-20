import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

type CustomSplashProps = {
  ready: boolean;
  onFinish: () => void;
};

const APP_NAME = "StudyOS";
const BADGE_SIZE = 110;
const RING_RADIUS = 46;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;
const DASH_RADIUS = 54;
const PARTICLE_COUNT = 14;

export default function CustomSplash({ ready, onFinish }: CustomSplashProps) {
  const letters = useMemo(() => APP_NAME.split(""), []);
  const letterAnims = useRef(letters.map(() => new Animated.Value(0))).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const creditAnim = useRef(new Animated.Value(0)).current;
  const dotAnims = useRef([0, 1, 2].map(() => new Animated.Value(0.3))).current;

  const badgeScale = useRef(new Animated.Value(0)).current;
  const dashRotate = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const boltDraw = useRef(new Animated.Value(0)).current;
  const boltFill = useRef(new Animated.Value(0)).current;

  const orb1 = useRef(new Animated.Value(0)).current;
  const orb2 = useRef(new Animated.Value(0)).current;
  const orb3 = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => new Animated.Value(0)),
  ).current;
  const particleAngles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const rad = (i * (360 / PARTICLE_COUNT) * Math.PI) / 180;
        return { dx: Math.cos(rad) * 90, dy: Math.sin(rad) * 90 };
      }),
    [],
  );

  const flashAnim = useRef(new Animated.Value(0)).current;
  const exitFade = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;
  const exitTranslateY = useRef(new Animated.Value(0)).current;

  const burst = (multiplier = 1) => {
    particles.forEach((v) => v.setValue(0));
    Animated.stagger(
      15,
      particles.map((v) =>
        Animated.timing(v, {
          toValue: 1 * multiplier,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ).start();
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(dashRotate, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const drift = (val: Animated.Value, duration: number, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(val, { toValue: 0, duration, useNativeDriver: true }),
        ]),
      );
    drift(orb1, 2400).start();
    drift(orb2, 3000, 300).start();
    drift(orb3, 2000, 600).start();

    Animated.spring(badgeScale, {
      toValue: 1,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();

    Animated.timing(boltDraw, {
      toValue: 1,
      duration: 550,
      delay: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(boltFill, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start(() => burst(0.5));
    });

    Animated.timing(progressAnim, {
      toValue: 0.82,
      duration: 2600,
      delay: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    Animated.stagger(
      55,
      letterAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ),
    ).start();

    Animated.timing(taglineAnim, {
      toValue: 1,
      duration: 500,
      delay: letters.length * 55 + 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(creditAnim, {
      toValue: 1,
      duration: 500,
      delay: letters.length * 55 + 900,
      useNativeDriver: true,
    }).start();

    dotAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 450,
            delay: i * 150,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  useEffect(() => {
    if (!ready) return;

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      burst(1.4);

      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.85,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(exitFade, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(exitScale, {
            toValue: 1.12,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(exitTranslateY, {
            toValue: -24,
            duration: 350,
            useNativeDriver: true,
          }),
        ]).start(() => onFinish());
      }, 180);
    });
  }, [ready]);

  const dashSpin = dashRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const progressOffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [RING_CIRC, 0],
  });
  const boltOffset = boltDraw.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0],
  });
  const boltColor = boltFill.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,1)"],
  });

  const orbStyle = (val: Animated.Value, distance: number) => ({
    transform: [
      {
        translateY: val.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -distance],
        }),
      },
      {
        scale: val.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }),
      },
    ],
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.6] }),
  });

  return (
    <Animated.View
      className="absolute inset-0 z-50 bg-[#081226] justify-center items-center overflow-hidden"
      style={{
        opacity: exitFade,
        transform: [{ scale: exitScale }, { translateY: exitTranslateY }],
      }}
    >
      <LinearGradient
        colors={["#081226", "#0F2A56", "#208AEF", "#3D5CFF"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        className="absolute inset-0"
      />

      <Animated.View
        className="absolute w-[140px] h-[140px] rounded-full bg-white/15 top-[12%] left-[8%]"
        style={orbStyle(orb1, 22)}
      />
      <Animated.View
        className="absolute w-[180px] h-[180px] rounded-full bg-white/15 bottom-[15%] right-[6%]"
        style={orbStyle(orb2, 30)}
      />
      <Animated.View
        className="absolute w-[90px] h-[90px] rounded-full bg-white/15 top-[58%] right-[18%]"
        style={orbStyle(orb3, 16)}
      />

      <View className="items-center justify-center">
        <Animated.View
          className="w-[110px] h-[110px] rounded-full bg-white/[0.06] border border-white/20 items-center justify-center mb-[26px]"
          style={{ transform: [{ scale: badgeScale }] }}
        >
          <Animated.View
            className="absolute inset-0"
            style={{ transform: [{ rotate: dashSpin }] }}
          >
            <Svg width={BADGE_SIZE} height={BADGE_SIZE} viewBox="0 0 110 110">
              <Circle
                cx={55}
                cy={55}
                r={DASH_RADIUS}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={1.5}
                strokeDasharray="4 8"
                fill="none"
              />
            </Svg>
          </Animated.View>

          <Svg
            width={BADGE_SIZE}
            height={BADGE_SIZE}
            viewBox="0 0 110 110"
            className="absolute inset-0"
          >
            <Circle
              cx={55}
              cy={55}
              r={RING_RADIUS}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={3}
              fill="none"
            />
            <AnimatedCircle
              cx={55}
              cy={55}
              r={RING_RADIUS}
              stroke="#FFFFFF"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={progressOffset}
              fill="none"
              rotation="-90"
              origin="55, 55"
            />
          </Svg>

          <Svg width={40} height={40} viewBox="0 0 24 24">
            <AnimatedPath
              d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              strokeDasharray={60}
              strokeDashoffset={boltOffset}
              fill={boltColor}
            />
          </Svg>

          {particles.map((val, i) => {
            const { dx, dy } = particleAngles[i];
            return (
              <Animated.View
                key={i}
                className="absolute w-[5px] h-[5px] rounded-full bg-white"
                style={{
                  opacity: val.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0, 1, 0],
                  }),
                  transform: [
                    {
                      translateX: val.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, dx],
                      }),
                    },
                    {
                      translateY: val.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, dy],
                      }),
                    },
                    {
                      scale: val.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.3],
                      }),
                    },
                  ],
                }}
              />
            );
          })}
        </Animated.View>

        <View className="flex-row">
          {letters.map((char, i) => (
            <Animated.Text
              key={`${char}-${i}`}
              className="text-[44px] font-extrabold text-white tracking-[1px]"
              style={{
                opacity: letterAnims[i],
                transform: [
                  { perspective: 400 },
                  {
                    rotateX: letterAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: ["70deg", "0deg"],
                    }),
                  },
                  {
                    translateY: letterAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [18, 0],
                    }),
                  },
                ],
              }}
            >
              {char}
            </Animated.Text>
          ))}
        </View>

        <Animated.Text
          className="mt-[10px] text-[13px] tracking-[2px] uppercase text-white/75"
          style={{
            opacity: taglineAnim,
            transform: [
              {
                translateY: taglineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          Organize · Learn · Achieve
        </Animated.Text>

        <View className="flex-row mt-[18px] gap-1.5">
          {dotAnims.map((anim, i) => (
            <Animated.View
              key={i}
              className="w-[5px] h-[5px] rounded-full bg-white"
              style={{ opacity: anim }}
            />
          ))}
        </View>

        <Animated.Text
          className="mt-[22px] text-[11px] tracking-[1.5px] uppercase text-white/40"
          style={{
            opacity: creditAnim,
            transform: [
              {
                translateY: creditAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                }),
              },
            ],
          }}
        >
          Made by NA
        </Animated.Text>
      </View>

      <Animated.View
        pointerEvents="none"
        className="absolute inset-0 bg-white"
        style={{ opacity: flashAnim }}
      />
    </Animated.View>
  );
}
