import { useState } from 'react';
import { importActors } from '../api/actorsApi';

function ActorImportModal({ onClose, onImported }) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setJsonText(event.target.result);
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setError('');
    setResult(null);
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setError('Invalid JSON. Check the format and try again.');
      return;
    }

    if (!Array.isArray(parsed)) {
      setError('JSON must be an array of actor objects, e.g. [{ "name": "...", "nationality": "..." }]');
      return;
    }

    setImporting(true);
    try {
      const res = await importActors(parsed);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <h2>Bulk Import Actors</h2>
        <p className="modal-help">
          Paste a JSON array of actors, or upload a file. Expected shape per actor:{' '}
          <code>{`{ "name": "...", "born": "...", "nationality": "...", "bio": "..." }`}</code>
        </p>

        <input type="file" accept=".json,application/json" onChange={handleFileChange} />

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={10}
          placeholder='[{ "name": "Tom Hanks", "nationality": "American" }]'
          className="import-textarea"
        />

        {error && <p className="error">{String(error)}</p>}

        {result && (
          <div className="import-result">
            <p>✓ Imported: {result.imported}</p>
            <p>Skipped (duplicates or invalid): {result.skipped}</p>
            {result.skippedNames.length > 0 && (
              <p className="skipped-names">Skipped names: {result.skippedNames.join(', ')}</p>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>Close</button>
          <button type="button" onClick={handleImport} disabled={importing || !jsonText}>
            {importing ? 'Importing...' : 'Import'}
          </button>
          {result && (
            <button type="button" onClick={onImported} className="primary">Done</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActorImportModal;