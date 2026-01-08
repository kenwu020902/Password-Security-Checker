// Password Generator Module with Auto-Clear Feature
function initPasswordGenerator() {
    document.getElementById('generateBtn').addEventListener('click', generatePassword);
    document.getElementById('copyClearBtn').addEventListener('click', copyAndClearPassword);
}

function generatePassword() {
    const length = parseInt(document.getElementById('lengthSlider').value);
    const useUpper = document.getElementById('uppercase').checked;
    const useLower = document.getElementById('lowercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;
    
    // Validate at least one character set is selected
    if (!useUpper && !useLower && !useNumbers && !useSymbols) {
        showToast('❌ Please select at least one character type');
        return;
    }
    
    // Generate secure password using Web Crypto API
    const password = generateSecurePassword(length, useUpper, useLower, useNumbers, useSymbols);
    
    // Store password in memory (will be cleared later)
    window.currentPassword = password;
    
    // Display password (masked initially)
    document.getElementById('passwordText').textContent = '••••••••••••';
    
    // Update dashboard
    updateDashboard();
    
    showToast('✅ Secure password generated');
}

function generateSecurePassword(length, upper, lower, numbers, symbols) {
    const charset = [];
    let password = '';
    
    // Define character sets
    const upperSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerSet = 'abcdefghijklmnopqrstuvwxyz';
    const numberSet = '0123456789';
    const symbolSet = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Build charset based on selections
    if (upper) charset.push(...upperSet);
    if (lower) charset.push(...lowerSet);
    if (numbers) charset.push(...numberSet);
    if (symbols) charset.push(...symbolSet);
    
    // Use cryptographically secure random numbers
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
        password += charset[randomValues[i] % charset.length];
    }
    
    return password;
}

function copyAndClearPassword() {
    if (!window.currentPassword) {
        showToast('❌ No password to copy');
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(window.currentPassword)
        .then(() => {
            showToast('✅ Password copied to clipboard!');
            
            // Immediately clear from memory
            clearPasswordFromMemory();
            
            // Hide the password display
            document.getElementById('passwordText').textContent = '••••••••••••';
            document.getElementById('toggleVisibility').innerHTML = '<i class="fas fa-eye"></i>';
            
            // Clear timer
            clearAutoHideTimer();
            document.getElementById('timerDisplay').style.display = 'none';
            
            // Update dashboard
            updateDashboard();
            
            // Show security message
            setTimeout(() => {
                showToast('🔒 Password cleared from memory for security');
            }, 1000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showToast('❌ Failed to copy to clipboard');
        });
}

function clearPasswordFromMemory() {
    // Overwrite the password variable with null
    if (window.currentPassword) {
        window.currentPassword = null;
        
        // Force garbage collection hint
        if (window.gc) {
            window.gc();
        }
    }
}

// Export functions
window.generatePassword = generatePassword;
window.copyAndClearPassword = copyAndClearPassword;
window.clearPasswordFromMemory = clearPasswordFromMemory;
