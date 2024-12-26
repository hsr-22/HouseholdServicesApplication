from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, verify_password, current_user

# from werkzeug.security import check_password_hash
from flask_restful import marshal, fields
import flask_excel as excel
from celery.result import AsyncResult
from backend.models import User, Professional, Service, Customer, ServiceRequest, db
from .tasks.tasks import create_service_request_csv

datastore = app.security.datastore


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/admin")
@auth_required("token")
@roles_required("admin")
def admin():
    return "Welcome Admin"


@app.get("/activate/professional/<int:pro_id>")
@auth_required("token")
@roles_required("admin")
def activate_professional(pro_id):
    professional = Professional.query.get(pro_id)
    user_professional = User.query.get(professional.user_id)
    if not user_professional or "professional" not in user_professional.roles:
        return jsonify({"message": "Professional Not Found"}), 404

    user_professional.active = True
    professional.active = True
    db.session.commit()
    return jsonify({"message": "User Activated"})


@app.post("/user-login")
def user_login():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email Not Provided"}), 400

    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if verify_password(data.get("password"), user.password):
        return jsonify(
            {
                "id": user.id,
                "token": user.get_auth_token(),
                "email": user.email,
                "role": user.roles[0].name,
                "active": user.active,
            }
        )
    else:
        return jsonify({"message": "Wrong Password"}), 400


@app.get("/delete/service/<int:id>")
@auth_required("token")
@roles_required("admin")
def del_service(id):
    service = Service.query.get(id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service Deleted"})


@app.get("/delete/professional/<int:id>")
@auth_required("token")
@roles_required("admin")
def del_professional(id):
    professional = Professional.query.get(id)
    user_id = professional.user_id
    db.session.delete(professional)
    professional = User.query.get(user_id)
    db.session.delete(professional)
    db.session.commit()
    return jsonify({"message": "Professional Deleted"})


@app.get("/delete/customer/<int:id>")
@auth_required("token")
@roles_required("admin")
def del_customer(id):
    customer = Customer.query.get(id)
    user_id = customer.user_id
    db.session.delete(customer)
    customer = User.query.get(user_id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({"message": "Customer Deleted"})


@app.get("/service-details/<int:id>")
def service_details(id):
    service_request = ServiceRequest.query.get(id)
    service = Service.query.get(service_request.service_id)
    professional = Professional.query.get(service_request.professional_id)
    print(service_request.service_status)
    if service_request.service_status in ["requested", "assigned"]:
        return jsonify(
            {
                "name": service.name,
                "description": service.description,
                "professional": professional.full_name,
            }
        )
    if service_request.service_status == "closed":
        return jsonify(
            {
                "name": service.name,
                "description": service.description,
                "professional": professional.full_name,
                "rating": service_request.rating,
                "remarks": service_request.remarks,
            }
        )


@app.get("/download-csv")
def download_csv():
    task = create_service_request_csv.delay()
    return jsonify({"task-id": task.id})


@app.get("/get-csv/<task_id>")
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404


@app.get("/test")
def test():
    service_requests = ServiceRequest.query.with_entities(
        ServiceRequest.service_id
    ).all()
    service_ids = []
    for service_request in service_requests:
        service_ids.append(service_request.service_id)
    most_frequnt = max(set(service_ids), key=service_ids.count)
    return jsonify({"message": "OK"})


@app.get("/user-details")
@auth_required("token")
def user_details():
    user = current_user
    # user = User.query.get(request.user.id)
    if "professional" in user.roles:
        professional = Professional.query.filter_by(user_id=user.id).first()
        return jsonify(
            {
                "full_name": professional.full_name,
                "service": professional.service,
                "experience": professional.experience,
                "address": professional.address,
                "pincode": professional.pincode,
                "active": professional.active,
            }
        )
    elif "customer" in user.roles:
        customer = Customer.query.filter_by(user_id=user.id).first()
        return jsonify(
            {
                "full_name": customer.full_name,
                "address": customer.address,
                "pincode": customer.pincode,
            }
        )
    else:
        return jsonify({"message": "User Not Found"}), 404
