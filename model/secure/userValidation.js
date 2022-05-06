const yup = require("yup");
exports.schema = yup.object().shape({
  fullname: yup
    .string()
    .required("نام و نام خانوادگی الزامی میباشد")
    .min(3, "نام و نام خانوادگی نباید کمتر از سه حرف باشد")
    .max(255, "نام و نام خانوادگی نباید بیشتر از 255 حرف باشد"),
  email: yup
    .string("لطفا ایمیل خود را بررسی کنید")
    .email("ایمیل معتبر نمیباشد")
    .required("ایمیل الزامی میباشد"),
  password: yup
    .string()
    .min(5, "رمز عبور نباید کمتر از 5 حرف باشد")
    .max(255, "رمز عبور نباید بیشتر از 255 کاراکتر باشد")
    .required("رمز عبور الزامی میباشد"),
  confirmPassword: yup
    .string()
    .required("تکرار کلمه عبور الزامی میباشد")
    .oneOf([yup.ref("password"), null], "کلمه های عبور همسان نمیباشد"),
});
