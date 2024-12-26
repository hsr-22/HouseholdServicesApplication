from celery import shared_task
from ..models import ServiceRequest, User, Role, Service
import flask_excel as excel
from ..mail_service import send_message, send_report
from jinja2 import Template


@shared_task(ignore_result=False)
def create_service_request_csv():
    service_requests = ServiceRequest.query.all()

    csv_output = excel.make_response_from_query_sets(
        service_requests,
        [
            "id",
            "service_id",
            "customer_id",
            "professional_id",
            "date_of_request",
            "date_of_completion",
            "rating",
            "remarks",
            "service_status",
        ],
        "csv",
    )
    filename = "ServiceRequests_Admin.csv"

    with open(filename, "wb") as f:
        f.write(csv_output.data)

    return filename


@shared_task(ignore_result=True)
def daily_reminder(subject):
    service_requests = ServiceRequest.query.filter_by(service_status="requested").all()
    if len(service_requests) != 0:
        professionals = User.query.filter(
            User.roles.any(Role.name == "professional")
        ).all()
        for professional in professionals:
            send_message(
                professional.email,
                subject,
                "Dear Professional,\n\nYou have pending service requests awaiting your action. Please log in to the application to review and respond to these requests.\n\nBest regards,\nTaskMasters Pvt. Ltd.",
            )
        return "OK"


@shared_task(ignore_result=True)
def monthly_reminder(subject):
    all_service_requests = ServiceRequest.query.all()
    service_ids = []
    for service_request in all_service_requests:
        service_ids.append(service_request.service_id)
    most_frequent = max(set(service_ids), key=service_ids.count)
    services = Service.query.all()
    
    customers = User.query.filter(User.roles.any(Role.name == "customer")).all()
    for customer in customers:
        customer_service_requests = ServiceRequest.query.filter_by(customer_id=customer.customer.id).all()
        service_closed = [req for req in customer_service_requests if req.service_status == "closed"]
        with open("frontend/templates/test.html", "r") as f:
            template = Template(f.read())
            send_report(
                customer.email,
                subject,
                template.render(
                    email=customer.email,
                    request=len(customer_service_requests),
                    close=len(service_closed),
                    service_requests=customer_service_requests,
                    services=services,
                    high=most_frequent,
                ),
                "Dear Customer,\n\nPlease find attached the monthly activity report for your account. This report contains details of all service requests made by you, along with the status of each request. If you have any queries or require further information, please do not hesitate to contact us.\n\nBest regards,\nTaskMasters Pvt. Ltd.",
            )
    return "OK"
