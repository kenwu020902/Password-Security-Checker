// Password Strength Checker Module
function initPasswordChecker() {
    const passwordInput = document.getElementById('passwordInput');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        checkPasswordStrength(password);
        checkPasswordInBreaches(password);
    });
}

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const requirements = document.getElementById('requirements');
    
    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '#e5e7eb';
        strengthText.textContent = 'Enter a password';
        requirements.innerHTML = '';
        return;
    }
    
    let score = 0;
    const checks = [];
    
    // Length check
    if (password.length >= 8) score += 1;
    checks.push({
        text: 'At least 8 characters',
        met: password.length >= 8
    });
    
    if (password.length >= 12) score += 1;
    checks.push({
        text: 'At least 12 characters (recommended)',
        met: password.length >= 12
    });
    
    // Character variety checks
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    
    if (hasLower && hasUpper) score += 1;
    checks.push({
        text: 'Both lowercase and uppercase letters',
        met: hasLower && hasUpper
    });
    
    if (hasNumber) score += 1;
    checks.push({
        text: 'At least one number',
        met: hasNumber
    });
    
    if (hasSymbol) score += 1;
    checks.push({
        text: 'At least one special character',
        met: hasSymbol
    });
    
    // Entropy calculation
    const entropy = calculateEntropy(password);
    checks.push({
        text: `High entropy (${entropy.toFixed(1)} bits)`,
        met: entropy >= 60
    });
    
    if (entropy >= 60) score += 1;
    if (entropy >= 80) score += 1;
    
    // No common patterns
    const hasPattern = /(.)\1{2,}|123|abc|qwerty|password/i.test(password);
    checks.push({
        text: 'No common patterns or repeated characters',
        met: !hasPattern
    });
    
    if (!hasPattern) score += 1;
    
    // Update strength bar
    const percentage = Math.min((score / 9) * 100, 100);
    strengthBar.style.width = percentage + '%';
    
    // Set color based on strength
    let color, text;
    if (percentage < 40) {
        color = '#ef4444';
        text = 'Very Weak';
    } else if (percentage < 60) {
        color = '#f59e0b';
        text = 'Weak';
    } else if (percentage < 80) {
        color = '#3b82f6';
        text = 'Good';
    } else {
        color = '#10b981';
        text = 'Strong';
    }
    
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `${text} (${Math.round(percentage)}%)`;
    
    // Update requirements display
    updateRequirementsDisplay(checks);
}

function calculateEntropy(password) {
    // Calculate character set size
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/\d/.test(password)) charsetSize += 10;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) charsetSize += 20;
    
    // Calculate entropy
    return Math.log2(Math.pow(charsetSize, password.length));
}

function updateRequirementsDisplay(checks) {
    const requirementsDiv = document.getElementById('requirements');
    requirementsDiv.innerHTML = '';
    
    checks.forEach(check => {
        const div = document.createElement('div');
        div.className = `requirement ${check.met ? 'met' : 'unmet'}`;
        div.innerHTML = `
            <i class="fas fa-${check.met ? 'check-circle' : 'times-circle'}"></i>
            <span>${check.text}</span>
        `;
        requirementsDiv.appendChild(div);
    });
}

async function checkPasswordInBreaches(password) {
    // Note: In a real application, NEVER send actual passwords to a server
    // This is a mock implementation for demonstration
    
    // For real implementation, use k-Anonymity with HaveIBeenPwned API
    // Example: Send only first 5 characters of SHA-1 hash
    
    const warningDiv = document.getElementById('securityWarning');
    
    // Mock check - in reality, this would be an API call
    const commonPasswords = [
        'password', '123456', 'qwerty', 'letmein', 'welcome',
        'admin', 'password123', '123456789', '12345678'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
        warningDiv.style.display = 'flex';
        warningDiv.querySelector('span').textContent = 
            'This password is extremely common and has been exposed in many breaches!';
    } else if (password.length < 6) {
        warningDiv.style.display = 'flex';
        warningDiv.querySelector('span').textContent = 
            'Very short passwords are easily guessed';
    } else {
        warningDiv.style.display = 'none';
    }
}
