document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;

  async function downloadPDF() {
    const doc = new jsPDF();

    // Retrieve dynamic values for the PDF title
    const customerName = document.getElementById("Customername")?.value || "Customer";
    const city = document.getElementById("City")?.value || "City";
    const area = document.getElementById("Area")?.value || "Area";
    const floors = document.getElementById("Floors")?.value || "Floors";
    const model = document.getElementById("Model")?.value || "Model";
    
    // Define the pdfTitle variable
    const pdfTitle = `${customerName}-OTF-${city}-${area}-${floors}-${model}.pdf`;

    // Set the background color of the PDF
    function setBackground() {
      doc.setFillColor("#e9ecef");
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    }

    // Load the logo and cabin images as Base64
    const logo = await loadImageAsBase64("logo.png");
    const cabinImage = await loadImageAsBase64("cabin.png");

    // Helper function to add logo to page with specified width and height
    function addLogoToPage() {
      if (logo) {
        // Adjust the width and height of the logo here
        const logoWidth = 20; // Set the width of the logo
        const logoHeight = 10; // Set the height of the logo
        doc.addImage(logo, "PNG", 10, 10, logoWidth, logoHeight);
      }
    }

    // Add logo and background color to a new page
    function addNewPage() {
      doc.addPage();
      setBackground();
      addLogoToPage();
    }

    // Add Order Details header to the page
    function addOrderDetailsHeader() {
      const orderDetailsText = "Order Details";
      doc.setFontSize(14);
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.text(orderDetailsText, pageWidth / 2, 30, { align: "center" });
    }

    // Add Terms of Sale header to the page
    function addTermsOfSaleHeader() {
      const termsOfSaleText = "Terms of Sale";
      doc.setFontSize(14);
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.text(termsOfSaleText, pageWidth / 2, 30, { align: "center" });
    }

    // Add logo and background color to the first page
    setBackground();
    addLogoToPage();

    // Center title text below the logo and move it up a bit
    const titleText = "Brio Elevators OTF Form";
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleYPosition = 25; // Adjusted Y position to move the title up
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

    let orderTakenDateAdded = false;
    let orderDetailsAdded = false;
    let cabinDetailsAdded = false;
    let cabinDesignAdded = false;
    let additionalFeaturesAdded = false;
    let copLopDetailsAdded = false;
    let termsOfSaleAdded = false;
    let scopeOfWorkAdded = false;
    let documentsCollectedAdded = false;

    // To keep track of added fields and avoid duplicates
    const addedFields = new Set();

    formFields.forEach((field) => {
      if (field.type === "file") return; // Skip file inputs

      const label = document.querySelector(`label[for="${field.id}"]`);
      const labelText = label ? label.innerText : field.name || field.id;
      const fieldValue = field.value || "N/A";

      // Skip adding Sales Person, Team Leader, CRM Person, and Referred by in Customer Details
      if (["Salesperson", "TeamLeader", "Crmperson", "Refferedby"].includes(field.id)) {
        return;
      }

      // Avoid duplicate entries
      const uniqueFieldKey = `${labelText}: ${fieldValue}`;
      if (addedFields.has(uniqueFieldKey)) {
        return;
      }
      addedFields.add(uniqueFieldKey);

      // Move "Order Taken Date" to the second page and add Order Details header
      if (labelText.includes("Order Taken Date") && !orderTakenDateAdded) {
        addNewPage();
        addOrderDetailsHeader();
        yPosition = 40; // Reset Y position below the "Order Details" header
        orderTakenDateAdded = true;
      }

      // Add each field label and value with left alignment
      doc.text(`${labelText.replace(/:+$/, '')}: ${fieldValue}`, leftIndent, yPosition);
      yPosition += 10;

      // Insert Terms of Sale heading immediately after "Authentication Need:"
      if (!termsOfSaleAdded && labelText.includes("Authentication Need")) {
        yPosition += 10;

        // Check if space is enough for "Terms of Sale" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 40;
        }

        // Center Terms of Sale heading
        addTermsOfSaleHeader();
        yPosition += 10;

        // Add "Promised Delivery in Months from Signing the Drawing:", "Warranty:", and "Service:" after "Terms of Sale"
        doc.text(`Promised Delivery in Months from Signing the Drawing: ${document.getElementById("Deliverymonths")?.value || "N/A"}`, leftIndent, yPosition);
        yPosition += 10;
        doc.text(`Warranty: ${document.getElementById("Warranty")?.value || "N/A"}`, leftIndent, yPosition);
        yPosition += 10;
        doc.text(`Service: ${document.getElementById("Service")?.value || "N/A"}`, leftIndent, yPosition);
        yPosition += 10;

        termsOfSaleAdded = true;
      }

      // Insert Order Details heading after "Cash & Account Commitments"
      if (!orderDetailsAdded && labelText.includes("Cash & Account Commitments")) {
        yPosition += 10;

        // Check if space is enough for "Order Details" heading
        if (yPosition > 230) {
          addNewPage();
          addOrderDetailsHeader();
          yPosition = 40;
        }

        // Center Order Details heading
        const orderDetailsText = "Order Details";
        doc.setFontSize(14);
        doc.text(orderDetailsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        orderDetailsAdded = true;
      }

      // Insert Cabin Details heading after "No of Floors" in Order Details
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

      // Insert Cabin Design heading after "Glass Wall in Cabin"
      if (!cabinDesignAdded && labelText.includes("Glass Wall in Cabin")) {
        yPosition += 10;

        // Check if space is enough for "Cabin Design" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 50;
        }

        // Center Cabin Design heading
        const cabinDesignText = "Cabin Design";
        doc.setFontSize(14);
        doc.text(cabinDesignText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        cabinDesignAdded = true;
      }

      // Insert Additional Features heading after "Cabin Flooring"
      if (!additionalFeaturesAdded && labelText.includes("Cabin Flooring")) {
        yPosition += 10;

        // Check if space is enough for "Additional Features" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 50;
        }

        // Center Additional Features heading
        const additionalFeaturesText = "Additional Features";
        doc.setFontSize(14);
        doc.text(additionalFeaturesText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        additionalFeaturesAdded = true;
      }

      // Insert COP/LOP Details heading after "Voice Announcer"
      if (!copLopDetailsAdded && labelText.includes("Voice Announcer")) {
        yPosition += 10;

        // Check if space is enough for "COP/LOP Details" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 40; // Adjusted Y position below the logo
        }

        // Center COP/LOP Details heading
        const copLopDetailsText = "COP/LOP Details";
        doc.setFontSize(14);
        doc.text(copLopDetailsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        copLopDetailsAdded = true;
      }

      // Insert Scope of Work heading after "Non Comprehensive AMC Per Annum"
      if (!scopeOfWorkAdded && labelText.includes("Non Comprehensive AMC Per Annum")) {
        yPosition += 10;

        // Check if space is enough for "Scope of Work" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 50;
        }

        // Center Scope of Work heading
        const scopeOfWorkText = "Scope of Work";
        doc.setFontSize(14);
        doc.text(scopeOfWorkText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        scopeOfWorkAdded = true;
      }

      // Insert Documents Collected heading after "Service"
      if (!documentsCollectedAdded && labelText.includes("Documents Collected")) {
        yPosition += 10;

        // Check if space is enough for "Documents Collected" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 50;
        }

        // Center Documents Collected heading
        const documentsCollectedText = "Documents Collected";
        doc.setFontSize(14);
        doc.text(documentsCollectedText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        documentsCollectedAdded = true;
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
