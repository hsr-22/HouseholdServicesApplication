export default {
    template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow-lg p-3 mb-5 bg-white rounded" style="width: 28rem;">
            <div class="card-body">
                <h2 class="card-title text-center mb-4">Login</h2>
                <div class="text-danger text-center mb-3">{{error}}</div>
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label for="user-email" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email" required>
                    </div>
                    <div class="mb-3">
                        <label for="user-password" class="form-label">Password:</label>
                        <input type="password" class="form-control" id="user-password" v-model="cred.password" required>
                    </div>
                    <div class="d-grid gap-2 text-center">
                        <button class="btn btn-outline-primary" type="submit">Login</button>
                    </div>
                </form>
                <div class="mt-3">
                    <router-link class="btn btn-link w-100 text-center" to="/customer-signup">Register as Customer</router-link>
                    <router-link class="btn btn-link w-100 text-center" to="/service-professional-signup">Register as Professional</router-link>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            cred: {
                email: null,
                password: null
            },
            error: null
        }
    },
    methods: {
        async login() {
            const res = await fetch('/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.cred)
            })
            const data = await res.json()
            if (res.ok) {
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                localStorage.setItem('active', data.active)
                localStorage.setItem('user_id', data.id)
                localStorage.setItem('id', data.email.charAt(data.email.length - 11))
                this.$router.push({ path: '/' })
            }
            else {
                this.error = data.message
            }
        }
    }
}