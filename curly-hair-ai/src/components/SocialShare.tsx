'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface SocialShareProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
  variant?: 'button' | 'icon' | 'full';
}

export default function SocialShare({ 
  title, 
  text, 
  url = window.location.href, 
  className = '',
  variant = 'button' 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('SocialShare - Share error:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardError) {
        console.error('SocialShare - Clipboard error:', clipboardError);
      }
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        className={`p-2 rounded-full bg-primary hover:bg-primary-hover text-text-inverse transition-all duration-200 ${className}`}
        title="Share results"
      >
        {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6 ${className}`}>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-text-primary mb-2">Share Your Results! 🎉</h3>
          <p className="text-text-secondary">
            Help others discover their curl type and get personalized hair care advice
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleShare}
            className="bg-primary hover:bg-primary-hover text-text-inverse font-semibold px-6 py-3 border border-border-primary transition-all duration-200 rounded-lg flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Copied!' : 'Share Results'}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${text}\n\n${url}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="border border-border-primary hover:bg-surface-secondary text-text-primary font-semibold px-6 py-3 transition-all duration-200 rounded-lg flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-text-muted">
            📱 Share on social media • 💬 Send to friends • 📧 Email to yourself
          </p>
        </div>
      </div>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleShare}
      className={`bg-primary hover:bg-primary-hover text-text-inverse font-semibold px-6 py-3 border border-border-primary transition-all duration-200 rounded-lg flex items-center gap-2 ${className}`}
    >
      <Share2 className="w-4 h-4" />
      {copied ? 'Copied!' : 'Share Results'}
    </button>
  );
} 