
# T-Oasis - a fertile spot for travellers

T-Oasis is a multivendor project designed to serve as a facility booking website for travelers. This project empowers both lounge managers and users to efficiently manage and book facilities, creating a seamless experience for all parties involved. This platform caters to a diverse user base, including lounge managers who manage lounge spaces and a administrator responsible for overseeing the entire system.🚀🐦

**The following tools were utilized for the project-:**

- libraries: jwt, cronjob, socket-io, formik, mapbox, nodemailer, Axios, Antd, Tailwind CSS, redux_toolkit, react-persist, chart.js, cloudinary, razorpay,etc..


## Deployment Instructions:

#### Prerequisites:

- Node.js(above v-14) should be installed on your system.


#### Step 1: Clone the Project 
#### Prerequisites:

- clone client and server repo separetly from github in a single folder.

Open a terminal and run the following command to clone client side:
```bash
git clone https://github.com/mhdmishab/t-Oasis_client
 
```
Open a terminal and run the following command to clone server side:
```bash
git clone https://github.com/mhdmishab/t-Oasis
 
```
#### Step 2: Navigate to the Project Directory of Client 

Navigate to the `client` directory within the cloned project using the command:
```bash
cd mhdmishab/t-Oasis_client
 
```

#### Step 3: Install Global Dependencies

Run the following command. This will help with server restarts during development.
```bash
 npm install
 
```

#### Step 3: Start Running the Front-end 

After navigating to the `client` directory, start the front end using the following command:
```bash
npm start
 
```

#### Step 4: Navigate to the Project Directory of server 

Open Another terminal and Navigate to the `server` directory using the command:
```bash
cd mhdmishab/t-Oasis
 
```

#### Step 5: Configure Environment Variables

Before running the backend server, make sure to create an `.env` file in the `server` directory. Add the following environment variables to the file:
```bash

CONNECTION_STRING=mongodb_connection_string
PORT=your_port
JWT_SECRET_KEY=your_jwt_key
OTP_SECRET_KEY=your_otp_key
EMAIL_ADDRESS=your_email
EMAIL_PASSWORD=your_email_pass
ADMIN_EMAIL=admin_email
ADMIN_PASSWORD=admin_password
CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_apikey
CLOUDINARY_API_SECRET=cloud_api_secret
RAZORPAY_KEY_ID=razor_key
RAZORPAY_KEY_SECRET=razor_secret
 
```

#### Step 6: Install Global Dependencies and nodemon

Run the following command to install nodemon globally. This will help with server restarts during development.
```bash
 npm install
 npm install -g nodemon
 
```
#### Step 7: Start Running the Back-end 

After navigating to the `server` directory, start the backend using the following command:
```bash
npm start
 
```

## Conclusion

T-Oasis revolutionizes the way travelers book facilities by offering a comprehensive and intuitive platform. By empowering lounge managers and users alike, it ensures a seamless experience for all parties involved. With its diverse user base and robust features, including efficient facility management and oversight by administrators, T-Oasis sets a new standard for facility booking websites. As we continue to innovate and enhance the platform, we are committed to delivering an unparalleled experience that exceeds the expectations of travelers worldwide. 🚀🐦

