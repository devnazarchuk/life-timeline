import React from 'react';
import { useRouter } from 'next/router';
import Profile from '../../components/Profile';
import styles from '../../styles/ProfilePage.module.css';

// Mock data
const userData = {
  username: 'john_doe',
  profilePicture: '/profile.jpg',
  bio: 'Loving life and living dreams.',
  moments: [
    { id: 1, type: 'text', content: 'Had a great day today!' },
    { id: 2, type: 'image', content: '/moment1.jpg' },
    { id: 3, type: 'video', content: '/moment2.mp4' },
    { id: 4, type: 'music', content: 'https://open.spotify.com/track/xyz' },
  ],
};

const UserProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;

  const user = userData; // Fetch user data based on the username

  const handleSaveMoments = (updatedMoments) => {
    // Update the moments in the user data
    userData.moments = updatedMoments;
  };

  return (
    <div className={styles.profilePageContainer}>
      <Profile user={user} onSaveMoments={handleSaveMoments} />
    </div>
  );
};

export default UserProfilePage;
