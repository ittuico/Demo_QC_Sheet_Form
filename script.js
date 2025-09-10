// Global variables
let qcData = [];
let currentEditIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDataFromStorage();
    updateSummary();
});

function initializeApp() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('qcDate').value = today;
    
    // Add first empty row
    addNewRow();
}

function setupEventListeners() {
    // Form controls
    document.getElementById('addRowBtn').addEventListener('click', addNewRow);
    document.getElementById('saveBtn').addEventListener('click', saveData);
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    
    // Modal controls
    document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
    document.getElementById('cancelEdit').addEventListener('click', closeModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Auto-save on input change
    document.addEventListener('input', function(event) {
        if (event.target.closest('.qc-table')) {
            autoSave();
        }
    });
}

function addNewRow() {
    const tbody = document.getElementById('qcTableBody');
    const rowIndex = qcData.length;
    
    // Create new data object
    const newRowData = {
        stt: rowIndex + 1,
        qcDate: document.getElementById('qcDate').value,
        processNo: '',
        itemName: '',
        totalWeight: 0,
        okWeight: 0,
        ngWeight: 0,
        judgment: 'OK',
        qcStaff: document.getElementById('qcStaff').value,
        notes: ''
    };
    
    qcData.push(newRowData);
    
    // Create table row
    const row = createTableRow(newRowData, rowIndex);
    tbody.appendChild(row);
    
    updateSummary();
    updateRowNumbers();
}

function createTableRow(data, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="stt-column">${data.stt}</td>
        <td class="date-column">
            <input type="date" value="${data.qcDate}" 
                   onchange="updateRowData(${index}, 'qcDate', this.value)">
        </td>
        <td class="process-column">
            <input type="text" value="${data.processNo}" 
                   onchange="updateRowData(${index}, 'processNo', this.value)"
                   placeholder="Nhập số qui trình">
        </td>
        <td class="item-column">
            <input type="text" value="${data.itemName}" 
                   onchange="updateRowData(${index}, 'itemName', this.value)"
                   placeholder="Nhập tên hàng">
        </td>
        <td class="weight-column">
            <input type="number" value="${data.totalWeight}" 
                   step="0.01" min="0"
                   onchange="updateRowData(${index}, 'totalWeight', parseFloat(this.value) || 0)"
                   placeholder="0.00">
        </td>
        <td class="ok-ng-column">
            <input type="number" value="${data.okWeight}" 
                   step="0.01" min="0"
                   onchange="updateRowData(${index}, 'okWeight', parseFloat(this.value) || 0)"
                   placeholder="0.00">
        </td>
        <td class="ok-ng-column">
            <input type="number" value="${data.ngWeight}" 
                   step="0.01" min="0"
                   onchange="updateRowData(${index}, 'ngWeight', parseFloat(this.value) || 0)"
                   placeholder="0.00">
        </td>
        <td class="judgment-column">
            <div class="checkbox-container">
                <input type="checkbox" ${data.judgment === 'OK' ? 'checked' : ''} 
                       onchange="updateJudgment(${index}, 'OK', this.checked)">
            </div>
        </td>
        <td class="judgment-column">
            <div class="checkbox-container">
                <input type="checkbox" ${data.judgment === 'NG' ? 'checked' : ''} 
                       onchange="updateJudgment(${index}, 'NG', this.checked)">
            </div>
        </td>
        <td class="staff-column">
            <input type="text" value="${data.qcStaff}" 
                   onchange="updateRowData(${index}, 'qcStaff', this.value)"
                   placeholder="Mã NV">
        </td>
        <td class="notes-column">
            <input type="text" value="${data.notes}" 
                   onchange="updateRowData(${index}, 'notes', this.value)"
                   placeholder="Ghi chú">
        </td>
        <td class="actions-column">
            <button class="btn btn-sm btn-primary" onclick="editRow(${index})" title="Chỉnh sửa">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteRow(${index})" title="Xóa">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return row;
}

function updateRowData(index, field, value) {
    if (qcData[index]) {
        qcData[index][field] = value;
        updateSummary();
        autoSave();
    }
}

function updateJudgment(index, type, checked) {
    if (qcData[index]) {
        if (checked) {
            qcData[index].judgment = type;
            // Uncheck the other checkbox
            const row = document.querySelector(`#qcTableBody tr:nth-child(${index + 1})`);
            const otherCheckbox = row.querySelector(`input[onchange*="${type === 'OK' ? 'NG' : 'OK'}"]`);
            if (otherCheckbox) {
                otherCheckbox.checked = false;
            }
        } else {
            qcData[index].judgment = '';
        }
        autoSave();
    }
}

function editRow(index) {
    currentEditIndex = index;
    const data = qcData[index];
    
    // Populate modal form
    document.getElementById('editProcessNo').value = data.processNo;
    document.getElementById('editItemName').value = data.itemName;
    document.getElementById('editTotalWeight').value = data.totalWeight;
    document.getElementById('editOKWeight').value = data.okWeight;
    document.getElementById('editNGWeight').value = data.ngWeight;
    document.getElementById('editJudgment').value = data.judgment;
    document.getElementById('editNotes').value = data.notes;
    
    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

function handleEditSubmit(event) {
    event.preventDefault();
    
    if (currentEditIndex >= 0) {
        // Update data
        qcData[currentEditIndex].processNo = document.getElementById('editProcessNo').value;
        qcData[currentEditIndex].itemName = document.getElementById('editItemName').value;
        qcData[currentEditIndex].totalWeight = parseFloat(document.getElementById('editTotalWeight').value) || 0;
        qcData[currentEditIndex].okWeight = parseFloat(document.getElementById('editOKWeight').value) || 0;
        qcData[currentEditIndex].ngWeight = parseFloat(document.getElementById('editNGWeight').value) || 0;
        qcData[currentEditIndex].judgment = document.getElementById('editJudgment').value;
        qcData[currentEditIndex].notes = document.getElementById('editNotes').value;
        
        // Refresh table
        refreshTable();
        updateSummary();
        autoSave();
        closeModal();
    }
}

function deleteRow(index) {
    if (confirm('Bạn có chắc chắn muốn xóa dòng này?')) {
        qcData.splice(index, 1);
        refreshTable();
        updateSummary();
        autoSave();
    }
}

function refreshTable() {
    const tbody = document.getElementById('qcTableBody');
    tbody.innerHTML = '';
    
    qcData.forEach((data, index) => {
        data.stt = index + 1;
        const row = createTableRow(data, index);
        tbody.appendChild(row);
    });
}

function updateRowNumbers() {
    qcData.forEach((data, index) => {
        data.stt = index + 1;
    });
    refreshTable();
}

function updateSummary() {
    const totalRows = qcData.length;
    const totalWeight = qcData.reduce((sum, row) => sum + (parseFloat(row.totalWeight) || 0), 0);
    const totalOK = qcData.reduce((sum, row) => sum + (parseFloat(row.okWeight) || 0), 0);
    const totalNG = qcData.reduce((sum, row) => sum + (parseFloat(row.ngWeight) || 0), 0);
    
    document.getElementById('totalRows').textContent = totalRows;
    document.getElementById('totalWeight').textContent = totalWeight.toFixed(2) + ' kg';
    document.getElementById('totalOK').textContent = totalOK.toFixed(2) + ' kg';
    document.getElementById('totalNG').textContent = totalNG.toFixed(2) + ' kg';
}

function saveData() {
    try {
        localStorage.setItem('qcData', JSON.stringify(qcData));
        localStorage.setItem('qcDate', document.getElementById('qcDate').value);
        localStorage.setItem('qcStaff', document.getElementById('qcStaff').value);
        
        showNotification('Dữ liệu đã được lưu thành công!', 'success');
    } catch (error) {
        showNotification('Lỗi khi lưu dữ liệu: ' + error.message, 'error');
    }
}

function loadDataFromStorage() {
    try {
        const savedData = localStorage.getItem('qcData');
        const savedDate = localStorage.getItem('qcDate');
        const savedStaff = localStorage.getItem('qcStaff');
        
        if (savedData) {
            qcData = JSON.parse(savedData);
            refreshTable();
        }
        
        if (savedDate) {
            document.getElementById('qcDate').value = savedDate;
        }
        
        if (savedStaff) {
            document.getElementById('qcStaff').value = savedStaff;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function autoSave() {
    // Debounce auto-save to avoid too frequent saves
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
        saveData();
    }, 1000);
}

function exportToExcel() {
    if (qcData.length === 0) {
        showNotification('Không có dữ liệu để xuất!', 'warning');
        return;
    }
    
    try {
        // Create CSV content
        let csvContent = '\uFEFF'; // BOM for UTF-8
        csvContent += 'STT,Ngày QC,Số qui trình,Tên hàng,Tổng số kg,OK(kg),NG(kg),Phán định,Nhân viên QC,Ghi chú\n';
        
        qcData.forEach((row, index) => {
            csvContent += `${row.stt},${row.qcDate},${row.processNo},${row.itemName},${row.totalWeight},${row.okWeight},${row.ngWeight},${row.judgment},${row.qcStaff},"${row.notes}"\n`;
        });
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `QC_Oring_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Xuất dữ liệu thành công!', 'success');
    } catch (error) {
        showNotification('Lỗi khi xuất dữ liệu: ' + error.message, 'error');
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditIndex = -1;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl+S to save
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveData();
    }
    
    // Ctrl+N to add new row
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        addNewRow();
    }
    
    // Escape to close modal
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Prevent form submission on Enter key in input fields
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
        event.preventDefault();
        // Move to next input or add new row
        const inputs = Array.from(document.querySelectorAll('input'));
        const currentIndex = inputs.indexOf(event.target);
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            addNewRow();
        }
    }
});
