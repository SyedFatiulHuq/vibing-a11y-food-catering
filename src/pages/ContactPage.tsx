import { FormEvent, useState } from 'react';
import { saveContactMessage } from '../lib/contactStore';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Catering question');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const entry = {
      id: `msg-${Date.now().toString(36)}`,
      sentAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      topic,
      message: message.trim(),
    };
    saveContactMessage(entry);
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--font-display)' }}>Contact</h1>
      <p className="lede">
        Reach the kitchen by phone or social, or send a note through the form — submissions are stored in this
        browser for the owner to review (demo behavior).
      </p>

      <section aria-labelledby="direct-heading" className="stack" style={{ marginBottom: '2rem' }}>
        <h2 id="direct-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: 0 }}>
          Direct lines
        </h2>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>
            Phone: <a href="tel:+15555550123">(555) 555-0123</a> · daily 9a–6p
          </li>
          <li>
            Instagram:{' '}
            <a href="https://www.instagram.com/homespunkitchen" target="_blank" rel="noreferrer">
              @homespunkitchen
            </a>
          </li>
          <li>
            Facebook:{' '}
            <a href="https://www.facebook.com/homespunkitchen" target="_blank" rel="noreferrer">
              HomeSpun Kitchen
            </a>
          </li>
        </ul>
      </section>

      <section aria-labelledby="form-heading">
        <h2 id="form-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: 0 }}>
          Send a message
        </h2>
        {sent ? (
          <p role="status" style={{ fontWeight: 600 }}>
            Thanks — your note was saved locally for follow-up.
          </p>
        ) : null}
        <form onSubmit={onSubmit} style={{ maxWidth: '36rem' }} noValidate>
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input
              id="c-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="c-topic">Topic</label>
            <select id="c-topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option>Catering question</option>
              <option>Dietary needs</option>
              <option>Pickup timing</option>
              <option>Partnerships</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-message">Message</label>
            <textarea id="c-message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">
            Save message
          </button>
        </form>
      </section>
    </div>
  );
}
