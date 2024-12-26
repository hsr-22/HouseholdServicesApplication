export default {
    template: `
    <div>
        <h2 class="text-center text-primary">Service Remarks</h2>
        <h3 class="text-center text-info">Request ID: {{service_details.id}}</h3>
        <div class="container text-center">
            <div class="row p-1">
                <div class="col">
                    <div class="card text-bg-info mb-3" style="max-width: 18rem;">
                        <h5 class="card-header">Service Name</h5>
                        <div class="card-body">
                            <h5 class="card-title">{{service_details.name}}</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card text-bg-info mb-3" style="max-width: 18rem;">
                        <h5 class="card-header">Description</h5>
                        <div class="card-body">
                            <h5 class="card-title">{{service_details.description}}</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card text-bg-info mb-3" style="max-width: 18rem;">
                        <h5 class="card-header">Professional</h5>
                        <div class="card-body">
                            <h5 class="card-title">{{service_details.professional}}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center my-3">
                <div class="col-md-4">
                    <label class="form-label">Rating:</label>
                    <div class="d-flex justify-content-center">
                        <label v-for="n in 5" :key="n" class="form-check-label mx-auto custom-radio">
                            <input type="radio" class="form-check-input" :value="n" v-model="service_request.rating" :placeholder="ratingPlaceholder"> {{n}}
                        </label>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center my-3">
                <div class="col-md-4">
                    <label for="remarks" class="form-label">Remarks (if any):</label>
                    <input type="text" class="form-control" id="remarks" style="width:100%" v-model="service_request.remarks" :placeholder="remarksPlaceholder">
                </div>
            </div>
            <div class="row justify-content-center my-3">
                <div class="col-md-2">
                    <button class="btn btn-outline-success w-100" @click="submit">Submit</button>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-outline-danger w-100" @click="close">Close</button>
                </div>
            </div>   
        </div>
    </div>
    `,
    data() {
        return {
            service_details: {
                id: localStorage.getItem('service_request_id'),
                name: localStorage.getItem('name'),
                description: localStorage.getItem('description'),
                professional: localStorage.getItem('professional'),
            },
            service_request: {
                rating: localStorage.getItem('rating'),
                remarks: localStorage.getItem('remarks')
            },
            token: localStorage.getItem('auth-token'),
        }
    },
    computed: {
        remarksPlaceholder() {
            return this.service_request.remarks || '';
        },
        ratingPlaceholder() {
            return this.service_request.rating || 'Select a rating';
        }
    },
    methods: {
        async submit() {
            const res = await fetch(`/api/close/service-request/${localStorage.getItem('service_request_id')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.service_request)
            })
            const data = await res.json()
            if(res.ok){
                alert("Service Remarks Updated")
                this.$router.push({path: '/service-history'})
            }
        },
        async close(){
            this.$router.push({path: '/service-history'})
        }
    },
    async mounted() {
        const res = await fetch(`/service-details/${localStorage.getItem('service_request_id')}`)
        const data = await res.json()
        if(res.ok){
            localStorage.setItem('name', data.name)
            localStorage.setItem('description', data.description)
            localStorage.setItem('professional', data.professional)
            localStorage.setItem('rating', data.rating)
            localStorage.setItem('remarks', data.remarks)
            if(localStorage.getItem('reload')==0){
                localStorage.setItem('reload', 1)
                location.reload()
            }
        }
    }
}