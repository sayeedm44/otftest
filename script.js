document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;

  function downloadPDF() {
  const doc = new jsPDF();

  // Initialize variables
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoImage = null; // Replace with actual Base64 image or dynamically load
  const cabinImage = null; // Replace with actual Base64 image or dynamically load
  let yPosition = 45; // Starting Y position
  const leftIndent = 15; // Left alignment for text

  // Function to handle page overflow
  function checkPageOverflow(currentY) {
    if (currentY > doc.internal.pageSize.getHeight() - 20) { // Allow margin
      addNewPage();
      return 50; // Reset Y position for the new page
    }
    return currentY;
  }

  // Function to add a new page and reset Y position
  function addNewPage() {
    doc.addPage();
    yPosition = 50; // Reset Y position for new page
    // Add logo on the new page
    if (logoImage) {
      doc.addImage(logoImage, "PNG", 10, 10, 30, 30);
    }
  }

  // Title
  const titleText = "Brio Elevators OTF Form";
  doc.setFontSize(16);
  doc.text(titleText, pageWidth / 2, yPosition, { align: "center" });

  // Update starting position
  yPosition += 10;

  // Sales Team Section
  const salesTeamText = "Sales Team";
  doc.setFontSize(14);
  doc.text(salesTeamText, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Dynamic values
  const salesPerson = document.getElementById("Salesperson")?.value || "N/A";
  const teamLeader = document.getElementById("TeamLeader")?.value || "N/A";
  const crmPerson = document.getElementById("Crmperson")?.value || "N/A";
  const referredBy = document.getElementById("Refferedby")?.value || "N/A";

  doc.text(`Sales Person: ${salesPerson}`, leftIndent, yPosition);
  yPosition += 10;
  doc.text(`Team Leader Involved: ${teamLeader}`, leftIndent, yPosition);
  yPosition += 10;
  doc.text(`CRM Person: ${crmPerson}`, leftIndent, yPosition);
  yPosition += 10;

  if (referredBy && referredBy !== "N/A") {
    doc.text(`Referred by: ${referredBy}`, leftIndent, yPosition);
    yPosition += 10;
  }

  // Customer Details Section
  yPosition += 5;
  const customerDetailsText = "Customer Details";
  doc.setFontSize(14);
  doc.text(customerDetailsText, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  const formFields = document.querySelectorAll("input, select, textarea");
  const addedFields = new Set();
  let orderDetailsAdded = false;
  let cabinDetailsAdded = false;

  formFields.forEach((field) => {
    if (field.type === "file") return;

    const label = document.querySelector(`label[for="${field.id}"]`);
    const labelText = label ? label.innerText : field.name || field.id;
    const fieldValue = field.value || "N/A";

    const uniqueFieldKey = `${labelText}: ${fieldValue}`;
    if (addedFields.has(uniqueFieldKey)) return;
    addedFields.add(uniqueFieldKey);

    yPosition = checkPageOverflow(yPosition);

    // Add field data
    doc.text(`${labelText.replace(/:+$/, '')}: ${fieldValue}`, leftIndent, yPosition);
    yPosition += 10;

    // Add Order Details section
    if (!orderDetailsAdded && labelText.includes("Cash & Account Commitments")) {
      console.log("Adding Order Details section");
      yPosition += 10;
      yPosition = checkPageOverflow(yPosition);

      doc.setFontSize(14);
      doc.text("Order Details", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
      orderDetailsAdded = true;
    }

    // Add Cabin Details section
    if (!cabinDetailsAdded && labelText.includes("No of Floors")) {
      console.log("Adding Cabin Details section");
      addNewPage();
      doc.text("Cabin Details", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      if (cabinImage) {
        const imageXPosition = pageWidth - 65;
        const imageYPosition = yPosition;
        doc.addImage(cabinImage, "PNG", imageXPosition, imageYPosition, 50, 50);
        yPosition += 60;
      }

      cabinDetailsAdded = true;
    }
  });

  // Save the PDF
  const pdfTitle = `${salesPerson}-OTF-${teamLeader}.pdf`;
  doc.save(pdfTitle);
}

// Attach to global window object
window.downloadPDF = downloadPDF;
