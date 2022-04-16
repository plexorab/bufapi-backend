-- Table: bufapi_user
drop table bufapi_user;

create table bufapi_user
(
    userid    serial
        constraint bufapi_user_pk
            primary key,
    username  varchar(100)             not null,
    realname  varchar(255)             not null,
    password  varchar(255)              not null,
    createdat timestamptz not null,
    updatedat timestamptz null
);

alter table bufapi_user
    alter column createdat set default now();

alter table bufapi_user
    owner to bufapiadm;

create unique index bufapi_user_username_uindex
    on bufapi_user (username);

-- Table: bufapi_session
drop table bufapi_session;

create table bufapi_session
(
    sessionid varchar(100) not null
        constraint bufapi_session_pk
            primary key,
    username  varchar(100) not null,
    clientip  varchar(100) not null,
    createdat timestamptz not null,
    expiresat timestamptz not null
);

alter table bufapi_session
    alter column createdat set default now();

alter table bufapi_session
    owner to bufapiadm;

-- Table: bufapi_endpoint
drop table bufapi_endpoint;

create table bufapi_endpoint
(
    endpointid  serial constraint bufapi_endpoint_pk primary key,
    endpointname varchar(100) not null,
    endpoint_query text,
    connid integer not null,
    createdat timestamptz not null,
    updatedat timestamptz null
);

alter table bufapi_endpoint
    alter column createdat set default now();

alter table bufapi_endpoint
    owner to bufapiadm;

-- Table: bufapi_endpoint
drop table bufapi_endpoint_conn;

create table bufapi_endpoint_conn
(
    connid  serial constraint bufapi_endpoint_conn_pk primary key,
    connname varchar(100) not null,
    dbtype varchar(100) not null,
    dbhost varchar(100) not null,
    dbport integer not null,
    dbuser varchar(100) not null,
    dbpassword varchar(100) not null,
    dbname varchar(100) not null,
    option1 varchar(100) null,
    option2 varchar(100) null,
    option3 varchar(100) null,
    option4 varchar(100) null,
    option5 varchar(100) null,
    option6 varchar(100) null,
    option7 varchar(100) null,
    option8 varchar(100) null,
    option9 varchar(100) null,
    createdat timestamptz not null,
    updatedat timestamptz null
);

alter table bufapi_endpoint_conn
    alter column createdat set default now();

alter table bufapi_endpoint_conn
    owner to bufapiadm;

-- Table: bufapi_endpoint_param
drop table bufapi_endpoint_param;

create table bufapi_endpoint_param
(
    paramid serial constraint bufapi_endpoint_param_pk primary key,
    paramseq integer not null,
    paramname varchar(100) not null,
    endpointid integer not null,
    createdat timestamptz not null,
    updatedat timestamptz null
);

alter table bufapi_endpoint_param
    alter column createdat set default now();

alter table bufapi_endpoint_param
    owner to bufapiadm;

create unique index bufapi_endpoint_param_uindex
    on bufapi_endpoint_param (endpointid, paramseq);

-- Table: bufapi_endpoint_perm
drop table bufapi_endpoint_perm;

create table bufapi_endpoint_perm
(
    permid serial constraint bufapi_endpoint_perm_pk primary key,
    userid integer not null,
    endpointid integer not null,
    createdat timestamptz not null,
    updatedat timestamptz null
);

alter table bufapi_endpoint_perm
    alter column createdat set default now();

alter table bufapi_endpoint_perm
    owner to bufapiadm;

create unique index bufapi_endpoint_perm_uindex
    on bufapi_endpoint_perm (endpointid, userid);
