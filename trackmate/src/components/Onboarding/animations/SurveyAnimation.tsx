import React from 'react';
import Lottie from 'lottie-react';
import surveyAnimationData from './survey.json';

const SurveyAnimation: React.FC = () => {
  return (
    <Lottie
      animationData={surveyAnimationData}
      loop={true}
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default SurveyAnimation;
