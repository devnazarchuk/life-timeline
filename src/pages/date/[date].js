import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '/supabase.js';
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

  useEffect(() => {
    if (date) {
      fetchDateData(date);
    }
  }, [date]);

  const fetchDateData = async (date) => {
    const { data, error } = await supabase
      .from('dates')
      .select('*')
      .eq('date', date)
      .single();
  
    if (error) {
      console.error('Error fetching data: ', error.message);
      return;
    }
  
    if (data) {
      console.log('Fetched data: ', data);
      setTextEntries(data.textEntries || []);
      setImages(data.images || []);
      setVideos(data.videos || []);
      setMusicLinks(data.musicLinks || []);
    }
  };

  const saveToSupabase = async (dataToUpdate) => {
    const { data, error } = await supabase
      .from('dates')
      .upsert({ date, ...dataToUpdate }, { onConflict: ['date'] });
  
    if (error) {
      console.error('Error saving data: ', error.message);
    } else {
      console.log('Data successfully saved!');
    }
  };

  const addText = () => {
    const updatedEntries = [...textEntries, newText];
    saveToSupabase({ textEntries: updatedEntries });
    setTextEntries(updatedEntries);
    setNewText('');
  };

  const removeText = (index) => {
    const updatedEntries = textEntries.filter((_, i) => i !== index);
    saveToSupabase({ textEntries: updatedEntries });
    setTextEntries(updatedEntries);
  };

  const addImage = async () => {
    if (newImage) {
      const fileExt = newImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase
        .storage
        .from('images')
        .upload(fileName, newImage);

      if (data) {
        const filePath = data.path;
        const updatedImages = [...images, filePath];
        saveToSupabase({ images: updatedImages });
        setImages(updatedImages);
      } else {
        console.error('Error uploading image: ', error);
      }
      setNewImage(null);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    saveToSupabase({ images: updatedImages });
    setImages(updatedImages);
  };

  const addVideo = () => {
    const updatedVideos = [...videos, newVideo];
    saveToSupabase({ videos: updatedVideos });
    setVideos(updatedVideos);
    setNewVideo('');
  };

  const removeVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    saveToSupabase({ videos: updatedVideos });
    setVideos(updatedVideos);
  };

  const addMusic = () => {
    const updatedMusicLinks = [...musicLinks, newMusic];
    saveToSupabase({ musicLinks: updatedMusicLinks });
    setMusicLinks(updatedMusicLinks);
    setNewMusic('');
  };

  const removeMusic = (index) => {
    const updatedMusicLinks = musicLinks.filter((_, i) => i !== index);
    saveToSupabase({ musicLinks: updatedMusicLinks });
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
              <Image src={`${SUPABASE_URL}/storage/v1/object/public/images/${image}`} alt={`Image ${index + 1}`} width={100} height={100} />
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
