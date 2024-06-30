import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { storage, auth, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

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
        const videoRef = ref(storage, "images/");
        const videoSnapshot = await listAll(videoRef);
        const videoUrls = await Promise.all(
          videoSnapshot.items.map((item) => getDownloadURL(item))
        );
        setVideos(videoUrls);
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
    link.href = videos[currentVideoIndex];
    link.download = videos[currentVideoIndex].split('/').pop();
    link.click();
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
      {!isAuthenticated ? (
        <button onClick={login} className="btn btn-primary login-btn">Login with Google</button>
      ) : (
        <>
          <div className="video-section">
            {videos.length > 0 && (
              <>
                <div className="video-container">
                  <video
                    ref={videoRef}
                    src={videos[currentVideoIndex]}
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
