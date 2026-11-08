from ninja import NinjaAPI, Schema

api = NinjaAPI(title="Accounting API", version="1.0.0")


class HealthOut(Schema):
    status: str


@api.get("/health", response=HealthOut)
def health(request):
    return HealthOut(status="ok")
