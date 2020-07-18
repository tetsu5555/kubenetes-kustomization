FROM busybox

RUN whoami

RUN adduser -D -g '' newuser

USER newuser

RUN whoami
