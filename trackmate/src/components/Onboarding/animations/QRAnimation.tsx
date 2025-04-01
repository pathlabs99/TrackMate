import React from 'react';
import Lottie from 'lottie-react';
import qrAnimationData from './qr.json';

const QRAnimation: React.FC = () => {
  return (
    <Lottie
      animationData={qrAnimationData}
      loop={true}
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default QRAnimation;
