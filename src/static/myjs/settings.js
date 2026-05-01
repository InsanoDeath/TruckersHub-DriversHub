"use-strict"
const profileSubmit = document.getElementById("profileSubmit");
console.log(profileSubmit)
if (profileSubmit) {
    profileSubmit.addEventListener("click", () => {
        try {
            const username = document.getElementById("username");
            const email = document.getElementById("email");
            const country = document.getElementById("country");

            const option = {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    country: country.value
                })
            }
            fetch("/settings/edit/profile", option).then((body) => {
                return body.json()
            }).then((json) => {
                if (!json.success) {
                    Swal.fire({
                        title: "Error!",
                        text: json.message,
                        type: "error",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        },
                        buttonsStyling: !1
                    })
                } else {
                    Swal.fire({
                        title: "Success!",
                        text: json.message,
                        type: "success",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        },
                        buttonsStyling: !0
                    })
                }
            }).catch((err) => {
                Swal.fire({
                    title: "Error!",
                    text: String(err),
                    type: "error",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    },
                    buttonsStyling: !1
                })
            })
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: String(err),
                type: "error",
                customClass: {
                    confirmButton: "btn btn-primary"
                },
                buttonsStyling: !1
            })
        }
    })
}

const passwordSubmit = document.getElementById("passwordSubmit")
if (passwordSubmit) {
    passwordSubmit.addEventListener("click", () => {
        const form = document.getElementById("passwordForm")
        form.classList.add('was-validated');
        if (form.checkValidity() === false) {
            form.classList.add('invalid');
        } else {
            try {
                const cpassword = document.getElementById("cpassword");
                const npassword = document.getElementById("npassword");
                const repassword = document.getElementById("repassword");

                const option = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        cpassword: cpassword.value,
                        npassword: npassword.value,
                        repassword: repassword.value
                    })
                }
                fetch("/settings/edit/password", option).then((body) => {
                    return body.json()
                }).then((json) => {
                    if (!json.success) {
                        Swal.fire({
                            title: "Error!",
                            text: json.message,
                            type: "error",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            },
                            buttonsStyling: !1
                        })
                    } else {
                        Swal.fire({
                            title: "Success!",
                            text: json.message,
                            type: "success",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            },
                            buttonsStyling: !0
                        })
                    }
                }).catch((err) => {
                    Swal.fire({
                        title: "Error!",
                        text: String(err),
                        type: "error",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        },
                        buttonsStyling: !1
                    })
                })
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: String(err),
                    type: "error",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    },
                    buttonsStyling: !1
                })
            }
        }
    })
}

const avatar = document.getElementById("avatar")

avatar.addEventListener("change", function () {
    const file = this.files[0]

    if (file) {
        const labelAvatar = document.getElementById("labelavatar")

        if (file.size <= Math.floor(2 * 1024 * 1024)) {
            labelAvatar.classList.remove("btn-secondary")
            labelAvatar.classList.remove("btn-danger")
            labelAvatar.classList.add("btn-success")
            labelAvatar.innerText = "Success"

            const form = document.getElementById("avatarform")
            form.submit()
        } else {
            labelAvatar.classList.remove("btn-secondary")
            labelAvatar.classList.remove("btn-success")
            labelAvatar.classList.add("btn-danger")
            labelAvatar.innerText = "Larger than 2MB"
        }
    }
})