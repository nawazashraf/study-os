import { routine } from "@/data/routine";

export type RoutineListProps = {
  classes: (typeof routine)[keyof typeof routine];
};
