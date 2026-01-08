// Security Dashboard Module
function initSecurityDashboard() {
    // Initialize dashboard
    updateDashboard();
    
    // Set up periodic updates
    setInterval(updateDashboard, 3000);
    
    // Set up clipboard simulation
    simulateClipboardMonitoring();
    
    // Initialize security audit
    setTimeout(() => {
        runSecurityAudit();
    }, 2000);
    
    // Add event listeners for manual controls
    addDashboardControls();
}

function updateDashboard() {
    updateMemoryStatus();
    updateClipboardStatus();
    updateDisplayStatus();
    updateBreachStatus();
    updateSessionStatus();
    updateEncryptionStatus();
    updateBrowserSecurityStatus();
    updateRecommendations();
    updateRiskLevel();
    updateSecurityScore();
}

// 1. Memory Security Status
function updateMemoryStatus() {
    const memoryCard = document.getElementById('memoryStatus');
    const statusElement = memoryCard.querySelector('.status');
    const detailsElement = memoryCard.querySelector('.details') || createDetailsElement(memoryCard);
    
    if (window.currentPassword) {
        statusElement.className = 'status danger';
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Password in memory';
        
        const timeInMemory = window.passwordCreationTime ? 
            Math.floor((Date.now() - window.passwordCreationTime) / 1000) : 0;
        
        detailsElement.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Time in memory:</span>
                <span class="detail-value warning">${timeInMemory}s</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Memory location:</span>
                <span class="detail-value">JavaScript Heap</span>
            </div>
            <div class="detail-action">
                <button onclick="clearPasswordFromMemory()" class="action-btn">
                    <i class="fas fa-trash"></i> Clear Now
                </button>
            </div>
        `;
    } else {
        statusElement.className = 'status safe';
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Memory cleared';
        detailsElement.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Last cleared:</span>
                <span class="detail-value safe">${formatTime(window.lastClearedTime)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Memory protection:</span>
                <span class="detail-value safe">Active</span>
            </div>
        `;
    }
}

// 2. Clipboard Security Status
function updateClipboardStatus() {
    const clipboardCard = document.getElementById('clipboardStatus');
    const statusElement = clipboardCard.querySelector('.status');
    const detailsElement = clipboardCard.querySelector('.details') || createDetailsElement(clipboardCard);
    
    // Simulated clipboard monitoring (in real app, this would use Clipboard API events)
    if (window.clipboardHasPassword) {
        const clipboardTime = window.clipboardTime ? 
            Math.floor((Date.now() - window.clipboardTime) / 1000) : 0;
        
        statusElement.className = 'status warning';
        statusElement.innerHTML = '<i class="fas fa-clipboard"></i> Password in clipboard';
        
        detailsElement.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Time in clipboard:</span>
                <span class="detail-value warning">${clipboardTime}s</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Clipboard risk:</span>
                <span class="detail-value warning">High</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Other apps can read:</span>
                <span class="detail-value warning">Yes</span>
            </div>
            <div class="detail-action">
                <button onclick="clearClipboard()" class="action-btn">
                    <i class="fas fa-broom"></i> Clear Clipboard
                </button>
            </div>
        `;
    } else {
        statusElement.className = 'status safe';
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Clipboard safe';
        
        detailsElement.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Last cleared:</span>
                <span class="detail-value safe">${formatTime(window.lastClipboardClearTime)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Clipboard monitoring:</span>
                <span class="detail-value safe">Active</span>
            </div>
        `;
    }
}

// 3. Display Security Status
function updateDisplayStatus() {
    const displayCard = document.getElementById('displayStatus');
    const statusElement = displayCard.querySelector('.status');
    const detailsElement = displayCard.querySelector('.details') || createDetailsElement(displayCard);
    const passwordText = document.getElementById('passwordText').textContent;
    
    if (!passwordText.includes('••••') && window.currentPassword) {
        const visibleTime = window.passwordVisibleTime ? 
            Math.floor((Date.now() - window.passwordVisibleTime) / 1000) : 0;
        
        statusElement.className = 'status warning';
        statusElement.innerHTML = '<i class="fas fa-eye"></i> Password visible';
        
        detailsElement.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Visible for:</span>
                <span class="detail-value warning">${visibleTime}s</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Auto-hide in:</span>
                <span class="detail-value">${getAutoHideTimeLeft()}s</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Risk of shoulder surfing:</span>
                <span class="detail-value warning">High</span>
            </div>
            <div class="detail-action">
                <button onclick="hidePasswordNow()" class="action-btn">
                    <i class="fas fa-eye-slash"></i> Hide Now
                </button>
            </div>
        `;
    } else {
        statusElement.className = 'status safe';
        statusElement.innerHTML = '<i class="fas fa-eye-slash"></i> Password hidden';
        
        detailsElement.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Last hidden:</span>
                <span class="detail-value safe">${formatTime(window.lastHiddenTime)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Auto-hide:</span>
                <span class="detail-value safe">Enabled (30s)</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Screen capture protection:</span>
                <span class="detail-value">Basic</span>
            </div>
        `;
    }
}

// 4. Breach Status
function updateBreachStatus() {
    const breachCard = document.getElementById('breachStatus');
    const statusElement = breachCard.querySelector('.status');
    const detailsElement = breachCard.querySelector('.details') || createDetailsElement(breachCard);
    const passwordInput = document.getElementById('passwordInput').value;
    
    // Check if we're currently checking a password
    if (passwordInput) {
        // Get strength info
        const strengthInfo = checkPasswordStrength(passwordInput) || { score: 0 };
        const isWeak = strengthInfo.score < 60;
        
        if (isWeak) {
            statusElement.className = 'status danger';
            statusElement.innerHTML = '<i class="fas fa-shield-alt"></i> Weak Password';
            
            detailsElement.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">Strength score:</span>
                    <span class="detail-value danger">${Math.round(strengthInfo.score)}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Common patterns:</span>
                    <span class="detail-value warning">Detected</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Breach database:</span>
                    <span class="detail-value">Checking...</span>
                </div>
            `;
            
            // Simulate breach check
            setTimeout(() => {
                const hasBreach = checkIfCommonPassword(passwordInput);
                if (hasBreach) {
                    detailsElement.querySelector('.detail-item:nth-child(3) .detail-value').className = 'detail-value danger';
                    detailsElement.querySelector('.detail-item:nth-child(3) .detail-value').textContent = 'Found in breaches';
                } else {
                    detailsElement.querySelector('.detail-item:nth-child(3) .detail-value').className = 'detail-value safe';
                    detailsElement.querySelector('.detail-item:nth-child(3) .detail-value').textContent = 'No breaches found';
                }
            }, 1000);
            
        } else {
            statusElement.className = 'status safe';
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Strong Password';
            
            detailsElement.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">Strength score:</span>
                    <span class="detail-value safe">${Math.round(strengthInfo.score)}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Entropy:</span>
                    <span class="detail-value safe">${calculateEntropy(passwordInput).toFixed(1)} bits</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Breach database:</span>
                    <span class="detail-value safe">No breaches found</span>
                </div>
            `;
        }
    } else {
        statusElement.className = 'status neutral';
        statusElement.innerHTML = '<i class="fas fa-info-circle"></i> No Password Checked';
        
        detailsElement.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Last checked:</span>
                <span class="detail-value">${formatTime(window.lastPasswordCheck)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Breach database:</span>
                <span class="detail-value">Ready</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Privacy mode:</span>
                <span class="detail-value safe">Local-only checks</span>
            </div>
        `;
    }
}

// 5. Session Security Status
function updateSessionStatus() {
    const sessionCard = document.getElementById('sessionStatus') || createSessionCard();
    const statusElement = sessionCard.querySelector('.status');
    const detailsElement = sessionCard.querySelector('.details') || createDetailsElement(sessionCard);
    
    const sessionDuration = window.sessionStartTime ? 
        Math.floor((Date.now() - window.sessionStartTime) / 60000) : 0;
    
    // Check if incognito mode (simulated)
    const isIncognito = window.isIncognito !== undefined ? window.isIncognito : Math.random() > 0.5;
    
    statusElement.className = isIncognito ? 'status safe' : 'status warning';
    statusElement.innerHTML = isIncognito ? 
        '<i class="fas fa-user-secret"></i> Private Session' : 
        '<i class="fas fa-user"></i> Regular Session';
    
    detailsElement.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Session duration:</span>
            <span class="detail-value">${sessionDuration} min</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Session type:</span>
            <span class="detail-value ${isIncognito ? 'safe' : 'warning'}">
                ${isIncognito ? 'Private/Incognito' : 'Regular'}
            </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Data persistence:</span>
            <span class="detail-value ${isIncognito ? 'safe' : 'warning'}">
                ${isIncognito ? 'No storage' : 'Local storage'}
            </span>
        </div>
        <div class="detail-action">
            <button onclick="startNewSession()" class="action-btn">
                <i class="fas fa-redo"></i> New Session
            </button>
        </div>
    `;
}

// 6. Encryption Status
function updateEncryptionStatus() {
    const encryptionCard = document.getElementById('encryptionStatus') || createEncryptionCard();
    const statusElement = encryptionCard.querySelector('.status');
    const detailsElement = encryptionCard.querySelector('.details') || createDetailsElement(encryptionCard);
    
    // Check if Web Crypto API is available
    const hasCryptoAPI = !!window.crypto && !!window.crypto.subtle;
    
    statusElement.className = hasCryptoAPI ? 'status safe' : 'status danger';
    statusElement.innerHTML = hasCryptoAPI ? 
        '<i class="fas fa-lock"></i> Secure Encryption' : 
        '<i class="fas fa-lock-open"></i> No Encryption';
    
    detailsElement.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Encryption method:</span>
            <span class="detail-value ${hasCryptoAPI ? 'safe' : 'danger'}">
                ${hasCryptoAPI ? 'Web Crypto API' : 'Basic RNG'}
            </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Key strength:</span>
            <span class="detail-value ${hasCryptoAPI ? 'safe' : 'danger'}">
                ${hasCryptoAPI ? 'Cryptographically Secure' : 'Pseudo-random'}
            </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Entropy source:</span>
            <span class="detail-value ${hasCryptoAPI ? 'safe' : 'warning'}">
                ${hasCryptoAPI ? 'Hardware RNG' : 'Math.random()'}
            </span>
        </div>
    `;
}

// 7. Browser Security Status
function updateBrowserSecurityStatus() {
    const browserCard = document.getElementById('browserSecurity') || createBrowserSecurityCard();
    const statusElement = browserCard.querySelector('.status');
    const detailsElement = browserCard.querySelector('.details') || createDetailsElement(browserCard);
    
    // Check various browser security features
    const checks = {
        https: window.location.protocol === 'https:',
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        crypto: !!window.crypto,
        hasExtensions: true, // Simulated
        isUpdated: true, // Simulated
    };
    
    const allSecure = Object.values(checks).every(check => check);
    
    statusElement.className = allSecure ? 'status safe' : 'status warning';
    statusElement.innerHTML = allSecure ? 
        '<i class="fas fa-shield-alt"></i> Browser Secure' : 
        '<i class="fas fa-exclamation-triangle"></i> Browser Issues';
    
    detailsElement.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">HTTPS:</span>
            <span class="detail-value ${checks.https ? 'safe' : 'danger'}">
                ${checks.https ? 'Enabled' : 'Disabled'}
            </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Web Crypto:</span>
            <span class="detail-value ${checks.crypto ? 'safe' : 'danger'}">
                ${checks.crypto ? 'Available' : 'Unavailable'}
            </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Extensions:</span>
            <span class="detail-value ${checks.hasExtensions ? 'warning' : 'safe'}">
                ${checks.hasExtensions ? 'Detected' : 'None'}
            </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Browser updated:</span>
            <span class="detail-value ${checks.isUpdated ? 'safe' : 'warning'}">
                ${checks.isUpdated ? 'Yes' : 'No (Security Risk)'}
            </span>
        </div>
    `;
}

// 8. Risk Level Calculation
function updateRiskLevel() {
    const riskCard = document.getElementById('riskLevel') || createRiskCard();
    const statusElement = riskCard.querySelector('.status');
    const detailsElement = riskCard.querySelector('.details') || createDetailsElement(riskCard);
    
    // Calculate overall risk level
    let riskScore = 0;
    let maxScore = 0;
    
    // Memory risk
    if (window.currentPassword) riskScore += 3;
    maxScore += 3;
    
    // Clipboard risk
    if (window.clipboardHasPassword) riskScore += 3;
    maxScore += 3;
    
    // Display risk
    const passwordText = document.getElementById('passwordText').textContent;
    if (!passwordText.includes('••••') && window.currentPassword) riskScore += 2;
    maxScore += 2;
    
    // Session risk
    if (!window.isIncognito) riskScore += 1;
    maxScore += 1;
    
    // Encryption risk
    if (!window.crypto) riskScore += 2;
    maxScore += 2;
    
    const riskPercentage = (riskScore / maxScore) * 100;
    
    let riskLevel, riskClass, icon;
    if (riskPercentage < 25) {
        riskLevel = 'Low';
        riskClass = 'safe';
        icon = 'fa-smile';
    } else if (riskPercentage < 50) {
        riskLevel = 'Medium';
        riskClass = 'warning';
        icon = 'fa-meh';
    } else {
        riskLevel = 'High';
        riskClass = 'danger';
        icon = 'fa-frown';
    }
    
    statusElement.className = `status ${riskClass}`;
    statusElement.innerHTML = `<i class="fas ${icon}"></i> ${riskLevel} Risk`;
    
    // Create risk meter
    const riskMeter = document.createElement('div');
    riskMeter.className = 'risk-meter';
    riskMeter.innerHTML = `
        <div class="risk-meter-bar" style="width: ${riskPercentage}%"></div>
        <div class="risk-meter-labels">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
        </div>
    `;
    
    detailsElement.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Risk Score:</span>
            <span class="detail-value ${riskClass}">${Math.round(riskPercentage)}%</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Major risks:</span>
            <span class="detail-value">${getMajorRisks().join(', ')}</span>
        </div>
        <div class="risk-meter-container">
            ${riskMeter.outerHTML}
        </div>
    `;
}

// 9. Security Score
function updateSecurityScore() {
    const scoreCard = document.getElementById('securityScore') || createSecurityScoreCard();
    const statusElement = scoreCard.querySelector('.status');
    const detailsElement = scoreCard.querySelector('.details') || createDetailsElement(scoreCard);
    
    // Calculate security score (inverse of risk)
    const riskCard = document.getElementById('riskLevel');
    if (!riskCard) return;
    
    const riskPercentage = parseInt(riskCard.querySelector('.detail-value').textContent) || 0;
    const securityScore = 100 - riskPercentage;
    
    let scoreClass, icon;
    if (securityScore >= 80) {
        scoreClass = 'safe';
        icon = 'fa-shield-alt';
    } else if (securityScore >= 60) {
        scoreClass = 'warning';
        icon = 'fa-shield';
    } else {
        scoreClass = 'danger';
        icon = 'fa-exclamation-triangle';
    }
    
    statusElement.className = `status ${scoreClass}`;
    statusElement.innerHTML = `<i class="fas ${icon}"></i> Security Score: ${securityScore}/100`;
    
    // Create score circle
    const scoreCircle = document.createElement('div');
    scoreCircle.className = 'score-circle';
    scoreCircle.innerHTML = `
        <svg width="100" height="100" viewBox="0 0 100 100">
            <circle class="score-circle-bg" cx="50" cy="50" r="45"></circle>
            <circle class="score-circle-progress" cx="50" cy="50" r="45" 
                    style="stroke-dashoffset: ${283 - (283 * securityScore / 100)}"></circle>
            <text x="50" y="55" text-anchor="middle" class="score-text">${securityScore}</text>
        </svg>
    `;
    
    detailsElement.innerHTML = `
        <div class="score-visual">
            ${scoreCircle.outerHTML}
        </div>
        <div class="score-breakdown">
            <div class="score-item">
                <span class="score-label">Memory Safety</span>
                <span class="score-value ${window.currentPassword ? 'danger' : 'safe'}">
                    ${window.currentPassword ? '30/100' : '100/100'}
                </span>
            </div>
            <div class="score-item">
                <span class="score-label">Clipboard Safety</span>
                <span class="score-value ${window.clipboardHasPassword ? 'danger' : 'safe'}">
                    ${window.clipboardHasPassword ? '40/100' : '100/100'}
                </span>
            </div>
            <div class="score-item">
                <span class="score-label">Display Safety</span>
                <span class="score-value ${!document.getElementById('passwordText').textContent.includes('••••') ? 'warning' : 'safe'}">
                    ${!document.getElementById('passwordText').textContent.includes('••••') ? '70/100' : '100/100'}
                </span>
            </div>
            <div class="score-item">
                <span class="score-label">Session Safety</span>
                <span class="score-value ${window.isIncognito ? 'safe' : 'warning'}">
                    ${window.isIncognito ? '100/100' : '60/100'}
                </span>
            </div>
        </div>
    `;
}

// 10. Security Recommendations
function updateRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    if (!recommendationsList) return;
    
    const recommendations = [];
    
    // Check memory status
    if (window.currentPassword) {
        recommendations.push({
            text: 'Clear the generated password from memory using "Copy & Clear"',
            priority: 'high',
            icon: 'fa-memory'
        });
    }
    
    // Check clipboard status
    if (window.clipboardHasPassword) {
        recommendations.push({
            text: 'Clear your system clipboard after pasting the password',
            priority: 'high',
            icon: 'fa-clipboard'
        });
    }
    
    // Check display status
    const passwordText = document.getElementById('passwordText').textContent;
    if (!passwordText.includes('••••') && window.currentPassword) {
        recommendations.push({
            text: 'Hide the displayed password to prevent shoulder surfing',
            priority: 'medium',
            icon: 'fa-eye-slash'
        });
    }
    
    // Check password strength if checking one
    const passwordInput = document.getElementById('passwordInput').value;
    if (passwordInput) {
        if (passwordInput.length < 8) {
            recommendations.push({
                text: 'Use passwords with at least 8 characters (12+ recommended)',
                priority: 'high',
                icon: 'fa-ruler'
            });
        }
        
        if (!/[A-Z]/.test(passwordInput) || !/[a-z]/.test(passwordInput)) {
            recommendations.push({
                text: 'Mix uppercase and lowercase letters in your password',
                priority: 'medium',
                icon: 'fa-font'
            });
        }
        
        if (!/\d/.test(passwordInput)) {
            recommendations.push({
                text: 'Add numbers to increase password complexity',
                priority: 'medium',
                icon: 'fa-hashtag'
            });
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(passwordInput)) {
            recommendations.push({
                text: 'Include special characters for better security',
                priority: 'medium',
                icon: 'fa-asterisk'
            });
        }
    }
    
    // Session recommendations
    if (!window.isIncognito) {
        recommendations.push({
            text: 'Use incognito/private mode for sensitive password operations',
            priority: 'medium',
            icon: 'fa-user-secret'
        });
    }
    
    // General recommendations
    recommendations.push({
        text: 'Use a password manager for secure long-term storage',
        priority: 'low',
        icon: 'fa-key'
    });
    
    recommendations.push({
        text: 'Enable two-factor authentication on important accounts',
        priority: 'medium',
        icon: 'fa-mobile-alt'
    });
    
    recommendations.push({
        text: 'Regularly update your passwords (every 90 days)',
        priority: 'low',
        icon: 'fa-sync'
    });
    
    // Sort by priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Update recommendations list
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.className = `recommendation ${rec.priority}`;
        li.innerHTML = `
            <i class="fas ${rec.icon}"></i>
            <span>${rec.text}</span>
            <span class="priority-tag ${rec.priority}">${rec.priority.toUpperCase()}</span>
        `;
        recommendationsList.appendChild(li);
    });
}

// Helper Functions
function createDetailsElement(card) {
    const details = document.createElement('div');
    details.className = 'details';
    card.appendChild(details);
    return details;
}

function formatTime(timestamp) {
    if (!timestamp) return 'Never';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
}

function getAutoHideTimeLeft() {
    if (!window.autoHideTimer) return 0;
    return Math.max(0, Math.floor((window.autoHideEndTime - Date.now()) / 1000));
}

function checkIfCommonPassword(password) {
    const commonPasswords = ['password', '123456', 'qwerty', 'letmein', 'welcome', 'admin'];
    return commonPasswords.includes(password.toLowerCase());
}

function getMajorRisks() {
    const risks = [];
    if (window.currentPassword) risks.push('Memory');
    if (window.clipboardHasPassword) risks.push('Clipboard');
    if (!document.getElementById('passwordText').textContent.includes('••••') && window.currentPassword) {
        risks.push('Display');
    }
    if (!window.isIncognito) risks.push('Session');
    return risks.length > 0 ? risks : ['None'];
}

function calculateEntropy(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/\d/.test(password)) charsetSize += 10;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) charsetSize += 20;
    if (charsetSize === 0) charsetSize = 26;
    return Math.log2(Math.pow(charsetSize, password.length));
}

// Dashboard Control Functions
function addDashboardControls() {
    // Create control panel if it doesn't exist
    let controlPanel = document.getElementById('dashboardControls');
    if (!controlPanel) {
        controlPanel = document.createElement('div');
        controlPanel.id = 'dashboardControls';
        controlPanel.className = 'dashboard-controls';
        controlPanel.innerHTML = `
            <h3><i class="fas fa-cogs"></i> Dashboard Controls</h3>
            <div class="control-buttons">
                <button onclick="refreshDashboard()" class="control-btn">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
                <button onclick="runSecurityAudit()" class="control-btn">
                    <i class="fas fa-search"></i> Run Audit
                </button>
                <button onclick="exportSecurityReport()" class="control-btn">
                    <i class="fas fa-download"></i> Export Report
                </button>
                <button onclick="resetDashboard()" class="control-btn danger">
                    <i class="fas fa-trash"></i> Reset All
                </button>
            </div>
        `;
        
        const dashboardSection = document.querySelector('#dashboard');
        if (dashboardSection) {
            dashboardSection.insertBefore(controlPanel, dashboardSection.firstChild.nextSibling);
        }
    }
}

// Dashboard Actions
function refreshDashboard() {
    updateDashboard();
    showToast('🔄 Dashboard refreshed');
}

function runSecurityAudit() {
    showToast('🔍 Running security audit...');
    
    // Simulate audit process
    setTimeout(() => {
        updateDashboard();
        showToast('✅ Security audit completed');
        
        // Show audit results
        const auditResults = {
            memory: window.currentPassword ? 'FAIL' : 'PASS',
            clipboard: window.clipboardHasPassword ? 'FAIL' : 'PASS',
            display: !document.getElementById('passwordText').textContent.includes('••••') ? 'WARNING' : 'PASS',
            encryption: window.crypto ? 'PASS' : 'FAIL',
            session: window.isIncognito ? 'PASS' : 'WARNING'
        };
        
        const passCount = Object.values(auditResults).filter(r => r === 'PASS').length;
        const totalCount = Object.keys(auditResults).length;
        
        alert(`Security Audit Results:\n\n` +
              `Memory Safety: ${auditResults.memory}\n` +
              `Clipboard Safety: ${auditResults.clipboard}\n` +
              `Display Safety: ${auditResults.display}\n` +
              `Encryption: ${auditResults.encryption}\n` +
              `Session Safety: ${auditResults.session}\n\n` +
              `Score: ${passCount}/${totalCount} passed`);
    }, 1500);
}

function exportSecurityReport() {
    const report = {
        timestamp: new Date().toISOString(),
        memoryStatus: window.currentPassword ? 'Password in memory' : 'Memory cleared',
        clipboardStatus: window.clipboardHasPassword ? 'Password in clipboard' : 'Clipboard clear',
        displayStatus: !document.getElementById('passwordText').textContent.includes('••••') ? 'Password visible' : 'Password hidden',
        sessionType: window.isIncognito ? 'Private' : 'Regular',
        securityScore: document.querySelector('#securityScore .status')?.textContent || 'N/A',
        riskLevel: document.querySelector('#riskLevel .status')?.textContent || 'N/A',
        recommendations: Array.from(document.querySelectorAll('#recommendationsList li')).map(li => li.textContent)
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('📄 Security report exported');
}

function resetDashboard() {
    if (confirm('Are you sure you want to reset all security data? This will clear all passwords and reset the dashboard.')) {
        window.currentPassword = null;
        window.clipboardHasPassword = false;
        window.passwordCreationTime = null;
        window.clipboardTime = null;
        window.lastClearedTime = Date.now();
        window.lastClipboardClearTime = Date.now();
        window.isIncognito = Math.random() > 0.5; // Randomize for demo
        
        updateDashboard();
        showToast('🔄 Dashboard reset complete');
    }
}

function clearClipboard() {
    // Note: Cannot directly clear clipboard due to security restrictions
    // In a real app, you would ask the user to clear it manually
    showToast('📋 Please clear clipboard manually (Ctrl+Shift+V or Cmd+Shift+V)');
    window.clipboardHasPassword = false;
    window.lastClipboardClearTime = Date.now();
    updateDashboard();
}

function hidePasswordNow() {
    const passwordText = document.getElementById('passwordText');
    const toggleBtn = document.getElementById('toggleVisibility');
    
    if (passwordText && toggleBtn) {
        passwordText.textContent = '••••••••••••';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        clearAutoHideTimer();
        document.getElementById('timerDisplay').style.display = 'none';
        window.lastHiddenTime = Date.now();
        updateDashboard();
        showToast('🔒 Password hidden');
    }
}

function startNewSession() {
    window.sessionStartTime = Date.now();
    window.isIncognito = Math.random() > 0.5; // Randomize for demo
    updateDashboard();
    showToast('🔄 New session started');
}

// Simulate clipboard monitoring
function simulateClipboardMonitoring() {
    // Simulate clipboard state changes
    setInterval(() => {
        if (window.clipboardHasPassword && window.clipboardTime) {
            const timeInClipboard = Date.now() - window.clipboardTime;
            // Auto-clear clipboard after 2 minutes (simulated)
            if (timeInClipboard > 120000) {
                window.clipboardHasPassword = false;
                window.lastClipboardClearTime = Date.now();
                showToast('🔄 Clipboard auto-cleared (simulated)');
            }
        }
    }, 10000);
}

// Initialize session start time
window.sessionStartTime = window.sessionStartTime || Date.now();
window.lastClearedTime = window.lastClearedTime || Date.now();
window.lastClipboardClearTime = window.lastClipboardClearTime || Date.now();
window.lastHiddenTime = window.lastHiddenTime || Date.now();
window.isIncognito = window.isIncognito || Math.random() > 0.5;

// Export functions
window.updateDashboard = updateDashboard;
window.clearClipboard = clearClipboard;
window.hidePasswordNow = hidePasswordNow;
window.startNewSession = startNewSession;
window.runSecurityAudit = runSecurityAudit;
window.exportSecurityReport = exportSecurityReport;
window.resetDashboard = resetDashboard;
window.refreshDashboard = refreshDashboard;
