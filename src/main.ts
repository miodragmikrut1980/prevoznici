import './styles.css';
import './navigation.css';

type ViewId = 'dashboard' | 'trips' | 'requests' | 'passengers' | 'packages' | 'vehicles' | 'finance' | 'public';

const labels: Record<ViewId, [string, string, string]> = {
  dashboard: ['DISPEČERSKI CENTAR', 'Dobro jutro', 'Petak, 11. septembar • najvažnije stvari za danas.'],
  trips: ['OPERATIVA', 'Ture', 'Dnevni raspored i popunjenost vozila.'],
  requests: ['SA SAJTA', 'Prijave', 'Pozovi, potvrdi ili odbij bez prekucavanja.'],
  passengers: ['BAZA', 'Putnici', 'Kontakti i istorija putovanja.'],
  packages: ['DOSTAVE', 'Paketi', 'Pošiljalac, primalac i naplata.'],
  vehicles: ['FLOTA', 'Vozila', 'Servis, dokumenti i raspoloživost.'],
  finance: ['OPERATIVA', 'Finansije', 'Brz pregled današnjih naplata.'],
  public: ['PREVIEW ZA PUTNIKA', 'Javna prijava', 'Mobilni tok koji putnik vidi sa sajta.'],
};

const topbar = document.querySelector<HTMLElement>('.topbar')!;
const heading = topbar.firstElementChild as HTMLElement;
const headingGroup = document.createElement('div');
const backButton = document.createElement('button');
let currentView: ViewId = 'dashboard';
const viewHistory: ViewId[] = [];

headingGroup.className = 'topbar-heading';
backButton.id = 'backBtn';
backButton.className = 'back-btn';
backButton.type = 'button';
backButton.hidden = true;
backButton.setAttribute('aria-label', 'Vrati se na prethodni ekran');
backButton.innerHTML = '<span aria-hidden="true">←</span><span class="back-label">Nazad</span>';
topbar.insertBefore(headingGroup, heading);
headingGroup.append(backButton, heading);

function updateBackButton() {
  backButton.hidden = viewHistory.length === 0;
}

function setView(id: ViewId, recordHistory = true) {
  if (id === currentView) return;
  if (recordHistory) viewHistory.push(currentView);
  currentView = id;
  document.querySelectorAll<HTMLElement>('.view').forEach((el) => el.classList.toggle('active', el.id === id));
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === id));
  const [eyebrow, title, subtitle] = labels[id];
  document.getElementById('eyebrow')!.textContent = eyebrow;
  document.getElementById('pageTitle')!.textContent = title;
  document.getElementById('pageSubtitle')!.textContent = subtitle;
  updateBackButton();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

backButton.addEventListener('click', () => {
  const previousView = viewHistory.pop();
  if (!previousView) return;
  setView(previousView, false);
});

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const viewButton = target.closest<HTMLElement>('[data-view]');
  if (viewButton?.dataset.view) setView(viewButton.dataset.view as ViewId);
});

function toast(message: string) {
  const el = document.getElementById('toast')!;
  el.textContent = message;
  el.classList.add('show');
  window.setTimeout(() => el.classList.remove('show'), 2200);
}

function updateRequestCount() {
  const count = document.querySelectorAll('[data-request]').length;
  document.getElementById('requestBadge')!.textContent = String(count);
  document.getElementById('mobileRequestBadge')!.textContent = String(count);
  document.getElementById('statRequests')!.textContent = String(count);
  document.getElementById('requestsEmpty')!.classList.toggle('show', count === 0);
}

document.getElementById('requestList')!.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const row = target.closest<HTMLElement>('[data-request]');
  if (!row) return;
  if (target.classList.contains('accept') || target.classList.contains('reject')) {
    const accepted = target.classList.contains('accept');
    row.remove();
    updateRequestCount();
    toast(accepted ? 'Prijava je potvrđena i dodata na turu.' : 'Prijava je odbijena.');
  }
});

const passengers = [
  ['Marija Jovanović', '+381 64 220 4471', '6 putovanja', '120 €'],
  ['Dušan Petrović', '+381 63 118 5520', '4 putovanja', '90 €'],
  ['Ana Simić', '+381 64 330 9011', '9 putovanja', '185 €'],
  ['Miloš Ilić', '+381 65 441 2288', '2 putovanja', '40 €'],
];

const packages = [
  ['Petrović → Ilić', 'Sombor → Novi Sad', 'Danas • 09:30', '10 €'],
  ['Matić → Popović', 'Novi Sad → Beograd', 'Danas • 16:00', '15 €'],
  ['Jovanović → Kovač', 'Sombor → Beograd', 'Sutra • 09:30', '20 €'],
];

function renderRows(containerId: string, rows: string[][], filter = '') {
  const query = filter.trim().toLowerCase();
  const filtered = rows.filter((row) => row.join(' ').toLowerCase().includes(query));
  document.getElementById(containerId)!.innerHTML = filtered.map((row) => `<article class='person-row'><div><strong>${row[0]}</strong><small>${row[1]}</small></div><div><strong>${row[2]}</strong><small>poslednja aktivnost</small></div><span class='amount'>${row[3]}</span></article>`).join('') || `<div class='empty-state show'><h3>Nema rezultata</h3><p>Probajte drugi pojam za pretragu.</p></div>`;
}

renderRows('passengerList', passengers);
renderRows('packageList', packages);
document.getElementById('passengerSearch')!.addEventListener('input', (event) => renderRows('passengerList', passengers, (event.target as HTMLInputElement).value));
document.getElementById('packageSearch')!.addEventListener('input', (event) => renderRows('packageList', packages, (event.target as HTMLInputElement).value));

const entryModal = document.getElementById('entryModal')!;
const formTitle = document.getElementById('formTitle')!;
const formBody = document.getElementById('formBody')!;
const forms: Record<string, [string, string]> = {
  passenger: ['Novi putnik', `<div class='form-grid'><label>Ime i prezime<input placeholder='Ime i prezime'></label><label>Telefon<input placeholder='+381 6x xxx xxxx'></label><label>Relacija<select><option>Sombor → Beograd</option><option>Novi Sad → Beograd</option></select></label><label>Broj mesta<select><option>1</option><option>2</option><option>3</option></select></label></div>`],
  trip: ['Nova tura', `<div class='form-grid'><label>Polazak<input value='Sombor'></label><label>Odredište<input value='Beograd'></label><label>Datum<input type='date'></label><label>Vreme<input type='time'></label></div>`],
  package: ['Novi paket', `<div class='form-grid'><label>Pošiljalac<input placeholder='Ime'></label><label>Primalac<input placeholder='Ime'></label><label>Relacija<input placeholder='Sombor → Novi Sad'></label><label>Cena<input placeholder='10 €'></label></div>`],
  vehicle: ['Novo vozilo', `<div class='form-grid'><label>Vozilo<input placeholder='Mercedes Vito'></label><label>Registracija<input placeholder='SO 000-AA'></label><label>Broj mesta<input type='number' value='8'></label><label>Kilometraža<input type='number'></label></div>`],
};

function openForm(type = 'passenger') {
  const form = forms[type] || forms.passenger;
  formTitle.textContent = form[0];
  formBody.innerHTML = form[1];
  entryModal.classList.add('open');
  entryModal.setAttribute('aria-hidden', 'false');
}

function closeForm() {
  entryModal.classList.remove('open');
  entryModal.setAttribute('aria-hidden', 'true');
}

document.getElementById('quickAdd')!.addEventListener('click', () => openForm('passenger'));
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const open = target.closest<HTMLElement>('[data-open-form]');
  if (open) openForm(open.dataset.openForm);
  if (target.closest('[data-close]')) closeForm();
  if (target.closest('.pay-btn')) toast('Naplata je označena u demo prikazu.');
});
document.getElementById('saveForm')!.addEventListener('click', () => { closeForm(); toast('Unos je sačuvan u prototipu.'); });
entryModal.addEventListener('click', (event) => { if (event.target === entryModal) closeForm(); });

const driverModal = document.getElementById('driverModal')!;
document.getElementById('driverBtn')!.addEventListener('click', () => { driverModal.classList.add('open'); driverModal.setAttribute('aria-hidden', 'false'); });
document.addEventListener('click', (event) => { if ((event.target as HTMLElement).closest('[data-close-driver]')) { driverModal.classList.remove('open'); driverModal.setAttribute('aria-hidden', 'true'); } });
document.getElementById('completeStop')!.addEventListener('click', (event) => { (event.target as HTMLButtonElement).textContent = 'Sledeće: stajanje 3'; toast('Sledeći putnik dobija poruku da mu se kombi približava.'); });

const chooseTrip = document.getElementById('chooseTrip')!;
chooseTrip.addEventListener('click', () => { document.getElementById('publicForm')!.classList.add('show'); chooseTrip.textContent = 'Tura izabrana'; });
document.getElementById('publicForm')!.addEventListener('submit', (event) => { event.preventDefault(); const form = event.currentTarget as HTMLFormElement; if (!form.reportValidity()) return; form.style.display = 'none'; document.getElementById('publicSuccess')!.classList.add('show'); });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeForm();
    driverModal.classList.remove('open');
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    const target = event.target as HTMLElement;
    const shortcut = target.closest<HTMLElement>('.actionable-card[data-view]');
    if (shortcut?.dataset.view) {
      event.preventDefault();
      setView(shortcut.dataset.view as ViewId);
    }
  }
});
