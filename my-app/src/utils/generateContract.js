import { jsPDF } from 'jspdf';

/**
 * Generates a rental contract PDF document.
 */
export function buildContractPDF({ listing, tenant, owner, startDate }) {
  const doc = new jsPDF();

  const line = (y) => doc.line(20, y, 190, y);

  doc.setFontSize(18);
  doc.text('Residential Lease Agreement', 20, 20);

  doc.setFontSize(12);
  doc.text(`Property: ${listing.title}`, 20, 38);
  doc.text(`Address: ${listing.address || listing.city}`, 20, 46);
  doc.text(`Monthly Rent: ₩${(listing.priceMonthly || 0).toLocaleString()}`, 20, 54);
  doc.text(`Deposit: ${listing.deposit === 0 ? 'No deposit' : '₩' + (listing.deposit || 0).toLocaleString()}`, 20, 62);

  line(70);

  doc.text(`Tenant: ${tenant.name}`, 20, 82);
  if (tenant.email) doc.text(`Email: ${tenant.email}`, 20, 90);
  if (tenant.phone) doc.text(`Phone: ${tenant.phone}`, 20, 98);
  if (tenant.id) doc.text(`ID/Passport: ${tenant.id}`, 20, 106);

  doc.text(`Owner: ${owner.name}`, 120, 82);
  if (owner.email) doc.text(`Email: ${owner.email}`, 120, 90);

  line(116);

  const sd = startDate ? new Date(startDate) : new Date();
  doc.text(`Start Date: ${sd.toLocaleDateString()}`, 20, 130);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 138);
  doc.text('By accepting, both parties agree to the terms of this rental.', 20, 152);

  line(162);
  doc.text('Tenant Signature', 20, 168);
  line(182);
  doc.text('Owner Signature', 20, 188);

  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  const filename = `contract_${listing.id}.pdf`;
  return { blob, blobUrl, filename };
}