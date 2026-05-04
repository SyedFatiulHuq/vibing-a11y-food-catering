import type { NutritionFacts } from "../types";

type Props = { facts: NutritionFacts };

export function NutritionTable({ facts }: Props) {
  const rows: { label: string; value: string; emphasis?: boolean }[] = [
    { label: "Serving size", value: facts.servingSize, emphasis: true },
    { label: "Calories", value: String(facts.calories), emphasis: true },
    { label: "Total Fat", value: `${facts.totalFatG}g` },
    { label: "Saturated Fat", value: `${facts.saturatedFatG}g` },
    { label: "Cholesterol", value: `${facts.cholesterolMg}mg` },
    { label: "Sodium", value: `${facts.sodiumMg}mg` },
    { label: "Total Carbohydrate", value: `${facts.totalCarbG}g` },
    { label: "Dietary Fiber", value: `${facts.dietaryFiberG}g` },
    { label: "Total Sugars", value: `${facts.totalSugarsG}g` },
    { label: "Protein", value: `${facts.proteinG}g` },
  ];

  return (
    <section aria-labelledby="nutrition-heading">
      <h3 id="nutrition-heading" className="font-display" style={{ marginTop: 0 }}>
        Nutrition facts
      </h3>
      <p style={{ marginTop: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
        Typical values per portion. Homemade batches may vary slightly.
      </p>
      <table
        style={{
          border: "2px solid var(--ink)",
          borderRadius: "var(--radius-sm)",
          borderCollapse: "collapse",
          overflow: "hidden",
          width: "100%",
          maxWidth: 360,
        }}
      >
        <caption className="sr-only">Nutrition facts per portion</caption>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.label}
              style={{
                borderTop: "1px solid var(--line)",
                background: r.emphasis ? "#f7f2ea" : "#fff",
              }}
            >
              <th
                scope="row"
                style={{
                  textAlign: "left",
                  padding: "0.45rem 0.65rem",
                  fontWeight: r.emphasis ? 700 : 500,
                }}
              >
                {r.label}
              </th>
              <td
                style={{
                  textAlign: "right",
                  padding: "0.45rem 0.65rem",
                  fontWeight: r.emphasis ? 700 : 400,
                }}
              >
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
