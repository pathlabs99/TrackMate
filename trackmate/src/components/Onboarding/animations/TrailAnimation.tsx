import React from 'react';
import Lottie from 'lottie-react';
import trailAnimationData from './trail.json';

const TrailAnimation: React.FC = () => {
  return (
    <Lottie
      animationData={trailAnimationData}
      loop={true}
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default TrailAnimation;
