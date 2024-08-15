import { createSlice } from "@reduxjs/toolkit";
import { History } from "../../app-types/history.type";
import { RootState } from "../store";
import { getCurrentHistoryThunk } from "./history-thunk"

export type toggleState = {
  toggle: History | true;
};

const initialState: toggleState = {
  toggle: true,
};

export const historySlice = createSlice({
  name: "toggle",
  initialState: initialState,
  reducers: {},
  extraReducers(builder:any) {
    builder.addCase(getCurrentHistoryThunk.fulfilled, (state:any, action:any) => {
      state.toggle = action.payload;
    
    })
  },
});

export const selectHistoryState = (state: RootState) => state.historyState;

export default historySlice.reducer;
