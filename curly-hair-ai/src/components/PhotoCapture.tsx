'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Check, RotateCw, Upload } from 'lucide-react';
import { PhotoData } from '@/lib/types';
import { compressImage } from '@/lib/image-processing';
import Image from 'next/image';

const photoSteps: Omit<PhotoData, 'file' | 'preview'>[] = [
  {
    id: 'front',
    title: 'Front View',
    instruction: 'Face the camera with your hair down and natural',
    validation: 'Face clearly visible, full hair shown'
  },
  {
    id: 'back',
    title: 'Back View',
    instruction: 'Turn around to show the back of your hair',
    validation: 'Back of head clearly visible'
  },
  {
    id: 'top',
    title: 'Top View',
    instruction: 'Looking down to show crown and hair density',
    validation: 'Crown and hair density visible'
  },
  {
    id: 'closeup',
    title: 'Close-up',
    instruction: 'Close shot showing curl pattern and texture',
    validation: 'Individual curls and texture clear'
  }
];

type PermissionState = 'prompt' | 'granted' | 'denied';

export default function PhotoCapture() {
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<PhotoData[]>(
    photoSteps.map(step => ({ ...step }))
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [showFallback, setShowFallback] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      // Convert to blob and compress
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `${photos[currentStep].id}.jpg`, { type: 'image/jpeg' });
        const compressedFile = await compressImage(file);
        
        // Convert to data URL
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result as string;
          
          const updatedPhotos = [...photos];
          updatedPhotos[currentStep] = {
            ...updatedPhotos[currentStep],
            file: imageData,
            preview: imageData
          };
          setPhotos(updatedPhotos);
        };
        reader.readAsDataURL(compressedFile);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('PhotoCapture - Error capturing photo:', error);
      setError('Failed to capture photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [photos, currentStep, facingMode]);

  const initializeCamera = useCallback(async (attempt = 1): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setShowFallback(false);

      // Wait for video element to be available in DOM
      if (!videoRef.current) {
        if (attempt <= 10) {
          console.log(`PhotoCapture - Video ref not ready, retrying... (attempt ${attempt}/10)`);
          // Use requestAnimationFrame for better DOM sync
          requestAnimationFrame(() => {
            setTimeout(() => initializeCamera(attempt + 1), 100);
          });
          return;
        } else {
          console.error('PhotoCapture - Video element failed to mount after 10 attempts');
          throw new Error('Camera interface failed to initialize. Please refresh the page.');
        }
      }

      // Additional check: ensure video element is connected to DOM
      if (!videoRef.current.isConnected) {
        console.log('PhotoCapture - Video element not connected to DOM yet, retrying...');
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

      console.log('PhotoCapture - Requesting camera access with facingMode:', facingMode);

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
        console.log('PhotoCapture - Video ready to play');
        setIsLoading(false);
        setPermissionState('granted');
      };

      const handleVideoError = (e: Event) => {
        console.error('PhotoCapture - Video element error:', e);
        setError('Video playback failed');
        setIsLoading(false);
      };

      video.addEventListener('loadedmetadata', handleVideoReady, { once: true });
      video.addEventListener('error', handleVideoError, { once: true });

      // Start playing
      try {
        await video.play();
      } catch (playError) {
        console.error('PhotoCapture - Video play error:', playError);
        // Don't throw here, let the video element handle it
      }

    } catch (err) {
      console.error('PhotoCapture - Camera initialization error:', err);
      
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
        console.log('PhotoCapture - Stopped camera track on switch:', track.kind);
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

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        
        const updatedPhotos = [...photos];
        updatedPhotos[currentStep] = {
          ...updatedPhotos[currentStep],
          file: imageData,
          preview: imageData
        };
        setPhotos(updatedPhotos);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('PhotoCapture - Error processing uploaded image:', error);
      setError('Failed to process uploaded image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [photos, currentStep]);

  const handleNext = () => {
    if (currentStep < photoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Reset camera state for next step
    } else {
      // All photos captured, proceed to analysis
      handleAnalyze();
    }
  };

  const handleRetake = () => {
    const updatedPhotos = [...photos];
    updatedPhotos[currentStep] = {
      ...photoSteps[currentStep]
    };
    setPhotos(updatedPhotos);
  };

  const handleAnalyze = async () => {
    const allPhotosComplete = photos.every(photo => photo.file);
    if (!allPhotosComplete) return;

    // Store photos in sessionStorage for analysis
    const photoData = photos.map(photo => ({
      id: photo.id,
      title: photo.title,
      file: photo.file
    }));
    
    sessionStorage.setItem('hairPhotos', JSON.stringify(photoData.map(p => ({ id: p.id, title: p.title }))));
    
    // Store actual files
    for (const photo of photoData) {
      if (photo.file) {
        sessionStorage.setItem(`photo_${photo.id}`, photo.file);
      }
    }
    
    router.push('/analysis');
  };

  // Initialize camera on mount, facingMode change, and currentStep change
  useEffect(() => {
    let mounted = true;
    
    // Clean up existing stream before initializing new one
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('PhotoCapture - Stopped camera track before reinit:', track.kind);
      });
      streamRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
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
          console.log('PhotoCapture - Stopped camera track on cleanup:', track.kind);
        });
        streamRef.current = null;
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode, currentStep]); // Depend on both facingMode and currentStep

  const currentPhoto = photos[currentStep];
  const allPhotosComplete = photos.every(photo => photo.file);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress */}
      <div className="p-4 border-b border-border-secondary bg-surface-primary">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-text-primary">Hair Photo Capture</h1>
            <span className="text-sm text-text-muted">
              Step {currentStep + 1} of {photoSteps.length}
            </span>
          </div>
          <div className="w-full border border-border-primary rounded-full h-2 bg-surface-secondary">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / photoSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Photo Grid Preview */}
      <div className="p-4 border-b border-border-secondary bg-surface-primary">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-2">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`aspect-square rounded-lg border transition-all shadow-sm ${
                  index === currentStep 
                    ? 'border-border-focus bg-surface-primary' 
                    : photo.file 
                      ? 'border-primary bg-surface-primary'
                      : 'border-border-secondary bg-surface-secondary'
                }`}
              >
                {photo.preview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={photo.preview}
                      alt={photo.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-1 right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <Camera className={`w-4 h-4 mb-1 ${index === currentStep ? 'text-primary' : 'text-text-muted'}`} />
                    <p className="text-xs text-center font-medium text-text-secondary">{photo.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {currentPhoto.title}
            </h2>
            <p className="text-lg text-text-secondary mb-2">
              {currentPhoto.instruction}
            </p>
            <p className="text-sm text-text-muted">
              Make sure: {currentPhoto.validation}
            </p>
          </div>

          {/* Camera View or Preview */}
          <div className="relative max-w-md mx-auto">
            {currentPhoto.preview ? (
              <div className="space-y-6">
                <div className="aspect-square rounded-lg overflow-hidden border border-border-primary shadow-sm">
                  <Image
                    src={currentPhoto.preview}
                    alt={currentPhoto.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-2 px-6 py-3 border border-border-primary hover:bg-surface-secondary text-text-primary font-semibold transition-all duration-200 rounded-lg"
                  >
                    <RotateCw className="w-4 h-4" />
                    Retake
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-text-inverse font-semibold border border-border-primary transition-all duration-200 rounded-lg"
                  >
                    {currentStep === photoSteps.length - 1 ? (
                      allPhotosComplete ? 'Analyze Hair 🚀' : 'Continue'
                    ) : (
                      'Next Step'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="aspect-square bg-surface-primary border border-border-primary rounded-2xl flex items-center justify-center min-h-[400px] shadow-sm">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-text-primary font-medium">Starting camera...</p>
                      <p className="text-xs text-text-muted mt-2">Please allow camera access when prompted</p>
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
                              ref={fileInputRef}
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

                {/* Camera View */}
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
                        <span className="text-sm font-medium">Position your {currentPhoto.title} in the oval and tap capture</span>
                      </div>
                    </div>

                    {/* Processing overlay */}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-surface-primary rounded-2xl p-6 text-center border border-border-primary shadow-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-text-primary font-medium">Capturing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      {!isLoading && !error && stream && !currentPhoto.preview && (
        <div className="p-4 border-t border-border-secondary bg-surface-primary">
          <div className="max-w-md mx-auto flex justify-center gap-4">
            <button
              onClick={switchCamera}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-border-primary hover:bg-surface-secondary text-text-primary font-semibold transition-all duration-200 disabled:opacity-50 rounded-lg"
            >
              <RotateCw className="w-4 h-4" />
              Flip
            </button>
            
            <button
              onClick={capturePhoto}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-text-inverse font-semibold border border-border-primary transition-all duration-200 disabled:opacity-50 rounded-lg"
            >
              <Camera className="w-4 h-4" />
              Capture
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-text-muted">
              📱 Hair down naturally • 💡 Good lighting • 📏 Face in oval • 👆 Tap capture when ready
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {currentStep > 0 && (
        <div className="p-4 border-t border-border-secondary bg-surface-primary">
          <div className="max-w-md mx-auto text-center">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
            >
              ← Back to {photoSteps[currentStep - 1].title}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}