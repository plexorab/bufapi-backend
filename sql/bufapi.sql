drop table bufapi_users;

create table bufapi_users
(
    userid    serial
        constraint bufapi_users_pk
            primary key,
    username  varchar(100)             not null,
    realname  varchar(255)             not null,
    password  varchar(255)              not null,
    createdat timestamptz not null,
    updatedat timestamptz null
);

alter table bufapi_users
    alter column createdat set default now();

alter table bufapi_users
    owner to bufapiadm;

create unique index bufapi_users_userid_uindex
    on bufapi_users (userid);

create unique index bufapi_users_username_uindex
    on bufapi_users (username);
