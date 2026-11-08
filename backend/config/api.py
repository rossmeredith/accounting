from ninja import NinjaAPI, Schema

from .auth_api import router as auth_router
from .nominal_api import router as nominal_router

api = NinjaAPI(title="Accounting API", version="1.0.0")
api.add_router("/auth", auth_router)
api.add_router("/nominal-ledger", nominal_router)


class HealthOut(Schema):
    status: str


@api.get("/health", response=HealthOut)
def health(request):
    return HealthOut(status="ok")
