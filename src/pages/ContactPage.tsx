import { FormEvent, useState } from "react";
import { saveContactMessage } from "../lib/invoices";
import type { ContactSubmission } from "../types";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Catering question");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submission: ContactSubmission = {
      id: `MSG-${Date.now()}`,
      createdAtIso: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      topic,
      message: message.trim(),
    };
    saveContactMessage(submission);
    setSent(true);
    setMessage("");
  };

  return (
    <div className="container stack" style={{ gap: "1.5rem" }}>
      <header className="stack" style={{ gap: "0.5rem", maxWidth: 720 }}>
        <h1 className="font-display" style={{ margin: 0, fontSize: "2rem" }}>
          Contact
        </h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Reach the kitchen for custom pickups, dietary questions, or partnership ideas. Messages submitted
          through the form are stored locally in this browser for the owner to review later.
        </p>
      </header>

      <section aria-labelledby="direct-heading" className="card" style={{ padding: "1.25rem", maxWidth: 720 }}>
        <h2 id="direct-heading" className="font-display" style={{ fontSize: "1.25rem", marginTop: 0 }}>
          Call or follow along
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7 }}>
          <li>
            Phone: <a href="tel:+15555550123">(555) 555-0123</a> · daily 9a–6p
          </li>
          <li>
            Instagram:{" "}
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              @harvesttablekitchen
            </a>{" "}
            (placeholder)
          </li>
          <li>
            Facebook:{" "}
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              Harvest Table Community
            </a>{" "}
            (placeholder)
          </li>
        </ul>
      </section>

      <section aria-labelledby="form-heading" className="card" style={{ padding: "1.25rem", maxWidth: 720 }}>
        <h2 id="form-heading" className="font-display" style={{ fontSize: "1.25rem", marginTop: 0 }}>
          Send a note
        </h2>
        {sent ? (
          <p role="status" style={{ color: "var(--success)", fontWeight: 600 }}>
            Thanks — your message was saved for the owner on this device.
          </p>
        ) : null}
        <form className="stack" style={{ gap: "1rem", marginTop: "1rem" }} onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="c-topic">Topic</label>
            <select id="c-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option>Catering question</option>
              <option>Dietary accommodations</option>
              <option>Pickup logistics</option>
              <option>Something else</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-msg">Message</label>
            <textarea id="c-msg" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">
            Send message
          </button>
        </form>
      </section>
    </div>
  );
}
