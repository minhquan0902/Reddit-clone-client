import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Spinner, Heading, Box } from "@chakra-ui/react";
import React from "react";
import { EditDeletePostButton } from "../../components/EditDeletePostButton";

export const Post = ({}) => {
  const router = useRouter();

  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching, error }] = usePostQuery({
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

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find Post :( </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading>{data?.post.title}</Heading>
      <br />
      <Box mb={5}>{data?.post.text}</Box>
      <EditDeletePostButton
        id={data.post._id}
        creatorId={data.post.creatorId}
      />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
