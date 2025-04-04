# Therapy Offerings Data Structure

This directory contains the structured data for the various therapy offerings provided by Anne Yvonne Therapist.

## Files

- `offerings.json`: The main data file containing all the therapy types and their details.
- `types.ts`: TypeScript type definitions for the data structure.
- `utils.ts`: Helper functions to easily access and work with the therapy offerings data.

## Structure

The data is organized into three main therapy types:

1. **Couple Therapy** (id: `couple`)
   - Complete therapy program with options
   - NeuroTribu option for neurodivergent individuals
   - VIT (Very Important Therapy) option for flexible sessions

2. **Individual Therapy** (id: `individual`)
   - Multiple formulas: Mini Compact, Compact, Relax, and VIT Luxus

3. **VIT À La Carte** (id: `vit-a-la-carte`)
   - Flexible therapy sessions for "lovers of love"

## Usage

You can import the utility functions to access the data in your components:

```typescript
import { getTherapyTypeById, getAllTherapyTypes } from '@/data/therapyOfferings/utils';

// Get all therapy types
const allTherapies = getAllTherapyTypes();

// Get a specific therapy type
const coupleTherapy = getTherapyTypeById('couple');

// Access specific options or formulas
import { getTherapyOption, getIndividualTherapyFormula } from '@/data/therapyOfferings/utils';

const neuroTribuOption = getTherapyOption('couple', 'neurotribu');
const compactFormula = getIndividualTherapyFormula('compact');
```

## Example Component Usage

```tsx
import { getTherapyTypeById } from '@/data/therapyOfferings/utils';
import { TherapyType } from '@/data/therapyOfferings/types';

export default function TherapyPage() {
  const coupleTherapy: TherapyType | undefined = getTherapyTypeById('couple');
  
  if (!coupleTherapy) return <div>Therapy not found</div>;
  
  return (
    <div>
      <h1>{coupleTherapy.title}</h1>
      <h2>{coupleTherapy.subtitle}</h2>
      <p>{coupleTherapy.description}</p>
      
      {/* Display themes */}
      <div>
        <h3>Themes d'exploration:</h3>
        <ul>
          {coupleTherapy.themes.map((theme, index) => (
            <li key={index}>
              <strong>{theme.title}:</strong> {theme.description}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Continue with other sections... */}
    </div>
  );
}
```
