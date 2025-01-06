document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;

  async function downloadPDF() {
    const doc = new jsPDF();

    // Set the background color of the PDF
    function setBackground() {
      doc.setFillColor("#e9ecef");
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    }

    // Load the logo and cabin images as Base64
    const logo = await loadImageAsBase64("logo.png");
    const cabinImage = await loadImageAsBase64("cabin.png");

    // Retrieve form values to create a PDF title
    const customerName = document.getElementById("Customername")?.value || "Customer";
    const city = document.getElementById("City")?.value || "City";
    const area = document.getElementById("Area")?.value || "Area";
    const floors = document.getElementById("Floors")?.value || "Floors";
    const model = document.getElementById("Model")?.value || "Model";
    const pdfTitle = `${customerName}-OTF-${city}-${area}-${floors}-${model}.pdf`;

    // Helper function to add logo to page
    function addLogoToPage() {
      if (logo) {
        doc.addImage(logo, "PNG", 10, 10, 30, 30); // Fixed position for logo
      }
    }

    // Add logo and background color to a new page
    function addNewPage() {
      doc.addPage();
      setBackground();
      addLogoToPage();
    }

    // Add logo and background color to the first page
    setBackground();
    addLogoToPage();

    // Center title text below the logo
    const titleText = "Brio Elevators OTF Form";
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleYPosition = 45;
    doc.text(titleText, pageWidth / 2, titleYPosition, { align: "center" });

    // Adjust starting Y position below title
    let yPosition = titleYPosition + 10;

    // Center Sales Team heading below title
    const salesTeamText = "Sales Team";
    doc.setFontSize(14);
    doc.text(salesTeamText, pageWidth / 2, yPosition, { align: "center" });

    // Retrieve dynamic values for Sales Team section
    const salesPerson = document.getElementById("Salesperson")?.value || "N/A";
    const teamLeader = document.getElementById("TeamLeader")?.value || "N/A";
    const crmPerson = document.getElementById("Crmperson")?.value || "N/A";
    const referredBy = document.getElementById("Refferedby")?.value || "N/A";

    // Update Y position to start below "Sales Team"
    yPosition += 10;
    const leftIndent = 15; // Align text fields with a slight indent from the left
    doc.text(`Sales Person: ${salesPerson}`, leftIndent, yPosition);
    yPosition += 10;
    doc.text(`Team Leader Involved: ${teamLeader}`, leftIndent, yPosition);
    yPosition += 10;
    doc.text(`CRM Person: ${crmPerson}`, leftIndent, yPosition);
    yPosition += 10;

    // Add "Referred by" only if it has a non-empty value and is not "N/A"
    if (referredBy && referredBy !== "N/A") {
      doc.text(`Referred by: ${referredBy}`, leftIndent, yPosition);
      yPosition += 10;
    }
    yPosition += 5;

    // Center Customer Details heading
    const customerDetailsText = "Customer Details";
    doc.setFontSize(14);
    doc.text(customerDetailsText, pageWidth / 2, yPosition, { align: "center" });

    // Update Y position for Customer Details
    yPosition += 10;

    // Form fields formatting for alignment
    const formFields = document.querySelectorAll("input, select, textarea");

    let orderDetailsAdded = false;
    let cabinDetailsAdded = false;

    formFields.forEach((field) => {
      if (field.type === "file") return; // Skip file inputs

      const label = document.querySelector(`label[for="${field.id}"]`);
      const labelText = label ? label.innerText : field.name || field.id;
      const fieldValue = field.value || "N/A";

      // Skip adding Sales Person, Team Leader, CRM Person, and Referred by in Customer Details
      if (["Salesperson", "TeamLeader", "Crmperson", "Refferedby"].includes(field.id)) {
        return;
      }

      // Add each field label and value with left alignment
      doc.text(`${labelText.replace(/:+$/, '')}: ${fieldValue}`, leftIndent, yPosition);
      yPosition += 10;

      // Insert Order Details heading after "Cash & Account Commitments"
      if (!orderDetailsAdded && labelText.includes("Cash & Account Commitments")) {
        yPosition += 10;

        // Check if space is enough for "Order Details" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 50;
        }

        // Center Order Details heading
        const orderDetailsText = "Order Details";
        doc.setFontSize(14);
        doc.text(orderDetailsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        orderDetailsAdded = true;
      }

      // Insert Cabin Details heading after "No of Floors"
      if (!cabinDetailsAdded && labelText.includes("No of Floors")) {
        // Force a new page for Cabin Details section
        addNewPage();
        yPosition = 50;

        // Center Cabin Details heading
        const cabinDetailsText = "Cabin Details";
        doc.setFontSize(14);
        doc.text(cabinDetailsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        cabinDetailsAdded = true;

        // Add cabin image on the right side
        if (cabinImage) {
          const imageXPosition = pageWidth - 65; // Adjust X position to the right side
          const imageYPosition = yPosition; // Align image height with the text
          doc.addImage(cabinImage, "PNG", imageXPosition, imageYPosition, 50, 50); // Adjust the size and position as needed
        }
      }

      // Add each field label and value with left alignment for Cabin Details
      if (cabinDetailsAdded) {
        doc.text(`${labelText.replace(/:+$/, '')}: ${fieldValue}`, leftIndent, yPosition);
        yPosition += 10;
      }

      // Handle page overflow
      if (yPosition > 250) {
        addNewPage();
        yPosition = 50;
      }
    });

    // Save the PDF with a custom title
    doc.save(pdfTitle);
  }

  // Function to load image as Base64
  async function loadImageAsBase64(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await convertBlobToBase64(blob);
    } catch (error) {
      console.error("Image could not be loaded:", error);
      return null;
    }
  }

  // Convert blob to Base64
  function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Attach to global window object
  window.downloadPDF = downloadPDF;
});
