import { Await, defer, useLoaderData } from "react-router-dom";
import { useAuthStore } from "@/main";
import { Suspense } from "react";
import axios from "axios";

import EnvVar from "@/shared/constants";
const { ApiOrigin } = EnvVar;

// dangerous because using localStorage info?
export const loaderFakebookFeed = async () => {
  return null;
};

const useFetchFeed = async () => {
  const token = useAuthStore((state) => state.authData.token);

  const res = await axios({
    method: "get",
    url: ApiOrigin + "/users", // TODO: /feed
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const {
    self,
    followers,
    followings,
    mayknows,
    friends,
    // posts
  } = res.data;

  // TODO: add friends
  // TODO: feed api

  return defer({
    ...res.data,
  });
};

const FakebookFeed = () => {
  const data = useFetchFeed();
  return (
    <Suspense fallback={<p>Loading package location...</p>}>
      <Await
        resolve={data}
        errorElement={<p>Error loading package location!</p>}
      >
        {(data) => (
          <>
            <h2 className="">khong dieu kien</h2>
            {/* <h2 className="">{data}</h2> */}
          </>
        )}
      </Await>
    </Suspense>
  );
};

export default FakebookFeed;
