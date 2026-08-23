from cryptography.fernet import Fernet


def get_fernet(key: str) -> Fernet:
    return Fernet(key.encode())


def encrypt_text(text: str, key: str) -> str:
    f: Fernet = get_fernet(key)
    return f.encrypt(text.encode()).decode()


def decrypt_text(cipher: str, key: str) -> str:
    f: Fernet = get_fernet(key)
    return f.decrypt(cipher.encode()).decode()
