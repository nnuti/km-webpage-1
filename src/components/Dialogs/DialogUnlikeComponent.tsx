import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    content: any;
    onClose: (value: string) => void;
}

function DialogUnlikeComponent(props: SimpleDialogProps) {
    const { onClose, selectedValue, open, content } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };


    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Submit Feedback

            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <div style={{ padding: "20px" }}>
                {content}
            </div>
        </Dialog>
    );
}

export default DialogUnlikeComponent;
