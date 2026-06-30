import QuoteCard from "@/components/home/QuoteCard";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Text, View } from "react-native";

type HeroCardProps = {
  studyDuration: number;
  activitiesCount: number;
  streak: number;
};

const COLORS = {
  primary: "#60A5FA",
  success: "#22C55E",
  streak: "#F59E0B",
  streakInactive: "#6B7280",
} as const;

const formatDuration = (totalMinutes: number) => {
  const safeMinutes = Math.max(0, Math.round(totalMinutes || 0));
  if (safeMinutes < 60) return `${safeMinutes}m`;

  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

type StatProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  color: string;
};

const Stat = memo(({ icon, value, label, color }: StatProps) => (
  <View
    className="flex-1 items-center rounded-2xl bg-surface px-2 py-3.5"
    accessible
    accessibilityRole="text"
    accessibilityLabel={`${label}: ${value}`}
  >
    <Ionicons name={icon} size={16} color={color} />

    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
      className="mt-2 text-xl font-bold text-text"
    >
      {value}
    </Text>

    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      className="mt-0.5 text-center text-[11px] text-text-secondary"
    >
      {label}
    </Text>
  </View>
));
Stat.displayName = "Stat";

export default function HeroCard({
  studyDuration,
  activitiesCount,
  streak,
}: HeroCardProps) {
  const averageDuration =
    activitiesCount === 0
      ? "0m"
      : formatDuration(studyDuration / activitiesCount);

  const sessionLabel = pluralize(activitiesCount, "Session");
  const isStreakActive = streak > 0;

  return (
    <View className="mb-6 rounded-3xl border border-white/10 bg-card p-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-text-secondary">
            Daily Overview
          </Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
            className="mt-3 text-5xl font-black text-primary"
            accessibilityLabel={`Total study time: ${formatDuration(studyDuration)}`}
          >
            {formatDuration(studyDuration)}
          </Text>

          <Text className="mt-1 text-sm text-text-secondary">
            Total study time
          </Text>
        </View>

        <View className="flex-row items-center rounded-2xl border border-primary/25 bg-primary/10 px-3 py-2">
          <Ionicons name="school-outline" size={16} color={COLORS.primary} />
          <Text
            numberOfLines={1}
            className="ml-2 text-sm font-semibold text-primary"
          >
            {activitiesCount} {sessionLabel}
          </Text>
        </View>
      </View>

      <View className="my-5 h-px bg-white/10" />

      <View className="mb-5 rounded-2xl bg-background/60 px-2 py-3">
        <QuoteCard />
      </View>

      <View className="flex-row gap-3">
        <Stat
          icon="albums-outline"
          value={activitiesCount.toString()}
          label="Activities"
          color={COLORS.primary}
        />

        <Stat
          icon="time-outline"
          value={averageDuration}
          label="Avg"
          color={COLORS.success}
        />

        <Stat
          icon="flame-outline"
          value={`${streak}`}
          label={pluralize(streak, "Day", "Days")}
          color={isStreakActive ? COLORS.streak : COLORS.streakInactive}
        />
      </View>
    </View>
  );
}
