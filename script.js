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
        doc.addImage(logo, "PNG", 10, 10, 30, 20); // Adjust the size of the logo (width: 30, height: 20)
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

    // Center title text below the logo and move it up a bit
    const titleText = "Brio Elevators OTF Form";
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleYPosition = 35; // Adjusted Y position to move the title up
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
    let paymentTermsAdded = false;
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

      // Move "Order Taken Date" to the second page
      if (labelText.includes("Order Taken Date") && !orderTakenDateAdded) {
        addNewPage();
        yPosition = 50; // Reset Y position for the new page
        orderTakenDateAdded = true;
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
          yPosition = 50;
        }

        // Center COP/LOP Details heading
        const copLopDetailsText = "COP/LOP Details";
        doc.setFontSize(14);
        doc.text(copLopDetailsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        copLopDetailsAdded = true;
      }

      // Insert Terms of Sale heading before "Basic Cost of the Lift"
      if (!termsOfSaleAdded && labelText.includes("Basic Cost of the Lift")) {
        yPosition += 10;

        // Check if space is enough for "Terms of Sale" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 50;
        }

        // Center Terms of Sale heading
        const termsOfSaleText = "Terms of Sale";
        doc.setFontSize(14);
        doc.text(termsOfSaleText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        termsOfSaleAdded = true;
      }

      // Insert Payment Terms heading after "Terms of Sale"
      if (termsOfSaleAdded && !paymentTermsAdded) {
        yPosition += 10;

        // Check if space is enough for "Payment Terms" heading
        if (yPosition > 230) {
          addNewPage();
          yPosition = 50;
        }

        // Center Payment Terms heading
        const paymentTermsText = "Payment Terms";
        doc.setFontSize(14);
        doc.text(paymentTermsText, pageWidth / 2, yPosition, { align: "center" });

        yPosition += 10;
        paymentTermsAdded = true;
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
      if (!documentsCollectedAdded && labelText.includes("Service")) {
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
