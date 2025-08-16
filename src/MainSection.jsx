import React, { useState } from "react";
import ReactPannellum, { getConfig } from "react-pannellum";
import Chatbot from "./component/About Us/chatbot/Chatbot";
import chatbotImg from "./images/chatbot-img.png"

const MainSection = ({ isMobile = false, stringClass = "" }) => {
  const [showChatbot, setShowChatbot] = useState(false);

  const handleClick = () => {
    console.log(getConfig());
  };

  const config = {
    autoRotate: -2,
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* 360° Viewer */}
      <ReactPannellum
        id="1"
        sceneId="firstScene"
        imageSource="https://pannellum.org/images/alma.jpg"
        config={config}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Test Button */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={handleClick}
      >
        Click me
      </div>

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
          transition: "all 0.3s ease",
          animation: "pulse 2s infinite",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <img
          loading="lazy"
          className="chatbot-image"
          src={chatbotImg}
          alt="chatbot"
          style={{ width: "30px", height: "30px" }}
        />
      </div>

      {/* Chatbot Panel */}
      {showChatbot && (
        <div
          className={`chatbot-panel ${
            stringClass.includes("darkContrast") ? "darkContrast" : ""
          }`}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "600px",
            backgroundColor: stringClass.includes("darkContrast")
              ? "#23232a"
              : "white",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transform: showChatbot ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {/* Chatbot Header */}
          <div
            style={{
              color: stringClass.includes("darkContrast")
                ? "#ffffff"
                : "#111827",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "12px 12px 0 0",
              borderBottom: `1px solid ${
                stringClass.includes("darkContrast") ? "#444" : "#abb5be5e"
              }`,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: stringClass.includes("darkContrast")
                  ? "#ffff00"
                  : "#111827",
              }}
            >
               AI Instructor
            </h3>
            <button
              onClick={() => setShowChatbot(false)}
              style={{
                background: "none",
                border: "none",
                color: stringClass.includes("darkContrast")
                  ? "#ffff00"
                  : "#111827",
                fontSize: "20px",
                cursor: "pointer",
                padding: "0",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  stringClass.includes("darkContrast")
                    ? "rgba(255, 255, 0, 0.1)"
                    : "rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ×
            </button>
          </div>

          {/* Chatbot Content */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              backgroundColor: stringClass.includes("darkContrast")
                ? "#23232a"
                : "white",
              color: stringClass.includes("darkContrast")
                ? "#ffffff"
                : "#111827",
            }}
          >
            <Chatbot />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSection;
