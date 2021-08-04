import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";

import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const ForgotPassword: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [complete, setComplete] = useState(false);
  const [_, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <>
              <Box alignItems="center">
                If an account with that email exists, we will send you the
                verification email to change your password :^)
              </Box>
              <Button
                isLoading={isSubmitting}
                colorScheme="teal"
                mt={4}
                onClick={() => router.push("/")}
              >
                {" "}
                Back to home screen
              </Button>
            </>
          ) : (
            <Form>
              <Box mt={4}>
                <InputField
                  name="email"
                  placeholder="Enter your Email for password reset"
                  label="Email"
                />
              </Box>

              <Button
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
                mt={4}
              >
                Reset Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrqlClient)(ForgotPassword);
