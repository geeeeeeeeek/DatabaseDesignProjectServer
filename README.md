# C/S API概要设计

按资源分类。

## 时域

#### /sessions

- POST: 接受用户名和密码的对象，返回用户token。

> 后文中所有请求都需要在cookie中带上用户token，否则返回`401`。

## 用户

#### /users

- GET: `限管理员` 获取所有用户信息。
- GET: `限管理员` *?name=A,B,C* 或 *?id=A,B,C* 获取指定用户信息。
- POST: `限管理员` 接受对象数组，批量创建用户。
- DELETE: `限管理员` *?name=A,B,C* 或 *?id=A,B,C* 删除指定用户。

#### /users/:user_id

- GET: `限管理员` 获取用户信息。
- PUT: `限管理员` 修改用户信息。
- DELETE: `限管理员` 删除用户。

> `developers`、`salesmen`、`managers`是`users`的同义词，区别在于会从不同的表中返回数据。

## 项目

#### /projects

- GET: `限销售人员` 获取所有项目信息。
- GET: `全体成员` *?name=A,B,C* 或 *?id=A,B,C* 或 *?manager=A,B,C*  或 *?developer=A,B,C* 获取指定项目信息。
- POST: `限管理员` 接受对象数组，批量创建项目。
- DELETE: `限管理员` *?name=A,B,C* 或 *?id=A,B,C* 删除指定项目。

#### /projects/:project_id

- GET: `全体用户` 获取项目信息。
- PUT: `限管理员` 修改项目信息。
- DELETE: `限管理员` 删除项目。

## 出差申请

#### /trips/requests

- GET: `全体成员` *?from=A,B,C* 获取某销售人员的出差申请，*?status=approved,rejected,waiting,canceled* 获取指定状态的出差申请，*?project=A,B,C* 获取指定项目名的出差申请。
- POST: `限销售人员` 创建出差申请。

#### /trips/requests/:request_id

- GET: `全体成员` 获取出差申请。
- PUT: `限所属销售人员和项目经理` 修改出差申请。

#### /trips/requests/:request_id/history

- GET: `全体成员` 获取项目申请历史。

## 出差报告

#### /trips/:trip_id/reports

- GET: `全体成员` *?from=A,B,C* 获取某开发人员的出差报告。
- POST: `限开发人员` 创建出差报告。

#### /trips/:trip_id/reports/:report_id

- GET: `全体成员` 获取特定出差报告。

## 出差人员

#### /trips/:trip_id/members

- GET: `全体成员` 获取所有出差成员。
- POST: `限项目经理` 接受对象数组，批量创建添加出差人员。

#### /trips/:trip_id/members/:user_id

- GET: `全体成员` 获取出差成员状态。
- PUT: `限开发人员` 更新出差成员状态。