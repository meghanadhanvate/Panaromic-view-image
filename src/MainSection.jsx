import React from "react";
import ReactPannellum, { getConfig } from "react-pannellum";

const MainSection = () => {
  const handleClick = () => {
    console.log(getConfig());
  };

  const config = {
    autoRotate: -2
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactPannellum
        id="1"
        sceneId="firstScene"
        imageSource="https://pannellum.org/images/alma.jpg"
        config={config}
        style={{ width: "100%", height: "100%" }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000
        }}
        onClick={handleClick}
      >
        Click me
      </div>
    </div>
  );
};

export default MainSection;
