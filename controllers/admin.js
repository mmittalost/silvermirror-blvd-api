const crypto = require('crypto');

async function fetchRequest(query){
    const business_id = "37443150-db33-46a8-9910-ff7fe6429121";
    const api_secret = "/DnItfA6pBK6r73fs3o4UunUut66S+P/vzEotEiVLfQ="
    const api_key = "f3a28438-783f-4359-b0d6-d67313bd4e68"
    const auth = generate_auth_header(business_id, api_secret, api_key)
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "SilverMirror (https://www.silvermirror.com)",
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json" 
    }

    let bodyContent = JSON.stringify(query);

    let reqOptions = {
        url: "https://sandbox.joinblvd.com/api/2020-01/admin",
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
  var returnObj = {
    status: "error",
    message: "Something went wrong",
    data: -1,
  };

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
    var returnObj = {
      status: "error",
      message: "Something went wrong",
      data: -1,
    };

    // const email = req.body.email;
    const email = `["himanshu.sharma@opensourcetechnologies.com"]`;
    const gql = {
        query: `{
            clients(first:1 emails: ${email}){
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
        }`
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
    const gql = {
        query: `mutation{
            createClient(input: ${client}){
                client{
                    id
                    name
                    email
                    mobilePhone
                }
            }
        }`
    }
  
    try{
        const response = await fetchRequest(gql);
        res.json(response);
    }catch(err){
        res.json(err);
    }
}

