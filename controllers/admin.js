const crypto = require('crypto');
const mailchimpClient = require("@mailchimp/mailchimp_marketing");

const emailTemplate = `<html>
<body>
    <h1>Hello Manish,</h1>
    <p>Use the code below to authenticate:</p>
    <div>
        <p>990937</p>
    </div>
    <p>Please be aware that this code is temporary and will expire soon.</p>
    <p>You are receiving this code because a login to your account was attempted on the Booking Portal.</p>
    <p>Regards</p>
    <p>The Silvermirror Team</p>
</body>
</html>`

async function fetchRequest(query){
    // STAGING
    // const business_id = "37443150-db33-46a8-9910-ff7fe6429121";
    // const api_secret = "/DnItfA6pBK6r73fs3o4UunUut66S+P/vzEotEiVLfQ="
    // const api_key = "f3a28438-783f-4359-b0d6-d67313bd4e68"
    // const url = "https://sandbox.joinblvd.com/api/2020-01/admin"

    // PRODUCTION
    const api_key = "d6764d76-d884-4ab5-87c1-90befe969ef4";
    const business_id = "c869f2d0-d72f-4466-9da8-1a14398ed1af";
    const api_secret = "uyjdGShwGICFKbr8TtXiyM8B++nigR+i1XFJi6b1FT8=";
    const url = "https://dashboard.boulevard.io/api/2020-01/admin"

    const auth = generate_auth_header(business_id, api_secret, api_key)
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "SilverMirror (https://www.silvermirror.com)",
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json" 
    }

    let bodyContent = JSON.stringify(query);

    let reqOptions = {
        url: url,
        method: "POST",
        headers: headersList,
        data: bodyContent,
    }

    const response = await axios.request(reqOptions);
    console.log("response : ", response)
    return response.data;
    // res.json({response:response.data});
}

function generate_auth_header(business_id, api_secret, api_key) {
  const prefix = 'blvd-admin-v1'
  const timestamp = Math.floor(Date.now() / 1000)

  const payload = `${prefix}${business_id}${timestamp}`
  const raw_key = Buffer.from(api_secret, 'base64')
  const signature = crypto
    .createHmac('sha256', raw_key)
    .update(payload, 'utf8')
    .digest('base64')

  const token = `${signature}${payload}`
  const http_basic_payload = `${api_key}:${token}`
  const http_basic_credentials = Buffer.from(http_basic_payload, 'utf8').toString('base64')

  return http_basic_credentials
}


// Endpoints
exports.getServices = async function (req, res) {

  const gql = {
    query: `{
        services(first: 100){
          edges 
          {
              node 
              {
                  id 
                  name 
                  description
                  active
                  serviceOptionGroups{
                      name
                      description
                      serviceId
                      serviceOptions{
                          id
                          name
                          description
                          defaultPriceDelta
                          defaultPostStaffDurationDelta
                      }
                  }
              }
          } 
          }}`,
        variables: "{}",
  }
  const response = await fetchRequest(gql);

  res.json(response);
};

exports.getClientByEmail = async function (req, res) {

    const emails = req.body.emails;
    // const email = `["himanshu.sharma@opensourcetechnologies.com"]`;
    const gql = {
        query: `query clients($emails:[String!]){
            clients(first:1 emails: $emails){
                edges{
                    node{
                        id
                        firstName
                        lastName
                        email
                        mobilePhone
                    }
                }
            }
        }`,
        variables:{
            emails:emails
        }
    }
  
    const response = await fetchRequest(gql);
  
    res.json(response);
};

exports.getLocations = async function (req, res) {
    const gql = {
        query: `{
            locations(first:20){
                edges{
                    node{
                        id
                        businessName
                        contactEmail
                        name
                        phone
                        address{
                            city
                            country
                            line1
                            line2
                            province
                            state
                            zip
                        }
                    }
                }
            }
        }`
    }
  
    const response = await fetchRequest(gql);
  
    res.json(response);
}

exports.getStaffByLocation = async function (req, res) {
    const locationID = req.body.locationID;
    const gql = {
        query: `{
            staff(first:20){
                edges{
                    node{
                        id
                        name
                        email
                        bio
                        locations{
                            id
                        }
                    }
                }
            }
        }`
    }
  
    const response = await fetchRequest(gql);

    const staffNodes = response.data.staff.edges.filter(edge => {
        return edge.node.locations.some(location => location.id == locationID);
    });
  
    res.json(staffNodes);
}

exports.createClient = async function (req, res) {
    // {email:"test@ost.com" firstName:"OSTTEST" lastName:"Hello"}
    const client = req.body.client;
    console.log("EMAIL : ", client.email);
    const gql = {
        query: `mutation createClient($input:CreateClientInput!){
            createClient(input: $input){
                client{
                    id
                    name
                    email
                    mobilePhone
                }
            }
        }`,
        variables:{
            input:{
                "email":client.email,
                "firstName":client.firstName,
                "lastName":client.lastName,
                "mobilePhone":client.mobilePhone
            }
        }
    }
  
    try{
        const response = await fetchRequest(gql);
        addMemberToMailchimpList(client.email);
        res.json(response);
    }catch(err){
        res.json(err);
    }
}

exports.appointmentRescheduleAvailableDates = async function (req, res) {
    const appointmentId = req.body.appointmentId;
    const searchRangeLower = req.body.searchRangeLower;
    const searchRangeUpper = req.body.searchRangeUpper;
    const tz = req.body.timeZone;
     
    const gql = {
      query: `mutation AppointmentRescheduleAvailableDates($input:AppointmentRescheduleAvailableDatesInput!){
        AppointmentRescheduleAvailableDates(input:$input){
            availableDates{
                date
            }
        }
      }`,
      variables:{
        input:{
            "appointmentId":appointmentId,
            "searchRangeLower":searchRangeLower,
            "searchRangeUpper":searchRangeUpper,
            "tz":tz
        }
      }
    }
    const response = await fetchRequest(gql);
  
    res.json(response);
};

exports.appointmentRescheduleAvailableTimes = async function (req, res) {
    const appointmentId = req.body.appointmentId;
    const date = req.body.date;
    const tz = req.body.timeZone;
    
    const gql = {
      query: `mutation appointmentRescheduleAvailableTimes($input:AppointmentRescheduleAvailableTimesInput!){
        appointmentRescheduleAvailableTimes(input:$input){
            availableTimes{
                bookableTimeId
                startTime
            }
        }
      }`,
      variables:{
        input:{
            "appointmentId":appointmentId,
            "date":date,
            "tz":tz
        }
      }
    }
    const response = await fetchRequest(gql);
  
    res.json(response);
};

exports.rescheduleAppointment = async function (req, res) {
    // const client_id = req.body.clientId;
    const appointmentId = req.body.appointmentId;
    const bookableTimeId = req.body.bookableTimeId;
    const sendNotification = true;
  
    const gql = {
      query: `mutation appointmentReschedule($input:AppointmentRescheduleInput!){
        appointmentReschedule(input:$input){
            appointment{
                id
                startAt
                endAt
            }
        }
      }`,
      variables:{
        input:{
          "appointmentId":appointmentId,
          "bookableTimeId":bookableTimeId,
          "sendNotification":sendNotification
        }
      }
    }
    const response = await fetchRequest(gql);
  
    res.json(response);
}

// exports.updateClient = async function (req, res) {
//     // {email:"test@ost.com" firstName:"OSTTEST" lastName:"Hello"}
//     const client = req.body.client;
//     const clientId = req.body.client_id;
//     const gql = {
//         query: `mutation updateClient($input:UpdateClientInput!){
//             updateClient(input: $input){
//                 client{
//                     id
//                     name
//                     email
//                     mobilePhone
//                 }
//             }
//         }`,
//         variables:{
//             input:{
//                 "id":clientId,
//                 "email":client.email,
//                 "firstName":client.firstName,
//                 "lastName":client.lastName,
//                 "mobilePhone":client.mobilePhone,
//                 "customFields":{
//                     "key":"key"
//                 }
//             }
//         }
//     }
  
//     try{
//         const response = await fetchRequest(gql);
//         res.json(response);
//     }catch(err){
//         res.json(err);
//     }
// }

addMemberToMailchimpList = async(email)=>{
    mailchimpClient.setConfig({
        apiKey: "a37d367bd166bd6d18e0c1f63bece341-us12",
        server: "us12",
      });
    const listId = '7f251dccc0';
    const response = await mailchimpClient.lists.addListMember(listId, {
        email_address: email,
        status: "subscribed",
    });
}