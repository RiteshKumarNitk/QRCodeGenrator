import React, { useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [padding, setPadding] = useState(10);
  const [logo, setLogo] = useState(null);

  // Download PNG with padding and logo
  const handleDownloadPNG = () => {
    const qrCanvas = document.getElementById("qrcode-canvas");
    if (qrCanvas) {
      const newCanvas = document.createElement("canvas");
      const context = newCanvas.getContext("2d");
      const paddedSize = size + padding * 2;
      newCanvas.width = paddedSize;
      newCanvas.height = paddedSize;

      context.fillStyle = bgColor;
      context.fillRect(0, 0, paddedSize, paddedSize);
      context.drawImage(qrCanvas, padding, padding, size, size);

      if (logo) {
        const img = new Image();
        img.src = logo;
        img.onload = () => {
          const logoSize = size / 4;
          const logoX = paddedSize / 2 - logoSize / 2;
          const logoY = paddedSize / 2 - logoSize / 2;

          context.save();
          context.beginPath();
          context.arc(
            logoX + logoSize / 2,
            logoY + logoSize / 2,
            logoSize / 2,
            0,
            Math.PI * 2
          );
          context.closePath();
          context.clip();
          context.drawImage(img, logoX, logoY, logoSize, logoSize);
          context.restore();

          const pngUrl = newCanvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = "qrcode_with_logo.png";
          link.click();
        };
      } else {
        const pngUrl = newCanvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "qrcode.png";
        link.click();
      }
    }
  };

  // Download SVG
  const handleDownloadSVG = () => {
    const svg = document.getElementById("qrcode-svg");
    if (svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-blue-100 to-blue-200 p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          QR Code Generator
        </h1>
        {/* Input Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">Size</label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">BG Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-12 border rounded-lg"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">FG Color</label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-12 border rounded-lg"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Padding</label>
          <input
            type="number"
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* QR Code Display */}
        <div className="flex justify-center mb-6 bg-gray-50 p-4 rounded-lg">
          {text && (
            <>
              <QRCodeCanvas
                id="qrcode-canvas"
                value={text}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
              />
              <QRCodeSVG
                id="qrcode-svg"
                value={text}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                style={{ display: "none" }} // Hidden to avoid duplicate display
              />
            </>
          )}
        </div>
        {/* Download Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDownloadPNG}
            disabled={!text}
            className={`flex-1 p-3 rounded-lg font-medium text-white ${
              text ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Download PNG
          </button>
          <button
            onClick={handleDownloadSVG}
            disabled={!text}
            className={`flex-1 p-3 rounded-lg font-medium text-white ${
              text ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
