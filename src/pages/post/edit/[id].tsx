import { Box, Button, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { Router, useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

export const EditPost = ({}) => {
  const router = useRouter();

  const [_, updatePost] = useUpdatePostMutation();

  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            justifyItems: "center",
            alignContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post for some reasons T_T </Box>
      </Layout>
    );
  }
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          //     console.log(values);
          //     const { error } = await createPost({
          //       text: values.text,
          //       title: values.title,
          //     });
          //     console.log(error);
          //     // push user back to login page if server throw an unauthenticated response
          //     if (error?.message.includes("Not authenticated")) {
          //       router.push("/login");
          //     } else {
          //     }
          //     router.push("/");

          await updatePost({ id: intId, ...values });
          router.back();
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
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
