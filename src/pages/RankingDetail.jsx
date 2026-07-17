import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { getRankingListById, reorderEntries, addRankingEntry, deleteRankingEntry } from '../api/rankingsApi';
import { useAuth } from '../context/AuthContext';
import SortableEntry from '../components/SortableEntry';

function RankingDetail() {
  const { listId } = useParams();
  const { isAdmin } = useAuth();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newEntryName, setNewEntryName] = useState('');
  const [newEntryScore, setNewEntryScore] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  const loadList = () => {
    getRankingListById(listId)
      .then((res) => setList(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadList();
  }, [listId]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = list.entries.findIndex((e) => e.id === active.id);
    const newIndex = list.entries.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(list.entries, oldIndex, newIndex);

    setList({ ...list, entries: reordered }); // optimistic update

    try {
      await reorderEntries(listId, reordered.map((e) => e.id));
    } catch (err) {
      console.error(err);
      loadList(); // revert to server state if the save failed
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntryName.trim()) return;

    await addRankingEntry(listId, {
      name: newEntryName,
      score: newEntryScore ? Number(newEntryScore) : null,
    });
    setNewEntryName('');
    setNewEntryScore('');
    loadList();
  };

  const handleDeleteEntry = async (entryId) => {
    await deleteRankingEntry(entryId);
    loadList();
  };

  if (loading) return <div className="page-loading">Loading...</div>;
  if (!list) return <div className="page-loading">List not found.</div>;

  return (
    <div className="ranking-detail-page">
      <h1>{list.title}</h1>
      {list.description && <p className="ranking-description">{list.description}</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={list.entries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="ranking-entries">
            {list.entries.map((entry, index) => (
              <SortableEntry
                key={entry.id}
                entry={entry}
                position={index + 1}
                isAdmin={isAdmin}
                onDelete={() => handleDeleteEntry(entry.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isAdmin && (
        <form onSubmit={handleAddEntry} className="add-entry-form">
          <input
            type="text"
            placeholder="Entry name"
            value={newEntryName}
            onChange={(e) => setNewEntryName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Score (optional)"
            value={newEntryScore}
            onChange={(e) => setNewEntryScore(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

export default RankingDetail;