from flask import current_app as app
from flask_restful import Resource, Api, reqparse, marshal, fields
from flask_security import auth_required, roles_required, current_user, hash_password
from .models import Service, Customer, User, Professional, ServiceRequest, db
from werkzeug.security import generate_password_hash
from datetime import datetime

datastore = app.security.datastore
cache = app.cache
api = Api(prefix="/api")

parser1 = reqparse.RequestParser()
parser1.add_argument(
    "name", type=str, help="Name is required and should be a string", required=True
)
parser1.add_argument(
    "price", type=int, help="Price is required and should be an integer", required=True
)
parser1.add_argument(
    "time_required",
    type=str,
    help="Time Required is required and should be a string",
    required=True,
)
parser1.add_argument(
    "description",
    type=str,
    help="Description is required and should be a string",
    required=True,
)

service_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "price": fields.Integer,
    "time_required": fields.String,
    "description": fields.String,
}


class Services(Resource):
    @auth_required("token")
    # @roles_required('admin', 'professional', 'customer')
    @cache.cached(timeout=10)
    def get(self):
        all_services = Service.query.all()
        if "professional" not in current_user.roles:
            return marshal(all_services, service_fields)
        # else:
        #     return {"message": "This funtion us not allowed for current user"}, 404

    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = parser1.parse_args()
        service = Service(**args)
        db.session.add(service)
        db.session.commit()
        return {"message": "Service Created"}


class UpdateService(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self, id):
        service = Service.query.get(id)
        return marshal(service, service_fields)

    def post(self, id):
        service = Service.query.get(id)
        args = parser1.parse_args()
        service.name = args.name
        service.price = args.price
        service.time_required = args.time_required
        service.description = args.description
        db.session.commit()
        return {"message": "Service Updated"}


parser2 = reqparse.RequestParser()
parser2.add_argument(
    "email", type=str, help="Email is required and should be a string", required=True
)
parser2.add_argument(
    "password",
    type=str,
    help="Password is required and should be a string",
    required=True,
)
parser2.add_argument(
    "full_name",
    type=str,
    help="Full Name is required and should be a string",
    required=True,
)
parser2.add_argument(
    "address",
    type=str,
    help="Address is required and should be a string",
    required=True,
)
parser2.add_argument(
    "pincode",
    type=int,
    help="Pincode is required and should be an integer",
    required=True,
)
customer_fields = {
    "id": fields.Integer,
    "full_name": fields.String,
    "address": fields.String,
    "pincode": fields.Integer,
    "user_id": fields.Integer,
}


class Customers(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        customers = Customer.query.all()
        if len(customers) == 0:
            return {"message": "No User Found"}, 404
        return marshal(customers, customer_fields)

    def post(self):
        args = parser2.parse_args()
        datastore.create_user(
            email=args.email, password=hash_password(args.password), roles=["customer"]
        )
        customer = Customer(
            full_name=args.full_name,
            address=args.address,
            pincode=args.pincode,
            user_id=User.query.filter_by(email=args.email).all()[0].id,
        )
        db.session.add(customer)
        db.session.commit()
        return {"message": "Customer Added"}


parser3 = reqparse.RequestParser()
parser3.add_argument(
    "email", type=str, help="Email is required and should be a string", required=True
)
parser3.add_argument(
    "password",
    type=str,
    help="Password is required and should be a string",
    required=True,
)
parser3.add_argument(
    "full_name",
    type=str,
    help="Full Name is required and should be a string",
    required=True,
)
parser3.add_argument(
    "service",
    type=str,
    help="Service is required and should be a string",
    required=True,
)
parser3.add_argument(
    "experience",
    type=str,
    help="Experience is required and should be a string",
    required=True,
)
parser3.add_argument(
    "address",
    type=str,
    help="Address is required and should be a string",
    required=True,
)
parser3.add_argument(
    "pincode",
    type=int,
    help="Pincode is required and should be an integer",
    required=True,
)

professional_fields = {
    "id": fields.Integer,
    "full_name": fields.String,
    "experience": fields.String,
    "service": fields.String,
    "active": fields.Boolean,
}


class Professionals(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        professionals = Professional.query.all()
        if len(professionals) == 0:
            return {"message": "No User Found"}, 404
        return marshal(professionals, professional_fields)

    def post(self):
        args = parser3.parse_args()

        # Check if the service exists
        service = Service.query.filter_by(name=args.service).first()
        if not service:
            return {"message": "Service does not exist"}, 400

        # Check if the user already exists
        existing_user = User.query.filter_by(email=args.email).first()
        if existing_user:
            return {"message": "User already exists"}, 400

        # Create the user and professional
        datastore.create_user(
            email=args.email,
            password=hash_password(args.password),
            roles=["professional"],
            active=False,
        )
        professional = Professional(
            full_name=args.full_name,
            service=args.service,
            experience=args.experience,
            address=args.address,
            pincode=args.pincode,
            user_id=User.query.filter_by(email=args.email).first().id,
            active=False,
        )
        db.session.add(professional)
        db.session.commit()
        return {"message": "Professional Request Sent for Approval"}


parser4 = reqparse.RequestParser()
parser4.add_argument("service_id", type=int, help="Service ID should be an integer")
parser4.add_argument("customer_id", type=int, help="Customer ID should be an integer")
parser4.add_argument(
    "professional_id", type=int, help="Professional ID should be an integer"
)
parser4.add_argument(
    "date_of_completion", type=str, help="Date of Completion should be a string"
)
parser4.add_argument(
    "service_status", type=str, help="Service Status is should be a string"
)
service_request_fields = {
    "id": fields.Integer,
    "service_id": fields.Integer,
    "customer_id": fields.Integer,
    "professional_id": fields.Integer,
    "date_of_request": fields.String,
    "date_of_completion": fields.String,
    "rating": fields.Integer,
    "remarks": fields.String,
    "service_status": fields.String,
}


class ServiceRequests(Resource):
    @auth_required("token")
    def get(self):
        user = current_user
        service_requests = ServiceRequest.query.all()
        print(service_requests)
        if "professional" in user.roles:
            service_requests = [
                req
                for req in service_requests
                if (
                    req.service.name == user.professional.service
                    and req.service_status == "requested"
                )
                or req.professional_id == user.professional.id
            ]
            print(service_requests)
        if len(service_requests) == 0:
            return {"message": "No Requests Found"}, 404
        all_services = Service.query.all()
        # service_requests = ServiceRequest.query.all()
        return {
            "service_requests": marshal(service_requests, service_request_fields),
            "services": marshal(all_services, service_fields),
        }

    def post(self):
        args = parser4.parse_args()
        service_request = ServiceRequest(
            service_id=args.service_id,
            customer_id=Customer.query.filter_by(user_id=args.customer_id).all()[0].id,
            date_of_request=datetime.now().strftime("%d/%m/%y"),
            service_status="requested",
        )
        db.session.add(service_request)
        db.session.commit()
        return {"message": "Service Request Added"}


class AcceptServiceRequest(Resource):
    def get(self, id):
        service_request = ServiceRequest.query.get(id)
        service_request.professional_id = None
        service_request.service_status = "requested"
        db.session.commit()
        return {"message": "Service Request Rejected"}

    @auth_required("token")
    @roles_required("professional")
    def post(self, id):
        user = current_user
        if "professional" not in user.roles:
            return {"message": "This funtion us not allowed for current user"}, 401

        service_request = ServiceRequest.query.get(id)
        args = parser4.parse_args()
        service_request.professional_id = user.professional.id
        service_request.service_status = "assigned"
        db.session.commit()
        return {"message": "Service Request Accepted"}


parser5 = reqparse.RequestParser()
parser5.add_argument(
    "user_id",
    type=int,
    help="User_id is required and should be an integer",
    required=True,
)


class ServiceRequestByCustomer(Resource):
    def post(self):
        args = parser5.parse_args()
        customer = Customer.query.filter_by(user_id=args.user_id).first()
        service_requests = ServiceRequest.query.filter_by(customer_id=customer.id).all()
        all_services = Service.query.all()
        return {
            "service_requests": marshal(service_requests, service_request_fields),
            "services": marshal(all_services, service_fields),
        }


parser6 = reqparse.RequestParser()
parser6.add_argument(
    "rating",
    type=int,
    help="Rating is required and should be an integer",
    required=True,
)
parser6.add_argument("remarks", type=str, help="Remarks should be a string")


class CloseServiceRequest(Resource):
    def post(self, id):
        args = parser6.parse_args()
        service_request = ServiceRequest.query.get(id)
        service_request.rating = args.rating
        service_request.remarks = args.remarks
        service_request.date_of_completion = datetime.now().strftime("%d/%m/%y")
        service_request.service_status = "closed"
        db.session.commit()
        return {"message": "Service Request Closed"}


class UserDetails(Resource):
    @auth_required("token")
    def get(self):
        user = current_user
        customer = Customer.query.filter_by(user_id=user.id).first()
        professional = Professional.query.filter_by(user_id=user.id).first()

        if customer:
            customer_data = marshal(customer, customer_fields)
            customer_data["email"] = user.email
            return customer_data

        if professional:
            professional_data = marshal(professional, professional_fields)
            professional_data["email"] = user.email
            return professional_data

        if user.roles == ["admin"]:
            return {"message": "Admin user"}, 200

        return {"message": "User not found"}, 404


class UpdateUserProfile(Resource):
    @auth_required("token")
    def post(self):
        user = current_user
        args = parser2.parse_args()

        customer = Customer.query.filter_by(user_id=user.id).first()
        professional = Professional.query.filter_by(user_id=user.id).first()

        if customer:
            customer.full_name = args.full_name
            customer.address = args.address
            customer.pincode = args.pincode
            user.email = args.email
            db.session.commit()
            return {"message": "Customer profile updated"}

        if professional:
            professional.full_name = args.full_name
            professional.address = args.address
            professional.pincode = args.pincode
            user.email = args.email
            db.session.commit()
            return {"message": "Professional profile updated"}

        return {"message": "User not found"}, 404


api.add_resource(Services, "/services")
api.add_resource(Customers, "/customers")
api.add_resource(Professionals, "/professionals")
api.add_resource(UpdateService, "/update/service/<int:id>")
api.add_resource(ServiceRequests, "/request/service")
api.add_resource(AcceptServiceRequest, "/accept/service-request/<int:id>")
api.add_resource(ServiceRequestByCustomer, "/service-request/customer")
api.add_resource(CloseServiceRequest, "/close/service-request/<int:id>")
api.add_resource(UserDetails, "/user-details")
api.add_resource(UpdateUserProfile, "/update-user-profile")
