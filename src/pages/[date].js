import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Date.module.css';

const DatePage = () => {
  const router = useRouter();
  const { date } = router.query;
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [music, setMusic] = useState([]);
  const [newImage, setNewImage] = useState('');
  const [newVideo, setNewVideo] = useState('');
  const [newMusic, setNewMusic] = useState('');

  useEffect(() => {
    // Завантаження контенту з сервера або localStorage
    const savedContent = localStorage.getItem(`content-${date}`);
    const savedImages = JSON.parse(localStorage.getItem(`images-${date}`) || '[]');
    const savedVideos = JSON.parse(localStorage.getItem(`videos-${date}`) || '[]');
    const savedMusic = JSON.parse(localStorage.getItem(`music-${date}`) || '[]');

    if (savedContent) setContent(savedContent);
    if (savedImages) setImages(savedImages);
    if (savedVideos) setVideos(savedVideos);
    if (savedMusic) setMusic(savedMusic);
  }, [date]);

  const saveContent = () => {
    localStorage.setItem(`content-${date}`, content);
  };

  const addImage = () => {
    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    localStorage.setItem(`images-${date}`, JSON.stringify(updatedImages));
    setNewImage('');
  };

  const addVideo = () => {
    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    localStorage.setItem(`videos-${date}`, JSON.stringify(updatedVideos));
    setNewVideo('');
  };

  const addMusic = () => {
    const updatedMusic = [...music, newMusic];
    setMusic(updatedMusic);
    localStorage.setItem(`music-${date}`, JSON.stringify(updatedMusic));
    setNewMusic('');
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    localStorage.setItem(`images-${date}`, JSON.stringify(updatedImages));
  };

  const removeVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    setVideos(updatedVideos);
    localStorage.setItem(`videos-${date}`, JSON.stringify(updatedVideos));
  };

  const removeMusic = (index) => {
    const updatedMusic = music.filter((_, i) => i !== index);
    setMusic(updatedMusic);
    localStorage.setItem(`music-${date}`, JSON.stringify(updatedMusic));
  };

  return (
    <div className={styles.container}>
      <h1>Content for {date}</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add your content here..."
      ></textarea>
      <button onClick={saveContent}>Save</button>

      <h2>Images</h2>
      <input
        type="text"
        value={newImage}
        onChange={(e) => setNewImage(e.target.value)}
        placeholder="Image URL"
      />
      <button onClick={addImage}>Add Image</button>
      <div className={styles.images}>
        {images.map((image, index) => (
          <div key={index} className={styles.imageItem}>
            <img src={image} alt={`Image ${index + 1}`} />
            <button onClick={() => removeImage(index)}>Remove</button>
          </div>
        ))}
      </div>

      <h2>Videos</h2>
      <input
        type="text"
        value={newVideo}
        onChange={(e) => setNewVideo(e.target.value)}
        placeholder="Video URL"
      />
      <button onClick={addVideo}>Add Video</button>
      <div className={styles.videos}>
        {videos.map((video, index) => (
          <div key={index} className={styles.videoItem}>
            <iframe src={video} frameBorder="0" allowFullScreen></iframe>
            <button onClick={() => removeVideo(index)}>Remove</button>
          </div>
        ))}
      </div>

      <h2>Music</h2>
      <input
        type="text"
        value={newMusic}
        onChange={(e) => setNewMusic(e.target.value)}
        placeholder="Music URL"
      />
      <button onClick={addMusic}>Add Music</button>
      <div className={styles.music}>
        {music.map((track, index) => (
          <div key={index} className={styles.musicItem}>
            <iframe src={`https://open.spotify.com/embed/track/${track}`} frameBorder="0" allow="encrypted-media"></iframe>
            <button onClick={() => removeMusic(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatePage;
