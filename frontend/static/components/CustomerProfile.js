export default {
    template: `
    <div>
        <h1 class="text-center text-danger">Customer Profile</h1>
        <div class="card text-center mx-auto" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">Customer Info</h5>
                <p class="card-text"><strong>Email:</strong> <input type="email" v-model="user.email" class="form-control" :readonly="!isEditing"></p>
                <p class="card-text"><strong>Full Name:</strong> <input type="text" v-model="user.full_name" class="form-control" :readonly="!isEditing"></p>
                <p class="card-text"><strong>Address:</strong> <input type="text" v-model="user.address" class="form-control" :readonly="!isEditing"></p>
                <p class="card-text"><strong>Pincode:</strong> <input type="text" v-model="user.pincode" class="form-control" :readonly="!isEditing"></p>
                <button class="btn btn-outline-primary mt-3" @click="toggleEditMode">{{ isEditing ? 'Save Profile' : 'Update Profile' }}</button>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            user: {
                email: '',
                full_name: '',
                address: '',
                pincode: ''
            },
            isEditing: false
        };
    },
    async mounted() {
        // Check if user data is available in localStorage
        const email = localStorage.getItem('email');
        const full_name = localStorage.getItem('full_name');
        const address = localStorage.getItem('address');
        const pincode = localStorage.getItem('pincode');

        if (email && full_name && address && pincode) {
            // If data is available in localStorage, use it
            this.user.email = email;
            this.user.full_name = full_name;
            this.user.address = address;
            this.user.pincode = pincode;
        } else {
            // If data is not available in localStorage, fetch it from the backend
            const res = await fetch('/api/user-details', {
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token')
                }
            });
            const data = await res.json();
            if (res.ok) {
                this.user.email = data.email;
                this.user.full_name = data.full_name;
                this.user.address = data.address;
                this.user.pincode = data.pincode;

                // Store the data in localStorage for future use
                localStorage.setItem('email', data.email);
                localStorage.setItem('full_name', data.full_name);
                localStorage.setItem('address', data.address);
                localStorage.setItem('pincode', data.pincode);
            }
        }
    },
    methods: {
        toggleEditMode() {
            if (this.isEditing) {
                this.updateProfile();
            }
            this.isEditing = !this.isEditing;
        },
        async updateProfile() {
            try {
                const res = await fetch('/api/update-user-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify(this.user)
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message || 'Profile updated successfully');
                    // Update localStorage with new data
                    localStorage.setItem('email', this.user.email);
                    localStorage.setItem('full_name', this.user.full_name);
                    localStorage.setItem('address', this.user.address);
                    localStorage.setItem('pincode', this.user.pincode);
                } else {
                    alert(data.message || 'An error occurred');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('An error occurred while updating the profile.');
            }
        }
    }
}