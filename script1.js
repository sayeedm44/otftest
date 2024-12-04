document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;

  async function downloadPDF() {
    const doc = new jsPDF();

    // Load the logo as a Base64 image
    const logo = await loadLogo("logo.png");

    // Retrieve form values to create a PDF title
    const customerName = document.getElementById("customerName")?.value || '';
    const city = document.getElementById("city")?.value || '';
    const area = document.getElementById("area")?.value || '';
    const floors = document.getElementById("floors")?.value || '';
    const model = document.getElementById("model")?.value || '';
    const pdfTitle = `${customerName}-OTF-${city}-${area}-${floors}-${model}.pdf`;

    // Helper function to add logo to the page
    function addLogoToPage() {
      if (logo) {
        doc.addImage(logo, "PNG", 10, 10, 30, 30); // Fixed position for logo
      }
    }

    // Add logo to the first page
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
    const salesPerson = document.getElementById("salesPerson")?.value || '';
    const teamLeader = document.getElementById("teamLeader")?.value || '';
    const referredBy = document.getElementById("Refferedby")?.value || '';

    // Update Y position to start below "Sales Team"
    yPosition += 10;
    const leftIndent = 15; // Align text fields with a slight indent from the left
    doc.text(`Sales Person: ${salesPerson}`, leftIndent, yPosition);
    yPosition += 10;
    doc.text(`Team Leader Involved: ${teamLeader}`, leftIndent, yPosition);
    yPosition += 10;
    if (referredBy && referredBy !== "N/A") {
      doc.text(`Referred by: ${referredBy}`, leftIndent, yPosition);
      yPosition += 10;
    }

    // Center Customer Details heading
    const customerDetailsText = "Customer Details";
    doc.setFontSize(14);
    doc.text(customerDetailsText, pageWidth / 2, yPosition, { align: "center" });

    // Update Y position for Customer Details
    yPosition += 10;

    // Form fields formatting for alignment
    const formFields = document.querySelectorAll("input, select, textarea");

    let isOrderDetailsStarted = false;

    formFields.forEach((field) => {
      if (field.type === "file") return; // Skip file inputs

      const label = document.querySelector(`label[for="${field.id}"]`);
      const labelText = label ? label.innerText : field.name || field.id;
      const fieldValue = field.value;

      // Skip adding Sales Person, Team Leader, and Referred by in Customer Details
      if (["salesPerson", "teamLeader", "Refferedby"].includes(field.id)) {
        return;
      }

      // Add each field label and value with left alignment
      doc.text(`${labelText.replace(/:+$/, '')}: ${fieldValue}`, leftIndent, yPosition);
      yPosition += 10;

      // Insert Order Details heading after "Cash & Account Commitments"
      if (labelText.includes("Cash & Account Commitments") && !isOrderDetailsStarted) {
        // Move to the next page for "Order Details"
        doc.addPage();
        addLogoToPage();
        yPosition = 45;  // Reset Y position on the new page

        // Center Order Details heading
        const orderDetailsText = "Order Details";
        doc.setFontSize(14);
        doc.text(orderDetailsText, pageWidth / 2, yPosition, { align: "center" });
        yPosition += 10;

        isOrderDetailsStarted = true;
      }

      // Handle page overflow
      if (yPosition > 250) {
        doc.addPage();
        addLogoToPage();
        yPosition = 50;
      }
    });

    // Add Cabin Details Section
    await addCabinDetailsSection(doc);

    // Add Uploaded Photos Section
    await addUploadedPhotosSection(doc);

    // Save the PDF with a custom title
    doc.save(pdfTitle);
  }

  // Function to load logo as Base64
  async function loadLogo(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await convertBlobToBase64(blob);
    } catch (error) {
      console.error("Logo could not be loaded:", error);
      return null;
    }
  }

  // Add Cabin Details Section
  async function addCabinDetailsSection(doc) {
    doc.addPage();
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftIndent = 15;
    let yPosition = 45; // Reset Y position for the new page

    // Add Cabin Details heading
    const cabinDetailsText = "Cabin Details";
    doc.setFontSize(14);
    doc.text(cabinDetailsText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Load and add the cabin image
    const cabinImageBase64 = await getImageBase64(".cabin-image img");
    if (cabinImageBase64) {
      doc.addImage(cabinImageBase64, "PNG", leftIndent, yPosition, 180, 100); // Adjust dimensions and position as needed
      yPosition += 110; // Adjust the Y position based on the image height
    } else {
      console.warn("Cabin image could not be loaded.");
    }
  }

  // Add Uploaded Photos Section
  async function addUploadedPhotosSection(doc) {
    const photoSections = [
      { label: "Building/Site", id: "buildingPhotos" },
      { label: "PIT", id: "pitPhotos" },
      { label: "Headroom", id: "headroomPhotos" },
      { label: "Selected COP/LOP", id: "SelectedCOPLOP" },
      { label: "Selected Cabin", id: "SelectedCabin" },
      { label: "Selected Ceiling", id: "SelectedCelling" },
      { label: "Remaining Images", id: "remainingPhotos" },
    ];

    let yPosition = 45; // Start below the previous section or on a new page
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftIndent = 15;

    for (const section of photoSections) {
      const input = document.getElementById(section.id);
      if (!input || !input.files.length) continue;

      // Add section heading
      doc.setFontSize(14);
      doc.text(section.label, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      for (const file of input.files) {
        const base64 = await convertFileToBase64(file);

        // Add image to the PDF
        doc.addImage(base64, "PNG", leftIndent, yPosition, 60, 40); // Adjust dimensions as needed
        yPosition += 50; // Adjust position for the next image

        // Handle page overflow
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 45;
        }
      }
    }
  }

  // Convert file to Base64
  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Attach to global window object
  window.downloadPDF = downloadPDF;
});
