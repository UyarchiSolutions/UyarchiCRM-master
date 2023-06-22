const moment=require('moment');


const create_date=async(model)=>{
    const created = moment();
    const DateIso = moment();
    model.created=created;
    model.DateIso=DateIso;
    model.date=moment().format("YYYY-MM-DD");
    model.save();
    return model
}


module.exports={create_date};