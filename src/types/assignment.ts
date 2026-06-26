export interface CreateAssignment {
  title: string;
  subjectId: number;
  dueDate: string;
  priority: Priority;
  attachmentUri?: string | null;
  attachmentName?: string | null;
  attachmentMimeType?: string | null;
  completed?: boolean;
}

export interface AssignmentRow {
  id: number;
  title: string;
  subjectId: number;
  dueDate: string;
  priority: Priority;
  attachmentUri: string | null;
  attachmentName: string | null;
  attachmentMimeType: string | null;
  completed: number; // SQLite representation
  createdAt: string;
}
export interface Assignment extends CreateAssignment {
  id: number;
  completed?: boolean;
  createdAt: string;
}

export type Priority = "Low" | "Medium" | "High" | "";

export interface AttachedDoc {
  name: string;
  uri: string;
  size?: number;
  mimeType?: string;
}

export interface AssignmentForm {
  title: string;
  subjectId: number | null;
  dueDate: Date;
  priority: Priority;
  attachment: AttachedDoc | null;
}

export interface FormErrors {
  title?: string;
  subject?: string;
  priority?: string;
}
