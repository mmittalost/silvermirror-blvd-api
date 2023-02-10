async function fetchRequest(query){
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": "Basic ZjNhMjg0MzgtNzgzZi00MzU5LWIwZDYtZDY3MzEzYmQ0ZTY4OlNlTHJSYXErTVdaSy83Y0xheFBhL1c0Njh3RFVtOGFVTFlCUWdUT1dITkE9Ymx2ZC1hZG1pbi12MTM3NDQzMTUwLWRiMzMtNDZhOC05OTEwLWZmN2ZlNjQyOTEyMTE2NzU5NTU4MzY=",
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
    const email = `["Dameon.Predovic@example.com"]`;
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