/**
 * Created by pengt on 2017/9/18.
 */
// define([basePath+'/node_modules/@riophae/vue-treeselect/dist/vue-treeselect.min.js'],
//     function(selectTree) {
define([basePath+'/node_modules/@riophae/vue-treeselect/dist/vue-treeselect.min.js',
        'text!'+basePath+'/node_modules/@riophae/vue-treeselect/dist/vue-treeselect.min.css',
        'vue','axios'],
    function(vueTreeselect,vueTreeselectcss, Vue, axios) {


        var treeSel = Vue.extend(vueTreeselect.Treeselect);
        Vue.component('treeselect',treeSel);

        return {
            data : function() {
                return {
                    menus2 : [],
                    defaultProps: {
                        children: 'children',
                        label: 'fOrganName'
                    }
                    ,disableAddButton: false
                    ,disableDelButton: false
                    ,disableUpButton: false
                    ,display:'none',
                    dialogFormVisible: false,
                    formLabelWidth: '120px'
                    ,omAreaT:{
                        fAreaId:''
                    }
                    ,form: {
                        fOrganId:'',
                        fParentOrganId:'',
                        fOrganName:'',
                        fOrganStatus:'',
                        fOrganKind:'',
                        omAreaT:'',
                        fInnerDuty:'',
                        fPrincipal:'',
                        fInactiveDate:'',
                        fOrder:'',
                        fCityCode:'',
                        fDutyParent:'',
                        fOrganDesc:''
                    }
                    ,childform: {
                        fOrganId:'',
                        fParentOrganId:'',
                        fOrganName:'',
                        fOrganStatus:'',
                        fOrganKind:'',
                        omAreaT:'',
                        fInnerDuty:'',
                        fPrincipal:'',
                        fInactiveDate:'',
                        fOrder:'',
                        fCityCode:'',
                        fDutyParent:'',
                        fOrganDesc:''
                    },
                    pickerOptions0: function(){
                        return {
                            disabledDate:function(time) {
                                return time.getTime() < Date.now() - 8.64e7;
                            }
                        }
                    }
                    }
                },
/*            computed: {
                treemenus: function () {
                    return this.menus2;
                }
            },*/
            methods : {
                handleNodeClick : function(data) {
                    //alert('CLI DealEmployee !!!!!sdsdsdsd!!!!!');
                    console.log('::::::::::::::::::  ' + JSON.stringify(data));
                    if(data.fOrganId!=null){
                        $('#menuForm').show();
                        $('#menuForm2').hide();
                    }else{
                        $('#menuForm').hide();
                        $('#menuForm2').show();
                    }
                    this.form.fOrganId=data.fOrganId;
                    this.form.fOrganName=data.fOrganName;
                    this.form.fOrganStatus=data.fOrganStatus;
                    this.form.fOrganKind=data.fOrganKind;
                    //需要改，此时的区域应该也应是后台查询出来的
                    this.omAreaT.fAreaId=data.omAreaT.fAreaId
                    this.form.omAreaT=this.omAreaT.fAreaId;
                    //
                    this.form.fInnerDuty=data.fInnerDuty;
                    this.form.fPrincipal=data.fPrincipal;
                    this.form.fInactiveDate=this.parserDate(data.fInactiveDate);
                    this.form.fOrder=data.fOrder;
                    this.form.fCityCode=data.fCityCode;
                    this.form.fDutyParent=data.fDutyParent;
                    this.form.fOrganDesc=data.fOrganDesc;
                },
//用来格式化日期
                parserDate: function (date) {
                    var t = Date.parse(date);
                    if (!isNaN(t)) {
                        return new Date(Date.parse(date.replace(/-/g, "/")));
                    } else {

                    }
                },
                insert: function () {
                    /!*                var parms=JSON.stringify(this.form);*!/
                    this.childform.fParentOrganId=this.form.fOrganId;
                    axios.post('http://localhost:8080/mvc/main/addOrganization',
                        JSON.stringify(this.childform),
                        {headers: {"Content-Type": "application/json"}, responseType: 'json'}
                    ).then(function () {
                        alert("成功")
                    }).catch(function () {
                        alert("失败")
                    })
                },
                deleteOrganization: function () {
                  axios.post('http://localhost:8080/mvc/main/deleteOrganization',
                      JSON.stringify(this.form),
                      {headers: {"Content-Type": "application/json"}, responseType: 'json'}
                      ).then(function () {
                      alert("成功")
                  }).catch(function () {
                      alert("失败")
                  })
                },
                updateOrganization:function () {
                    axios.post('http://localhost:8080/mvc/main/updateOrganization',
                        JSON.stringify(this.form),
                        {headers: {"Content-Type": "application/json"}, responseType: 'json'}
                    ).then(function () {
                        alert("成功")
                    }).catch(function () {
                        alert("失败")
                    })
                }
                //用于重新渲染树形菜单
/*                jianting:function () {
                    var _vm = this;
                    axios.post('http://localhost:8080/mvc/main/getOrganization').then(function(response){
                        require([basePath + '/common/js/util/TreeDataConvert.js'], function(conv) {
                            console.log(response.data)
                            var res = _.cloneDeep(response.data);

                            _.forEach(res, function (obj) {
                                obj.name = obj.fOrganName;
                            });
                            console.log("====")
                            res = conv.convert(res, 'fOrganId', 'fParentOrganId','');
                            console.log(res)
                            var a={};
                            a.fOrganName="组织结构管理";
                            a.children=res;
                            var test=[a];
                            _vm.menus2 = test;

                        });
                    })
                    _vm.defaultProps = {
                        children: 'children',
                        label: 'fOrganName'
                    };
                }*/
    }
            ,mounted : function() {

                $('#menuForm').hide();
                $('#menuForm2').hide();
                this.$nextTick(function() {

                    vueTreeselectcss = '<style>' + vueTreeselectcss + '</style>';
                    $('#st').append(vueTreeselectcss);

                    var _vm = this;
                    axios.post('http://localhost:8080/mvc/main/getOrganization').then(function(response){
                        require([basePath + '/common/js/util/TreeDataConvert.js'], function(conv) {
                            console.log(response.data)
                            var res = _.cloneDeep(response.data);

                            _.forEach(res, function (obj) {
                                obj.name = obj.fOrganName;
                            });
                            console.log("====")
                            res = conv.convert(res, 'fOrganId', 'fParentOrganId','');
                            console.log(res)
                            var a={};
                            a.fOrganName="组织结构管理";
                            a.children=res;
                            var test=[a];
                            _vm.menus2 = test;

                        });
                    })
                    _vm.defaultProps = {
                        children: 'children',
                        label: 'fOrganName'
                    };
                });
           }
        };
});