// Password Strength Checker Module
function initPasswordChecker() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleBtn = document.getElementById('toggleInputVisibility');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        checkPasswordStrength(password);
        checkPasswordInBreaches(password);
        updateBreachStatus();
    });
    
    // Real-time breach checking
    let debounceTimer;
    passwordInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (this.value.length > 3) {
                checkHaveIBeenPwned(this.value);
            }
        }, 500);
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
        strengthText.style.color = '#6b7280';
        requirements.innerHTML = '';
        return;
    }
    
    let score = 0;
    let feedback = [];
    const checks = [];
    
    // Length check
    if (password.length >= 8) score += 1;
    checks.push({
        text: 'At least 8 characters',
        met: password.length >= 8,
        weight: 1
    });
    
    if (password.length >= 12) {
        score += 1;
        checks.push({
            text: 'At least 12 characters (recommended)',
            met: true,
            weight: 1
        });
    } else {
        checks.push({
            text: 'At least 12 characters (recommended)',
            met: false,
            weight: 1
        });
    }
    
    // Character variety checks
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    
    if (hasLower && hasUpper) score += 1;
    checks.push({
        text: 'Both lowercase and uppercase letters',
        met: hasLower && hasUpper,
        weight: 1
    });
    
    if (hasNumber) score += 1;
    checks.push({
        text: 'At least one number',
        met: hasNumber,
        weight: 1
    });
    
    if (hasSymbol) score += 1;
    checks.push({
        text: 'At least one special character',
        met: hasSymbol,
        weight: 1
    });
    
    // Advanced checks
    const hasSequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
    const hasRepeated = /(.)\1{2,}/.test(password);
    const hasKeyboardPattern = /qwerty|asdfgh|zxcvbn|password|admin/i.test(password);
    const hasCommonWord = /\b(password|admin|welcome|qwerty|123456|letmein|monkey|dragon|baseball)\b/i.test(password);
    
    checks.push({
        text: 'No sequential characters (abc, 123)',
        met: !hasSequential,
        weight: 1
    });
    
    checks.push({
        text: 'No repeated characters (aaa, 111)',
        met: !hasRepeated,
        weight: 1
    });
    
    checks.push({
        text: 'No keyboard patterns',
        met: !hasKeyboardPattern,
        weight: 2
    });
    
    checks.push({
        text: 'No common dictionary words',
        met: !hasCommonWord,
        weight: 2
    });
    
    if (!hasSequential) score += 1;
    if (!hasRepeated) score += 1;
    if (!hasKeyboardPattern) score += 2;
    if (!hasCommonWord) score += 2;
    
    // Entropy calculation
    const entropy = calculateEntropy(password);
    checks.push({
        text: `High entropy (${entropy.toFixed(1)} bits)`,
        met: entropy >= 60,
        weight: 2
    });
    
    if (entropy >= 60) score += 2;
    if (entropy >= 80) score += 1;
    
    // Update strength bar
    const maxScore = 14; // Maximum possible score
    const percentage = Math.min((score / maxScore) * 100, 100);
    strengthBar.style.width = percentage + '%';
    
    // Set color and text based on strength
    let color, text, textColor;
    if (percentage < 40) {
        color = '#ef4444'; // Red
        text = 'Very Weak';
        textColor = '#dc2626';
        feedback.push('Add more characters and variety');
    } else if (percentage < 60) {
        color = '#f59e0b'; // Orange
        text = 'Weak';
        textColor = '#d97706';
        feedback.push('Consider adding special characters and numbers');
    } else if (percentage < 80) {
        color = '#3b82f6'; // Blue
        text = 'Good';
        textColor = '#2563eb';
        feedback.push('Good password! Make it longer for more security');
    } else {
        color = '#10b981'; // Green
        text = 'Strong';
        textColor = '#059669';
        feedback.push('Excellent password!');
    }
    
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `${text} (${Math.round(percentage)}%)`;
    strengthText.style.color = textColor;
    
    // Add feedback to strength text if any
    if (feedback.length > 0) {
        strengthText.textContent += ` - ${feedback[0]}`;
    }
    
    // Update requirements display
    updateRequirementsDisplay(checks);
    
    // Update time to crack estimate
    updateTimeToCrack(password, entropy, percentage);
    
    return { score: percentage, checks: checks };
}

function calculateEntropy(password) {
    // Calculate character set size
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;      // lowercase
    if (/[A-Z]/.test(password)) charsetSize += 26;      // uppercase
    if (/\d/.test(password)) charsetSize += 10;         // digits
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) charsetSize += 20; // symbols
    
    // If no character sets detected, assume lowercase only
    if (charsetSize === 0) charsetSize = 26;
    
    // Calculate entropy: log2(charsetSize^length)
    return Math.log2(Math.pow(charsetSize, password.length));
}

function updateRequirementsDisplay(checks) {
    const requirementsDiv = document.getElementById('requirements');
    requirementsDiv.innerHTML = '';
    
    // Sort checks by importance (weight) and status
    checks.sort((a, b) => {
        if (a.met !== b.met) return a.met ? 1 : -1;
        return b.weight - a.weight;
    });
    
    checks.forEach(check => {
        const div = document.createElement('div');
        div.className = `requirement ${check.met ? 'met' : 'unmet'}`;
        
        const icon = check.met ? 'check-circle' : 'times-circle';
        const iconColor = check.met ? '#10b981' : '#ef4444';
        
        div.innerHTML = `
            <i class="fas fa-${icon}" style="color: ${iconColor};"></i>
            <span>${check.text}</span>
            ${check.weight > 1 ? '<span class="weight-tag">Important</span>' : ''}
        `;
        
        requirementsDiv.appendChild(div);
    });
}

function updateTimeToCrack(password, entropy, strength) {
    // Estimate time to crack based on entropy and current computing power
    const guessesPerSecond = 1e10; // 10 billion guesses/second (modern GPU)
    const possibleCombinations = Math.pow(2, entropy);
    const secondsToCrack = possibleCombinations / guessesPerSecond;
    
    // Convert to human readable time
    let timeText = '';
    
    if (secondsToCrack < 1) {
        timeText = 'Instantly';
    } else if (secondsToCrack < 60) {
        timeText = `${Math.round(secondsToCrack)} seconds`;
    } else if (secondsToCrack < 3600) {
        timeText = `${Math.round(secondsToCrack / 60)} minutes`;
    } else if (secondsToCrack < 86400) {
        timeText = `${Math.round(secondsToCrack / 3600)} hours`;
    } else if (secondsToCrack < 31536000) {
        timeText = `${Math.round(secondsToCrack / 86400)} days`;
    } else if (secondsToCrack < 3153600000) {
        timeText = `${Math.round(secondsToCrack / 31536000)} years`;
    } else {
        timeText = 'Centuries';
    }
    
    // Display time to crack
    const timeDisplay = document.getElementById('timeToCrack') || createTimeToCrackDisplay();
    timeDisplay.textContent = `Estimated time to crack: ${timeText}`;
    
    // Color code based on time
    if (secondsToCrack < 3600) { // Less than 1 hour
        timeDisplay.style.color = '#ef4444';
    } else if (secondsToCrack < 31536000) { // Less than 1 year
        timeDisplay.style.color = '#f59e0b';
    } else {
        timeDisplay.style.color = '#10b981';
    }
}

function createTimeToCrackDisplay() {
    const strengthText = document.getElementById('strengthText');
    const timeDisplay = document.createElement('div');
    timeDisplay.id = 'timeToCrack';
    timeDisplay.className = 'time-to-crack';
    timeDisplay.style.marginTop = '10px';
    timeDisplay.style.fontSize = '0.9rem';
    timeDisplay.style.fontWeight = '600';
    
    strengthText.parentNode.insertBefore(timeDisplay, strengthText.nextSibling);
    return timeDisplay;
}

async function checkPasswordInBreaches(password) {
    const warningDiv = document.getElementById('securityWarning');
    
    if (!password || password.length < 4) {
        warningDiv.style.display = 'none';
        return;
    }
    
    // Very common passwords check
    const top100Passwords = [
        'password', '123456', '12345678', '1234', 'qwerty', '12345',
        'dragon', 'baseball', 'football', 'letmein', 'monkey', 'mustang',
        'michael', 'shadow', 'master', 'jennifer', '111111', '2000',
        'jordan', 'superman', 'harley', '1234567', 'fuckme', 'hunter',
        'fuckyou', 'trustno1', 'ranger', 'buster', 'thomas', 'tigger',
        'robert', 'soccer', 'batman', 'test', 'pass', 'killer', 'hockey',
        'george', 'charlie', 'andrew', 'michelle', 'love', 'sunshine',
        'jessica', 'asshole', '696969', 'pepper', 'daniel', 'access',
        '123456789', '654321', 'joshua', 'maggie', 'starwars', 'silver',
        'william', 'dallas', 'yankees', '123123', 'ashley', '666666',
        'hello', 'amanda', 'orange', 'biteme', 'freedom', 'computer',
        'sexy', 'thunder', 'nicole', 'ginger', 'heather', 'hammer',
        'summer', 'corvette', 'taylor', 'fucker', 'austin', '1111',
        'merlin', 'matthew', '121212', 'golfer', 'cheese', 'princess',
        'martin', 'chelsea', 'patrick', 'richard', 'diamond', 'yellow',
        'bigdog', 'secret', 'asdfgh', 'sparky', 'cowboy', 'mickey'
    ];
    
    if (top100Passwords.includes(password.toLowerCase())) {
        warningDiv.style.display = 'flex';
        warningDiv.querySelector('span').textContent = 
            '⚠️ This password is in the top 100 most breached passwords! Choose something more unique.';
        return;
    }
    
    // Check for common patterns
    if (password.length < 8) {
        warningDiv.style.display = 'flex';
        warningDiv.querySelector('span').textContent = 
            '⚠️ Very short passwords are easily cracked. Use at least 12 characters.';
    } else if (/^[a-z]+$/i.test(password) && !/\d/.test(password) && !/[^a-z0-9]/i.test(password)) {
        warningDiv.style.display = 'flex';
        warningDiv.querySelector('span').textContent = 
            '⚠️ Letters only. Add numbers and special characters for better security.';
    } else if (/^\d+$/.test(password)) {
        warningDiv.style.display = 'flex';
        warningDiv.querySelector('span').textContent = 
            '⚠️ Numbers only. Add letters and special characters.';
    } else {
        warningDiv.style.display = 'none';
    }
}

// Optional: Integration with HaveIBeenPwned API (k-Anonymity)
async function checkHaveIBeenPwned(password) {
    // IMPORTANT: Never send the actual password!
    // We only send the first 5 characters of the SHA-1 hash
    
    const warningDiv = document.getElementById('securityWarning');
    
    try {
        // Create SHA-1 hash of password
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Get first 5 chars (prefix) and remaining (suffix)
        const prefix = hashHex.substring(0, 5).toUpperCase();
        const suffix = hashHex.substring(5).toUpperCase();
        
        // Call HIBP API with only the prefix
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            headers: {
                'Add-Padding': 'true' // Optional: adds fake responses to prevent timing attacks
            }
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.text();
        const lines = data.split('\n');
        
        // Check if our suffix is in the response
        for (const line of lines) {
            const [lineSuffix, count] = line.split(':');
            if (lineSuffix === suffix) {
                warningDiv.style.display = 'flex';
                warningDiv.querySelector('span').textContent = 
                    `⚠️ This password has been exposed in ${parseInt(count).toLocaleString()} data breaches! Do not use it.`;
                return;
            }
        }
        
        // If we get here, password wasn't found in breaches
        console.log('Password not found in known breaches');
        
    } catch (error) {
        console.log('Error checking breaches:', error);
        // Don't show error to user to avoid confusion
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initPasswordChecker();
    
    // Add CSS for weight tag
    const style = document.createElement('style');
    style.textContent = `
        .weight-tag {
            background: #f59e0b;
            color: white;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 8px;
            font-weight: bold;
        }
        .time-to-crack {
            padding: 8px 12px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);
});
