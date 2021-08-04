import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";

import { InputField } from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [_, createPost] = useCreatePostMutation();
  const [errorHandle, setErrorHandle] = useState(false);
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          console.log(values);
          const { error } = await createPost({
            text: values.text,
            title: values.title,
          });
          console.log(error);
          // push user back to login page if server throw an unauthenticated response
          if (error?.message.includes("Not authenticated")) {
            router.push("/login");
          } else {
          }
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Title"
              label="Title of the post"
            />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="Text..."
                label="Body"
              />
            </Box>

            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
              mt={4}
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
