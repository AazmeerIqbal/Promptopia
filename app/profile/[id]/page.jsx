"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();

  const [posts, setPosts] = useState([]); // Renamed to posts to avoid confusion
  console.log(id);

  useEffect(() => {
    const fetchPosts = async () => {
      if (id) {
        const response = await fetch(`/api/users/${id}/posts`);
        const data = await response.json();
        setPosts(data);
        console.log(data);
      }
    };

    fetchPosts();
  }, [id]);

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
      name="User"
      desc={`Welcome to ${posts[0]?.username} profile`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default UserProfile;
