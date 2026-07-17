import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMedia, getMediaById, updateMedia, uploadPoster, uploadBackdrop } from '../api/mediaApi';

const emptyForm = {
  title: '', type: 'movie', year: '', rating: '', description: '',
  director: '', genres: '', seasons: '', runtime: '', network: '', status: '',
};

function MediaForm() {
  const { id } = useParams(); // undefined when creating new
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [posterFile, setPosterFile] = useState(null);
  const [backdropFile, setBackdropFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getMediaById(id).then((res) => {
        const m = res.data;
        setForm({
          title: m.title, type: m.type, year: m.year || '', rating: m.rating || '',
          description: m.description || '', director: m.director || '',
          genres: m.genres.join(', '), seasons: m.seasons || '', runtime: m.runtime || '',
          network: m.network || '', status: m.status || '',
        });
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
    };

    try {
      let mediaId = id;
      if (isEditing) {
        await updateMedia(id, payload);
      } else {
        const res = await createMedia(payload);
        mediaId = res.data.id;
      }

      if (posterFile) await uploadPoster(mediaId, posterFile);
      if (backdropFile) await uploadBackdrop(mediaId, backdropFile);

      navigate(`/media/${mediaId}`);
    } catch (err) {
      setError(err.response?.data || 'Failed to save media.');
    } finally {
      setSaving(false);
    }
  };

  const isShow = form.type === 'show';

  return (
    <div className="admin-form-page">
      <h1>{isEditing ? 'Edit' : 'Add'} Media</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="movie">Movie</option>
            <option value="show">Show</option>
          </select>
        </label>

        <label>Year
          <input name="year" value={form.year} onChange={handleChange} />
        </label>

        <label>Rating
          <input name="rating" value={form.rating} onChange={handleChange} />
        </label>

        <label>Director
          <input name="director" value={form.director} onChange={handleChange} />
        </label>

        <label>Genres (comma-separated)
          <input name="genres" value={form.genres} onChange={handleChange} placeholder="Drama, Thriller" />
        </label>

        <label>Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </label>

        {isShow && (
          <>
            <label>Seasons
              <input name="seasons" value={form.seasons} onChange={handleChange} />
            </label>
            <label>Runtime
              <input name="runtime" value={form.runtime} onChange={handleChange} />
            </label>
            <label>Network
              <input name="network" value={form.network} onChange={handleChange} />
            </label>
            <label>Status
              <input name="status" value={form.status} onChange={handleChange} placeholder="Ongoing / Ended" />
            </label>
          </>
        )}

        <label>Poster image
          <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files[0])} />
        </label>

        <label>Backdrop image
          <input type="file" accept="image/*" onChange={(e) => setBackdropFile(e.target.files[0])} />
        </label>

        {error && <p className="error">{String(error)}</p>}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Media'}
        </button>
      </form>
    </div>
  );
}

export default MediaForm;