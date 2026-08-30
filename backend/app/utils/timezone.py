from datetime import datetime, timedelta

def get_wib_time():
    """Mengembalikan waktu saat ini dalam zona waktu WIB (GMT+7) tanpa informasi tz (naive)."""
    return datetime.utcnow() + timedelta(hours=7)
