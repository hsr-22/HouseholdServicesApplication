# Household_Services_Application : TaskMasters
This is a multi-user application (requires one admin and other service professionals/ customers) which acts as platform for providing comprehensive home servicing and solutions.

## Installation

### Install Dependencies
```sh
pip install -r requirements.txt
```

### Install and Run MailHog

#### Linux
```sh
wget https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64
chmod +x MailHog_linux_amd64
./MailHog_linux_amd64
```

### Start Celery Worker
```sh
celery -A app.celery_app worker --loglevel INFO
```

### Start Celery Beat
```sh
celery -A app.celery_app beat --loglevel INFO
```