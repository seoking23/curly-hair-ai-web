'use client';

import { useState, useEffect, useRef } from 'react';
import { HairAnalysis } from '@/lib/types';
import { Droplets, Activity, Waves, AlertTriangle, Sparkles, Share2, Download, Star, Heart, TrendingUp } from 'lucide-react';
import { getTestResources, getIssueResources, getPainPointResources } from '@/lib/hair-care-resources';
import Image from 'next/image';
import SocialShare from './SocialShare';

interface PDFResultsDisplayProps {
  analysis: HairAnalysis;
  analyzedImages: string[];
  isSelfieMode: boolean;
}

export default function PDFResultsDisplay({ analysis, analyzedImages, isSelfieMode }: PDFResultsDisplayProps) {
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

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
    const clampedScore = Math.max(0, Math.min(100, score));
    const formattedScore = clampedScore.toString().padStart(2, '0');
    console.log('PDFResultsDisplay - Health score:', { original: score, clamped: clampedScore, formatted: formattedScore });
    return formattedScore;
  };

  const getHealthScoreEmoji = (score: number) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '✨';
    if (score >= 40) return '💫';
    return '⭐';
  };

  const getCurlTypeEmoji = (curlType: string) => {
    if (curlType.includes('1')) return '🌊';
    if (curlType.includes('2')) return '🌊';
    if (curlType.includes('3')) return '🌀';
    if (curlType.includes('4')) return '🌪️';
    return '💫';
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Use browser's print functionality for PDF generation
      window.print();
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
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

  if (!showResults) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-secondary'>Preparing your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header with Share/Download Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold text-primary mb-2">
              ✨ Your Hair Analysis Results
            </h1>
            <p className="text-xl text-secondary">
              AI-Powered Curly Hair Assessment
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="bg-primary hover:bg-primary-hover text-inverse font-semibold px-6 py-3 border border-border-primary transition-all duration-200 rounded-lg flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Results
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="bg-success hover:bg-success-hover text-inverse font-semibold px-6 py-3 border border-border-primary transition-all duration-200 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* PDF Content Container */}
        <div ref={pdfRef} className="pdf-content-container bg-white rounded-2xl shadow-lg p-8 mb-8 print:p-0 print:shadow-none">
          {/* PDF Header with Tag Bar */}
          <div className="text-center mb-8 print:mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center">
                <span className="text-2xl">💫</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary">Curly Hair AI</h2>
                <p className="text-muted">Professional Hair Analysis Report</p>
              </div>
            </div>
            <div className="border-t border-border-primary pt-4 mb-4">
              <p className="text-sm text-muted">
                Generated on {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            {/* Tag Bar - Moved to top for better PDF visibility */}
            <div className="flex justify-center gap-4 text-xs text-muted bg-surface-secondary py-2 px-4 rounded-lg border border-border-primary print:bg-gray-100">
              <span>🔬 Scientific Analysis</span>
              <span>🎯 Personalized Results</span>
              <span>💡 Expert Recommendations</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6 mb-8 print:mb-6">
            <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Executive Summary
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">{getCurlTypeEmoji(analysis.curlPattern.assessment)}</div>
                <div className="text-xl font-bold text-primary">{analysis.curlPattern.assessment}</div>
                <p className="text-sm text-muted">Curl Type</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">{getHealthScoreEmoji(analysis.healthScore.score)}</div>
                <div className="text-xl font-bold text-primary">{formatHealthScore(analysis.healthScore.score)}/100</div>
                <p className="text-sm text-muted">Health Score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💧</div>
                <div className="text-xl font-bold text-primary">{analysis.porosity.assessment}</div>
                <p className="text-sm text-muted">Porosity</p>
              </div>
            </div>
          </div>

          {/* Analyzed Images */}
          <div className="mb-8 print:mb-6">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              📸 Analysis Images
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
                  <p className="text-sm text-muted mt-2">Selfie Analysis</p>
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
                      <p className="text-xs text-muted mt-1">Photo {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detailed Analysis Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8 print:mb-6">
            {/* Curl Pattern */}
            <div className="border border-border-primary rounded-xl p-6 bg-surface-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                  <Waves className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Curl Pattern</h4>
                  <p className={`text-sm ${getConfidenceColor(analysis.curlPattern.confidence)}`}>
                    {getConfidenceLabel(analysis.curlPattern.confidence)}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-center p-4 border border-border-secondary rounded-lg bg-surface-secondary">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {analysis.curlPattern.assessment}
                  </div>
                  <p className="text-sm text-muted">Your curl type</p>
                </div>
                <p className="text-secondary text-sm">{analysis.curlPattern.evidence}</p>
                {analysis.curlPattern.alternatives.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted">Possible alternatives: </span>
                    <span className="text-primary font-medium">
                      {analysis.curlPattern.alternatives.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Porosity */}
            <div className="border border-border-primary rounded-xl p-6 bg-surface-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Hair Porosity</h4>
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
                  <p className="text-sm text-muted">Porosity level</p>
                </div>
                <p className="text-secondary text-sm">{analysis.porosity.evidence}</p>
                {analysis.porosity.testSuggestions.length > 0 && (
                  <div className="text-sm bg-surface-tertiary p-3 rounded-lg border border-border-secondary">
                    <span className="text-muted">Confirm with: </span>
                    <span className="text-primary font-medium">
                      {analysis.porosity.testSuggestions.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hair Density */}
            <div className="border border-border-primary rounded-xl p-6 bg-surface-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Hair Density</h4>
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
                  <p className="text-sm text-muted">Density level</p>
                </div>
                <p className="text-secondary text-sm">{analysis.density.evidence}</p>
              </div>
            </div>

            {/* Health Score */}
            <div className="border border-border-primary rounded-xl p-6 bg-surface-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Health Score</h4>
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
                  <p className="text-sm text-muted">Overall health</p>
                </div>
                <div className="space-y-2">
                  {analysis.healthScore.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-secondary">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specific Issues */}
          {analysis.specificIssues.length > 0 && (
            <div className="border border-border-primary rounded-xl p-6 bg-surface-primary mb-8 print:mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 border border-border-primary rounded-full flex items-center justify-center bg-surface-secondary">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">Areas for Improvement</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.specificIssues.map((issue, index) => (
                  <div key={index} className="border border-border-primary rounded-lg p-4 bg-surface-secondary">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-primary">{issue.issue}</h4>
                      <span className="text-xs px-2 py-1 border border-border-primary rounded-full text-primary bg-surface-primary">
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{issue.evidence}</p>
                    <p className={`text-xs mt-2 ${getConfidenceColor(issue.confidence)}`}>
                      {getConfidenceLabel(issue.confidence)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Pain Points */}
          <div className="border border-border-primary rounded-xl p-6 bg-surface-primary mb-8 print:mb-6">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Your Top Hair Concerns
            </h3>
            <div className="space-y-3 mb-6">
              {analysis.topPainPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-inverse rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-primary font-medium">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Preview */}
          <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-xl p-6 mb-8 print:mb-6">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Next Steps
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-border-primary">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-bold text-primary mb-2">Get Personalized Routine</h4>
                <p className="text-sm text-muted">Custom care plan based on your analysis</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-border-primary">
                <div className="text-2xl mb-2">📚</div>
                <h4 className="font-bold text-primary mb-2">Learn More</h4>
                <p className="text-sm text-muted">Expert resources and tutorials</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-border-primary">
                <div className="text-2xl mb-2">📈</div>
                <h4 className="font-bold text-primary mb-2">Track Progress</h4>
                <p className="text-sm text-muted">Monitor your hair health journey</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border-primary pt-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center">
                <span className="text-xl">💫</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-primary">Curly Hair AI</h4>
                <p className="text-sm text-muted">Powered by Advanced AI Technology</p>
              </div>
            </div>
            <p className="text-sm text-muted mb-2">
              Get your own personalized analysis at curly-hair-ai.com
            </p>
          </div>
        </div>

        {/* Social Sharing Section */}
        <SocialShare
          title="My Curly Hair Analysis Results"
          text={`Check out my personalized curly hair analysis! I discovered I have ${analysis.curlPattern.assessment} hair with a health score of ${formatHealthScore(analysis.healthScore.score)}/100. Get your own analysis at curly-hair-ai.com`}
          variant="full"
          className="mb-8"
        />

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="bg-success hover:bg-success-hover text-inverse font-bold text-lg px-8 py-4 border border-border-primary transition-all duration-200 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {isGeneratingPDF ? 'Generating PDF...' : 'Download Full Report'}
            </button>
            <button
              onClick={handleShare}
              className="bg-primary hover:bg-primary-hover text-inverse font-bold text-lg px-8 py-4 border border-border-primary transition-all duration-200 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Results
            </button>
          </div>
          <p className="text-sm text-muted">
            Share your results with friends and family! 📱✨
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:mb-6 { margin-bottom: 1.5rem !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          button { display: none !important; }
          
          /* Ensure tag bar is visible and properly positioned in print */
          .print\\:bg-gray-100 { background-color: #f3f4f6 !important; }
          
          /* Add page breaks to prevent content overlap */
          .pdf-content-container > div:nth-child(2) { 
            page-break-before: auto; 
          }
          
          /* Ensure proper spacing for print */
          .pdf-content-container { 
            padding: 20px !important; 
            margin: 0 !important; 
          }
        }
      `}</style>
    </div>
  );
} 