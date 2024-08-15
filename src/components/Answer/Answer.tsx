import React,{ useMemo, useState, ClassAttributes, AnchorHTMLAttributes } from "react";
import { Stack } from "@fluentui/react";
// import DOMPurify from "dompurify";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Chip, Container, Grid, Typography, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from "./Answer.module.css";
import { parseAnswer } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";
import { useBoolean } from '@fluentui/react-hooks'
import ArticleIcon from '@mui/icons-material/Article';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Citation, AskResponse } from "../../api";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { AiFillDislike } from "react-icons/ai";
// import { SlDislike } from "react-icons/sl";
import { AiFillLike } from "react-icons/ai";
import { formatDuration } from "../../utills";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import supersub from 'remark-supersub'
import DOMPurify from "dompurify";
import { XSSAllowTags } from "../../constants/xssAllowTags";


const Dot = styled('div')(({ theme }) => ({
    width: 8,
    height: 8,
    margin: '0 4px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    animation: 'dot-flashing 1s infinite linear alternate',
    '&:nth-of-type(1)': {
        animationDelay: '0s',
    },
    '&:nth-of-type(2)': {
        animationDelay: '0.2s',
    },
    '&:nth-of-type(3)': {
        animationDelay: '0.4s',
    },
}));

const DotsContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
});

interface Props {
    answer: AskResponse
    onCitationClicked: (citedDocument: Citation) => void
    isSelected?: boolean;
    // onCitationClicked: (filePath: string) => void;
    onThoughtProcessClicked: () => void;
    onSupportingContentClicked: () => void;
    onFollowupQuestionClicked?: (question: string) => void;
    showFollowupQuestions?: boolean;
    statusShowCitations?: boolean;
    isLoadingStream?: boolean;
    handleMessageFeedback: (message_id: string, message_feedback: string) => void;
    type_prompt:string;
}

export const Answer = ({
    answer,
    isSelected,
    isLoadingStream,
    onCitationClicked,
    onThoughtProcessClicked,
    onSupportingContentClicked,
    onFollowupQuestionClicked,
    showFollowupQuestions,
    statusShowCitations,
    handleMessageFeedback,
    type_prompt
}: Props) => {

    const [isRefAccordionOpen, { toggle: toggleIsRefAccordionOpen }] = useBoolean(false)
    const parsedAnswer = useMemo(() => parseAnswer(answer), [answer])
    const [chevronIsExpanded, setChevronIsExpanded] = useState(isRefAccordionOpen)
    // const parsedAnswer = useMemo(() => parseAnswerToHtml(answer?.answer ?? '', onCitationClicked), [answer]);
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [showCitation, setShowCitation] = useState<boolean>(false);
    const filePathTruncationLimit = 50

    const handleChevronClick = () => {
        setChevronIsExpanded(!chevronIsExpanded)
        toggleIsRefAccordionOpen()
      }

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    // const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml);
    // var sanitizedAnswerHtml = parsedAnswer.answerHtml;
    const handleClick = () => {
        // console.log(showCitation);
        handleChevronClick();
        setShowCitation(!showCitation);
    };



    const createCitationFilepath = (citation: Citation, index: number, truncate: boolean = false) => {
        let citationFilename = ''

        if (citation.filepath) {
            const part_i = citation.part_index ?? (citation.chunk_id ? parseInt(citation.chunk_id) + 1 : '')
            if (truncate && citation.filepath.length > filePathTruncationLimit) {
                const citationLength = citation.filepath.length
                citationFilename = `${citation.filepath.substring(0, 20)}...${citation.filepath.substring(citationLength - 20)} - Part ${part_i}`
            } else {
                citationFilename = `${citation.filepath} - Part ${part_i}`
            }
        } else if (citation.filepath && citation.reindex_id) {
            citationFilename = `${citation.filepath} - Part ${citation.reindex_id}`
        } else {
            citationFilename = `Citation ${index}`
        }
        return citationFilename
    }

    const CodeComponent = {
        code({ node, ...props }: { node: any;[key: string]: any }) {
            let language
            if (props.className) {
                const match = props.className.match(/language-(\w+)/)
                language = match ? match[1] : undefined
            }
            const codeString = node.children[0].value ?? ''
            return (
                <SyntaxHighlighter style={nord} language={language} PreTag="div" {...props}>
                    {codeString}
                </SyntaxHighlighter>
            )
        }
    }

    const components = {
        // Override the default link component
        a: ({ node, ...props }: ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        // Correctly typed 'code' component
        CodeComponent,
        // Include other custom components if any
    };

    // console.log("answer:", answer);
    

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
                sx={{
                    width: '100%',
                    mt: 2,
                    '&.MuiPaper-root.MuiAccordion-root': {
                        borderRadius: '8px',
                        // border: '1px solid #ccc', // กำหนดสไตล์ของเส้นขอบ
                        boxShadow: 'none', // ลบเงาออก ถ้าต้องการ
                    }

                }}
                className={`${styles.customAccordion}`}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{
                        '&.MuiAccordionSummary-root': {
                            // padding: '0px',
                            minHeight: '36px',
                            margin: '0px',
                            '&.Mui-expanded': {
                                minHeight: '36px',
                                margin: '0px',
                            },
                        },
                        '& .MuiAccordionSummary-content.Mui-expanded': {

                            '&.Mui-expanded': {
                                margin: '15px 0px 0px 0px'
                            }
                        },
                        '&.MuiAccordionSummary-expandIcon': {
                            // padding: '0px',
                        },
                    }}


                >
                    <AnswerIcon />
                    <Typography sx={{ width: '80%', flexShrink: 0, ml: 1, mt: 0.5, fontSize: "14px", textAlign: "left" }}>
                        AI Generate <span style={{ fontSize: "10px", color: "#A1A1A1" }}>
                            {formatDuration(answer.createdAt)}
                        </span>
                    </Typography>


                </AccordionSummary>
                <AccordionDetails>
                    <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
                       
                        <Stack.Item grow className={styles.htmlContainer}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, supersub]}
                                children={
                                    // SANITIZE_ANSWER
                                    true
                                        ? DOMPurify.sanitize(parsedAnswer.markdownFormatText, { ALLOWED_TAGS: XSSAllowTags })
                                        : parsedAnswer.markdownFormatText
                                }
                                className={styles.answerText}
                                components={components}
                            />
                        </Stack.Item>

                        {
                            isLoadingStream && (
                                <>
                                    <DotsContainer>
                                        <Dot />
                                        <Dot />
                                        <Dot />
                                    </DotsContainer>
                                </>
                            )
                        }

                    </Stack>

                </AccordionDetails>
                <AccordionActions sx={{ borderTop: "1px solid #F2F2F2", mb: 0, pb: 0 }}>
                    <div style={{ width: '100%' }}>
                        <Box
                            sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1, mb: 0 }}
                        >
                            <Grid sx={{ flexGrow: 1, mb: 0 }}>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        pl: 2,
                                        mb: 0,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Grid sx={{ ml: "8px" }}><AiFillLike style={{
                                        fontSize: "18px",
                                        ...answer?.feedback == 'positive' ? { color: "#2d82c6", fontWeight: 900 } : { color: "#A1A1A1" },

                                        fontWeight: 400
                                    }}

                                        onClick={() => handleMessageFeedback(answer?.message_id ?? '', (answer?.feedback === "positive" ? "neutral" : "positive"))}
                                    /></Grid>
                                    <Grid sx={{ ml: "8px" }}><AiFillDislike style={{
                                        fontSize: "18px",
                                        ...(answer?.feedback?.includes('missing_citation') ||
                                            answer?.feedback?.includes('wrong_citation') ||
                                            answer?.feedback?.includes('out_of_scope') ||
                                            answer?.feedback?.includes('inaccurate_or_irrelevant') ||
                                            answer?.feedback?.includes('other_unhelpful')
                                        )
                                            ? { color: "#2d82c6", fontWeight: 900 } : { color: "#A1A1A1" },
                                        fontWeight: 400
                                    }}
                                        onClick={() => {
                                            if (answer.feedback?.includes('missing_citation') ||
                                                answer.feedback?.includes('wrong_citation') ||
                                                answer.feedback?.includes('out_of_scope') ||
                                                answer.feedback?.includes('inaccurate_or_irrelevant') ||
                                                answer.feedback?.includes('other_unhelpful')) {
                                                handleMessageFeedback(answer.message_id ?? '', "neutral")
                                            } else {
                                                handleMessageFeedback(answer.message_id ?? '', "missing_citation")
                                            }

                                        }}
                                    /></Grid>

                                </Box>


                            </Grid>
                            <Grid>
                                <Chip
                                    label={
                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                            {parsedAnswer?.citations?.length} references
                                            {
                                                showCitation ? <ExpandLessIcon sx={{ fontSize: '18px', color: '#A1A1A1', fontWeight: 400, marginLeft: '8px' }} /> :
                                                    <ExpandMoreIcon sx={{ fontSize: '18px', color: '#A1A1A1', fontWeight: 400, marginLeft: '8px' }} />
                                            }

                                        </span>
                                    }
                                    size="small"
                                    sx={{
                                        color: "#A1A1A1", fontWeight: 400, fontSize: "12px",
                                        borderRadius: "8px"
                                    }}

                                    onClick={handleClick}
                                // onDelete={handleDelete}
                                />
                            </Grid>
                            <Grid sx={{ ml: "8px" }}>
                                <ArticleIcon sx={{ fontSize: "18px", color: "#A1A1A1", fontWeight: 400, mt: 0.3 }} />
                            </Grid>
                        </Box>


                        <div style={{ width: '100%', paddingLeft: "30px", marginBottom: "10px" }}>


                        

                            {chevronIsExpanded && (
                                <div className={styles.citationWrapper}>
                                    {parsedAnswer.citations.map((citation:any, idx) => {
                                        return (
                                            <span
                                                title={createCitationFilepath(citation, ++idx)}
                                                tabIndex={0}
                                                role="link"
                                                key={idx}
                                                onClick={() => onCitationClicked(citation)}
                                                onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? onCitationClicked(citation) : null)}
                                                className={styles.citationContainer}
                                                aria-label={createCitationFilepath(citation, idx)}>
                                                <div className={styles.citation}>{idx}</div>
                                                {createCitationFilepath(citation, idx, true)}
                                            </span>
                                        )
                                    })}
                                </div>
                            )}
                            
                        </div>
                    </div>
                </AccordionActions>
            </Accordion>




        </>
    );
};
