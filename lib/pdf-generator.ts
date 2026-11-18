import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
type AnalyticsStats = {
  totalEvents: number;
  totalTickets: number;
  totalRevenue: number;
  averageRating: number;
  eventCompletionRate: number;
  averageAttendanceRate: number;
  attendeeRetentionRate: number;
  revenueData: Array<{ date: string; revenue: number }>;
  revenueByTicketType: Array<{ type: string; revenue: number }>;
  ticketTypeDistribution: Array<{ type: string; count: number }>;
  firstTimeVsReturning: Array<{ type: string; count: number }>;
};

const drawChart = (canvas: HTMLCanvasElement, data: Array<Record<string, unknown>>, config: {
  xKey: string;
  yKey: string;
  width: number;
  height: number;
  title: string;
  type: 'line' | 'bar';
}) => {
  const ctx = canvas.getContext('2d');
  if (!ctx || !data || data.length === 0) return;

  const padding = 40;
  const chartWidth = config.width - (padding * 2);
  const chartHeight = config.height - (padding * 2);

  // Clear canvas
  ctx.clearRect(0, 0, config.width, config.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, config.width, config.height);

  // Draw title
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(config.title, config.width / 2, padding / 2);

  // Find min/max values
  const values = data.map(d => Number(d[config.yKey]) || 0);
  const maxValue = Math.max(...values, 1); // Ensure we have a non-zero max
  const minValue = Math.min(...values);
  const range = maxValue - minValue;

  // If no range (all values are the same), create artificial range
  const effectiveRange = range === 0 ? maxValue : range;
  const effectiveMin = range === 0 ? 0 : minValue;

  // Draw axes
  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, config.height - padding);
  ctx.lineTo(config.width - padding, config.height - padding);
  ctx.stroke();

  // Draw data points
  const pointWidth = chartWidth / (data.length + 1);

  if (config.type === 'line') {
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;

    data.forEach((point, i) => {
      const x = padding + (pointWidth * (i + 1));
      const value = Number(point[config.yKey]) || 0;
      const normalizedY = (value - effectiveMin) / effectiveRange;
      const y = config.height - padding - (normalizedY * chartHeight);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    data.forEach((point, i) => {
      const x = padding + (pointWidth * (i + 1));
      const value = Number(point[config.yKey]) || 0;
      const normalizedY = (value - effectiveMin) / effectiveRange;
      const y = config.height - padding - (normalizedY * chartHeight);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  } else {
    // Bar chart
    data.forEach((point, i) => {
      const x = padding + (pointWidth * (i + 1));
      const value = Number(point[config.yKey]) || 0;
      const normalizedY = (value - effectiveMin) / effectiveRange;
      const barHeight = normalizedY * chartHeight;

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(
        x - (pointWidth * 0.3),
        config.height - padding - barHeight,
        x - (pointWidth * 0.3),
        config.height - padding
      );
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#a855f7');

      ctx.fillStyle = gradient;
      ctx.fillRect(
        x - (pointWidth * 0.3),
        config.height - padding - barHeight,
        pointWidth * 0.6,
        barHeight
      );

      // Draw value on top of bar
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        value.toString(),
        x,
        config.height - padding - barHeight - 5
      );
    });
  }

  // Draw labels
  ctx.fillStyle = '#64748b';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';

  // X-axis labels
  data.forEach((point, i) => {
    const x = padding + (pointWidth * (i + 1));
    const label = String(point[config.xKey] || '');
    // Rotate and truncate long labels
    ctx.save();
    ctx.translate(x, config.height - (padding / 2));
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(
      label.length > 15 ? label.slice(0, 12) + '...' : label,
      0,
      0
    );
    ctx.restore();
  });

  // Y-axis labels with proper formatting
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const value = effectiveMin + (effectiveRange * (i / steps));
    const y = config.height - padding - (chartHeight * (i / steps));
    ctx.textAlign = 'right';

    // Format numbers appropriately
    let formattedValue;
    if (value >= 1000000) {
      formattedValue = (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      formattedValue = (value / 1000).toFixed(1) + 'K';
    } else {
      formattedValue = value.toFixed(value < 10 ? 1 : 0);
    }

    ctx.fillText(formattedValue, padding - 5, y + 4);
  }

  // Draw grid lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.setLineDash([5, 5]);
  for (let i = 1; i <= steps; i++) {
    const y = config.height - padding - (chartHeight * (i / steps));
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(config.width - padding, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
};

export const generateAnalyticsReport = async (stats: AnalyticsStats) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(20);
  doc.text('Event Analytics Report', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 25, { align: 'center' });

  // Create canvas for charts
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 300;

  // Utility functions for formatting
  const formatNumber = (num: unknown) => {
    const n = Number(num);
    return isNaN(n) ? 0 : n;
  };

  const formatCurrency = (num: unknown) => {
    const n = formatNumber(num);
    return `$${n.toFixed(2)}`;
  };

  const formatPercentage = (num: unknown) => {
    const n = formatNumber(num);
    return `${n.toFixed(1)}%`;
  };

  // Overview Section
  doc.setFontSize(16);
  doc.text('Overview', 14, 40);

  const overviewData = [
    ['Total Events', formatNumber(stats.totalEvents).toString()],
    ['Total Tickets', formatNumber(stats.totalTickets).toString()],
    ['Total Revenue', formatCurrency(stats.totalRevenue)],
    ['Average Rating', `${formatNumber(stats.averageRating).toFixed(1)} ★`],
    ['Event Completion Rate', formatPercentage(stats.eventCompletionRate)],
    ['Average Attendance Rate', formatPercentage(stats.averageAttendanceRate)]
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Metric', 'Value']],
    body: overviewData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] }
  });

  // Revenue Analysis with Chart
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Revenue Analysis', 14, 20);

  // Draw revenue trend chart
  drawChart(canvas, stats.revenueData || [], {
    xKey: 'date',
    yKey: 'revenue',
    width: 500,
    height: 300,
    title: 'Revenue Trend',
    type: 'line'
  });
  doc.addImage(canvas.toDataURL(), 'PNG', 15, 30, 180, 100);

  const revenueByType = (stats.revenueByTicketType || []).map((item: { type: string; revenue: number }) => [
    item.type || 'Unknown',
    formatCurrency(item.revenue)
  ]);

  autoTable(doc, {
    startY: 140,
    head: [['Ticket Type', 'Revenue']],
    body: revenueByType,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] }
  });

  // Attendee Analysis with Chart
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Attendee Analysis', 14, 20);

  // Draw attendee distribution chart
  drawChart(canvas, stats.firstTimeVsReturning || [], {
    xKey: 'type',
    yKey: 'count',
    width: 500,
    height: 300,
    title: 'First Time vs Returning Attendees',
    type: 'bar'
  });
  doc.addImage(canvas.toDataURL(), 'PNG', 15, 30, 180, 100);

  const attendeeData = [
    ['Retention Rate', formatPercentage(stats.attendeeRetentionRate)],
    ...(stats.firstTimeVsReturning || []).map((item: { type: string; count: number }) => [
      item.type || 'Unknown',
      formatNumber(item.count).toString()
    ])
  ];

  autoTable(doc, {
    startY: 140,
    head: [['Category', 'Value']],
    body: attendeeData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] }
  });

  // Distribution Analysis with Chart
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Distribution Analysis', 14, 20);

  // Draw ticket type distribution chart
  drawChart(canvas, stats.ticketTypeDistribution || [], {
    xKey: 'type',
    yKey: 'count',
    width: 500,
    height: 300,
    title: 'Ticket Type Distribution',
    type: 'bar'
  });
  doc.addImage(canvas.toDataURL(), 'PNG', 15, 30, 180, 100);

  const ticketTypeData = (stats.ticketTypeDistribution || []).map((item: { type: string; count: number }) => [
    item.type || 'Unknown',
    formatNumber(item.count).toString()
  ]);

  autoTable(doc, {
    startY: 140,
    head: [['Ticket Type', 'Count']],
    body: ticketTypeData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] }
  });

  return doc;
};
