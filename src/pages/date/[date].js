import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/DatePage.module.css';
import Image from 'next/image';

const DatePage = () => {
  const router = useRouter();
  const { date } = router.query;

  const [textEntries, setTextEntries] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [musicLinks, setMusicLinks] = useState([]);
  const [newText, setNewText] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [newVideo, setNewVideo] = useState('');
  const [newMusic, setNewMusic] = useState('');

  const addText = () => {
    setTextEntries([...textEntries, newText]);
    setNewText('');
  };

  const removeText = (index) => {
    const updatedEntries = textEntries.filter((_, i) => i !== index);
    setTextEntries(updatedEntries);
  };

  const addImage = () => {
    if (newImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result]);
      };
      reader.readAsDataURL(newImage);
      setNewImage(null);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const addVideo = () => {
    setVideos([...videos, newVideo]);
    setNewVideo('');
  };

  const removeVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    setVideos(updatedVideos);
  };

  const addMusic = () => {
    setMusicLinks([...musicLinks, newMusic]);
    setNewMusic('');
  };

  const removeMusic = (index) => {
    const updatedMusicLinks = musicLinks.filter((_, i) => i !== index);
    setMusicLinks(updatedMusicLinks);
  };

  return (
    <div className={styles.container}>
      <h1>Content for {date}</h1>

      <div className={styles.section}>
        <h2>Text</h2>
        <textarea value={newText} onChange={(e) => setNewText(e.target.value)} />
        <button onClick={addText}>Add Text</button>
        <ul>
          {textEntries.map((entry, index) => (
            <li key={index}>
              {entry} <button onClick={() => removeText(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Images</h2>
        <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
        <button onClick={addImage}>Add Image</button>
        <div className={styles.images}>
          {images.map((image, index) => (
            <div key={index} className={styles.imageItem}>
              <Image src={image} alt={`Image ${index + 1}`} width={100} height={100} />
              <button onClick={() => removeImage(index)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Videos</h2>
        <input
          type="text"
          placeholder="Video URL"
          value={newVideo}
          onChange={(e) => setNewVideo(e.target.value)}
        />
        <button onClick={addVideo}>Add Video</button>
        <ul>
          {videos.map((video, index) => (
            <li key={index}>
              <a href={video} target="_blank" rel="noopener noreferrer">
                {video}
              </a>{' '}
              <button onClick={() => removeVideo(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Music</h2>
        <input
          type="text"
          placeholder="Spotify URL"
          value={newMusic}
          onChange={(e) => setNewMusic(e.target.value)}
        />
        <button onClick={addMusic}>Add Music</button>
        <ul>
          {musicLinks.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>{' '}
              <button onClick={() => removeMusic(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatePage;
