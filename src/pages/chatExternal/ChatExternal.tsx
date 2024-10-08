import React from "react";
import { useRef, useState, useEffect } from "react";
import { Stack, IconButton } from "@fluentui/react";
import { useAppDispatch, useAppSelector } from "../../redux-toolkit/hooks";
import styles from "./ChatExternal.module.css";
import uuid from 'react-uuid'
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { Container } from "@mui/material";
import Content from "../../components/Layouts/Content/Content";
import { getCurrentHistoryThunk } from "../../redux-toolkit/History/history-thunk";
import { selectHistoryState } from "../../redux-toolkit/History/history-slice";
import { ChatMessage, historyUpdate, historyRead, historyMessageFeedback, ToolMessageContent, Citation, ChatResponse, Conversation, ConversationRequest, historyGenerate, Feedback, AskResponse } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Spinner/LoadingSpinner";
import SnackbarSuccessComponent from "../../components/Snackbars/SnackbarSuccessComponent";
import { IData} from "../../app-types/chat.type";
import { ErrorCircleRegular } from "@fluentui/react-icons";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { XSSAllowTags } from "../../constants/xssAllowTags";

const TypeIconButton = IconButton as any;
const enum messageStatus {
    NotRunning = 'Not Running',
    Processing = 'Processing',
    Done = 'Done'
}

const ChatExternal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [openStatus, setOpenStatus] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([])

    //redux
    const dispatch = useAppDispatch();
    const { toggle } = useAppSelector(selectHistoryState);
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(false);

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingStream, setIsLoadingStream] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [activeCitation, setActiveCitation] = useState<Citation>()
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>();
    const [isCitationPanelOpen, setIsCitationPanelOpen] = useState<boolean>(false)
    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);
    const [processMessages, setProcessMessages] = useState<messageStatus>(messageStatus.NotRunning)
    const [statusShowCitation, setStatusShowCitation] = useState<boolean>(false);
    const [indexAnswer, setIndexAnswer] = useState<number>(0);
    const [dataKeep, setDataKeep] = useState<any>([])
    const [resultConversationId, setResultConversation] = useState<string>('')
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [ASSISTANT, TOOL, ERROR] = ['assistant', 'tool', 'error']
    const abortFuncs = useRef([] as AbortController[])


    const fetchData = async (question: string) => {
        try {


            let result = {} as ChatResponse
            let resultConversation: any;

            const abortController = new AbortController()
            abortFuncs.current.unshift(abortController)

            const userMessage: ChatMessage = {
                id: uuid(),
                role: 'user',
                content: question,
                date: new Date().toISOString()
            }

            let request: ConversationRequest
            let conversation
            if (!params.get('id')) {
                conversation = {
                    id: params.get('id') ?? uuid(),
                    title: question,
                    messages: [userMessage],
                    date: new Date().toISOString()
                }
                request = {
                    messages: [userMessage].filter(answer => answer.role !== ERROR),
                    prompt_type: "external"
                }
                setMessages(conversation.messages)
            } else {
                conversation = {
                    id: params.get('id') ?? uuid(),
                    title: question,
                    messages: [userMessage],
                    date: new Date().toISOString()
                }
                request = {
                    messages: [userMessage].filter(answer => answer.role !== ERROR),
                    prompt_type: "external"
                }
                setMessages([...messages, userMessage])
            }


            var dataResp: ChatMessage[] =[]
            var errorResponseMessage = 'Please try again. If the problem persists, please contact the site administrator.'

            const response = params.get('id')
                ? await historyGenerate(request, abortController.signal, params.get('id') || '')
                : await historyGenerate(request, abortController.signal)
            if (!response?.ok) {
                const responseJson = await response.json()
                errorResponseMessage =
                    responseJson.error === undefined ? errorResponseMessage : parseErrorMessage(responseJson.error)
                let errorChatMsg: ChatMessage = {
                    id: uuid(),
                    role: ERROR,
                    content: `There was an error generating a response. Chat history can't be saved at this time. ${errorResponseMessage}`,
                    date: new Date().toISOString()
                }
                let resultConversation
                if (params.get('id')) {
                    resultConversation = {
                        id: params.get('id') ?? uuid(),
                        title: question,
                        messages: [userMessage, errorChatMsg],
                        date: new Date().toISOString()
                    }
                    resultConversation.messages.push(errorChatMsg)
                } else {
                    setMessages([...messages, userMessage, errorChatMsg])
                    setIsLoading(false)
                    //   setShowLoadingMessage(false)
                    abortFuncs.current = abortFuncs.current.filter(a => a !== abortController)
                    return
                }
                setMessages([...resultConversation.messages])
                return
            }

           
            if (response?.body) {
                const reader = response.body.getReader()

                let runningText = ''
                while (true) {
                    setProcessMessages(messageStatus.Processing)
                    const { done, value } = await reader.read()
                    if (done) break

                    var text = new TextDecoder('utf-8').decode(value)
                    const objects = text.split('\n')
                    objects.forEach(obj => {
                        try {
                            if (obj !== '' && obj !== '{}') {
                                runningText += obj
                                result = JSON.parse(runningText)
                                if (result.choices?.length > 0) {
                                    result.choices[0].messages.forEach(msg => {
                                        msg.id = result.id
                                        msg.date = new Date().toISOString()
                                    })
                                    if (result.choices[0].messages?.some(m => m.role === ASSISTANT)) {
                                        // setShowLoadingMessage(false)
                                    }
                                    result.choices[0].messages.forEach(resultObj => {
                                        dataResp.push(resultObj)
                                        // processResultMessage(resultObj, userMessage, params.get('id') ?? undefined)
                                    })
                                } else if (result.error) {
                                    throw Error(result.error)
                                }

                                if (result?.history_metadata) {
                                    resultConversation = {
                                        id: result.history_metadata.conversation_id,
                                        title: result.history_metadata.title,
                                        date: result.history_metadata.date
                                        // Assuming 'content' is a required property of IData, you need to provide a value for it.
                                        // If 'content' is not applicable in this context, you might need to reconsider your data structure or make 'content' optional in IData.
                                        // content: "Some content or an appropriate value here"
                                    };


                                }

                                runningText = ''
                            }
                        } catch (e) {
                            if (!(e instanceof SyntaxError)) {
                                console.error(e)
                                throw e
                            } else {
                                // console.log('Incomplete message. Continuing...')
                            }
                        }
                    })
                }
                
                
                setMessages([...messages,userMessage, ...dataResp.map((msg) => {
                    if (msg.role === 'assistant') {
                        return {
                            id: msg.id,
                            role: msg.role,
                            content: msg.content,
                            date: msg.date
                        };
                    } else if (msg.role === 'tool') {
                        return {
                            id: uuid(), // Generate a new UUID for the id
                            role: msg.role,
                            content: msg.content,
                            date: msg.date
                        };
                    }
                    return undefined; // This line explicitly returns undefined for non-matching cases
                }).filter(msg => msg !== undefined) as ChatMessage[]]); // Filter out undefined and assert the correct type

                
            }



            const dataKeeps = [...dataKeep]
            dataKeeps.push(...messages)
            setDataKeep(dataKeeps)
            setIsLoadingStream(false)
            setIsLoading(false);
          //  console.log("resultConversation:", resultConversation);

            setResultConversation(resultConversation.id)

        } catch (error) {
            setIsLoadingStream(false);
            setIsLoading(false);
            setStatusShowCitation(false);
        }
    };


    const parseErrorMessage = (errorMessage: string) => {
        let errorCodeMessage = errorMessage.substring(0, errorMessage.indexOf('-') + 1)
        const innerErrorCue = "{\\'error\\': {\\'message\\': "
        if (errorMessage.includes(innerErrorCue)) {
            try {
                let innerErrorString = errorMessage.substring(errorMessage.indexOf(innerErrorCue))
                if (innerErrorString.endsWith("'}}")) {
                    innerErrorString = innerErrorString.substring(0, innerErrorString.length - 3)
                }
                innerErrorString = innerErrorString.replaceAll("\\'", "'")
                let newErrorMessage = errorCodeMessage + ' ' + innerErrorString
                errorMessage = newErrorMessage
            } catch (e) {
                console.error('Error parsing inner error message: ', e)
            }
        }

        return tryGetRaiPrettyError(errorMessage)
    }


    const tryGetRaiPrettyError = (errorMessage: string) => {
        try {
            // Using a regex to extract the JSON part that contains "innererror"
            const match = errorMessage.match(/'innererror': ({.*})\}\}/)
            if (match) {
                // Replacing single quotes with double quotes and converting Python-like booleans to JSON booleans
                const fixedJson = match[1]
                    .replace(/'/g, '"')
                    .replace(/\bTrue\b/g, 'true')
                    .replace(/\bFalse\b/g, 'false')
                const innerErrorJson = JSON.parse(fixedJson)
                let reason = ''
                // Check if jailbreak content filter is the reason of the error
                const jailbreak = innerErrorJson.content_filter_result.jailbreak
                if (jailbreak.filtered === true) {
                    reason = 'Jailbreak'
                }

                // Returning the prettified error message
                if (reason !== '') {
                    return (
                        'The prompt was filtered due to triggering Azure OpenAI’s content filtering system.\n' +
                        'Reason: This prompt contains content flagged as ' +
                        reason +
                        '\n\n' +
                        'Please modify your prompt and retry. Learn more: https://go.microsoft.com/fwlink/?linkid=2198766'
                    )
                }
            }
        } catch (e) {
            console.error('Failed to parse the error:', e)
        }
        return errorMessage
    }

    const parseCitationFromMessage = (message: ChatMessage) => {
        if (message?.role && message?.role === 'tool') {
          try {
            const toolMessage = JSON.parse(message.content) as ToolMessageContent
            return toolMessage.citations
          } catch {
            return []
          }
        }
        return []
      }



    const onShowCitation = (citation: Citation) => {
        if (citation.url && !citation.url.includes('blob.core')) {
            window.open(citation.url, '_blank')
        }

    }


    const handleRead = async (id: string) => {
        try {

            setIsLoadingPage(true)
            const readData: any = await historyRead(id)
            setMessages(readData)
            setIsLoadingPage(false)
            // console.log("ddd:", groupedData);

            // if(404 == 404) {
            //     const params = new URLSearchParams(location.search);
            //     params.delete('id');
            //     navigate({ search: params.toString() }, { replace: true });
            // }

            // scrollToBottom()
            const { current: container } = chatContainerRef;
            // console.log(current);


        } catch (error) {
            setIsLoadingPage(false)
            // console.log(error)
        }


    }



    useEffect(() => {
        if (resultConversationId) {
            saveToDB(messages, params.get('id') ? params.get('id') || "" : resultConversationId)
        }
    }, [dataKeep])

    useEffect(() => {
        if (params.get('id')) {
            handleRead(params.get('id') || "")
        };
        if (params.get('model') && params.get('model') == 'auto') {
            setMessages([])
            lastQuestionRef.current = "";
        }
    }, [params.get('id'), params.get('model')])

    useEffect(() => {
        setIsLoadingPage(true)
        if (!params.get('id')) {
            setTimeout(() => {
                setIsLoadingPage(false)
            }, 100)

        };

    }, [])

    // Create chat request from question before send to backend
    const makeApiRequest = async (question: string) => {
        // console.log("Question: ", question);

        lastQuestionRef.current = question;
        setIndexAnswer(answers.length);

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        try {

            const result = await fetchData(question);
            setStatusShowCitation(false);

        } catch (e) {
            // console.log("Error: ", e);

            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMessageFeedback = async (message_id: string, message_feedback: string) => {
        try {
            await historyMessageFeedback(message_id, message_feedback)
            const index = messages.findIndex((response) => response.id === message_id);
            if (index !== -1) {
                const updatedAnswersData = [...messages];
                message_feedback === 'positive' ?
                    updatedAnswersData[index].feedback = Feedback.Positive :
                    message_feedback === 'missing_citation' ?
                        updatedAnswersData[index].feedback = Feedback.MissingCitation :
                    updatedAnswersData[index].feedback = Feedback.Neutral;
                setMessages(updatedAnswersData);
                setOpenStatus(true)
            } else {
                // console.log(`Response with id ${message_id} not found.`);
            }
        } catch (error) {
            // console.log(error)
        }
    }

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);


    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    const saveToDB = async (messages: ChatMessage[], id: string) => {
        const response = await historyUpdate(messages, id)
        dispatch(getCurrentHistoryThunk(!toggle));


        params.delete('model');
        params.set('id', id);
        navigate({ search: params.toString() }, { replace: true });


        return response
    }

    const onViewSource = (citation: Citation) => {
        if (citation.url && !citation.url.includes('blob.core')) {
            window.open(citation.url, '_blank')
        }
    }

    return (
        <div data-testid="chat-external-component">
            {
                isLoadingPage ?
                    <LoadingSpinner height={80} />
                    :
                    <div  data-testid="chat-external-component" className={styles.container} style={{ ...messages.length > 0 ? { padding: "0px 60px 60px 60px" } : { padding: "60px" } }}>
                        <div className={styles.chatRoot}>
                            <div className={styles.chatContainer} style={{ ...messages.length > 0 ? { height: "80vh" } : { height: "73vh" } }}>
                                {!messages || messages.length <= 0 ? (
                                    // <div className={styles.chatEmptyState}>

                                    <Container maxWidth="lg" className={styles.chatContainer}>
                                        {/* <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}
                                        {/* div have dot two and border red 2 px */}
                                        <Content />
                                        <ExampleList onExampleClicked={onExampleClicked} />
                                    </Container>
                                ) : (
                                    // </div>
                                    <div className={styles.chatMessageStream}>
                                        {messages.map((answer, index) => (
                                            <div key={index}>
                                                {answer.role === 'user' ? (
                                                    <UserChatMessage index={index} message={lastQuestionRef.current} answer={answer} />
                                                ) : answer.role === 'assistant' ? (
                                                    <div key={index} className={styles.chatMessageGpt}>
                                                        <Answer
                                                            key={index}
                                                            answer={{
                                                                answer: answer.content,
                                                                citations: parseCitationFromMessage(messages[index - 1]),
                                                                message_id: answer.id,
                                                                createdAt: answer.date,
                                                                feedback: answer.feedback
                                                            }}
                                                            type_prompt='external'
                                                            isLoadingStream={answers.length - 1 == index ? isLoadingStream : false}
                                                            isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                                            onCitationClicked={c => onShowCitation(c)}
                                                            onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                                            onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                                            onFollowupQuestionClicked={q => makeApiRequest(q)}
                                                            showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                                            handleMessageFeedback={(message_id: string, message_feedback: string) => handleMessageFeedback(message_id, message_feedback)}
                                                        />
                                                    </div>
                                                ) : answer.role === 'error' ? (
                                                    <div key={index} className={styles.chatMessageError}>
                                                        <Stack horizontal className={styles.chatMessageErrorContent}>
                                                            <ErrorCircleRegular className={styles.errorIcon} style={{ color: 'rgba(182, 52, 67, 1)' }} />
                                                            <span>Error</span>
                                                        </Stack>
                                                        <span className={styles.chatMessageErrorContent}>{answer.content}</span>
                                                    </div>
                                                ) : null}

                                            </div>

                                        ))}
                                        {isLoading && (
                                            <>
                                                {/* <UserChatMessage index={messages.length - 1} message={lastQuestionRef.current} answer={messages[messages.length - 1 ]} /> */}
                                                <div className={styles.chatMessageGptMinWidth}>
                                                    <AnswerLoading />
                                                </div>
                                            </>
                                        )}

                                        {error ? (
                                            <>
                                                <UserChatMessage index={messages.length - 1} message={lastQuestionRef.current} answer={messages[messages.length - 1]} />
                                                <div className={styles.chatMessageGptMinWidth}>
                                                    <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                                </div>
                                            </>
                                        ) : null}
                                        <div ref={chatMessageStreamEnd} />
                                    </div>
                                )}

                                {/* <div className={styles.chatInput}> */}
                                <Container maxWidth="lg" className={styles.chatInput} style={{
                                    ...messages && messages.length > 0 ? { flex: "0 0 10px !important" } : { flex: "0 0 100px" }
                                }}>
                         
                                    <QuestionInput
                                        clearOnSend
                                        placeholder="Ask anything..."
                                        disabled={isLoadingStream}
                                        onSend={question => makeApiRequest(question)}
                                    />
                                </Container>
                                {/* </div> */}
                            </div>

                           

                            {/* Citation Panel */}
                            {messages && messages.length > 0 && isCitationPanelOpen && activeCitation && (
                                <Stack.Item className={styles.citationPanel} tabIndex={0} role="tabpanel" aria-label="Citations Panel">
                                    <Stack
                                        aria-label="Citations Panel Header Container"
                                        horizontal
                                        className={styles.citationPanelHeaderContainer}
                                        horizontalAlign="space-between"
                                        verticalAlign="center">
                                        <span aria-label="Citations" className={styles.citationPanelHeader}>
                                            Citations
                                        </span>
                                        <TypeIconButton
                                            iconProps={{ iconName: 'Cancel' }}
                                            aria-label="Close citations panel"
                                            onClick={() => setIsCitationPanelOpen(false)}
                                        />
                                    </Stack>
                                    <h5
                                        className={styles.citationPanelTitle}
                                        tabIndex={0}
                                        title={
                                            activeCitation.url && !activeCitation.url.includes('blob.core')
                                                ? activeCitation.url
                                                : activeCitation.title ?? ''
                                        }
                                        onClick={() => onViewSource(activeCitation)}>
                                        {activeCitation.title}
                                    </h5>
                                    <div tabIndex={0}>
                                        <ReactMarkdown
                                            //   linkTarget="_blank"
                                            className={styles.citationPanelContent}
                                            children={DOMPurify.sanitize(activeCitation.content, { ALLOWED_TAGS: XSSAllowTags })}
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw]}
                                        />
                                    </div>
                                </Stack.Item>
                            )}
                        </div>
                    </div>
            }

            <SnackbarSuccessComponent open={openStatus} setOpen={setOpenStatus} />
        </div>
    );
};

export default ChatExternal;

