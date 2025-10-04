// --- Feature 1 & 2 Setup ---
const declineOptions = document.getElementById('decline-options');
const declineReasonSelect = document.getElementById('decline-reason');
const approveBtn = document.getElementById('approve-btn');
const declineBtn = document.getElementById('decline-btn');
const auditLog = document.getElementById('audit-log');
const rollbackBtn = document.getElementById('rollback-btn');
const documentList = document.getElementById('document-list');

// Simulates a backend data structure for different documents
const documentData = {
    '1001': {
        title: 'Internship Certificate',
        student: 'A. Smith',
        status: 'PENDING',
        lastStatus: 'PENDING',
        log: [
            { time: '2025-10-03 14:15:22', user: 'System', action: 'Status changed to *PENDING* by System (Student Upload).' }
        ]
    },
    '1002': {
        title: 'Financial Aid Form (V2.0)',
        student: 'B. Lee',
        status: 'PENDING',
        lastStatus: 'PENDING',
        log: [
            { time: '2025-10-01 09:00:00', user: 'System', action: 'Status changed to *DECLINED* by Prof. Johnson. Reason: Missing signature.' },
            { time: '2025-10-02 11:30:00', user: 'System', action: 'Status changed to *PENDING* by System (Student Upload - *Version 2.0*).' }
        ]
    },
    '1003': {
        title: 'Course Transfer Request',
        student: 'C. Davies',
        status: 'APPROVED',
        lastStatus: 'APPROVED',
        log: [
            { time: '2025-09-29 10:00:00', user: 'System', action: 'Status changed to *PENDING* by System.' },
            { time: '2025-09-30 15:00:00', user: 'Prof. Johnson', action: 'Status changed to *APPROVED* by Prof. Johnson.' },
            { time: '2025-09-30 15:01:00', user: 'System', action: 'Email notification sent to student (Approval Template).' }
        ]
    }
};

let currentDocId = '1001';

// Function to simulate loading a document (Feature 1)
function loadDocument(element) {
    // Update active state in sidebar
    document.querySelectorAll('#document-list li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
    
    currentDocId = element.getAttribute('data-doc-id');
    const doc = documentData[currentDocId];

    // Update main workspace title
    document.getElementById('workspace-title').textContent = Document Review: ${doc.title} (${doc.student});
    
    // Clear and rebuild audit log (Feature 3)
    auditLog.innerHTML = '';
    doc.log.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = <span class="timestamp">${entry.time}</span> ${entry.action};
        auditLog.prepend(li); // Show newest at top
    });

    // Reset controls
    declineOptions.classList.add('hidden');
    declineReasonSelect.value = 'Select';
    approveBtn.disabled = false;
    declineBtn.disabled = false;
    
    // If document is already approved/declined, disable buttons and enable rollback
    if (doc.status !== 'PENDING') {
        approveBtn.disabled = true;
        declineBtn.disabled = true;
        rollbackBtn.disabled = false;
    } else {
        rollbackBtn.disabled = true;
    }
}

// Simulates clicking the Approve or Decline button (Feature 2)
function handleDecision(decision) {
    if (decision === 'Approved') {
        // One-Click Communication: Post-Approval
        const doc = documentData[currentDocId];
        doc.lastStatus = doc.status;
        doc.status = 'APPROVED';
        
        const timestamp = new Date().toLocaleString();
        const action = Status changed to **APPROVED** by Prof. Johnson. **One-Click Communication:** Approval email sent to student.;
        
        // Add to audit log (Feature 3)
        doc.log.push({ time: timestamp, user: 'Prof. Johnson', action: action });
        
        alert(✅ DOCUMENT APPROVED.\n\nSimulating: Sending a professional confirmation email to ${doc.student} and notifying Registrar's Office.);
        loadDocument(document.querySelector([data-doc-id="${currentDocId}"]));

    } else if (decision === 'Declined') {
        // Show decline options
        declineOptions.classList.toggle('hidden');
    }
}

// Simulates confirming the Decline with a template (Feature 2)
function confirmDecline() {
    const reason = declineReasonSelect.value;
    if (reason === 'Select') {
        alert('Please select a decline reason.');
        return;
    }

    // One-Click Communication: Post-Decline
    const doc = documentData[currentDocId];
    doc.lastStatus = doc.status;
    doc.status = 'DECLINED';
    
    const timestamp = new Date().toLocaleString();
    const action = Status changed to **DECLINED** by Prof. Johnson. Reason: ${reason}. **One-Click Communication:** Notification drafted.;
    
    // Add to audit log (Feature 3)
    doc.log.push({ time: timestamp, user: 'Prof. Johnson', action: action });
    
    alert(❌ DOCUMENT DECLINED.\n\nSimulating: Drafting/sending portal notification to ${doc.student} with the structured reason:\n\n"The document was declined because: ${reason}. Please review and re-upload the correct file.");
    loadDocument(document.querySelector([data-doc-id="${currentDocId}"]));
}

// Simulates History Rollback (Feature 3)
function simulateRollback() {
    const doc = documentData[currentDocId];
    if (doc.status === 'PENDING') return;

    const oldStatus = doc.status;
    const newStatus = doc.lastStatus; // Simplified rollback to the immediate prior status
    
    doc.status = newStatus;

    const timestamp = new Date().toLocaleString();
    const action = Status rolled back from **${oldStatus}** to **${newStatus}** by Administrator (Audit Correction).;
    
    // Add to audit log (Feature 3)
    doc.log.push({ time: timestamp, user: 'Administrator', action: action });

    alert(🔄 Rollback Successful.\n\nStatus for ${doc.title} rolled back from ${oldStatus} to ${newStatus}. A clean record of this correction has been added to the Audit Trail.);
    loadDocument(document.querySelector([data-doc-id="${currentDocId}"]));
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadDocument(document.getElementById('document-list').firstElementChild);
});