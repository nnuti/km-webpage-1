import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "./History/history-slice";

export const store = configureStore({
  reducer: {
    historyState: historyReducer,

  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

