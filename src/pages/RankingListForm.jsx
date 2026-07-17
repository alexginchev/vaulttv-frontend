import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRankingList } from '../api/rankingsApi';

function RankingListForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createRankingList({ title, description, criteria });
    navigate(`/rankings/${res.data.id}`);
  };

  return (
    <div className="admin-form-page">
      <h1>New Ranking List</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>Description
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>Criteria
          <input value={criteria} onChange={(e) => setCriteria(e.target.value)} placeholder="e.g. Score, Tier" />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default RankingListForm;