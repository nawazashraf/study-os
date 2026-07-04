import { getAllAssignments } from "@/database/assignmentService";
import { Assignment } from "@/types/assignment";
import { useCallback, useEffect, useState } from "react";

export const useAssignment = () => {
  const [assignment, setAssignment] = useState<Assignment[]>([]);

  const fetchAssignment = useCallback(async () => {
    const data = await getAllAssignments();
    setAssignment(data);
  }, []);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  return {
    assignment,
    refreshAssignment: fetchAssignment,
  };
};
