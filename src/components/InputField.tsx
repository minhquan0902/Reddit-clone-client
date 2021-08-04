import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder?: string;
  name: string;
  type?: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  let InputOrTextarea: any = Input;
  if (props.textarea) {
    InputOrTextarea = Textarea;
  }
  const [field, { error }] = useField(props);
  return (
    //This "!!" over here is to cast error from type String to Boolean
    // "" => false
    // "error message" => true
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <InputOrTextarea
        {...field}
        id={field.name}
        placeholder={props.placeholder}
        type={props.type}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
