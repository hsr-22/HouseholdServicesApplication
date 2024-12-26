export default {
    template: `
    <div>
        <div class="d-flex justify-content-center">
            <div class="mb-3 p-5 bg-light" style="width: 55rem;">    
                <h2 class="text-center text-primary p-1">New Service</h2>
                <form>
                    <div class="row mb-3">
                        <label for="service-name" class="col-sm-2 col-form-label">Name:</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="service-name" v-model="service.name">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="service-price" class="col-sm-2 col-form-label">Price (in Rs.):</label>
                        <div class="col-sm-10">
                            <input type="number" class="form-control" id="service-price" v-model="service.price">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="service-time" class="col-sm-2 col-form-label">Time Required:</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="service-time" v-model="service.time_required">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="service-description" class="col-sm-2 col-form-label">Description:</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="service-description" v-model="service.description">
                        </div>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-outline-primary mt-2" @click="createService">Add Service</button>
                        <button class="btn btn-outline-danger mt-2" @click="reset">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            service: {
                name: null,
                price: null,
                time_required: null,
                description: null
            },
            token: localStorage.getItem('auth-token')
        }
    },
    methods: {
        async createService(){
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.service)
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                this.$router.push({path: '/'})
            }
        },
        async reset() {
            this.$router.push({path: '/'})
        }
    }
}