'use client';

import { ExternalLink, Play, FileText, ShoppingBag, BookOpen, Clock, User } from 'lucide-react';
import { HairCareResource } from '@/lib/types';
import Image from 'next/image';

interface ResourceCardProps {
  resource: HairCareResource;
  compact?: boolean;
}

export default function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  const getTypeIcon = () => {
    switch (resource.type) {
      case 'youtube':
        return <Play className="w-4 h-4" />;
      case 'tiktok':
        return <Play className="w-4 h-4" />;
      case 'blog':
        return <FileText className="w-4 h-4" />;
      case 'product':
        return <ShoppingBag className="w-4 h-4" />;
      case 'scientific':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (resource.type) {
      case 'youtube':
        return 'bg-red-500 text-white';
      case 'tiktok':
        return 'bg-black text-white';
      case 'blog':
        return 'bg-blue-500 text-white';
      case 'product':
        return 'bg-green-500 text-white';
      case 'scientific':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeLabel = () => {
    switch (resource.type) {
      case 'youtube':
        return 'YouTube';
      case 'tiktok':
        return 'TikTok';
      case 'blog':
        return 'Blog';
      case 'product':
        return 'Product';
      case 'scientific':
        return 'Research';
      default:
        return 'Link';
    }
  };

  const handleClick = () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <div
        className="border border-border-primary rounded-lg p-3 bg-surface-primary hover:bg-surface-secondary transition-all duration-200 cursor-pointer group"
        onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor()}`}>
            {getTypeIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-primary text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {resource.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted">
              <span className="px-2 py-1 bg-surface-secondary rounded-full text-xs">
                {getTypeLabel()}
              </span>
              {resource.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{resource.duration}</span>
                </div>
              )}
              {resource.author && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{resource.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border border-border-primary rounded-xl p-4 bg-surface-primary hover:bg-surface-secondary transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        {resource.thumbnail && (
          <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-secondary">
            <Image
              src={resource.thumbnail}
              alt={resource.title}
              width={96}
              height={64}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
            <span className="text-xs font-medium text-muted">{getTypeLabel()}</span>
            {resource.duration && (
              <div className="flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3 h-3" />
                <span>{resource.duration}</span>
              </div>
            )}
          </div>
          
          <h4 className="font-semibold text-primary text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {resource.title}
          </h4>
          
          <p className="text-sm text-secondary line-clamp-2 mb-3">
            {resource.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted">
              {resource.author && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{resource.author}</span>
                </div>
              )}
              {resource.source && (
                <span>• {resource.source}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <span>Learn More</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 