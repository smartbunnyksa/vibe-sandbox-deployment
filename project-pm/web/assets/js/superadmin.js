(function(){
  let branches = [];
  let currentEditingBranch = null;

  async function loadBranches() {
    try {
      branches = await window.api.getBranches();
      fillKPIs();
      fillBranchesTable();
      renderCharts();
    } catch (error) {
      console.error('Failed to load branches:', error);
      showError('فشل في تحميل بيانات الفروع');
    }
  }

  async function fillKPIs(){
    try {
      // Get stats from API (you'll need to implement these endpoints)
      const statsResponse = await fetch('/api/stats'); // This endpoint needs to be created
      const stats = await statsResponse.json();
      
      document.getElementById('kpi-branches').textContent = branches.length;
      document.getElementById('kpi-players').textContent = stats.totalPlayers || 1240;
      document.getElementById('kpi-revenue').textContent = common.formatCurrency(stats.monthlyRevenue || 125000);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Fallback to static data
      document.getElementById('kpi-branches').textContent = branches.length;
      document.getElementById('kpi-players').textContent = 1240;
      document.getElementById('kpi-revenue').textContent = common.formatCurrency(125000);
    }
  }
  
  function fillBranchesTable(){
    const tbody = document.getElementById('tbl-branches');
    if(!tbody) return;
    
    const rows = branches.map(branch => `
      <tr>
        <td>${branch.name}</td>
        <td>${branch.city}</td>
        <td><span class="status ${branch.status === 'active' ? 'active' : 'inactive'}">${getStatusText(branch.status)}</span></td>
        <td>${branch.capacity}</td>
        <td>${branch.manager?.firstName} ${branch.manager?.lastName}</td>
        <td class="phone">${branch.phone}</td>
        <td>
          <button class="btn small" onclick="editBranch('${branch._id}')">تحرير</button>
          <button class="btn small danger" onclick="deleteBranch('${branch._id}')">حذف</button>
        </td>
      </tr>
    `);
    
    tbody.innerHTML = rows.join('');
  }

  function getStatusText(status) {
    const statusMap = {
      'active': 'نشط',
      'inactive': 'غير نشط',
      'maintenance': 'صيانة'
    };
    return statusMap[status] || status;
  }

  function openModal(isEditing = false, branch = null) {
    const modal = document.getElementById('branchModal');
    const title = document.getElementById('modalTitle');
    
    if (isEditing && branch) {
      title.textContent = 'تعديل الفرع';
      document.getElementById('branchName').value = branch.name;
      document.getElementById('branchCity').value = branch.city;
      document.getElementById('branchStatus').value = branch.status;
      document.getElementById('branchCapacity').value = branch.capacity;
      document.getElementById('branchManager').value = branch.manager?._id || '';
      document.getElementById('branchPhone').value = branch.phone;
      currentEditingBranch = branch._id;
    } else {
      title.textContent = 'إضافة فرع جديد';
      document.getElementById('branchForm').reset();
      currentEditingBranch = null;
    }
    
    modal.style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('branchModal').style.display = 'none';
    currentEditingBranch = null;
  }

  async function saveBranch() {
    const name = document.getElementById('branchName').value;
    const city = document.getElementById('branchCity').value;
    const status = document.getElementById('branchStatus').value;
    const capacity = parseInt(document.getElementById('branchCapacity').value);
    const manager = document.getElementById('branchManager').value;
    const phone = document.getElementById('branchPhone').value;

    const branchData = {
      name,
      city,
      status,
      capacity,
      manager,
      phone
    };

    try {
      if (currentEditingBranch) {
        // Update existing branch
        await window.api.updateBranch(currentEditingBranch, branchData);
      } else {
        // Create new branch
        await window.api.createBranch(branchData);
      }
      
      await loadBranches(); // Reload branches
      closeModal();
      showSuccess('تم حفظ الفرع بنجاح');
    } catch (error) {
      console.error('Failed to save branch:', error);
      showError('فشل في حفظ الفرع');
    }
  }

  async function editBranch(id) {
    const branch = branches.find(b => b._id === id);
    if (branch) {
      openModal(true, branch);
    }
  }

  async function deleteBranch(id) {
    if (confirm('هل أنت متأكد من حذف هذا الفرع؟')) {
      try {
        await window.api.deleteBranch(id);
        await loadBranches(); // Reload branches
        showSuccess('تم حذف الفرع بنجاح');
      } catch (error) {
        console.error('Failed to delete branch:', error);
        showError('فشل في حذف الفرع');
      }
    }
  }

  function renderCharts() {
    renderBranchChart();
    renderRevenueChart();
    renderPlayersChart();
  }

  function renderBranchChart() {
    const ctx = document.getElementById('branchChart')?.getContext('2d');
    if (!ctx) return;

    const branchNames = branches.map(b => b.name);
    const branchCapacities = branches.map(b => b.capacity);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: branchNames,
        datasets: [{
          label: 'سعة الفروع',
          data: branchCapacities,
          backgroundColor: 'rgba(28, 113, 216, 0.5)',
          borderColor: 'rgba(28, 113, 216, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function renderRevenueChart() {
    const ctx = document.getElementById('revenueChart')?.getContext('2d');
    if (!ctx) return;

    // Use actual revenue data from branches if available
    const revenueData = branches.map(b => b.stats?.monthlyRevenue || 0);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: branches.map(b => b.name),
        datasets: [{
          label: 'إيرادات الفروع',
          data: revenueData,
          backgroundColor: 'rgba(76, 175, 80, 0.5)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function renderPlayersChart() {
    const ctx = document.getElementById('playersChart')?.getContext('2d');
    if (!ctx) return;

    // Use actual player data from branches if available
    const activePlayers = branches.map(b => b.stats?.activePlayers || 0);
    const totalPlayers = branches.map(b => b.stats?.totalPlayers || 0);
    const newPlayers = totalPlayers.map((total, index) => total - activePlayers[index]);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['لاعبون نشطون', 'لاعبون غير نشطين', 'لاعبون جدد'],
        datasets: [{
          label: 'عدد اللاعبين',
          data: [
            activePlayers.reduce((sum, val) => sum + val, 0),
            newPlayers.reduce((sum, val) => sum + val, 0),
            Math.floor(totalPlayers.reduce((sum, val) => sum + val, 0) * 0.1) // 10% of total as new players
          ],
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'توزيع اللاعبين'
          }
        }
      }
    });
  }

  function showSuccess(message) {
    // Implement a toast notification system
    alert(message); // Temporary using alert
  }

  function showError(message) {
    // Implement a toast notification system
    alert('خطأ: ' + message); // Temporary using alert
  }

  // Event listeners
  document.addEventListener('DOMContentLoaded', async ()=>{
    await loadBranches();
    
    // Add branch button
    document.getElementById('btn-add-branch').addEventListener('click', () => {
      openModal(false);
    });

    // Close modal on backdrop click
    document.getElementById('branchModal').addEventListener('click', (e) => {
      if (e.target.id === 'branchModal') {
        closeModal();
      }
    });
  });

  // Make functions global for HTML onclick
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.saveBranch = saveBranch;
  window.editBranch = editBranch;
  window.deleteBranch = deleteBranch;
})();
