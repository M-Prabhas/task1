const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Ensure you have `dotenv` installed and configured

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Freshworks CRM configuration
const FRESHWORKS_DOMAIN = 'self-751442558062400185.myfreshworks.com';
const API_KEY = process.env.FRESHWORKS_API_KEY; 


const API_URL = `https://${FRESHWORKS_DOMAIN}/crm/sales/api/contacts`;

// Placeholder for database (replace with actual database logic)
const database = [];

app.get('/', (req, res) => {
    res.send("hello world");
});

// Route to create a contact
app.post('/createContact', async (req, res) => {
    const { first_name, last_name, email, mobile_number, data_store } = req.body;

     
 
    const contactData = {
        contact: {
            first_name,
            last_name,
            email,
            mobile_number 
        }
    };

    try {
        if (data_store === 'CRM') {
            // Create contact in Freshworks CRM
            const response = await axios.post(API_URL, contactData, {
                headers: {
                    'Authorization': `Token token=${API_KEY}`, 
                    'Content-Type': 'application/json'
                }
            });
            res.json({
                message: 'Contact created in CRM successfully',
                data: response.data
            }); 
        } else if (data_store === 'DATABASE') {
            database.push(contactData.contact);
            res.json({
                message: 'Contact created in DATABASE successfully',
                data: contactData
            }); 
        }
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Failed to create contact',
            error: error
        }); 
    }
});

app.get("/getContact", async (req,res)=>{
     const {id,data_store}=req.body;
     contactId=process.env.ID;
     try{
        if(data_store==="CRM"){
            const response = await axios.get(`${API_URL}/view/${id}`,{
                headers: {
                    'Authorization': `Token token=${API_KEY}`, 
                    'Content-Type': 'application/json'
                }
            });
            res.json({
                message: 'Contact retrieved from CRM successfully',
                data: response.data
            });   
        }else if (data_store === 'DATABASE') {
            const contact = database.find(c => c.id=== contactId);
            if(contact){
                res.json({
                    message: ' contact entry of requested id',
                    data: contact
                });  
            }else{
                res.json({
                    message:"contact not present",
                })
            }
           
        }
     }catch(error){
        console.error(error);
        res.json({
            message: 'Failed to retrieve contact',
            error: error
        }); 
    }
});

app.post("/updateContact" , async (req,res)=>{
    const {id,data_store,mobile_number,email}=req.body;
    try{
        if (data_store === 'CRM') {
            // Update contact in Freshworks CRM
            const response = await axios.put(`${API_URL}/${id}`, { contact: { mobile_number, email } }, {
                headers: {
                    'Authorization': `Token token= ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            res.json({
                message: 'Contact updated in CRM successfully',
                data: response.data
            });
        }
}catch(error){
    console.log(error);
    res.json({
        message:"error occured or contact got deleted",
        error:error
    });
}

})

app.post('/deleteContact', async (req, res) => {
    const { id, data_store } = req.body; // 

   try {
        if (data_store === 'CRM') {
            // Send DELETE request to Freshworks CRM
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    'Authorization': `Token token=${API_KEY}`, 
                    'Content-Type': 'application/json'
                }
            });
            res.json({
                message: 'Contact deleted from CRM successfully',
                data: response.data
            });
        }
    }catch(error){
        console.log(error);
        res.json({
            message:"error occured",
            error:error
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
