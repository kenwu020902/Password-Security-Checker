// Main coordination script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initPasswordGenerator();
    initPasswordChecker();
    initSecurityDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show welcome message
    setTimeout(() => {
        showToast('🔐 Password Security Assistant Ready!');
    }, 1000);
});

function setupEventListeners() {
    // Toggle password visibility
    document.getElementById('toggleVisibility').addEventListener('click', togglePasswordVisibility);
    document.getElementById('toggleInputVisibility').addEventListener('click', toggleInputVisibility);
    
    // Clear all button
    document.getElementById('clearAllBtn').addEventListener('click', clearAllData);
    
    // Update password length display
    document.getElementById('lengthSlider').addEventListener('input', function() {
        document.getElementById('lengthValue').textContent = this.value;
    });
}

function togglePasswordVisibility() {
    const passwordText = document.getElementById('passwordText');
    const toggleBtn = document.getElementById('toggleVisibility');
    
    if (passwordText.textContent.includes('••••')) {
        // Show password temporarily
        const currentPassword = window.currentPassword || '';
        if (currentPassword) {
            passwordText.textContent = currentPassword;
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            
            // Auto-hide after 30 seconds
            startAutoHideTimer();
        }
    } else {
        // Hide password
        passwordText.textContent = '••••••••••••';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        clearAutoHideTimer();
    }
}

function toggleInputVisibility() {
    const inputField = document.getElementById('passwordInput');
    const toggleBtn = document.getElementById('toggleInputVisibility');
    
    if (inputField.type === 'password') {
        inputField.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        inputField.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function clearAllData() {
    // Clear all password data
    window.currentPassword = null;
    
    // Reset displays
    document.getElementById('passwordText').textContent = 'Click "Generate" to create a password';
    document.getElementById('passwordInput').value = '';
    document.getElementById('strengthBar').style.width = '0%';
    document.getElementById('strengthText').textContent = 'Enter a password';
    
    // Reset timer
    clearAutoHideTimer();
    document.getElementById('countdown').textContent = '--:--';
    document.getElementById('timerDisplay').style.display = 'none';
    
    // Update dashboard
    updateDashboard();
    
    // Show confirmation
    showToast('✅ All data cleared from memory');
}

let autoHideTimer;
function startAutoHideTimer() {
    clearAutoHideTimer();
    
    let timeLeft = 30;
    const timerDisplay = document.getElementById('timerDisplay');
    const countdown = document.getElementById('countdown');
    
    timerDisplay.style.display = 'flex';
    
    autoHideTimer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdown.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            togglePasswordVisibility();
            showToast('🔒 Password auto-hidden for security');
        }
    }, 1000);
}

function clearAutoHideTimer() {
    if (autoHideTimer) {
        clearInterval(autoHideTimer);
        autoHideTimer = null;
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Export functions for use in other modules
window.showToast = showToast;
window.startAutoHideTimer = startAutoHideTimer;
window.clearAutoHideTimer = clearAutoHideTimer;
