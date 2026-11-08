'use strict';
(() => {
    const { formatDay, kinds, pageRange } = window.StudyCalendarData;

    function create(JsPDF, plan, start, end) {
        const pdf = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        const left = 15;
        const contentWidth = width - left * 2;
        const startLabel = start.split('-').reverse().join('/');
        const endLabel = window.StudyCalendarData.move(end, -1).split('-').reverse().join('/');
        let y = 0;

        pdf.setProperties({ title: 'Programa de estudio de muestra - AlcocerMed', subject: 'Plan de práctica de muestra' });

        function header() {
            pdf.setFillColor('#1e1e2d');
            pdf.rect(0, 0, width, 35, 'F');
            pdf.setFillColor('#f6a43a');
            pdf.rect(0, 34, width, 1, 'F');
            pdf.setTextColor('#ffffff');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(19);
            pdf.text('Programa de estudio', left, 15);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text('AlcocerMed  |  Plan de práctica de muestra  |  Horario de Bolivia', left, 23);
            pdf.text(startLabel + ' - ' + endLabel, left, 29);
            y = 43;
        }

        header();
        let days = 0;
        for (const [date, items] of plan) {
            if (date < start || date >= end || !items.length) continue;
            days += 1;
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            const rows = items.map(item => {
                const reading = item.reading;
                const title = reading ? item.title + ' | ' + reading.section +
                    ' | pp. ' + pageRange(reading.printed) + ' (PDF ' + pageRange(reading.pdf) + ')' : item.title;
                const text = pdf.splitTextToSize(title, contentWidth - 43);
                return { item, text, height: Math.max(7.5, 3.7 * text.length + 3.4) };
            });
            const space = rows.reduce((sum, row) => sum + row.height, 13);
            if (y + space > height - 17) {
                pdf.addPage();
                header();
            }
            pdf.setFillColor('#eef3fa');
            pdf.roundedRect(left, y, contentWidth, 8, 1.5, 1.5, 'F');
            pdf.setTextColor('#1e293b');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.text(formatDay(date), left + 4, y + 5.35);
            y += 9;
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            for (const { item, text, height: rowHeight } of rows) {
                pdf.setFillColor(kinds[item.kind].color);
                pdf.circle(left + 36, y + 3.3, 1.05, 'F');
                pdf.setTextColor('#475569');
                pdf.text(item.end ? item.start + ' - ' + item.end : item.start, left + 4, y + 4.4);
                pdf.setTextColor('#17253b');
                pdf.text(text, left + 40, y + 4.4);
                pdf.setDrawColor('#e5ebf2');
                pdf.line(left + 3, y + rowHeight, width - left - 3, y + rowHeight);
                y += rowHeight;
            }
            y += 4;
        }

        if (!days) {
            pdf.setTextColor('#475569');
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);
            pdf.text('Este periodo no tiene actividades de muestra.', left, y + 6);
        }
        const pages = pdf.getNumberOfPages();
        for (let page = 1; page <= pages; page += 1) {
            pdf.setPage(page);
            pdf.setDrawColor('#dce5f0');
            pdf.line(left, height - 13, width - left, height - 13);
            pdf.setTextColor('#526378');
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.text('AlcocerMed  |  Ejemplo para organizar tu práctica', left, height - 8);
            pdf.text(page + ' / ' + pages, width - left, height - 8, { align: 'right' });
        }
        return pdf;
    }

    window.StudyCalendarPdf = { create };
})();
