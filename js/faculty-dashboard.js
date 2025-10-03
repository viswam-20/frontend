// --- 1. Data Models ---

const FACULTY_NAME = 'Prof. A. Smith';
let PENDING_QUEUE = [
    { id: 1, student: 'Riya K.', activity: 'Leadership Training', category: 'Extracurricular', sap: 30, proof: 'dummy_leadership.pdf' },
    { id: 2, student: 'Manoj V.', activity: 'Internship (3-Month)', category: 'Co-curricular', sap: 45, proof: 'dummy_internship.pdf' },
    { id: 3, student: 'Sunita P.', activity: 'Hackathon Win', category: 'Achievement', sap: 50, proof: 'dummy_hackathon.pdf' },
    { id: 4, student: 'Ganesh L.', activity: 'Volunteering (NGO)', category: 'Extracurricular', sap: 15, proof: 'dummy_ngo.pdf' },
    // Adding more items for a full queue simulation
    { id: 5, student: 'Priya R.', activity: 'Certificate (Coursera)', category: 'Co-curricular', sap: 10, proof: 'dummy_cert.pdf' },
    { id: 6, student: 'Amit D.', activity: 'Department Council Head', category: 'Leadership', sap: 25, proof: 'dummy_leader.pdf' },
    { id: 7, student: 'Shreya Z.', activity: 'Research Paper Publication', category: 'Research', sap: 75, proof: 'dummy_paper.pdf' },
    { id: 8, student: 'Karan J.', activity: 'Startup Idea Pitch', category: 'Innovation', sap: 20, proof: 'dummy_pitch.pdf' },
    { id: 9, student: 'Tina M.', activity: 'NPTEL Course Completion', category: 'Co-curricular', sap: 10, proof: 'dummy_nptel.pdf' },
    { id: 10, student: 'Zain A.', activity: 'Inter-College Debate', category: 'Extracurricular', sap: 5, proof: 'dummy_debate.pdf' },
    { id: 11, student: 'Hina B.', activity: 'Technical Workshop Attendee', category: 'Co-curricular', sap: 5, proof: 'dummy_workshop.pdf' },
    { id: 12, student: 'Jatin G.', activity: 'Open Source Contribution', category: 'Innovation', sap: 30, proof: 'dummy_oss.pdf' },
];

const MENTEE_DATA = [
    { name: 'Vijay S.', gap: 'Public Speaking', progress: 'Low' },
    { name: 'Nisha R.', gap: 'Business Acumen', progress: 'Medium' },
    { name: 'Rohan A.', gap: 'Project Management', progress: 'Low' },
    { name: 'Kavya L.', gap: 'Critical Thinking', progress: 'Low' },
    { name: 'Aman P.', gap: 'Team Collaboration', progress: 'Medium' },
];

// --- 2. Core Functions ---

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.header-user').textContent = Welcome, ${FACULTY_NAME};
    
    // Initial data render
    renderKpiBar();
    renderValidationQueue();
    renderMenteeList();
});

function renderKpiBar() {
    document.getElementById('kpi-pending').textContent = PENDING_QUEUE.length;
    document.getElementById('queue-count').textContent = PENDING_QUEUE.length;
}

function renderValidationQueue() {
    const grid = document.getElementById('validation-queue-grid');
    if (!grid) return;

    // Clear previous data rows (everything but the header)
    grid.querySelectorAll('.grid-row.data').forEach(row => row.remove());

    let html = '';
    
    if (PENDING_QUEUE.length === 0) {
        html = '<div class="grid-cell" style="grid-column: 1 / 5; text-align: center; padding: 30px; color: var(--success-color); font-weight: 700;">All clear! Your validation queue is empty. Time for mentorship! 🏆</div>';
    } else {
        PENDING_QUEUE.forEach(item => {
            html += `
                <div class="grid-row data" data-id="${item.id}">
                    <div class="grid-cell student-name" style="font-weight: 600;">${item.student} - ${item.activity}</div>
                    <div class="grid-cell activity-type">${item.category}</div>
                    <div class="grid-cell sap-value"><span class="role-badge role-faculty" style="background-color: #00bcd4;">${item.sap} SAP</span></div>
                    <div class="grid-cell queue-actions">
                        <button class="view-proof-btn" 
                            data-id="${item.id}"
                            data-student="${item.student}"
                            data-activity="${item.activity}"
                            data-sap="${item.sap}"
                            data-proof="${item.proof}"
                            onclick="showModal(this)"
                        >
                            View & Validate
                        </button>
                    </div>
                </div>
            `;
        });
    }

    // Append new data rows after the header
    const headerRow = grid.querySelector('.grid-row.header');
    if (headerRow) {
        headerRow.insertAdjacentHTML('afterend', html);
    } else {
        grid.innerHTML += html; // Fallback
    }

    renderKpiBar(); // Update the KPI count
}

function renderMenteeList() {
    const list = document.getElementById('mentee-list');
    if (!list) return;

    list.innerHTML = MENTEE_DATA.map(m => `
        <p class="feed-item">
            <span class="mentee-name" style="font-weight: 700;">${m.name}</span>: Gap - 
            <span class="skill-gap" style="color: ${m.progress === 'Low' ? 'var(--error-color)' : 'var(--secondary-color)'};">${m.gap}</span> 
            (${m.progress})
        </p>
    `).join('');
}


// --- 3. Modal Interactions ---

function showModal(button) {
    const data = button.dataset;
    const modal = document.getElementById('validation-modal');

    document.getElementById('modal-student').textContent = data.student;
    document.getElementById('modal-activity').textContent = data.activity;
    document.getElementById('modal-sap').textContent = data.sap;
    // NOTE: For demonstration, the proof viewer uses a generic placeholder.
    document.getElementById('proof-viewer').setAttribute('data', data.proof); 
    
    modal.dataset.currentId = data.id;

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('validation-modal').style.display = 'none';
}

function handleModalAction(action) {
    const modal = document.getElementById('validation-modal');
    const id = parseInt(modal.dataset.currentId);
    
    const index = PENDING_QUEUE.findIndex(item => item.id === id);
    if (index > -1) {
        const activity = PENDING_QUEUE[index];
        PENDING_QUEUE.splice(index, 1); // Remove from queue

        alert(${action === 'approve' ? 'APPROVED' : 'REJECTED/REVISED'}: ${activity.student}'s ${activity.activity}. System updated.);
    }

    closeModal();
    renderValidationQueue(); // Re-render the queue
}

// Attach event listeners for closing modal by clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('validation-modal');
    if (event.target === modal) {
        closeModal();
    }
}