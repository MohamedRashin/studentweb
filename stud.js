// Current user type (student or staff)
let currentUser = null;
let currentDept = 'MCA';
let currentStudentDept = null;

// Department-specific student credentials
const studentCredentials = {
    'MCA': { id: 'MCA07', password: 'MCA20225' },
    'ECE': { id: 'ECE20', password: 'ECEM20225' },
    'EEE': { id: 'EEE28', password: 'EEEM2021' },
    'IT': { id: 'IT2030', password: 'ITMC20225' },
    'AI_DS': { id: 'AIDo7', password: '&DS20275' }
};

// Staff credentials - Only one valid staff account
const staffCredentials = {
    id: 'KCET@2025MCA',
    password: "print('MCA602025')"
};

// Sample content for each department
const departmentContent = {
    'MCA': 'Welcome to the MCA department! This is a sample content that can be edited by students.',
    'ECE': 'Welcome to the ECE department! Electronics and Communication Engineering focuses on...',
    'EEE': 'Welcome to the ECE department! Electrical and Electronics Engineering covers...',
    'AI_DS': 'Welcome to the AI & DS department! Artificial Intelligence and Data Science is...',
    'IT': 'Welcome to the IT department! Information Technology deals with...'
};

// Track last save time for each department
const lastSaveTime = {
    'MCA': null,
    'ECE': null,
    'EEE': null,
    'AI_DS': null,
    'IT': null
};

// Login function
function login(userType) {
    const idField = userType === 'student' ? 'studentId' : 'staffId';
    const passwordField = userType === 'student' ? 'studentPassword' : 'staffPassword';
    
    const id = document.getElementById(idField).value;
    const password = document.getElementById(passwordField).value;
    
    if (userType === 'student') {
        // Check department-specific credentials
        let validLogin = false;
        let studentDepartment = null;
        
        for (const [dept, creds] of Object.entries(studentCredentials)) {
            if (id === creds.id && password === creds.password) {
                validLogin = true;
                studentDepartment = dept;
                break;
            }
        }
        
        if (validLogin) {
            currentUser = userType;
            currentStudentDept = studentDepartment;
            currentDept = studentDepartment; // Set current department to student's department
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById(userType + 'Section').style.display = 'block';
            
            // Set student name and department
            document.getElementById('studentName').textContent = `Student (${studentDepartment})`;
            document.getElementById('userDeptInfo').textContent = studentDepartment;
            
            // Update department selector for student (show only their department as active)
            updateStudentDepartmentSelector(studentDepartment);
            
            // Load department content
            loadDepartmentContent();
        } else {
            showError('Invalid student ID or password!');
        }
    } else {
        // Staff login - Only allow specific credentials
        if (id === staffCredentials.id && password === staffCredentials.password) {
            currentUser = userType;
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById(userType + 'Section').style.display = 'block';
            
            // Set staff name
            document.getElementById('staffName').textContent = 'Staff Member';
            
            // Load department content
            loadDepartmentContent();
        } else {
            showError('Invalid staff ID or password! Only authorized staff can access.');
        }
    }
}

// Update department selector for students (only show their department as active)
function updateStudentDepartmentSelector(studentDept) {
    const deptSelector = document.getElementById('studentDeptSelector');
    deptSelector.innerHTML = '';
    
    const allDepartments = ['MCA', 'ECE', 'EEE', 'AI_DS', 'IT'];
    
    allDepartments.forEach(dept => {
        const deptCard = document.createElement('div');
        deptCard.className = `dept-card ${dept === studentDept ? 'active' : 'disabled'}`;
        deptCard.setAttribute('data-dept', dept);
        
        if (dept !== studentDept) {
            deptCard.style.cursor = 'not-allowed';
        }
        
        // Set department icons
        let iconClass = '';
        switch(dept) {
            case 'MCA': iconClass = 'fas fa-laptop-code'; break;
            case 'ECE': iconClass = 'fas fa-microchip'; break;
            case 'EEE': iconClass = 'fas fa-bolt'; break;
            case 'AI_DS': iconClass = 'fas fa-robot'; break;
            case 'IT': iconClass = 'fas fa-server'; break;
        }
        
        deptCard.innerHTML = `
            <div class="dept-icon"><i class="${iconClass}"></i></div>
            <h3>${dept}</h3>
            <p>${getDepartmentFullName(dept)}</p>
            ${dept !== studentDept ? '<div style="margin-top: 10px; color: var(--danger); font-size: 0.8rem;"><i class="fas fa-lock"></i> Access Restricted</div>' : ''}
        `;
        
        // Only allow clicking on student's own department
        if (dept === studentDept) {
            deptCard.addEventListener('click', function() {
                // Remove active class from all cards
                document.querySelectorAll('#studentDeptSelector .dept-card').forEach(c => {
                    c.classList.remove('active');
                });
                
                // Add active class to clicked card
                this.classList.add('active');
                
                // Update current department
                currentDept = this.getAttribute('data-dept');
                document.getElementById('currentDept').textContent = currentDept;
                
                // Load content for selected department
                loadDepartmentContent();
            });
        }
        
        deptSelector.appendChild(deptCard);
    });
}

// Get full department name
function getDepartmentFullName(dept) {
    switch(dept) {
        case 'MCA': return 'Master of Computer Applications';
        case 'ECE': return 'Electronics and Communication Engineering';
        case 'EEE': return 'Electrical and Electronics Engineering';
        case 'AI_DS': return 'Artificial Intelligence and Data Science';
        case 'IT': return 'Information Technology';
        default: return '';
    }
}

// Show error notification
function showError(message) {
    const errorNotification = document.getElementById('errorNotification');
    errorNotification.textContent = message;
    errorNotification.style.display = 'block';
    
    setTimeout(() => {
        errorNotification.style.display = 'none';
    }, 3000);
}

// Logout function
function logout() {
    currentUser = null;
    currentStudentDept = null;
    document.getElementById('studentSection').style.display = 'none';
    document.getElementById('staffSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
    
    // Clear password fields
    document.getElementById('studentPassword').value = '';
    document.getElementById('staffPassword').value = '';
    document.getElementById('studentId').value = '';
    document.getElementById('staffId').value = '';
}

// Department selection for staff (all departments accessible)
document.addEventListener('DOMContentLoaded', function() {
    // Staff department selection
    document.querySelectorAll('#staffSection .dept-card').forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            document.querySelectorAll('#staffSection .dept-card').forEach(c => {
                c.classList.remove('active');
            });
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Update current department
            currentDept = this.getAttribute('data-dept');
            document.getElementById('viewDept').textContent = currentDept;
            
            // Load content for selected department
            loadDepartmentContent();
        });
    });
});

// Load department content
function loadDepartmentContent() {
    if (currentUser === 'student') {
        // For students, load content into textarea
        document.getElementById('deptContent').value = departmentContent[currentDept];
        document.getElementById('currentDept').textContent = currentDept;
        
        // Check if content is locked (saved within last 24 hours)
        checkContentLock();
    } else {
        // For staff, load content into display area
        document.getElementById('contentDisplay').textContent = departmentContent[currentDept];
        document.getElementById('viewDept').textContent = currentDept;
    }
}

// Check if content is locked (saved within last 24 hours)
function checkContentLock() {
    const lastSave = lastSaveTime[currentDept];
    const textarea = document.getElementById('deptContent');
    const saveBtn = document.getElementById('saveBtn');
    const lockInfo = document.getElementById('lockInfo');
    const timeRemaining = document.getElementById('timeRemaining');
    
    if (lastSave) {
        const now = new Date().getTime();
        const timeDiff = now - lastSave;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            // Content is locked
            textarea.disabled = true;
            saveBtn.disabled = true;
            lockInfo.style.display = 'block';
            
            // Calculate remaining time
            const remainingHours = 24 - hoursDiff;
            const hours = Math.floor(remainingHours);
            const minutes = Math.floor((remainingHours - hours) * 60);
            
            timeRemaining.textContent = `${hours} hours and ${minutes} minutes`;
            
            // Update countdown every minute
            setTimeout(checkContentLock, 60000);
        } else {
            // Content is unlocked
            textarea.disabled = false;
            saveBtn.disabled = false;
            lockInfo.style.display = 'none';
        }
    } else {
        // No previous save, content is unlocked
        textarea.disabled = false;
        saveBtn.disabled = false;
        lockInfo.style.display = 'none';
    }
}

// Save content function
function saveContent() {
    if (currentUser === 'student') {
        const content = document.getElementById('deptContent').value;
        departmentContent[currentDept] = content;
        
        // Record the save time
        lastSaveTime[currentDept] = new Date().getTime();
        
        // Lock the content for 24 hours
        checkContentLock();
        
        // Show notification
        const notification = document.getElementById('notification');
        notification.style.display = 'block';
        notification.textContent = 'Content saved successfully for ' + currentDept + ' department!';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Initialize the page
window.onload = function() {
    // Set MCA as default department
    loadDepartmentContent();
};
