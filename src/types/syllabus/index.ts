import { getSubjectProgress } from "@/database/syllabusService";

export interface SemesterData {
  version: number;
  semester: number;
  program: string;
  year: string;
  generatedFor: string;
  offline: boolean;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  type: string;
  category: string;
  credits: number;
  studyHours?: number;
  weeklyHours: WeeklyHours;
  icon: string;
  color: string;
  prerequisites: string[];
  objectives: string;
  outcomes: Outcome[];
  totalModules: number;
  totalTopics: number;
  modules: Module[];
  books: string[];
  references: string[];
}

export interface WeeklyHours {
  L: number;
  T: number;
  P: number;
  total: number;
}

export interface Outcome {
  id: string;
  label: string;
  description: string;
}

export interface Module {
  id: string;
  number: number;
  roman: string;
  hours: number | null;
  title: string;
  topics: Topic[];
  resources: Resource[];
  notes: Note[];
  assignments: Assignment[];
  pyqs: Pyq[];
}

export interface Topic {
  id: string;
  title: string;
}

export interface Resource {
  id?: string;
  title?: string;
  type?: string;
  url?: string;
}

export interface Note {
  id?: string;
  title?: string;
  content?: string;
}

export interface Assignment {
  id?: string;
  title?: string;
  dueDate?: string;
}

export interface Pyq {
  id?: string;
  year?: number;
  question?: string;
}

export type SyllabusHeaderProps = {
  syllabusCoverage: number;
  subjectCompleted: number;
  totalSubject: number;
};

export type SubjectWithProgress = Subject & {
  progress: ReturnType<typeof getSubjectProgress>;
};
