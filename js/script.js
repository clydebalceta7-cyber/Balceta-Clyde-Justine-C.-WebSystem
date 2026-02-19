const glassAlert = Swal.mixin({
  background: 'rgba(15, 23, 42, 0.95)',
  color: '#e5e7eb',
  iconColor: '#38bdf8',
  confirmButtonColor: '#38bdf8',
  cancelButtonColor: '#64748b',
  buttonsStyling: true,
  customClass: {
    popup: 'glass-alert',
    title: 'glass-alert-title',
    confirmButton: 'glass-alert-btn',
    cancelButton: 'glass-alert-btn'
  }
});

$(document).ready(function () {

  /* ===== LOGIN ===== */
  $("#login").on("submit", function (e) {
    e.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    if (!email && !password) {
      glassAlert.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please enter your email and password."
      });
      return;
    }

    if (!email) {
      glassAlert.fire({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address."
      });
      return;
    }

    if (!password) {
      glassAlert.fire({
        icon: "warning",
        title: "Password required",
        text: "Please enter your password."
      });
      return;
    }

    glassAlert.fire({
      icon: "success",
      title: "Welcome back!",
      text: "Login successful."
    });
  });

  /* ===== CREATE ACCOUNT ===== */
  $("#createAccount").on("submit", function (e) {
    e.preventDefault();

    const email = $("#signupEmail").val().trim();
    const password = $("#signupPassword").val();
    const confirm = $("#confirmPassword").val();

    if (!email || !password || !confirm) {
      glassAlert.fire({
        icon: "warning",
        title: "Incomplete form",
        text: "Please fill in all required fields."
      });
      return;
    }

    if (password !== confirm) {
      glassAlert.fire({
        icon: "error",
        title: "Passwords don’t match",
        text: "Please make sure both passwords are the same."
      });
      return;
    }

    glassAlert.fire({
      icon: "success",
      title: "Account created!",
      text: "You can now log in using your account."
    });
  });

  /* ===== FORGOT PASSWORD ===== */
  $("#forgotPassword").on("click", function (e) {
    e.preventDefault();

    glassAlert.fire({
      icon: "info",
      title: "Forgot password",
      text: "A password reset link would be sent to your email."
    });
  });

  /* ===== CALCULATOR (BONUS CLEANUP) ===== */
  $("#calculate").click(function () {
    const opt = $("#operator").val().trim();
    const x = Number($("#num1").val());
    const y = Number($("#num2").val());
    let result;

    if (!opt || isNaN(x) || isNaN(y)) {
      glassAlert.fire({
        icon: "warning",
        title: "Invalid input",
        text: "Please enter valid numbers and an operator."
      });
      return;
    }

    if (opt === '/' && y === 0) {
      glassAlert.fire({
        icon: "error",
        title: "Math error",
        text: "Cannot divide by zero."
      });
      return;
    }

    switch (opt) {
      case '+': result = x + y; break;
      case '-': result = x - y; break;
      case '*': result = x * y; break;
      case '/': result = x / y; break;
      default:
        glassAlert.fire({
          icon: "error",
          title: "Invalid operator",
          text: "Use +, -, *, or /"
        });
        return;
    }

    $("#total").val(result);
  });

});


