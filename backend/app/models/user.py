from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=False)
    role = db.Column(db.String(30), nullable=False, default="Visualizador")
    status = db.Column(db.String(20), nullable=False, default="active")
    last_access = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "companyId": self.company_id,
            "companyName": self.company.name if self.company else None,
            "role": self.role,
            "status": self.status,
            "lastAccess": self.last_access.isoformat() if self.last_access else None,
        }
