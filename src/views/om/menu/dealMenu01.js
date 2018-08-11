/**
 * Created by pengt on 2017/9/18.
 */
define([], function() {
    return {
        data : function() {
            return {
                name : ' :: DealEmployee NAME :: '
            }
        },
        methods : {
            cli : function() {
                alert('CLI DealEmployee !!!!!sdsdsdsd!!!!!');
            }
        },
        mounted : function() {
            this.$store.commit('setHeader', '系统功能');
        }
    };
});