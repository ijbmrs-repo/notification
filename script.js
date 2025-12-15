fetch('notifications.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load notifications.json');
    }
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('notifications');
    container.innerHTML = '';

    const docs = data.documents || [];

    const publicDocs = docs.filter(d => d.public === true);

    if (publicDocs.length === 0) {
      container.innerHTML = '<p>No notifications available.</p>';
      return;
    }

    publicDocs
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(doc => {
        const div = document.createElement('div');
        div.className = 'doc';

        div.innerHTML = `
          <div class="type">${doc.type}</div>
          <h3>${doc.title}</h3>
          <div class="meta">
            <div><strong>Reference ID:</strong> ${doc.reference_id}</div>
            <div><strong>Date:</strong> ${doc.date}</div>
            <div><strong>Issued by:</strong> ${doc.issued_by}</div>
          </div>
          <a class="button" href="${doc.pdf}" target="_blank">Download PDF</a>
        `;

        container.appendChild(div);
      });
  })
  .catch(error => {
    document.getElementById('notifications').innerHTML =
      '<p>Error loading notifications.</p>';
    console.error(error);
  });
