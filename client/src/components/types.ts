export interface FormProps<T> {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  formId: string
  formData: T
  handleInputChange: (key: keyof T, value: string | number | object) => void
}
