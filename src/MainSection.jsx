import React, { useState } from "react";
import ReactPannellum from "react-pannellum";
import Chatbot from "./component/About Us/chatbot/Chatbot";
import chatbotImg from "./images/IAF_Logo.jpg";
import bgimg from "../src/img/cockpit2.png";
import bg2 from './images/IAF_banner.png'

const MainSection = ({ isMobile = false, stringClass = "" }) => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showPanorama, setShowPanorama] = useState(false);

  const config = {
    autoRotate: -2,
    pitch: 0,
    yaw: 0,
    hfov: 110,
  };

  const handleEnterPlane = () => {
    setShowPanorama(true);

    // Ensure panorama loads immediately
    setTimeout(() => {
      ReactPannellum.initScene("firstScene", {
        type: "equirectangular",
        panorama: bgimg,
        autoLoad: true,
        autoRotate: -2,
      });
    }, 100); // slight delay ensures div is mounted
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {!showPanorama ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${bg2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleEnterPlane}
            style={{
              padding: "10px 20px",
              fontSize: "20px",
              position: "relative",
              top: "11%",
              fontWeight: "400",
              backgroundColor: "#2966a3",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(41, 102, 163, 0.4)",
              transition: "all 0.3s ease",
            }}
          >
            Enter the Plane
          </button>
        </div>
      ) : (
        <>
          <ReactPannellum
            id="panorama"
            sceneId="firstScene"
            imageSource={bgimg}
            config={config}
            style={{ width: "100%", height: "100%" }}
          />

          <button
            onClick={() => setShowPanorama(false)}
            style={{
              position: "absolute",
              top: "30px",
              left: "30px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "rgba(255,255,255,0.9)",
              color: "#2966a3",
              border: "2px solid #2966a3",
              borderRadius: "25px",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            ← Back to View
          </button>
        </>
      )}

      {/* Chatbot Sticky Icon */}
      <div
        className="chatbot-sticky-icon"
        onClick={() => setShowChatbot(true)}
        style={{
          position: "fixed",
          bottom: isMobile ? "110px" : "100px",
          right: "30px",
          width: "60px",
          height: "60px",
          backgroundColor: "#2966a3",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
          zIndex: 1000,
        }}
      >
        <img
          src={chatbotImg}
          alt="chatbot"
          style={{ width: "60px", height: "60px", borderRadius: "30px" }}
        />
      </div>

      {/* Chatbot Panel */}
      {showChatbot && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "600px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default MainSection;
