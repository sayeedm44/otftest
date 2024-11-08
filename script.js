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
        doc.addImage(logo, "PNG", 10, 10, 30, 30); // Fixed logo position on each page
      }
    }

    // Add the logo to the first page
    addLogoToPage();

    // Center the title text horizontally below the logo
    const titleText = "Brio Elevators OTF Form";
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleXPosition = pageWidth / 2; // Center X position
    const titleYPosition = 50; // Y position below the logo (logo is at Y=10 and has height=30)

    // Add centered title text just below the logo
    doc.text(titleText, titleXPosition, titleYPosition, { align: "center" });

    // Start content below the title
    let yPosition = titleYPosition + 10; // Adjusted to leave space below the title

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

      // Handle page overflow and reset content position for new pages
      if (yPosition > 280) {
        doc.addPage(); // Add a new page
        addLogoToPage(); // Add the logo at the top of the new page
        yPosition = 50; // Reset yPosition to start below the logo
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
