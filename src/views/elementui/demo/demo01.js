/**
 * Created by pengt on 2017/10/12.
 */

define([], function() {

    return {
        data : function() {
            return {
                radio: '2'
            };
        },methods : {
            show : function() {
                alert('demo----show :: ' + this.radio);
            }
        }
    };
});