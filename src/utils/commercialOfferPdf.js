import jsPDF from "jspdf";
import { formatMoney } from "./calculatePrice";

function money(value) {
  return formatMoney(value).replace("₽", "руб.");
}

function safe(value) {
  return String(value || "");
}

export function generateCommercialOfferPdf(order) {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  let y = 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ", 15, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`№ ${safe(order.number)}`, 15, y);
  doc.text(`Дата: ${safe(order.date)}`, 150, y);

  y += 10;

  doc.setFillColor(245, 245, 245);
  doc.rect(15, y, 180, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ПОСТАВЩИК", 18, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text("ООО Building Stone", 18, y + 13);
  doc.text("ИНН: 775125037739", 18, y + 18);

  y += 32;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("КЛИЕНТ / ОБЪЕКТ", 15, y);

  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Клиент: ${safe(order.clientName || order.customer?.clientName || "-")}`, 15, y);
  y += 6;

  doc.text(`Телефон: ${safe(order.clientPhone || order.customer?.clientPhone || "-")}`, 15, y);
  y += 6;

  const address = safe(order.address || order.customer?.address || "-");
  const addressLines = doc.splitTextToSize(`Адрес: ${address}`, 170);
  doc.text(addressLines, 15, y);

  y += addressLines.length * 5 + 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.setFillColor(25, 25, 25);
  doc.setTextColor(255, 255, 255);

  doc.rect(15, y, 180, 8, "F");

  doc.text("Наименование", 18, y + 5.5);
  doc.text("Кол-во", 120, y + 5.5);
  doc.text("Цена", 145, y + 5.5);
  doc.text("Сумма", 172, y + 5.5);

  y += 8;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  const allItems = [
    ...(order.cart || []),
    ...(order.deliveryItems || []),
  ];

  allItems.forEach((item) => {
    if (y > 260) {
      doc.addPage();
      y = 15;
    }

    const title = safe(item.title || item.shortTitle || "Позиция");

    let qty = item.qty || item.pieces || 1;

    if (item.type === "block") {
      qty = `${item.m3} м3`;
    }

    if (item.type === "ceramic") {
      qty = `${item.qty} шт`;
    }

    if (item.type === "delivery") {
      qty = `${item.qty} рейс`;
    }

    const lineTotal = money(item.total || 0);
    const linePrice = money(item.finalPrice || item.price || 0);

    const titleLines = doc.splitTextToSize(title, 95);

    const rowHeight = Math.max(8, titleLines.length * 5 + 3);

    doc.rect(15, y, 180, rowHeight);

    doc.text(titleLines, 18, y + 5);
    doc.text(String(qty), 122, y + 5);
    doc.text(linePrice, 145, y + 5);
    doc.text(lineTotal, 172, y + 5);

    y += rowHeight;
  });

  y += 8;

  doc.setFillColor(245, 245, 245);
  doc.rect(110, y, 85, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text("Товары:", 115, y + 7);
  doc.text(money(order.goodsTotal || 0), 170, y + 7);

  doc.text("Доставка:", 115, y + 14);
  doc.text(money(order.deliveryTotal || 0), 170, y + 14);

  doc.setFontSize(14);

  doc.text("ИТОГО:", 115, y + 22);
  doc.text(money(order.total || 0), 165, y + 22);

  y += 38;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const footer = [
    "Условия:",
    "• Цена действительна 2 рабочих дня",
    "• Доставка рассчитывается по фактическому адресу",
    "• Возможна корректировка стоимости при изменении объема",
  ];

  footer.forEach((line) => {
    doc.text(safe(line), 15, y);
    y += 4;
  });

  doc.save(`KP-${safe(order.number)}.pdf`);
}
