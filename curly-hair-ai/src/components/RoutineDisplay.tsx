'use client';

import { useState } from 'react';
import { HairRoutine } from '@/lib/types';
import { Calendar, Clock, Droplets, Sparkles, BookOpen } from 'lucide-react';

interface RoutineDisplayProps {
  routine: HairRoutine;
}

export default function RoutineDisplay({ routine }: RoutineDisplayProps) {
  const [activeTab, setActiveTab] = useState('washday');

  const getIcon = (step: string) => {
    if (step.toLowerCase().includes('condition')) return <Droplets className="w-5 h-5" />;
    if (step.toLowerCase().includes('treatment')) return <Sparkles className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            🎯 Your Personalized Hair Routine
          </h1>
          <p className="text-xl text-secondary">
            Custom care plan based on your unique hair analysis
          </p>
        </div>

        {/* Routine Tabs */}
        <div className="border border-border-primary rounded-2xl bg-surface-primary overflow-hidden mb-8 shadow-sm">
          <div className="flex border-b border-border-secondary">
            <button
              onClick={() => setActiveTab('washday')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === 'washday'
                  ? 'bg-primary text-inverse'
                  : 'bg-surface-primary text-primary hover:bg-surface-secondary'
              }`}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Wash Day ({routine.routine.washDay.frequency})
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === 'daily'
                  ? 'bg-primary text-inverse'
                  : 'bg-surface-primary text-primary hover:bg-surface-secondary'
              }`}
            >
              <Clock className="w-5 h-5 inline mr-2" />
              Daily Care
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === 'weekly'
                  ? 'bg-primary text-inverse'
                  : 'bg-surface-primary text-primary hover:bg-surface-secondary'
              }`}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Weekly Treatments
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'washday' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">Wash Day Routine</h3>
                  <p className="text-secondary">
                    Follow this routine {routine.routine.washDay.frequency} for optimal hair health
                  </p>
                </div>
                {routine.routine.washDay.steps.map((step, index) => (
                  <div key={index} className="border border-border-primary rounded-lg p-6 bg-surface-secondary">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border border-border-secondary rounded-full flex items-center justify-center flex-shrink-0 bg-surface-primary">
                        {getIcon(step.step)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-primary text-inverse text-sm font-bold px-3 py-1 rounded-full">
                            Step {index + 1}
                          </span>
                          <h4 className="text-lg font-bold text-primary">{step.step}</h4>
                        </div>
                        <p className="text-primary font-medium mb-2">{step.product}</p>
                        <p className="text-secondary mb-3">{step.why}</p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <BookOpen className="w-4 h-4" />
                          <span>Source: {step.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'daily' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">Daily Maintenance</h3>
                  <p className="text-secondary">
                    Quick daily steps to keep your curls looking their best
                  </p>
                </div>
                {routine.routine.daily.steps.map((step, index) => (
                  <div key={index} className="border border-border-primary rounded-lg p-6 bg-surface-secondary">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border border-border-secondary rounded-full flex items-center justify-center flex-shrink-0 bg-surface-primary">
                        {getIcon(step.step)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-2">{step.step}</h4>
                        <p className="text-primary font-medium mb-2">{step.product}</p>
                        <p className="text-secondary mb-3">{step.why}</p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <BookOpen className="w-4 h-4" />
                          <span>Source: {step.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'weekly' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">Weekly Treatments</h3>
                  <p className="text-secondary">
                    Deep treatments to maintain and improve hair health
                  </p>
                </div>
                {routine.routine.weekly.steps.map((step, index) => (
                  <div key={index} className="border border-border-primary rounded-lg p-6 bg-surface-secondary">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border border-border-secondary rounded-full flex items-center justify-center flex-shrink-0 bg-surface-primary">
                        {getIcon(step.step)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-2">{step.step}</h4>
                        <p className="text-primary font-medium mb-2">{step.product}</p>
                        <p className="text-secondary mb-3">{step.why}</p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <BookOpen className="w-4 h-4" />
                          <span>Source: {step.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Categories */}
        <div className="border border-border-primary rounded-2xl bg-surface-primary p-8 mb-8 shadow-sm">
          <h3 className="text-2xl font-bold text-primary mb-6">Essential Product Categories</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routine.productCategories.map((category, index) => (
              <div key={index} className="border border-border-primary rounded-lg p-6 bg-surface-secondary">
                <h4 className="text-lg font-bold text-primary mb-3">{category.category}</h4>
                <p className="text-secondary mb-4">{category.why}</p>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-muted mb-2">Key Ingredients:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.ingredients.map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="border border-border-primary text-primary text-xs px-2 py-1 rounded-full bg-surface-primary"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <BookOpen className="w-4 h-4" />
                  <span>Source: {category.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Techniques */}
        <div className="border border-border-primary rounded-2xl bg-surface-primary p-8 mb-8 shadow-sm">
          <h3 className="text-2xl font-bold text-primary mb-6">Pro Techniques</h3>
          <div className="space-y-6">
            {routine.techniques.map((technique, index) => (
              <div key={index} className="border border-border-primary rounded-lg p-6 bg-surface-secondary">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-border-secondary rounded-full flex items-center justify-center flex-shrink-0 bg-surface-primary">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-primary mb-2">{technique.name}</h4>
                    <p className="text-primary font-medium mb-2">{technique.description}</p>
                    <p className="text-secondary mb-3">
                      <span className="font-semibold">Benefit:</span> {technique.benefit}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <BookOpen className="w-4 h-4" />
                      <span>Source: {technique.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Tips */}
        <div className="border border-border-primary rounded-2xl p-8 bg-surface-primary text-center shadow-sm">
          <h3 className="text-2xl font-bold text-primary mb-4">🎉 You&apos;re All Set!</h3>
          <p className="text-lg text-secondary mb-6">
            Your personalized routine is ready. Remember, consistency is key for healthy curls!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="bg-primary hover:bg-primary-hover text-inverse font-semibold px-8 py-3 border border-border-primary transition-all duration-200 rounded-lg"
            >
              📄 Save as PDF
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="border border-border-primary hover:bg-surface-secondary text-primary font-semibold px-8 py-3 transition-all duration-200 rounded-lg"
            >
              🏠 Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}