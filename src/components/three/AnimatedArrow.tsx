import React from 'react';
import { WebGLCanvas } from './WebGLCanvas';
import { ChannelOrbitAnimation } from './ChannelOrbitAnimation';

interface AnimatedArrowProps {
  className?: string;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({ className }) => {
  return (
    <div className={`w-10 h-10 flex items-center justify-center ${className}`}>
      <WebGLCanvas>
        <ChannelOrbitAnimation />
      </WebGLCanvas>
    </div>
  );
};