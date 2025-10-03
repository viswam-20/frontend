// --- 1. Data Models ---

const FACULTY_DATA = [
    { id: 101, name: 'Professor A. Smith', role: 'Faculty', menteeCount: 25, status: 'Active' },
    { id: 102, name: 'Dr. S. Patel', role: 'Admin', menteeCount: 0, status: 'Active' },
    { id: 103, name: 'Ms. T. Rao', role: 'Faculty', menteeCount: 55, status: 'High Load' },
];

const STUDENT_DATA = [
    { id: 201, name: 'Alice Johnson', status: 'Active', sap: 85 },
    { id: 202, name: 'Bob Carter', status: 'Suspended', sap: 12 },
];


// --- 2. Core Dashboard Interactions ---

function handleReportGeneration(button, reportType) {
    if (button.classList.contains('loading')) {
        return;
    }

    button.classList.add('loading');
    button.innerHTML = <i class="fas fa-spinner fa-spin"></i> Compiling ${reportType} Data...;
    
    const duration = 2500; 
    
    setTimeout(() => {
        button.classList.remove('loading');
        // Reset button text
        document.querySelectorAll('.report-btn').forEach(btn => {
            if (btn.textContent.includes('NAAC')) {
                btn.innerHTML = '<i class="fas fa-file-pdf"></i> Generate NAAC Criterion III Report';
            } else if (btn.textContent.includes('AICTE')) {
                btn.innerHTML = '<i class="fas fa-list-ol"></i> Generate AICTE SAP Compliance';
            }
        });
        
        alert(SUCCESS: ${reportType} Report is ready! The accreditation-ready PDF has been securely stored. (Simulated));
    }, duration);
}


// --- 3. User Role Management Logic (Separated) ---

function renderFacultyGrid() {
    const grid = document.getElementById('faculty-grid');
    if (!grid) return;

    let html = '';
    FACULTY_DATA.forEach(user => {
        const roleBadge = user.role === 'Admin' ? 'role-admin' : 'role-faculty';
        const menteeStatusBadge = user.status === 'High Load' ? 'status-high-load' : 'status-active';
        const actionText = user.role === 'Admin' ? 'Audit Access' : 'Reassign Mentees';
        
        html += `
            <div class="grid-row data user-data" data-id="${user.id}">
                <div class="grid-cell user-name">${user.name}</div>
                <div class="grid-cell user-role"><span class="role-badge ${roleBadge}">${user.role}</span></div>
                <div class="grid-cell user-status"><span class="status-badge ${menteeStatusBadge}">${user.menteeCount}</span></div>
                <div class="grid-cell user-actions">
                    <button class="action-btn config-btn" onclick="handleFacultyAction(${user.id}, '${actionText}')"><i class="fas fa-edit"></i> ${actionText}</button>
                </div>
            </div>
        `;
    });
    // Insert data rows below the existing header
    const headerRow = grid.querySelector('.grid-row.header');
    if (headerRow) {
        headerRow.insertAdjacentHTML('afterend', html);
    } else {
        grid.innerHTML += html; // Fallback if header wasn't pre-defined
    }
}

function renderStudentMiniGrid() {
    const grid = document.getElementById('student-grid-mini');
    if (!grid) return;

    let html = `
        <div class="data-grid mini-student-grid">
            <div class="grid-row header">
                <div class="grid-cell">Name</div>
                <div class="grid-cell">SAP Score</div>
                <div class="grid-cell">Action</div>
            </div>
    `;

    STUDENT_DATA.forEach(student => {
        const statusClass = student.status === 'Active' ? 'status-active' : 'status-suspended';
        const buttonText = student.status === 'Active' ? 'Suspend' : 'Activate';
        const buttonIcon = student.status === 'Active' ? 'fa-lock' : 'fa-unlock';
        
        html += `
            <div class="grid-row data" data-id="${student.id}">
                <div class="grid-cell" style="font-weight: 600;">${student.name}</div>
                <div class="grid-cell"><span class="role-badge role-student">${student.sap}</span></div>
                <div class="grid-cell">
                    <button class="action-btn config-btn" data-status="${student.status}" onclick="handleStudentAction(this, ${student.id})"><i class="fas ${buttonIcon}"></i> ${buttonText}</button>
                </div>
            </div>
        `;
    });
    html += </div>;
    grid.innerHTML = html;
}

function handleFacultyAction(userId, action) {
    alert(ACTION: Initiating '${action}' for Faculty ID ${userId}.);
}

function handleStudentAction(button, studentId) {
    let student = STUDENT_DATA.find(s => s.id === studentId);

    if (student.status === 'Active') {
        student.status = 'Suspended';
        alert(ACTION: User ${student.name} has been SUSPENDED!);
    } else {
        student.status = 'Active';
        alert(ACTION: User ${student.name} has been RE-ACTIVATED!);
    }

    // Re-render the grid to update button and badge status
    renderStudentMiniGrid();
}


// --- 4. Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Render the separated user grids
    renderFacultyGrid();
    renderStudentMiniGrid();

    // Attach click listener for primary buttons (for general config actions)
    document.querySelector('.config-settings')?.addEventListener('click', (e) => {
        if (e.target.closest('.toggle-btn')) {
            const button = e.target.closest('.toggle-btn');
            const label = button.closest('.config-item').querySelector('.config-label').textContent;
            button.classList.toggle('toggle-on');
            button.classList.toggle('toggle-off');
            button.innerHTML = button.classList.contains('toggle-on') ? 
                '<i class="fas fa-toggle-on"></i> Mandatory' : 
                '<i class="fas fa-toggle-off"></i> Optional';
            alert(CONFIG: ${label} setting updated.);
        }
    });
});