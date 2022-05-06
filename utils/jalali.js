const moment = require("jalali-moment");

exports.convertDate = (date) =>{
    return moment(date).locale("fa").format("D MMM YYYY");
}