'use strict';
var besnotepad = angular.module('besnotepad', []);

var groupBy = function (collects, name) {
    var ret = {}, key;
    if(collects){
        collects.forEach(function(elem) {
            var key = elem[name];
            ret[key] = ret[key] || [];
            ret[key].push(elem);
        });
    }
    return ret;
}
function getBesNotepadDatas() {
    let data = localStorage.getItem("besNotepadDatas") || '';
    if(data){
        return JSON.parse(data) || []
    } else {
        return []
    } 
}

function setBesNotepadDatas(arr) {
    localStorage.setItem("besNotepadDatas", JSON.stringify(arr));
}

besnotepad.controller('mapListCtrl', function($scope) {

    // 数据列表对象
    $scope.besNotepadDatas = getBesNotepadDatas();
    $scope.records = groupBy($scope.besNotepadDatas, 'group');
    $scope.filterRecords =  $scope.records

    //保存规则数据到localStorage
    function saveData() {
        $scope.records = groupBy($scope.besNotepadDatas, 'group');
        $scope.filterRecords =  $scope.records
        setBesNotepadDatas($scope.besNotepadDatas);
        $scope.searchRecords()
    }

    $scope.keyword = '';
    $scope.mode= 'table';

    //当前对象
    $scope.curRecord = {
        group: '',
        title: '',
        url: '',
        content: ''
    }

    

    // 过滤查询
    $scope.searchRecords = function(){
        let keyword = $scope.keyword || '';
        if(keyword){
            let arr = $scope.besNotepadDatas || [];
            let newarr = [];
            for(var i=0;i<arr.length;i++){
                let item = arr[i];
                console.log(item);
                let flag = false;
                if(item.title && item.title.indexOf(keyword)>=0){
                    flag = true;
                }else if(item.url && item.url.indexOf(keyword)>=0){
                    flag = true;
                }else if(item.content && item.content.indexOf(keyword)>=0){
                    flag = true;
                }
                if(flag){
                    newarr.push(item);
                }
            }
            $scope.filterRecords = groupBy(newarr, 'group');
        }else {
            $scope.filterRecords = $scope.records
        }
    }

    //编辑框显示状态
    $scope.editDisplay = 'none';

    //编辑框保存按钮文本
    $scope.editType = '添加';

    //输入错误时候的警告
    $scope.inputError = '';

    //隐藏编辑框
    $scope.hideEditBox = function () {
        $scope.editDisplay = 'none';
    }

    //验证输入合法性
    $scope.virify = function () {
        if (!$scope.curRecord.title) {
            $scope.inputError = '标题不能为空';
            return false;
        }
        if (!$scope.curRecord.url && !$scope.curRecord.content) {
            $scope.inputError = 'URL和内容不能同时为空';
            return false;
        }
       
        $scope.inputError = '';
        return true;
    }

    // 点击添加按钮
    $scope.addRecord = function () {
        if ($scope.editDisplay === 'none') {
            $scope.curRecord ={
                group: '',
                title: '',
                url: '',
                content: ''
            };
            $scope.editType = '添加';
            $scope.editDisplay = 'block';
        } else {
            $scope.editType === '添加' && ($scope.editDisplay = 'none');
        }
    };

    //点击编辑按钮
    $scope.edit = function (record) {
        $scope.curRecord = record;
        $scope.editType = '编辑';
        $scope.editDisplay = 'block';
    }

    //编辑后保存
    $scope.saveRecord = function () {
        if ( $scope.virify() ) {
            if ($scope.editType === '添加') {
                $scope.besNotepadDatas.push($scope.curRecord);
            } else {

            }
            saveData();
            $scope.editDisplay = 'none';
        }
    };

    //删除
    $scope.removeUrl = function (record) {
        for (var i = 0, len = $scope.besNotepadDatas.length; i< len; i++) {
            if ($scope.besNotepadDatas[i] === record) {
                $scope.besNotepadDatas.splice(i, 1);
            }
        }
        saveData();
    }

    //导出
    $scope.export = function () {
        function saveAs(blob, filename) {
            var type = blob.type;
            var force_saveable_type = 'application/octet-stream';
            if (type && type != force_saveable_type) { // 强制下载，而非在浏览器中打开
                var slice = blob.slice || blob.webkitSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
            }

            var url = URL.createObjectURL(blob);
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = url;
            save_link.download = filename;

            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
            URL.revokeObjectURL(url);
        }

        var URL = URL || webkitURL || window;
        var bb = new Blob([JSON.stringify($scope.besNotepadDatas, null, '\t')], {type: 'text/json'});
        saveAs(bb, 'config.json');
    }

    //导入
    document.getElementById('jsonFile').onchange = function () {
        var resultFile = this.files[0];
        if (resultFile) {
            var reader = new FileReader();
            reader.readAsText(resultFile);
            reader.onload = function (e) {
                try {
                    var data = JSON.parse(this.result);
                    $scope.besNotepadDatas.length = 0;
                    for (var i = 0, len = data.length; i < len; i++) {
                        $scope.besNotepadDatas.push(data[i]);
                    }
                    saveData();
                    location.reload();
                } catch (e) {
                    alert("导入失败，请检查文件格式是否正确");
                }
            };
        }
    }
});

