# 创建风月聆数据库
create DATABASE fengyueling
DROP TABLE user
# 创建登录数据表
CREATE TABLE user(
	id int PRIMARY KEY auto_increment,
	`name` VARCHAR(16) unique not null,
	`password` VARCHAR(16) not null,
	`status` int DEFAULT 0)
# 增添默认数据
insert into user(name,password) VALUES
('admin','123456'),
('username','123456')
# 查询user表
select * from user
# 新增数据
# insert into user(name,password) VALUES(?,?)
	