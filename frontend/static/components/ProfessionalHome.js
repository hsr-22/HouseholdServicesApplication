export default {
	template: `
    <div>
        <h1 class="text-center text-danger">Welcome {{professional.full_name}}</h1>
        <h2 class="text-center">Available Service Requests</h2>
        <div class="card text-center mx-auto" style="width: 77rem;">
            <div class="card-header">
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                        <div class="col">ID</div>
                        <div class="col">Service Name</div>
                        <div class="col">Date Of Request</div>
                        <div class="col">Status</div>
                        <div class="col">Action</div>
                    </div>
                </div>
            </div
        </div>
        <div class="card text-center mx-auto" style="width: 77rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(service_request,index) in allServiceRequests" v-if="service_request.service_status=='requested'">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                            <div class="col">{{service_request.id}}</div>
                            <div class="col" v-for="(service,index) in allServices" v-if="service.id==service_request.service_id">{{service.name}}</div>
                            <div class="col">{{service_request.date_of_request}}</div>
                            <div class="col">{{service_request.service_status}}</div>
                            <div class="col">
                                <button class="btn btn-outline-success" v-if="service_request.service_status!='closed'" @click="accept(service_request.id)">Accept</button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div>
        <h2 class="text-center p-2">Accepted Service Requests</h2>
        <div class="card text-center mx-auto" style="width: 77rem;">
            <div class="card-header">
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                        <div class="col">ID</div>
                        <div class="col">Service Name</div>
                        <div class="col">Date Of Request</div>
                        <div class="col">Status</div>
                        <div class="col">Action</div>
                    </div>
                </div>
            </div
        </div>
        <div class="card text-center mx-auto" style="width: 77rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(service_request,index) in allServiceRequests" v-if="service_request.service_status=='assigned'">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                            <div class="col">{{service_request.id}}</div>
                            <div class="col" v-for="(service,index) in allServices" v-if="service.id==service_request.service_id">{{service.name}}</div>
                            <div class="col">{{service_request.date_of_request}}</div>
                            <div class="col">{{service_request.service_status}}</div>
                            <div class="col">
                                <button class="btn btn-outline-danger" v-if="service_request.service_status!='closed'" @click="reject(service_request.id)">Reject</button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div>
        <h2 class="text-center p-2">Closed Service Requests</h2>
        <div class="card text-center mx-auto" style="width: 77rem;">
            <div class="card-header">
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                        <div class="col">ID</div>
                        <div class="col">Service Name</div>
                        <div class="col">Date Of Request</div>
                        <div class="col">Rating</div>
                        <div class="col">Remarks</div>
                    </div>
                </div>
            </div
        </div>
        <div class="card text-center mx-auto" style="width: 77rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(service_request,index) in allServiceRequests" v-if="service_request.service_status=='closed'">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5">
                            <div class="col">{{service_request.id}}</div>
                            <div class="col" v-for="(service,index) in allServices" v-if="service.id==service_request.service_id">{{service.name}}</div>
                            <div class="col">{{service_request.date_of_request}}</div>
                            <div class="col">{{service_request.rating}}</div>
                            <div class="col">{{service_request.remarks}}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    `,
	props: ["professional"],
	data() {
		return {
			allServiceRequests: [],
			allServices: [],
			professional: {
				professional_id: localStorage.getItem("id"),
			},
			token: localStorage.getItem("auth-token"),
			error: null,
			customer: {
				user_id: null,
			},
		};
	},
	methods: {
		async accept(id) {
			const res = await fetch(`/api/accept/service-request/${id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authentication-Token": this.token,
				},
				body: JSON.stringify(this.professional),
			});
			const data = await res.json();
			if (res.ok) {
				alert(data.message);
				location.reload();
			}
		},
		async reject(id) {
			const res = await fetch(`/api/accept/service-request/${id}`);
			const data = await res.json();
			if (res.ok) {
				alert(data.message);
				location.reload();
			}
		},
	},
	async mounted() {
		const res = await fetch("/api/request/service", {
			headers: {
				"Authentication-Token": this.token,
			},
		});
		const data = await res.json();
		if (res.ok) {
			this.allServiceRequests = data.service_requests;
			this.allServices = data.services;
		}
	},
};
