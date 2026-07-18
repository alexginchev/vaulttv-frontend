import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notificationsApi';

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const loadUnreadCount = () => {
    getUnreadCount().then((res) => setUnreadCount(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => {
    if (!open) {
      getNotifications().then((res) => setNotifications(res.data)).catch(() => {});
    }
    setOpen(!open);
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    loadUnreadCount();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <div className="notification-bell" ref={ref}>
      <button onClick={toggleOpen} className="bell-btn">
        🔔
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="mark-all-btn">Mark all read</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="notification-empty">No notifications.</p>
          ) : (
            <div className="notification-list">
              {notifications.map((n) => (
                <div key={n.id} className={`notification-item ${n.isRead ? '' : 'unread'}`}>
                  <p>{n.message}</p>
                  <div className="notification-item-footer">
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                    {!n.isRead && (
                      <button onClick={() => handleMarkRead(n.id)}>Mark read</button>
                    )}
                    {n.type === 'IncompleteActor' && n.relatedEntityId && (
                      <Link to="/admin/actors" onClick={() => setOpen(false)}>View</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;