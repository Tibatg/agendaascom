import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MunicipalAction, Secretariat, HeaderFooterConfig } from '../types';

export interface GeneratePdfOptions {
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  reportType: 'simplificado' | 'detalhado';
  secretariaNome?: string;
  periodoStr?: string;
  statusStr?: string;
  responsavelStr?: string;
  layoutConfig?: HeaderFooterConfig;
  orientation?: 'portrait' | 'landscape';
}

export function generateActionsReportPDF({
  acoes,
  secretarias,
  reportType,
  secretariaNome = 'Todas as Secretarias',
  periodoStr = 'Todo o período',
  statusStr = 'Todos os status',
  responsavelStr = 'Todos os responsáveis',
  layoutConfig,
  orientation = reportType === 'detalhado' ? 'landscape' : 'portrait'
}: GeneratePdfOptions): void {
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Colors & Styling
  const primaryColor = [30, 58, 138]; // #1e3a8a
  const slateDark = [15, 23, 42]; // #0f172a
  const slateMuted = [100, 116, 139]; // #64748b

  // Top decorative institutional bar
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Institutional Title
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(
    (layoutConfig?.portalTitulo || 'PREFEITURA MUNICIPAL DE ITAPECURU MIRIM').toUpperCase(),
    14,
    14
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(
    layoutConfig?.portalSubtitulo || 'Calendário Oficial de Ações e Demandas das Secretarias Municipais',
    14,
    19
  );

  // Document Type Header
  const reportTitle = reportType === 'detalhado' 
    ? 'RELATÓRIO DETALHADO DE DEMANDAS GOVERNAMENTAIS'
    : 'RELATÓRIO CONSOLIDADO DE DEMANDAS GOVERNAMENTAIS';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(reportTitle, 14, 26);

  // Divider Line
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.setLineWidth(0.5);
  doc.line(14, 28, pageWidth - 14, 28);

  // Metadata / Filter Summary Box
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.roundedRect(14, 30.5, pageWidth - 28, 18, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225); // #cbd5e1
  doc.roundedRect(14, 30.5, pageWidth - 28, 18, 2, 2, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

  const col1 = 17;
  const col2 = orientation === 'landscape' ? 110 : 85;
  const col3 = orientation === 'landscape' ? 200 : 145;

  const now = new Date();
  const dataEmissao = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  doc.text(`• Secretaria: ${secretariaNome}`, col1, 35.5);
  doc.text(`• Período: ${periodoStr}`, col1, 40.5);
  doc.text(`• Status: ${statusStr}`, col1, 45.5);

  doc.text(`• Responsável: ${responsavelStr}`, col2, 35.5);
  doc.text(`• Tipo: ${reportType === 'detalhado' ? 'Detalhado (com descrições)' : 'Simplificado'}`, col2, 40.5);
  doc.text(`• Total de Ações: ${acoes.length} registro(s)`, col2, 45.5);

  doc.text(`• Data de Emissão: ${dataEmissao}`, col3, 35.5);
  doc.text(`• Autenticidade: Sistema Municipal ASCOM`, col3, 40.5);
  doc.text(`• Formato: Documento Oficial PDF`, col3, 45.5);

  // Prepare table data
  let tableHeaders: string[] = [];
  let tableRows: any[][] = [];

  if (reportType === 'simplificado') {
    tableHeaders = ['Data', 'Horário', 'Ação / Demanda', 'Secretaria', 'Local', 'Origem Recurso', 'Status'];
    tableRows = acoes.map(act => {
      const sec = secretarias.find(s => s.id === act.secretaria_id);
      const dataFmt = act.data_inicio.split('-').reverse().join('/');
      const horaFmt = act.hora_inicio + (act.hora_fim ? ` às ${act.hora_fim}` : '');
      const recursoFmt = `${act.origem_recurso || 'Recursos Próprios'}${act.detalhe_origem ? ` (${act.detalhe_origem})` : ''}`;

      return [
        dataFmt,
        horaFmt,
        act.titulo,
        sec?.sigla || 'Sec.',
        act.local,
        recursoFmt,
        act.status
      ];
    });
  } else {
    // Detalhado
    tableHeaders = ['Data/Hora', 'Demanda & Descrição', 'Secretaria', 'Local', 'Responsável', 'Origem do Recurso', 'Status'];
    tableRows = acoes.map(act => {
      const sec = secretarias.find(s => s.id === act.secretaria_id);
      const dataHoraFmt = `${act.data_inicio.split('-').reverse().join('/')}\n${act.hora_inicio}${act.hora_fim ? ` - ${act.hora_fim}` : ''}`;
      const descrFmt = act.descricao ? `${act.titulo}\n\n${act.descricao}` : act.titulo;
      const recursoFmt = `${act.origem_recurso || 'Recursos Próprios'}${act.detalhe_origem ? `\n(${act.detalhe_origem})` : ''}`;

      return [
        dataHoraFmt,
        descrFmt,
        sec?.sigla || 'Sec.',
        act.local,
        act.responsavel,
        recursoFmt,
        act.status
      ];
    });
  }

  // Generate Table with autoTable
  autoTable(doc, {
    startY: 52,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
      cellPadding: 2.5
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: reportType === 'simplificado' ? {
      0: { cellWidth: 20 }, // Data
      1: { cellWidth: 22 }, // Horário
      2: { cellWidth: orientation === 'landscape' ? 85 : 55, fontStyle: 'bold' }, // Ação
      3: { cellWidth: 18 }, // Secretaria
      4: { cellWidth: orientation === 'landscape' ? 50 : 35 }, // Local
      5: { cellWidth: orientation === 'landscape' ? 45 : 30 }, // Origem Recurso
      6: { cellWidth: 22, halign: 'center', fontStyle: 'bold' } // Status
    } : {
      0: { cellWidth: 22 }, // Data/Hora
      1: { cellWidth: orientation === 'landscape' ? 100 : 60, fontStyle: 'bold' }, // Demanda & Descrição
      2: { cellWidth: 18 }, // Secretaria
      3: { cellWidth: orientation === 'landscape' ? 45 : 30 }, // Local
      4: { cellWidth: orientation === 'landscape' ? 35 : 25 }, // Responsável
      5: { cellWidth: orientation === 'landscape' ? 32 : 22 }, // Origem Recurso
      6: { cellWidth: 20, halign: 'center', fontStyle: 'bold' } // Status
    },
    didParseCell: (data) => {
      // Custom styling for status column
      const statusColIndex = reportType === 'simplificado' ? 6 : 6;
      if (data.section === 'body' && data.column.index === statusColIndex) {
        const val = String(data.cell.raw);
        if (val === 'Concluído') {
          data.cell.styles.textColor = [22, 101, 52]; // green-800
        } else if (val === 'Agendado') {
          data.cell.styles.textColor = [30, 64, 175]; // blue-800
        } else if (val === 'Em andamento') {
          data.cell.styles.textColor = [180, 83, 9]; // amber-700
        } else if (val === 'Cancelado') {
          data.cell.styles.textColor = [190, 18, 60]; // rose-700
        }
      }
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : (doc as any).internal.pages.length - 1;
      const currentPage = data.pageNumber;

      // Bottom footer line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

      // Footer text
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      
      const rodapeEsquerdo = `${layoutConfig?.rodapeTitulo || 'Prefeitura Municipal de Itapecuru Mirim'} • ASCOM / Gabinete`;
      doc.text(rodapeEsquerdo, 14, pageHeight - 7);

      const paginacao = `Página ${currentPage} de ${pageCount}`;
      doc.text(paginacao, pageWidth - 14 - doc.getTextWidth(paginacao), pageHeight - 7);
    },
    margin: { top: 52, bottom: 16, left: 14, right: 14 }
  });

  // Download filename
  const filename = `relatorio-demandas-${reportType}-${now.toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
