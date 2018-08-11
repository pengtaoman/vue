/**
 * Created by pengt on 2017/10/13.
 */
define(['text!./template/page_sider_a.html','vue', 'axios', './menu_item_a'],
    function(templateHtml, Vue, axios, menuItem) {

        Vue.component('pageside', {
            template: templateHtml//'#sider-template'
            ,props: {
                model: Object
            }
            ,data: function () {
                if (this.model) {
                    return {
                        menus: this.model,
                        init_menus : {},
                        menuSearchKey : ''
                    }
                } else {
                    return {
                        menus : {},
                        init_menus : {},
                        menuSearchKey : ''
                    }
                }
            }
            ,methods: {
                // fetchMenu : function(queryString, cb) {
                //     var menuss = _.clone(this.init_menus);
                //     _.remove(menuss, function(obj) {
                //         return obj.fMenuId == '8a84fcfe511ee9c401511ee9d7030001';
                //     });
                //     var _vm = this;
                //     _vm.menus = menuss;
                //     cb([{'value':'AAA'}]);
                // },
                // getSelect : function() {
                //     //console.log(this.menus);
                //     var _vm = this;
                //     _vm.menus = this.init_menus;
                // }
            }
            ,mounted : function() {
                this.$nextTick(function() {
                    var _vm = this;

                    //demos
                    //var url = basePath + '/common/data/menu.json';
                    //

                    var url = '/sys/menus';

                    axios.get(url).then(function (response) {
                        require([basePath + '/common/js/util/TreeDataConvert.js'], function (conv) {
                            _.forEach(response.content,function(obj){
                                obj.label = obj.fMenuName;
                            });
                            var res = _.cloneDeep(response.content);

                            //初次登录系统，没有配置菜单的菜单，手动加一个
                            // _.forEach(response.content,function(obj){
                            //     if (obj.fPageLink == '/om/menu/dealMenu') {
                            //
                            //     }
                            // }) ;
                            //
                            // var priRes = response.content;
                            //console.log("======================>>>> " + JSON.stringify(response.data))
                            _.forEach(res, function (obj) {
                                obj.name = obj.fMenuName;
                                if (obj.fPageLink) {
                                    obj.fPageLink = ""+obj.fPageLink;
                                } else {
                                    obj.fPageLink = "";
                                }
                            });
                            res = conv.convert(res, 'fMenuId', 'fParentMenuId', '');
                            _vm.menus = res;
                            _vm.init_menus = res;
                            _vm.$store.commit('pushMenuData', res);
                            // console.log("converted MENU>>>> " + JSON.stringify(res))
                            //console.log("original MENU>>>> " + JSON.stringify(response.content))
                            _vm.$store.commit('pushPriMenuData', response.content);
                            require(['./common/js/adminlte'],function(adming) {

                                $(".sidebar:first-child").find("li:first").addClass("menu-open");
                                $(".sidebar:first-child").find("li ul:first").css("display","block");
                            });
                        });
                    })
                })
            }
        });
    });