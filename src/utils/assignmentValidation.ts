import { AssignmentForm, FormErrors } from "@/types/assignment";

export const validate = (form: AssignmentForm): FormErrors => {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = "Required";
  if (form.subjectId == null) errors.subject = "Required";
  if (!form.priority) errors.priority = "Required";
  return errors;
};
