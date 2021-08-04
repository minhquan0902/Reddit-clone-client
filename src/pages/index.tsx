import React, { useState } from "react";

import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  useMeQuery,
  usePostsQuery,
  useVoteMutation,
} from "../generated/graphql";
import { Layout } from "../components/Layout";
import mappedUser from "../components/userDataComponent";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  Spinner,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { EditDeletePostButton } from "../components/EditDeletePostButton";

const Index = () => {
  const toast = useToast();
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");

  const router = useRouter();

  //vote Mutation
  const [__, vote] = useVoteMutation();

  const sortedUser = mappedUser().map((v) => {
    return {
      id: v.id,
      username: v.username,
    };
  });
  function findUsername(userId: number) {
    const findUser = sortedUser.find((v) => v.id == userId);
    const returnUsername = findUser?.username;

    return returnUsername;
  }

  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  console.log(variables);
  console.log("data", data);

  if (!fetching && !data) {
    return (
      <>
        <div>Query failed for some reasons... T_T </div>
        <div>
          <NextLink href="/login">
            <Link ml="auto" mt={2}>
              Click here to re-login
            </Link>
          </NextLink>
        </div>
      </>
    );
  }

  return (
    <>
      <Layout>
        <br />

        {!data && fetching ? (
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
        ) : (
          <Stack spacing={8}>
            {data.posts.posts.map((p) =>
              !p ? null : (
                <>
                  <Flex key={p._id} p={5} shadow="md" borderWidth="1px">
                    <Flex
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      mr={5}
                    >
                      <IconButton
                        aria-label="upvote post"
                        colorScheme={
                          p.voteStatus === 1 ? "whatsapp" : "blackAlpha"
                        }
                        size="md"
                        onClick={async () => {
                          if (p.voteStatus === 1) {
                            return;
                          }
                          setLoadingState("upvote-loading");
                          const response = await vote({
                            postId: p._id,
                            value: 1,
                          });
                          if (!response.error) {
                            toast({
                              title: "Vote submitted",
                              description: "Your vote has been submitted :>",
                              status: "success",
                              duration: 9000,
                              isClosable: true,
                            });
                          } else {
                            toast({
                              title: "Error!",
                              description:
                                "Error! You might not logged in or already voted on this post",
                              status: "error",
                              duration: 9000,
                              isClosable: true,
                            });
                          }
                          setLoadingState("not-loading");
                        }}
                        isLoading={loadingState === "upvote-loading"}
                        icon={<ChevronUpIcon />}
                        mb={2}
                      />

                      {p.points}

                      <IconButton
                        aria-label="downvote post"
                        colorScheme={p.voteStatus === -1 ? "red" : "blackAlpha"}
                        size="md"
                        onClick={async () => {
                          if (p.voteStatus === -1) {
                            return;
                          }
                          setLoadingState("downvote-loading");
                          const response = await vote({
                            postId: p._id,
                            value: -1,
                          });
                          if (!response.error) {
                            toast({
                              title: "Vote submitted",
                              description: "Your vote has been submitted :>",
                              status: "success",
                              duration: 9000,
                              isClosable: true,
                            });
                          } else {
                            toast({
                              title: "Error!",
                              description:
                                "Error! You might not logged in or already voted on this post",
                              status: "error",
                              duration: 9000,
                              isClosable: true,
                            });
                          }

                          setLoadingState("not-loading");
                        }}
                        isLoading={loadingState === "downvote-loading"}
                        icon={<ChevronDownIcon />}
                        mt={2}
                      />
                    </Flex>
                    <Box flex={1}>
                      <NextLink href="/post/[id]" as={`/post/${p._id}`}>
                        <Link>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </Link>
                      </NextLink>

                      <Text>Posted by {findUsername(p.creator._id)}</Text>
                      <Flex align="center">
                        <Text flex={1} mt={4}>
                          {p.textSnippet}...
                        </Text>

                        <Box ml="auto">
                          <EditDeletePostButton
                            id={p._id}
                            creatorId={p.creator._id}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                </>
              )
            )}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() =>
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                })
              }
              isLoading={fetching}
              m="auto"
              my={6}
            >
              load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </>
  );
};

//set Server-side rendering to this page to true
// Server side rendering allows webpage content to be searchable by Google => increase SEO
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
