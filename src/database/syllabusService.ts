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

const getSubjectTotals = (subject: Subject) => {
  const totalModules = subject.modules.length;
  const totalTopics = subject.modules.reduce(
    (count, module) => count + module.topics.length,
    0,
  );

  return { totalModules, totalTopics };
};

export const getModuleProgress = (module: Module, completed: Set<string>) => {
  const total = module.topics.length;

  const done = module.topics.filter((topic) => completed.has(topic.id)).length;

  return {
    done,
    total,
    percentage: total === 0 ? 0 : Math.floor((done / total) * 100),
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

  const subjectTotals = getSubjectTotals(subject);

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
    totalModules: subjectTotals.totalModules,
    totalTopics: subjectTotals.totalTopics,
    completedModules,
    completedTopics,
    percentage:
      subjectTotals.totalTopics === 0
        ? 0
        : Math.floor((completedTopics / subjectTotals.totalTopics) * 100),
    status:
      completedTopics === 0
        ? "not_started"
        : completedTopics === subjectTotals.totalTopics
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
    percentage:
      totalTopics === 0 ? 0 : Math.floor((completedTopics / totalTopics) * 100),
  };
};
