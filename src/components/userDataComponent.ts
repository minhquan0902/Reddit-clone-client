import { useListUserQuery } from "../generated/graphql";

export default function mappedUser() {
  const [{ data }] = useListUserQuery();
  const mappedUser = data?.listUser?.map((v) => {
    return {
      id: v._id,
      username: v.username,
    };
  });

  return mappedUser;
}
