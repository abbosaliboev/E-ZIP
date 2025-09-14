// src/utils/contractPdf.js
import jsPDF from 'jspdf';

// Kontrakt PDF yasash
export function buildContractPdf({
  roomId,
  landlord = 'Landlord',
  tenantName,
  tenantEmail,
  tenantPhone,
  moveInDate,
  address,
  monthlyRent,
  deposit,
}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pad = 48;
  let y = pad;

  const line = (txt, inc = 22, bold = false) => {
    if (bold) doc.setFont(undefined, 'bold');
    doc.text(txt, pad, y);
    if (bold) doc.setFont(undefined, 'normal');
    y += inc;
  };

  // Header
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Residential Lease Agreement (Demo)', pad, y);
  y += 10;
  doc.setLineWidth(1);
  doc.line(pad, y, 595 - pad, y);
  y += 24;

  // Meta
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  line(`Room ID: ${roomId}`, 18);
  if (address) line(`Address: ${address}`, 18);
  if (monthlyRent != null) line(`Monthly Rent: ₩${Number(monthlyRent).toLocaleString()} 만`, 18);
  if (deposit != null) line(`Deposit: ${Number(deposit) === 0 ? 'No deposit' : `₩${Number(deposit).toLocaleString()} 만`}`, 18);
  y += 6;

  doc.setLineWidth(0.5);
  doc.line(pad, y, 595 - pad, y);
  y += 18;

  // Parties
  line(`Landlord: ${landlord}`, 18, true);
  line(`Tenant: ${tenantName}`, 18);
  line(`Tenant Email: ${tenantEmail}`, 18);
  line(`Tenant Phone: ${tenantPhone}`, 18);
  line(`Intended Move-in: ${moveInDate}`, 18);
  y += 6;

  doc.line(pad, y, 595 - pad, y);
  y += 18;

  // Clauses (mini)
  const clauses = [
    '1) This is a demo agreement generated for preview purposes.',
    '2) Parties agree to discuss and finalize terms via chat.',
    '3) Security deposit (if any) and first month rent to be settled before move-in.',
    '4) Tenant agrees to follow building rules and maintain property.',
    '5) Any changes must be confirmed by both parties in writing.',
  ];
  clauses.forEach(c => line(c, 18));

  y += 18;
  doc.setFont(undefined, 'bold');
  line('Signatures', 18);
  doc.setFont(undefined, 'normal');
  line(`Landlord: ______________________        Date: ____________`, 24);
  line(`Tenant:   ______________________        Date: ____________`, 24);

  // Return blob & filename
  const blob = doc.output('blob');
  const filename = `contract_room_${roomId}.pdf`;
  return { blob, filename, doc };
}

// Foydalanuvchi preview ko‘rishi uchun: yangi oynada ochish
export function openPdfInNewTab(blob) {
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank');
  if (!w) alert('Please allow pop-ups to preview the PDF.');
  // tozalik
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}