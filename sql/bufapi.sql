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
    createdat timestamp not null,
    updatedat timestamp null
);

alter table bufapi_user
    alter column createdat set default now();

alter table bufapi_user
    owner to bufapiadm;

create unique index bufapi_user_userid_uindex
    on bufapi_user (userid);

create unique index bufapi_user_username_uindex
    on bufapi_user (username);

-- Table: bufapi_session
drop table bufapi_session;

create table bufapi_session
(
    sessionid varchar(100) not null
        constraint bufapi_session_pk
            primary key,
    createdat timestamp not null,
    expiresat timestamp not null
);

alter table bufapi_session
    alter column createdat set default now();

alter table bufapi_session
    owner to bufapiadm;

create unique index bufapi_session_sessionid_uindex
    on bufapi_session (sessionid);