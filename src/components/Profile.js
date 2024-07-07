import React, { useState } from 'react';
import styles from '../styles/Profile.module.css';
import Moment from './Moment';

const Profile = ({ user, onSaveMoments }) => {
  const [moments, setMoments] = useState(user.moments);

  const handleDeleteMoment = (id) => {
    const updatedMoments = moments.filter((moment) => moment.id !== id);
    setMoments(updatedMoments);
    onSaveMoments(updatedMoments);
  };

  const handleEditMoment = (id, newContent) => {
    const updatedMoments = moments.map((moment) =>
      moment.id === id ? { ...moment, content: newContent } : moment
    );
    setMoments(updatedMoments);
    onSaveMoments(updatedMoments);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img src={user.profilePicture} alt="Profile" className={styles.profilePicture} />
        <div className={styles.userInfo}>
          <h2 className={styles.username}>{user.username}</h2>
          <p className={styles.bio}>{user.bio}</p>
        </div>
      </div>
      <div className={styles.momentsSection}>
        <h3 className={styles.momentsTitle}>Moments</h3>
        {moments.map((moment, index) => (
          <Moment
            key={index}
            moment={moment}
            onDelete={handleDeleteMoment}
            onEdit={handleEditMoment}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
