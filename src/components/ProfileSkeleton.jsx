function ProfileSkeleton() {
  return (
    <div className="profile-page">
      <div className="profile-top">
        <div className="skeleton skeleton-avatar" />
        <div className="skeleton-lines">
          <div className="skeleton skeleton-line" style={{ width: '160px' }} />
          <div className="skeleton skeleton-line" style={{ width: '220px' }} />
        </div>
      </div>
      <div className="profile-sections">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </div>
    </div>
  );
}

export default ProfileSkeleton;