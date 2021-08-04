import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link, toast } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButton: React.FC<EditDeletePostButtonProps> = ({
  id,
  creatorId,
}) => {
  //Me Query
  const [{ data: meData }] = useMeQuery();
  const [_, deletePost] = useDeletePostMutation();

  if (meData?.me?._id !== creatorId) {
    return null;
  }
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          ml="auto"
          aria-label="Edit Post"
          icon={<EditIcon />}
          size="md"
          colorScheme="blackAlpha"
        />
      </NextLink>
      <IconButton
        ml="auto"
        aria-label="Delete Post"
        icon={<DeleteIcon />}
        size="md"
        colorScheme="blackAlpha"
        onClick={() => {
          deletePost({
            id: id,
          });
        }}
      />
    </Box>
  );
};
