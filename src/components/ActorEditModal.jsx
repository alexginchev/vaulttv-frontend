import { useState } from 'react';
import { createActor, updateActor } from '../api/actorsApi';

function ActorEditModal({ actor, onClose, onSaved }) {
  const isEditing = Boolean(actor);
  const [form, setForm] = useState({
    name: actor?.name || '',
    born: actor?.born || '',
    nationality: actor?.nationality || '',
    bio: actor?.bio || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await updateActor(actor.id, form);
      } else {
        await createActor(form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data || 'Failed to save actor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit Actor' : 'Add Actor'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>Born
            <input name="born" value={form.born} onChange={handleChange} />
          </label>
          <label>Nationality
            <input name="nationality" value={form.nationality} onChange={handleChange} />
          </label>
          <label>Bio
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} />
          </label>
          {error && <p className="error">{String(error)}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActorEditModal;