import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface TimelineChartData {
  date: string;
  value: number;
  category?: string;
  color?: string;
}

export interface MultiSeriesTimelineData {
  date: string;
  series: { name: string; value: number; color?: string }[];
}

@Component({
  selector: 'app-simple-chart',
  template: `
    <div class="chart-wrapper">
      <div class="chart-controls" *ngIf="showTimelineControls">
        <div class="timeline-controls">
          <button 
            *ngFor="let period of timelinePeriods" 
            [class.active]="selectedPeriod === period.value"
            (click)="selectTimelinePeriod(period.value)"
            class="timeline-btn">
            {{ period.label }}
          </button>
        </div>
      </div>
      <canvas #chartCanvas [width]="width" [height]="height"></canvas>
    </div>
  `,
  styles: [`
    .chart-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .chart-controls {
      margin-bottom: 15px;
      width: 100%;
    }
    
    .timeline-controls {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .timeline-btn {
      padding: 8px 16px;
      border: 2px solid #667eea;
      background: white;
      color: #667eea;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .timeline-btn:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
    
    .timeline-btn.active {
      background: #667eea;
      color: white;
    }
    
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
  `]
})
export class SimpleChartComponent implements OnInit {
  @Input() data: ChartData[] = [];
  @Input() timelineData: TimelineChartData[] = [];
  @Input() multiSeriesData: MultiSeriesTimelineData[] = [];
  @Input() type: 'bar' | 'pie' | 'line' | 'timeline' | 'multi-timeline' | 'combination' = 'bar';
  @Input() width: number = 400;
  @Input() height: number = 300;
  @Input() colors: string[] = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', 
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
  ];
  @Input() showTimelineControls: boolean = false;

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  selectedPeriod: number = 30;

  timelinePeriods = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 }
  ];

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    if (this.ctx) {
      this.drawChart();
    }
  }

  selectTimelinePeriod(days: number) {
    this.selectedPeriod = days;
    this.drawChart();
  }

  private initChart() {
    const canvas = this.chartCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.drawChart();
  }

  private drawChart() {
    if (!this.data || this.data.length === 0) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.type === 'bar') {
      this.drawBarChart();
    } else if (this.type === 'pie') {
      this.drawPieChart();
    } else if (this.type === 'line') {
      this.drawLineChart();
    } else if (this.type === 'timeline') {
      this.drawTimelineChart();
    } else if (this.type === 'multi-timeline') {
      this.drawMultiTimelineChart();
    } else if (this.type === 'combination') {
      this.drawCombinationChart();
    }
  }

  private drawBarChart() {
    const padding = 40;
    const chartWidth = this.width - 2 * padding;
    const chartHeight = this.height - 2 * padding;
    const barWidth = chartWidth / this.data.length;
    const maxValue = Math.max(...this.data.map(d => d.value));

    // Draw bars
    this.data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * barWidth + barWidth * 0.1;
      const y = this.height - padding - barHeight;
      const width = barWidth * 0.8;

      // Bar
      this.ctx.fillStyle = item.color || this.colors[index % this.colors.length];
      this.ctx.fillRect(x, y, width, barHeight);

      // Label
      this.ctx.fillStyle = '#333';
      this.ctx.font = 'bold 11px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(item.label, x + width / 2, this.height - padding + 20);

      // Value with better formatting
      this.ctx.fillStyle = '#667eea';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.fillText(item.value.toString(), x + width / 2, y - 10);
    });

    // Draw axes
    this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, this.height - padding);
    this.ctx.lineTo(this.width - padding, this.height - padding);
    this.ctx.stroke();

    // Draw Y-axis labels
    this.ctx.fillStyle = '#666';
    this.ctx.font = '10px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + (i / ySteps) * chartHeight;
      const value = Math.round((1 - i / ySteps) * maxValue);
      this.ctx.fillText(value.toString(), padding - 5, y);
    }
  }

  private drawPieChart() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    const total = this.data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2; // Start from top

    this.data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const color = item.color || this.colors[index % this.colors.length];

      // Draw slice
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.fill();

      // Draw label with stock quantity
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelRadius = radius + 25;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;

      // Draw label background for better readability
      const labelText = `${item.label}: ${item.value}`;
      this.ctx.font = 'bold 11px Arial';
      const labelWidth = this.ctx.measureText(labelText).width;
      
      // Draw background rectangle
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fillRect(labelX - labelWidth/2 - 4, labelY - 8, labelWidth + 8, 16);
      
      // Draw text
      this.ctx.fillStyle = '#333';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(labelText, labelX, labelY);

      currentAngle += sliceAngle;
    });
  }

  private drawLineChart() {
    const padding = 60;
    const chartWidth = this.width - 2 * padding;
    const chartHeight = this.height - 2 * padding;
    const maxValue = Math.max(...this.data.map(d => d.value));
    const minValue = Math.min(...this.data.map(d => d.value));
    const valueRange = maxValue - minValue;

    // Calculate points
    const points: { x: number; y: number }[] = [];
    this.data.forEach((item, index) => {
      const x = padding + (index / (this.data.length - 1)) * chartWidth;
      const normalizedValue = valueRange > 0 ? (item.value - minValue) / valueRange : 0.5;
      const y = this.height - padding - normalizedValue * chartHeight;
      points.push({ x, y });
    });

    // Draw background grid
    this.drawCleanGridLines(padding, chartWidth, chartHeight, maxValue, minValue);
    
    // Draw axes
    this.drawAxes(padding, chartWidth, chartHeight);
    
    // Draw line with delay
    setTimeout(() => {
      this.drawCleanLine(points, padding, chartHeight);
      this.drawDataPoints(points);
    }, 1300);
    
    // Draw labels
    this.drawCleanLabels(points, padding, chartHeight);
  }

  private drawCleanGridLines(padding: number, chartWidth: number, chartHeight: number, maxValue: number, minValue: number) {
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (i / gridLines) * chartHeight;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(this.width - padding, y);
      this.ctx.stroke();
    }
  }

  private drawAxes(padding: number, chartWidth: number, chartHeight: number) {
    // X and Y axes
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    
    // Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, this.height - padding);
    this.ctx.stroke();
    
    // X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, this.height - padding);
    this.ctx.lineTo(this.width - padding, this.height - padding);
    this.ctx.stroke();
  }

  private drawCleanLine(points: { x: number; y: number }[], padding: number, chartHeight: number) {
    if (points.length < 2) return;

    // Draw the line
    this.ctx.strokeStyle = '#667eea';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    // Use straight lines for cleaner look
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.stroke();
  }

  private drawDataPoints(points: { x: number; y: number }[]) {
    points.forEach((point, index) => {
      // Draw data point
      this.ctx.fillStyle = '#ff9800';
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      this.ctx.fill();
      
      // Draw value above point
      this.ctx.fillStyle = '#ff9800';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.data[index].value.toString(), point.x, point.y - 15);
    });
  }

  private drawCleanLabels(points: { x: number; y: number }[], padding: number, chartHeight: number) {
    // X-axis labels (category names)
    this.ctx.fillStyle = '#1976d2';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'center';
    
    points.forEach((point, index) => {
      this.ctx.fillText(this.data[index].label, point.x, this.height - padding + 25);
    });

    // Y-axis labels (values)
    this.ctx.fillStyle = '#ff9800';
    this.ctx.font = 'bold 11px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    
    const maxValue = Math.max(...this.data.map(d => d.value));
    const minValue = Math.min(...this.data.map(d => d.value));
    const valueRange = maxValue - minValue;

    const ySteps = 6;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + (i / ySteps) * chartHeight;
      const value = Math.round(maxValue - (i / ySteps) * valueRange);
      this.ctx.fillText(value.toString(), padding - 10, y);
    }

    // Chart title
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Stock by Category', this.width / 2, padding - 20);
  }

  private drawTimelineChart() {
    if (!this.timelineData || this.timelineData.length === 0) return;

    const padding = 60;
    const chartWidth = this.width - 2 * padding;
    const chartHeight = this.height - 2 * padding;
    
    // Filter data based on selected period
    const filteredData = this.timelineData.slice(-this.selectedPeriod);
    const maxValue = Math.max(...filteredData.map(d => d.value));
    const minValue = Math.min(...filteredData.map(d => d.value));
    const valueRange = maxValue - minValue || 1;

    // Draw background grid
    this.drawTimelineGrid(padding, chartWidth, chartHeight);
    
    // Draw axes
    this.drawTimelineAxes(padding, chartWidth, chartHeight);
    
    // Draw timeline line
    this.drawTimelineLine(filteredData, padding, chartWidth, chartHeight, maxValue, minValue, valueRange);
    
    // Draw data points
    this.drawTimelineDataPoints(filteredData, padding, chartWidth, chartHeight, maxValue, minValue, valueRange);
    
    // Draw labels
    this.drawTimelineLabels(filteredData, padding, chartWidth, chartHeight);
  }

  private drawMultiTimelineChart() {
    if (!this.multiSeriesData || this.multiSeriesData.length === 0) return;

    const padding = 40;
    const chartWidth = this.width - 2 * padding;
    const chartHeight = this.height - 2 * padding;

    // Calculate max value across all series
    const maxValue = this.multiSeriesData.reduce((acc, d) => 
      acc.concat(d.series.map(s => s.value)), []).reduce((max, val) => Math.max(max, val), 0);

    // Draw grid
    this.drawTimelineGrid(padding, chartWidth, chartHeight);

    // Draw axes
    this.drawTimelineAxes(padding, chartWidth, chartHeight);

    // Draw series
    this.drawMultiTimelineSeries(this.multiSeriesData, 'Series', '#667eea', padding, chartWidth, chartHeight, maxValue, 0, maxValue);

    // Draw labels
    this.drawMultiTimelineLabels(this.multiSeriesData, padding, chartWidth, chartHeight);

    // Draw legend
    this.drawTimelineLegend(['Series'], padding);
  }

  private drawCombinationChart() {
    if (!this.data || this.data.length === 0) return;

    const padding = 40;
    const chartWidth = this.width - 2 * padding;
    const chartHeight = this.height - 2 * padding;

    // Calculate max values for both datasets
    const maxBarValue = Math.max(...this.data.map(d => d.value));
    const maxLineValue = this.timelineData && this.timelineData.length > 0 
      ? Math.max(...this.timelineData.map(d => d.value)) 
      : maxBarValue;

    // Draw grid
    this.drawCombinationGrid(chartWidth, chartHeight, padding, maxBarValue, maxLineValue);

    // Draw bars (current stock by category)
    this.drawCombinationBars(chartWidth, chartHeight, padding, maxBarValue);

    // Draw line (stock additions over time) only if timeline data exists
    if (this.timelineData && this.timelineData.length > 0) {
      this.drawCombinationLine(chartWidth, chartHeight, padding, maxLineValue);
    }

    // Draw axes
    this.drawCombinationAxes(chartWidth, chartHeight, padding, maxBarValue, maxLineValue);

    // Draw labels
    this.drawCombinationLabels(chartWidth, chartHeight, padding);
  }

  private drawTimelineGrid(padding: number, chartWidth: number, chartHeight: number) {
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (i / gridLines) * chartHeight;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(this.width - padding, y);
      this.ctx.stroke();
    }
    
    // Vertical grid lines (date separators)
    let dataLength = 0;
    if (this.type === 'timeline' && this.timelineData) {
      dataLength = this.timelineData.length;
    } else if (this.type === 'multi-timeline' && this.multiSeriesData) {
      dataLength = this.multiSeriesData.length;
    }
    
    const verticalSteps = Math.min(dataLength - 1, 7);
    for (let i = 0; i <= verticalSteps; i++) {
      const x = padding + (i / verticalSteps) * chartWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(x, padding);
      this.ctx.lineTo(x, this.height - padding);
      this.ctx.stroke();
    }
  }

  private drawTimelineAxes(padding: number, chartWidth: number, chartHeight: number) {
    // X and Y axes
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    
    // Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, this.height - padding);
    this.ctx.stroke();
    
    // X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, this.height - padding);
    this.ctx.lineTo(this.width - padding, this.height - padding);
    this.ctx.stroke();
  }

  private drawTimelineLine(data: TimelineChartData[], padding: number, chartWidth: number, chartHeight: number, maxValue: number, minValue: number, valueRange: number) {
    if (data.length < 2) return;

    // Draw the line
    this.ctx.strokeStyle = '#667eea';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const normalizedValue = (item.value - minValue) / valueRange;
      const y = this.height - padding - normalizedValue * chartHeight;
      
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });

    this.ctx.stroke();
  }

  private drawTimelineDataPoints(data: TimelineChartData[], padding: number, chartWidth: number, chartHeight: number, maxValue: number, minValue: number, valueRange: number) {
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const normalizedValue = (item.value - minValue) / valueRange;
      const y = this.height - padding - normalizedValue * chartHeight;
      
      // Draw data point
      this.ctx.fillStyle = '#ff9800';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
      this.ctx.fill();
      
      // Draw value above point
      this.ctx.fillStyle = '#ff9800';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(item.value.toString(), x, y - 15);
    });
  }

  private drawTimelineLabels(data: TimelineChartData[], padding: number, chartWidth: number, chartHeight: number) {
    // X-axis labels (dates)
    this.ctx.fillStyle = '#1976d2';
    this.ctx.font = 'bold 11px Arial';
    this.ctx.textAlign = 'center';
    
    const labelSteps = Math.min(data.length - 1, 7);
    for (let i = 0; i <= labelSteps; i++) {
      const index = Math.floor((i / labelSteps) * (data.length - 1));
      const x = padding + (i / labelSteps) * chartWidth;
      const date = new Date(data[index].date);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      this.ctx.fillText(label, x, this.height - padding + 25);
    }

    // Y-axis labels (values)
    this.ctx.fillStyle = '#ff9800';
    this.ctx.font = 'bold 11px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue;

    const ySteps = 6;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + (i / ySteps) * chartHeight;
      const value = Math.round(maxValue - (i / ySteps) * valueRange);
      this.ctx.fillText(value.toString(), padding - 10, y);
    }

    // Chart title
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Timeline Analytics', this.width / 2, padding - 20);
  }

  private drawMultiTimelineSeries(data: MultiSeriesTimelineData[], seriesName: string, color: string, padding: number, chartWidth: number, chartHeight: number, maxValue: number, minValue: number, valueRange: number) {
    if (data.length < 2) return;

    // Draw the line for this series
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    
    data.forEach((item, index) => {
      const series = item.series.find(s => s.name === seriesName);
      if (series) {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const normalizedValue = (series.value - minValue) / valueRange;
        const y = this.height - padding - normalizedValue * chartHeight;
        
        if (index === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
    });

    this.ctx.stroke();
  }

  private drawTimelineLegend(seriesNames: string[], padding: number) {
    const legendY = padding - 40;
    const legendSpacing = 120;
    
    seriesNames.forEach((name, index) => {
      const x = padding + index * legendSpacing;
      const color = this.colors[index % this.colors.length];
      
      // Draw legend line
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(x, legendY);
      this.ctx.lineTo(x + 20, legendY);
      this.ctx.stroke();
      
      // Draw legend text
      this.ctx.fillStyle = '#333';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(name, x + 25, legendY + 4);
    });
  }

  private drawMultiTimelineLabels(data: MultiSeriesTimelineData[], padding: number, chartWidth: number, chartHeight: number) {
    // X-axis labels (dates)
    this.ctx.fillStyle = '#1976d2';
    this.ctx.font = 'bold 11px Arial';
    this.ctx.textAlign = 'center';
    
    const labelSteps = Math.min(data.length - 1, 7);
    for (let i = 0; i <= labelSteps; i++) {
      const index = Math.floor((i / labelSteps) * (data.length - 1));
      const x = padding + (i / labelSteps) * chartWidth;
      const date = new Date(data[index].date);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      this.ctx.fillText(label, x, this.height - padding + 25);
    }

    // Y-axis labels (values)
    this.ctx.fillStyle = '#ff9800';
    this.ctx.font = 'bold 11px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    
    const maxValue = Math.max(...data.reduce((acc, d) => acc.concat(d.series.map(s => s.value)), []));
    const minValue = Math.min(...data.reduce((acc, d) => acc.concat(d.series.map(s => s.value)), []));
    const valueRange = maxValue - minValue;

    const ySteps = 6;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + (i / ySteps) * chartHeight;
      const value = Math.round(maxValue - (i / ySteps) * valueRange);
      this.ctx.fillText(value.toString(), padding - 10, y);
    }

    // Chart title
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Multi-Series Timeline', this.width / 2, padding - 20);
  }

  private drawCombinationGrid(chartWidth: number, chartHeight: number, padding: number, maxBarValue: number, maxLineValue: number) {
    this.ctx.strokeStyle = '#bdc3c7';
    this.ctx.lineWidth = 1.5;
    
    // Horizontal grid lines
    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (i / gridLines) * chartHeight;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(this.width - padding, y);
      this.ctx.stroke();
    }
    
    // Vertical grid lines (date separators)
    const verticalSteps = 7;
    for (let i = 0; i <= verticalSteps; i++) {
      const x = padding + (i / verticalSteps) * chartWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(x, padding);
      this.ctx.lineTo(x, this.height - padding);
      this.ctx.stroke();
    }
  }

  private drawCombinationBars(chartWidth: number, chartHeight: number, padding: number, maxBarValue: number) {
    const barWidth = chartWidth / this.data.length;
    this.data.forEach((item, index) => {
      const barHeight = (item.value / maxBarValue) * chartHeight;
      const x = padding + index * barWidth + barWidth * 0.1;
      const y = this.height - padding - barHeight;
      const width = barWidth * 0.8;

      this.ctx.fillStyle = item.color || this.colors[index % this.colors.length];
      this.ctx.fillRect(x, y, width, barHeight);

      // Enhanced label visibility with shadow
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 15px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(item.label, x + width / 2 + 1, this.height - padding + 26);
      this.ctx.fillText(item.label, x + width / 2 - 1, this.height - padding + 26);
      this.ctx.fillText(item.label, x + width / 2, this.height - padding + 25);
      this.ctx.fillText(item.label, x + width / 2, this.height - padding + 27);
      
      this.ctx.fillStyle = '#2c3e50';
      this.ctx.font = 'bold 15px Arial';
      this.ctx.fillText(item.label, x + width / 2, this.height - padding + 26);

      // Enhanced value visibility above bars with shadow
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText(item.value.toString(), x + width / 2 + 1, y - 16);
      this.ctx.fillText(item.value.toString(), x + width / 2 - 1, y - 16);
      this.ctx.fillText(item.value.toString(), x + width / 2, y - 15);
      this.ctx.fillText(item.value.toString(), x + width / 2, y - 17);
      
      this.ctx.fillStyle = '#2c3e50';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText(item.value.toString(), x + width / 2, y - 16);
    });
  }

  private drawCombinationLine(chartWidth: number, chartHeight: number, padding: number, maxLineValue: number) {
    if (this.timelineData.length < 2) return;

    const points: { x: number; y: number }[] = [];
    this.timelineData.forEach((item, index) => {
      const x = padding + (index / (this.timelineData.length - 1)) * chartWidth;
      const normalizedValue = (item.value / maxLineValue);
      const y = this.height - padding - normalizedValue * chartHeight;
      points.push({ x, y });
    });

    // Draw line
    this.ctx.strokeStyle = '#ff6b35';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.stroke();

    // Draw data points
    points.forEach(point => {
      this.ctx.fillStyle = '#ff6b35';
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  private drawCombinationAxes(chartWidth: number, chartHeight: number, padding: number, maxBarValue: number, maxLineValue: number) {
    // X and Y axes - Improved visibility
    this.ctx.strokeStyle = '#2c3e50';
    this.ctx.lineWidth = 3;
    
    // Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, this.height - padding);
    this.ctx.stroke();
    
    // X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, this.height - padding);
    this.ctx.lineTo(this.width - padding, this.height - padding);
    this.ctx.stroke();
  }

  private drawCombinationLabels(chartWidth: number, chartHeight: number, padding: number) {
    // X-axis labels (category names) - Enhanced visibility with shadow
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'center';
    
    this.data.forEach((item, index) => {
      const x = padding + index * (chartWidth / this.data.length) + (chartWidth / this.data.length) / 2;
      // Draw shadow
      this.ctx.fillText(item.label, x + 1, this.height - padding + 31);
      this.ctx.fillText(item.label, x - 1, this.height - padding + 31);
      this.ctx.fillText(item.label, x, this.height - padding + 30);
      this.ctx.fillText(item.label, x, this.height - padding + 32);
    });
    
    // Draw main text
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.font = 'bold 16px Arial';
    this.data.forEach((item, index) => {
      const x = padding + index * (chartWidth / this.data.length) + (chartWidth / this.data.length) / 2;
      this.ctx.fillText(item.label, x, this.height - padding + 31);
    });

    // Y-axis labels (values) - Enhanced visibility with shadow
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 15px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    
    const maxValue = Math.max(...this.data.map(d => d.value));
    const minValue = Math.min(...this.data.map(d => d.value));
    const valueRange = maxValue - minValue;

    const ySteps = 6;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + (i / ySteps) * chartHeight;
      const value = Math.round(maxValue - (i / ySteps) * valueRange);
      // Draw shadow
      this.ctx.fillText(value.toString(), padding - 16, y + 1);
      this.ctx.fillText(value.toString(), padding - 16, y - 1);
      this.ctx.fillText(value.toString(), padding - 15, y);
      this.ctx.fillText(value.toString(), padding - 17, y);
    }
    
    // Draw main text
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.font = 'bold 15px Arial';
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + (i / ySteps) * chartHeight;
      const value = Math.round(maxValue - (i / ySteps) * valueRange);
      this.ctx.fillText(value.toString(), padding - 16, y);
    }

    // Chart title - Enhanced visibility with shadow
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    // Draw shadow
    this.ctx.fillText('Stock Analytics: Current vs Additions', this.width / 2 + 2, padding - 26);
    this.ctx.fillText('Stock Analytics: Current vs Additions', this.width / 2 - 2, padding - 26);
    this.ctx.fillText('Stock Analytics: Current vs Additions', this.width / 2, padding - 25);
    this.ctx.fillText('Stock Analytics: Current vs Additions', this.width / 2, padding - 27);
    
    // Draw main text
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.fillText('Stock Analytics: Current vs Additions', this.width / 2, padding - 26);
  }
}
