import { NextRequest, NextResponse } from 'next/server';
import anthropic from '@/lib/anthropic';
import { HairAnalysis } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { images, isSelfie = false } = await request.json();
    
    // Support both single selfie and multiple photos
    const requiredImages = isSelfie ? 1 : 4;
    if (!images || images.length !== requiredImages) {
      return NextResponse.json(
        { error: `Exactly ${requiredImages} image${requiredImages > 1 ? 's' : ''} required` },
        { status: 400 }
      );
    }

    const basePrompt = isSelfie 
      ? `You are the world's leading curly hair expert analyzing a front-facing selfie photo of someone's hair:
- Front selfie view: [IMAGE]

Based on this single front-facing selfie photo, provide your best assessment of their hair. While some aspects may have lower confidence due to limited angles, provide helpful analysis based on what you can observe.`
      : `You are the world's leading curly hair expert analyzing 4 photos of someone's hair:
- Front view: [IMAGE 1]
- Back view: [IMAGE 2] 
- Top view: [IMAGE 3]
- Close-up: [IMAGE 4]`;

    const prompt = `${basePrompt}

Provide a detailed analysis in this EXACT JSON format:

{
  "curlPattern": {
    "assessment": "3B",
    "confidence": 0.85,
    "evidence": "Clear spiral curls with defined ringlets",
    "alternatives": ["3A", "3C"]
  },
  "porosity": {
    "assessment": "High",
    "confidence": 0.65,
    "evidence": "Hair appears dry with visible cuticle damage",
    "testSuggestions": ["Float test", "Spray bottle test"]
  },
  "density": {
    "assessment": "Medium",
    "confidence": 0.90,
    "evidence": "Moderate hair coverage, scalp barely visible"
  },
  "healthScore": {
    "score": 83,
    "confidence": 0.80,
    "factors": ["Some frizz", "Moderate shine", "Defined curl pattern"]
  },
  "specificIssues": [
    {
      "issue": "Frizz",
      "severity": "Moderate",
      "confidence": 0.75,
      "evidence": "Flyaways visible in front and top views"
    },
    {
      "issue": "Dryness",
      "severity": "High", 
      "confidence": 0.80,
      "evidence": "Matte appearance, lack of shine"
    }
  ],
  "topPainPoints": [
    "Managing frizz in humidity",
    "Maintaining curl definition",
    "Reducing dryness and brittleness"
  ]
}

Be specific, encouraging, and focus on actionable insights. Analyze curl patterns (1A-4C), porosity levels (low/medium/high), density, health indicators, and specific issues visible in the photos.

IMPORTANT: The healthScore should be a number between 0-100 (not 1-10). Use the full range:
- 0-20: Very poor health (severe damage, breakage, extreme dryness)
- 21-40: Poor health (significant damage, high frizz, poor definition)
- 41-60: Fair health (some damage, moderate frizz, basic definition)
- 61-80: Good health (minimal damage, low frizz, good definition)
- 81-100: Excellent health (healthy shine, defined curls, minimal issues)

Always provide a specific number between 0-100, not a range or decimal.`;

    const imageMessages = images.map((image: string) => ({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg",
        data: image
      }
    }));

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            ...imageMessages
          ]
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const analysis: HairAnalysis = JSON.parse(jsonMatch[0]);
    
    // Validate and normalize health score to ensure it's between 0-100
    if (analysis.healthScore && typeof analysis.healthScore.score === 'number') {
      analysis.healthScore.score = Math.max(0, Math.min(100, analysis.healthScore.score));
      console.log('API - Health score normalized:', analysis.healthScore.score);
    }
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze hair photos. Please try again.' },
      { status: 500 }
    );
  }
}