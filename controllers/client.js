const crypto = require('crypto');

async function fetchRequest(query){
    const API_KEY = "f3a28438-783f-4359-b0d6-d67313bd4e68";
    const BUSINESS_ID = "37443150-db33-46a8-9910-ff7fe6429121";
    const CLIENT_ID = "urn:blvd:Client:40d23c8e-b7bf-4ce3-8e3a-f08ea97dfee4";
    const SECRET_KEY = "/DnItfA6pBK6r73fs3o4UunUut66S+P/vzEotEiVLfQ=";
    const auth = generate_guest_auth_header(API_KEY, BUSINESS_ID, CLIENT_ID, SECRET_KEY);

    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json" 
    }

    let bodyContent = JSON.stringify(query);

    let reqOptions = {
        url: `https://sandbox.joinblvd.com/api/2020-01/${BUSINESS_ID}/client`,
        method: "POST",
        headers: headersList,
        data: bodyContent,
    }

    const response = await axios.request(reqOptions);
    console.log("response : ", response)
    return response.data;
    // res.json({response:response.data});
}

function generate_auth_header(api_key, business_id, client_id, api_secret) {
  const prefix = 'blvd-client-v1'
  const timestamp = Math.floor(Date.now() / 1000)

  // const payload = `${prefix}${business_id}${client_id}${timestamp}`
  const payload = `${api_key}:`
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

function generate_guest_auth_header(api_key, business_id, client_id, api_secret) {
  const prefix = 'blvd-client-v1'
  // const timestamp = Math.floor(Date.now() / 1000)

  // const payload = `${prefix}${business_id}${client_id}${timestamp}`
  const payload = `${api_key}:`
  // const raw_key = Buffer.from(api_secret, 'base64')
  // const signature = crypto
  //   .createHmac('sha256', raw_key)
  //   .update(payload, 'utf8')
  //   .digest('base64')

  // const token = `${signature}${payload}`
  // const http_basic_payload = `${api_key}:${token}`
  const http_basic_credentials = Buffer.from(payload, 'utf8').toString('base64')

  return http_basic_credentials
}


// Endpoints
exports.getCartBookableDates = async function (req, res) {
  const cartID = req.body.cartID;
  const locationID = req.body.locationID;
  const tz = req.body.timeZone;

  var returnObj = {
    status: "error",
    message: "Something went wrong",
    data: -1,
  };

  const gql = {
    query: `{
      cartBookableDates(id: "urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0" locationId:"urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0" limit: 8){
          date
      }
    }`
  }
  const response = await fetchRequest(gql);

  res.json(response);
};

exports.getBusiness = async function (req, res) {
  var returnObj = {
    status: "error",
    message: "Something went wrong",
    data: -1,
  };

  const gql = {
    query: `{
      business{
        id
        name
      }
    }`
  }
  const response = await fetchRequest(gql);

  res.json(response);
};

exports.createCart = async function (req, res) {
  // const locationID = `req.body.locationID`;
  var returnObj = {
    status: "error",
    message: "Something went wrong",
    data: -1,
  };

  const gql = {
    query: `mutation{
      createCart(input:{locationId:"urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0"}){
          cart{
            id
            expiresAt
            summary{
              deposit
              depositAmount
              discountAmount
              gratuityAmount
              paymentMethodRequired
              roundingAmount
              subtotal
              taxAmount
              total
            }
            bookingQuestions{
              id
              key
              label
              required
            }
            clientInformation{
              email
              firstName
              lastName
              phoneNumber
              externalId
            }
            location{
              id
              name
              businessName
            }
          }
      }
  }`
  }
  const response = await fetchRequest(gql);

  res.json(response);
};

exports.getCartDetail = async function (req, res) {
  // const cartID = `req.body.cartID`;
  var returnObj = {
    status: "error",
    message: "Something went wrong",
    data: -1,
  };

  const gql = {
    query: `{
      cart(id:"urn:blvd:Cart:bf72d783-2f95-4e73-b5e7-f405d154546a"){
            id
            expiresAt
            summary{
              deposit
              depositAmount
              discountAmount
              gratuityAmount
              paymentMethodRequired
              roundingAmount
              subtotal
              taxAmount
              total
            }
            bookingQuestions{
              id
              key
              label
              required
            }
            clientInformation{
              email
              firstName
              lastName
              phoneNumber
              externalId
            }
            location{
              id
              name
              businessName
            }
          }
  }`
  }
  const response = await fetchRequest(gql);

  res.json(response);
};

// exports.addIteminCart = async function (req, res) {
//   var returnObj = {
//     status: "error",
//     message: "Something went wrong",
//     data: -1,
//   };

//   const gql = {
//     query: `{
//       business{
//         id
//         name
//       }
//     }`
//   }
//   const response = await fetchRequest(gql);

//   res.json(response);
// };