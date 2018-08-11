FROM hub.c.163.com/library/nginx:1.12.0

ENV NGINX_WEB_PATH /alibaba/
ENV NGINX_PROXY_PATH /web/
ENV UPSTREAM_IP_LIST localhost:8080

RUN rm -rf /usr/share/nginx/html/

ADD template.conf /
COPY src/  /usr/share/nginx/html/ 
COPY run.sh /
RUN chmod 755 /run.sh

ENTRYPOINT ["/run.sh"]
CMD []
