/**
 * Created by pengt on 2017/9/18.
 */
define([
        'vue',
        '../../../common/js/util/TreeDataConvert',
        'axios'],
    function(Vue, conv,axios) {
        //
        // var isNumber = function(rule, value, callback) {
        //     value =  _.toNumber(value);
        //     if (!_.isInteger(value)) {
        //         callback(new Error('必须填写数字'));
        //     } else {
        //         callback();
        //     }
        // };
        //

        return {

            data: function () {

                /** render 中需传入this环境 **/
                var self = this;

                return {
                    formQuery: {
                        name: '',
                        status: '',
                    },
                    formRoleAdd: {
                        name: '',
                        status: 1,
                        note: ''
                    },
                    statusOptions:[
                        {value:1, label:'激活'},
                        {value:0, label:'未激活'}
                    ],
                    ruleValidateRoleAdd:{
                        name: [
                            { required: true, message: '角色名称不能为空', trigger: 'blur' }
                        ]//,
                        // status: [
                        //     { required: true, message: '状态必选', trigger: 'blur' }
                        // ]
                    },
                    showRoleAdd:false,
                    showResult : false,
                    rolesCol: [
                        {
                            type: 'selection',
                            width: 60,
                            align: 'center'
                        },
                        {
                            "title": "角色名称",
                            width: 120,
                            "key": "name"
                        },
                        {
                            "title": "状态",
                            width: 120,
                            "key": "status",
                            render: function(h, params) {
                                //console.log(JSON.stringify(params));
                                if (params.row.status == '1') {
                                    return h('span','激活')
                                } else {
                                    return h('span','未激活')
                                }

                            }
                        },
                        {
                            "title": "角色说明",
                            "key": "note"
                        },
                        {
                            title: '编辑',
                            key: 'action',
                            width: 240,
                            align: 'center',
                            render: function(h, params) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: function(){
                                                self.openUpdateRole(params);
                                            }
                                        }
                                    }, '修改'),
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: function(){
                                                self.openConfigSingleRoleMenu(params);
                                            }
                                        }
                                    }, '权限调整')
                                ]);
                            }
                        }
                    ],
                    rolesData: [],
                    showAddRoleButton:false,
                    showUpdateRoleButton:false,
                    roleListTotal : 100,

                    showConfigRoleMenu:false,
                    showConfigRoleMenuButton:false,
                    menus : [],

                    rolesDataForMenu: [],
                    rolesColForMenu: [
                        // {
                        //     type: 'selection',
                        //     align: 'center'
                        // },
                        {
                            "title": "角色名称",
                            "key": "name"
                        },
                        {
                            "title": "状态",
                            "key": "status",
                            render: function(h, params) {
                                //console.log(JSON.stringify(params));
                                if (params.row.status == '1') {
                                    return h('span','激活')
                                } else {
                                    return h('span','未激活')
                                }

                            }
                        }
                    ],
                    checkedRoleIds:[],
                    showConfigSingleRoleMenu:false,
                    singleRoleTitle:'',
                    roleTotalForMenu:0,
                    roleName:'',
                    menuTreeChanged:false,
                    menuTreeSingleChanged: false
                }
            }
            , methods: {

                doQuery : function() {

                    var _self = this;
                    this.formQuery.pageNum = 1;
                    this.formQuery.pageSize = 10;
                    axios.get('/sys/roles', {params:_self.formQuery}).then(function(res) {
                        _self.showResult = true;
                        _self.rolesData = res.content.results;
                        _self.roleListTotal = res.content.pageCount;
                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });
                },
                doReset: function() {
                    this.$refs.formQuery.resetFields();
                },
                openAddRole : function() {
                    this.showRoleAdd = true;
                    this.showAddRoleButton = true;
                    this.showUpdateRoleButton = false;
                },
                addRole : function() {
                    var _self = this;
                    this.$refs.formRoleAdd.validate(function(valid) {
                        if (valid) {
                            //console.log('!!!!!!!!! formRoleAdd.validate :: ' + valid);
                            axios.post('/sys/role',_self.formRoleAdd).then(function(res) {
                                console.log(JSON.stringify(res));
                                _self.cancelAddRole();
                                _self.showRoleAdd = false;
                                _self.$Modal.success({
                                    title: '角色管理',
                                    content: '角色添加成功。'
                                });
                                _self.doQuery();
                            });
                        } else {
                            //console.log('!!!!!!!!! formRoleAdd.validate :: ' + valid);
                            return false;
                        }
                    })

                },
                cancelAddRole : function () {
                    this.$refs.formRoleAdd.resetFields();
                    this.showRoleAdd = false;
                },
                openUpdateRole: function(rowData) {
                    this.showRoleAdd = true;
                    this.showAddRoleButton = false;
                    this.showUpdateRoleButton = true;
                    //console.log('!!!!!!!!! openUpdateRole :: ' + JSON.stringify(rowData.row));
                    this.formRoleAdd = JSON.parse(JSON.stringify(rowData.row));
                    this.$refs.roleModal.rowData = rowData.row;
                },
                updateRole : function() {
                    var _self = this;
                    this.$refs.formRoleAdd.validate(function(valid) {
                        if (valid) {
                            axios.put('/sys/role',_self.formRoleAdd).then(function(res) {
                                console.log(JSON.stringify(res));

                                _self.showRoleAdd = false;
                                _self.$Modal.success({
                                    title: '角色管理',
                                    content: '角色修改成功。'
                                });
                                _.forEach(_.keys(_self.$refs.roleModal.rowData),function(key) {
                                    _self.$refs.roleModal.rowData[key] = _self.formRoleAdd[key];
                                });
                                _self.cancelAddRole();
                            });
                        } else {
                            //console.log('!!!!!!!!! formRoleAdd.validate :: ' + valid);
                            return false;
                        }
                    })
                },
                activeRole: function(rowData) {

                },
                stopRole: function(rowData) {

                },
                resetPwd: function(rowData) {

                },
                changeRoleListPage: function(pageNum) {
                    // console.log('!!!!!!!!!!!!! ' + a);
                    var _self = this;
                    this.formQuery.pageNum = pageNum;
                    this.formQuery.pageSize = this.$refs.rolePage.pageSize;
                    axios.get('/sys/roles', {params:_self.formQuery}).then(function(res) {
                        _self.showResult = true;
                        _self.rolesData = res.content.results;

                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });
                },
                changeRoleListPageSize:function (pageSize) {
                    var _self = this;
                    // console.log(this.$refs.rolePage);
                    // console.log('!!!!!!!!!!!!!!!!! ' + this.$refs.rolePage.current);
                    this.$refs.rolePage.pageSize = pageSize;
                    _self.formQuery.pageSize = pageSize;
                    var paraPage = JSON.parse(JSON.stringify(_self.formQuery));
                    if (_self.formQuery.pageNum == 1) {
                        axios.get('/sys/roles', {params: paraPage}).then(function(res) {
                            _self.showResult = true;
                            _self.rolesData = res.content.results;

                        }).catch(function(err) {
                            //console.log('????????? ' + err)
                        });
                    }
                },
                exportUserList: function() {

                },
                changeOp:function() {
                    console.log('!!!!!!!!!!!!!!!!!!!!!!' + this.formRoleAdd.status);
                },
                openConfigRoleMenu: function () {
                    this.showConfigRoleMenu = true;
                    var _self = this;
                    this.formQuery.pageNum = 1;
                    this.formQuery.pageSize = 10;

                    axios.get('/sys/roles', {params:_self.formQuery}).then(function(res) {
                        _self.rolesDataForMenu = res.content.results;
                        _self.roleTotalForMenu = res.content.pageCount;
                        _self.$refs['roleMenuTablePage'].oldPage = 1;
                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });
                },
                clearParentMenu: function (checkedNodes) {
                    var clildMenuChecked = [];
                    //console.log(JSON.stringify(checkedNodes));
                    _.forEach(checkedNodes, function (obj) {
                        if (!obj.children) {
                            clildMenuChecked.push(obj.id)
                        }
                    });
                    //console.log(JSON.stringify(clildMenuChecked));
                    return clildMenuChecked;

                },
                configRoleMenu: function(){
                    var _self = this;

                    var mChecked = this.clearParentMenu(this.$refs.treeMenu.getCheckedNodes());

                    var pData = {roleId: _self.$refs.tableRolesForMenu.currentRoleID,
                        menuIds:mChecked}
                    axios.post('/sys/role/menu/assignment', pData).then(function(res) {
                        _self.$refs.treeMenu.selectedRolesMenu = mChecked;
                        _self.$Modal.success({
                            title: '角色: ' + _self.roleName + ' 权限配置',
                            content: '角色权限配置成功。'
                        });


                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });

                },
                cancelRoleMenu:function() {
                    this.showConfigRoleMenu = false;
                },
                checkedAllMenu: function () {
                    var rM = [];
                    _.forEach(this.menus,function (obj) {
                        if (obj.fParentMenuId == '') {
                            rM.push(obj.id);
                        }
                    })
                    this.$refs.treeMenu.setCheckedKeys(rM);
                },
                resetCheckedAllMenu:function () {
                    // this.$refs.tableRolesForMenu.clearCurrentRow();
                    //console.log(this.$refs.tableRolesForMenu.data[0])
                    //this.$refs.tableRolesForMenu.data[0]._highlight=true;
                    // this.rolesDataForMenu[0]._highlight=true;
                    this.$refs.treeMenu.setCheckedKeys([]);
                },
                checkedAllMenuSingle: function () {
                    var rM = [];
                    _.forEach(this.menus,function (obj) {
                        if (obj.fParentMenuId == '') {
                            rM.push(obj.id);
                        }
                    })
                    this.$refs.treeMenuSingle.setCheckedKeys(rM);
                },
                resetCheckedAllMenuSingle:function () {
                    this.$refs.treeMenuSingle.setCheckedKeys([]);
                },
                checkRole: function (args) {
                    var _self = this;
                    _.forEach(args,function (obj) {
                        _self.checkedRoleIds.push(obj.id);
                    });
                    _self.checkedRoleIds = _.uniq(_self.checkedRoleIds);
                },
                openConfigSingleRoleMenu:function (param) {
                    var _self = this;
                    this.showConfigSingleRoleMenu = true;
                    this.$refs.modalSingleRoleMenu.roleId = param.row.id;
                    this.singleRoleTitle = '角色-'+param.row.name;

                    axios.get('/sys/role/menus/'+ param.row.id).then(function(res) {

                        _self.$refs.treeMenuSingle.selectedRolesMenu = res.content.menuIds;

                        //demos
                        //_self.$refs.treeMenuSingle.selectedRolesMenu = ['8a8asdsdfcasdads511ee9d70f0017'];
                        //
                        _self.$refs.treeMenuSingle.setCheckedKeys(_self.$refs.treeMenuSingle.selectedRolesMenu);
                    });
                },
                configSingleRoleMenu:function () {
                    var _self = this;

                    var mChecked = this.clearParentMenu(this.$refs.treeMenuSingle.getCheckedNodes());

                    var pData = {roleId: this.$refs.modalSingleRoleMenu.roleId, menuIds:mChecked};

                    axios.post('/sys/role/menu/assignment', pData).then(function(res) {
                        _self.showConfigSingleRoleMenu = false;
                        _self.$Modal.success({
                            title: '角色权限配置',
                            content: '角色权限配置成功。'
                        });

                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });
                },
                cancelSingleRoleMenu:function () {
                    this.showConfigSingleRoleMenu = false;
                },
                roleMenuRowClick:function (rowData) {

                    var _self = this;

                    if(!_self.$refs.tableRolesForMenu.currentRoleID ||
                        _.isEqual(_self.$refs.treeMenu.selectedRolesMenu, _self.$refs.treeMenu.getCheckedKeys())) {

                        axios.get('/sys/role/menus/'+rowData.id).then(function(res) {

                            _self.$refs.treeMenu.setCheckedKeys(_.uniq(res.content.menuIds));
                            _self.$refs.tableRolesForMenu.currentRoleID = rowData.id;
                            _self.$refs.treeMenu.selectedRolesMenu = _self.$refs.treeMenu.getCheckedKeys();
                            _self.roleName='_'+rowData.name;

                        }).catch(function(err) {
                            //console.log('????????? ' + err)
                        });
                    } else {

                        if (!_.isEqual(_self.$refs.treeMenu.selectedRolesMenu, _self.$refs.treeMenu.getCheckedKeys())) {

                            this.$Modal.confirm({
                                    title: '确认提示',
                                    width: 480,
                                    content: '<p>您已经修改了角色:'+_self.roleName+
                                        ' 的权限，并未保存,</p><p>点击"确定"按钮离开，将不保存本次修改内容</p>',
                                    onOk: function() {
                                        axios.get('/sys/role/menus/'+rowData.id).then(function(res) {

                                            _self.$refs.treeMenu.setCheckedKeys(_.uniq(res.content.menuIds));
                                            _self.$refs.tableRolesForMenu.currentRoleID = rowData.id;
                                            _self.$refs.treeMenu.selectedRolesMenu = _self.$refs.treeMenu.getCheckedKeys();
                                            _self.roleName='_'+rowData.name;

                                        }).catch(function(err) {
                                            //console.log('????????? ' + err)
                                        });
                                    },
                                    onCancel: function() {
                                        _self.$refs.tableRolesForMenu.clearCurrentRow();

                                        _.forEach(_self.$refs.tableRolesForMenu.objData,function (obj) {
                                           if (obj.id == _self.$refs.tableRolesForMenu.currentRoleID) {
                                               obj._isHighlight=true;
                                               return false;
                                           }
                                        });
                                        return false;
                                    }
                            });
                        }
                    }

                },
                changeRoleListPageForMenu:function (pageNum) {
                    var _self = this;
                    console.log(_self.$refs.roleMenuTablePage);
                    if(_self.$refs.tableRolesForMenu.currentRoleID
                            && _self.$refs.treeMenu.selectedRolesMenu != []
                            && _.difference(_self.$refs.treeMenu.selectedRolesMenu,
                            _self.clearParentMenu(_self.$refs.treeMenu.getCheckedNodes())) != []) {

                        var cPage = _self.$refs.roleMenuTablePage.current;
                        this.$Modal.confirm({
                            title: '确认提示',
                            width: 680,
                            content: '<p>您已经修改了角色:'+_self.roleName+
                            ' 的权限，并未保存.</p><p>请点击"设置角色菜单"按钮以保存修改结果.</p>'+
                            '<p>离开将不保存本次修改，确定离开请点击"确定"按钮.</p>',
                            onOk: function() {
                                axios.get('/sys/roles', {params : {pageNum : pageNum, pageSize:10}}).then(function(res) {
                                    _self.rolesDataForMenu = res.content.results;
                                    _self.roleTotalForMenu = res.content.pageCount;
                                    _self.$refs['roleMenuTablePage'].oldPage = pageNum;
                                    _self.resetCheckedAllMenu();
                                    _self.$refs.tableRolesForMenu.currentRoleID='';
                                }).catch(function(err) {
                                    //console.log('????????? ' + err)
                                });
                            },
                            onCancel: function() {
                                _self.$refs.tableRolesForMenu.clearCurrentRow();
                                _self.$refs.roleMenuTablePage.currentPage = _self.$refs['roleMenuTablePage'].oldPage;
                                _.forEach(_self.$refs.tableRolesForMenu.objData,function (obj) {
                                    if (obj.id == _self.$refs.tableRolesForMenu.currentRoleID) {
                                        obj._isHighlight=true;
                                        return false;
                                    }
                                });

                                return false;
                            }
                        });
                        //

                        return false;
                    } else {
                        axios.get('/sys/roles', {params : {pageNum : pageNum, pageSize:10}}).then(function(res) {
                            _self.rolesDataForMenu = res.content.results;
                            _self.roleTotalForMenu = res.content.pageCount;
                            _self.$refs['roleMenuTablePage'].oldPage = pageNum;
                            _self.resetCheckedAllMenu();
                            _self.$refs.tableRolesForMenu.currentRoleID='';
                        }).catch(function(err) {
                            //console.log('????????? ' + err)
                        });
                    }


                },
                tableRolesForMenuSA:function () {
                    console.log(this.$refs.tableRolesForMenu);
                },
                checkTreeMenu:function (data,isChecked,isChildChecked) {
                    var _self = this;
                    if(!_self.$refs.tableRolesForMenu.currentRoleID && isChecked) {
                        _self.resetCheckedAllMenu();
                        this.$Modal.error({
                            title: '操作错误',
                            content: '请选择一个角色'
                        });
                        return false;
                    }
                }

            }
            ,mounted : function() {
                // this.showRoleAdd = true;
                // this.formRoleAdd.status = 1;
                //document.cookie = "name1111=oeschger";
                this.$nextTick(function() {
                    var _vm = this;

                    var menusS = VueIn.$store.state.menuDataForDealMenu;

                    if (!VueIn.$store.state.menuDataForDealMenu
                        || _.isEmpty(VueIn.$store.state.menuDataForDealMenu)) {
                        var url = VueIn.$store.state.getMenuUrlForDealMenu;
                        axios.get(url).then(function(response) {
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
                            _vm.$store.commit('pushMenuDataForDealMenu', res);
                            _vm.$store.commit('pushPriMenuDataForDealMenu', response.content);
                            _vm.menus = _vm.$store.state.menuDataForDealMenu;

                        });
                    } else {
                        this.menus = VueIn.$store.state.menuDataForDealMenu;
                    }

                    _vm.defaultProps = {
                        children: 'children',
                        label: 'fMenuName'
                    };

                    _vm.doQuery();


                });
            }
        }

    });
