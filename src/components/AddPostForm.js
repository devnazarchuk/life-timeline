import React, { useState } from 'react';
import styles from '../styles/AddPostForm.module.css';

const AddPostForm = ({ onAddPost }) => {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPost({ text: postText, image: postImage });
    setPostText('');
    setPostImage('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        placeholder="Write your post here..."
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        className={styles.textarea}
        required
      ></textarea>
      <input
        type="url"
        placeholder="Image URL (optional)"
        value={postImage}
        onChange={(e) => setPostImage(e.target.value)}
        className={styles.imageInput}
      />
      <button type="submit" className={styles.addButton}>
        Add Posttt
      </button>
    </form>
  );
};

export default AddPostForm;
