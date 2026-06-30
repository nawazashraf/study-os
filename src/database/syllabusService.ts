import { Module, Subject } from "@/types/syllabus";
import { db } from "./db";

export const markTopicComplete = async (topic_id: string) => {
  try {
    await db.runAsync(
      `
        INSERT OR REPLACE INTO topic_progress
        (topic_id, completed, completed_at)
        VALUES (?, 1, ?)
        `,
      [topic_id, Date.now()],
    );
  } catch (error) {}
};

export const markTopicIncomplete = async (topic_id: string) => {
  try {
    await db.runAsync(
      `
        DELETE FROM topic_progress
        WHERE topic_id = ?
        `,
      [topic_id],
    );
  } catch (error) {
    console.log(error);
  }
};

export const getCompletedTopics = async () => {
  const rows = await db.getAllAsync<{ topic_id: string }>(
    "SELECT topic_id FROM topic_progress",
  );

  return new Set(rows.map((r) => r.topic_id));
};

export const getModuleProgress = (module: Module, completed: Set<string>) => {
  const total = module.topics.length;

  const done = module.topics.filter((topic) => completed.has(topic.id)).length;

  return {
    done,
    total,
    percentage: Math.floor((done / total) * 100),
    status:
      done === 0 ? "not_started" : done === total ? "completed" : "in_progress",
  };
};

export const getSubjectProgress = (
  subject: Subject,
  completed: Set<string>,
) => {
  let completedModules = 0;
  let completedTopics = 0;

  const modules = subject.modules.map((module) => {
    const progress = getModuleProgress(module, completed);

    completedTopics += progress.done;

    if (progress.status === "completed") completedModules++;

    return {
      ...module,
      progress,
    };
  });

  return {
    ...subject,
    modules,

    completedModules,
    completedTopics,

    percentage: Math.floor((completedTopics / subject.totalTopics) * 100),

    status:
      completedTopics === 0
        ? "not_started"
        : completedTopics === subject.totalTopics
          ? "completed"
          : "in_progress",
  };
};

export const getSemesterProgress = (
  subjects: Subject[],
  completed: Set<string>,
) => {
  let completedSubjects = 0;
  let completedTopics = 0;
  let totalTopics = 0;

  subjects.forEach((subject) => {
    const progress = getSubjectProgress(subject, completed);

    completedTopics += progress.completedTopics;
    totalTopics += progress.totalTopics;

    if (progress.status === "completed") {
      completedSubjects++;
    }
  });

  return {
    completedSubjects,
    totalSubjects: subjects.length,
    completedTopics,
    totalTopics,
    percentage: Math.floor((completedTopics / totalTopics) * 100),
  };
};
