// Config: change if you want
const CONFIG = {
  upiId: "ravikishankumar2200548@okhdfcbank",  // <<-- your UPI (already set)
  amount: "10000", // amount in rupees
  // WhatsApp admin phone (INTERNATIONAL format without +). If you want admin to receive messages to a number on click, set it here (like "919955231739").
  // If left empty, clicking WA button will open a share dialog with message only.
  adminWhatsAppNumber: "",  
  adminName: "WhitenIND Admin"
};

// helper: build UPI URI
function buildUpiUri(upi, amount, note="Payment for Digital Freedom Course") {
  // UPI URI format: upi://pay?pa=VPA&pn=Name&am=10&cu=INR&tn=note
  const pa = encodeURIComponent(upi);
  const pn = encodeURIComponent(CONFIG.adminName);
  const am = encodeURIComponent(amount);
  const tn = encodeURIComponent(note);
  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
}

// generate QR using qrcode.min.js (CDN included in index.html)
function generateQr() {
  const uri = buildUpiUri(CONFIG.upiId, CONFIG.amount);
  const qrcodeEl = document.getElementById('qrcode');
  qrcodeEl.innerHTML = "";
  QRCode.toCanvas(uri, {width:200, margin:2}, function (err, canvas) {
    if (err) {
      // fallback: show plain text
      qrcodeEl.textContent = "QR generator error — scan UPI ID manually";
      console.error(err);
      return;
    }
    qrcodeEl.appendChild(canvas);
  });
  // show UPI ID text
  document.getElementById('upiId').textContent = CONFIG.upiId;
}

// WhatsApp button handler
function setupWhatsApp() {
  const waBtn = document.getElementById('waBtn');
  waBtn.addEventListener('click', () => {
    const message = `Hello Admin, I have made payment of ₹${CONFIG.amount} for Digital Freedom Course.\nMy name: \nUPI Txn ID (if available): \nPlease verify and enroll me. Thank you.`;
    if (CONFIG.adminWhatsAppNumber && CONFIG.adminWhatsAppNumber.length>5) {
      // open chat with number
      const url = `https://wa.me/${CONFIG.adminWhatsAppNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      // open WhatsApp Web share dialog (mobile will open WhatsApp)
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  });
}

// load sellers from sellers.json
async function loadSellers() {
  try {
    const res = await fetch('sellers.json', {cache:'no-store'});
    const data = await res.json();
    const grid = document.getElementById('sellersGrid');
    grid.innerHTML = '';
    data.slice(0,10).forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'seller';
      div.innerHTML = `<img src="${s.photo}" alt="${s.name}"><div><strong>${i+1}. ${s.name}</strong><div class="small">Sales: ₹${s.sales}</div></div>`;
      grid.appendChild(div);
    });
  } catch(e) {
    console.error(e);
  }
}

// init
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  generateQr();
  setupWhatsApp();
  loadSellers();
});
