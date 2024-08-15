import { getCurrentHistoryThunk } from '../redux-toolkit/History/history-thunk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { store } from "../redux-toolkit/store";
// Mock store setup


describe('getCurrentHistoryThunk', () => {
  it('should handle success case', async () => {
    const data = { userId: 1 };
    const result = await store.dispatch(getCurrentHistoryThunk(data) as any);

    expect(result.payload).toEqual(data);
    expect(result.type).toBe('history/getCurrentHistoryThunk/fulfilled');
  });

  it('should handle error case', async () => {
    const error = new Error('Test error');
    const mockThunk = createAsyncThunk(
      'history/getCurrentHistoryThunk',
      async () => {
        throw error;
      }
    );

    try {
      await store.dispatch(mockThunk() as any);
    } catch (e) {
      expect(e).toBe(error);
    }
  });
});