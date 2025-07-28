'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HairAnalysis } from '@/lib/types';
import { Droplets, Activity, Waves, AlertTriangle, Sparkles, Share2, Download } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';
import ResourceCard from './ResourceCard';
import { getTestResources, getIssueResources, getPainPointResources } from '@/lib/hair-care-resources';
import Image from 'next/image';

interface ResultsDisplayProps {
  analysis: HairAnalysis;
  analyzedImages: string[];
  isSelfieMode: boolean;
}

export default function ResultsDisplay({ analysis, analyzedImages, isSelfieMode }: ResultsDisplayProps) {
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowResults(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-orange-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const formatHealthScore = (score: number) => {
    // Ensure score is between 0-100 and format as two digits
    const clampedScore = Math.max(0, Math.min(100, score));
    const formattedScore = clampedScore.toString().padStart(2, '0');
    console.log('ResultsDisplay - Health score:', { original: score, clamped: clampedScore, formatted: formattedScore });
    return formattedScore;
  };

  const handleGenerateRoutine = () => {
    sessionStorage.setItem('hairAnalysis', JSON.stringify(analysis));
    router.push('/routine');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Curly Hair Analysis Results',
          text: `Check out my personalized curly hair analysis! I discovered I have ${analysis.curlPattern.assessment} hair with a health score of ${formatHealthScore(analysis.healthScore.score)}/100. Get your own analysis at curly-hair-ai.com`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        const shareText = `Check out my personalized curly hair analysis! I discovered I have ${analysis.curlPattern.assessment} hair with a health score of ${formatHealthScore(analysis.healthScore.score)}/100. Get your own analysis at curly-hair-ai.com`;
        await navigator.clipboard.writeText(shareText);
        alert('Share text copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (!showResults) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            ✨ Your Hair Analysis Results
          </h1>
          <p className="text-xl text-text-secondary">
            Discover your unique curl pattern and personalized care recommendations
          </p>
        </div>

        {/* Analyzed Images Section */}
        <div className="border border-border-primary rounded-2xl p-6 bg-surface-primary shadow-sm mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-4 text-center">
            📸 Images Used for Analysis
          </h3>
          <div className="flex justify-center">
            {isSelfieMode ? (
              <div className="text-center">
                <Image
                  src={analyzedImages[0]}
                  alt="Selfie used for hair analysis"
                  className="max-w-md max-h-96 rounded-lg border border-border-primary shadow-sm"
                  width={400}
                  height={400}
                />
                <p className="text-sm text-text-muted mt-2">Selfie photo used for analysis</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
                {analyzedImages.map((image, index) => (
                  <div key={index} className="text-center">
                    <Image
                      src={image}
                      alt={`Hair photo ${index + 1} used for analysis`}
                      className="w-full h-32 object-cover rounded-lg border border-border-primary shadow-sm"
                      width={400}
                      height={400}
                    />
                    <p className="text-xs text-text-muted mt-1">Photo {index + 1}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Curl Pattern */}
          <div className="border border-border-primary rounded-2xl p-6 bg-surface-primary shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                <Waves className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Curl Pattern</h3>
                <p className={`text-sm ${getConfidenceColor(analysis.curlPattern.confidence)}`}>
                  {getConfidenceLabel(analysis.curlPattern.confidence)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-center p-4 border border-border-secondary rounded-lg bg-surface-secondary">
                <div className="text-3xl font-bold text-primary mb-1">
                  {analysis.curlPattern.assessment}
                </div>
                <p className="text-sm text-text-muted">Your curl type</p>
              </div>
              <p className="text-text-secondary">{analysis.curlPattern.evidence}</p>
              {analysis.curlPattern.alternatives.length > 0 && (
                <div className="text-sm">
                  <span className="text-text-muted">Possible alternatives: </span>
                  <span className="text-primary font-medium">
                    {analysis.curlPattern.alternatives.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Porosity */}
          <div className="border border-border-primary rounded-2xl p-6 bg-surface-primary shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Hair Porosity</h3>
                <p className={`text-sm ${getConfidenceColor(analysis.porosity.confidence)}`}>
                  {getConfidenceLabel(analysis.porosity.confidence)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-center p-4 border border-border-secondary rounded-lg bg-surface-secondary">
                <div className="text-2xl font-bold text-primary mb-1">
                  {analysis.porosity.assessment}
                </div>
                <p className="text-sm text-text-muted">Porosity level</p>
              </div>
              <p className="text-text-secondary">{analysis.porosity.evidence}</p>
              {analysis.porosity.testSuggestions.length > 0 && (
                <div className="text-sm bg-surface-tertiary p-3 rounded-lg border border-border-secondary">
                  <span className="text-text-muted">Confirm with: </span>
                  <span className="text-primary font-medium">
                    {analysis.porosity.testSuggestions.join(', ')}
                  </span>
                </div>
              )}
              
              {/* Test Resources */}
              {analysis.porosity.testSuggestions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Learn How to Test:</h4>
                  <div className="space-y-2">
                    {getTestResources(analysis.porosity.testSuggestions).map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} compact />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hair Density */}
          <div className="border border-border-primary rounded-2xl p-6 bg-surface-primary shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Hair Density</h3>
                <p className={`text-sm ${getConfidenceColor(analysis.density.confidence)}`}>
                  {getConfidenceLabel(analysis.density.confidence)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-center p-4 border border-border-secondary rounded-lg bg-surface-secondary">
                <div className="text-2xl font-bold text-primary mb-1">
                  {analysis.density.assessment}
                </div>
                <p className="text-sm text-text-muted">Density level</p>
              </div>
              <p className="text-text-secondary">{analysis.density.evidence}</p>
            </div>
          </div>

          {/* Health Score */}
          <div className="border border-border-primary rounded-2xl p-6 bg-surface-primary shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Health Score</h3>
                <p className={`text-sm ${getConfidenceColor(analysis.healthScore.confidence)}`}>
                  {getConfidenceLabel(analysis.healthScore.confidence)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-center p-4 border border-border-secondary rounded-lg bg-surface-secondary">
                <div className="text-3xl font-bold text-primary mb-1">
                  {formatHealthScore(analysis.healthScore.score)}/100
                </div>
                <p className="text-sm text-text-muted">Overall health</p>
              </div>
              <div className="space-y-2">
                {analysis.healthScore.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-text-secondary">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Specific Issues */}
        {analysis.specificIssues.length > 0 && (
          <div className="border border-border-primary rounded-2xl p-6 bg-surface-primary shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Areas for Improvement</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.specificIssues.map((issue, index) => (
                <div key={index} className="border border-border-primary rounded-lg p-4 bg-surface-secondary">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-text-primary">{issue.issue}</h4>
                    <span className="text-xs px-2 py-1 border border-border-primary rounded-full text-primary bg-surface-primary">
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted">{issue.evidence}</p>
                  <p className={`text-xs mt-2 ${getConfidenceColor(issue.confidence)}`}>
                    {getConfidenceLabel(issue.confidence)}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Issue Resources */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-text-primary mb-4">Solutions & Resources:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {getIssueResources(analysis.specificIssues.map(issue => issue.issue)).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Pain Points */}
        <div className="border border-border-primary rounded-2xl p-6 bg-surface-primary shadow-sm mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-4">Your Top Hair Concerns</h3>
          <div className="space-y-3 mb-6">
            {analysis.topPainPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-text-inverse rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-text-primary font-medium">{point}</p>
              </div>
            ))}
          </div>
          
          {/* Pain Point Resources */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-text-primary mb-4">Expert Solutions:</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {getPainPointResources(analysis.topPainPoints).map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <button
              onClick={handleGenerateRoutine}
              className="bg-success hover:bg-success-hover text-text-inverse font-bold text-xl px-12 py-4 border border-border-primary transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
            >
              Get Your Personalized Routine 🎯
            </button>
            <button
              onClick={handleShare}
              className="bg-primary hover:bg-primary-hover text-text-inverse font-bold text-xl px-12 py-4 border border-border-primary transition-all duration-200 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Results
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-warning hover:bg-warning-hover text-text-inverse font-bold text-xl px-12 py-4 border border-border-primary transition-all duration-200 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
          <p className="text-sm text-text-muted">
            Based on your analysis, we&apos;ll create a custom hair care routine
          </p>
        </div>
      </div>

      {/* Print Styles for PDF Download */}
      <style jsx global>{`
        @media print {
          body { 
            margin: 0; 
            background: white !important;
          }
          .min-h-screen { 
            min-height: auto !important; 
          }
          button { 
            display: none !important; 
          }
          .bg-background { 
            background: white !important; 
          }
          .text-text-primary { 
            color: #000 !important; 
          }
          .text-text-secondary { 
            color: #333 !important; 
          }
          .border-border-primary { 
            border-color: #ccc !important; 
          }
          .shadow-sm { 
            box-shadow: none !important; 
          }
        }
      `}</style>
    </div>
  );
}