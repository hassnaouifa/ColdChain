# monitoring/alerts.py
import requests
from django.core.mail import send_mail
from django.conf import settings

# ----- Gmail -----
def send_email_alert(subject, message, recipient_list):
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        recipient_list,
        fail_silently=False,
    )

# ----- Telegram -----
TELEGRAM_TOKEN = "8580017637:AAEU5QWblxc2xUx0fC4XA5RxoWs3taJzHUE"
TELEGRAM_CHAT_ID = "1735296843"

def send_telegram_alert(message):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {"chat_id": TELEGRAM_CHAT_ID, "text": message}
    requests.post(url, data=payload)

# ----- WhatsApp -----
WHATSAPP_PHONE_NUMBER_ID = "TON_PHONE_NUMBER_ID"
WHATSAPP_ACCESS_TOKEN = "TON_ACCESS_TOKEN"

def send_whatsapp_alert(message, recipient_number):
    url = f"https://graph.facebook.com/v17.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": recipient_number,
        "text": {"body": message}
    }
    requests.post(url, headers=headers, json=data)
