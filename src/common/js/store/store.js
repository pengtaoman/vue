/**
 * Created by pengt on 2017/9/27.
 */
define([
    'vue',
    'vuex',
    'axios'
], function(Vue, Vuex, axios){

    var store = new Vuex.Store({
        state: {
            menuData:{},
            menuDataForDealMenu:{},
            priMenuData:[],
            priMenuDataForDealMenu:[],
            convertedMenuData:[],
            messages: [],
            contentHeader:'',
            breadCrumb:[],
            getMenuUrlForDealMenu:'/sys/allMenus',//'/sys/menus', ///sys/allMenus
            faIconsOption : [
                {value:'fa fa-address-book-o', label:'fa fa-address-book-o'}
                ,{value:'fa fa-building', label:'fa fa-building'}
                ,{value:'fa fa-address-card', label:'fa fa-address-card'}
                ,{value:'fa fa-handshake-o', label:'fa fa-handshake-o'}
                ,{value:'fa fa-podcast', label:'fa fa-podcast'}
                ,{value:'fa fa-telegram', label:'fa fa-telegram'}
                ,{value:'fa fa-id-card', label:'fa fa-id-card'}
                ,{value:'fa fa-linode', label:'fa fa-linode'}
                ,{value:'fa fa-archive', label:'fa fa-archive'}
                ,{value:'fa fa-university', label:'fa fa-university'}
                ,{value:'fa fa-bar-chart', label:'fa fa-bar-chart'}
                ,{value:'fa fa-binoculars', label:'fa fa-binoculars'}
                ,{value:'fa fa-bookmark', label:'fa fa-bookmark'}
                ,{value:'fa fa-calendar-check-o', label:'fa fa-calendar-check-o'}
                ,{value:'fa fa-film', label:'fa fa-film'}
                ,{value:'fa fa-folder-open', label:'fa fa-folder-open'}
                ,{value:'fa fa-gavel', label:'fa fa-gavel'}
                ,{value:'fa fa-bars', label:'fa fa-bars'}
                ,{value:'fa fa-puzzle-piece', label:'fa fa-puzzle-piece'}
                ,{value:'fa fa-qrcode', label:'fa fa-qrcode'}
                ,{value:'fa fa-shopping-bag', label:'fa fa-shopping-bag'}
                ,{value:'fa fa-shopping-cart', label:'fa fa-shopping-cart'}
                ,{value:'fa fa-tags', label:'fa fa-tags'}
                ,{value:'fa fa-tasks', label:'fa fa-tasks'}
                ,{value:'fa fa-suitcase', label:'fa fa-suitcase'}
                ,{value:'fa fa-exclamation-triangle', label:'fa fa-exclamation-triangle'}

            ]

        },
        actions:{
            // getMenus : function(commitObj) {
            //     console.log('--------- actions :: getMenus dispatched');
            //     //  console.log(obj);
            //     axios.get(basePath + '/common/data/menu.json').then(function(response) {
            //         require([basePath + '/common/js/util/TreeDataConvert.js'], function(conv) {
            //             var res = response.data;
            //             _.forEach(res, function (obj) {
            //                 obj.name = obj.fMenuName;
            //
            //             });
            //             res = conv.convert(res, 'fMenuId', 'fParentMenuId','');
            //             var mData = {'name':'系统菜单'};
            //             mData.children = res;
            //             commitObj.commit('pushMenuData', mData);
            //             console.log('------- Converted Menu Data :: ' + JSON.stringify(mData));
            //
            //         });
            //
            //     });
            // }
        },
        mutations: {
            pushMenuData: function(state, menu) {
                state.menuData = menu;
            },
            pushPriMenuData: function(state, menu) {
                state.priMenuData = menu;
            },
            pushMenuDataForDealMenu: function(state, menu) {
                state.menuDataForDealMenu = menu;
            },
            pushPriMenuDataForDealMenu: function(state, menu) {
                state.priMenuDataForDealMenu = menu;
            },
            pushConvertedMenuData: function(state, menu) {
                state.convertedMenuData = menu;
            },

            pushMessage: function (state, message) {

                state.messages.push(message)
            },
            removeMessage: function (state, index) {
                state.messages.splice(index, 1)
            },
            setHeader: function(state, header) {
                state.contentHeader = header;
            },
            setBread: function(state, breadcrumb) {
                state.breadCrumb = [];
                state.breadCrumb = breadcrumb;
            }
        }
    });

    return store;

});
