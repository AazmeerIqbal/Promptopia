"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState([]); // Renamed to posts to avoid confusion

  useEffect(() => {
    const fetchPosts = async () => {
      if (session?.user?.id) {
        const response = await fetch(`/api/users/${session.user.id}/posts`);
        const data = await response.json();
        setPosts(data);
        console.log(data);
      }
    };

    fetchPosts();
  }, [session]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post.Id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      console.log(post.Id);
      try {
        await fetch(`/api/prompt/${post.Id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter((p) => p.Id !== post.Id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
