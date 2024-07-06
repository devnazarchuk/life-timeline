import React, { useState } from 'react';
import styles from '../styles/Moment.module.css';

const Moment = ({ moment, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(moment.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(moment.id, content);
    setIsEditing(false);
  };

  return (
    <div className={styles.moment}>
      {isEditing ? (
        <>
          {moment.type === 'text' && <textarea value={content} onChange={(e) => setContent(e.target.value)} />}
          {moment.type === 'image' && <input type="file" onChange={(e) => setContent(URL.createObjectURL(e.target.files[0]))} />}
          {moment.type === 'video' && <input type="file" onChange={(e) => setContent(URL.createObjectURL(e.target.files[0]))} />}
          {moment.type === 'music' && <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />}
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          {moment.type === 'text' && <p>{content}</p>}
          {moment.type === 'image' && <img src={content} alt="Moment" />}
          {moment.type === 'video' && <video src={content} controls />}
          {moment.type === 'music' && <a href={content}>Listen on Spotify</a>}
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => onDelete(moment.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default Moment;
