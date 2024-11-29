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

  // Insert "Cabin Details" under "Order Details" after "No of Floors:"
  if (labelText.includes("No of Floors") && !isOrderDetailsStarted) {
    // Move to the next page for "Order Details"
    doc.addPage();
    addLogoToPage();
    yPosition = 45; // Reset Y position on the new page

    // Center Order Details heading
    const orderDetailsText = "Order Details";
    doc.setFontSize(14);
    doc.text(orderDetailsText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Add Cabin Details heading below Order Details
    const cabinDetailsText = "Cabin Details";
    doc.setFontSize(14);
    doc.text(cabinDetailsText, pageWidth / 2, yPosition, { align: "center" });
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
