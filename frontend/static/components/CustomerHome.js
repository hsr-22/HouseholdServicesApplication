import CustomerServiceTrends from './CustomerServiceTrends.js';

export default{
    template: `
    <div class="d-flex flex-column">
        <h1 class="text-center text-danger">Welcome {{user.full_name}}</h1>
        <h2 class="text-center">Available Services</h2>
        <!-- <div>
            <customer-service-trends :serviceData="serviceData"></customer-service-trends>
        </div> -->
    </div>
    `,
    props: ['user'],
    components: {
        CustomerServiceTrends
    },
    data() {
        return {
            serviceData: {
                labels: [],
                data: []
            }
        };
    },
    async mounted() {
        // this.customer.user_id = localStorage.getItem('user_id')
        const res = await fetch('/api/service-request/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: this.customer.user_id })
        });
        const data = await res.json();
        if (res.ok) {
            // Process the data to fit the chart format
            this.serviceData.labels = data.service_requests.map(req => req.date_of_request);
            this.serviceData.data = data.service_requests.map(req => req.service_id);
        } else {
            console.error(data.message);
        }
    }
}