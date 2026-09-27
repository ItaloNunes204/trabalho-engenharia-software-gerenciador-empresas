from datetime import datetime

from app.extensions import db


class Company(db.Model):
    __tablename__ = "companies"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    cnpj = db.Column(db.String(30), nullable=False)
    sector = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="active")
    email = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    users = db.relationship(
        "User", backref="company", cascade="all, delete-orphan", lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "cnpj": self.cnpj,
            "sector": self.sector,
            "city": self.city,
            "status": self.status,
            "email": self.email,
            "phone": self.phone,
            "createdAt": self.created_at.isoformat(),
            "userCount": len(self.users),
        }
