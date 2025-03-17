from flask import Flask
from app.routes.payments import payments_bp
from app.config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(payments_bp)

if __name__ == "__main__":
    app.run(debug=True, port=Config.PORT)