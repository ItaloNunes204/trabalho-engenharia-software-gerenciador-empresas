from app.extensions import db


class Permission(db.Model):
    __tablename__ = "permissions"
    __table_args__ = (
        db.UniqueConstraint("role", "functionality", name="uq_role_functionality"),
    )

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(30), nullable=False)
    functionality = db.Column(db.String(50), nullable=False)
    enabled = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self):
        return {
            "role": self.role,
            "functionality": self.functionality,
            "enabled": self.enabled,
        }
