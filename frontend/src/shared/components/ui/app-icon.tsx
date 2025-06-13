import React from 'react';
import iconImage from '../../../assets/web-icon.png';

interface AppIconProps {
  alt?: string;
  width?: number;
  height?: number;
}

const AppIcon: React.FC<AppIconProps> = ({
  alt = 'App Icon',
  width = '100%',
  height = '100%',
}) => {
  return <img src={iconImage} alt={alt} width={width} height={height} />;
};

export default AppIcon;