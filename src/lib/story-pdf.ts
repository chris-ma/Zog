import type { StoryHistoryEntry } from '@/components/scene/SceneView';

interface GeneratePdfOptions {
  storyTitle: string;
  playerName: string;
  endingTitle: string;
  endingBadge: string | null;
  history: StoryHistoryEntry[];
}

const PAGE_W = 210;   // A4 mm
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_H = 6;

function wrapText(text: string, maxWidth: number, fontSize: number, doc: InstanceType<typeof import('jspdf').jsPDF>): string[] {
  doc.setFontSize(fontSize);
  return doc.splitTextToSize(text, maxWidth) as string[];
}

export async function generateStoryPdf(opts: GeneratePdfOptions): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  let y = MARGIN;

  const checkPage = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // ── Cover block ──────────────────────────────────────────────────────────
  doc.setFillColor(15, 10, 20);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  doc.setTextColor(180, 130, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  const titleLines = wrapText(opts.storyTitle.toUpperCase(), CONTENT_W, 22, doc);
  titleLines.forEach((line) => {
    doc.text(line, PAGE_W / 2, y, { align: 'center' });
    y += 9;
  });

  y += 4;
  doc.setFontSize(11);
  doc.setTextColor(200, 160, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(`A story played by  ${opts.playerName}`, PAGE_W / 2, y, { align: 'center' });
  y += 6;

  if (opts.endingBadge) {
    const badgeLabel = `${opts.endingBadge} ENDING  ·  ${opts.endingTitle}`;
    doc.setFontSize(10);
    doc.setTextColor(255, 200, 80);
    doc.text(badgeLabel, PAGE_W / 2, y, { align: 'center' });
    y += 6;
  }

  // Divider
  y += 3;
  doc.setDrawColor(100, 60, 160);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  // ── Scenes ───────────────────────────────────────────────────────────────
  opts.history.forEach((entry, idx) => {
    const isTerminal = entry.choiceText === null;

    // Scene title
    checkPage(12);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 130, 255);
    const sceneLabel = `${isTerminal ? '★ ' : ''}${entry.title.toUpperCase()}`;
    const titleWrapped = wrapText(sceneLabel, CONTENT_W, 13, doc);
    titleWrapped.forEach((line) => {
      checkPage(LINE_H + 2);
      doc.text(line, MARGIN, y);
      y += LINE_H + 1;
    });
    y += 2;

    // Prose paragraphs
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 210, 240);
    const paragraphs = entry.prose.split('\n\n');
    paragraphs.forEach((para) => {
      const lines = wrapText(para.trim(), CONTENT_W, 10, doc);
      lines.forEach((line) => {
        checkPage(LINE_H);
        doc.text(line, MARGIN, y);
        y += LINE_H;
      });
      y += 2;
    });

    // Choice made (not on terminal)
    if (!isTerminal && entry.choiceText) {
      checkPage(10);
      y += 1;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(140, 200, 140);
      const choiceLines = wrapText(`▶  You chose: "${entry.choiceText}"`, CONTENT_W - 4, 9, doc);
      choiceLines.forEach((line) => {
        checkPage(LINE_H);
        doc.text(line, MARGIN + 2, y);
        y += LINE_H;
      });
      y += 4;

      // Section divider (not after last entry)
      if (idx < opts.history.length - 1) {
        checkPage(6);
        doc.setDrawColor(70, 40, 100);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 6;
      }
    }
  });

  // ── Footer ───────────────────────────────────────────────────────────────
  y += 6;
  checkPage(12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 130, 255);
  doc.text('✦  THE END  ✦', PAGE_W / 2, y, { align: 'center' });

  const safeTitle = opts.storyTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const safeName = opts.playerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  doc.save(`${safeTitle}-${safeName}.pdf`);
}
