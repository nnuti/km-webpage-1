import { createAsyncThunk } from "@reduxjs/toolkit";



export const getCurrentHistoryThunk = createAsyncThunk(
    "history/getCurrentHistoryThunk",
     async (data: any) => {
      try {
        // console.log("uerId:",data);
        
          // const account = await getCurrentAccount(userId);  
          return data;

      } catch (error: any) {
        throw error;
      }  
    }
);

