const crypto = require('crypto');

async function fetchRequest(query, client_id){
    //STAGING
    const API_KEY = "f3a28438-783f-4359-b0d6-d67313bd4e68";
    const BUSINESS_ID = "37443150-db33-46a8-9910-ff7fe6429121";
    const CLIENT_ID = client_id;
    // const CLIENT_ID = "40d23c8e-b7bf-4ce3-8e3a-f08ea97dfee4";
    const SECRET_KEY = "/DnItfA6pBK6r73fs3o4UunUut66S+P/vzEotEiVLfQ=";
    const url = `https://sandbox.joinblvd.com/api/2020-01/${BUSINESS_ID}/client`;

    //LIVE
    // const API_KEY = "d6764d76-d884-4ab5-87c1-90befe969ef4";
    // const BUSINESS_ID = "c869f2d0-d72f-4466-9da8-1a14398ed1af";
    // const CLIENT_ID = client_id;
    // const SECRET_KEY = "uyjdGShwGICFKbr8TtXiyM8B++nigR+i1XFJi6b1FT8=";
    // const url = `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`;
    
    let auth;
    if(CLIENT_ID){
      auth = generate_auth_header(API_KEY, BUSINESS_ID, CLIENT_ID, SECRET_KEY);
    }else{
      auth = generate_guest_auth_header(API_KEY);
    }

    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
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

function generate_auth_header(api_key, business_id, client_id, api_secret) {
  const prefix = 'blvd-client-v1'
  const timestamp = Math.floor(Date.now() / 1000)

  const payload = `${prefix}${business_id}${client_id}${timestamp}`
  const raw_key = Buffer.from(api_secret, 'base64')
  const signature = crypto
    .createHmac('sha256', raw_key)
    .update(payload, 'utf8')
    .digest('base64')

  const token = `${signature}${payload}`
  const http_basic_payload = `${api_key}:${token}`
  const http_basic_credentials = Buffer.from(http_basic_payload, 'utf8').toString('base64');

  return http_basic_credentials
}

function generate_guest_auth_header(api_key) {
  const payload = `${api_key}:`
  const http_basic_credentials = Buffer.from(payload, 'utf8').toString('base64')

  return http_basic_credentials
}


// Endpoints
exports.getCartBookableDates = async function (req, res) {
  const cartID = req.body.cartID;
  const locationID = req.body.locationID;
  const tz = req.body.timeZone;
  const limit = req.body.limit;
  const client_id = req.body.clientId;

  var returnObj = {
    status: "error",
    message: "Something went wrong",
    data: -1,
  };
  // id: "urn:blvd:Cart:bf72d783-2f95-4e73-b5e7-f405d154546a" locationId:"urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0" limit: 8
  const gql = {
    query: `query cartBookableDates($id:ID!, $locationId:ID, $limit:Int, $tz:Tz){
      cartBookableDates(id:$id  locationId:$locationId limit: $limit, tz:$tz){
          date
      }
    }`,
    variables:{
      id:cartID,
      locationID:locationID,
      limit:limit,
      tz:tz
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.getCartBookableTimes = async function (req, res) {
  const cartID = req.body.cartID;
  const searchDate = req.body.searchDate;
  const tz = req.body.timeZone;
  const client_id = req.body.clientId;


  var returnObj = {
    status: "error",
    message: "Something went wrong",
    data: -1,
  };
  // id: "urn:blvd:Cart:bf72d783-2f95-4e73-b5e7-f405d154546a" locationId:"urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0" limit: 8
  const gql = {
    query: `query cartBookableTimes($id:ID!, $searchDate:Date!, $tz:Tz){
      cartBookableTimes(id:$id  searchDate:$searchDate tz:$tz){
        id
        score
        startTime
      }
    }`,
    variables:{
      id:cartID,
      searchDate:searchDate,
      tz:tz
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.getBusiness = async function (req, res) {
  
  const client_id = req.body.clientId;

  const gql = {
    query: `{
      business{
        id
        name
      }
    }`
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.createCart = async function (req, res) {
  const locationID = req.body.locationID;
  const client_id = req.body.clientId;

  // {locationId:"urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0"}

  const gql = {
    query: `mutation createCart($input:CreateCartInput!){
      createCart(input:$input){
          cart{
            id
            expiresAt
            features{
              bookingQuestionsEnabled
              giftCardPurchaseEnabled
              paymentInfoRequired
              serviceAddonsEnabled
            }
            availableCategories {
              id
              name
              disabled
              description
              availableItems {
                ...on CartAvailableBookableItem {
                  listDurationRange {
                      max
                      min
                      variable
                  }
                  optionGroups{
                    id
                    name
                    options{
                      id
                      groupId
                      name
                    }
                  }
                }
                id
                name
                description
                disabled
                listPriceRange{
                  min
                  max
                  variable
                }
              }
            }
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
  }`,
  variables:{
    input:{
      "locationId":locationID
    }
  }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.getServiceStaffVarients = async function (req, res) {
  const cartId = req.body.cartId;
  const serviceId = req.body.serviceId;
  const client_id = req.body.clientId;


  // {locationId:"urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0"}

  const gql = {
    query: `query cart($cartId:ID!, $serviceId:ID!){
      cart(id:$cartId) {
        id
        availableItem(id:$serviceId) {
          id
    
          ... on CartAvailableBookableItem {
            name
            description
            staffVariants {
              id
              price
              duration
    
              staff {
                firstName
                lastName
                bio
              }
            }
          }
        }
      }
    }`,
  variables:{
    "cartId":cartId,
    "serviceId":serviceId
  }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.getCartDetail = async function (req, res) {
  const cartID = req.body.cartID;
  const client_id = req.body.clientId;

  const gql = {
    query: `query cart($id:ID!){
      cart(id:$id){
            availableCategories{
              availableItems{
                id
                name
                description
                listPriceRange{
                  min
                  max
                  variable
                }
                ...on CartAvailableBookableItem {
                  listDurationRange {
                      max
                      min
                      variable
                  }
                  optionGroups{
                    id
                    name
                    options{
                      id
                      groupId
                      name
                    }
                  }
                }
              }
            }
            id
            expiresAt
            guests{
              id
              email
              firstName
              lastName
              label
              number
              phoneNumber
            }
            selectedItems{
              id
              price
              ...on CartBookableItem {
                selectedOptions{
                  id
                  name
                  priceDelta
                  groupId
                  durationDelta
                  description
                }
              }
              addons{
                id
                name
                description
                disabled
                disabledDescription
                listPriceRange{
                  min
                  max
                  variable
                }
              }
              item{
                id
                name
                description
                disabled
                disabledDescription
              }
            }
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
  }`,
  variables:{
    "id":cartID
  }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.addIteminCart = async function (req, res) {
  const cartID = req.body.cartId;
  const itemGuestId = req.body.itemGuestId;
  const itemId = req.body.itemId;
  const itemOptionIds = req.body.itemOptionIds;
  const itemStaffVariantId = req.body.itemStaffVariantId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation addCartSelectedBookableItem($input:AddCartSelectedBookableItemInput!){
      addCartSelectedBookableItem(input:$input){
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
    }`,
    variables:{
      input:{
        "id":cartID,
        "itemGuestId":itemGuestId,
        "itemId":itemId,
        "itemOptionIds":itemOptionIds,
        "itemStaffVariantId":itemStaffVariantId
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.removeIteminCart = async function (req, res) {
  const cartID = req.body.cartId;
  const itemId = req.body.itemId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation removeCartSelectedItem($input:RemoveCartSelectedItemInput!){
      removeCartSelectedItem(input:$input){
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
    }`,
    variables:{
      input:{
        "id":cartID,
        "itemId":itemId
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.reserveCartBookableItems = async function (req, res) {
  const cartID = req.body.cartId;
  const bookableTimeId = req.body.bookableTimeId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation reserveCartBookableItems($input:AddCartSelectedBookableItemInput!){
      reserveCartBookableItems(input:$input){
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
    }`,
    variables:{
      input:{
        "id":cartID,
        "bookableTimeId":bookableTimeId
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.updateCartClientInfo = async function (req, res) {
  const cartID = req.body.cartId;
  const clientInfo = req.body.clientInfo;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation updateCart($input:AddCartSelectedBookableItemInput!){
      updateCart(input:$input){
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
    }`,
    variables:{
      input:{
        "id":cartID,
        "clientInformation":clientInfo
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.addCartCardPaymentMethod = async function (req, res) {
  const cartID = req.body.cartId;
  const select = req.body.select;
  const token = req.body.token;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation addCartCardPaymentMethod($input:AddCartCardPaymentMethodInput!){
      addCartCardPaymentMethod(input:$input){
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
    }`,
    variables:{
      input:{
        "id":cartID,
        "select":select,
        "token":token
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.checkoutCart = async function (req, res) {
  const cartID = req.body.cartId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation checkoutCart($input:CheckoutCartInput!){
      checkoutCart(input:$input){
        cart{
          id
          completedAt
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
    }`,
    variables:{
      input:{
        "id":cartID,
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.addCartOffer = async function (req, res) {
  const cartID = req.body.cartId;
  const offerCode = req.body.offerCode;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation addCartOffer($input:AddCartOfferInput!){
      addCartOffer(input:$input){
        offer{
          applied
          code
          id
          name
        }
        cart{
          id
          completedAt
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
    }`,
    variables:{
      input:{
        "id":cartID,
        "offerCode":offerCode
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.removeCartOffer = async function (req, res) {
  const cartID = req.body.cartId;
  const offerId = req.body.offerId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation removeCartOffer($input:RemoveCartOfferInput!){
      removeCartOffer(input:$input){
        cart{
          id
          completedAt
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
    }`,
    variables:{
      input:{
        "id":cartID,
        "offerId":offerId
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.createCartGuest = async function (req, res) {
  const client = req.body.client;
  const cartID = req.body.cartID;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation createCartGuest($input:CreateCartGuestInput!){
      createCartGuest(input:$input){
        cart {
          id
          guests {
            id
            firstName
            lastName
            email
          }
        }
      }
    }`,
    variables:{
      input:{
        "id": cartID,
        "email":client.email,
        "firstName":client.firstName,
        "lastName":client.lastName,
        "phoneNumber":client.mobilePhone
    }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.removeCartGuest = async function (req, res) {
  const guestId = req.body.guestId;
  const cartID = req.body.cartId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation deleteCartGuest($input:DeleteCartGuestInput){
      deleteCartGuest(input:$input){
        cart {
          id
          guests {
            id
            firstName
            lastName
            email
          }
        }
      }
    }`,
    variables:{
      input:{
        "id": cartID,
        "guestId": guestId,
    }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.addServiceOptionsInCart = async function (req, res) {
  const cartID = req.body.cartId;
  const itemGuestId = req.body.itemGuestId;
  const itemOptionIds = req.body.itemOptionIds;
  const itemId = req.body.itemId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation updateCartSelectedBookableItem($input:UpdateCartSelectedBookableItemInput!){
      updateCartSelectedBookableItem(input:$input){
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
    }`,
    variables:{
      input:{
        "id":cartID,
        "itemGuestId":itemGuestId,
        "itemId":itemId,
        "itemOptionIds":itemOptionIds,
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
};

exports.getClientById = async function (req, res) {
  const client_id = req.body.clientId;

  const gql = {
    query: `{
      client{
        id
        firstName
        lastName
        name
        pronoun
        email
        mobilePhone 
      }
    }`
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}