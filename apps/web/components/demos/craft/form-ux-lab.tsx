"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { Demo } from "@/components/demos/demo";
import { DemoToggle } from "@/components/demos/demo-toggle";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const validate = (values: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Errors => {
  const errors: Errors = {};
  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/u.test(values.email)) {
    errors.email = "Enter a valid email like jane@example.com.";
  }
  if (!values.phone.trim()) {
    errors.phone = "Phone is required.";
  }
  if (!values.message.trim()) {
    errors.message = "Message can't be empty.";
  }
  return errors;
};

export const FormUxLab = () => {
  const [visibleLabels, setVisibleLabels] = useState(true);
  const [inlineErrors, setInlineErrors] = useState(true);
  const [autocompleteOn, setAutocompleteOn] = useState(true);
  const [inputmodeSet, setInputmodeSet] = useState(true);
  const [bigFont, setBigFont] = useState(true);

  const [values, setValues] = useState({
    email: "",
    message: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const formId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitted(true);
  };

  const setValue =
    (key: keyof typeof values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const fontStyle = { fontSize: bigFont ? "16px" : "14px" };
  const hasErrors = Object.keys(errors).length > 0;
  const topErrors =
    submitted && hasErrors && !inlineErrors ? Object.values(errors) : [];

  const fields: {
    name: keyof typeof values;
    label: string;
    type: string;
    placeholder: string;
    autocomplete: string;
    inputmode?: "text" | "email" | "tel" | "numeric";
  }[] = [
    {
      autocomplete: "name",
      label: "Full name",
      name: "name",
      placeholder: "Jane Doe",
      type: "text",
    },
    {
      autocomplete: "email",
      inputmode: "email",
      label: "Email",
      name: "email",
      placeholder: "jane@example.com",
      type: "email",
    },
    {
      autocomplete: "tel",
      inputmode: "tel",
      label: "Phone",
      name: "phone",
      placeholder: "+1 555 0123",
      type: "tel",
    },
  ];

  return (
    <Demo
      title="Form UX Lab"
      caption="Toggle each control to see how a single attribute changes the form."
    >
      <div className="flex w-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DemoToggle
            label="Labels"
            checked={visibleLabels}
            onChange={setVisibleLabels}
            labelA="Placeholder only"
            labelB="Visible labels"
          />
          <DemoToggle
            label="Errors"
            checked={inlineErrors}
            onChange={setInlineErrors}
            labelA="Top of form"
            labelB="Inline"
          />
          <DemoToggle
            label="autocomplete"
            checked={autocompleteOn}
            onChange={setAutocompleteOn}
            labelA="Off"
            labelB="On"
          />
          <DemoToggle
            label="inputmode"
            checked={inputmodeSet}
            onChange={setInputmodeSet}
            labelA="Default"
            labelB="Set"
          />
          <DemoToggle
            label="Input font size"
            checked={bigFont}
            onChange={setBigFont}
            labelA="14px"
            labelB="16px"
          />
        </div>

        <form
          id={formId}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 rounded-lg border border-border bg-background p-5"
        >
          {topErrors.length > 0 && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              <p className="mb-1 font-medium">Please fix the following:</p>
              <ul className="list-disc space-y-0.5 pl-4">
                {topErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {fields.map((field) => {
            const fieldId = `${formId}-${field.name}`;
            const errorId = `${fieldId}-error`;
            const error = errors[field.name];
            return (
              <div key={field.name} className="flex flex-col gap-1.5">
                {visibleLabels ? (
                  <label
                    htmlFor={fieldId}
                    className="text-xs font-medium text-foreground"
                  >
                    {field.label}
                  </label>
                ) : (
                  <label htmlFor={fieldId} className="sr-only">
                    {field.label}
                  </label>
                )}
                <input
                  id={fieldId}
                  name={field.name}
                  type={field.type}
                  value={values[field.name]}
                  onChange={setValue(field.name)}
                  placeholder={visibleLabels ? field.placeholder : field.label}
                  autoComplete={autocompleteOn ? field.autocomplete : "off"}
                  inputMode={
                    inputmodeSet && field.inputmode
                      ? field.inputmode
                      : undefined
                  }
                  aria-invalid={error ? "true" : undefined}
                  aria-describedby={error && inlineErrors ? errorId : undefined}
                  style={fontStyle}
                  className={cn(
                    "h-10 rounded-md border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    error
                      ? "border-red-400 dark:border-red-500"
                      : "border-border"
                  )}
                />
                {inlineErrors && error && (
                  <p
                    id={errorId}
                    className="text-xs text-red-700 dark:text-red-400"
                  >
                    {error}
                  </p>
                )}
              </div>
            );
          })}

          <div className="flex flex-col gap-1.5">
            {visibleLabels ? (
              <label
                htmlFor={`${formId}-message`}
                className="text-xs font-medium text-foreground"
              >
                Message
              </label>
            ) : (
              <label htmlFor={`${formId}-message`} className="sr-only">
                Message
              </label>
            )}
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={3}
              value={values.message}
              onChange={setValue("message")}
              placeholder={
                visibleLabels ? "Anything you'd like to add?" : "Message"
              }
              aria-invalid={errors.message ? "true" : undefined}
              aria-describedby={
                errors.message && inlineErrors
                  ? `${formId}-message-error`
                  : undefined
              }
              style={fontStyle}
              className={cn(
                "rounded-md border bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                errors.message
                  ? "border-red-400 dark:border-red-500"
                  : "border-border"
              )}
            />
            {inlineErrors && errors.message && (
              <p
                id={`${formId}-message-error`}
                className="text-xs text-red-700 dark:text-red-400"
              >
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              {inputmodeSet
                ? "On iOS, email and phone fields show the right keyboard."
                : "Without inputmode, mobile users get the default QWERTY keyboard."}
            </p>
            <button
              type="submit"
              className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Submit
            </button>
          </div>
        </form>

        {!bigFont && (
          <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
            Heads up: at 14px, iOS Safari will zoom the page when these inputs
            gain focus.
          </p>
        )}
      </div>
    </Demo>
  );
};
