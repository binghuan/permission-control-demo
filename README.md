![](./README/icon-256.png)  
permission-control-demo
================================================

I created this "Demo Permission Control" to show you how permissions are returned from the server to the application, and the application uses them for ui controls.

// 給我簡短一點的 description


## Table of Contents

- [permission-control-demo](#permission-control-demo)
  - [Table of Contents](#table-of-contents)
  - [System Design](#system-design)
  - [Keys for UI Controls](#keys-for-ui-controls)
  - [Usage](#usage)
  - [How to start the Control Panel Web App](#how-to-start-the-control-panel-web-app)
  - [How to start the Server](#how-to-start-the-server)
  - [how to start the Mobile App](#how-to-start-the-mobile-app)
  - [Demo](#demo)
  - [Risks of Permission Control on Mobile Devices](#risks-of-permission-control-on-mobile-devices)


## System Design 
![](./README/system_design.png)

## Keys for UI Controls 
![](./README/ui_controls.png)

## Usage
![](./README/usage.png)

## How to start the Control Panel Web App 
```bash
cd ControlPannelWebApp
yarn install
yarn start
``` 
You will see this when the web application starts.  
![](./README/control_panel_web_app.png)

## How to start the Server
```bash
cd PermissionServer
go run main.go
``` 
or you can just click the xcode project to open it.  
![](./README/xcdoe_project.png)


## how to start the Mobile App
```bash
cd iPermTaker-iOS
open iPermTaker.xcodeproj
```
![](./README/ios_app.png)


## Demo 
![](./README/demo.gif)


## Risks of Permission Control on Mobile Devices
1. Implications of Shifting Permission Control to the App Side
Security Concerns  
Server-side allows centralized permission control and verification, ensuring data integrity and security. However, implementing this on the app side means that any proficient user or hacker might modify the app's code or memory, bypassing permission controls, leading to unauthorized access or modifications.

2. Inconsistencies  
Different app versions or variations among users might lead to inconsistent permission controls, potentially causing data inconsistencies or even data loss.

3. Update Challenges  
When there's a need to update or rectify the permission control logic, every user's app must be updated. This could cause update delays or inconsistencies in permission logic among users.

4. Performance Impact  
Performing permission verifications on the app side might increase the app's CPU and memory usage, affecting its overall performance.

5. Increased Business Logic Complexity  
Introducing permission control logic on the app side means the app has to manage more business logic, making the code more complex and harder to maintain.

6. Network Communication Implications  
With permission control on the app side, there might be a need for more network communication to fetch the necessary data for verification, increasing network traffic and latency.

7. Data Redundancy  
To verify permissions on the app side, more data might need to be transferred from the server to the app, leading to data redundancy and higher network traffic.

In Conclusion
Although there are scenarios where client-side permission logic might make sense (e.g., reducing server load or enhancing user experience), from a security and maintainability perspective, it's generally recommended to handle permission control server-side.