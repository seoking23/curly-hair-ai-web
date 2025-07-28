import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    quality: 0.85,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
    };
    reader.onerror = error => reject(error);
  });
};

export const cropToSquare = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): HTMLCanvasElement => {
  const { width, height } = canvas;
  
  // Find the smaller dimension to create a square
  const size = Math.min(width, height);
  
  // Calculate the starting position to center the crop
  const startX = (width - size) / 2;
  const startY = (height - size) / 2;
  
  // Create a new canvas for the square crop
  const squareCanvas = document.createElement('canvas');
  squareCanvas.width = size;
  squareCanvas.height = size;
  
  const squareCtx = squareCanvas.getContext('2d');
  if (!squareCtx) {
    console.error('image-processing - Failed to get 2D context for square canvas');
    return canvas; // Return original if square context fails
  }
  
  // Draw the cropped square portion
  squareCtx.drawImage(
    canvas,
    startX, startY, size, size, // Source rectangle
    0, 0, size, size // Destination rectangle
  );
  
  return squareCanvas;
};

export const ensureSquareAspectRatio = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas to process the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('image-processing - Failed to get 2D context'));
          return;
        }
        
        // Set canvas to original image dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Crop to square
        const squareCanvas = cropToSquare(canvas, ctx);
        
        // Convert square canvas to blob
        squareCanvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('image-processing - Failed to create blob from square canvas'));
            return;
          }
          
          // Create new file with square image
          const squareFile = new File([blob], file.name, { type: file.type });
          resolve(squareFile);
        }, file.type || 'image/jpeg', 0.9);
        
      } catch (error) {
        console.error('image-processing - Error processing image to square:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('image-processing - Failed to load image for square processing'));
    };
    
    // Load image from file
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      reject(new Error('image-processing - Failed to read file for square processing'));
    };
    reader.readAsDataURL(file);
  });
};