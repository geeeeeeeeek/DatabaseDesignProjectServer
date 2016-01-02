# C/S API概要设计

![wechat_1450353903](https://cloud.githubusercontent.com/assets/7262715/12070883/d6113e1e-b0c9-11e5-8153-0563f4975c0d.png)

按资源分类。

## 时域

#### /sessions

- [x] POST: 接受用户名和密码的对象，返回用户token。
      
      > **Object param:** name, password
      > 
      > **Test:**  `curl -H "Content-Type: application/json" -X POST -d '{"name":"NewName","password":"NewPass"}' http://localhost:3000/sessions`
      > 
      > **Note:** 密码正确返回token，密码错误HTTP返回`401`。

## 用户

#### /users

- [x] GET: `限管理员` 获取所有用户信息。
      
      > **Test:** http://localhost:3000/users
      
- [x] GET: `限管理员` *?name=A,B,C* 或 *?id=A,B,C* 获取指定用户信息。
      
      > **Test:** http://localhost:3000/users?id=222&name=testuser
      
- [x] POST: `限管理员` 接受对象数组，批量创建用户。
      
      > **Object param:** id, name, password, type(one of `Developer`, `Manager`, `Salesman`)
      > 
      > **Test:**  `curl -H "Content-Type: application/json" -X POST -d '{"id":"333","name":"xyz","password":"xyz","type":"Salesman"}' http://localhost:3000/users`
      
- [x] DELETE: `限管理员` *?id=A,B,C* 删除指定用户。
      
      > **Test:**  `curl -X DELETE http://localhost:3000/users?id=111`

#### /developers

- [x] [x] GET: `全体用户` 获取开发人员信息。

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

- [x] GET: `全体用户` 获取项目信息。
      
- [x] PUT: `限管理员` 修改项目信息。
      
      > **Note:** 项目id不可更改
      > 
      > **Test:** `curl -H "Content-Type: application/json" -X PUT -d '{"manager":"444","name":"some-pj","description":"new description"}' http://localhost:3000/projects/1`
      
- [x] DELETE: `限管理员` 删除项目。
      
      > **Test:**  `curl -X DELETE http://localhost:3000/projects/1`

## 出差任务

#### /trips

- [x] GET: `限项目经理和开发人员` *?for=A,B,C* 获取某开发人员的出差任务。?project=A,B,C获取指定项目id的出差任务。

#### /trips/:trip_id

- [x] GET: `限项目经理和开发人员` 出差任务详情。

## 出差申请

#### /trips/requests

- [x] GET: `全体成员` *?from=A,B,C* 获取某销售人员的出差申请，*?status=0(for approved),1(for rejected),2(for pending),3(for canceled)* 获取指定状态的出差申请，*?project=A,B,C* 获取指定项目id的出差申请。
      
      > **Note:** from和project二选一，可以与status同时使用。
      > 
      > **Test:** http://localhost:3000/trips/requests?project=1&status=2
      
- [x] POST: `限销售人员` 创建出差申请。
      
      > **Object param:** project_id, user_id, description, headcount, duration, start_time
      > 
      > **Test:**  `curl -H "Content-Type: application/json" -X POST -d '{"project_id":"1","user_id":"333","description":"some des","headcount":"2","duration":"3","start_time":"2016-05-05"}' http://localhost:3000/trips/requests`

#### /trips/requests/:request_id

- [x] GET: `全体成员` 获取出差申请。
      
- [x] PUT: `限所属销售人员和项目经理` 修改出差申请。
      
      > **Note:** project_id, user_id不能更改。会做以下两个边界判断：1⃣️销售人员只允许有三个pending的请求2⃣️同一个请求被reject三次后不能再提交
      > 
      > **Object param:** status, description, headcount, duration, start_time, **type**(one of  `Manager`, `Salesman`), reject_reason(如果你是拒绝的)
      > 
      > **Test:**  `curl -H "Content-Type: application/json" -X PUT -d '{"status":"0","description":"some des","headcount":"2","duration":"3","start_time":"2016-01-01","type":"Salesman"}' http://localhost:3000/trips/requests/3`

#### /trips/requests/:request_id/history

- [x] GET: `全体成员` 获取项目申请历史。

## 出差报告

#### /trips/:trip_id/reports

- [x] GET: `全体成员` *?from=A,B,C* 获取某开发人员的出差报告。
- [ ] POST: `限开发人员` 创建出差报告。

#### /trips/:trip_id/reports/:report_id

- [ ] GET: `全体成员` 获取特定出差报告。

## 出差人员

#### /trips/:trip_id/members

- [x] GET: `全体成员` 获取所有出差成员，包含状态。
      
- [x] POST: `限项目经理` 接受对象数组，批量创建添加出差人员。
      
      > **Object param:** trip_id, user_id

#### /trips/:trip_id/members/:user_id

- [x] GET: `全体成员` 获取出差成员状态。0(for `not confirm`), 1(for `confirmed`)