// Bridges a Zod schema into Formik's `validate` contract, so forms keep
// using Zod (per project convention) instead of switching to Yup.
export function validateWithZod(schema) {
  return (values) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (path && !errors[path]) {
        errors[path] = issue.message;
      }
    }
    return errors;
  };
}
