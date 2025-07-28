'use client';

import { useState } from 'react';
import CameraSelfie from '@/components/CameraSelfie';

export default function CameraTestPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    console.log('Camera test - Image captured successfully');
  };

  return (
    <div>
      <div className="bg-red-500 text-white p-2 text-center">
        CAMERA TEST PAGE - Remove in production
      </div>
      <CameraSelfie onCapture={handleCapture} />
      {capturedImage && (
        <div className="fixed top-4 right-4 bg-white border-2 border-primary p-2 rounded">
          <p className="text-xs">Image captured: {capturedImage.length} chars</p>
        </div>
      )}
    </div>
  );
}