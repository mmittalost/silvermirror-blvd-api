const crypto = require('crypto');
const nodemailer = require("nodemailer");

async function fetchRequest(query, client_id){
    //STAGING
    // const API_KEY = "f3a28438-783f-4359-b0d6-d67313bd4e68";
    // const BUSINESS_ID = "37443150-db33-46a8-9910-ff7fe6429121";
    // const CLIENT_ID = client_id;
    // // const CLIENT_ID = "40d23c8e-b7bf-4ce3-8e3a-f08ea97dfee4";
    // const SECRET_KEY = "/DnItfA6pBK6r73fs3o4UunUut66S+P/vzEotEiVLfQ=";
    // const url = `https://sandbox.joinblvd.com/api/2020-01/${BUSINESS_ID}/client`;

    //LIVE
    const API_KEY = "d6764d76-d884-4ab5-87c1-90befe969ef4";
    const BUSINESS_ID = "c869f2d0-d72f-4466-9da8-1a14398ed1af";
    const CLIENT_ID = client_id;
    const SECRET_KEY = "uyjdGShwGICFKbr8TtXiyM8B++nigR+i1XFJi6b1FT8=";
    const url = `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`;
    
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

// Send Email
sendEmail = async function (email, otp, name) {

  const emailTemplate = `<html>
  <body>
  
	 <table style="border-collapse:collapse!important" valign="top" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#fff">
		<tbody>
			<tr>
				<td valign="top" align="center">
					<div style="border:1px solid #d6ebff;border-radius:12px; width:640px;margin:20px 0 10px 0;">
					<table style="color:#000; font-size:12px; font-family: 'Averta', Arial, Helvetica, sans-serif; line-height: 1.6rem; border-collapse:collapse!important;border-radius:12px;" valign="top" width="640" cellspacing="0" cellpadding="0" border="0" bgcolor="#fdfafa">
						<tbody>
							<tr>
								<td valign="top" width="50" align="center"></td>
								<td valign="middle" height="150" align="center">
									<p style="text-align:center; margin:10px 0;">
									<a href="https://booking.silvermirror.com/" target="_blank"><img src="https://booking.silvermirror.com/assets/email-template-logo.png" alt="Silver Mirror" id="logo" style="margin-left: 0px; width:620px;"></a>
									</p>
								</td>
								<td valign="top" width="50" align="center"></td>
							</tr>
							<tr>
								<td valign="top" width="50" align="center"></td>
								<td valign="top" align="left">
									<p style="text-align:center;"><img src="https://booking.silvermirror.com/assets/email-template-icon.png" alt="Silver Mirror" style="margin:10px 0px; width:87px;"></p>
									<p style="font-size:22px;font-weight:600;margin:10px 0 20px 0;text-align:center;">Hello ${name},</p>
									<p style="font-size:14px;font-weight:normal;margin:0px 50px 15px 50px;padding-bottom:25px;text-align:center; border-bottom:1px solid #e4e2e2;">
												<span style="margin:0 0 15px 0;display: block;">Use the code below to authenticate:</span>
												<span style="background:#fcf7f2; padding:15px; display:block; text-align:center; font-family:'Freight Display Pro', 'freight-display-pro', Georgia, serif;font-weight:bold;font-size: 28px; margin-bottom: 20px;" >${otp} 
												<span style="font-size:12px; font-family: 'Averta', Arial, Helvetica, sans-serif;font-weight:normal;margin:15px 0 0px 0;text-align:center; display:block;"><b>Please be aware that this code is temporary and will expire soon.</b></span>
												</span>
												You are receiving this code because a login to your account was attempted on the <a style="border-bottom:3px solid #80c0f4;color:#000;font-weight:600; text-decoration:none;" href="https://booking.silvermirror.com/" target="_blank">Booking Portal</a>. 		
									</p>
									<p style="font-size:14px;font-weight:normal;margin:10px 50px 20px 50px;text-align:center;">
                    With gratitude,<br>
										<b>The Silver Mirror Team </b>
									</p>
								</td>
								<td valign="top" width="10" align="center"></td>
							</tr>
						</tbody>
					</table>
					</div>
					<p style="font-size:12px;font-weight:normal;margin:0 10px 20px 10px;text-align:right;width: 640px;color:#767879; font-family: 'Averta', Arial, Helvetica, sans-serif;">
						© 2023 Silver Mirror Facial
					</p>
				</td>		
			</tr>
		</tbody>
	</table>

 </body>
</html>`
  // let testAccount = await nodemailer.createTestAccount();

  // const testConfig = {
  //   host: "mail.opensourcetechnologies.com",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: "testing@opensourcetechnologies.com", // generated ethereal user
  //     pass: "kckvWL(h3YLk", // old password "fTEaTpjZXkmf", // generated ethereal password
  //   },
  //     tls: {
  //         rejectUnauthorized: false
  //     }
  // }

  const config = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "info@silvermirror.com",
      clientId: "294841675401-mmolut4vkffkd45i4hv8apklu1429so4.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken: "1//04JaViTKgaKkCCgYIARAAGAQSNwF-L9Ir7UkARi7CzmN7HjxXtj-2GJGpeRSJmCcR1t0MP6a5MHGxgfcVp3CHVifAZviApMvOuV8",
      accessToken: "ya29.a0AVvZVsqSfELIXk8hLfQLH9NrT-an5jxyhihySs5fk45-TrfFvRRUvgdlQcDll-nr_Dn2oeLrzbXlC1QRGgzz8JhBYjMO_XU_LzT6XXp7Ccl1HjgSN1Iv1eclSvLMM4lcB4rtF8a59_96ksMj3fHFKSpnHL0-aCgYKAWMSARESFQGbdwaIUqKgnSjSlxckoJ5HCGNntA0163",
      expires: 3599,
    },
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(config);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Silver Mirror" <admin@silvermirror.com>', // sender address
    to: email, // list of receivers
    subject: "Silver Mirror - One Time Password", // Subject line
  //   text: "Hello world?", // plain text body
    html: emailTemplate, // html body
  }).catch(err=>{
      return err
  });

  return info;
}

// Auth
exports.login = async function (req, res){
  const email = req.body.email;
  const otp = req.body.otp;
  const name = req.body.name;

  const mailSentResponse = await this.sendEmail(email, otp, name);

  if(mailSentResponse.messageId){
    res.json({success: true, message:"OTP Sent successfully!"});
  }else{
    res.json({success:false, message:"Something went wrong!", error: mailSentResponse})
  }
  // }catch(err){
  //   res.json({success:false, error:err})
  // }

}


// BOOKING ENDPOINTS
exports.getCartBookableDates = async function (req, res) {
  const cartID = req.body.cartID;
  const locationID = req.body.locationID;
  const tz = req.body.timeZone;
  const limit = req.body.limit;
  const client_id = req.body.clientId;
  const searchRangeLower = req.body.searchRangeLower;
  const searchRangeUpper = req.body.searchRangeUpper;

  var returnObj = {
    status: "error",
    message: "Something went wrong",
    data: -1,
  };
  // id: "urn:blvd:Cart:bf72d783-2f95-4e73-b5e7-f405d154546a" locationId:"urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0" limit: 8
  const gql = {
    query: `query cartBookableDates($id:ID!, $locationId:ID, $limit:Int, $tz:Tz, $searchRangeLower:Date, $searchRangeUpper:Date){
      cartBookableDates(id:$id  locationId:$locationId limit: $limit, tz:$tz, searchRangeLower:$searchRangeLower, searchRangeUpper:$searchRangeUpper){
          date
      }
    }`,
    variables:{
      id:cartID,
      locationID:locationID,
      limit:limit,
      tz:tz,
      searchRangeLower:searchRangeLower,
      searchRangeUpper:searchRangeUpper
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

exports.getCartStaffVariants = async function (req, res) {
  const cartId = req.body.cartId;
  const bookableTimeId = req.body.bookableTimeId;
  const serviceId = req.body.serviceId;
  const locationId = req.body.locationId;
  const client_id = req.body.clientId;


  // {locationId:"urn:blvd:Location:0d3803fd-52aa-4d65-9828-78613f9f73f0"}

  const gql = {
    query: `query cartBookableStaffVariants($bookableTimeId:ID!, $id:ID!, $itemId:ID!, $locationId:ID){
      cartBookableStaffVariants(bookableTimeId:$bookableTimeId, id:$id, itemId:$itemId, locationId:$locationId) {
        id
        duration
        price
        staff{
          id
          displayName
        }
      }
    }`,
  variables:{
    "bookableTimeId":bookableTimeId,
    "id":cartId,
    "itemId":serviceId,
    "locationId":locationId
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
              id
              name
              availableItems{
                id
                name
                description
                listPrice
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
                  staffVariants{
                    duration
                    id
                    price
                    staff{
                      id
                      displayName
                    }
                  }
                }
              }
            }
            id
            clientMessage
            expiresAt
            startTime
            startTimeId
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
              lineTotal
              price
              selectedPaymentMethod{
                id
                name
                ...on CartItemCardPaymentMethod{
                  cardBrand
                  cardExpMonth
                  cardExpYear
                  cardHolder
                  cardIsDefault
                  cardLast4
                  id
                  name
                }
              }
              ...on CartBookableItem {
                selectedStaffVariant{
                  duration
                  id
                  price
                  staff{
                    id
                    displayName
                  }
                }
                guest{
                  email
                  firstName
                  id
                  label
                  lastName
                  number
                  phoneNumber
                }
                guestId
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
                ...on CartAvailableBookableItem{
                  optionGroups{
                    id
                    name
                    description
                    options{
                      id
                      name
                      description
                      durationDelta
                      priceDelta
                    }
                  }
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
            availablePaymentMethods{
              id
              name
              ...on CartItemCardPaymentMethod{
                cardBrand
                cardExpMonth
                cardExpYear
                cardHolder
                cardIsDefault
                cardLast4
                id
                name
              }
              ...on CartItemVoucherPaymentMethod{
                availableCount
                expiresOn
                id
                name
              }
            }
            offers{
              applied
              code
              id
              name
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
              address{
                city
                country
                line1
                line2
                province
                state
                zip
              }
              arrivalInstructions
              avatar
              businessName
              coordinates
              id
              name
              phoneNumber
              website
              contactEmail
              social{
                facebook
                google
                instagram
                pinterest
                twitter
                yelp
                youtube
              }
              tz
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
              ...on CartAvailableBookableItem{
                optionGroups{
                  id
                  name
                  description
                  options{
                    id
                    name
                    description
                    durationDelta
                    priceDelta
                  }
                }
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

exports.updateIteminCart = async function (req, res) {
  const cartID = req.body.cartId;
  const itemGuestId = req.body.itemGuestId;
  const itemId = req.body.itemId;
  const itemOptionIds = req.body.itemOptionIds;
  const itemStaffVariantId = req.body.itemStaffVariantId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation updateCartSelectedBookableItem($input:AddCartSelectedBookableItemInput!){
      updateCartSelectedBookableItem(input:$input){
        cart{
          id
          expiresAt
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
              ...on CartAvailableBookableItem{
                optionGroups{
                  id
                  name
                  description
                  options{
                    id
                    name
                    description
                    durationDelta
                    priceDelta
                  }
                }
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

exports.addProductinCart = async function (req, res) {
  const cartID = req.body.cartId;
  const itemDiscountCode = req.body.itemDiscountCode;
  const itemId = req.body.itemId;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation addCartSelectedPurchasableItem($input:AddCartSelectedPurchasableItemInput!){
      addCartSelectedPurchasableItem(input:$input){
        cart{
          id
          expiresAt
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
              ...on CartAvailableBookableItem{
                optionGroups{
                  id
                  name
                  description
                  options{
                    id
                    name
                    description
                    durationDelta
                    priceDelta
                  }
                }
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
      }
    }`,
    variables:{
      input:{
        "id":cartID,
        "itemDiscountCode":itemDiscountCode,
        "itemId":itemId
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
  const clientNote = req.body.clientNote;
  const client_id = req.body.clientId;

  const gql = {
    query: `mutation updateCart($input:UpdateCartInput!){
      updateCart(input:$input){
        cart{
          id
          clientMessage
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
        "clientInformation":clientInfo,
        "clientMessage":clientNote
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
          availablePaymentMethods{
            id
            name
            ...on CartItemCardPaymentMethod{
              cardBrand
              cardExpMonth
              cardExpYear
              cardHolder
              cardIsDefault
              cardLast4
              id
              name
            }
            ...on CartItemVoucherPaymentMethod{
              availableCount
              expiresOn
              id
              name
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
        appointments{
          appointmentId
          clientId
          forCartOwner
        }
        cart{
          availableCategories{
            id
            name
            availableItems{
              id
              name
              description
              listPrice
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
                staffVariants{
                  duration
                  id
                  price
                  staff{
                    id
                    displayName
                  }
                }
              }
            }
          }
          id
          clientMessage
          expiresAt
          startTime
          startTimeId
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
            lineTotal
            price
            selectedPaymentMethod{
              id
              name
              ...on CartItemCardPaymentMethod{
                cardBrand
                cardExpMonth
                cardExpYear
                cardHolder
                cardIsDefault
                cardLast4
                id
                name
              }
            }
            ...on CartBookableItem {
              selectedStaffVariant{
                duration
                id
                price
                staff{
                  id
                  displayName
                }
              }
              guest{
                email
                firstName
                id
                label
                lastName
                number
                phoneNumber
              }
              guestId
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
              ...on CartAvailableBookableItem{
                optionGroups{
                  id
                  name
                  description
                  options{
                    id
                    name
                    description
                    durationDelta
                    priceDelta
                  }
                }
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
          availablePaymentMethods{
            id
            name
            ...on CartItemCardPaymentMethod{
              cardBrand
              cardExpMonth
              cardExpYear
              cardHolder
              cardIsDefault
              cardLast4
              id
              name
            }
            ...on CartItemVoucherPaymentMethod{
              availableCount
              expiresOn
              id
              name
            }
          }
          offers{
            applied
            code
            id
            name
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
            address{
              city
              country
              line1
              line2
              province
              state
              zip
            }
            arrivalInstructions
            avatar
            businessName
            coordinates
            id
            name
            phoneNumber
            website
            contactEmail
            social{
              facebook
              google
              instagram
              pinterest
              twitter
              yelp
              youtube
            }
            tz
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

exports.takeCartOwnership = async function (req, res) {
  const client_id = req.body.clientId;
  const cartId = req.body.cartId;


  const gql = {
    query: `mutation takeCartOwnership($input:TakeCartOwnershipInput!){
      takeCartOwnership(input:$input){
        cart{
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
      }
    }`,
    variables:{
      input:{
        "id":cartId
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.selectCartPaymentMethod = async function (req, res) {
  const client_id = req.body.clientId;
  const cartId = req.body.cartId;
  const paymentMethodId = req.body.paymentMethodId;


  const gql = {
    query: `mutation selectCartPaymentMethod($input:SelectCartPaymentMethodInput!){
      selectCartPaymentMethod(input:$input){
        cart{
          id
          availablePaymentMethods{
            id
            name
            ...on CartItemCardPaymentMethod{
              cardBrand
              cardExpMonth
              cardExpYear
              cardHolder
              cardIsDefault
              cardLast4
              id
              name
            }
            ...on CartItemVoucherPaymentMethod{
              availableCount
              expiresOn
              id
              name
            }
          }
        }
      }
    }`,
    variables:{
      input:{
        "id":cartId,
        "paymentMethodId":paymentMethodId
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

// DASHBOARD ENDPOINTS
exports.updateClient = async function (req, res) {
  const client_id = req.body.clientId;
  const client = req.body.client;

  const gql = {
    query: `mutation updateClient($input:UpdateClientInput!){
      updateClient(input:$input){
        client{
          id
          firstName
          lastName
          name
          pronoun
          email
          mobilePhone
          updatedAt
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
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.myAppointments = async function (req, res) {
  const client_id = req.body.clientId;

  const gql = {
    query: `{
      myAppointments(first:20 query:"cancelled=false"){
        edges{
          node{
            appointmentServiceOptions{
              appointmentServiceId
              durationDelta
              finishDurationDelta
              id
              postClientDurationDelta
              postStaffDurationDelta
              priceDelta
              serviceOptionId
            }
            appointmentServices{
              duration
              endAt
              price
              service{
                category{
                  name
                }
                categoryId
                description
                externalId
                id
                name
              }
              serviceId
              staff{
                avatar
                bio
                displayName
                firstName
                id
                lastName
                nickname
                role{
                  id
                  name
                }
              }
              staffId
              staffRequested
              startAt
              startTimeOffset
              totalDuration
            }
            calendarLinks{
              googleCalendar
              icsDownload
              microsoftOffice
              microsoftOutlook
              yahooCalendar
            }
            cancellable
            cancelled
            client{
              id
              email
              firstName
              lastName
              mobilePhone
              pronoun
            }
            clientId
            creditCards{
              brand
              expMonth
              expYear
              last4
            }
            duration
            endAt
            id
            location{
              address{
                city
                country
                line1
                line2
                province
                state
                zip
              }
              arrivalInstructions
              avatar
              businessName
              coordinates
              id
              name
              phoneNumber
              website
              contactEmail
              social{
                facebook
                google
                instagram
                pinterest
                twitter
                yelp
                youtube
              }
              tz
            }
            locationId
            notes
            reschedulable
            startAt
            state
          }
        }
      }
    }`
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.appointmentDetail = async function (req, res) {
  const client_id = req.body.clientId;
  const cartId = req.body.cartId;
  const appointmentId = req.body.appointmentId;

  const gql = {
    query: `query($cartId:ID, $appointmentId:ID!) {
      appointment(cartId:$cartId id:$appointmentId){
        startAt
        appointmentServiceOptions{
          appointmentServiceId
          durationDelta
          finishDurationDelta
          id
          postClientDurationDelta
          postStaffDurationDelta
          priceDelta
          serviceOptionId
        }
        appointmentServices{
          duration
          endAt
          price
          service{
            category{
              name
            }
            categoryId
            description
            id
            name
          }
          serviceId
          staff{
            id
            displayName
          }
          staffId
          staffRequested
          startAt
          startTimeOffset
          totalDuration
        }
        calendarLinks{
          googleCalendar
          icsDownload
          microsoftOffice
          microsoftOutlook
          yahooCalendar
        }
        cancellable
        cancelled
        clientId
        createdAt
        creditCards{
          brand
          expMonth
          expYear
          last4
        }
        duration
        endAt
        id
        location{
          address{
            city
            country
            line1
            line2
            province
            state
            zip
          }
          arrivalInstructions
          avatar
          businessName
          name
          phoneNumber
          website
          contactEmail
          tz
          updatedAt
        }
      }
    }`,
    variables:{
      "cartId":cartId,
      "appointmentId":appointmentId
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.cancelAppointment = async function (req, res) {
  const client_id = req.body.clientId;
  const appointmentId = req.body.appointmentId;
  const notes = req.body.notes;

  const gql = {
    query: `mutation cancelAppointment($input:CancelAppointmentInput!){
      cancelAppointment(input:$input){
        appointment{
          id
          cancelled
          notes
        }
      }
    }`,
    variables:{
      input:{
        "id":appointmentId,
        "notes":notes
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.cartClear = async function (req, res) {
  const client_id = req.body.clientId;
  const cartId = req.body.cartId;

  const gql = {
    query: `mutation cartClear($input:cartClearInput!){
      cartClear(input:$input){
        cart{
          id
        }
      }
    }`,
    variables:{
      input:{
        "id":cartId,
      }
    }
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

exports.myMemberships = async function (req, res) {
  const client_id = req.body.clientId;

  const gql = {
    query: `{
        myMemberships(first:20){
        edges{
          node{
            client{
              id
              name
              email
              mobilePhone
            }
            clientId
            endOn
            id
            interval
            name
            startOn
            status
            termNumber
            vouchers{
              quantity
              services{
                id
                name
              }
            }
          }
        }
      }
    }`
  }
  const response = await fetchRequest(gql, client_id);

  res.json(response);
}

