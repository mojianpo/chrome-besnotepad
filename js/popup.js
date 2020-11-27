
'use strict';
var besnotepad = angular.module('besnotepad', []);

function openOptions() {
    var a = new Date().getTime();
    window.open('./options.html','_besnotepad')
}
// document.addEventListener("DOMContentLoaded", openOptions);

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
 
    $scope.clickInfo = function(){
        chrome.tabs.getSelected(null, function (tab) {
            if(tab){
                console.log(tab)
                let url = tab.url || ''
                let title = tab.title || ''
                if(url){
                    var items = getBesNotepadDatas()
                    var item = {group: 'default',title: title,url: url,content: ''}
                    var flag = false;
                    items.forEach(function(e){
                        if(e.url === item.url){
                            flag = true;
                        }
                    })
                   
                    if(!flag){
                       items.push(item)
                       setBesNotepadDatas(items)
                       alert('当前网页自动添加完成');
                    }
                }
            }
        });

    }

});

