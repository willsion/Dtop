var oTable;
$(document).ready(function () {
initModal();
oTable = initTable();
$("#btnEdit").hide();
$("#btnSave").click(_addFun);
$("#btnEdit").click(_editFunAjax);
$("#deleteFun").click(_deleteFun);
//checkbox全选
$("#checkAll").live("click", function () {
    if ($(this).attr("checked") === "checked") {
        $("input[name='checkList']").attr("checked", $(this).attr("checked"));
    } else {
        $("input[name='checkList']").attr("checked", false);
    }
});
});
/**
* 表格初始化
* @returns {*|jQuery}
*/
function initTable() {
var table = $("#shangyou").dataTable({
	"sAjaxSource": "shangyou-dataList",
	"bPaginate": true,	
	"bLengthChange": true,
	"iDisplayLength": 10,
	"bDestory": true,
	"bRetrieve": true,
	"bFilter": true,
	"bSort": true,
	"Processing": true,
	"aoColumns": [
        {
            "mDataProp": "id",bSortable: false,
            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                $(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");

            }
		},
        {"mDataProp": "name"},
        {"mDataProp": "number"},
        {"mDataProp": "ip"},
        {"mDataProp": "program_path"},
        {"mDataProp": "log_path"},
        {"mDataProp": "callback"},
        {"mDataProp": "people"},
        {"mDataProp": "note"},
        {"mDataProp": "statement_account"}
    ],
    "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
    "sPaginationType": "bootstrap",
    "oLanguage": {
            "sProcessing": "玩命加载中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "oPaginate": {
                "sFirst":    "首页",
                "sPrevious": "上页",
                "sNext":     "下页",
                "sLast":     "末页"
            }
    },
    "fnCreatedRow": function (nRow, aData, iDataIndex) {
        //add selected class
        $(nRow).click(function () {
            if ($(this).hasClass('row_selected')) {
                $(this).removeClass('row_selected');
            } else {
                oTable.$('tr.row_selected').removeClass('row_selected');
                $(this).addClass('row_selected');
            }
        });
    },
    "fnInitComplete": function (oSettings, json) {
        $("#editFun").click(_value);
        $("#addFun").click(_init);
    }

});
return table;
}
 

 
/**
* 赋值ram id
* @private
**/
function _deleteFun(id) {
var str = '';
var id = '';
$("input[name='checkList']:checked").each(function (i, o) {
    str += $(this).val();
    str += ",";
});
if (str.length > 0) {
    var id = str.substr(0, str.length - 1);
    alert("你要删除的数据集id为" + id);
} else {
    alert("至少选择一条记录操作");
}

$.ajax({
    url: "shangyou-deleteFun",
    data: {"id": id},
    type: "post",
    success: function (backdata) {
        if (backdata) {
            oTable.fnReloadAjax(oTable.fnSettings());
        } else {
            alert("删除失败");
        }
    }, error: function (error) {
        console.log(error);
    }
});
}
/*
赋值
* @private
*/
function _value() {
if (oTable.$('tr.row_selected').get(0)) {
    $("#btnEdit").show();
    var selected = oTable.fnGetData(oTable.$('tr.row_selected').get(0));
    $("#column_2").val(selected.name);
    $("#column_3").val(selected.number);
    $("#column_4").val(selected.ip);
    $("#column_5").val(selected.program_path);
    $("#column_6").val(selected.log_path);
    $("#column_7").val(selected.callback);
    $("#column_8").val(selected.people);
    $("#column_9").val(selected.note);
    $("#column_10").val(selected.statement_account);
    $("#objectId").val(selected.id);
 
    $("#myModal").modal("show");
    $("#btnSave").hide();
} else {
    alert('请点击选择一条记录后操作。');
}
}
 
/**
* 编辑数据带出值
* @param id
* @param name
* @param job
* @param note
* @private
*/
function _editFun(name, number, ip, program_path, log_path, callback, people, note, statement_account) {
$("#column_2").val(name);
$("#column_3").val(number);
$("#column_4").val(ip);
$("#column_5").val(program_path);
$("#column_6").val(log_path);
$("#column_7").val(callback);
$("#column_8").val(people);
$("#column_9").val(note);
$("#column_10").val(statement_account);
$("#objectId").val(id);
$("#myModal").modal("show");
$("#btnSave").hide();
$("#btnEdit").show();
}
 
/**
* 初始化
* @private
*/
function _init() {
resetFrom();
$("#btnEdit").hide();
$("#btnSave").show();
}
 
/**
* 添加数据
* @private
*/
function _addFun() {
var jsonData = {
    'name': $("#column_2").val(),
    'number': $("#column_3").val(),
    'ip': $("#column_4").val(),
    'program_path': $("#column_5").val(),
    'log_path': $("#column_6").val(),
    'callback': $("#column_7").val(),
    'people': $("#column_8").val(),
    'note': $("#column_9").val(),
    'statement_account': $("#column_10").val()
};
$.ajax({
    url: 'shangyou-insertFun',
    data: jsonData,
    type: 'POST',
    success: function (backdata) {
        if (backdata == 1) {
            $("#myModal").modal("hide");
            resetFrom();
            oTable.fnReloadAjax(oTable.fnSettings());
        } else if (backdata == 0) {
            alert("插入失败");
        } else {
            alert("防止数据不断增长，会影响速度，请先删掉一些数据再做测试");
        }
    }, error: function (error) {
        console.log(error);
    }
});
}
 
 
/*
add this plug in
// you can call the below function to reload the table with current state
Datatables刷新方法
oTable.fnReloadAjax(oTable.fnSettings());
*/
$.fn.dataTableExt.oApi.fnReloadAjax = function (oSettings) {
//oSettings.sAjaxSource = sNewSource;
this.fnClearTable(this);
this.oApi._fnProcessingDisplay(oSettings, true);
var that = this;
 
$.getJSON(oSettings.sAjaxSource, null, function (json) {
    /* Got the data - add it to the table */
    for (var i = 0; i < json.aaData.length; i++) {
        that.oApi._fnAddData(oSettings, json.aaData[i]);
    }
    oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
    that.fnDraw(that);
    that.oApi._fnProcessingDisplay(oSettings, false);
});
}
 
 
/**
* 编辑数据
* @private
*/
function _editFunAjax() {
var id = $("#objectId").val();
var name = $("#column_2").val();
var number = $("#column_3").val();
var ip = $("#column_4").val();
var program_path = $("#column_5").val();
var log_path = $("#column_6").val();
var callback = $("#column_7").val();
var people = $("#column_8").val();
var note = $("#column_9").val();
var statement_account = $("#column_10").val();
var jsonData = {
    "id": id,
    "name": name,
    "number": number,
    "ip": ip,
    "program_path": program_path,
    "log_path": log_path,
    "callback": callback,
    "people": people,
    "note": note,
    "statement_account": statement_account
};
$.ajax({
    type: 'POST',
    url: 'shangyou-editFun',
    data: jsonData,
    success: function (json) {
        if (json) {
            $("#myModal").modal("hide");
            resetFrom();
            oTable.fnReloadAjax(oTable.fnSettings());
        } else {
            alert("更新失败");
        }
    }
});
}
/**
* 初始化弹出层
*/
function initModal() {
$('#myModal').on('show', function () {
    $('body', document).addClass('modal-open');
    $('<div class="modal-backdrop fade in"></div>').appendTo($('body', document));
});
$('#myModal').on('hide', function () {
    $('body', document).removeClass('modal-open');
    $('div.modal-backdrop').remove();
});
}
 
/**
* 重置表单
*/
function resetFrom() {
$('form').each(function (index) {
    $('form')[index].reset();
});
}
 
 
/**
* 批量删除
* 未做
* @private

function _deleteList() {
var str = '';
$("input[name='checkList']:checked").each(function (i, o) {
    str += $(this).val();
    str += ",";
});
if (str.length > 0) {
    var IDS = str.substr(0, str.length - 1);
    alert("你要删除的数据集id为" + IDS);
} else {
    alert("至少选择一条记录操作");
}
}
*/
