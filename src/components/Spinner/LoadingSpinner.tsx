import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import pttLogo from '../../static/images/ptt-station-logo.svg';

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
 // height: '100vh', // หรือตามที่ต้องการ
  position: 'relative',
});

const Text = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#18d0e9', // สีฟ้า
  fontWeight: 'bold',
});

interface Props {
  height:number;
}


const LoadingSpinner = ({height}:Props) => {
  return (
    <Container style={{height: height + 'vh'}}>
      <CircularProgress size={100} thickness={2} sx={{color:"#2b82c536"}} />
      <Text>
        <img src={pttLogo} alt="logo" style={{ width: '50px' }} />
      </Text>
    </Container>
  );
};

export default LoadingSpinner;
