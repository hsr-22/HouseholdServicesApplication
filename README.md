# Household Services Application: TaskMasters

TaskMasters is a multi-user application designed to provide comprehensive home servicing and solutions. It supports multiple user roles, including an admin, service professionals, and customers.

## Installation

### Install Dependencies

To install the required dependencies, run the following command:

```sh
pip install -r requirements.txt
```

### Install and Run MailHog

MailHog is used for testing email sending functionality. Follow the steps below to install and run MailHog on Linux:

#### Linux

1. Download MailHog:
    ```sh
    wget https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64
    ```

2. Make the downloaded file executable:
    ```sh
    chmod +x MailHog_linux_amd64
    ```

3. Run MailHog:
    ```sh
    ./MailHog_linux_amd64
    ```

### Start Celery Worker

To start the Celery worker, run the following command:

```sh
celery -A app.celery_app worker --loglevel INFO
```

### Start Celery Beat

To start Celery Beat, run the following command:

```sh
celery -A app.celery_app beat --loglevel INFO
```
