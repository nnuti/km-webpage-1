// SupportingContent.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SupportingContent } from "./SupportingContent";
import { AskResponse } from "../../api";

describe("SupportingContent", () => {
  const mockSupportingContent: AskResponse = {

    // answer: string
    // citations: Citation[]
    // message_id?: string
    // thoughts: string | null;
    // data_points: string[];
    // error?: string;
    // feedback: string | null;
    // id:string;
    // createdAt: string | null;
    answer: "Sample answer",
    citations: [
      {
        part_index: 0,
        content: "a",
        id: "b",
        title: "",
        filepath: "Title 1",
        url: "",
        metadata: "",
        chunk_id: "",
        reindex_id: "",
      },
    ],
    message_id: "Sample message ID",
    thoughts: "Sample thoughts",
    data_points: [],
    error:"Sample error",
    feedback: "Sample feedback",
    id: "Sample ID",
    createdAt: "Sample date",
    // Add other properties as needed
  };

  it("should render without crashing", () => {
    render(<SupportingContent supportingContent={mockSupportingContent} />);
    const element = screen.getByTestId("supporting-content");
    expect(element).toBeInTheDocument();
  });
});
