/**
 * Created by pengt on 2017/10/13.
 */
define(['text!./template/menu_item_a.html','vue', 'axios'], function(templateHtml, Vue, axios) {

    $('head').append(templateHtml);

    Vue.component('menu_item', {
        template: '#menuitem-template'
        ,props: {
            model: Object
        }
        ,computed: {
            isRootOrCh: function () {
                if (this.model.name === 'root') {
                    return 'root';
                } else {
                    return 'mu';
                }
            }
        }
        ,data: function () {
            if (this.model) {
                return {
                    pmenu: this.model
                }
            } else {
                return {
                    pmenu : {}
                }
            }
        },
        mounted : function() {
            this.$nextTick(function() {
                // console.log('mmMMMMMMMMMMMMM ' + JSON.stringify(this.pmenu));
            })
        }
    });
});