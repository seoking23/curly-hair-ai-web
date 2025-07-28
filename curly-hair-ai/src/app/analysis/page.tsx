'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ResultsDisplay from '@/components/ResultsDisplay';
import PDFResultsDisplay from '@/components/PDFResultsDisplay';
import { HairAnalysis } from '@/lib/types';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<HairAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzedImages, setAnalyzedImages] = useState<string[]>([]);
  const [isSelfieMode, setIsSelfieMode] = useState(false);
  const [showPDFVersion, setShowPDFVersion] = useState(false);
  const router = useRouter();

    const analyzePhotos = useCallback(async () => {
    try {
      // Check for selfie first (new flow)
      const selfieData = sessionStorage.getItem('selfiePhoto');
      const selfieImage = sessionStorage.getItem('photo_front');
      
      if (selfieData && selfieImage) {
        // Selfie mode - single photo analysis
        setIsSelfieMode(true);
        setAnalyzedImages([selfieImage]);
        const base64 = selfieImage.split(',')[1];
        const images = [base64];
        
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ images, isSelfie: true }),
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const result = await response.json();
        setAnalysis(result.analysis);
        return;
      }

      // Fallback to multi-photo mode (original flow)
      const photoData = sessionStorage.getItem('hairPhotos');
      if (!photoData) {
        router.push('/');
        return;
      }

      const photos = JSON.parse(photoData);
      const images: string[] = [];
      const imageUrls: string[] = [];

      // Get base64 images from sessionStorage
      for (const photo of photos) {
        const imageData = sessionStorage.getItem(`photo_${photo.id}`);
        if (imageData) {
          // Remove data:image/...;base64, prefix
          const base64 = imageData.split(',')[1];
          images.push(base64);
          imageUrls.push(imageData);
        }
      }

      if (images.length !== 4) {
        setError('Not all photos are available. Please retake your photos.');
        return;
      }

      setAnalyzedImages(imageUrls);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images, isSelfie: false }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze your photos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [router]);
  
useEffect(() => {
    analyzePhotos();
  }, [analyzePhotos]);


  if (loading || !analysis) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">😅</div>
          <h2 className="text-2xl font-bold text-primary mb-4">Oops! Something went wrong</h2>
          <p className="text-secondary mb-6">{error}</p>
          <button
            onClick={() => router.push('/capture')}
            className="bg-primary hover:bg-primary-hover text-inverse font-semibold px-8 py-3 border border-border-primary transition-all duration-200 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showPDFVersion ? (
        <PDFResultsDisplay analysis={analysis} analyzedImages={analyzedImages} isSelfieMode={isSelfieMode} />
      ) : (
        <ResultsDisplay analysis={analysis} analyzedImages={analyzedImages} isSelfieMode={isSelfieMode} />
      )}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowPDFVersion(!showPDFVersion)}
          className="bg-primary hover:bg-primary-hover text-inverse font-semibold px-4 py-2 border border-border-primary transition-all duration-200 rounded-lg shadow-lg"
        >
          {showPDFVersion ? '📱 Show Mobile View' : '📄 Show PDF View'}
        </button>
      </div>
    </div>
  );
}