// Security Dashboard Module
function initSecurityDashboard() {
    updateDashboard();
    
    // Update dashboard periodically
    setInterval(updateDashboard, 5000);
}

function updateDashboard() {
    updateMemoryStatus();
    updateClipboardStatus();
    updateDisplayStatus();
    updateBreachStatus();
    updateRecommendations();
}

function updateMemoryStatus() {
    const memoryCard = document.getElementById('memoryStatus').querySelector('.status');
    
    if (window.currentPassword) {
        memoryCard.className = 'status danger';
        memoryCard.textContent = '✗ Password in memory';
    } else {
        memoryCard.className = 'status safe';
        memoryCard.textContent = '✓ Password cleared from memory';
    }
}

function updateClipboardStatus() {
    const clipboardCard = document.getElementById('clipboardStatus').querySelector('.status');
    
    // We can't directly read clipboard for security reasons
    // This is a simulated status
    if (window.clipboardHasPassword) {
        clipboardCard.className = 'status warning';
        clipboardCard.textContent = '⚠️ Password in system clipboard';
    } else {
        clipboardCard.className = 'status safe';
        clipboardCard.textContent = '✓ Clipboard cleared';
    }
}

function updateDisplayStatus() {
    const displayCard = document.getElementById('displayStatus').querySelector('.status');
    const passwordText = document.getElementById('passwordText').textContent;
    
    if (passwordText.includes('••••') || !window.currentPassword) {
        displayCard.className = 'status safe';
        displayCard.textContent = '✓ Password hidden';
    } else {
        displayCard.className = 'status warning';
        displayCard.textContent = '⚠️ Password visible on screen';
    }
}

function updateBreachStatus() {
    const breachCard = document.getElementById('breachStatus').querySelector('.status');
    const passwordInput = document.getElementById('passwordInput').value;
    
    // Mock breach check
    if (passwordInput && passwordInput.length < 6) {
        breachCard.className = 'status danger';
        breachCard.textContent = '✗ Similar to breached passwords';
    } else if (passwordInput) {
        breachCard.className = 'status safe';
        breachCard.textContent = '✓ No breaches detected';
    } else {
        breachCard.className = 'status safe';
        breachCard.textContent = '✓ No password to check';
    }
}

function updateRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    const recommendations = [];
    
    // Check memory status
    if (window.currentPassword) {
        recommendations.push('Clear the generated password from memory using "Copy & Clear"');
    }
    
    // Check display status
    const passwordText = document.getElementById('passwordText').textContent;
    if (!passwordText.includes('••••') && window.currentPassword) {
        recommendations.push('Hide the displayed password for security');
    }
    
    // Check password strength if checking one
    const passwordInput = document.getElementById('passwordInput').value;
    if (passwordInput) {
        if (passwordInput.length < 8) {
            recommendations.push('Use passwords with at least 8
