const API_URL = '/api/links';
const form = document.getElementById('shortenForm');
const messageEl = document.getElementById('message');
const tableBody = document.getElementById('linksTable');

// 1. Load Links on Page Start
document.addEventListener('DOMContentLoaded', fetchLinks);

// 2. Handle Form Submit (Create Link)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('Creating link...', 'text-gray-500');

    const url = document.getElementById('urlInput').value;
    const code = document.getElementById('codeInput').value;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, code: code || undefined })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Something went wrong');

        showMessage(`Success! Short link created: /${data.code}`, 'msg-success');
        form.reset();
        fetchLinks(); // Refresh table
    } catch (err) {
        showMessage(err.message, 'msg-error');
    }
});

// 3. Fetch and Display All Links
async function fetchLinks() {
  try {
    const res = await fetch(API_URL);

    // Try to parse JSON, but don't die if it's HTML/plain text
    let data = null;
    try {
      data = await res.json();
    } catch {
      // If parsing fails, leave data = null
    }

    if (!res.ok) {
      // Prefer backend error message if available
      const message =
        data && typeof data === 'object' && data.error
          ? data.error
          : `Request failed with status ${res.status}`;

      throw new Error(message);
    }

    // At this point, request was OK (2xx), but data might still be junk
    if (!Array.isArray(data)) {
      console.error('Unexpected response shape from API:', data);
      tableBody.innerHTML =
        `<tr><td colspan="5">Unexpected server response</td></tr>`;
      return;
    }

    if (data.length === 0) {
      tableBody.innerHTML =
        `<tr><td colspan="5">No links found</td></tr>`;
      return;
    }

    renderTable(data);
  } catch (err) {
    console.error('Error fetching links:', err);
    const fallback = err?.message || 'Failed to load links';
    tableBody.innerHTML =
      `<tr><td colspan="5">${fallback}</td></tr>`;
  }
}


// 4. Render Table Logic
function renderTable(links) {
    if (links.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-gray-400">No links yet. Create one above!</td></tr>`;
        return;
    }
    

    tableBody.innerHTML = links.map(link => {
        const shortUrl = `${window.location.origin}/${link.code}`;
        const date = link.last_clicked ? new Date(link.last_clicked).toLocaleString() : '-';

        return `
            <tr class="border-b last:border-0">
                <td class="p-4 font-medium text-blue-600">
                    <a href="/${link.code}" target="_blank" class="hover:underline">${link.code}</a>
                </td>
                <td class="p-4 truncate max-w-xs text-gray-500" title="${link.original_url}">
                    ${link.original_url}
                </td>
                <td class="p-4 text-center font-semibold">${link.clicks}</td>
                <td class="p-4 text-sm text-gray-400">${date}</td>
                <td class="p-4 text-right space-x-2">
                    <button onclick="copyToClipboard('${shortUrl}')" class="action-btn icon-btn copy-btn" title="Copy link">
                    </button>
                    <button onclick="deleteLink('${link.code}')" class="action-btn icon-btn delete-btn" title="Delete link">
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 5. Delete Link Action
async function deleteLink(code) {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
        const res = await fetch(`${API_URL}/${code}`, { method: 'DELETE' });
        if (res.ok) {
            fetchLinks();
        } else {
            
        }
    } catch (err) {
        console.error(err);
    }
}

// Helper: Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

// Helper: Show Message
function showMessage(text, colorClass) {
    messageEl.textContent = text;
    messageEl.className = `text-center text-sm font-medium ${colorClass} block mt-2`;
    setTimeout(() => { messageEl.classList.add('hidden'); }, 5000);
}

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderContent = document.getElementById('loader-content');
    const appContent = document.getElementById('app-content');

    let counter = 0;
    const target = 100;
    const duration = 1500; 
    const intervalTime = duration / target;

    const counterInterval = setInterval(() => {
        counter++;
        if (counter <= target) {
            loaderContent.textContent = counter + '%...';
        } else {
            clearInterval(counterInterval);

            // Hide loader
            loader.style.display = 'none';

            // Show app content
            appContent.style.display = 'block';
        }
    }, intervalTime);
});
