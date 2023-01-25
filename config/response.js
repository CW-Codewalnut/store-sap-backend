

module.exports.format = (code,status_flag,mesg,data) => {
    let res = {
        "code":code,
        "status":status_flag,
        "message":mesg,
        "data":data
    }
    return res
  };
