# import sys
# import os
# # Add the parent directory of 'backend' to the PYTHONPATH
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.tasks.tasks import daily_reminder, monthly_reminder

def mail_tester():
    daily_reminder("Daily Reminder")
    monthly_reminder("Monthly Activity Report")