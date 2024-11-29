document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;

  async function downloadPDF() {
    const doc = new jsPDF();
    
    // Load the logo as a Base64 image
    const logo = await loadLogo("logo.png");

    // Retrieve form values to create a PDF title
    const customerName = document.getElementById("customerName")?.value;
    const city = document.getElementById("city")?.value;
    const area = document.getElementById("area")?.value;
    const floors = document.getElementById("floors")?.value;
    const model = document.getElementById("model")?.value;
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

    // Start a table for Sales Team
    const salesTeamText = "Sales Team";
    const salesPerson = document.getElementById("salesPerson")?.value;
    const teamLeader = document.getElementById("teamLeader")?.value;
    const referredBy = document.getElementById("Refferedby")?.value;

    const salesTeamData = [
      ["Sales Person", salesPerson],
      ["Team Leader Involved", teamLeader],
      ["Referred by", referredBy]
    ];

    const salesTeamOptions = {
      startY: titleYPosition + 10,
      head: [["", ""]],
      body: salesTeamData
    };

    doc.autoTable(salesTeamOptions);

    // Start a table for Customer Details
    const customerDetailsText = "Customer Details";
    const formFields = document.querySelectorAll("input, select, textarea");

    const customerDetailsData = [];
    
    formFields.forEach((field) => {
      if (field.type === "file") return; // Skip file inputs

      const label = document.querySelector(`label[for="${field.id}"]`);
      const labelText = label ? label.innerText : field.name || field.id;
      const fieldValue = field.value;

      // Skip adding Sales Person, Team Leader, and Referred by in Customer Details
      if (["salesPerson", "teamLeader", "Refferedby"].includes(field.id)) {
        return;
      }

      customerDetailsData.push([labelText.replace(/:+$/, ''), fieldValue]);
    });

    const customerDetailsOptions = {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Field", "Value"]],
      body: customerDetailsData
    };

    doc.autoTable(customerDetailsOptions);

    // Start a table for Cabin Details
    const cabinDesignElement = document.getElementById("cabinDesign");
    const cabinDesignValue = cabinDesignElement?.value?.trim();

    const cabinDetailsData = [
      ["Glass Wall in Cabin", document.getElementById("glassWallCabin").value],
    ];

    if (cabinDesignValue) {
      cabinDetailsData.push(["Cabin Design", cabinDesignValue]);
    }

    const cabinDetailsOptions = {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Field", "Value"]],
      body: cabinDetailsData
    };

    doc.autoTable(cabinDetailsOptions);

    // Handle page overflow
    if (doc.lastAutoTable.finalY > 250) {
      doc.addPage();
      addLogoToPage();
    }

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
