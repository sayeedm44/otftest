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
    const salesPerson = document.getElementById('salesPerson').value;
    const teamLeader = document.getElementById('teamLeader').value;
    const billingAddress = document.getElementById('billingAddress').value;
    const shippingAddress = document.getElementById('shippingAddress').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const email = document.getElementById('email').value;
    const alternateContactName = document.getElementById('alternateContactName').value;
    const alternateContactNumber = document.getElementById('alternateContactNumber').value;
    const finalQuotation = document.getElementById('finalQuotation').value;
    const orderTakenDate = document.getElementById('orderTakenDate').value;
    const deliveryMonths = document.getElementById('deliveryMonths').value;
    const cashAccountCommitments = document.getElementById('cashAccountCommitments').value;
    const structure = document.getElementById('Structure').value;
    const structureColor = document.getElementById('structureColor').value;
    const structureCovering = document.getElementById('structurecovering').value;
    const installationType = document.getElementById('installationType').value;
    const shaftWidth = document.getElementById('shaftWidth').value;
    const shaftDepth = document.getElementById('shaftDepth').value;
    const pit = document.getElementById('pit').value;
    const headroom = document.getElementById('headroom').value;
    const travelHeight = document.getElementById('travelHeight').value;
    const floorToFloorDistance = document.getElementById('floorToFloorDistance').value;
    const payload = document.getElementById('payload').value;
    const cabinType = document.getElementById('cabinType').value;
    const glassWall = document.getElementById('glassWall').value;
    const handrail = document.getElementById('handrail').value;
    const ceiling = document.getElementById('ceiling').value;
    const safetyAlarm = document.getElementById('SafetyAlarm').value;
    const intercomPhone = document.getElementById('IntercomPhone').value;
    const voiceAnnouncer = document.getElementById('VoiceAnnouncer').value;
    const copLop = document.getElementById('copLop').value;
    const copLopColor = document.getElementById('copLopColor').value;
    const authentication = document.getElementById('authentication').value;
    const authenticationNeed = document.getElementById('authenticationNeed').value;
    const remarks = document.getElementById('remarks').value;

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
        
        // Create an array of all the data to be added
        const formData = [
            `Customer Name: ${customerName}`,
            `Area: ${area}`,
            `City: ${city}`,
            `Floors: ${floors}`,
            `Model: ${model}`,
            `Sales Person: ${salesPerson}`,
            `Team Leader: ${teamLeader}`,
            `Billing Address: ${billingAddress}`,
            `Shipping Address: ${shippingAddress}`,
            `Contact Number: ${contactNumber}`,
            `Email: ${email}`,
            `Alternate Contact Name: ${alternateContactName}`,
