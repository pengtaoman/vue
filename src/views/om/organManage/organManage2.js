define(['axios','text!./organManage.st','../../common/js/component/tree-table'],function (axios,st) {
return{
    data:function () {
        return{
            orgs:[],
            input:'',
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
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
            formLabelWidth: '120px',
            pickerOptions0: function(){
                return {
                    disabledDate:function(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                }
            }
        }
    } ,
    methods:{
            remote: function (row, callback) {
                setTimeout(function () {
                    callback(row.children)
                }, 500)
            },
            formatter: function (row, column) {
                return ' ---  ' + row.label;
            },
            update: function (id) {
                alert(id);
            },
            insert: function () {
/*                var parms=JSON.stringify(this.form);*/
                axios.post('http://localhost:8080/mvc/main/addOrganization',
                        JSON.stringify(this.form),
                    {headers: {"Content-Type": "application/json"}, responseType: 'json'}
                ).then(function () {
                    alert("成功")
                }).catch(function () {
                    alert("失败")
                })
            }

    },
    mounted:function () {
        $("#dis").append(st);
        this.$nextTick(function(){
            var _vm = this;
            axios.post('http://localhost:8080/mvc/main/getOrganization').then(function(list){
                _.forEach(list.data, function(obj) {
                   console.log('---------------------------' + obj.fOrganName);
                    //  obj.fOrganNamefk=obj.fOrganName;
                });
                _vm.orgs=list.data
                console.log(list.data)
            })
        })


    }
}
})
/*
{
    "fOrganName":this.form.fOrganName,
    "fOrganStatus":this.form.fOrganStatus,
    "fOrganKind":this.form.fOrganKind,
    "omAreaT":this.form.omAreaT,
    "fInnerDuty":this.form.fInnerDuty,
    "fPrincipal":this.form.fPrincipal,
    "fInactiveDate":this.form.fInactiveDate,
    "fOrder":this.form.fOrder,
    "fCityCode":this.form.fCityCode,
    "fDutyParent":this.form.fDutyParent,
    "fOrganDesc":this.form.fOrganDesc
}*/
