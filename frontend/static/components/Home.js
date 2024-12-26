import AdminHome from "./AdminHome.js"
import ProfessionalHome from "./ProfessionalHome.js"
import CustomerHome from "./CustomerHome.js"
import Services from "./Services.js"

export default{
    template: `
    <div v-if="active=='false'">
        <h1 class="text-center text-danger">User Not Approved</h1>
    </div>
    <div v-else>
        <AdminHome v-if="userRole=='admin'"/>
        <ProfessionalHome v-if="userRole=='professional'" :professional = "user" v-bind:key="user.full_name"/>
        <CustomerHome v-if="userRole=='customer'" :user = "user" v-bind:key="user.full_name"/>
        <div v-if="userRole=='admin'" class="d-flex justify-content-center flex-row">
            <Services v-for="service in services" :service = "service" v-bind:key="service.id"/>
        </div>
        <div v-if="userRole=='customer'" class="d-flex justify-content-center flex-row">
            <Services v-for="service in services" :service = "service" v-bind:key="service.id"/>
        </div>
    </div>
    `,
    data() {
        return {
            userRole: localStorage.getItem('role'),
            active: localStorage.getItem('active'),
            token: localStorage.getItem('auth-token'),
            services: [],
            user: {}
        }
    },
    components: {
        AdminHome,
        ProfessionalHome,
        CustomerHome,
        Services
    },
    async mounted() {
        const res = await fetch('/api/services', {
            headers: {
                'Authentication-Token': this.token
            }
        })
        const data = await res.json()
        if(res.ok) {
            this.services = data
        }
        else {
            // alert(data.message)
            if(res.status == 401) {
                localStorage.removeItem('auth-token')
                localStorage.removeItem('role')
                localStorage.removeItem('active')
                localStorage.removeItem('user_id')
                localStorage.removeItem('id')
                this.$router.push({path: '/login'})
            }
        }

        const res_user = await fetch('/user-details', {
            headers: {
                'Authentication-Token': this.token
            }
        })
        const data_user = await res_user.json()
        if(res_user.ok) {
            this.user = data_user
            console.log(data_user)
        }
        else {
            // alert(data.message)
            if(res_user.status == 401) {
                localStorage.removeItem('auth-token')
                localStorage.removeItem('role')
                localStorage.removeItem('active')
                localStorage.removeItem('user_id')
                localStorage.removeItem('id')
                this.$router.push({path: '/login'})
            }
        }
    }
}