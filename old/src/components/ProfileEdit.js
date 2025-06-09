import React, { useState } from 'react';
import styles from '../styles/ProfileEdit.module.css';

const ProfileEdit = ({ user, onSave }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const handleSave = () => {
    const updatedUser = { ...user, username, bio, profilePicture };
    onSave(updatedUser);
  };

  return (
    <div className={styles.profileEditContainer}>
      <h2>Edit Profile</h2>
      <div className={styles.formGroup}>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label>Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label>Profile Picture</label>
        <input type="file" onChange={(e) => setProfilePicture(URL.createObjectURL(e.target.files[0]))} />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ProfileEdit;
