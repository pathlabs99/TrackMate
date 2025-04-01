import React from 'react';
import Lottie from 'lottie-react';
import logAnimationData from './log.json';

const LogAnimation: React.FC = () => {
  return (
    <Lottie
      animationData={logAnimationData}
      loop={true}
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default LogAnimation;
