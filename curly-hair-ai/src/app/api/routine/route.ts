import { NextRequest, NextResponse } from 'next/server';
import anthropic from '@/lib/anthropic';
import { HairAnalysis, HairRoutine } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { analysis }: { analysis: HairAnalysis } = await request.json();
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Hair analysis is required' },
        { status: 400 }
      );
    }

    const prompt = `Based on this hair analysis:
    
Curl Pattern: ${analysis.curlPattern.assessment} (${analysis.curlPattern.evidence})
Porosity: ${analysis.porosity.assessment} (${analysis.porosity.evidence})
Density: ${analysis.density.assessment}
Health Score: ${analysis.healthScore.score}/10
Top Pain Points: ${analysis.topPainPoints.join(', ')}
Specific Issues: ${analysis.specificIssues.map(issue => `${issue.issue} (${issue.severity})`).join(', ')}

Create a comprehensive curly hair routine addressing their top 3 pain points:
1. ${analysis.topPainPoints[0] || 'General curl care'}
2. ${analysis.topPainPoints[1] || 'Moisture retention'}
3. ${analysis.topPainPoints[2] || 'Curl definition'}

Format as JSON:
{
  "routine": {
    "washDay": {
      "frequency": "2-3 times per week",
      "steps": [
        {
          "step": "Pre-poo treatment",
          "product": "Oil-based treatment (coconut, argan, or jojoba oil)",
          "why": "Protects hair from harsh cleansing, especially important for high porosity hair",
          "source": "Trichology International Journal 2023"
        },
        {
          "step": "Clarifying shampoo",
          "product": "Sulfate-free clarifying shampoo",
          "why": "Removes buildup without stripping natural oils from ${analysis.porosity.assessment.toLowerCase()} porosity hair",
          "source": "International Journal of Cosmetic Science"
        },
        {
          "step": "Deep conditioning",
          "product": "Protein-moisture balanced deep conditioner",
          "why": "Addresses ${analysis.specificIssues.map(i => i.issue.toLowerCase()).join(' and ')} issues",
          "source": "Journal of Cosmetic Dermatology 2022"
        }
      ]
    },
    "daily": {
      "steps": [
        {
          "step": "Refresh curls",
          "product": "Leave-in conditioner + curl cream",
          "why": "Maintains curl definition and moisture for ${analysis.curlPattern.assessment} curls",
          "source": "Curly Hair Science Institute"
        },
        {
          "step": "Seal ends",
          "product": "Light oil or serum",
          "why": "Prevents moisture loss, especially important for ${analysis.porosity.assessment.toLowerCase()} porosity hair",
          "source": "Hair Research Journal 2023"
        }
      ]
    },
    "weekly": {
      "steps": [
        {
          "step": "Protein treatment",
          "product": "Light protein treatment",
          "why": "Strengthens hair structure, addresses damage concerns",
          "source": "Journal of Applied Cosmetology"
        }
      ]
    }
  },
  "productCategories": [
    {
      "category": "Leave-in Conditioner",
      "why": "Essential for ${analysis.porosity.assessment.toLowerCase()} porosity hair to maintain moisture",
      "ingredients": ["Glycerin", "Ceramides", "Hyaluronic acid"],
      "source": "International Journal of Cosmetic Science"
    },
    {
      "category": "Curl Defining Cream",
      "why": "Enhances ${analysis.curlPattern.assessment} curl pattern definition",
      "ingredients": ["Flax seed gel", "Aloe vera", "Shea butter"],
      "source": "Cosmetic Science Society Research"
    },
    {
      "category": "Deep Conditioner",
      "why": "Repairs damage and improves hair health score from ${analysis.healthScore.score}/10",
      "ingredients": ["Hydrolyzed proteins", "Natural butters", "Amino acids"],
      "source": "Journal of Cosmetic Dermatology"
    }
  ],
  "techniques": [
    {
      "name": "Praying hands method",
      "description": "Smooth product through hair with prayer-like hand motion",
      "benefit": "Reduces frizz and maintains curl clumps for ${analysis.curlPattern.assessment} curls",
      "source": "Curly Hair Method Guidelines"
    },
    {
      "name": "Plopping",
      "description": "Wrap wet curls in microfiber towel for 15-20 minutes",
      "benefit": "Enhances curl formation and reduces drying time",
      "source": "Dr. Sarah Johnson, Curly Hair Research"
    },
    {
      "name": "Scrunching",
      "description": "Gently squeeze curls upward to encourage curl formation",
      "benefit": "Activates natural curl pattern and removes excess water",
      "source": "International Curl Care Association"
    }
  ]
}

Include real scientific sources and specific recommendations based on their ${analysis.curlPattern.assessment} curl pattern, ${analysis.porosity.assessment.toLowerCase()} porosity, and ${analysis.density.assessment.toLowerCase()} density. Focus on addressing their specific issues: ${analysis.specificIssues.map(i => i.issue).join(', ')}.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const routine: HairRoutine = JSON.parse(jsonMatch[0]);
    
    return NextResponse.json({ routine });
  } catch (error) {
    console.error('Routine generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate routine. Please try again.' },
      { status: 500 }
    );
  }
}