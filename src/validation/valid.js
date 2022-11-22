const mongoose = require('mongoose')

const Name = function (value) {
    let name = /^[a-z ]{3,}$/;
    if (name.test(value)) return true;
};

const fullName = function (value) {
    let fullname = /^[a-zA-Z@#$,%& ]{3,}$/;
    if (fullname.test(value)) return true;
};

const nameReg = function(value){
    const reg = /^[a-zA-Z ]+$/
    return reg.test(value)
}

const logoLink = function (value) {
    let link = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;
    if (link.test(value)) return true;
}

const emailReg = function (email) {
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
}

const validObjectId = function(objectId){
    return mongoose.isValidObjectId(objectId)
}

function mobileValid(number) {
    const mobileReg = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    return mobileReg.test(number)
}

function checkObjKeys(value){
    if(Object.keys(value).length==0) return true
    return false
    
    // else return false
}

module.exports = {Name, fullName, logoLink, emailReg, validObjectId, mobileValid, nameReg, checkObjKeys}

