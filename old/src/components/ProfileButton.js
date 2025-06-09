import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/ProfileButton.module.css';

const ProfileButton = ({ profilePicture, username }) => {
  const router = useRouter();

  const goToProfile = () => {
    router.push(`/profile/${username}`);
  };

  return (
    <div className={styles.profileButtonContainer} onClick={goToProfile}>
      <img src={profilePicture} alt="Profile" className={styles.profilePicture} />
    </div>
  );
};

export default ProfileButton;
