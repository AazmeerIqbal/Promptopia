"use client";
import React, { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import Loader from "./Loader";

const PromptCardList = ({ data, handleTagClick }) => {
  // Assuming data is directly the array of posts
  return (
    <div className="mt-16 prompt_layout">
      {data.length > 0 ? (
        data.map((post) => (
          <PromptCard
            key={post.Id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch("/api/prompt");
        const data = await response.json();
        // Adjust according to the structure of your API response
        setPosts(data.recordset || data); // Ensure `data` is the array of posts
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPost();
  }, []);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return posts.filter(
      (item) =>
        regex.test(item.Tag) ||
        regex.test(item.username) ||
        regex.test(item.email)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    const value = e.target.value;
    setSearchText(value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList
        data={searchText ? searchedResults : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
