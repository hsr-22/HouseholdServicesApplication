export default {
    template: `
    <div>
        <canvas id="serviceTrendsChart"></canvas>
    </div>
    `,
    props: ['serviceData'],
    watch: {
        serviceData: {
            handler() {
                this.renderChart();
            },
            deep: true
        }
    },
    mounted() {
        this.renderChart();
    },
    methods: {
        renderChart() {
            if (this.chart) {
                this.chart.destroy();
            }
            var ctx = document.getElementById('serviceTrendsChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie', // or 'bar', 'pie', etc.
                data: {
                    labels: this.serviceData.labels,
                    datasets: [{
                        label: 'Service Requests',
                        data: this.serviceData.data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }
}