(function () {
    var params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get("type") === "recovery" || params.get("error_code") === "otp_expired") {
        window.location.replace("/recuperar.html" + window.location.hash);
    }
}());
