'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RoutineDisplay from '@/components/RoutineDisplay';
import { HairAnalysis, HairRoutine } from '@/lib/types';

export default function RoutinePage() {
  const [routine, setRoutine] = useState<HairRoutine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const generateRoutine = useCallback(async () => {
    try {
      const analysisData = sessionStorage.getItem('hairAnalysis');
      if (!analysisData) {
        router.push('/capture');
        return;
      }

      const analysis: HairAnalysis = JSON.parse(analysisData);

      const response = await fetch('/api/routine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis }),
      });

      if (!response.ok) {
        throw new Error('Routine generation failed');
      }

      const result = await response.json();
      setRoutine(result.routine);
    } catch (error) {
      console.error('Routine generation error:', error);
      setError('Failed to generate your routine. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    generateRoutine();
  }, [generateRoutine]);

  if (loading || !routine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-border-secondary"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Creating Your Personalized Routine...
          </h2>
          <p className="text-text-secondary">
            Crafting the perfect hair care plan based on your analysis
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">😅</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Oops! Something went wrong</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => router.push('/analysis')}
            className="bg-primary hover:bg-primary-hover text-text-inverse font-semibold px-8 py-3 border border-border-primary transition-all duration-200 rounded-lg"
          >
            Back to Analysis
          </button>
        </div>
      </div>
    );
  }

  return <RoutineDisplay routine={routine} />;
}