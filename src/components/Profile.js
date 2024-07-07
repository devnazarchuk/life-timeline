import React, { useState } from 'react';
import styles from '../styles/Profile.module.css';
import Moment from './Moment';

const Profile = ({ user, onSaveMoments }) => {
  const [moments, setMoments] = useState(user.moments);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [currentMedia, setCurrentMedia] = useState(null);

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

  const handleAddPost = () => {
    if (newPostContent.trim() !== '') {
      const newPost = {
        id: Date.now(),
        content: newPostContent,
        media: currentMedia,
      };
      setPosts([...posts, newPost]);
      setNewPostContent('');
      setCurrentMedia(null); // Clear current media after adding post
    }
  };

  const handleDeletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  };

  const handleEditPost = (id, newContent) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, content: newContent } : post
    );
    setPosts(updatedPosts);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you can handle different types of media files (audio, image, video)
      setCurrentMedia({
        type: file.type.split('/')[0], // audio, image, video
        url: URL.createObjectURL(file), // Create object URL for preview
      });
    }
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
        {moments.map((moment) => (
          <Moment
            key={moment.id}
            moment={moment}
            onDelete={handleDeleteMoment}
            onEdit={handleEditMoment}
          />
        ))}
      </div>
      <div className={styles.postsSection}>
        <h3 className={styles.postsTitle}>Posts</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleAddPost(); }} className={styles.postForm}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Write a new post..."
            className={styles.postInput}
            required
          />
          <input type="file" onChange={handleMediaChange} accept="audio/*, image/*, video/*" className={styles.mediaInput} />
          {currentMedia && (
            <div className={styles.mediaPreview}>
              {currentMedia.type === 'audio' && (
                <audio controls>
                  <source src={currentMedia.url} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {currentMedia.type === 'image' && (
                <img src={currentMedia.url} alt="Preview" className={styles.imagePreview} />
              )}
              {currentMedia.type === 'video' && (
                <video controls>
                  <source src={currentMedia.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          <button type="submit" className={styles.postButton}>Add Post</button>
        </form>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <p className={styles.postText}>{post.content}</p>
            {post.media && (
              <div className={styles.postMedia}>
                {post.media.type === 'audio' && (
                  <audio controls>
                    <source src={post.media.url} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {post.media.type === 'image' && (
                  <img src={post.media.url} alt="Media" className={styles.postImage} />
                )}
                {post.media.type === 'video' && (
                  <video controls>
                    <source src={post.media.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
            <div className={styles.postActions}>
              <button onClick={() => handleEditPost(post.id, 'Updated content')} className={styles.postEditButton}>Edit</button>
              <button onClick={() => handleDeletePost(post.id)} className={styles.postDeleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
