export type ActivityCategory = "DSA" | "Development" | "Core Subject" | "Skill";

export interface Activity {
  id: number;
  category: ActivityCategory;
  title: string;
  duration: number;
  notes: string | null;
  activityDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityDto {
  category: ActivityCategory;
  title: string;
  duration: number;
  notes?: string;
  activityDate: string;
}

export interface UpdateActivityDto {
  category?: ActivityCategory;
  title?: string;
  duration?: number;
  notes?: string;
  activityDate?: string;
}
