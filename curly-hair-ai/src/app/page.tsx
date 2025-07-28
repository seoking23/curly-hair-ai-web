'use client';

import CameraSelfie from '@/components/CameraSelfie';

export default function Home() {
  const handleCapture = (imageData: string) => {
    // Image data is handled by CameraSelfie component
    console.log('Image captured:', imageData.length, 'characters');
  };

  return <CameraSelfie onCapture={handleCapture} />;
}
