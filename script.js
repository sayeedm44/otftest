// Function to download the form data as a PDF
function downloadPDF() {
    // Import jsPDF
    const { jsPDF } = window.jspdf;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Get the form data
    const customerName = document.getElementById('customerName').value;
    const area = document.getElementById('area').value;
    const city = document.getElementById('city').value;
    const floors = document.getElementById('floors').value;
    const model = document.getElementById('model').value;

    // Set the PDF title
    const pdfTitle = `${customerName}-OTF-${city}-${area}-${floors}-${model}.pdf`;

    // Add logo to the PDF
    const logo = new Image();
    logo.src = 'logo.png'; // Path to your logo image
    logo.onload = function() {
        doc.addImage(logo, 'PNG', 10, 10, 40, 20); // Adjust the position and size as needed

        // Add the form data to the PDF
        doc.setFontSize(16);
        doc.text('Brio Elevators OTF Form', 60, 20);
        doc.setFontSize(12);
        doc.text(`Customer Name: ${customerName}`, 10, 40);
        doc.text(`Area: ${area}`, 10, 50);
        doc.text(`City: ${city}`, 10, 60);
        doc.text(`No of Floors: ${floors}`, 10, 70);
        doc.text(`Model: ${model}`, 10, 80);

        // Add more form data as needed
        // Example: doc.text(`Sales Person: ${document.getElementById('salesPerson').value}`, 10, 90);

        // Save the PDF with the specified filename
        doc.save(pdfTitle);
    };
}
