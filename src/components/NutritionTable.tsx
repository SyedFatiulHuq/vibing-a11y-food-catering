import type { NutritionalFacts } from '../types';

interface Props {
  facts: NutritionalFacts;
  caption?: string;
}

export function NutritionTable({ facts, caption = 'Nutrition facts' }: Props) {
  return (
    <section aria-labelledby="nutrition-heading">
      <h3 id="nutrition-heading" style={{ fontSize: '1.05rem', margin: '0 0 0.5rem' }}>
        {caption}
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="nutrition-table" aria-labelledby="nutrition-heading">
          <tbody>
            <tr>
              <th scope="row">Serving size</th>
              <td>{facts.servingSize}</td>
            </tr>
            <tr>
              <th scope="row">Calories</th>
              <td>{facts.calories}</td>
            </tr>
            <tr>
              <th scope="row">Total fat</th>
              <td>{facts.totalFatG} g</td>
            </tr>
            <tr>
              <th scope="row">Saturated fat</th>
              <td>{facts.saturatedFatG} g</td>
            </tr>
            <tr>
              <th scope="row">Cholesterol</th>
              <td>{facts.cholesterolMg} mg</td>
            </tr>
            <tr>
              <th scope="row">Sodium</th>
              <td>{facts.sodiumMg} mg</td>
            </tr>
            <tr>
              <th scope="row">Total carbohydrate</th>
              <td>{facts.totalCarbG} g</td>
            </tr>
            <tr>
              <th scope="row">Dietary fiber</th>
              <td>{facts.dietaryFiberG} g</td>
            </tr>
            <tr>
              <th scope="row">Total sugars</th>
              <td>{facts.totalSugarsG} g</td>
            </tr>
            <tr>
              <th scope="row">Protein</th>
              <td>{facts.proteinG} g</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
        Values are approximate; prepared in a home kitchen that may use shared equipment.
      </p>
    </section>
  );
}
