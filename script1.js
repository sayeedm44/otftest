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

    // Sales Team Section
    yPosition = addSalesTeamSection(doc, pageWidth, yPosition);

    // Customer Details Section
    yPosition = addCustomerDetailsSection(doc, pageWidth, yPosition);

    // Add Cabin Details Section
    await addCabinDetailsSection(doc);

    // Add Uploaded Photos Section (Aligned on the Last Page)
    await addUploadedPhotosSection(doc);

    // Save the PDF with a custom title
    doc.save(pdfTitle);
  }

  function addSalesTeamSection(doc, pageWidth, yPosition) {
    const salesTeamText = "Sales Team";
    doc.setFontSize(14);
    doc.text(salesTeamText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    const salesPerson = document.getElementById("salesPerson")?.value || '';
    const teamLeader = document.getElementById("teamLeader")?.value || '';
    const referredBy = document.getElementById("Refferedby")?.value || '';
    const leftIndent = 15;

    doc.text(`Sales Person: ${salesPerson}`, leftIndent, yPosition);
    yPosition += 10;
    doc.text(`Team Leader Involved: ${teamLeader}`, leftIndent, yPosition);
    yPosition += 10;

    if (referredBy && referredBy !== "N/A") {
      doc.text(`Referred by: ${referredBy}`, leftIndent, yPosition);
      yPosition += 10;
    }

    return yPosition;
  }

  function addCustomerDetailsSection(doc, pageWidth, yPosition) {
    const customerDetailsText = "Customer Details";
    doc.setFontSize(14);
    doc.text(customerDetailsText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    const formFields = document.querySelectorAll("input, select, textarea");
    const leftIndent = 15;

    formFields.forEach((field) => {
      if (field.type === "file") return;

      const label = document.querySelector(`label[for="${field.id}"]`);
      const labelText = label ? label.innerText : field.name || field.id;
      const fieldValue = field.value;

      if (["salesPerson", "teamLeader", "Refferedby"].includes(field.id)) {
        return;
      }

      doc.text(`${labelText.replace(/:+$/, '')}: ${fieldValue}`, leftIndent, yPosition);
      yPosition += 10;

      if (yPosition > 250) {
        doc.addPage();
        addLogoToPage();
        yPosition = 50;
      }
    });

    return yPosition;
  }

  async function addCabinDetailsSection(doc) {
    doc.addPage();
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftIndent = 15;
    let yPosition = 45;

    const cabinDetailsText = "Cabin Details";
    doc.setFontSize(14);
    doc.text(cabinDetailsText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    const cabinImageBase64 = await getImageBase64(".cabin-image img");
    if (cabinImageBase64) {
      doc.addImage(cabinImageBase64, "PNG", leftIndent, yPosition, 180, 100);
      yPosition += 110;
    } else {
      console.warn("Cabin image could not be loaded.");
    }
  }

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

    const images = [];

    for (const section of photoSections) {
      const input = document.getElementById(section.id);
      if (!input || !input.files.length) continue;

      for (const file of input.files) {
        const base64 = await convertFileToBase64(file);
        images.push({ label: section.label, base64 });
      }
    }

    if (images.length > 0) {
      doc.addPage();
      const pageWidth = doc.internal.pageSize.getWidth();
      const leftMargin = 15;
      const gridWidth = 60;
      const gridHeight = 40;
      const horizontalSpacing = 10;
      const verticalSpacing = 15;
      const imagesPerRow = Math.floor((pageWidth - 2 * leftMargin) / (gridWidth + horizontalSpacing));
      let xPosition = leftMargin;
      let yPosition = 45;

      const photosText = "Uploaded Photos";
      doc.setFontSize(14);
      doc.text(photosText, pageWidth / 2, yPosition - 10, { align: "center" });

      images.forEach((image, index) => {
        doc.addImage(image.base64, "PNG", xPosition, yPosition, gridWidth, gridHeight);
        doc.setFontSize(10);
        doc.text(image.label, xPosition + gridWidth / 2, yPosition + gridHeight + 5, { align: "center" });

        xPosition += gridWidth + horizontalSpacing;

        if ((index + 1) % imagesPerRow === 0) {
          xPosition = leftMargin;
          yPosition += gridHeight + verticalSpacing;

          if (yPosition + gridHeight > 280) {
            doc.addPage();
            xPosition = leftMargin;
            yPosition = 45;
          }
        }
      });
    }
  }

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

  function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  window.downloadPDF = downloadPDF;
});
