import React,{ useState } from "react";
import { Stack } from "@fluentui/react";
import { Send28Filled } from "@fluentui/react-icons";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import styles from "./QuestionInput.module.css";
import { TextField } from "@mui/material";



import { styled } from '@mui/material/styles';

const GradientPlaceholderTextField = styled(TextField)(({ theme }) => ({
//   '& .MuiInputBase-input::placeholder': {
//     background: 'linear-gradient(55deg, #4573CB 1%, #4573CB 99%)',
//     // WebkitBackgroundClip: 'text',
//     // WebkitTextFillColor: 'transparent',
//     //background: 'linear-gradient(to right, #4573CB 10%, #3DC7DB 30%)',
   
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent'
//   },
}));



interface Props {
    onSend: (question: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend }: Props) => {
    const [question, setQuestion] = useState<string>("");
  
    const sendQuestion = () => {
        
        if (disabled || !question.trim()) {
            return;
        }

        
        onSend(question);

        if (clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (e:any) => {
     
        
        if (!e.target.value) {
            setQuestion("");
        } else if (e.target.value.length <= 1000) {
           
            
            setQuestion(e.target.value);
        }
    };

    const sendQuestionDisabled = disabled || !question.trim();

    return (
        <Stack horizontal className={styles.questionInputContainer} style={{boxShadow: "0px 4px 8px rgb(0 0 0 / 6%)"}}>
    
            <GradientPlaceholderTextField
           
                className={`${styles.questionInputTextArea}`  }
                placeholder={placeholder}
                // multiline
            
                size="small"
                value={question}
                onChange={(e:any) => onQuestionChange(e)}
                onKeyDown={onEnterPress}
                disabled={disabled}
                variant="standard"
                InputProps={{
                       disableUnderline: true,
                     }}
                // inputProps={{
                //     style: {
                //         fontSize: '16px',
                //         color: 'red',
                //     },
                // }}
                sx={{
                    '& .MuiInputBase-root': {
                        border: 0,
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: '#88bfca',
                        border: 0,
                        opacity: 1, // otherwise firefox shows a lighter color
                        fontSize: '12px',
                    },
                   mt:0.5,
                }}
                style={{border:0}}
               
            />
            <div 
            className={styles.questionInputButtonsContainer}
            >
                <div
                    className={`${styles.questionInputSendButton} ${sendQuestionDisabled ? styles.questionInputSendButtonDisabled : ""}`}
                    aria-label="Ask question button"
                    onClick={sendQuestion}
                >
                    {disabled ? 
                    //  icon paylaod
                    <div className={styles.playbutton}></div>
                    : 
                    <ArrowUpwardIcon sx={{fontSize:"18px" ,backgroundColor:"#e5e5e5",borderRadius:"50%"}} />
                    } 
                </div>
            </div>
        </Stack>
    );
};
