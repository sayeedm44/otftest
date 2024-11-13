document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;

  async function downloadPDF() {
    const doc = new jsPDF();

    // Load the logo as a Base64 image
    const logo = await loadLogo("logo.png");

    // Retrieve form values to create a PDF title
    const customerName = document.getElementById("customerName").value || "Customer";
    const city = document.getElementById("city").value || "City";
    const area = document.getElementById("area").value || "Area";
    const floors = document.getElementById("floors").value || "Floors";
    const model = document.getElementById("model").value || "Model";
    const pdfTitle = `${customerName}-OTF-${city}-${area}-${floors}-${model}.pdf`;

    // Helper function to add logo to page
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

    // Update Y position to start below "Sales Team"
    yPosition += 10;

    // Add Sales Person, Team Leader, and Referred by fields
    const leftIndent = 15; // Align text fields with a slight indent from the left
    const salesPerson = "Sales Person: John Doe";
    const teamLeader = "Team Leader Involved: Jane Smith";
    const referredBy = "Referred by: Referral Name";
    doc.text(salesPerson, leftIndent, yPosition);
    yPosition += 10;
    doc.text(teamLeader, leftIndent, yPosition);
    yPosition += 10;
    doc.text(referredBy, leftIndent, yPosition);
    yPosition += 15;

    // Center Customer Details heading
    const customerDetailsText = "Customer Details";
    doc.setFontSize(14);
    doc.text(customerDetailsText, pageWidth / 2, yPosition, { align: "center" });

    // Update Y position
    yPosition += 10;

    // Form fields formatting for alignment
    const formFields = document.querySelectorAll("input, select, textarea");

    formFields.forEach((field) => {
      if (field.type === "file") return; // Skip file inputs

      const label = document.querySelector(`label[for="${field.id}"]`);
      const labelText = label ? label.innerText : field.name || field.id;
      const fieldValue = field.value || "N/A";

      // Add each field label and value with left alignment
      doc.text(`${labelText.replace(/:+$/, '')}: ${fieldValue}`, leftIndent, yPosition);
      yPosition += 10;

      // Insert Order Details heading when reaching specific field
      if (labelText.includes("Cash & Account Commitments")) {
        yPosition += 10;

        // Center Order Details heading
        const orderDetailsText = "Order Details";
        doc.setFontSize(14);
        doc.text(orderDetailsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
      }

      // Add Cabin Details heading after "No of Floors"
      if (labelText.includes("No of Floors")) {
        yPosition += 10;

        // Center Cabin Details heading
        const cabinDetailsText = "Cabin Details";
        doc.setFontSize(14);
        doc.text(cabinDetailsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
      }

      // Add Additional Features heading after "Cabin Flooring"
      if (labelText.includes("Cabin Flooring")) {
        yPosition += 10;

        // Center Additional Features heading
        const additionalFeaturesText = "Additional Features";
        doc.setFontSize(14);
        doc.text(additionalFeaturesText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
      }

      // Add COP/LOP Details heading after "Voice Announcer"
      if (labelText.includes("Voice Announcer")) {
        yPosition += 10;

        // Center COP/LOP Details heading
        const copLopDetailsText = "COP/LOP Details";
        doc.setFontSize(14);
        doc.text(copLopDetailsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
      }

      // Add Terms of Sale and Scope of Work headings after "Authentication Need"
      if (labelText.includes("Authentication Need")) {
        yPosition += 10;

        // Center Terms of Sale heading
        const termsOfSaleText = "Terms of Sale";
        doc.setFontSize(14);
        doc.text(termsOfSaleText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;

        // Center Scope of Work sub-heading
        const scopeOfWorkText = "Scope of Work";
        doc.setFontSize(12); // Slightly smaller font for subheading
        doc.text(scopeOfWorkText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
      }

      // Add Upload Photos heading after "Service"
      if (labelText.includes("Service")) {
        yPosition += 10;

        // Center Upload Photos heading
        const uploadPhotosText = "Upload Photos";
        doc.setFontSize(14);
        doc.text(uploadPhotosText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
      }

      // Handle page overflow
      if (yPosition > 250) {
        doc.addPage();
        addLogoToPage();
        yPosition = 50;
      }
    });

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
