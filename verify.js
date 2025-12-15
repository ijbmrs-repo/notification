function normalizeRef(ref) {
  return ref.trim().toUpperCase();
}

function verify() {
  const input = document.getElementById('refInput').value;
  const refId = normalizeRef(input);
  const resultDiv = document.getElementById('result');

  resultDiv.innerHTML = '';

  if (!refId) {
    resultDiv.innerHTML = '<p>Please enter a Reference ID.</p>';
    return;
  }

  fetch('notifications.json')
    .then(response => response.json())
    .then(data => {
      const docs = data.documents || [];
      const record = docs.find(d => normalizeRef(d.reference_id) === refId);

      if (!record) {
        resultDiv.innerHTML = `
          <div class="result invalid">
            <strong>❌ Not Found</strong>
            <p>No record exists for Reference ID <strong>${refId}</strong>.</p>
          </div>
        `;
        return;
      }

      let html = `
        <div class="result valid">
          <strong>✅ Valid Document</strong>
          <p><strong>Reference ID:</strong> ${record.reference_id}</p>
          <p><strong>Type:</strong> ${record.type}</p>
          <p><strong>Title:</strong> ${record.title || '—'}</p>
          <p><strong>Issued by:</strong> ${record.issued_by}</p>
          <p><strong>Date of Issue:</strong> ${record.date}</p>
      `;

      if (record.author) {
        html += `<p><strong>Author / Officer:</strong> ${record.author}</p>`;
      }

      if (record.issuer_email) {
        html += `<p><strong>Issuer Email:</strong> ${record.issuer_email}</p>`;
      }

      html += `
          <p>
            <a href="${record.pdf}" target="_blank">
              ⬇ Download Official PDF
            </a>
          </p>
        </div>
      `;

      resultDiv.innerHTML = html;
    })
    .catch(error => {
      console.error(error);
      resultDiv.innerHTML = '<p>Error verifying document.</p>';
    });
}
