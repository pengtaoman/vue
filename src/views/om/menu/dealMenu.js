/**
 * Created by pengt on 2017/9/18.
 */
define(['../../../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.min',
        'text!../../../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.min.css',
        'vue',
        '../../../common/js/util/SelectTreeDataConvert',
        '../../../common/js/util/TreeDataConvert',
        'axios'],
    function(vueTreeselect,vueTreeselectcss, Vue, stCon, conv, axios) {


        var tcCom = Vue.component('treeselect',vueTreeselect.Treeselect);


        var isChanged = function (initData, currData) {
            var isChanged = false;
            var kys = _.keys(currData);
            _.forEach(kys, function(ky) {
                //console.log('<><><><> ' + ky + "::" + initData[ky] + " ---- " + currData[ky]);
                var initValue = initData[ky];
                if (typeof(initValue) == 'boolean') {
                    initValue = initValue ? 1 : 0;
                }
                if (currData[ky] != undefined && currData[ky] != "undefined" && currData[ky] != initValue) {
                    isChanged = true;
                    return false;
                } else {
                }
            });
            return isChanged;
        };
        return {
            data : function() {
                return {
                    menus:[],
                    iconOptions :this.$store.state.faIconsOption,
                    defaultProps: {
                        children: 'children',
                        label: 'fMenuName'
                    }
                    ,highlightMenu:true
                    ,updateStatus: 0
                    ,addButtonName:'添加下级菜单'
                    ,addBtnFlag:0 //0 什么都没点  1 修改中 2 点击了添加
                    ,treeSelectId:0
                    ,treeSelectDisable:false
                    ,form: {
                        id:'',
                        fMenuId:'',
                        fMenuName: '',
                        fPageLink: '',
                        fInuse:'0',
                        fParentMenuId:'',
                        fOrder:1,
                        icon: ''
                    },
                    menuRoleTitle:'',
                    showMenuRoleModal:false,
                    rolesColForMenu: [
                        {
                            type: 'selection',
                            align: 'center'
                        },
                        {
                            "title": "角色名称",
                            "key": "name"
                        },
                        {
                            "title": "状态",
                            "key": "status"
                        }
                    ],
                    rulesMenuForm: {
                        fMenuName: [
                            { required: true, message: '请输入活动名称', trigger: 'blur' }
                        ]
                    },
                    rolesData:[],
                    checkedRoleIds:[],
                    pageLinkDisable:false
                }
            },
            created: function () {
                console.log('!!!!!!!!!! Created !!!!!!!!!!!!!!!');
            },
            methods : {
                handleNodeClick : function(nodeData) {

                    var _vm = this;
                    if (this.$refs.form.currentMenuId == nodeData.fMenuId) {
                        return false;
                    }

                    if (_vm.updateStatus != 0) {
                        this.$Modal.confirm({
                            title: '确认提示',
                            width: 680,
                            content: '<p>您正在修改或添加菜单:'+_vm.oldMenuData.fMenuName+
                            ' ，并未保存.'+
                            '<p>离开将不保存本次修改，确定离开请点击"确定"按钮,否则请点击"取消".</p>',
                            onOk: function() {
                                _vm.treeMenuClickInit(nodeData);
                            },
                            onCancel: function() {
                                _vm.highlightMenu = false;

                                return false;
                            }
                        });
                    } else {
                        _vm.treeMenuClickInit(nodeData);
                    }


                },
                treeMenuClickInit: function (nodeData) {
                    var _vm = this;

                    _vm.highlightMenu = true;
                    _vm.updateStatus = 0;

                    var haveParent = false;
                    _.forEach(_vm.$store.state.priMenuDataForDealMenu, function (obj) {
                       if (nodeData.fParentMenuId != '' && obj.fMenuId == nodeData.fParentMenuId) {
                           _vm.treeSelectId = obj.id;
                           haveParent = true;
                           return false;
                       }
                    });
                    if (!haveParent) {
                        _vm.treeSelectId = '';
                    }

                    _vm.form.id = nodeData.id;
                    _vm.form.fParentMenuId = nodeData.fParentMenuId;
                    _vm.form.fMenuId = nodeData.fMenuId;
                    _vm.form.fMenuName = nodeData.fMenuName;
                    _vm.form.fPageLink = nodeData.fPageLink=='undefined'?'':nodeData.fPageLink;
                    _vm.form.icon = nodeData.icon;
                    _vm.form.fOrder = nodeData.fOrder;
                    _vm.treeSelectDisable = true;

                    if (nodeData.fInuse) {
                        _vm.form.fInuse = ''+nodeData.fInuse;
                        nodeData.fInuse = _vm.form.fInuse;
                    } else {
                        _vm.form.fInuse = '0';
                        nodeData.fInuse = '0';
                    }

                    $('#menuForm').show();

                    _vm.oldMenuData = nodeData;
                    _vm.oldMenuTreeNode =  _vm.$refs.treeMenu.currentNode;
                },
                loadSelectTreeOptions: function(cb) {

                    var _vm = this;
                    setTimeout(function(){
                        cb(null,_vm.menus);
                    }, 800);
                    _vm.CB = cb;
                }
                ,selectParentMenu : function() {
                    var _vm = this;
                    if (_vm.treeSelectId) {
                        _.forEach(_vm.$store.state.priMenuDataForDealMenu,function (obj) {
                            if (obj.id == _vm.treeSelectId) {
                                _vm.form.fParentMenuId = obj.fMenuId;
                                return false;
                            }
                        });
                    } else {
                        _vm.form.fParentMenuId = '';
                    }
                },
                checkInput:function() {
                    var _vm = this;
                    _vm.selectParentMenu();
                    if (this.form.fMenuId == this.form.fParentMenuId ) {
                        this.$Modal.error({
                            title: '输入错误',
                            content: '上级菜单不能与操作菜单相同'
                        });
                        return false;
                    }
                    if (!this.form.fMenuName) {
                        this.$Modal.error({
                            title: '输入错误',
                            content: '请输入菜单名称'
                        });
                        return false;
                    }
                    if (!this.form.fPageLink) {
                        this.$Modal.error({
                            title: '输入错误',
                            content: '请输入菜单路径'
                        });
                        return false;
                    }
                    return true;
                },
                refreshMenu:function (initPage) {
                    var _vm = this;

                    var url = VueIn.$store.state.getMenuUrlForDealMenu;
                    return axios.get(url).then(function(response) {
                        _.forEach(response.content,function(obj){
                            obj.label = obj.fMenuName;
                        });
                        var res = _.cloneDeep(response.content);
                        _.forEach(res, function (obj) {
                            obj.name = obj.fMenuName;
                            if (obj.fPageLink) {
                                obj.fPageLink = ""+obj.fPageLink;
                            } else {
                                obj.fPageLink = "";
                            }
                        });
                        res = conv.convert(res, 'fMenuId', 'fParentMenuId', '');
                        _vm.init_menus = res;
                        _vm.$store.commit('pushMenuDataForDealMenu', res);
                        _vm.$store.commit('pushPriMenuDataForDealMenu', response.content);
                        _vm.menus = _vm.$store.state.menuDataForDealMenu;

                        if (!initPage) {_vm.loadSelectTreeOptions(_vm.CB);}

                    });
                },
                openRolePoint:function () {
                    this.showMenuRoleModal = true;
                    this.menuRoleTitle=this.form.fMenuName;
                    var _self = this;

                    axios.get('/sys/roles', {params : {menuId : this.form.fMenuId}}).then(function(res) {
                        _self.rolesData = res.content.results;
                        _self.$refs.roleModal.menuId = _self.form.fMenuId;
                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });
                },
                pointRole: function() {
                    var _self = this;
                    if (_self.$refs.roleModal && _self.$refs.roleModal.userId) {
                        var pData = {
                            userId:_self.$refs.roleModal.userId,
                            roleIds:[]
                        };
                        _.forEach(this.checkedRoleIds, function(ro){
                            pData.roleIds.push(ro.id);
                        });

                    }

                },
                cancelPointRole: function() {
                    this.showMenuRoleModal = false;
                },

                checkRole: function (args) {
                    this.checkedRoleIds = null;
                    this.checkedRoleIds = args;
                },
                isParentChange: function (arg) {
                    if (arg == '1') {
                        this.form.fPageLink = '';
                    } else {
                        if (this.updateStatus == 2) {

                        } else {
                            this.form.fPageLink = this.oldMenuData.fPageLink;
                        }
                    }
                },
                showNewMenu : function() {
                    var _vm = this;
                    if (!_vm.highlightMenu){
                        this.$Modal.error({
                            title: '操作错误',
                            content: '请选择在左侧菜单树选择菜单'
                        });
                        return false;
                    }

                    var curNode = _vm.$refs.treeMenu.currentNode;
                    if(curNode.node.data.fParentMenuId) {
                        _vm.treeSelectDisable = false;
                    } else {
                        _vm.treeSelectDisable = true;
                    }

                    _.forEach(_vm.$store.state.priMenuDataForDealMenu,function (obj) {
                        if (obj.fMenuId == curNode.node.data.fMenuId) {
                            _vm.treeSelectId = obj.id;
                            return false;
                        }
                    });

                    _vm.form.fParentMenuId = curNode.node.data.fMenuId;

                    _vm.form.fMenuName = '';
                    _vm.form.fInuse = '0';
                    _vm.form.icon = '';
                    _vm.form.fPageLink = '';
                    _vm.updateStatus = 2;

                    var uuid = UUID.generate();
                    if(!_vm.treeSelectId) {
                        _vm.form.fParentMenuId='';
                    }
                    _vm.form.fMenuId = _.replace(uuid, /-/g, '');

                },
                showUpdate:function () {
                    var _vm = this;
                    if (!_vm.highlightMenu){
                        this.$Modal.error({
                            title: '操作错误',
                            content: '请选择在左侧菜单树选择菜单'
                        });
                        return false;
                    }
                    var curNode = _vm.$refs.treeMenu.currentNode;
                    if(curNode.node.data.fParentMenuId) {
                        _vm.treeSelectDisable = false;
                    } else {
                        _vm.treeSelectDisable = true;
                    }
                    _vm.updateStatus = 1;
                },
                doUpdate:function () {
                    var _vm = this;
                    if (this.checkInput()) {
                        axios.put('/sys/menu', _vm.form).then(function (res) {
                            _vm.refreshMenu();
                            _vm.$Modal.success({
                                title: '菜单修改',
                                content: '菜单修改成功。'
                            });

                            _vm.oldMenuData = _vm.form;
                            _vm.updateStatus = 0;

                        }).catch(function (err) {
                            //console.log('????????? ' + err)
                        });
                    }
                },
                doDeleteMenu:function () {
                    var _vm = this;
                    if (!_vm.highlightMenu){
                        this.$Modal.error({
                            title: '操作错误',
                            content: '请选择在左侧菜单树选择菜单'
                        });
                        return false;
                    }

                    this.$Modal.confirm({
                        title: '确认提示',
                        width: 680,
                        content: '<p>确定要删除菜单:'+_vm.oldMenuData.fMenuName+
                        ' 么？'+
                        '<p></p>',
                        onOk: function() {
                            axios.delete('/sys/menu/'+_vm.form.id).then(function(res) {
                                _vm.refreshMenu().then(function(res){
                                    _vm.$Modal.success({
                                        title: '菜单删除',
                                        content: '菜单删除成功。'
                                    });
                                });
                                _vm.form.fParentMenuId = '';
                                _vm.form.fMenuName = '';
                                _vm.form.fInuse = '0';
                                _vm.form.icon = '';
                                _vm.form.fPageLink = '';
                                _vm.updateStatus = 0;
                                _vm.highlightMenu = false;

                            }).catch(function(err) {
                                //console.log('????????? ' + err)
                            });
                        },
                        onCancel: function() {
                            return false;
                        }
                    });


                },
                doAddNewMenu:function () {
                    var _vm = this;
                    if (this.checkInput()) {
                        axios.post('/sys/menu', _vm.form).then(function(res) {
                            _vm.refreshMenu();
                            _vm.$Modal.success({
                                title: '菜单添加',
                                content: '菜单添加成功。'
                            });

                            _vm.oldMenuData = _vm.form;
                            _vm.highlightMenu = false;
                            _vm.updateStatus = 0;

                        }).catch(function(err) {
                            //console.log('????????? ' + err)
                        });
                    }

                },
                cancelAddNewMenu:function () {
                    var _vm = this;
                    _vm.form.fParentMenuId = _vm.oldMenuData.fParentMenuId;
                    _vm.form.fMenuName =  _vm.oldMenuData.fMenuName;
                    _vm.form.fInuse =  _vm.oldMenuData.fInuse;
                    _vm.form.icon =  _vm.oldMenuData.icon;
                    _vm.form.fPageLink =  _vm.oldMenuData.fPageLink;
                    _vm.updateStatus = 0;
                },
                cancleUpButton:function () {
                    var _vm = this;
                    var kys = _.keys(_vm.form);
                    _.forEach(kys, function(ky) {
                        _vm.form[ky] = _vm.oldMenuData[ky];
                    });
                    _vm.updateStatus = 0;
                },
            }
            ,mounted : function() {

                $('#menuForm').hide();

                this.$nextTick(function() {
                    var _vm = this;
                    vueTreeselectcss = '<style>' + vueTreeselectcss +  '</style>';
                    $('#st').append(vueTreeselectcss);
                    if (!VueIn.$store.state.menuDataForDealMenu
                            || _.isEmpty(VueIn.$store.state.menuDataForDealMenu)) {
                        console.log('!!!!!!!!! menuData empty !!!!!');
                        this.refreshMenu(1);
                    } else {
                        console.log('--------- menuData exist -----');
                        this.menus = VueIn.$store.state.menuDataForDealMenu;
                    }
                });
           }
        };
});
