import syllabus from "@/data/syllabus.json";
import {
  getCompletedTopics,
  getSemesterProgress,
  getSubjectProgress,
} from "@/database/syllabusService";
import { useEffect, useState } from "react";

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const topics = await getCompletedTopics();
    setCompleted(topics);
  };

  const semester = getSemesterProgress(syllabus.subjects, completed);

  const subjects = syllabus.subjects.map((subject) => ({
    ...subject,
    progress: getSubjectProgress(subject, completed),
  }));

  return {
    semester,
    subjects,
    completed,
    refresh: loadProgress,
  };
}
