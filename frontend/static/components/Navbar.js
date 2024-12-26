export default {
    template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand text-primary" href="#">
                <img src="/static/images/house-icon.png" alt="Logo" width="30" height="25" class="d-inline-block align-text-top">
                TaskMasters
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link active" v-if="is_login" aria-current="page" to="/">Home</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='admin'">
                        <router-link class="nav-link" to="/users">Users</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='customer'">
                        <router-link class="nav-link" to="/customer-profile">Profile</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='professional'">
                        <router-link class="nav-link" to="/professional-profile">Profile</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='admin'">
                        <router-link class="nav-link" to="/all-service-request">Service Requests</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='customer'">
                        <router-link class="nav-link" to="/service-history">Service History</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-if="active=='false'">
                        <button class="btn btn-outline-primary" @click="logout">Back To Login</button>
                    </li>
                    <li class="nav-item" v-if="is_login && active=='true'">
                        <button class="btn btn-outline-danger" @click="logout">Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `,
    data() {
        return {
            role: localStorage.getItem('role'),
            is_login: localStorage.getItem('auth-token'),
            active: localStorage.getItem('active')
        }
    },
    methods: {
        logout() {
            localStorage.clear()
            this.$router.push('/login')
        }
    }
}
