// Add a function to load images from the DOM
async function getImageBase64(imgSelector) {
  const imgElement = document.querySelector(imgSelector);
  if (!imgElement || !imgElement.src) {
    console.warn("Image not found or has no source:", imgSelector);
    return null;
  }
  
  try {
    const response = await fetch(imgElement.src);
    const blob = await response.blob();
    return await convertBlobToBase64(blob);
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
}

// Insert Cabin Details section with the image
async function addCabinDetailsSection() {
  // Move to the next page if not already started
  doc.addPage();
  addLogoToPage();
  let yPosition = 45; // Reset Y position for the new page

  // Add Cabin Details heading
  const cabinDetailsText = "Cabin Details";
  doc.setFontSize(14);
  doc.text(cabinDetailsText, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Load and add the cabin image
  const cabinImageBase64 = await getImageBase64(".cabin-image img");
  if (cabinImageBase64) {
    doc.addImage(cabinImageBase64, "PNG", 15, yPosition, 180, 100); // Adjust dimensions and position as needed
    yPosition += 110; // Adjust the Y position based on the image height
  } else {
    console.warn("Cabin image could not be loaded.");
  }
}

// Call this function in the appropriate place
await addCabinDetailsSection();
