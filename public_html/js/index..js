/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var token = "0937872|-31949272265582789|90952128";
var baseUrl = "http://api.login2explore.com:5577";
var endPointUrl1 = "/api/iml";
var endPointUrl2 = "/api/irl";
var relName = "STUDENT-TABLE";
var dbName = "SCHOOL-DB";

function saveRecordNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.Data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollNo = $('#rollNoField').Val();
    var jsonStr = {
        id: rollNo
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecordNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#rollNoField').Val(record.rollNoField);
    $('#fullNameField').Val(record.fullNameField);
    $('#classField').Val(record.classField);
    $('#birthField').Val(record.birthField);
    $('#addressField').Val(record.addressField);
    $('#enrollField').Val(record.enrollField);
}

function validateFormData() {

    var rollNoVar = $('#rollNoField').Val();
    if (rollNoVar === "") {
        alert("Roll No. Field is Required");
        $('#rollNoField').focus();
        return "";
    }

    var fullNameVar = $('#fullNameField').Val();
    if (fullNameVar === "") {
        alert("Full Name. Field is Required");
        $('#fullNameField').focus();
        return "";
    }

    var classVar = $('#classField').Val();
    if (classVar === "") {
        alert("Class. Field is Required");
        $('#classField').focus();
        return "";
    }

    var birthVar = $('#birthField').Val();
    if (birthVar === "") {
        alert("Birth. Field is Required");
        $('#birthField').focus();
        return "";
    }

    var addressVar = $('#addressField').Val();
    if (addressVar === "") {
        alert("Address. Field is Required");
        $('#addressField').focus();
        return "";
    }

    var enrollVar = $('#enrollField').Val();
    if (enrollVar === "") {
        alert("Enrpllment. Field is Required");
        $('#enrollField').focus();
        return "";
    }

    var jsonStrObj = {
        rollNoField: rollNoVar,
        fullNameField: fullNameVar,
        classField: classVar,
        birthField: birthVar,
        addressField: addressVar,
        enrollField: enrollVar
    };

    return JSON.stringify(jsonStrObj);
}

function createPutRequest(token, jsonStr, dbName, relName) {
    var putReq = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\" : \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\" : \n"
            + jsonStr
            + "\n"
            + "}";
    return putReq;
}

function executePutCommand(reqStr, baseUrl, endUrl) {
    var url = baseUrl + endUrl;
    var jsonObj;
    $.post(url, reqStr, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function saveForm() {
    var jsonStr = validateFormData();
    if (jsonStr === "") {
        return;
    }

    var putStr = createPUTRequest(token, jsonStr, dbName, relName);
    alert(putStr);
    jQuery.ajaxSetup({async: false});
    var result = executePutCommand(putStr, baseUrl, endPointUrl1);
    jQuery.ajaxSetup({async: true});

    alert(JSON.stringify(result));

    resetForm();
}

function resetForm() {
    $('#rollNoField').Val("");
    $('#fullNameField').Val("");
    $('#classField').Val("");
    $('#birthField').Val("");
    $('#addressField').Val("");
    $('#enrollField').Val("");
    $('#rollNoField').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#update').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollNoField').focus();
}

function updateForm() {
    $('#update').prop("disabled", true);
    var jsonUpdate = validateFormData();
    var updateReq = createUPDATERecordRequest(token, jsonUpdate, dbName, relName, localStorage.getItem("recno") );
    jQuery.ajaxSetup({async: false});
    var result = executePutCommand(updateReq, baseUrl, endPointUrl1);
    jQuery.ajaxSetup({async: true});
    console.log(result);
    resetForm();
    $('#rollNoField').focus();
}

function getStudent() {
    var studentRoll = getRollNoAsJsonObj();
    var getReq = createGET_BY_KEYRequest(token, dbName, relName, studentRoll);
    jQuery.ajaxSetup({async: false});
    var result = executePutCommand(getReq, baseUrl, endPointUrl1);
    jQuery.ajaxSetup({async: true});
    console.log(result);
    if (result.status === 400) {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#fullNameField').focus();
    } else if (result.status === 400){
        $('#rollNoField').prop("disabled", true);
        fillData(result);
        $('#update').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#fullNameField').focus();
    }
}


