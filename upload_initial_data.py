import faker
from flask_security import SQLAlchemyUserDatastore, hash_password
from backend.models import User, Role, Professional, Customer, Service


def create_initial_data(db, app, userdatastore: SQLAlchemyUserDatastore):
    with app.app_context():
        # db.drop_all()
        db.create_all()

        # userdatastore : SQLAlchemyUserDatastore = SQLAlchemyUserDatastore(db, User, Role)

        userdatastore.find_or_create_role(id=1, name="admin", description="admin")
        userdatastore.find_or_create_role(
            id=2, name="professional", description="professional"
        )
        userdatastore.find_or_create_role(id=3, name="customer", description="customer")

        if not Service.query.filter_by(name="TestService").first():
            service = Service(
                name="TestService",
                description="Service for Testing",
                price=100,
                time_required="1 hour",
            )
            db.session.add(service)
        db.session.commit()

        if not userdatastore.find_user(email="admin@study.iitm.ac.in"):
            userdatastore.create_user(
                email="admin@study.iitm.ac.in",
                password=hash_password("admin"),
                roles=["admin"],
            )

        customer = False
        if not userdatastore.find_user(email="customer@study.iitm.ac.in"):
            cust_user = userdatastore.create_user(
                email="customer@study.iitm.ac.in",
                password=hash_password("customer"),
                roles=["customer"],
            )
            customer = True

        professional = False
        if not userdatastore.find_user(email="professional@study.iitm.ac.in"):
            prof_user = userdatastore.create_user(
                email="professional@study.iitm.ac.in",
                password=hash_password("professional"),
                roles=["professional"],
            )

            professional = True
        db.session.commit()

        if customer:
            customer = Customer(
                full_name="Raghav",
                address="4, Privet Drive",
                pincode="111111",
                user_id=cust_user.id,
            )
            db.session.add(customer)
        if professional:
            professional = Professional(
                full_name="Vaibhav",
                service="TestService",
                experience="5 years",
                address="Bleecker Street",
                pincode="222222",
                user_id=prof_user.id,
                active=True,
            )
            db.session.add(professional)
        # fake = faker.Faker()

        db.session.commit()
