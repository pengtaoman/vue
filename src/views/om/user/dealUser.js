/**
 * Created by pengt on 2017/9/18.
 */
define(['axios'],
    function(axios) {

        var isNumber = function(rule, value, callback) {
            value =  _.toNumber(value);
            if (!_.isInteger(value)) {
                callback(new Error('必须填写数字'));
            } else {
                callback();
            }
        };


        return {

            data: function () {

                /** render 中需传入this环境 **/
                var self = this;

                return {
                    formQuery: {
                        city: '',
                        status: '',
                        account: '',
                        name: ''
                    },
                    formUserAdd: {
                        account: '',
                        name: '',
                        pwd: '',
                        phone: '',
                        email: '',
                        channel:'',
                        status:1
                    },
                    statusOptions:[
                        {value:1, label:'激活'},
                        {value:0, label:'废止'}
                    ],
                    modalTitle:'',
                    ruleValidateUserAdd:{
                        name: [
                            { required: true, message: '用户名称不能为空', trigger: 'blur' }
                        ],
                        account: [
                            { required: true, message: '用户ID不能为空', trigger: 'blur' }
                            //,{ validator: isNumber, trigger: 'blur' }
                        ],
                        email: [
                            { required: true, message: 'email不能为空', trigger: 'change' },
                            { type: 'email', message: 'email格式不正确', trigger: 'blur' }
                        ],
                        pwd: [
                            { required: true, message: '密码不能为空', trigger: 'change' }
                            //,{ type: 'number', message: '只能填写数据', trigger: 'blur' }
                        ],
                        phone: [
                            { required: true, message: '联系电话不能为空', trigger: 'blur' }
                            ,{ validator: isNumber, trigger: 'blur' }
                        ]
                    },
                    showUserAdd:false,
                    showResult : false,
                    employeeCol: [
                        {
                            type: 'selection',
                            width: 60,
                            align: 'center'
                        },
                         {
                             "title": "用户账号",
                             width: 140,
                             "key": "account",
                             "sortable": true
                         },
                         {
                             "title": "用户名",
                             width: 140,
                             "key": "name"
                         },
                         {
                             "title": "联系电话",
                             width: 180,
                             "key": "phone"
                         },
                         {
                             "title": "email",
                             width: 200,
                             "key": "email"
                         },
                         {
                             "title": "状态",
                             "key": "status",
                             width: 100,
                             "sortable": true,
                             render: function(h, params) {
                                 //console.log(JSON.stringify(params));
                                 if (params.row.status == '1') {
                                     return h('span','激活')
                                 } else {
                                     return h('span','废止')
                                 }
                             }
                         },
                        {
                            title: '编辑',
                            key: 'action',
                            //width: 200,
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
                                                self.openUpdateUser(params);
                                            }
                                        }
                                    }, '修改'),
                                    // h('Button', {
                                    //     props: {
                                    //         type: 'primary',
                                    //         size: 'small'
                                    //     },
                                    //     style: {
                                    //         marginRight: '5px'
                                    //     },
                                    //     on: {
                                    //         click: function(){
                                    //             self.resetPwd(params);
                                    //         }
                                    //     }
                                    // }, '密码重置'),
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
                                                self.showPointRole(params);
                                            }
                                        }
                                    }, '角色指定')
                                ]);
                            }
                        }
                    ],
                    employeeData: [],
                    showAddUserButton : false,
                    showUpdateUserButton:false,
                    userListTotal : 100,
                    showUserRoleModal:false,
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
                    rolesData: [],
                    checkedUserIds:[],
                    userRoleTitle:'',
                    formUserPwd: {
                        oldPwd: '',
                        newPwd: '',
                        confirmNewPwd: ''
                    },
                    ruleValidateUserPwd:{
                        oldPwd: [
                            { required: true, message: '请输入旧密码', trigger: 'blur' }
                        ],
                        newPwd: [
                            { required: true, message: '请输入新密码', trigger: 'blur' }
                            //,{ validator: isNumber, trigger: 'blur' }
                        ],
                        confirmNewPwd: [
                            { required: true, message: '请确认新密码', trigger: 'blur' }
                        ]
                    },
                    showUserPWDModal:false,
                    roleTotal:0,
                    checkedRoleIds:[]
                }
            }
            , methods: {

                doQuery : function() {

                    var _self = this;
                    this.formQuery.pageNum = 1;
                    this.formQuery.pageSize = 10;
                    axios.get('/sys/users', {params:_self.formQuery}).then(function(res) {
                        _self.showResult = true;
                        _self.userListTotal = res.content.pageCount;
                        _self.employeeData = res.content.results;

                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });
                },
                doReset: function() {
                    this.$refs.formQuery.resetFields();
                },
                openAddUser : function() {
                    this.showUserAdd = true;
                    this.showAddUserButton = true;
                    this.showUpdateUserButton = false;
                    this.modalTitle='自有渠道人员添加';
                },
                addUser : function() {
                    var _self = this;
                    this.$refs.formUserAdd.validate(function(valid) {
                        if (valid) {
                            //console.log('!!!!!!!!! formUserAdd.validate :: ' + valid);
                            //创建用户时，初始化密码为123456
                            _self.formUserAdd.pwd='123456';
                            axios.post('/sys/user',_self.formUserAdd).then(function(res) {
                                console.log(JSON.stringify(res));
                                _self.cancelAddUser();
                                _self.showUserAdd = false;
                                _self.$Modal.success({
                                    title: '人员管理',
                                    content: '自有渠道人员添加成功。'
                                });
                                _self.doQuery();
                            });
                        } else {
                            //console.log('!!!!!!!!! formUserAdd.validate :: ' + valid);
                            return false;
                        }
                    })

                },
                cancelAddUser : function () {
                    this.$refs.formUserAdd.resetFields();
                    this.showUserAdd = false;
                },
                openUpdateUser: function(rowData) {
                    this.showUserAdd = true;
                    this.showAddUserButton = false;
                    this.showUpdateUserButton = true;
                    this.formUserAdd = JSON.parse(JSON.stringify(rowData.row));

                    this.$refs.userModal.rowData = rowData.row;
                    this.modalTitle='自有渠道人员修改';
                },
                updateUser : function() {
                    var _self = this;
                    this.$refs.formUserAdd.validate(function(valid) {
                        if (valid) {
                            axios.put('/sys/user',_self.formUserAdd).then(function(res) {
                                console.log(JSON.stringify(res));

                                _self.showUserAdd = false;
                                _self.$Modal.success({
                                    title: '人员管理',
                                    content: '自有渠道人员修改成功。'
                                });

                                _.forEach(_.keys(_self.$refs.userModal.rowData),function(key) {
                                    _self.$refs.userModal.rowData[key] = _self.formUserAdd[key];
                                });
                                _self.cancelAddUser();
                            });
                        } else {
                            //console.log('!!!!!!!!! formUserAdd.validate :: ' + valid);
                            return false;
                        }
                    })
                },
                activeUser: function(rowData) {

                },
                stopUser: function(rowData) {

                },
                resetPwd: function(rowData) {
                    this.showUserPWDModal = true;
                    this.$refs.userPwdModal.userData = rowData.row;
                },
                changeUserListPage: function(pageNum) {
                    //console.log('!!!!!!!!!!!!! ' + a);
                    var _self = this;
                    this.formQuery.pageNum = pageNum;
                    this.formQuery.pageSize = this.$refs.userPage.pageSize;
                    axios.get('/sys/users', {params : _self.formQuery}).then(function(res) {
                        _self.showResult = true;
                        _self.employeeData = res.content.results;

                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });
                },
                changeUserListPageSize:function (pageSize) {
                    var _self = this;
                    // console.log(this.$refs.rolePage);
                    // console.log('!!!!!!!!!!!!!!!!! ' + this.$refs.rolePage.current);
                    this.$refs.userPage.pageSize = pageSize;
                    _self.formQuery.pageSize = pageSize;
                    var paraPage = JSON.parse(JSON.stringify(_self.formQuery));
                    if (_self.formQuery.pageNum == 1) {
                        axios.get('/sys/users', {params: paraPage}).then(function(res) {
                            _self.showResult = true;
                            _self.employeeData = res.content.results;

                        }).catch(function(err) {
                            //console.log('????????? ' + err)
                        });
                    }
                },
                exportUserList: function() {

                },
                showPointRole : function(row) {
                    //alert(JSON.stringify(row));
                    var _self = this;
                    this.showUserRoleModal = true;
                    if (row.row) {
                        this.userRoleTitle=row.row.name;
                        _self.$refs.roleModal.userId = row.row.id;
                        axios.get('/sys/roles', {params : {pageNum : 1, pageSize:10}}).then(function(res) {
                            var roleData = res.content.results;
                            axios.get('/sys/user/roles/'+_self.$refs.roleModal.userId).then(function(resp) {
                                _self.$refs.roleModal.userRoleIds = _.uniq(resp.content.roleIds);
                                _.forEach(roleData, function(obj){
                                    _.forEach(_self.$refs.roleModal.userRoleIds, function(uobj){
                                        if (obj.id == uobj) {
                                            obj._checked = true;
                                        }
                                    });
                                });
                                _self.rolesData = roleData;
                                _self.roleTotal = res.content.pageCount;
                            });

                        }).catch(function(err) {
                            //console.log('????????? ' + err)
                        });
                    } else {
                        //批量按钮暂时不要了，ui没办法显示
                        // this.userRoleTitle='批量角色指定';
                        // axios.get('/sys/roles', {params : {pageNum : 1, pageSize:10}}).then(function(res) {
                        //     _self.rolesData = res.content.results;
                        //     _self.roleTotal = res.content.pageCount;
                        // }).catch(function(err) {
                        //     //console.log('????????? ' + err)
                        // });
                    }

                },
                changeRoleListPage:function (pageNum) {
                    var _self = this;
                    axios.get('/sys/roles', {params : {pageNum : pageNum, pageSize:10}}).then(function(res) {

                        var roleData = res.content.results;
                        _.forEach(roleData, function(obj){
                            _.forEach(_self.$refs.roleModal.userRoleIds, function(uobj){
                                if (obj.id == uobj) {
                                    obj._checked = true;
                                }
                            });
                        });
                        _self.rolesData = roleData;
                        _self.roleTotal = res.content.pageCount;
                    }).catch(function(err) {
                        //console.log('????????? ' + err)
                    });
                },
                pointRole: function() {
                    var _self = this;
                    if (_self.$refs.roleModal && _self.$refs.roleModal.userId) {
                        var pData = {
                            userId:_self.$refs.roleModal.userId,
                            roleIds:this.checkedRoleIds
                        };
                        axios.post ('/sys/user/role/assignment', pData).then(function(res) {
                            _self.showUserRoleModal = false;
                            _self.$Modal.success({
                                title: '角色指定',
                                content: '角色指定改成功。'
                            });
                        }).catch(function(err) {
                            //console.log('????????? ' + err)
                        });
                    } else {
                        //alert(JSON.stringify(this.checkedUserIds))
                        //alert('批量指定用户角色不要');
                    }

                },
                cancelPointRole: function() {
                    this.showUserRoleModal = false;
                },
                checkUser : function(args) {
                    var _self = this;
                    _.forEach(args,function (obj) {
                        _self.checkedUserIds.push(obj.id);
                    });
                    _self.checkedUserIds = _.uniq(_self.checkedUserIds);
                },
                checkRole: function (args) {
                    var _self = this;
                    _self.checkedRoleIds = [];
                    _.forEach(args,function (obj) {
                        _self.checkedRoleIds.push(obj.id);
                    });
                    _self.checkedRoleIds = _.uniq(_self.checkedRoleIds);
                    _self.$refs.roleModal.userRoleIds = null;
                    _self.$refs.roleModal.userRoleIds = _self.checkedRoleIds;
                },
                updatePwd: function () {
                    var oldData = this.$refs.userPwdModal.userData;

                    //去后台验证旧密码，加密的密码非明文
                    if (this.formUserPwd.oldPwd != oldData.pwd) {
                        this.$Modal.error({
                            title: '输入错误',
                            content: '请输入正确的原密码。'
                        });
                        return false;
                    }
                    if (this.formUserPwd.newPwd != this.formUserPwd.confirmNewPwd) {
                        this.$Modal.error({
                            title: '输入错误',
                            content: '两次输入的新密码不一致。'
                        });
                        return false;
                    }


                },
                cancelUpdatePwd:function () {
                    this.showUserPWDModal = false;
                }

            }
            ,mounted : function() {
                //this.showUserAdd = true;
                this.doQuery();
            }
        }

    });