import css from "../NoteForm/NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

export interface OrderFormValues {
  title: string;
  content: string;
  tag: string;
}

interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (values: OrderFormValues) => void;
}
const initialValues: OrderFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel, onSubmit }: NoteFormProps) {
  const OrderFormSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Name must be at least 2 characters")
      .max(50, "Name is too long")
      .required("Name is required"),
    content: Yup.string()
      .max(500, "Content is too long")
      .required("Content is required"),
    tag: Yup.string()
      .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
      .required("Tag is required"),
  });

  const handleSubmit = (
    values: OrderFormValues,
    actions: FormikHelpers<OrderFormValues>
  ) => {
    onSubmit(values);
    actions.resetForm();
    onCancel();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" type="text" className={css.input} />
          <ErrorMessage name="title">
            {(msg) => <span className={css.error}>{msg}</span>}
          </ErrorMessage>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content">
            {(msg) => <span className={css.error}>{msg}</span>}
          </ErrorMessage>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag">
            {(msg) => <span className={css.error}>{msg}</span>}
          </ErrorMessage>
        </div>

        <div className={css.actions}>
          <button type="button" onClick={onCancel} className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
