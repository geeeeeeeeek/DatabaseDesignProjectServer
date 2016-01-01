# C/S API概要设计

![wechat_1450353903](https://cloud.githubusercontent.com/assets/7262715/12070883/d6113e1e-b0c9-11e5-8153-0563f4975c0d.png)

按资源分类。

## 时域

#### /sessions

- [ ] POST: 接受用户名和密码的对象，返回用户token。

>  后文中所有请求都需要在cookie中带上用户token，否则返回`401`。

## 用户

#### /users

- [x] GET: `限管理员` 获取所有用户信息。

> **Test:** http://localhost:3000/users

- [x] GET: `限管理员` *?name=A,B,C* 或 *?id=A,B,C* 获取指定用户信息。

>  **Test:** http://localhost:3000/users?id=222&name=testuser

- [x] POST: `限管理员` 接受对象数组，批量创建用户。

> **Object param:** id, name, password, type(one of `Developer`, `Manager`, `Salesman`)
> 
> **Test:**  `curl -H "Content-Type: application/json" -X POST -d '{"id":"111","name":"xyz","password":"xyz","type":"Developer"}' http://localhost:3000/users`

- [x] DELETE: `限管理员` *?id=A,B,C* 删除指定用户。

> **Test:**  `curl -X DELETE http://localhost:3000/users?id=111`

#### /users/:user_id

- [x] GET: `限管理员` 获取用户信息。
      
      > **Test:** http://localhost:3000/users/222
      
- [x] PUT: `限管理员` 修改用户信息。
      
      > **Note:** 用户id和type不可更改
      > 
      > **Test:** `curl -H "Content-Type: application/json" -X PUT -d '{"name":"NewName","password":"NewPass"}' http://localhost:3000/users/222`
      
- [x] DELETE: `限管理员` 删除用户。

## 项目

#### /projects

- [x] GET: `限销售人员` 获取所有项目信息。
      
- [x] GET: `全体成员` *?name=A,B,C* 或 *?id=A,B,C* 或 *?manager=A,B,C*  或 *?developer=A,B,C* 获取指定项目信息。
      
- [x] POST: `限管理员` 接受对象数组，批量创建项目。
      
      > **Object param:** id, manager, name, description
      > 
      > **Test:**  `curl -H "Content-Type: application/json" -X POST -d '{"id":"1","manager":"444","name":"some-pj","description":"some description"}' http://localhost:3000/projects`
      
- [x] DELETE: `限管理员` *?name=A,B,C* 或 *?id=A,B,C* 删除指定项目。
      
      > - [ ] **Test:**  `curl -X DELETE http://localhost:3000/projects?id=1`

#### /projects/:project_id

- [ ] GET: `全体用户` 获取项目信息。
      
- [ ] PUT: `限管理员` 修改项目信息。
      
      > **Note:** 项目id不可更改
      > 
      > **Test:** `curl -H "Content-Type: application/json" -X PUT -d '{"manager":"444","name":"some-pj","description":"new description"}' http://localhost:3000/projects/1`
      
- [ ] DELETE: `限管理员` 删除项目。
      
      > **Test:**  `curl -X DELETE http://localhost:3000/projects/1`

## 出差任务

#### /trips

- [ ] GET: `限项目经理和开发人员` *?for=A,B,C* 获取某开发人员的出差任务。不带参数返回(开发人员)自己的出差任务或(项目经理)负责的出差任务。

#### /trips/:trip_id

- [ ] GET: `限项目经理和开发人员` 出差任务详情。

## 出差申请

#### /trips/requests

- [ ] GET: `全体成员` *?from=A,B,C* 获取某销售人员的出差申请，*?status=approved,rejected,waiting,canceled* 获取指定状态的出差申请，*?project=A,B,C* 获取指定项目名的出差申请。
- [ ] POST: `限销售人员` 创建出差申请。

#### /trips/requests/:request_id

- [ ] GET: `全体成员` 获取出差申请。
- [ ] PUT: `限所属销售人员和项目经理` 修改出差申请。

#### /trips/requests/:request_id/history

- [ ] GET: `全体成员` 获取项目申请历史。

## 出差报告

#### /trips/:trip_id/reports

- [ ] GET: `全体成员` *?from=A,B,C* 获取某开发人员的出差报告。
- [ ] POST: `限开发人员` 创建出差报告。

#### /trips/:trip_id/reports/:report_id

- [ ] GET: `全体成员` 获取特定出差报告。

## 出差人员

#### /trips/:trip_id/members

- [ ] GET: `全体成员` 获取所有出差成员，包含状态。
- [ ] POST: `限项目经理` 接受对象数组，批量创建添加出差人员。

#### /trips/:trip_id/members/:user_id

- [ ] GET: `全体成员` 获取出差成员状态。
- [ ] PUT: `限开发人员` user_id="me"更新自己的出差成员状态。

