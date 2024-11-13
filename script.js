const { jsPDF } = window.jspdf;

function generatePDF(formValues, images) {
  const doc = new jsPDF();

  // Logo position
  const logoX = 10;
  const logoY = 10;
  const logoWidth = 30;
  const logoHeight = 30;

  // Centered title and heading Y positions
  let currentY = logoY + logoHeight + 10;

  // Helper function to add text with custom styles
  function addText(text, fontSize, isBold, yPosition) {
    doc.setFontSize(fontSize);
    if (isBold) doc.setFont("helvetica", "bold");
    else doc.setFont("helvetica", "normal");
    const textWidth = doc.getTextWidth(text);
    const x = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(text, x, yPosition);
  }

  // Helper function to add label-value pairs
  function addLabelValue(label, value, yPosition) {
    doc.setFont("helvetica", "bold");
    doc.text(label, 10, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, 70, yPosition);
    return yPosition + 10;
  }

  // Add Logo
  doc.addImage(formValues.logo, "PNG", logoX, logoY, logoWidth, logoHeight);

  // Title
  addText("Brio Elevators OTF Form", 18, true, currentY);
  currentY += 10;

  // Sales Team Heading
  addText("Sales Team", 14, true, currentY);
  currentY += 10;

  // Sales Team details
  currentY = addLabelValue("Sales Person:", formValues.salesPerson, currentY);
  currentY = addLabelValue("Team Leader Involved:", formValues.teamLeader, currentY);
  currentY = addLabelValue("Referred by:", formValues.referredBy, currentY);

  // Customer Details Section
  addText("Customer Details", 14, true, currentY);
  currentY += 10;
  currentY = addLabelValue("Customer Name:", formValues.customerName, currentY);
  currentY = addLabelValue("Area:", formValues.area, currentY);
  currentY = addLabelValue("City:", formValues.city, currentY);
  currentY = addLabelValue("Billing Address:", formValues.billingAddress, currentY);
  currentY = addLabelValue("Shipping Address:", formValues.shippingAddress, currentY);
  currentY = addLabelValue("Location:", formValues.location, currentY);
  currentY = addLabelValue("Contact Number:", formValues.contactNumber, currentY);
  currentY = addLabelValue("Email ID:", formValues.email, currentY);
  currentY = addLabelValue("Alternate Contact Name:", formValues.alternateContactName, currentY);
  currentY = addLabelValue("Alternate Contact Number:", formValues.alternateContactNumber, currentY);
  currentY = addLabelValue("Final Quotation Number:", formValues.finalQuotation, currentY);
  currentY = addLabelValue("Order Taken Date:", formValues.orderTakenDate, currentY);
  currentY = addLabelValue("Promised Delivery in Months:", formValues.deliveryMonths, currentY);
  currentY = addLabelValue("Cash & Account Commitments:", formValues.cashAccountCommitments, currentY);

  // Order Details Section
  addText("Order Details", 14, true, currentY);
  currentY += 10;
  currentY = addLabelValue("Model:", formValues.model, currentY);
  currentY = addLabelValue("Structure:", formValues.structure, currentY);
  currentY = addLabelValue("Structure Color:", formValues.structureColor, currentY);
  currentY = addLabelValue("Structure Covering:", formValues.structureCovering, currentY);
  currentY = addLabelValue("Installation Type:", formValues.installationType, currentY);
  currentY = addLabelValue("Shaft Width (mm):", formValues.shaftWidth, currentY);
  currentY = addLabelValue("Shaft Depth (mm):", formValues.shaftDepth, currentY);
  currentY = addLabelValue("Pit (mm):", formValues.pit, currentY);
  currentY = addLabelValue("Headroom (mm):", formValues.headroom, currentY);
  currentY = addLabelValue("Travel Height (mm):", formValues.travelHeight, currentY);
  currentY = addLabelValue("Floor to Floor Distance (mm):", formValues.floorToFloorDistance, currentY);
  currentY = addLabelValue("Payload (kg):", formValues.payload, currentY);
  currentY = addLabelValue("No of Floors:", formValues.floors, currentY);

  // Additional sections, continuing similarly...

  // Check for page overflow
  function checkPageOverflow(yPosition) {
    if (yPosition > doc.internal.pageSize.height - 20) {
      doc.addPage();
      doc.addImage(formValues.logo, "PNG", logoX, logoY, logoWidth, logoHeight);
      return logoY + logoHeight + 10;
    }
    return yPosition;
  }

  // Additional fields, images, and remarks handling...
  // Remember to update currentY with checkPageOverflow(currentY) for each section to manage page breaks.

  doc.save("Brio_Elevators_OTF_Form.pdf");
}
