import iconImage from '../../../assets/web-icon.png';

interface AppIconProps {
  alt?: string;
  width?: number;
  height?: number;
}

export function AppIcon({ alt = 'App Icon', width = 100, height = 100 }: AppIconProps) {
  return <img src={iconImage} alt={alt} width={width} height={height} />;
}
