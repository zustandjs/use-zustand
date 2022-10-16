/// <reference types="react/experimental" />

import React, { Suspense, experimental_use as use, useTransition } from 'react';

import createStore from 'zustand/vanilla';
import { useZustand } from 'use-zustand';

const postStore = createStore<{
  post: Promise<{ id: number; title: string; body: string }>;
  fetchPost: (id: number) => void;
}>((set) => ({
  post: fetch(`https://jsonplaceholder.typicode.com/posts/1`).then((res) =>
    res.json(),
  ),
  fetchPost: (id) => {
    set({
      post: fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
        (res) => res.json(),
      ),
    });
  },
}));

const Post = () => {
  const post = use(useZustand(postStore, (state) => state.post));
  return (
    <ul>
      <li>ID: {post.id}</li>
      <li>Title: {post.title}</li>
      <li>Body: {post.body}</li>
    </ul>
  );
};

const App = () => {
  const [isPending, startTransition] = useTransition();
  const fetchPostOrig = useZustand(postStore, (state) => state.fetchPost);
  const fetchPost = (id: number) => {
    startTransition(() => {
      fetchPostOrig(id);
    });
  };
  return (
    <div>
      <button type="button" onClick={() => fetchPost(1)}>
        Fetch post 1
      </button>
      <button type="button" onClick={() => fetchPost(2)}>
        Fetch post 2
      </button>
      <button type="button" onClick={() => fetchPost(3)}>
        Fetch post 3
      </button>
      <button type="button" onClick={() => fetchPost(4)}>
        Fetch post 4
      </button>
      {isPending && <div>Pending...</div>}
      <hr />
      <Suspense fallback="Loading...">
        <Post />
      </Suspense>
    </div>
  );
};

export default App;
