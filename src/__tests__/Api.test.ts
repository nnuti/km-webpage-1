import { conversationApi, fetchChatHistoryInit, historyList, historyRead, historyGenerate, historyUpdate, historyDelete, historyDeleteAll, historyClear, historyRename, historyEnsure, frontendSettings, historyMessageFeedback, frontenSecrets } from '../api/api';
import { ConversationRequest, ChatMessage, Conversation, CosmosDBHealth, UserInfo } from '../api/models';
import { chatHistorySampleData } from '../constants/chatHistory'
global.fetch = jest.fn();



describe('API Tests', () => {
    beforeEach(() => {
      (fetch as jest.Mock).mockClear();
    });
  
    it('should call conversationApi with correct URL and options', async () => {
      const mockResponse = new Response(JSON.stringify({}), { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
  
      const options: ConversationRequest = { messages: [],prompt_type: "" };
      const abortController = new AbortController();
      const abortSignal = abortController.signal;
  
      await conversationApi(options, abortSignal);
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/conversation`, expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: options.messages }),
        signal: abortSignal
      }));
    });
  
    // it('should call getUserInfo with correct URL', async () => {
    //   const mockResponse = new Response(JSON.stringify([]), { status: 200 });
    //   (fetch as jest.Mock).mockResolvedValue(mockResponse);
  
    //   await getUserInfo();
  
    //   expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/.auth/me`);
    // });
  
    it('should call fetchChatHistoryInit and return sample data', () => {
      const result = fetchChatHistoryInit();
      expect(result).toEqual(chatHistorySampleData);
    });
  
    it('should call historyList with correct URL and options', async () => {
      const mockResponse = new Response(JSON.stringify([]), { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
  
      await historyList(0,'');
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/history/list?offset=0&prompt_type=`, expect.objectContaining({
        method: 'GET'
      }));
    });
  
    it('should call historyRead with correct URL and options', async () => {
      const mockResponse = new Response(JSON.stringify({ messages: [] }), { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
  
      await historyRead('convId');
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/history/read`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ conversation_id: 'convId' }),
        headers: { 'Content-Type': 'application/json' }
      }));
    });
  
    // Add similar tests for other functions...
  });