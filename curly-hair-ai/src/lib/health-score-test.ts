// Test file for health score formatting
// This can be removed after testing

export const formatHealthScore = (score: number) => {
  // Ensure score is between 0-100 and format as two digits
  const clampedScore = Math.max(0, Math.min(100, score));
  const formattedScore = clampedScore.toString().padStart(2, '0');
  console.log('Health score test:', { original: score, clamped: clampedScore, formatted: formattedScore });
  return formattedScore;
};

// Test cases
export const testHealthScoreFormatting = () => {
  const testCases = [
    { input: 8, expected: '08' },
    { input: 83, expected: '83' },
    { input: 100, expected: '100' },
    { input: 0, expected: '00' },
    { input: -5, expected: '00' },
    { input: 150, expected: '100' },
    { input: 7.5, expected: '07' },
    { input: 99.9, expected: '99' }
  ];

  console.log('Testing health score formatting...');
  
  testCases.forEach(({ input, expected }) => {
    const result = formatHealthScore(input);
    const passed = result === expected;
    console.log(`${passed ? '✅' : '❌'} ${input} -> ${result} (expected: ${expected})`);
  });
};

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  (window as typeof window & { testHealthScoreFormatting: typeof testHealthScoreFormatting }).testHealthScoreFormatting = testHealthScoreFormatting;
} 