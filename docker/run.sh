#!/bin/bash

function buildUpstream(){
    ips=(${UPSTREAM_IP_LIST//,/ })
    for ip in ${ips[@]}
    do
        # 生成upstream字符串
        sed -i '/upstream backend {/a\\tserver '${ip}';' /template.conf 
    done
    envsubst '${NGINX_WEB_PATH} ${NGINX_PROXY_PATH}' < /template.conf > /etc/nginx/conf.d/default.conf
    cat /etc/nginx/conf.d/default.conf
}

function startNginx(){
    nginx -g "daemon off;"
}

buildUpstream;
startNginx;
