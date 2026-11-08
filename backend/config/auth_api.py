from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, update_session_auth_hash
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.http import HttpResponse
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import Router, Schema, Status
from ninja.errors import HttpError
from ninja.security import django_auth

router = Router(tags=["auth"])
User = get_user_model()


class UserOut(Schema):
    id: int
    email: str


class MessageOut(Schema):
    detail: str


class RegisterIn(Schema):
    email: str
    password: str


class LoginIn(Schema):
    email: str
    password: str


class PasswordChangeIn(Schema):
    current_password: str
    new_password: str


class PasswordResetIn(Schema):
    email: str


class PasswordResetConfirmIn(Schema):
    uid: str
    token: str
    new_password: str


def _user_out(user) -> UserOut:
    return UserOut(id=user.id, email=user.email)


@router.get("/csrf")
@ensure_csrf_cookie
def csrf(request):
    return HttpResponse('{"detail":"ok"}', content_type="application/json")


@router.get("/me", auth=django_auth, response={200: UserOut})
def me(request):
    return _user_out(request.user)


@router.post("/register", response={201: UserOut})
def register(request, data: RegisterIn):
    email = data.email.strip().lower()
    if not email:
        raise HttpError(400, "Email is required.")
    if User.objects.filter(email__iexact=email).exists():
        raise HttpError(400, "A user with that email already exists.")
    try:
        validate_password(data.password, user=User(email=email))
    except ValidationError as exc:
        raise HttpError(400, " ".join(exc.messages)) from exc
    user = User.objects.create_user(email=email, password=data.password)
    auth_login(request, user)
    return Status(201, _user_out(user))


@router.post("/login", response={200: UserOut})
def login(request, data: LoginIn):
    email = data.email.strip().lower()
    user = authenticate(request, email=email, password=data.password)
    if user is None:
        raise HttpError(401, "Invalid email or password.")
    auth_login(request, user)
    return _user_out(user)


@router.post("/logout", auth=django_auth, response={200: MessageOut})
def logout(request):
    auth_logout(request)
    return MessageOut(detail="Logged out.")


@router.post("/password/change", auth=django_auth, response={200: MessageOut})
def password_change(request, data: PasswordChangeIn):
    user = request.user
    if not user.check_password(data.current_password):
        raise HttpError(400, "Current password is incorrect.")
    try:
        validate_password(data.new_password, user=user)
    except ValidationError as exc:
        raise HttpError(400, " ".join(exc.messages)) from exc
    user.set_password(data.new_password)
    user.save()
    update_session_auth_hash(request, user)
    return MessageOut(detail="Password updated.")


@router.post("/password/reset", response={200: MessageOut})
def password_reset(request, data: PasswordResetIn):
    email = data.email.strip().lower()
    user = User.objects.filter(email__iexact=email).first()
    if user is not None:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        base = settings.FRONTEND_URL.rstrip("/")
        link = f"{base}/reset-password?uid={uid}&token={token}"
        send_mail(
            subject="Reset your Accounting password",
            message=(
                "Use the link below to choose a new password. "
                "If you did not request this, ignore this email.\n\n"
                f"{link}\n"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    return MessageOut(
        detail="If an account exists for that email, reset instructions were sent."
    )


@router.post("/password/reset/confirm", response={200: MessageOut})
def password_reset_confirm(request, data: PasswordResetConfirmIn):
    try:
        uid = force_str(urlsafe_base64_decode(data.uid))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as exc:
        raise HttpError(400, "Invalid reset link.") from exc
    if not default_token_generator.check_token(user, data.token):
        raise HttpError(400, "Invalid or expired reset link.")
    try:
        validate_password(data.new_password, user=user)
    except ValidationError as exc:
        raise HttpError(400, " ".join(exc.messages)) from exc
    user.set_password(data.new_password)
    user.save()
    return MessageOut(detail="Password has been reset. You can sign in now.")
