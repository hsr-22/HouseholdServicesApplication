export default {
    template: `
    <div>
        <!-- 
        <div class="p-2">
            <input type="text" class="form-control mb-3" v-model="searchQuery" placeholder="Search services...">
        </div>
        -->
        <div>
            <div class="p-2" v-if="role == 'customer'">
                <div class="card text-center bg-light mx-auto" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title text-primary">{{service.name}}</h5>
                        <p class="card-text">{{service.description}}</p>
                        <p class="card-text"><strong>Time Required:</strong> {{service.time_required}}</p>
                        <p class="card-text"><strong>Price:</strong> Rs. {{service.price}}</p>
                        <button class="btn btn-outline-primary" @click="request(service.id)">Request</button>
                    </div>
                </div>
            </div>
            <div class="p-2" v-if="role == 'admin'">
                <div class="card text-center bg-light mx-auto" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title text-primary">{{service.name}}</h5>
                        <p class="card-text">{{service.description}}</p>
                        <p class="card-text"><strong>Time Required:</strong> {{service.time_required}}</p>
                        <p class="card-text"><strong>Price:</strong> Rs. {{service.price}}</p>
                        <button class="btn btn-outline-warning" @click="update(service.id)">Edit</button>
                        <button class="btn btn-outline-danger" @click="del(service.id)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    props: ['service'],
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            role: localStorage.getItem('role'),
            searchQuery: '',
            service_request: {
                "service_id": null,
                "customer_id": null,
            }
        }
    },
    computed: {
        filteredServices() {
            return this.services.filter(service => {
                return service.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                       service.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        }
    },
    methods: {
        async fetchServices() {
            const res = await fetch('/api/services', {
                headers: {
                    'Authentication-Token': this.token
                }
            });
            const data = await res.json();
            if (res.ok) {
                this.services = data;
            }
        },
        async request(id) {
            this.service_request.service_id = id
            this.service_request.customer_id = localStorage.getItem('user_id')
            const res = await fetch('/api/request/service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                body: JSON.stringify(this.service_request)
            })
            const data = await res.json()
            if(res.ok){
                alert('Service Requested')
            }
        },
        async del(id) {
            const res = await fetch(`delete/service/${id}`, {
                headers: {
                    'Authentication-Token': this.token
                }
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                location.reload()
                this.fetchServices()
            }
        },
        async update(id) {
            localStorage.setItem('update_service_id', id)
            this.$router.push({path: `/update-service`})
        }
    },
    async mounted() {
        await this.fetchServices()
        if(localStorage.getItem('update_service_id')){
            const res = await fetch(`/api/update/service/${localStorage.getItem('update_service_id')}`, {
                headers: {
                    'Authentication-Token': this.token
                }
            })
            const data = await res.json()
            if(res.ok){
                localStorage.setItem('service_name', data.name)
                localStorage.setItem('service_price', data.price)
                localStorage.setItem('service_time', data.time_required)
                localStorage.setItem('service_description', data.description)
                localStorage.setItem('reload', 0)
            }
        }
    }
}