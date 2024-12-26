export default {
	template: `
		<div class="d-flex justify-content-center align-items-center vh-100" style="margin-top: 25vh">
				<div class="card shadow-lg p-3 mb-5 bg-white rounded" style="width: 42rem;">    
						<h2 class="card-title text-center p-1">Service Professional Signup</h2>
						<div class="text-danger text-center">{{error}}</div>
						<div class="text-success text-center">{{success}}</div>
						<form>
								<div class="form-group row mb-3">
										<label for="user-email" class="col-sm-2 col-form-label">Email:</label>
										<div class="col-sm-10">
												<input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
										</div>
								</div>
								<div class="form-group row mb-3">
										<label for="user-password" class="col-sm-2 col-form-label">Password:</label>
										<div class="col-sm-10">
												<input type="password" class="form-control" id="user-password" v-model="cred.password">
										</div>
								</div>
								<div class="row mb-3">
										<label for="user-confirm-password" class="col-sm-2 col-form-label">Confirm Password:</label>
										<div class="col-sm-10">
												<input type="password" class="form-control" id="user-confirm-password" v-model="cred.confirm_password">
										</div>
								</div>
								<div class="row mb-3">
										<label for="user-fullname" class="col-sm-2 col-form-label">Fullname:</label>
										<div class="col-sm-10">
												<input type="text" class="form-control" id="user-fullname" v-model="cred.full_name">
										</div>
								</div>
								<div class="row mb-3">
										<label for="user-service" class="col-sm-2 col-form-label">Service:</label>
										<div class="col-sm-10">
												<input type="text" class="form-control" id="user-service" v-model="cred.service">
										</div>
								</div>
								<div class="row mb-3">
										<label for="user-experience" class="col-sm-2 col-form-label">Experience:</label>
										<div class="col-sm-10">
												<input type="text" class="form-control" id="user-experience" v-model="cred.experience">
										</div>
								</div>
								<div class="row mb-3">
										<label for="user-address" class="col-sm-2 col-form-label">Address:</label>
										<div class="col-sm-10">
												<input type="text" class="form-control" id="user-address" v-model="cred.address">
										</div>
								</div>
								<div class="row mb-3">
										<label for="user-pincode" class="col-sm-2 col-form-label">Pincode:</label>
										<div class="col-sm-10">
												<input type="text" class="form-control" id="user-pincode" v-model="cred.pincode">
										</div>
								</div>
								<div class="text-center">
										<button class="btn btn-outline-primary mt-2" @click.prevent="register">Register</button>
								</div>
						</form>
						<div class='mt-3'>
								<router-link class="nav-link text-center p-1" to="/login">Existing Professional? Login</router-link>
						</div>
				</div>
		</div>
		`,
	data() {
		return {
			cred: {
				email: null,
				password: null,
				confirm_password: null,
				full_name: null,
				service: null,
				experience: null,
				address: null,
				pincode: null,
			},
			error: null,
			success: null,
		};
	},
	async mounted() {
		await this.fetchServices();
	},
	methods: {
		async fetchServices() {
			try {
				const res = await fetch("/api/services", {
					headers: {
						"Authentication-Token": localStorage.getItem("auth-token"),
					},
				});
				if (res.ok) {
					const data = await res.json();
					this.services = data;
				} else {
					console.error("Failed to fetch services");
				}
			} catch (error) {
				console.error("Error fetching services:", error);
			}
		},
		async register() {
			if (this.cred.password !== this.cred.confirm_password) {
				this.error = "Passwords do not match";
				return;
			}
			const res = await fetch("/api/professionals", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(this.cred),
			});
			if (res.ok) {
				this.success = "Professional Request Sent for Approval";
				this.error = null;
			} else {
				const data = await res.json();
				this.error = data.message;
				this.success = null;
			}
		},
	},
};
