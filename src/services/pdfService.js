import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = async (elementId, fileName = 'wireframe-design.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Use a loading state if you have one, as this takes a second
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High scale for crisp text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Initialize PDF in A4 size
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Get A4 dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate scaling to fit the width of the page (with 10mm margins)
    const margin = 10;
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    // Add the image scaled to the page width
    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
    
    pdf.save(fileName);
  } catch (error) {
    console.error("PDF Export failed", error);
  }
};

export const exportToPNG = async (elementId, fileName = 'wireframe-design.png') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // Keep it high quality
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error("PNG Export failed", error);
  }
};

// ... existing PDF and PNG functions

export const exportToSVG = async (elementId, fileName = 'wireframe-design.svg') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    
    // Create an SVG wrapper for the captured image
    const svgContent = `
      <svg xmlns="http://www.w3.org/200.0/svg" width="${canvas.width}" height="${canvas.height}">
        <image href="${imgData}" width="${canvas.width}" height="${canvas.height}" />
      </svg>`;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("SVG Export failed", error);
  }
};