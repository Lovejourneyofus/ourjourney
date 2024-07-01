import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { storage, auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [title, setTitle] = useState("");
  const videoRef = useRef(null);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsAdmin(user.email === "epsilonclasher12@gmail.com");
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosCollection = collection(db, "videos");
        const videoSnapshot = await getDocs(videosCollection);
        const videoData = videoSnapshot.docs.map(doc => doc.data());
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videos[currentVideoIndex].url;
    link.download = videos[currentVideoIndex].url.split('/').pop();
    link.click();
  };

  const handleUpload = async () => {
    if (uploadFile && title) {
      const storageRef = ref(storage, `videos/${uploadFile.name}`);
      await uploadBytes(storageRef, uploadFile);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "videos"), {
        title: title,
        url: url,
        timestamp: new Date()
      });
      setUploadFile(null);
      setTitle("");
      alert("Video uploaded successfully!");
    } else {
      alert("Please provide a title and select a file to upload.");
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((error) => {
        console.log("Autoplay failed:", error);
      });
    }
  }, [currentVideoIndex]);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img src="logo.png" width="30" height="30" alt="Logo" />
          Video App
        </a>
      </nav>

      {!isAuthenticated ? (
        <button onClick={login} className="btn btn-primary login-btn">Login with Google</button>
      ) : (
        <>
          {isAdmin && (
            <div className="upload-section">
              <h3>Upload Video</h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="form-control mb-2"
              />
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="form-control mb-2"
              />
              <button onClick={handleUpload} className="btn btn-success">Upload</button>
            </div>
          )}
          <div className="video-section">
            {videos.length > 0 && (
              <>
                <div className="video-container">
                  <h4>{videos[currentVideoIndex].title}</h4>
                  <small>{new Date(videos[currentVideoIndex].timestamp.seconds * 1000).toLocaleString()}</small>
                  <video
                    ref={videoRef}
                    src={videos[currentVideoIndex].url}
                    controls
                    className="video-player"
                    autoPlay
                    muted={false}
                  />
                </div>
                <div className="controls">
                  <button onClick={handlePrevious} className="btn btn-info mx-2">Previous</button>
                  <button onClick={handleDownload} className="btn btn-warning mx-2">Download</button>
                  <button onClick={handleNext} className="btn btn-info mx-2">Next</button>
                </div>
              </>
            )}
          </div>
          <footer className="footer">
            <button onClick={logout} className="btn btn-secondary logout-btn">Logout</button>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
