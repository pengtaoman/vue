/**
 * Created by pengt on 2017/10/20.
 */
/**
 * Created by pengt on 2017/10/12.
 */
define(['text!./template/page_header_a.html','axios'], function(templateHtml,axios) {
    //JWT令牌设置
    var TOKEN_KEY = 'jwtTokenForVueRequire';
    return {
        template: templateHtml,
        data : function() {
            return {
                logoUrl : basePath + '/index_a.html',
                logUser : '',
                showUserPWDModal:false,
                formUserPwd: {
                    originPwd: '',
                    password: '',
                    confirmPassword: ''
                },
                ruleValidateUserPwd:{
                    originPwd: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                        //,{ validator: isNumber, trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { required: true, message: '请确认新密码', trigger: 'blur' }
                    ]
                },
            }
        },
        mounted: function(){
            this.$nextTick(function(){
                var decoded = jwt_decode(localStorage.getItem(TOKEN_KEY));
                console.log(decoded);
                this.logUser = decoded.name;
            })
        },
        methods : {
            toggleClick : function() {

            },
            doLogout:function () {
                localStorage.removeItem(TOKEN_KEY);
                location.href = basePath + '/login.html'
            },
            showUpdatePwd:function () {
                this.showUserPWDModal = true;
            },
            updatePwd:function () {
                var _self = this;
                this.$refs.formUserPwd.validate(function(valid) {

                    if (valid) {
                        if (_self.formUserPwd.password != _self.formUserPwd.confirmPassword) {
                            _self.$Modal.success({
                                title: '输入错误',
                                content: '新密码与确认密码不一致'
                            });
                            return false;
                        }
                        axios.post('/sys/user/password', _self.formUserPwd).then(function (res) {
                            _self.showUserPWDModal = false;
                            _self.$Modal.success({
                                title: '密码修改',
                                content: '密码修改成功。'
                            });
                            _self.formUserPwd.originPwd='';
                            _self.formUserPwd.password='';
                            _self.formUserPwd.confirmPassword='';
                        }).catch(function(err) {
                            //console.log('????????? ' + err)
                        });
                    }
                });
            },
            cancelUpdatePwd:function () {
                this.showUserPWDModal = false;
                this.formUserPwd.originPwd='';
                this.formUserPwd.password='';
                this.formUserPwd.confirmPassword='';
            }
            
        }
    };
});