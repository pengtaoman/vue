// /**
//  * Created by pengt on 2017/12/20.
//  */
//
// import elasticsearch from 'elasticsearch-browser';
//
// let esClient =  new elasticsearch.Client({
//     host: '10.4.121.90:9200', //服务 IP 和端口
//     log: 'error' //输出详细的调试信息
// });
//
// class esUtil {
//     static searchOcContent(queryStr, otherArgs) {
//
//         var queryParam = {};
//         queryParam.index = 'oc_content';
//         queryParam.body = {};
//         queryParam.body.query = {};
//         queryParam.body.query.bool = {};
//         queryParam.body.query.bool.must = [];
//
//         //queryParam.body.query.analyzer = "ik_max_word";
//         var matchContent = {
//             "match_phrase" : {
//                 "data_content" : queryStr
//             }
//         };
//
//         // var matchContent = {
//         //     "query_string" : {
//         //         "default_field":"_all",
//         //         "query":queryStr
//         //     }
//         // };
//         queryParam.body.query.bool.must.push(matchContent);
//
//         if (otherArgs && otherArgs.highlightPre && otherArgs.highlightPost) {
//             queryParam.body.highlight = {
//                 "fields": {
//                     "data_content": {
//                         "pre_tags": otherArgs.highlightPre,
//                         "post_tags": otherArgs.highlightPost
//                     }
//                 }
//             };
//         }
//
//         if (otherArgs && otherArgs.currentPage && otherArgs.pageSize) {
//             var currentPage = otherArgs.currentPage;
//             queryParam.size = otherArgs.pageSize;
//             queryParam.from = (currentPage - 1) * otherArgs.pageSize;
//         }
//
//         return esClient.search(queryParam).then(function (resp) {
//             console.log("######### ELASTIC RES :: " + JSON.stringify(resp));
//             if (resp.hits) {
//                 var hitsTotal = resp.hits.total;
//                 if (hitsTotal >0) {
//                     return resp.hits.hits;
//                 }
//             }
//             return {};
//         }, function (err) {
//             console.trace(err.message);
//         });
//     }
// }
//
// export {
//     esUtil,
// }