create table accounts
(
    id          serial
        primary key,
    holder_name varchar(100),
    balance     numeric(12, 2) default 0 not null,
    user_id     integer                  not null
        constraint fk_user
            references users
            on delete cascade
);

create table users
(
    id            serial
        primary key,
    username      varchar(100) not null
        unique,
    password_hash text         not null
);
