// Define your PDF document with jsPDF
const pdf = new jsPDF();
const logoImg = 'path/to/logo.png';  // Use the actual path or base64 encoded image for the logo

// Set positions
let yPos = 10;

// Add Logo
pdf.addImage(logoImg, 'PNG', 10, yPos, 30, 30);
yPos += 40;  // Adjust Y position after logo

// Add Title
pdf.setFontSize(16);
pdf.text("Brio Elevators OTF Form", pdf.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
yPos += 10;

// Add Sales Team Heading
pdf.setFontSize(14);
pdf.text("Sales Team", pdf.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
yPos += 10;

// Add Sales Team Fields
pdf.setFontSize(12);
pdf.text(`Sales Person: ${salesPerson}`, 10, yPos);
yPos += 10;
pdf.text(`Team Leader Involved: ${teamLeader}`, 10, yPos);
yPos += 10;
pdf.text(`Referred by: ${referredBy}`, 10, yPos);
yPos += 15;

// Add Customer Details Heading
pdf.setFontSize(14);
pdf.text("Customer Details", pdf.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
yPos += 10;

// Customer Details Fields
pdf.setFontSize(12);
pdf.text(`Customer Name: ${customerName}`, 10, yPos);
yPos += 10;
pdf.text(`Area: ${area}`, 10, yPos);
yPos += 10;
// Add additional fields similarly

// Function to handle page breaks if yPos exceeds the page height
function checkPageOverflow() {
    if (yPos > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30); // Repeat the logo on each new page
        yPos = 50;  // Reset yPos after adding new page
    }
}

// Check for each section and field dynamically
checkPageOverflow();

// Similarly, add Order Details, Cabin Details, Additional Features, COP/LOP Details, Terms of Sale, Scope of Work, and Photos

// Final section with remarks
checkPageOverflow();
pdf.text(`Additional Remarks: ${remarks}`, 10, yPos);

// Dynamically set file name
const pdfTitle = `${customerName}-OTF-${city}-${area}-${floors}-${model}.pdf`;
pdf.save(pdfTitle);
