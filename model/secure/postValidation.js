const yup = require("yup");
exports.schema = yup.object().shape({
  title: yup
    .string()
    .min(10, "عنوان پست نباید کمتر از 10 کاراکتر باشد")
    .required("عنوان پست الزامی میباشد")
    .max(100, "عنوان پست نباید بیشتر از 100 کاراکتر باشد"),

  body: yup.string().required("محتوا پست الزامی میباشد"),
  status: yup
    .mixed()
    .oneOf(
      ["private", "public"],
      "لطفا یکی از دو حالت عمومی یا خصوصی را انتخاب کنید"
    ),
  thumbnail: yup.object().shape({
    name: yup.string().required("کاور پست مور نیاز میباشد"),
    size: yup.number().max(300000, "اندازه کاور پست بیشتر از حد مجاز است"),
    mimetype: yup
      .mixed()
      .oneOf(
        ["image/png", "image/jpeg"],
        "فرمت تصویر انتخاب شده مناسب نمیباشد"
      ),
  }),
});
