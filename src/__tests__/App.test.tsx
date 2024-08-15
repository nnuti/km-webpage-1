import React from "react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import Chat from "../pages/chat/Chat";
import LayoutLatest from "../pages/layout/LayoutLatest";
import { store } from "../redux-toolkit/store";
import App from "../index";
import LoadingSpinner from "../components/Spinner/LoadingSpinner";
import ErrorPage from "../pages/errorPage/ErrorPage";
import { QuestionInput } from "../components/QuestionInput";
import { SettingsButton } from "../components/SettingsButton";
import { AnswerError } from "../components/Answer/AnswerError";
import { UserChatMessage } from "../components/UserChatMessage";
import Sidebar from "../components/Layouts/Sidebar/Sidebar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ChatExternal from "../pages/chatExternal/ChatExternal";
import { AnalysisPanel } from "../components/AnalysisPanel";
import { Answer } from "../components/Answer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AskResponse } from "../api/modelsbackup";
import { AnalysisPanelTabs } from "../components/AnalysisPanel";
import styles from "../pages/chat/Chat.module.css";
// import ChatHistoryList from "../components/ChatHistory/ChatHistoryList";
// import { groupByMonth } from "../components/ChatHistory/ChatHistoryList";
import Header from "../components/Layouts/Header/Header";
import DialogRenameComponent from "../components/Dialogs/DialogRenameComponent";
import SnackbarSuccessComponent from "../components/Snackbars/SnackbarSuccessComponent";
import HeaderMobile from "../components/Layouts/HeaderMobile/HeaderMobile";
import { parseSupportingContentItem } from "../components/SupportingContent/SupportingContentParser";
// import { appStateReducer } from "../state/AppReducer";
// import { AppState, Action } from "../state/AppProvider";
import { ChatHistoryLoadingState, CosmosDBStatus, ChatMessage } from "../api";

describe("Route Testing", () => {
 it("should navigate to '/' when Internal Data button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<LayoutLatest />} />
            <Route path="/external" element={<div>External Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const internalDataButton = screen.getByText(/Internal Data/i);
    fireEvent.click(internalDataButton);

    expect(screen.getByText(/New Chat/i)).toBeInTheDocument();
  });

  it("should navigate to '/external' when External Data button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<LayoutLatest />} />
            <Route path="/external" element={<div>External Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const externalDataButton = screen.getByText(/External Data/i);
    fireEvent.click(externalDataButton);

    expect(screen.getByText(/External Page/i)).toBeInTheDocument();
  });

  it("should navigate to 404 page when route is incorrect", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/non-existent-route"]}>
          <Routes>
            <Route path="/" element={<LayoutLatest />} />
            <Route path="*" element={<ErrorPage />} />{" "}
            {/* Catch-all route for 404 */}
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});

// describe("ChatExternal Component", () => {
//   test("Renders ChatExternal component : Renders Correctly", () => {
//     render(
//       <Provider store={store}>
//         <MemoryRouter>
//           <ChatExternal />
//         </MemoryRouter>
//       </Provider>
//     );

//     // ตรวจสอบว่าองค์ประกอบที่มี data-testid="chat-external-component" ถูกเรนเดอร์
//     const chatExternalElement = screen.getByTestId("chat-external-component");
//     expect(chatExternalElement).toBeInTheDocument();
//   });
// });
describe("Sidebar Component", () => {
  test("Sidebar component : Renders Correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LayoutLatest />
        </MemoryRouter>
      </Provider>
    );

    const questionInput = screen.getByText(/New Chat/i);
    expect(questionInput).toBeInTheDocument();
  });
  test("displays the correct message when New Chat button in Sidebar is clicked", () => {
    const theme = createTheme();
    const handleToggle = jest.fn();
    render(
      <MemoryRouter>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <LayoutLatest />
            <Chat />
          </ThemeProvider>
        </Provider>
      </MemoryRouter>
    );

    // Simulate clicking the "New Chat" button
    fireEvent.click(screen.getByText("New Chat"));
    expect(screen.getByText("New Chat")).toBeInTheDocument();
    // const chatComponent = screen.getByTestId("chat-component");
    // // Check if the message is displayed
    // // expect(chatComponent).toBeInTheDocument(); // ตรวจสอบว่า component ถูก render
    // expect(chatComponent).toHaveTextContent(
    //   "ป้อนคำถามที่คุณอยากทราบ หรือ เลือกตัวอย่างคำถามด้านล่าง"
    // );
  });

  test("should reduce the size of the sidebar when the button is clicked", () => {
    const handleToggle = jest.fn();

    const { container, rerender } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar
            isSmallScreen={false}
            open={true}
            handleToggle={handleToggle}
          />
        </MemoryRouter>
      </Provider>
    );

    // ตรวจสอบขนาดเริ่มต้นของ sidebar
    const sidebar = container.querySelector(".css-p8nwui"); // ปรับ selector ให้ตรงกับ class ของ sidebar
    expect(sidebar).not.toBeNull(); // ตรวจสอบว่า sidebar ถูก render ขึ้นมา

    // กดปุ่ม
    const button = screen.getByTestId("arrow-btn");
    fireEvent.click(button);

    // ตรวจสอบว่า handleToggle ถูกเรียก
    expect(handleToggle).toHaveBeenCalled();

    // Rerender component โดยเปลี่ยนค่า open เป็น false
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar
            isSmallScreen={false}
            open={false}
            handleToggle={handleToggle}
          />
        </MemoryRouter>
      </Provider>
    );

    // ตรวจสอบว่าขนาดของ sidebar ลดลง
    expect(sidebar).not.toHaveClass("open"); // สมมติว่าถ้า sidebar ปิดจะไม่มี class 'open'
  });
});

describe("LoadingSpinner Component", () => {
  test("LoadingSpinner Component : Renders Correctly", () => {
    render(<LoadingSpinner height={100} />);

    // Check if CircularProgress is rendered
    const circularProgress = screen.getByRole("progressbar");
    expect(circularProgress).toBeInTheDocument();

    // Check if Text is rendered correctly
  });
});


describe("UserChatMessage Component", () => {
  test("UserChatMessage component : Renders Correctly", () => {
    const mockChatMessage: ChatMessage = {
      id: "1", // Add a valid id
      role: "user", // Add a valid role
      content: "This is an answer",
      date: new Date().toISOString(), // or any valid date string
      // Add other properties if required by ChatMessage type
    };

    const props = {
      message: "Hello, this is a test message",
      index: 0,
      answer: mockChatMessage
    };

  render(<UserChatMessage {...props} />);
    expect(screen.getByText('This is an answer')).toBeInTheDocument();
    // expect(screen.getByText("10:30m")).toBeInTheDocument();
  });
  test("displays the correct message", () => {
    const testMessage = "Hello, this is a test message";
    const mockChatMessage: ChatMessage = {
      id: "1", // Add a valid id
      role: "user", // Add a valid role
      content: "This is an answer",
      date: new Date().toISOString(), // or any valid date string
      // Add other properties if required by ChatMessage type
    };

    const props = {
      message: testMessage,
      index: 0,
      answer: mockChatMessage
    };

    render(<UserChatMessage {...props} />);
    expect(screen.getByText('This is an answer')).toBeInTheDocument();
  });
});

describe("QuestionInput Component", () => {
  test("QuestionInput component : Renders Correctly", () => {
    const mockOnSend = jest.fn();
    render(
      <QuestionInput
        onSend={mockOnSend}
        disabled={false}
        placeholder="Ask a question"
        clearOnSend={true}
      />
    );

    const inputElement = screen.getByPlaceholderText(/Ask a question/i);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).not.toBeDisabled();
  });
});

describe("QuestionInput Component", () => {
  const mockOnSend = jest.fn();

  it("should call onSend with the correct question and clear input when clearOnSend is true", () => {
    render(
      <QuestionInput
        onSend={mockOnSend}
        disabled={false}
        placeholder="Ask a question"
        clearOnSend={true}
      />
    );

    const inputElement = screen.getByPlaceholderText(/Ask a question/i);
    fireEvent.change(inputElement, { target: { value: "What is AI?" } });
    fireEvent.keyDown(inputElement, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    expect(mockOnSend).toHaveBeenCalledWith("What is AI?");
    expect(inputElement).toHaveValue("");
  });
});

describe("Answer Component", () => {
  const mockAnswer: AskResponse = {
    // Populate this object with the necessary properties of AskResponse
    // id: "1",
    // text: "This is a test answer",
    answer: "test answer",
    thoughts: null,
    data_points: [],
    error: "",
    feedback: "",
    id: "1",
    createdAt: "",
    citations: [],
    // Add other properties as required by the AskResponse type
  };

  const mockProps = {
    answer: mockAnswer,
    isSelected: false,
    isLoadingStream: false,
    onCitationClicked: jest.fn(),
    onThoughtProcessClicked: jest.fn(),
    onSupportingContentClicked: jest.fn(),
    onFollowupQuestionClicked: jest.fn(),
    showFollowupQuestions: false,
    statusShowCitations: false,
    handleMessageFeedback: jest.fn(),
    type_prompt:"yourTypePromptValue"
  };

  test("renders the Accordion with correct styles", () => {
    render(<Answer {...mockProps} />);

    const accordion = screen.getByText("AI Generate");
    expect(accordion).toBeInTheDocument();
  });
});

describe("AnswerError Component", () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  test("AnswerError component : Renders Correctly", () => {
    render(<AnswerError error="An error occurred" onRetry={mockOnRetry} />);
    expect(
      screen.getByText("เราพบข้อผิดพลาดบางอย่าง ช่วยกด Retry เพื่อลองอีกครั้ง")
    ).toBeInTheDocument();
  });

  test("displays the correct error message", () => {
    const errorMessage =
      "เราพบข้อผิดพลาดบางอย่าง ช่วยกด Retry เพื่อลองอีกครั้ง";
    render(<AnswerError error={errorMessage} onRetry={mockOnRetry} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("calls onRetry when retry button is clicked", () => {
    render(<AnswerError error="An error occurred" onRetry={mockOnRetry} />);
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});

// describe("AnalysisPanel", () => {
//   const mockOnActiveTabChanged = jest.fn();

//   const defaultProps = {
//     className: "test-class",
//     activeTab: AnalysisPanelTabs.ThoughtProcessTab,
//     onActiveTabChanged: mockOnActiveTabChanged,
//     activeCitation: undefined,
//     citationHeight: "100px",
//     answer: {
//       thoughts: null,
//       data_points: [],
//       answer: "Sample answer",
//       citations: [
//         { 
//           id: "2", 
//           text: "citation 2",
//           content: "Sample content 2",
//           title: "Sample title 2",
//           filepath: "/path/to/file2",
//           url: "http://example.com/2",
//           metadata: "Sample metadata 2",
//           chunk_id: "chunk2",
//           reindex_id: "reindex2"
//         }
//       ],
//       createdAt: "2023-01-01T00:00:00Z",

//     },
//   };
//   it("renders correctly", () => {
//     render(
//         <AnalysisPanel
//         className={styles.chatAnalysisPanel}
//         activeCitation={undefined}
//         onActiveTabChanged={() => {}}
//         citationHeight="810px"
//         answer={defaultProps.answer}
//         activeTab={AnalysisPanelTabs.ThoughtProcessTab}
//       />
//     );
//     expect(screen.getByText("Supporting content")).toBeInTheDocument();
//   });
// });

describe("Header Component", () => {
  it("should render correctly", () => {
    const { getByText } = render(
      <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
      </Provider>
    );

    expect(getByText("External Data")).toBeInTheDocument();
    expect(getByText("Internal Data")).toBeInTheDocument();
  });
});

describe("DialogRenameComponent", () => {
  const defaultProps = {
    open: true,
    setOpen: jest.fn(),
    name: ["", ""],
    setName: jest.fn(),
    handleUpdateHistoryName: jest.fn(),
  };

  it("should render correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <DialogRenameComponent
        setName={defaultProps.setName}
        open={true}
        setOpen={defaultProps.setOpen}
        name={["", ""]}
        handleUpdateHistoryName={defaultProps.handleUpdateHistoryName}
      />
    );

    // ตรวจสอบว่ามีข้อความ "Rename" ใน component
    expect(getByText("Edit History Name?")).toBeInTheDocument();

    // ตรวจสอบว่ามี input field ที่มี placeholder "Enter new name"
    expect(screen.getByTestId("edit-history-name-input")).toBeInTheDocument();
  });
});

describe("SnackbarSuccessComponent", () => {
  test("renders SnackbarSuccessComponent with message", () => {
    render(<SnackbarSuccessComponent message="Success!" open={true} />);
    expect(screen.getByText("This is a Update success!")).toBeInTheDocument();
  });
});

// describe("ChatExternal Component", () => {
//   it('should render chat container with data-testid="chat-external-component"', () => {
//     render(
//       <Provider store={store}>
//         <Router>
//           <ChatExternal />
//         </Router>
//       </Provider>
//     );

//     expect(screen.getByTestId("chat-external-component")).toBeInTheDocument();
//   });
// });

describe("HeaderMobile", () => {
  const mockHandleToggle = jest.fn();

  it("should render the header", () => {
    render(<HeaderMobile handleToggle={mockHandleToggle} />);
    const headerElement = screen.getByText("PTT Abdul");
    expect(headerElement).toBeInTheDocument();
  });
});

describe("parseSupportingContentItem", () => {
  it("should parse the title and content correctly", () => {
    const input = "sdp_corporate.pdf: this is the content that follows";
    const expectedOutput = {
      title: "sdp_corporate.pdf",
      content: "this is the content that follows",
    };

    const result = parseSupportingContentItem(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle empty content correctly", () => {
    const input = "sdp_corporate.pdf: ";
    const expectedOutput = {
      title: "sdp_corporate.pdf",
      content: "",
    };

    const result = parseSupportingContentItem(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle missing colon correctly", () => {
    const input = "sdp_corporate.pdf";
    const expectedOutput = {
      title: "sdp_corporate.pdf",
      content: "",
    };

    const result = parseSupportingContentItem(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle multiple colons correctly", () => {
    const input =
      "sdp_corporate.pdf: this is the content: with multiple colons";
    const expectedOutput = {
      title: "sdp_corporate.pdf",
      content: "this is the content: with multiple colons",
    };

    const result = parseSupportingContentItem(input);
    expect(result).toEqual(expectedOutput);
  });
});
