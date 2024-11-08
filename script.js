document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;

  async function downloadPDF() {
    const doc = new jsPDF();

    // Load the logo once and store it as a Base64 image
    const logo = await loadLogo("logo.png");

    // Retrieve form field values for the custom PDF title
    const customerName = document.getElementById("customerName").value || "Customer";
    const city = document.getElementById("city").value || "City";
    const area = document.getElementById("area").value || "Area";
    const floors = document.getElementById("floors").value || "Floors";
    const model = document.getElementById("model").value || "Model";
    const pdfTitle = `${customerName}-OTF-${city}-${area}-${floors}-${model}.pdf`;

    // Helper function to add the logo to the current page
    function addLogoToPage() {
      if (logo) {
        doc.addImage(logo, "PNG", 10, 10, 30, 30); // Adjust position and size as needed
      }
    }

    // Add the logo to the first page
    addLogoToPage();

    // Initial Y position for content below the logo
    let yPosition = 50; // Start below the logo

    // Add title and form data to PDF
    doc.setFontSize(16);
    doc.text("Brio Elevators OTF Form", 10, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text("Sales Team & Customer Details", 10, yPosition);
    yPosition += 10;

    // Collect and format form data for the PDF
    const formFields = document.querySelectorAll("input, select, textarea");

    formFields.forEach((field) => {
      if (field.type === "file") return; // Skip file inputs

      const label = document.querySelector(`label[for="${field.id}"]`);
      const labelText = label ? label.innerText : field.name || field.id;
      const fieldValue = field.value || "N/A";

      // Add each field label and value to the PDF
      doc.text(`${labelText}: ${fieldValue}`, 10, yPosition);
      yPosition += 10;

      // Handle page overflow and reset position to start below the logo on new pages
      if (yPosition > 280) {
        doc.addPage();
        addLogoToPage(); // Add logo to the new page
        yPosition = 50;  // Reset yPosition to start below the logo on new pages
      }
    });

    // Save PDF with custom title
    doc.save(pdfTitle);
  }

  // Function to fetch the logo and convert it to a Base64 Data URL
  async function loadLogo(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await convertBlobToBase64(blob);
    } catch (error) {
      console.error("Logo could not be loaded:", error);
      return null; // Return null if loading fails
    }
  }

  // Helper function to convert blob to Base64
  function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Attach downloadPDF function to the global window object
  window.downloadPDF = downloadPDF;
});
