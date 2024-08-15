import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatComponent from "./Chat"; // เปลี่ยนเป็น path ที่ถูกต้องของไฟล์ Chat.tsx

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useRef: jest.fn(),
}));
interface ChatComponentProps {
  data: {};
}
describe("ChatComponent", () => {
  let useEffectMock: any;
  let useStateMock: any;
  let useRefMock: any;

  beforeEach(() => {
    useEffectMock = jest.spyOn(React, "useEffect");
    useStateMock = jest.spyOn(React, "useState");
    useRefMock = jest.spyOn(React, "useRef");

    useStateMock.mockImplementation((init: any) => [init, jest.fn()]);
    useRefMock.mockReturnValue({ current: { value: "lastQuestion" } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update answers when data changes", () => {
    const data = {
      /* mock data */
    };
    const answers: any[] = [];
    const setAnswers = jest.fn();

    useStateMock.mockImplementationOnce(() => [answers, setAnswers]);
    const ChatComponent: React.FC<ChatComponentProps> = ({ data }) => {
      // Component implementation
      return <div>{/* Render something with data */}</div>;
    };
    render(<ChatComponent data={data} />);

    // Mock useEffect
    useEffectMock.mockImplementationOnce((fn: any) => fn());

    // Add your assertions here
  });
});

const mockAnswers = [
  ["User message 1", "Answer 1"],
  ["User message 2", "Answer 2"],
];
const mockError = new Error("Test error");
const mockIsLoading = true;
const mockIsNotLoading = false;

// describe("Chat Component", () => {
//   // test('renders answers correctly', () => {
//   //   const data = { /* mock data */ };
//   //   render(<ChatComponent data={data}/>);

//   //   // Check if answers are rendered
//   //   mockAnswers.forEach(answer => {
//   //     expect(screen.getByText(answer[1])).toBeInTheDocument();
//   //   });
//   // });

//   // test('renders loading state correctly', () => {
//   //   const data = { /* mock data */ };
//   //   render(<ChatComponent data={data} />);

//   //   // Check if loading component is rendered
//   //   expect(screen.getByTestId('answer-loading')).toBeInTheDocument();
//   // });

//   test("renders error state correctly", () => {
//     const data = {
//       /* mock data */
//     };
//     // const ChatComponent: React.FC<ChatComponentProps> = ({ data }) => {
//     //   // Component implementation
//     //   return <div>{/* Render something with data */}</div>;
//     // };
//     render(<ChatComponent />);

//     // Check if error component is rendered
//     expect(
//       screen.getByText(
//         "ป้อนคำถามที่คุณอยากทราบ หรือ เลือกตัวอย่างคำถามด้านล่าง"
//       )
//     ).toBeInTheDocument();
//   });
// });
