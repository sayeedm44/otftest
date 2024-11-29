document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;

  async function downloadPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load logo as Base64
    const logo = await loadLogo("logo.png");

    // Retrieve form values for PDF title
    const customerName = document.getElementById("customerName")?.value || "Customer";
    const city = document.getElementById("city")?.value || "City";
    const area = document.getElementById("area")?.value || "Area";
    const floors = document.getElementById("floors")?.value || "Floors";
    const model = document.getElementById("model")?.value || "Model";
    const pdfTitle = `${customerName}-OTF-${city}-${area}-${floors}-${model}.pdf`;

    // Helper function to add logo
    function addLogoToPage(yOffset = 10) {
      if (logo) {
        doc.addImage(logo, "PNG", 10, yOffset, 30, 30);
      }
    }

    // Centered text
    function addCenteredText(text, fontSize, yPosition) {
      doc.setFontSize(fontSize);
      doc.text(text, pageWidth / 2, yPosition, { align: "center" });
    }

    // Add logo and title to first page
    addLogoToPage();
    addCenteredText("Brio Elevators OTF Form", 16, 45);
    let yPosition = 55;

    // Add Sales Team section
    addCenteredText("Sales Team", 14, yPosition);
    yPosition += 10;

    // Fetch and render Sales Team values
    const salesFields = [
      { id: "salesPerson", label: "Sales Person" },
      { id: "teamLeader", label: "Team Leader Involved" },
      { id: "Refferedby", label: "Referred By" },
    ];
    yPosition = addFields(doc, salesFields, yPosition, 15, pageHeight);

    // Add Customer Details section
    yPosition = addSection(
      doc,
      "Customer Details",
      ["customerName", "area", "city", "billingAddress", "shippingAddress", "location"],
      yPosition,
      pageHeight
    );

    // Add Order Details section
    yPosition = addSection(
      doc,
      "Order Details",
      ["model", "Structure", "structureColor", "shaftWidth", "shaftDepth"],
      yPosition,
      pageHeight
    );

    // Save the PDF
    doc.save(pdfTitle);
  }

  // Add fields to PDF
  function addFields(doc, fields, startY, leftIndent, pageHeight) {
    let yPosition = startY;
    fields.forEach(({ id, label }) => {
      const value = document.getElementById(id)?.value || "N/A";
      doc.text(`${label}: ${value}`, leftIndent, yPosition);
      yPosition += 10;
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    });
    return yPosition;
  }

  // Add section with a heading
  function addSection(doc, heading, fieldIds, yPosition, pageHeight) {
    addCenteredText(heading, 14, yPosition);
    yPosition += 10;
    const fields = fieldIds.map((id) => ({
      id,
      label: document.querySelector(`label[for="${id}"]`)?.innerText || id,
    }));
    return addFields(doc, fields, yPosition, 15, pageHeight);
  }

  // Load logo as Base64
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
