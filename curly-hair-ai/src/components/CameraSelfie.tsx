'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, RotateCw, Check, Upload } from 'lucide-react';
import { compressImage, cropToSquare, ensureSquareAspectRatio } from '@/lib/image-processing';
import Image from 'next/image';

interface CameraSelfieProps {
  onCapture: (imageData: string) => void;
}

type PermissionState = 'prompt' | 'granted' | 'denied';

export default function CameraSelfie({ onCapture }: CameraSelfieProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [showFallback, setShowFallback] = useState(false);
  const [isRetakeMode, setIsRetakeMode] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  // Check camera permissions
  const checkCameraPermission = useCallback(async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionState(permission.state as PermissionState);
        return permission.state === 'granted';
      }
      return true; // Assume granted if permissions API not available
    } catch {
      return true; // Fallback to attempting access
    }
  }, []);

  // Capture photo function
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Apply mirroring transformation if using front camera (user-facing)
      if (facingMode === 'user') {
        // Save the current context state
        ctx.save();
        // Apply horizontal flip transformation
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }

      // Draw the current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Restore context state if mirroring was applied
      if (facingMode === 'user') {
        ctx.restore();
      }

      // Crop to square aspect ratio
      const squareCanvas = cropToSquare(canvas, ctx);
      
      // Convert square canvas to blob and compress
      squareCanvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        const compressedFile = await compressImage(file);
        
        // Convert to data URL
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result as string;
          setCapturedImage(imageData);
          onCapture(imageData);
        };
        reader.readAsDataURL(compressedFile);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('CameraSelfie - Error capturing photo:', error);
      setError('Failed to capture photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onCapture, facingMode]);

  const initializeCamera = useCallback(async (attempt = 1): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setShowFallback(false);

      // Wait for video element to be available in DOM
      if (!videoRef.current) {
        if (attempt <= 10) {
          console.log(`CameraSelfie - Video ref not ready, retrying... (attempt ${attempt}/10)`);
          // Use requestAnimationFrame for better DOM sync
          requestAnimationFrame(() => {
            setTimeout(() => initializeCamera(attempt + 1), 100);
          });
          return;
        } else {
          console.error('CameraSelfie - Video element failed to mount after 10 attempts');
          throw new Error('Camera interface failed to initialize. Please refresh the page.');
        }
      }

      // Additional check: ensure video element is connected to DOM
      if (!videoRef.current.isConnected) {
        console.log('CameraSelfie - Video element not connected to DOM yet, retrying...');
        if (attempt <= 10) {
          setTimeout(() => initializeCamera(attempt + 1), 100);
          return;
        } else {
          throw new Error('Video element not properly mounted in DOM');
        }
      }

      // Check browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Check permissions first
      await checkCameraPermission();

      console.log('CameraSelfie - Requesting camera access with facingMode:', facingMode, 'retakeMode:', isRetakeMode);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!videoRef.current) {
        // Clean up stream if video ref disappeared
        mediaStream.getTracks().forEach(track => track.stop());
        throw new Error('Video element no longer available');
      }

      // Store stream reference for cleanup
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      // Configure video element
      const video = videoRef.current;
      video.srcObject = mediaStream;
      video.playsInline = true;
      video.muted = true;
      
      // Handle video events
      const handleVideoReady = () => {
        console.log('CameraSelfie - Video ready to play');
        setIsLoading(false);
        setPermissionState('granted');
      };

      const handleVideoError = (e: Event) => {
        console.error('CameraSelfie - Video element error:', e);
        setError('Video playback failed');
        setIsLoading(false);
      };

      video.addEventListener('loadedmetadata', handleVideoReady, { once: true });
      video.addEventListener('error', handleVideoError, { once: true });

      // Start playing
      try {
        await video.play();
      } catch (playError) {
        console.error('CameraSelfie - Video play error:', playError);
        // Don't throw here, let the video element handle it
      }

    } catch (err) {
      console.error('CameraSelfie - Camera initialization error:', err);
      
      let errorMessage = 'Unable to access camera. ';
      let shouldShowFallback = false;
      
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera permission denied. Please allow camera access or use file upload.';
            setPermissionState('denied');
            shouldShowFallback = true;
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found on this device. You can upload a photo instead.';
            shouldShowFallback = true;
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is being used by another application. Please close other apps and try again.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'Camera constraints not supported. Trying with basic settings...';
            // Retry with basic constraints
            if (attempt === 1) {
              setTimeout(() => initializeCamera(2), 1000);
              return;
            }
            break;
          default:
            errorMessage += err.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      setShowFallback(shouldShowFallback);
    }
  }, [facingMode, checkCameraPermission]);

  const switchCamera = useCallback(async () => {
    // Stop current stream directly
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped camera track on switch:', track.kind);
      });
      streamRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    // Switch camera mode (this will trigger the useEffect to reinitialize)
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stream]);

  const retakePhoto = useCallback(async () => {
    setCapturedImage(null);
    setIsLoading(true);
    setError(null);
    setIsRetakeMode(true);
    
    // Ensure camera is properly mounted and ready
    try {
      // Small delay to allow UI state to reset
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reinitialize camera to ensure it's properly mounted
      await initializeCamera();
    } catch (error) {
      console.error('CameraSelfie - Error reinitializing camera on retake:', error);
      setError('Failed to restart camera. Please refresh the page.');
      setIsLoading(false);
    } finally {
      setIsRetakeMode(false);
    }
  }, [initializeCamera]);

  const analyzePhoto = () => {
    if (capturedImage) {
      // Store the front-facing selfie as the first photo
      const frontPhoto = {
        id: 'front',
        title: 'Front View',
        file: capturedImage
      };
      
      sessionStorage.setItem('selfiePhoto', JSON.stringify(frontPhoto));
      sessionStorage.setItem('photo_front', capturedImage);
      
      // Go directly to analysis with just the selfie
      router.push('/analysis');
    }
  };

  // Initialize camera on mount and facingMode change
  useEffect(() => {
    let mounted = true;
    
    // Use multiple strategies to ensure DOM is ready
    const initWhenReady = () => {
      if (mounted) {
        // Wait for next tick to ensure video element is rendered
        requestAnimationFrame(() => {
          if (mounted) {
            setTimeout(() => {
              if (mounted) {
                initializeCamera();
              }
            }, 50);
          }
        });
      }
    };

    // Start initialization after a short delay
    const timer = setTimeout(initWhenReady, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      // Clean up existing stream when facingMode changes or component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped camera track on cleanup:', track.kind);
        });
        streamRef.current = null;
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]); // Only depend on facingMode to avoid infinite loops

  // File upload handler for fallback
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      
      // Ensure the uploaded image is cropped to square and compressed
      const squareFile = await ensureSquareAspectRatio(file);
      const compressedFile = await compressImage(squareFile);
      
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        setCapturedImage(imageData);
        onCapture(imageData);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('CameraSelfie - Error processing uploaded image:', error);
      setError('Failed to process uploaded image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onCapture]);

  if (capturedImage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Perfect! 📸</h2>
          
          <div className="relative mb-6">
            <Image
              src={capturedImage}
              alt="Captured selfie"
              width={400}
              height={400}
              className="w-full aspect-square object-cover rounded-2xl border-2 border-border-primary shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={analyzePhoto}
              className="w-full bg-primary hover:bg-primary-hover text-text-inverse font-semibold text-lg px-8 py-4 rounded-lg border border-border-primary transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Analyze My Hair ✨
            </button>
            
            <button
              onClick={retakePhoto}
              disabled={isRetakeMode}
              className="w-full border border-border-primary hover:bg-surface-secondary text-text-primary font-semibold px-8 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCw className={`w-4 h-4 inline mr-2 ${isRetakeMode ? 'animate-spin' : ''}`} />
              {isRetakeMode ? 'Restarting Camera...' : 'Retake Photo'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-secondary bg-surface-primary">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Curly Hair AI
          </h1>
          <p className="text-text-secondary">
            Position your face in the frame and tap capture when ready
          </p>
        </div>
      </div>



      {/* Camera View */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-md mx-auto">
          {isLoading && (
            <div className="aspect-square bg-surface-primary border border-border-primary rounded-2xl flex items-center justify-center min-h-[400px] shadow-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-primary font-medium">
                  {isRetakeMode ? 'Restarting camera...' : 'Starting camera...'}
                </p>
                <p className="text-xs text-text-muted mt-2">
                  {isRetakeMode ? 'Preparing for new photo' : 'Please allow camera access when prompted'}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="aspect-square bg-surface-primary border border-border-primary rounded-2xl flex items-center justify-center p-6 min-h-[400px] shadow-sm">
              <div className="text-center max-w-sm">
                <div className="text-4xl mb-4">📷</div>
                <p className="text-text-primary font-medium mb-4 text-sm">{error}</p>
                
                {!showFallback ? (
                  <button
                    onClick={() => initializeCamera()}
                    className="bg-primary hover:bg-primary-hover text-text-inverse font-semibold px-6 py-2 rounded-lg border border-border-primary transition-all duration-200 mb-3"
                  >
                    Try Again
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => initializeCamera()}
                      className="bg-primary hover:bg-primary-hover text-text-inverse font-semibold px-6 py-2 rounded-lg border border-border-primary transition-all duration-200 block w-full"
                    >
                      Try Camera Again
                    </button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center gap-2 w-full px-6 py-2 border border-border-primary hover:bg-surface-secondary text-text-primary font-semibold transition-all duration-200 cursor-pointer rounded-lg"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </label>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-text-muted mt-3">
                  {permissionState === 'denied' 
                    ? 'Camera permission denied in browser settings' 
                    : 'Make sure to allow camera permissions'}
                </p>
              </div>
            </div>
          )}

          {/* Always render video element, but control visibility */}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              controls={false}
              className={`w-full aspect-square object-cover rounded-2xl border border-border-primary min-h-[400px] bg-black shadow-sm ${
                isLoading || error ? 'hidden' : ''
              } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
              
              {/* AR Hair Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none top-10">
                {/* Head outline guide */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 300 300"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Face oval guide */}
                  <ellipse
                    cx="150"
                    cy="120"
                    rx="60"
                    ry="75"
                    fill="none"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                  
                  {/* Hair area guide */}
                  <path
                    d="M 90 80 Q 150 40 210 80 Q 210 100 190 120 Q 170 100 150 105 Q 130 100 110 120 Q 90 100 90 80"
                    fill="none"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                  
                  {/* Curly hair decorative elements */}
                  <g opacity="0.3">
                    <circle cx="100" cy="70" r="8" fill="none" stroke="#666666" strokeWidth="1" />
                    <circle cx="120" cy="60" r="6" fill="none" stroke="#666666" strokeWidth="1" />
                    <circle cx="180" cy="60" r="6" fill="none" stroke="#666666" strokeWidth="1" />
                    <circle cx="200" cy="70" r="8" fill="none" stroke="#666666" strokeWidth="1" />
                  </g>
                </svg>

                {/* Status indicators */}
                <div className="absolute top-[-2rem] left-4 right-4">
                  <div className="text-center p-2 rounded-lg border bg-surface-primary border-border-secondary text-text-muted">
                    <span className="text-sm font-medium">Position your face in the oval • Image will be cropped to square</span>
                  </div>
                </div>

                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-surface-primary rounded-2xl p-6 text-center border border-border-primary shadow-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-text-primary font-medium">Processing image...</p>
                      <p className="text-xs text-text-muted mt-1">Cropping to square & optimizing</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      {/* Controls */}
      {!isLoading && !error && stream && (
        <div className="p-4 border-t border-border-secondary bg-surface-primary">
          <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            {/* Main Capture Button */}
            <button
              onClick={capturePhoto}
              disabled={isProcessing}
              className="w-full max-w-xs bg-primary hover:bg-primary-hover text-text-inverse font-bold text-lg px-8 py-4 border border-border-primary transition-all duration-200 disabled:opacity-50 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Camera className="w-6 h-6 inline mr-3" />
              Capture Photo
            </button>
            
            {/* Secondary Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={switchCamera}
                disabled={isLoading}
                className="p-3 border border-border-primary hover:bg-surface-secondary text-text-primary transition-all duration-200 disabled:opacity-50 rounded-full shadow-sm"
                title="Flip Camera"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-text-muted">
              📱 Hair down naturally • 💡 Good lighting • 📏 Face in oval • 👆 Tap capture when ready
            </p>
          </div>
          
          {/* Debug test button */}
          <div className="text-center mt-2">
            <button
              onClick={() => {
                console.log('Debug - Video element:', videoRef.current);
                console.log('Debug - Stream:', stream);
                console.log('Debug - Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
              }}
              className="text-xs text-text-muted hover:text-primary transition-colors duration-200"
            >
              Debug Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}