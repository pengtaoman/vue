/**
 * Created by wangj on 2017/12/13
 */
define([],function() {

        return {
            data:function() {
                return {
                    tableData: [],
                    form: {
                        name: '张三',
                        va: '210221198708277656',
                        area: '石家庄',
                        level: '4',
                        group:'大客户',
                        label:''
                    },
                    form1: {
                        prodoffername: ''
                    },
                    form2: {
                        prodoffername: '',
                        prodofferinfos: '',
                        prodofferflow: ''
                    },
                    loading: false,
                    gridProdOfferData:[],
                    dialogTableVisible:false,
                    radio: 1,
                    radio1: 1,
                    radio2: 1,
                    active: 0,
                    activeName: 'first'
                };
            },
            methods: {
                next:function() {
                    if (this.active++ > 2) this.active = 0;
                },
                reNext:function(){
                    if (this.active-- < 0) this.active = 0;
                },handleClick:function(tab, event) {
                    console.log(tab, event);
                },onSubmit:function(){
                    this.loading = true;
                    console.log('============ dialog:: '+this.form1.prodoffername);
                    this.gridProdOfferData = [{
                        prodoffername: '套餐1',
                        prodofferinfos: '预存598元，赠送宽带费用300元，月转25元，手机低消40元从次月开始执行，同停同复，合账消费，协议期12个月；协议期内不能办理退网、停机业务，费用不退不转。\n',
                        prodofferflow: '不清零'
                    }, {
                        prodoffername: '套餐2',
                        prodofferinfos: '套餐内容2',
                        prodofferflow: '不清零'
                    }, {
                        prodoffername: '套餐3',
                        prodofferinfos: '套餐内容3',
                        prodofferflow: '清零'
                    }, {
                        prodoffername: '套餐4',
                        prodofferinfos: '套餐内容4',
                        prodofferflow: '清零'
                    }]
                        this.dialogTableVisible=true;
                        this.loading = false;
                },
                handleClick:function(row) {
                    console.log(row);
                }
            }
            ,mounted : function() {

                this.$nextTick(function() {
                    var _vm = this;
                    _vm.tableData = [{
                        date: '2016-05-03',
                        name: '王小虎',
                        province: '上海',
                        city: '普陀区',
                        address: '上海市普陀区金沙江路 1518 弄',
                        zip: 200333
                    }, {
                        date: '2016-05-02',
                        name: '王小虎',
                        province: '上海',
                        city: '普陀区',
                        address: '上海市普陀区金沙江路 1518 弄',
                        zip: 200333
                    }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        province: '上海',
                        city: '普陀区',
                        address: '上海市普陀区金沙江路 1518 弄',
                        zip: 200333
                    }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        province: '上海',
                        city: '普陀区',
                        address: '上海市普陀区金沙江路 1518 弄',
                        zip: 200333
                    }];
                });
            }

        }

    });