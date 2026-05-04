export function AboutPage() {
  return (
    <div className="container stack" style={{ gap: "1.25rem", maxWidth: 720 }}>
      <h1 className="font-display" style={{ margin: 0, fontSize: "2rem" }}>
        About Harvest Table
      </h1>
      <p style={{ margin: 0, fontSize: "1.05rem" }}>
        Harvest Table started as a weekend supper club in our home kitchen—long tables, borrowed chairs,
        and a chalkboard menu that changed with whatever looked best at the market. Neighbors asked if
        we could pack that same care into trays for birthdays, team offsites, and block parties. This
        little pickup service is the answer.
      </p>
      <p style={{ margin: 0, color: "var(--muted)" }}>
        Everything is cooked in small batches, cooled safely, and labeled for pickup windows so you can
        serve it confidently at room temperature or warm it gently at home. We focus on generous
        vegetarian options alongside hearty proteins because mixed crowds are the norm, not the
        exception.
      </p>
      <section aria-labelledby="values-heading">
        <h2 id="values-heading" className="font-display" style={{ fontSize: "1.35rem" }}>
          What we care about
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)" }}>
          <li>Transparent ingredients—we list what goes into each dish online.</li>
          <li>Pickup-only logistics so quality stays high and prices stay fair.</li>
          <li>Rotating weekday menus so regulars always have something new to try.</li>
        </ul>
      </section>
    </div>
  );
}
