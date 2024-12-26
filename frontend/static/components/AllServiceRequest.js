export default {
    template: `
    <div class="text-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col">
                    <h2 class="text-center">Service Requests</h2>
                </div>
            </div>
            <div class="row justify-content-end">
                <div class="col text-end">
                    <button class="btn btn-outline-primary" @click='download_csv'>Export as CSV</button><br>
                    <span v-if='isWaiting'> Exporting... </span>
                </div>
            </div>
        </div>
        <br>
        <div class="card text-center mx-auto" style="width: 77rem;">
            <div class="card-header">
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                        <div class="col">ID</div>
                        <div class="col">Service Name</div>
                        <div class="col">Date Of Request</div>
                        <div class="col">Status</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card text-center mx-auto" style="width: 77rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(service_request, index) in allServiceRequests" :key="index">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                            <div class="col">{{ service_request.id }}</div>
                            <div class="col" v-for="(service, index) in allServices" v-if="service.id == service_request.service_id" :key="index">{{ service.name }}</div>
                            <div class="col">{{ service_request.date_of_request }}</div>
                            <div class="col" :class="getStatusClass(service_request.service_status)">{{ service_request.service_status }}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    `,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            allServiceRequests: [],
            allServices: [],
            error: null,
            customer: {
                user_id: null
            },
            isWaiting: false
        };
    },
    methods: {
        async download_csv() {
            this.isWaiting = true;
            const res = await fetch('/download-csv');
            const data = await res.json();
            if (res.ok) {
                const taskId = data['task-id'];
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${taskId}`);
                    if (csv_res.ok) {
                        alert("Service Request Details Downloaded in CSV Format");
                        this.isWaiting = false;
                        clearInterval(intv);
                        window.location.href = `/get-csv/${taskId}`;
                    }
                }, 1000);
            }
        },
        getStatusClass(status) {
            switch (status) {
                case 'assigned':
                    return 'text-warning';
                case 'closed':
                    return 'text-success';
                case 'requested':
                    return 'text-danger';
                default:
                    return 'text-secondary';
            }
        }
    },
    async mounted() {
        this.customer.user_id = localStorage.getItem('user_id');
        const res = await fetch('/api/request/service', {
            headers: {
                'Authentication-Token': this.token
            }
        });
        const data = await res.json();
        if (res.ok) {
            this.allServiceRequests = data.service_requests;
            this.allServices = data.services;
        }
    }
};
