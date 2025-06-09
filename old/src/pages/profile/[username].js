import React from 'react';
import { useRouter } from 'next/router';
import Profile from '../../components/Profile';
import styles from '../../styles/Profile.module.css';

// Mock data
const userData = {
  username: 'Ryan Gosling',
  profilePicture: '/profile.jpg',
  bio: "I think the best way to prepare for anything is to immerse yourself in it, whether it's playing a role or just living life.",
  moments: [
    { id: 1, type: 'text', content: 'Had a great day today!' },
    { id: 2, type: 'image', content: '/moment1.jpg' },
    { id: 3, type: 'image', content: '/moment2.jpg' },
    { id: 4, type: 'video', content: '/moment.mp4' },
    { id: 5, type: 'music', content: 'https://open.spotify.com/track/1u1ATklwZesAvq1whHsI8Z?si=21305373e5884f9c' },

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
