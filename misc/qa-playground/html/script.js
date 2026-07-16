/* global faker: false */
/* eslint-env browser */
'use strict';

// ========================
// TAB NAVIGATION
// ========================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const tab = document.getElementById('tab-' + btn.dataset.tab);
    if (tab) tab.classList.add('active');
  });
});

// ========================
// RANGE SLIDER
// ========================
const rangeSlider = document.getElementById('range-slider');
const rangeValue = document.getElementById('range-value');
if (rangeSlider && rangeValue) {
  rangeSlider.addEventListener('input', () => {
    rangeValue.textContent = rangeSlider.value;
  });
}

// ========================
// INDETERMINATE CHECKBOX
// ========================
const indeterminateCheck = document.getElementById('check-indeterminate');
if (indeterminateCheck) indeterminateCheck.indeterminate = true;

// ========================
// FORM VALIDATION
// ========================
const validateForm = document.getElementById('form-validation');
const validateBtn = document.getElementById('validate-btn');
const summary = document.getElementById('validation-summary');

if (validateForm && validateBtn) {
  const pass1 = document.getElementById('val-pass1');
  const pass2 = document.getElementById('val-pass2');

  // Custom validity checker
  const customField = document.getElementById('val-custom');
  if (customField) {
    customField.addEventListener('input', () => {
      if (customField.value !== 'valid' && customField.value !== '') {
        customField.setCustomValidity('Must equal "valid"');
      } else {
        customField.setCustomValidity('');
      }
    });
  }

  // Password match check
  if (pass1 && pass2) {
    const checkPasswords = () => {
      if (pass2.value && pass1.value !== pass2.value) {
        pass2.setCustomValidity('Passwords do not match');
      } else {
        pass2.setCustomValidity('');
      }
    };
    pass1.addEventListener('input', checkPasswords);
    pass2.addEventListener('input', checkPasswords);
  }

  validateBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Trigger browser validation UI
    if (!validateForm.checkValidity()) {
      validateForm.reportValidity();
      const invalid = validateForm.querySelectorAll(':invalid');
      summary.className = 'error';
      summary.textContent = `Validation failed — ${invalid.length} invalid field(s).`;
      return;
    }

    summary.className = 'success';
    summary.textContent = '✓ All fields valid!';
  });
}

// ========================
// API DEMO
// ========================
const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:3003'
  : location.protocol + '//' + location.hostname + ':3003';

document.getElementById('api-fetch-btn')?.addEventListener('click', fetchResource);
document.getElementById('api-resource')?.addEventListener('change', fetchResource);

async function fetchResource() {
  const resource = document.getElementById('api-resource').value;
  const tableHead = document.querySelector('#api-table thead tr');
  const tableBody = document.querySelector('#api-table tbody');
  if (!tableHead || !tableBody) return;

  tableHead.textContent = 'Loading...';
  tableBody.innerHTML = '';

  try {
    const res = await fetch(`${API_BASE}/${resource}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tableHead.innerHTML = '<tr><th>No data found</th></tr>';
      return;
    }

    const columns = Object.keys(data[0]);
    tableHead.innerHTML = '<tr>' + columns.map(c => `<th>${c}</th>`).join('') + '<th>Actions</th></tr>';
    tableBody.innerHTML = data.map(row =>
      '<tr>' +
      columns.map(c => '<td>' + formatCell(row[c]) + '</td>').join('') +
      `<td><button class="btn" onclick="deleteRecord('${resource}',${row.id})">Delete</button></td>` +
      '</tr>'
    ).join('');

    // Populate create form
    populateCreateForm(resource, columns);
  } catch (err) {
    tableHead.innerHTML = `<tr><th>Error: ${err.message}</th></tr>`;
  }
}

function formatCell(val) {
  if (val === null || val === undefined) return '<em>null</em>';
  if (typeof val === 'boolean') return val ? '✓' : '✗';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

async function deleteRecord(resource, id) {
  if (!confirm(`Delete ${resource}/${id}?`)) return;
  try {
    const res = await fetch(`${API_BASE}/${resource}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    document.getElementById('api-result').textContent = `Deleted ${resource}/${id}`;
    fetchResource();
  } catch (err) {
    document.getElementById('api-result').textContent = `Error: ${err.message}`;
  }
}

function populateCreateForm(resource, columns) {
  const container = document.getElementById('api-create-fields');
  container.innerHTML = columns
    .filter(c => c !== 'id')
    .map(c => {
      const type = typeof getSampleValue(c) === 'boolean' ? 'checkbox' : 'text';
      const checked = type === 'checkbox' ? '' : '';
      return `<label>${c}: <input type="${type}" name="${c}" ${checked}></label>`;
    }).join('');
}

const sampleValues = {
  name: 'Test Name',
  email: 'test@example.com',
  role: 'user',
  active: true,
  phone: '+62812345678',
  price: 10000,
  quantity: 1,
  status: 'pending',
  title: 'Test Title',
  body: 'Test content...',
  category: 'general',
  inStock: true,
  rating: 4.0,
  total: 0,
  userId: 1,
  productId: 1,
  slug: 'test-slug',
};

function getSampleValue(key) {
  return key in sampleValues ? sampleValues[key] : 'test';
}

document.getElementById('api-create-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const resource = document.getElementById('api-resource').value;
  const form = e.target;
  const data = {};
  const inputs = form.querySelectorAll('#api-create-fields input');
  inputs.forEach(input => {
    data[input.name] = input.type === 'checkbox' ? input.checked : input.value;
  });

  try {
    const res = await fetch(`${API_BASE}/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    document.getElementById('api-result').textContent =
      'Created: ' + JSON.stringify(result, null, 2);
    fetchResource();
  } catch (err) {
    document.getElementById('api-result').textContent = `Error: ${err.message}`;
  }
});

// Initial load
if (document.getElementById('tab-api')?.classList.contains('active')) {
  fetchResource();
}

// ========================
// DUMMY DATA GENERATOR
// ========================
// Fallback if faker not loaded
function ensureFaker() {
  if (typeof faker !== 'undefined') return true;
  document.getElementById('dummy-result').textContent =
    'Faker.js not loaded. Check internet connection or CDN availability.';
  return false;
}

function generateUsers(count) {
  if (!ensureFaker()) return [];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number('+6281##########'),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    jobTitle: faker.person.jobTitle(),
    company: faker.company.name(),
    avatar: faker.image.avatar(),
  }));
}

function generateProducts(count) {
  if (!ensureFaker()) return [];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.commerce.productName(),
    price: parseInt(faker.commerce.price({ min: 10000, max: 10000000 })),
    category: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    inStock: faker.datatype.boolean(),
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
  }));
}

function generateNames(count) {
  if (!ensureFaker()) return [];
  return Array.from({ length: count }, () => ({
    name: faker.person.fullName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    prefix: faker.person.prefix(),
  }));
}

function generateEmailsPhones(count) {
  if (!ensureFaker()) return [];
  return Array.from({ length: count }, () => ({
    email: faker.internet.email(),
    phone: faker.phone.number('+6281##########'),
    username: faker.internet.username(),
    domain: faker.internet.domainName(),
  }));
}

function generateAddresses(count) {
  if (!ensureFaker()) return [];
  return Array.from({ length: count }, () => ({
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  }));
}

function generateLorem(count) {
  if (!ensureFaker()) return [];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    paragraph: faker.lorem.paragraph(),
    words: faker.lorem.words({ min: 10, max: 30 }),
  }));
}

const dummyHandlers = {
  'dummy-users': generateUsers,
  'dummy-products': generateProducts,
  'dummy-names': generateNames,
  'dummy-emails': generateEmailsPhones,
  'dummy-addresses': generateAddresses,
  'dummy-lorem': generateLorem,
};

Object.entries(dummyHandlers).forEach(([btnId, fn]) => {
  document.getElementById(btnId)?.addEventListener('click', () => {
    const count = parseInt(document.getElementById('dummy-count')?.value || '5');
    const data = fn(count);
    document.getElementById('dummy-result').textContent = JSON.stringify(data, null, 2);
  });
});

document.getElementById('dummy-copy')?.addEventListener('click', async () => {
  const text = document.getElementById('dummy-result').textContent;
  if (!text || text === 'Click a button to generate data...') return;
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById('dummy-copy');
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  } catch {
    alert('Copy failed. Select the text manually.');
  }
});
