from flask import Flask, abort, redirect, url_for
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from backend.models import db, User, Role
from backend.config import DevelopmentConfig, CeleryConfig
from backend.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from backend.tasks.tasks import daily_reminder, monthly_reminder
from flask_caching import Cache
from upload_initial_data import create_initial_data
from backend import mail_tester


def unauthorized_handler():
    abort(401)
    # return redirect('/#/login')


def create_app():
    app = Flask(
        __name__, template_folder="frontend/templates", static_folder="frontend/static"
    )

    app.config.from_object(DevelopmentConfig)

    db.init_app(app)
    celery_init_app(app, CeleryConfig)
    excel.init_excel(app)

    cache = Cache(app, config={"CACHE_TYPE": "simple"})
    cache.init_app(app)

    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.cache = cache

    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.security.unauthorized_handler(unauthorized_handler)  # Set the custom handler

    app.app_context().push()

    create_initial_data(db, app, datastore)

    from backend.resources import api

    # flask-restful init
    api.init_app(app)

    with app.app_context():
        import backend.routes
    return app


app = create_app()
celery_app = app.extensions["celery"]


@celery_app.on_after_configure.connect
def send_email_daily(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=13, minute=21), daily_reminder.s("Daily Reminder")
    )


@celery_app.on_after_configure.connect
def send_email_monthly(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=13, minute=21, day_of_month=3),
        monthly_reminder.s("Monthly Activity Report"),
    )

if __name__ == "__main__":
    app.run(debug=True)
    # mail_tester.mail_tester()
