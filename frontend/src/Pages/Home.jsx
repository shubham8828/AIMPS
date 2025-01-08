import Cards from "../Component/Cards.jsx";
import Chart from "../Component/Chart.jsx";
import LineChart from "../Component/LineChart.jsx";
import PieChart from "../Component/PieChart.jsx";
import Typing from "../Component/Typing.jsx";
import html2canvas from "html2canvas";
import React, { useEffect, useState } from "react";
import Download from '../asset/download.png';
import axios from "axios";
import jsPDF from 'jspdf';
const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Start with `null` instead of an empty object

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get("http://localhost:4000/api/user", { headers })
      .then((response) => {
        const { user } = response.data;
        if (user.role === "root" || user.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const reportDownload = () => {
    const element = document.querySelector(".home-container");

    if (element) {
      html2canvas(element, {
        scale: 2, // Increase resolution for better quality
        useCORS: true, // Handle cross-origin issues for external assets
      }).then((canvas) => {
        // const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // const imgHeightInPDF = (pdfWidth * canvasHeight) / canvasWidth;
        let currentHeight = 0;

        // Loop through the height of the canvas to ensure elements fit fully on pages
        while (currentHeight < canvasHeight) {
          const pageHeightInCanvas = (pdfHeight * canvasWidth) / pdfWidth;

          const croppedCanvas = document.createElement("canvas");
          croppedCanvas.width = canvasWidth;
          croppedCanvas.height = pageHeightInCanvas;

          const context = croppedCanvas.getContext("2d");

          // Draw only the part that fits on one page
          context.drawImage(
            canvas,
            0,
            currentHeight,
            canvasWidth,
            pageHeightInCanvas,
            0,
            0,
            canvasWidth,
            pageHeightInCanvas
          );

          const croppedImgData = croppedCanvas.toDataURL("image/png");

          if (currentHeight > 0) pdf.addPage();
          pdf.addImage(croppedImgData, "PNG", 0, 0, pdfWidth, pdfHeight);

          // Move to the next page
          currentHeight += pageHeightInCanvas;

          // Adjust to avoid splitting elements (snap to an element boundary if needed)
          const nextElementBoundary = Math.floor(currentHeight);
          currentHeight = nextElementBoundary;
        }
        pdf.save("Report.pdf");
      });
    }
  };

  return (
    <div className="home-container">
      <Typing />
      <Cards isAdmin={isAdmin} />
      {isAdmin && (
        <>
          <LineChart />
          <PieChart />
        </>
      )}
      <Chart/>

      <button
        className="report-download-btn"
        onClick={reportDownload}
      >
        <img src={Download} className="report-download-btn-icon" />
      </button>
    </div>
  );
};

export default Home;
