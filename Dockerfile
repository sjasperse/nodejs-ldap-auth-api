FROM node:7.4-alpine

RUN mkdir -p /app/

ENV LDAP_PATH=
ENV LDAP_DN=
ENV LDAP_PASSWORD=
ENV CERT_PATH=
ENV CERT_KEY_PATH=
ENV CERT_PASSPHRASE=
ENV AUTH_COOKIE_NAME=auth
ENV PRIVATE_KEY=

COPY server /app/
COPY node_modules /app/node_modules

CMD ["node", "/app/server.js"]
EXPOSE 3443