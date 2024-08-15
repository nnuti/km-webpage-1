import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import TextField from '@mui/material/TextField'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Prop {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    name: [string, string];
    setName: React.Dispatch<React.SetStateAction<[string, string]>>;
    handleUpdateHistoryName: () => void;
}

export default function DialogRenameComponent(props: Prop) {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xs');
  
    return (
        <React.Fragment>

            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                
                
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => props.setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Edit History Name?"}</DialogTitle>
                <DialogContent>
                    <TextField
                        size='small'
                        fullWidth
                        id="standard-basic"
                        data-testid="edit-history-name-input"
                        label=""
                        value={props.name[1]}
                        onChange={(e) => props.setName([props.name[0], e.target.value])}

                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        size='small'
                        sx={{ color: '#000', backgroundColor: '#e4e4e4',
                            '&:hover': {
                                backgroundColor: '#e4e4e4',
                            }
                         }}
                        onClick={() => props.setOpen(false)}>Cancel</Button>
                    <Button
                        size='small'
                        sx={{ color: 'white', backgroundColor: '#008cff',
                            '&:hover': {
                                backgroundColor: '#008cff',
                            }
                         }}
                        onClick={() => props.handleUpdateHistoryName()}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
