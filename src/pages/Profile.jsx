import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile, changePassword, uploadAvatar } from '../api/usersApi';
import { getMyWatchlist } from '../api/watchlistApi';
import { applyTheme } from '../utils/theme';
import MediaCard from '../components/MediaCard';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState('');
  const [theme, setTheme] = useState('dark');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [watchlist, setWatchlist] = useState([]);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const loadProfile = () => {
    getMyProfile().then((res) => {
      setProfile(res.data);
      setHandle(res.data.handle || '');
      setTheme(res.data.themePreference);
      applyTheme(res.data.themePreference);
    });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMyProfile(),
      getMyWatchlist(),
    ]).then(([profileRes, watchlistRes]) => {
      setProfile(profileRes.data);
      setHandle(profileRes.data.handle || '');
      setTheme(profileRes.data.themePreference);
      applyTheme(profileRes.data.themePreference);
      setWatchlist(watchlistRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const res = await uploadAvatar(file);
      setProfile(res.data);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const res = await updateMyProfile({ handle, themePreference: theme });
      setProfile(res.data);
      applyTheme(theme);
      setProfileMsg('Saved.');
    } catch (err) {
      setProfileMsg(err.response?.data || 'Failed to save.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMsg('');
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMsg('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg(err.response?.data || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading || !profile) return <div className="page-loading">Loading...</div>;

  const apiRoot = import.meta.env.VITE_API_URL.replace('/api', '');
  const avatarSrc = profile.profilePictureUrl ? `${apiRoot}${profile.profilePictureUrl}` : null;

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>

      <div className="profile-top">
        <div className="profile-avatar-block">
          {avatarSrc ? (
            <img src={avatarSrc} alt={profile.username} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">{profile.username[0]?.toUpperCase()}</div>
          )}
          <label className="avatar-upload-btn">
            {avatarUploading ? 'Uploading...' : 'Change photo'}
            <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
          </label>
        </div>

        <div className="profile-basic-info">
          <p className="profile-username">{profile.username}</p>
          <p className="profile-email">{profile.email}</p>
          <p className="profile-role">{profile.role}</p>
        </div>
      </div>

      <div className="profile-sections">
        <form onSubmit={handleProfileSave} className="profile-section">
          <h2>Settings</h2>
          <label>Handle
            <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourname" />
          </label>
          <label>Appearance
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          {profileMsg && <p className={profileMsg === 'Saved.' ? 'success' : 'error'}>{String(profileMsg)}</p>}
          <button type="submit" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save'}</button>
        </form>

        <form onSubmit={handlePasswordChange} className="profile-section">
          <h2>Change Password</h2>
          <label>Current Password
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </label>
          <label>New Password
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </label>
          {passwordMsg && <p className={passwordMsg === 'Password updated.' ? 'success' : 'error'}>{String(passwordMsg)}</p>}
          <button type="submit" disabled={savingPassword}>{savingPassword ? 'Saving...' : 'Update Password'}</button>
        </form>
      </div>

      <div className="profile-watchlist">
        <h2>My Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="page-loading">Your watchlist is empty.</p>
        ) : (
          <div className="watchlist-grid">
            {watchlist.map((item) => (
              <MediaCard
                key={item.id}
                media={{ id: item.mediaId, title: item.mediaTitle, posterUrl: item.posterUrl }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;