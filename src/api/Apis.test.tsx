import { Feedback } from "@mui/icons-material";
import {
  conversationApi,
  getUserInfo,
  fetchChatHistoryInit,
  historyRead,
  frontendSettings,
  historyGenerate,
  historyUpdate,
  historyDelete,
  historyDeleteAll,
  historyClear,
  historyRename,
  historyEnsure,
  historyList,
  historyMessageFeedback
} from "./api";
import { ConversationRequest, UserInfo, ChatMessage,CosmosDBStatus } from "./models";


global.fetch = jest.fn();

describe("API functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("conversationApi", () => {
    it("should return response when fetch is successful", async () => {
      const mockResponse = new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const options: ConversationRequest = { messages: [], prompt_type: "" };
      const abortSignal = new AbortController().signal;

      const response = await conversationApi(options, abortSignal);

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.URL_BACKEND}/conversation`,
        expect.any(Object)
      );
    });

    it("should throw an error when fetch fails", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      const options: ConversationRequest = { messages: [], prompt_type: "" };
      const abortSignal = new AbortController().signal;

      await expect(conversationApi(options, abortSignal)).rejects.toThrow(
        "Network Error"
      );
    });
  });

  //   describe('getUserInfo', () => {
  //     it('should return user info when fetch is successful', async () => {
  //       const mockUserInfo: UserInfo[] = [{ id: '1', name: 'John Doe' }];
  //       const mockResponse = new Response(JSON.stringify(mockUserInfo), { status: 200 });
  //       (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

  //       const userInfo = await getUserInfo();

  //       expect(userInfo).toEqual(mockUserInfo);
  //       expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/.auth/me`);
  //     });

  //     it('should return empty array when fetch fails', async () => {
  //       const mockResponse = new Response(null, { status: 404 });
  //       (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

  //       const userInfo = await getUserInfo();

  //       expect(userInfo).toEqual([]);
  //       expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/.auth/me`);
  //     });
  //   });

  describe("fetchChatHistoryInit", () => {
    it("should return chat history sample data", () => {
      const chatHistory = fetchChatHistoryInit();

      expect(chatHistory).toEqual(expect.any(Array));
    });
  });
});

describe("historyRead", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return messages on successful fetch", async () => {
    const mockResponse = {
      messages: [
        {
          id: "1",
          role: "user",
          createdAt: "2023-01-01T00:00:00Z",
          content: "Hello",
          feedback: "positive",
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
      ok: true,
    });

    const result = await historyRead("123");
    expect(result).toEqual([
      {
        id: "1",
        role: "user",
        date: "2023-01-01T00:00:00Z",
        content: "Hello",
        feedback: "positive",
      },
    ]);
  });

  it("should return an empty array if no messages are present", async () => {
    const mockResponse = { messages: [] };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
      ok: true,
    });

    const result = await historyRead("123");
    expect(result).toEqual([]);
  });

  it("should return an empty array on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    const result = await historyRead("123");
    expect(result).toEqual([]);
  });
});

describe("frontendSettings", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return response on successful fetch", async () => {
    const mockResponse = { setting1: "value1", setting2: "value2" };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
      ok: true,
    });

    const result = await frontendSettings();
    expect(result).toEqual(mockResponse);
  });

  it("should return null on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    const result = await frontendSettings();
    expect(result).toBeNull();
  });
});

describe("getUserInfo", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return user info on successful fetch", async () => {
    const mockResponse = [
      {
        userId: "1",
        userName: "John Doe",
        email: "john.doe@example.com",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
      ok: true,
    });

    const result = await getUserInfo();
    expect(result).toEqual(mockResponse);
  });

  it("should return an empty array on fetch failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const result = await getUserInfo();
    expect(result).toEqual([]);
  });
});

describe("historyGenerate", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("should return response on successful fetch without convId", async () => {
    const mockResponse = { data: "mockData" };
    const options = {
      messages: [
        {
          id: "1",
          role: "user",
          content: "message1",
          timestamp: new Date().toISOString(),
          date: new Date().toISOString(),
        },
      ],
      prompt_type: "type1",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const abortController = new AbortController();
    const result = await historyGenerate(options, abortController.signal);

    // expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.URL_BACKEND}/history/generate`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
        signal: abortController.signal,
      })
    );
  });

  it("should return a new Response on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    const options = {
      messages: [
        {
          id: "1",
          role: "user",
          content: "message1",
          timestamp: new Date().toISOString(),
          date: new Date().toISOString(), // Add the date property
        },
      ], // Adjust this structure based on the actual ChatMessage type
      prompt_type: "type1",
    };
    const abortController = new AbortController();
    const result = await historyGenerate(options, abortController.signal);

    expect(result).toEqual(new Response());
  });
});

describe('historyUpdate', () => {
    const mockMessages: ChatMessage[] = [
        // id: string;
        // role: string;
        // content: string;
        // end_turn?: boolean;
        // date: string;
        // feedback?: Feedback;
        // context?: string;
      { id: '1',role:'',content:'',end_turn:true,date:'',context:'' },

    ];
    const mockConvId = '12345';
  
    beforeEach(() => {
      (fetch as jest.Mock).mockClear();
    });
  
    it('should return a successful response', async () => {
      const mockResponse = new Response(null, { status: 200 });
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
  
      const response = await historyUpdate(mockMessages, mockConvId);
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/history/update`, {
        method: 'POST',
        body: JSON.stringify({
          conversation_id: mockConvId,
          messages: mockMessages
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(response).toBe(mockResponse);
    });
  
    it('should handle fetch failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));
  
      const response = await historyUpdate(mockMessages, mockConvId);
  
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('historyDelete', () => {
    const mockConvId = '12345';
  
    beforeEach(() => {
      (fetch as jest.Mock).mockClear();
    });
  
    it('should return a successful response', async () => {
      const mockResponse = new Response(null, { status: 200 });
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
  
      const response = await historyDelete(mockConvId);
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/history/delete`, {
        method: 'DELETE',
        body: JSON.stringify({
          conversation_id: mockConvId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(response).toBe(mockResponse);
    });
  
    it('should handle fetch failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));
  
      const response = await historyDelete(mockConvId);
  
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('historyDeleteAll', () => {
    beforeEach(() => {
      (fetch as jest.Mock).mockClear();
    });
  
    it('should return a successful response', async () => {
      const mockResponse = new Response(null, { status: 200 });
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
  
      const response = await historyDeleteAll();
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/history/delete_all`, {
        method: 'DELETE',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(response).toBe(mockResponse);
    });
  
    it('should handle fetch failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));
  
      const response = await historyDeleteAll();
  
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('historyClear', () => {
    const mockConvId = '12345';
  
    beforeEach(() => {
      (fetch as jest.Mock).mockClear();
    });
  
    it('should return a successful response', async () => {
      const mockResponse = new Response(null, { status: 200 });
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
  
      const response = await historyClear(mockConvId);
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/history/clear`, {
        method: 'POST',
        body: JSON.stringify({
          conversation_id: mockConvId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(response).toBe(mockResponse);
    });
  
    it('should handle fetch failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));
  
      const response = await historyClear(mockConvId);
  
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('historyRename', () => {
    const mockConvId = '12345';
    const mockTitle = 'New Title';
  
    beforeEach(() => {
      (fetch as jest.Mock).mockClear();
    });
  
    it('should return a successful response', async () => {
      const mockResponse = new Response(null, { status: 200 });
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
  
      const response = await historyRename(mockConvId, mockTitle);
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/history/rename`, {
        method: 'POST',
        body: JSON.stringify({
          conversation_id: mockConvId,
          title: mockTitle
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(response).toBe(mockResponse);
    });
  
    it('should handle fetch failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));
  
      const response = await historyRename(mockConvId, mockTitle);
  
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('historyEnsure', () => {
    beforeEach(() => {
      (fetch as jest.Mock).mockClear();
    });
  
    it('should return a successful response with a message', async () => {
      const mockResponse = {
        message: 'Success'
      };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });
  
      const response = await historyEnsure();
  
      expect(fetch).toHaveBeenCalledWith(`${process.env.URL_BACKEND}/history/ensure`, {
        method: 'GET'
      });
      expect(response).toEqual({
        cosmosDB: true,
        status: CosmosDBStatus.Working
      });
    });
  
    it('should handle 500 status code', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({})
      });
  
      const response = await historyEnsure();
  
      expect(response).toEqual({
        cosmosDB: false,
        status: CosmosDBStatus.NotWorking
      });
    });
  
    it('should handle 401 status code', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({})
      });
  
      const response = await historyEnsure();
  
      expect(response).toEqual({
        cosmosDB: false,
        status: CosmosDBStatus.InvalidCredentials
      });
    });
  
    it('should handle 422 status code', async () => {
      const mockError = 'Unprocessable Entity';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({ error: mockError })
      });
  
      const response = await historyEnsure();
  
      expect(response).toEqual({
        cosmosDB: false,
        status: mockError
      });
    });
  
    it('should handle fetch failure', async () => {
      const mockError = new Error('Fetch failed');
      (fetch as jest.Mock).mockRejectedValueOnce(mockError);
  
      const response = await historyEnsure();
  
      expect(response).toEqual({
        cosmosDB: false,
        status: mockError
      });
    });
  });