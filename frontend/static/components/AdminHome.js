export default {
    template: `
    <div class="d-flex flex-column align-items-center">
        <h1 class="text-danger text-center">Welcome Admin</h1>
        <h2 class="text-center">Current Services</h2>
        <div class="d-flex justify-content-center p-1">
            <button type="button" class="btn btn-outline-success"><router-link class="nav-link p-1" to="/create-service">Add a Service</router-link></button>
        </div>
    </div>
    `,
    data() {
        return {
            isWaiting: false
        }
    },
    methods: {
        async download_csv() {
            this.isWaiting = true
            const res = await fetch('/download-csv')
            const data = await res.json()
            if (res.ok) {
                const taskId = data['task-id']
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${taskId}`)
                    if(csv_res.ok){
                        this.isWaiting = false
                        clearInterval(intv)
                        window.location.href = `/get-csv/${taskId}`
                    }
                }, 1000)
            }
        }
    }
}
